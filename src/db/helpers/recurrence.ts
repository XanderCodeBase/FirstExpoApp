import { addDays, formatISO, startOfDay } from 'date-fns';
import { and, desc, eq, gte, lt } from 'drizzle-orm';
import { Frequency, RRule } from 'rrule';
import { v4 as uuidv4 } from 'uuid';

import { db } from '@/db';
import { recurrenceRules, taskOccurrences, tasks } from '@/db/schema';

export type RecurrenceRuleData = {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval?: number;
    days_of_week?: number[]; // [1,2,3,4,5] → Monday=1
    time_of_day: string; // "12:00:00"
    end_date?: string;
    count?: number;
};

// Helper to convert our schema to rrule options
function createRRule(rule: RecurrenceRuleData, startDate: Date) {
    const [hour, minute] = rule.time_of_day.split(':').map(Number);

    const options: Partial<RRule.Options> = {
        freq: {
            daily: Frequency.DAILY,
            weekly: Frequency.WEEKLY,
            monthly: Frequency.MONTHLY,
            yearly: Frequency.YEARLY,
        }[rule.frequency],
        interval: rule.interval || 1,
        dtstart: startDate,
        byhour: [hour],
        byminute: [minute],
        bysecond: [0],
    };

    if (rule.days_of_week && rule.days_of_week.length > 0) {
        options.byweekday = rule.days_of_week.map((d) => d - 1); // rrule uses 0=Sunday
    }

    if (rule.end_date) {
        options.until = new Date(rule.end_date);
    }
    if (rule.count) {
        options.count = rule.count;
    }

    return new RRule(options as RRule.Options);
}

// Generate occurrences between two dates
export async function generateOccurrences(
    taskId: string,
    ruleData: RecurrenceRuleData,
    fromDate: Date = new Date(),
    daysAhead: number = 30,
): Promise<string[]> {
    const start = startOfDay(fromDate);
    const until = addDays(start, daysAhead);

    const rrule = createRRule(ruleData, start);
    const dates = rrule.between(start, until, true); // inclusive

    return dates.map((date) => formatISO(date));
}

// Main function: Ensure occurrences exist for next N days
export async function ensureOccurrencesForTask(taskId: string, daysAhead: number = 45) {
    // Get task + recurrence rule
    const result = await db
        .select({
            taskId: tasks.id,
            rule: recurrenceRules,
        })
        .from(tasks)
        .innerJoin(recurrenceRules, eq(tasks.id, recurrenceRules.task_id))
        .where(eq(tasks.id, taskId))
        .limit(1);

    if (result.length === 0) return;

    const { rule } = result[0];

    // Delete very old completed occurrences (cleanup)
    await db
        .delete(taskOccurrences)
        .where(
            and(
                eq(taskOccurrences.task_id, taskId),
                eq(taskOccurrences.is_completed, true),
                lt(taskOccurrences.occurrence_date, addDays(new Date(), -7).toISOString()),
            ),
        );

    // Get last existing occurrence
    const lastOccurrence = await db
        .select({ occurrence_date: taskOccurrences.occurrence_date })
        .from(taskOccurrences)
        .where(eq(taskOccurrences.task_id, taskId))
        .orderBy(desc(taskOccurrences.occurrence_date))
        .limit(1);

    const fromDate =
        lastOccurrence.length > 0 ? new Date(lastOccurrence[0].occurrence_date) : new Date();

    const occurrenceDates = await generateOccurrences(
        taskId,
        {
            frequency: rule.frequency as any,
            interval: rule.interval ?? 1,
            days_of_week: rule.days_of_week ? JSON.parse(rule.days_of_week) : undefined,
            time_of_day: rule.time_of_day,
            end_date: rule.end_date || undefined,
            count: rule.count ?? undefined,
        },
        fromDate,
        daysAhead,
    );

    // Insert only new ones
    const existing = await db
        .select({ occurrence_date: taskOccurrences.occurrence_date })
        .from(taskOccurrences)
        .where(eq(taskOccurrences.task_id, taskId));

    const existingSet = new Set(existing.map((e) => e.occurrence_date));

    const toInsert = occurrenceDates
        .filter((date) => !existingSet.has(date))
        .map((date) => ({
            id: uuidv4(),
            task_id: taskId,
            occurrence_date: date,
            is_completed: false,
        }));

    if (toInsert.length > 0) {
        await db.insert(taskOccurrences).values(toInsert);
        console.log(`✅ Generated ${toInsert.length} new occurrences for task ${taskId}`);
    }
}

// Get all upcoming tasks (great for notifications & today screen)
export async function getUpcomingTasks(daysAhead: number = 7) {
    const start = new Date().toISOString();
    const end = addDays(new Date(), daysAhead).toISOString();

    return db
        .select({
            occurrenceId: taskOccurrences.id,
            taskId: tasks.id,
            title: tasks.title,
            occurrenceDate: taskOccurrences.occurrence_date,
            isCompleted: taskOccurrences.is_completed,
            notes: taskOccurrences.notes,
            customTitle: taskOccurrences.custom_title,
            priority: tasks.priority,
        })
        .from(taskOccurrences)
        .innerJoin(tasks, eq(taskOccurrences.task_id, tasks.id))
        .where(
            and(
                gte(taskOccurrences.occurrence_date, start),
                lt(taskOccurrences.occurrence_date, end),
                eq(taskOccurrences.is_completed, false),
            ),
        )
        .orderBy(taskOccurrences.occurrence_date);
}
