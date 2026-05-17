import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

import { db } from '@/db';
import { recurrenceRules, taskOccurrences, tasks } from '@/db/schema';
import { TaskWithOccurrence } from '@/db/types';
import { rescheduleAllNotifications } from '@/services/notifications';

import { ensureOccurrencesForTask } from '../helpers/recurrence';
import { getAllTasks, getTaskById, getTasksForDate } from '../helpers/taskQueries';

export function useAllTasks() {
    return useQuery({
        queryKey: ['tasks', 'all'],
        queryFn: getAllTasks,
    });
}

export function useTasksForDate(date: Date) {
    return useQuery({
        queryKey: ['tasks', date.toISOString().split('T')[0]],
        queryFn: () => getTasksForDate(date),
    });
}

export function useTaskDetail(id: string) {
    return useQuery({
        queryKey: ['task', id],
        queryFn: async () => getTaskById(id),
        enabled: !!id,
    });
}

// Create Task Mutation
export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newTask: {
            title: string;
            description?: string;
            start_date?: string;
            due_date?: string;
            life_domains?: string;
            priority?: number;
            is_recurring?: boolean;
            frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
            interval?: number;
            days_of_week?: number[];
            time_of_day?: string;
            end_date?: string;
        }) => {
            const taskId = uuidv4();
            const now = new Date().toISOString();

            // 1. Create Master Task
            await db.insert(tasks).values({
                id: taskId,
                title: newTask.title.trim(),
                description: newTask.description?.trim() || null,
                start_date: newTask.start_date || null,
                life_domains: newTask.life_domains || null,
                priority: newTask.priority || 0,
                position: Date.now(),
                created_at: now,
                updated_at: now,
            });

            // 2. Create Recurrence Rule (if recurring)
            if (newTask.is_recurring) {
                await db.insert(recurrenceRules).values({
                    id: uuidv4(),
                    task_id: taskId,
                    frequency: newTask.frequency!,
                    interval: newTask.interval || 1,
                    days_of_week:
                        newTask.days_of_week && newTask.days_of_week.length > 0
                            ? JSON.stringify(newTask.days_of_week)
                            : null,
                    time_of_day: newTask.time_of_day || '12:00:00',
                    end_date: newTask.end_date || null,
                    created_at: now,
                    updated_at: now,
                });
            }

            // 3. Create Initial Occurrence
            const occurrenceDate = newTask.is_recurring
                ? newTask.start_date || now
                : newTask.due_date || newTask.start_date || now;

            await db.insert(taskOccurrences).values({
                id: uuidv4(),
                task_id: taskId,
                occurrence_date: occurrenceDate,
                is_completed: false,
            });

            // 4. Generate future occurrences if recurring
            if (newTask.is_recurring) {
                await ensureOccurrencesForTask(taskId, 60);
            }

            return taskId;
        },

        onSuccess: () => onSuccess(queryClient),
        onError: (error) => console.error('Failed to create task:', error),
    });
}

// Delete Task Occurrences mutation
export function useDeleteTaskOccurrence() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (occurrenceId: string) => {
            await db.delete(taskOccurrences).where(eq(taskOccurrences.id, occurrenceId));
        },
        onSuccess: () => onSuccess(queryClient),
        onError: (error) => console.error('Failed to delete task:', error),
    });
}

// Toggle Complete mutation
export function useToggleTaskCompletion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (task: TaskWithOccurrence) => {
            await db
                .update(taskOccurrences)
                .set({
                    is_completed: !task.isCompleted,
                    completed_at: !task.isCompleted ? new Date().toISOString() : null,
                })
                .where(eq(taskOccurrences.id, task.occurrenceId));
        },
        onSuccess: () => onSuccess(queryClient),
        onError: (error) => console.error('Failed to update task:', error),
    });
}

async function onSuccess(queryClient: QueryClient) {
    await queryClient.invalidateQueries({ queryKey: ['tasks'] });
    await rescheduleAllNotifications();
}
