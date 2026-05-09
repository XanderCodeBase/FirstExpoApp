import { Stack } from 'expo-router';
import { AuthProvider } from '@/providers/AuthProvider';
import '../styles/globals.css';
import { View } from 'react-native';
import FooterMenu from '@/components/FooterMenu';

export default function RootLayout() {
    return (
        <AuthProvider>
            <View className="flex-1 bg-slate-950">
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="login" />
                    <Stack.Screen name="(public)" />
                    <Stack.Screen name="(auth)" />
                </Stack>
                <FooterMenu />
            </View>
        </AuthProvider>
    );
}
