import { and, eq, gte } from 'drizzle-orm';
import * as Notifications from 'expo-notifications';

import { db } from '@/db';
import { tasks } from '@/db/schema';
import { Task } from '@/types/Task';

export async function scheduleTaskNotification(task: Task) {
    // Cancel previous notification for this task
    await cancelTaskNotification(task.id);

    const start = new Date(task.start_date || '');
    const now = new Date();

    if (start <= now) {
        // Immediate notification
        await Notifications.scheduleNotificationAsync({
            identifier: task.id,
            content: {
                title: 'Task Started! 🚀',
                body: task.title,
                data: { taskId: task.id, screen: 'task-detail' },
            },
            trigger: null, // immediate
        });
        return;
    }

    await Notifications.scheduleNotificationAsync({
        identifier: task.id,
        content: {
            title: 'Time to Start Your Task',
            body: task.title,
            subtitle: task.description?.slice(0, 60),
            data: { taskId: task.id, screen: 'task-detail' },
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: start,
        },
    });
}

export async function cancelTaskNotification(taskId: string) {
    await Notifications.cancelScheduledNotificationAsync(taskId);
}

export async function cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function fetchUpcomingTasksFromDB() {
    const now = new Date().toISOString();

    const data = await db
        .select()
        .from(tasks)
        .where(and(gte(tasks.start_date, now), eq(tasks.is_completed, false)));

    return data || [];
}

export async function rescheduleAllNotifications() {
    await cancelAllNotifications();
    const tasks = await fetchUpcomingTasksFromDB();
    for (const task of tasks) {
        await scheduleTaskNotification(task);
    }
}
