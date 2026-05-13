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
import { AuthProvider } from '@/providers/AuthProvider';

export default function RootLayout() {
    return (
        <AuthProvider>
            <DatabaseProvider>
                <GluestackUIProvider mode="dark">
                    <GestureHandlerRootView style={{ flex: 1 }}>
                        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                            <View className="flex-1 bg-slate-900">
                                <SafeAreaView style={{ flex: 1 }}>
                                    <RootNavigator />
                                </SafeAreaView>
                            </View>
                        </SafeAreaProvider>
                    </GestureHandlerRootView>
                </GluestackUIProvider>
            </DatabaseProvider>
        </AuthProvider>
    );
}
