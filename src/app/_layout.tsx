import 'react-native-get-random-values';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 15, // 15 minutes
            refetchOnMount: true,
            refetchOnWindowFocus: false,
        },
    },
});

export default function RootLayout() {
    useNotificationHandling();

    return (
        <NotificationProvider>
            <AuthProvider>
                <QueryClientProvider client={queryClient}>
                    <DatabaseProvider>
                        <GestureHandlerRootView style={{ flex: 1 }}>
                            <GluestackUIProvider mode="light">
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
                </QueryClientProvider>
            </AuthProvider>
        </NotificationProvider>
    );
}
