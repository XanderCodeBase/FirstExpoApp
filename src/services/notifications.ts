import { addDays } from 'date-fns';
import { and, eq, gte, lte } from 'drizzle-orm';
import * as Notifications from 'expo-notifications';

import { db } from '@/db';
import { recurrenceRules, taskOccurrences, tasks } from '@/db/schema';
import { TaskWithOccurrence } from '@/db/types';

// Cancel notification for a specific occurrence
export async function cancelTaskNotification(occurrenceId: string) {
    try {
        await Notifications.cancelScheduledNotificationAsync(occurrenceId);
    } catch (e) {
        console.log('Failed to cancel notification:', e);
    }
}

// Cancel all notifications
export async function cancelAllNotifications() {
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (e) {
        console.error('Failed to cancel all notifications:', e);
    }
}

// Fetch upcoming tasks with proper joins (matches TaskWithOccurrence)
export async function fetchUpcomingTasksFromDB(
    daysAhead: number = 7,
): Promise<TaskWithOccurrence[]> {
    const now = new Date().toISOString();
    const futureDate = addDays(new Date(), daysAhead).toISOString();

    const raw = await db
        .select({
            occurrenceId: taskOccurrences.id,
            taskId: tasks.id,
            title: tasks.title,
            description: tasks.description,
            occurrenceDate: taskOccurrences.occurrence_date,
            isCompleted: taskOccurrences.is_completed,
            completedAt: taskOccurrences.completed_at,
            priority: tasks.priority,
            notes: taskOccurrences.notes,
            customTitle: taskOccurrences.custom_title,
            customTime: taskOccurrences.custom_time,
            isRecurringRaw: recurrenceRules.id,
        })
        .from(taskOccurrences)
        .innerJoin(tasks, eq(taskOccurrences.task_id, tasks.id))
        .leftJoin(recurrenceRules, eq(tasks.id, recurrenceRules.task_id))
        .where(
            and(
                gte(taskOccurrences.occurrence_date, now),
                lte(taskOccurrences.occurrence_date, futureDate),
                eq(taskOccurrences.is_completed, false),
            ),
        )
        .orderBy(taskOccurrences.occurrence_date);

    return raw.map((item) => ({
        ...item,
        isCompleted: !!item.isCompleted,
        isRecurring: !!item.isRecurringRaw,
    }));
}

// Schedule notification for a single task occurrence
export async function scheduleTaskNotification(task: TaskWithOccurrence) {
    // Cancel any existing notification for this occurrence
    await cancelTaskNotification(task.occurrenceId);

    const triggerDate = new Date(task.occurrenceDate);
    const now = new Date();

    const title = task.customTitle || task.title;
    const body = task.notes ? `${title} - ${task.notes}` : title;

    try {
        if (triggerDate <= now) {
            // Immediate notification
            await Notifications.scheduleNotificationAsync({
                identifier: task.occurrenceId,
                content: {
                    title: '🔔 Task Reminder',
                    body: body,
                    data: {
                        taskId: task.taskId,
                        occurrenceId: task.occurrenceId,
                        screen: 'task-detail',
                    },
                },
                trigger: null,
            });
        } else {
            // Scheduled notification
            await Notifications.scheduleNotificationAsync({
                identifier: task.occurrenceId,
                content: {
                    title: '🔔 Upcoming Task',
                    body: body,
                    subtitle: triggerDate.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                    data: {
                        taskId: task.taskId,
                        occurrenceId: task.occurrenceId,
                        screen: 'task-detail',
                    },
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                    date: triggerDate,
                },
            });
        }
    } catch (error) {
        console.error('Failed to schedule notification:', error);
    }
}

// Reschedule all upcoming notifications (call this daily via background task)
export async function rescheduleAllNotifications() {
    try {
        await cancelAllNotifications();
        console.log('Cancelled all previous notifications');

        const upcomingTasks = await fetchUpcomingTasksFromDB(7); // Next 7 days

        console.log(`Scheduling ${upcomingTasks.length} notifications...`);

        for (const task of upcomingTasks) {
            await scheduleTaskNotification(task);
        }

        console.log('✅ All notifications rescheduled successfully');
    } catch (error) {
        console.error('Failed to reschedule notifications:', error);
    }
}
