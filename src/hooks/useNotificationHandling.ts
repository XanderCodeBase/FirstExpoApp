import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export function useNotificationHandling() {
    const router = useRouter();

    useEffect(() => {
        const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
            const { taskId } = response.notification.request.content.data;

            if (taskId) {
                router.push(`/task/${taskId}`);
            }
        });

        return () => subscription.remove();
    }, [router]);
}
