import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

import { registerBackgroundTask } from '@/services/backgroundTask';
import { rescheduleAllNotifications } from '@/services/notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function NotificationProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        initializeNotifications();
    }, []);

    return <>{children}</>;
}

async function initializeNotifications() {
    try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') return;

        await registerBackgroundTask();
        await rescheduleAllNotifications();
    } catch (error) {
        console.error('Notification initialization failed:', error);
    }
}
