import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/db/schema.ts', // ← Important: point to src
    out: './src/drizzle', // migrations will go inside src/drizzle
    dialect: 'sqlite',
    driver: 'expo',
});
