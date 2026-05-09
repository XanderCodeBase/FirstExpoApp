import '../../styles/globals.css';

import { Stack } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import FooterMenu from '@/components/FooterMenu';
import { AuthProvider } from '@/providers/AuthProvider';

export default function RootLayout() {
    return (
        <AuthProvider>
            <SafeAreaProvider>
                <View className="flex-1 bg-slate-950">
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="login" />
                        <Stack.Screen name="(public)" />
                        <Stack.Screen name="(auth)" />
                    </Stack>
                    <FooterMenu />
                </View>
            </SafeAreaProvider>
        </AuthProvider>
    );
}
