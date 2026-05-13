import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { openDatabaseSync } from 'expo-sqlite';

import migrations from '@/drizzle/migrations';

import * as schema from './schema';

const expoDb = openDatabaseSync('tasks.db', { enableChangeListener: true });

export const db = drizzle(expoDb, { schema });

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
    const { success, error } = useMigrations(db, migrations);

    if (error) {
        console.error('Migration error:', error);
        return null;
    }

    if (!success) {
        return null; // You can show a "Setting up database..." screen here later
    }

    return <>{children}</>;
}
