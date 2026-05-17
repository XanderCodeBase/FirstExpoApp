import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { v4 as uuidv4 } from 'uuid';

import { db } from '@/db';
import { recurrenceRules, taskOccurrences, tasks } from '@/db/schema';

const seed = async () => {
    const values = Array.from({ length: 10 }, (_, i) => ({
        id: uuidv4(),
        title: `Debug Task ${i + 1}`,
        description: `This is a seeded debug task ${i + 1}`,
        start_date: new Date(Date.now() - i * 86400000).toISOString(),
        life_domains: 'health',
        priority: Math.floor(Math.random() * 4),
        position: i,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }));

    await db.insert(tasks).values(values);
    console.log('✅ Seeded 10 tasks');
};

export default function DebugDB() {
    const [data, setData] = useState({
        tasks: [] as any[],
        recurrenceRules: [] as any[],
        taskOccurrences: [] as any[],
    });

    const [loading, setLoading] = useState(false);

    const loadAllData = useCallback(async () => {
        try {
            setLoading(true);

            const [tasksData, rulesData, occurrencesData] = await Promise.all([
                db.select().from(tasks).orderBy(tasks.created_at),
                db.select().from(recurrenceRules),
                db.select().from(taskOccurrences).orderBy(taskOccurrences.occurrence_date),
            ]);

            setData({
                tasks: tasksData,
                recurrenceRules: rulesData,
                taskOccurrences: occurrencesData,
            });

            console.log(
                `Loaded: ${tasksData.length} tasks, ${rulesData.length} rules, ${occurrencesData.length} occurrences`,
            );
        } catch (err) {
            console.error('DB Debug Error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAllData();
    }, [loadAllData]);

    const clearAll = async () => {
        await Promise.all([
            db.delete(taskOccurrences),
            db.delete(recurrenceRules),
            db.delete(tasks),
        ]);
        console.log('🗑️ All tables cleared');
        loadAllData();
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>🛠 Database Debug</Text>

            <View style={styles.buttonRow}>
                <Pressable style={styles.button} onPress={seed}>
                    <Text style={styles.buttonText}>Seed Tasks</Text>
                </Pressable>

                <Pressable
                    style={[styles.button, { backgroundColor: '#ef4444' }]}
                    onPress={clearAll}
                >
                    <Text style={styles.buttonText}>Clear All</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={loadAllData}>
                    <Text style={styles.buttonText}>{loading ? 'Refreshing...' : 'Refresh'}</Text>
                </Pressable>
            </View>

            {/* Tasks Table */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>📋 Tasks ({data.tasks.length})</Text>
                <View style={styles.box}>
                    <Text style={styles.json}>{JSON.stringify(data.tasks, null, 2)}</Text>
                </View>
            </View>

            {/* Recurrence Rules */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                    🔄 Recurrence Rules ({data.recurrenceRules.length})
                </Text>
                <View style={styles.box}>
                    <Text style={styles.json}>{JSON.stringify(data.recurrenceRules, null, 2)}</Text>
                </View>
            </View>

            {/* Task Occurrences */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                    📅 Task Occurrences ({data.taskOccurrences.length})
                </Text>
                <View style={styles.box}>
                    <Text style={styles.json}>{JSON.stringify(data.taskOccurrences, null, 2)}</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 100,
        backgroundColor: '#0b0b0b',
        flexGrow: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: 'white',
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 24,
    },
    button: {
        flex: 1,
        backgroundColor: '#2563eb',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
    },
    section: {
        marginBottom: 28,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#a5b4fc',
        marginBottom: 8,
    },
    box: {
        backgroundColor: '#1f2937',
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#374151',
    },
    json: {
        color: '#e0f2fe',
        fontSize: 11,
        fontFamily: 'monospace',
    },
});
