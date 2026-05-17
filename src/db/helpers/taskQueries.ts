// src/db/helpers/taskQueries.ts
import { addDays, endOfDay, startOfDay } from 'date-fns';
import { and, asc, desc, eq, gte, lte } from 'drizzle-orm';

import { db } from '@/db';
import { recurrenceRules, taskOccurrences, tasks } from '@/db/schema';
import { TaskWithOccurrence } from '@/db/types';

export async function getTaskById(id: string): Promise<TaskWithOccurrence | null> {
    const result = await db
        .select({
            occurrenceId: taskOccurrences.id,
            taskId: tasks.id,
            title: tasks.title,
            description: tasks.description,
            lifeDomains: tasks.life_domains,
            occurrenceDate: taskOccurrences.occurrence_date,
            isCompleted: taskOccurrences.is_completed,
            completedAt: taskOccurrences.completed_at,
            priority: tasks.priority,
            notes: taskOccurrences.notes,
            customTitle: taskOccurrences.custom_title,
            customTime: taskOccurrences.custom_time,
            isRecurring: recurrenceRules.id,
        })
        .from(taskOccurrences)
        .innerJoin(tasks, eq(taskOccurrences.task_id, tasks.id))
        .leftJoin(recurrenceRules, eq(tasks.id, recurrenceRules.task_id))
        .where(eq(taskOccurrences.id, id))
        .limit(1);

    const item = result[0];

    if (!item) return null;

    return {
        ...item,
        isCompleted: Boolean(item.isCompleted),
        isRecurring: item.isRecurring !== null,
    };
}

export async function getAllTasks(): Promise<TaskWithOccurrence[]> {
    const result = await db
        .select({
            occurrenceId: taskOccurrences.id,
            taskId: tasks.id,
            title: tasks.title,
            description: tasks.description,
            lifeDomains: tasks.life_domains,
            occurrenceDate: taskOccurrences.occurrence_date,
            isCompleted: taskOccurrences.is_completed,
            completedAt: taskOccurrences.completed_at,
            priority: tasks.priority,
            notes: taskOccurrences.notes,
            customTitle: taskOccurrences.custom_title,
            customTime: taskOccurrences.custom_time,
            isRecurring: recurrenceRules.id,
        })
        .from(taskOccurrences)
        .innerJoin(tasks, eq(taskOccurrences.task_id, tasks.id))
        .leftJoin(recurrenceRules, eq(tasks.id, recurrenceRules.task_id))
        .orderBy(desc(taskOccurrences.occurrence_date));

    // Map to our clean type
    return result.map((item) => ({
        ...item,
        isCompleted: !!item.isCompleted, // Convert string | null → boolean
        isRecurring: !!item.isRecurring, // Convert string | null → boolean
    }));
}

export async function getTasksForDate(date: Date): Promise<TaskWithOccurrence[]> {
    const start = startOfDay(date).toISOString();
    const end = endOfDay(date).toISOString();

    const result = await db
        .select({
            occurrenceId: taskOccurrences.id,
            taskId: tasks.id,
            title: tasks.title,
            description: tasks.description,
            lifeDomains: tasks.life_domains,
            occurrenceDate: taskOccurrences.occurrence_date,
            isCompleted: taskOccurrences.is_completed,
            completedAt: taskOccurrences.completed_at,
            priority: tasks.priority,
            notes: taskOccurrences.notes,
            customTitle: taskOccurrences.custom_title,
            customTime: taskOccurrences.custom_time,
            isRecurring: recurrenceRules.id,
        })
        .from(taskOccurrences)
        .innerJoin(tasks, eq(taskOccurrences.task_id, tasks.id))
        .leftJoin(recurrenceRules, eq(tasks.id, recurrenceRules.task_id))
        .where(
            and(
                gte(taskOccurrences.occurrence_date, start),
                lte(taskOccurrences.occurrence_date, end),
            ),
        )
        .orderBy(asc(taskOccurrences.occurrence_date));

    // Map to our clean type
    return result.map((item) => ({
        ...item,
        isCompleted: !!item.isCompleted, // Convert string | null → boolean
        isRecurring: !!item.isRecurring, // Convert string | null → boolean
    }));
}

export async function getUpcomingTasks(daysAhead: number = 7): Promise<TaskWithOccurrence[]> {
    const start = new Date().toISOString();
    const end = addDays(new Date(), daysAhead).toISOString();

    const result = await db
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
            isRecurring: recurrenceRules.id,
        })
        .from(taskOccurrences)
        .innerJoin(tasks, eq(taskOccurrences.task_id, tasks.id))
        .leftJoin(recurrenceRules, eq(tasks.id, recurrenceRules.task_id))
        .where(
            and(
                gte(taskOccurrences.occurrence_date, start),
                lte(taskOccurrences.occurrence_date, end),
            ),
        )
        .orderBy(asc(taskOccurrences.occurrence_date));

    return result.map((item) => ({
        ...item,
        isCompleted: !!item.isCompleted, // Convert string | null → boolean
        isRecurring: !!item.isRecurring, // Convert string | null → boolean
    }));
}
