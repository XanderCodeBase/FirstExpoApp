import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { v4 as uuidv4 } from 'uuid';

import { db } from '@/db';
import { tasks } from '@/db/schema';

const seed = async () => {
    const values = Array.from({ length: 20 }, (_, i) => ({
        id: uuidv4(),
        title: `Task ${i + 1}`,
        description: `Seeded task ${i + 1}`,
        is_completed: false,
        due_date: new Date().toISOString(),
        start_date: new Date().toISOString(),
        life_domains: 'seed',
        priority: 1,
        position: i,
        user_id: 'local-user',
    }));

    await db.insert(tasks).values(values);
};

export default function DebugDB() {
    const [usersData, setUsersData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);

            const result = await db.select().from(tasks);

            setUsersData(result);
        } catch (err) {
            console.log('DB Debug Error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>🛠 Database Debug</Text>

            <Pressable style={styles.button} onPress={seed}>
                <Text style={styles.buttonText}>Seed 20 Tasks</Text>
            </Pressable>

            <Pressable
                style={styles.button}
                onPress={async () => {
                    await db.delete(tasks);
                    console.log('Tasks cleared');
                }}
            >
                <Text style={styles.buttonText}>Clear Tasks</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={loadData}>
                <Text style={styles.buttonText}>{loading ? 'Refreshing...' : 'Refresh Data'}</Text>
            </Pressable>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Users Table</Text>
                <Text style={styles.count}>Rows: {usersData.length}</Text>

                <View style={styles.box}>
                    <Text style={styles.json}>{JSON.stringify(usersData, null, 2)}</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 80,
        backgroundColor: '#0b0b0b',
        flexGrow: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: 'white',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#2563eb',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: '600',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
        marginBottom: 6,
    },
    count: {
        color: '#a1a1aa',
        marginBottom: 10,
    },
    box: {
        backgroundColor: '#111827',
        padding: 12,
        borderRadius: 8,
    },
    json: {
        color: '#d1d5db',
        fontSize: 12,
    },
});
