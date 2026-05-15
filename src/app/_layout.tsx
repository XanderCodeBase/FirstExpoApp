import 'react-native-get-random-values';

import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
    initialWindowMetrics,
    SafeAreaProvider,
    SafeAreaView,
} from 'react-native-safe-area-context';

import RootNavigator from '@/components/navigator/root-navigator';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { DatabaseProvider } from '@/db';
import { useNotificationHandling } from '@/hooks/useNotificationHandling';
import { AuthProvider } from '@/providers/AuthProvider';
import NotificationProvider from '@/providers/NotificationProvider';

export default function RootLayout() {
    useNotificationHandling();

    return (
        <NotificationProvider>
            <AuthProvider>
                <DatabaseProvider>
                    <GestureHandlerRootView style={{ flex: 1 }}>
                        <GluestackUIProvider mode="dark">
                            <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                                <View className="flex-1 bg-slate-900">
                                    <SafeAreaView style={{ flex: 1 }}>
                                        <RootNavigator />
                                    </SafeAreaView>
                                </View>
                            </SafeAreaProvider>
                        </GluestackUIProvider>
                    </GestureHandlerRootView>
                </DatabaseProvider>
            </AuthProvider>
        </NotificationProvider>
    );
}
