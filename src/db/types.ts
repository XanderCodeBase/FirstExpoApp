import type { recurrenceRules, taskOccurrences, tasks } from './schema';

// Base types
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;

export type RecurrenceRule = typeof recurrenceRules.$inferSelect;
export type NewRecurrenceRule = typeof recurrenceRules.$inferInsert;

export type TaskOccurrence = typeof taskOccurrences.$inferSelect;
export type NewTaskOccurrence = typeof taskOccurrences.$inferInsert;

// Extended / Relation types (very useful)
export type TaskWithRelations = Task & {
    recurrenceRule?: RecurrenceRule | null;
    occurrences?: TaskOccurrence[];
};

export type TaskOccurrenceWithTask = TaskOccurrence & {
    task: Task;
};

// You can add more complex ones later
export type TaskWithNextOccurrence = Task & {
    nextOccurrence?: TaskOccurrence | null;
};

// Extended types
export type TaskWithOccurrence = {
    occurrenceId: string;
    taskId: string;
    title: string;
    description?: string | null;
    lifeDomains?: string | null;
    occurrenceDate: string;
    isCompleted: boolean;
    completedAt?: string | null;
    priority: number | null;
    notes?: string | null;
    customTitle?: string | null;
    customTime?: string | null;
    isRecurring: boolean;
};
