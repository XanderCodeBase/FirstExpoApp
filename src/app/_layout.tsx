import { View } from 'react-native';
import {
    initialWindowMetrics,
    SafeAreaProvider,
    SafeAreaView,
} from 'react-native-safe-area-context';

import RootNavigator from '@/components/navigator/root-navigator';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { AuthProvider } from '@/providers/AuthProvider';

export default function RootLayout() {
    return (
        <AuthProvider>
            <GluestackUIProvider mode="dark">
                <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                    <View className="flex-1 bg-slate-900">
                        <SafeAreaView style={{ flex: 1 }}>
                            <RootNavigator />
                        </SafeAreaView>
                    </View>
                </SafeAreaProvider>
            </GluestackUIProvider>
        </AuthProvider>
    );
}
