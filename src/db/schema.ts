import { relations, sql } from 'drizzle-orm';
import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// ==================== MASTER TASKS ====================
export const tasks = sqliteTable(
    'tasks',
    {
        id: text('id').primaryKey(),
        title: text('title').notNull(),
        description: text('description'),

        start_date: text('start_date'), // Reference start for recurring tasks
        life_domains: text('life_domains'),
        priority: integer('priority').default(0),
        position: real('position').default(0),

        created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
        updated_at: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
    },
    (t) => ({
        titleIdx: index('idx_tasks_title').on(t.title),
    }),
);

// ==================== RECURRENCE RULES ====================
export const recurrenceRules = sqliteTable(
    'recurrence_rules',
    {
        id: text('id').primaryKey(),
        task_id: text('task_id')
            .notNull()
            .unique()
            .references(() => tasks.id, { onDelete: 'cascade' }),

        frequency: text('frequency').notNull(),
        interval: integer('interval').default(1),

        days_of_week: text('days_of_week'), // JSON string "[1,2,3,4,5]"
        day_of_month: integer('day_of_month'),
        week_of_month: integer('week_of_month'),

        time_of_day: text('time_of_day').notNull(),
        end_date: text('end_date'),
        count: integer('count'),

        created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
        updated_at: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
    },
    (t) => ({
        taskIdx: index('idx_recurrence_task').on(t.task_id),
    }),
);

// ==================== TASK OCCURRENCES (Main table for most screens) ====================
export const taskOccurrences = sqliteTable(
    'task_occurrences',
    {
        id: text('id').primaryKey(),
        task_id: text('task_id')
            .notNull()
            .references(() => tasks.id, { onDelete: 'cascade' }),

        occurrence_date: text('occurrence_date').notNull(),

        // Instance-specific fields
        is_completed: integer('is_completed', { mode: 'boolean' }).default(false),
        completed_at: text('completed_at'),
        notes: text('notes'),

        custom_title: text('custom_title'),
        custom_time: text('custom_time'),

        created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
        updated_at: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
    },
    (t) => ({
        taskDateIdx: index('idx_occurrences_task_date').on(t.task_id, t.occurrence_date),
        dateIdx: index('idx_occurrences_date').on(t.occurrence_date),
        completedIdx: index('idx_occurrences_completed').on(t.is_completed),
    }),
);

// ==================== RELATIONS ====================
export const tasksRelations = relations(tasks, ({ one, many }) => ({
    recurrenceRule: one(recurrenceRules),
    occurrences: many(taskOccurrences),
}));

export const recurrenceRulesRelations = relations(recurrenceRules, ({ one }) => ({
    task: one(tasks),
}));

export const taskOccurrencesRelations = relations(taskOccurrences, ({ one }) => ({
    task: one(tasks),
}));
