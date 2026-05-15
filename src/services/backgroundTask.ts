import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';

import { rescheduleAllNotifications } from './notifications';

export const BACKGROUND_TASK_NAME = 'TASK_REMINDER_BACKGROUND_TASK';

TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
    try {
        console.log('[BackgroundTask] Running reschedule task...');
        await rescheduleAllNotifications();
        return BackgroundTask.BackgroundTaskResult.Success;
    } catch (error) {
        console.error('[BackgroundTask] Failed:', error);
        return BackgroundTask.BackgroundTaskResult.Failed;
    }
});

export async function registerBackgroundTask() {
    try {
        const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_NAME);

        if (isRegistered) {
            console.log('Background task already registered');
            return;
        }

        await BackgroundTask.registerTaskAsync(BACKGROUND_TASK_NAME, {
            minimumInterval: 60 * 30, // 30 minutes
        });

        console.log('✅ Background task registered successfully');
    } catch (err) {
        console.error('❌ Failed to register background task:', err);
    }
}
