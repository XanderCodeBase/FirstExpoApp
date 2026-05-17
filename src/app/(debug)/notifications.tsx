import { addSeconds } from 'date-fns';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import { Alert, Button, RefreshControl, ScrollView, Text, View } from 'react-native';

import { TaskWithOccurrence } from '@/db/types';
import { cancelAllNotifications, scheduleTaskNotification } from '@/services/notifications';

export default function NotificationDebugScreen() {
    const [scheduled, setScheduled] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const loadScheduledNotifications = async () => {
        setLoading(true);
        try {
            const notifications = await Notifications.getAllScheduledNotificationsAsync();
            setScheduled(notifications);
            console.log(`Loaded ${notifications.length} scheduled notifications`);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to load scheduled notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadScheduledNotifications();
    }, []);

    const cancelNotification = async (identifier: string) => {
        try {
            await Notifications.cancelScheduledNotificationAsync(identifier);
            Alert.alert('Cancelled', `Notification ${identifier.slice(0, 8)}... cancelled`);
            loadScheduledNotifications();
        } catch (error) {
            Alert.alert('Error', 'Failed to cancel notification');
        }
    };

    const cancelAll = async () => {
        try {
            await cancelAllNotifications();
            Alert.alert('Success', 'All notifications cancelled');
            loadScheduledNotifications();
        } catch (error) {
            Alert.alert('Error', 'Failed to cancel all notifications');
        }
    };

    // Test function - Create a sample TaskWithOccurrence
    const scheduleTestNotification = async () => {
        const testTask: TaskWithOccurrence = {
            occurrenceId: 'test-' + Date.now(),
            taskId: 'test-task-' + Date.now(),
            title: 'Test Task Notification',
            description: 'This is a test notification from debug screen',
            occurrenceDate: addSeconds(new Date(), 15).toISOString(), // 15 seconds from now
            isCompleted: false,
            completedAt: null,
            priority: 1,
            notes: 'This should trigger soon',
            customTitle: null,
            customTime: null,
            isRecurring: false,
        };

        try {
            await scheduleTaskNotification(testTask);
            Alert.alert('Success', 'Test notification scheduled in 15 seconds!');
            loadScheduledNotifications();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to schedule test notification');
        }
    };

    return (
        <ScrollView
            style={{ flex: 1, padding: 16, backgroundColor: '#0b0b0b' }}
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={loadScheduledNotifications} />
            }
        >
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 16 }}>
                🛠 Notification Debug
            </Text>

            <Text style={{ color: '#a1a1aa', marginBottom: 20 }}>
                Scheduled Notifications:{' '}
                <Text style={{ color: 'white', fontWeight: '600' }}>{scheduled.length}</Text>
            </Text>

            <View style={{ gap: 12, marginBottom: 24 }}>
                <Button title="Refresh List" onPress={loadScheduledNotifications} color="#3b82f6" />

                <Button
                    title="Schedule Test Notification (in 15s)"
                    onPress={scheduleTestNotification}
                    color="#10b981"
                />

                <Button title="Cancel All Notifications" onPress={cancelAll} color="#ef4444" />
            </View>

            {scheduled.length === 0 ? (
                <View style={{ padding: 40, alignItems: 'center' }}>
                    <Text style={{ color: '#666', fontSize: 16 }}>No scheduled notifications</Text>
                </View>
            ) : (
                scheduled.map((notif: any) => (
                    <View
                        key={notif.identifier}
                        style={{
                            backgroundColor: '#1f2937',
                            padding: 16,
                            borderRadius: 12,
                            marginBottom: 12,
                        }}
                    >
                        <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>
                            {notif.content.title}
                        </Text>
                        <Text style={{ color: '#d1d5db', marginTop: 4 }}>{notif.content.body}</Text>

                        <Text style={{ color: '#9ca3af', fontSize: 12, marginTop: 8 }}>
                            ID: {notif.identifier}
                        </Text>

                        <Text style={{ color: '#9ca3af', fontSize: 12 }}>
                            Trigger: {JSON.stringify(notif.trigger, null, 2)}
                        </Text>

                        <Button
                            title="Cancel This"
                            onPress={() => cancelNotification(notif.identifier)}
                            color="#ef4444"
                        />
                    </View>
                ))
            )}
        </ScrollView>
    );
}
