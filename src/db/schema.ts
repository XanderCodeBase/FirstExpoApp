import { sql } from 'drizzle-orm';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const tasks = sqliteTable('tasks', {
    id: text('id').primaryKey(), // UUID string
    title: text('title').notNull(),
    description: text('description'),
    is_completed: integer('is_completed', { mode: 'boolean' }).default(false),
    due_date: text('due_date'), // ISO string
    start_date: text('start_date'),
    life_domains: text('life_domains'), // comma-separated or JSON
    priority: integer('priority').default(0),
    position: real('position').default(0), // for ordering
    user_id: text('user_id').notNull(),
    created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
    updated_at: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
});
