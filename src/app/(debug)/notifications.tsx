import { addSeconds } from 'date-fns';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import { Alert, Button, RefreshControl, ScrollView, Text, View } from 'react-native';

import { scheduleTaskNotification } from '@/services/notifications';
import { Task } from '@/types/Task';

export default function NotificationDebugScreen() {
    const [scheduled, setScheduled] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const loadScheduledNotifications = async () => {
        setLoading(true);
        try {
            const notifications = await Notifications.getAllScheduledNotificationsAsync();
            setScheduled(notifications);
            console.log('Scheduled notifications:', notifications);
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
        await Notifications.cancelScheduledNotificationAsync(identifier);
        Alert.alert('Cancelled', `Notification ${identifier} cancelled`);
        loadScheduledNotifications(); // refresh list
    };

    const cancelAll = async () => {
        await Notifications.cancelAllScheduledNotificationsAsync();
        Alert.alert('Success', 'All notifications cancelled');
        loadScheduledNotifications();
    };

    const scheduledNotifications = async () => {
        await scheduleTaskNotification({
            id: 'fad1afcd-74c1-4899-8367-67bb816c03cc',
            title: 'TITLE notification',
            start_date: addSeconds(new Date(), 10).toISOString(),
            description: 'DESCRIPTION Notification',
        } as Task);
        loadScheduledNotifications();
    };

    return (
        <ScrollView
            style={{ flex: 1, padding: 16 }}
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={loadScheduledNotifications} />
            }
        >
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
                Scheduled Notifications ({scheduled.length})
            </Text>

            <Button title="Refresh List" onPress={loadScheduledNotifications} />
            <Button title="Schedule Notifications" onPress={scheduledNotifications} />
            <Button title="Cancel All Notifications" onPress={cancelAll} color="red" />

            {scheduled.length === 0 ? (
                <Text style={{ marginTop: 20, fontStyle: 'italic' }}>
                    No notifications scheduled.
                </Text>
            ) : (
                scheduled.map((notif) => (
                    <View
                        key={notif.identifier}
                        style={{
                            padding: 14,
                            marginVertical: 8,
                            backgroundColor: '#f0f0f0',
                            borderRadius: 8,
                        }}
                    >
                        <Text style={{ fontWeight: '600' }}>{notif.content.title}</Text>
                        <Text>{notif.content.body}</Text>
                        <Text style={{ fontSize: 12, marginTop: 4, color: '#666' }}>
                            ID: {notif.identifier}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#666' }}>
                            Trigger: {JSON.stringify(notif.trigger, null, 2)}
                        </Text>

                        <Button
                            title="Cancel this"
                            onPress={() => cancelNotification(notif.identifier)}
                            color="red"
                        />
                    </View>
                ))
            )}
        </ScrollView>
    );
}
