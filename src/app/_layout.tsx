import { SafeAreaProvider } from 'react-native-safe-area-context';

import RootNavigator from '@/components/RootNavigator';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { AuthProvider } from '@/providers/AuthProvider';

export default function RootLayout() {
    return (
        <AuthProvider>
            <GluestackUIProvider mode="dark">
                <SafeAreaProvider>
                    <RootNavigator />
                </SafeAreaProvider>
            </GluestackUIProvider>
        </AuthProvider>
    );
}
