import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

import { useAuth } from '@/providers/AuthProvider';

export default function RootNavigator() {
    const { user, loading } = useAuth();

    const segments = useSegments();
    const router = useRouter();
    const navigationState = useRootNavigationState();

    useEffect(() => {
        if (loading || !navigationState?.key) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!user && !inAuthGroup) {
            router.replace('/login');
        }

        if (user && inAuthGroup) {
            router.replace('/');
        }
    }, [user, loading, segments, navigationState, router]);

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)/login" />
            <Stack.Screen name="item/[id]" />
            <Stack.Screen name="settings/change-password" />
        </Stack>
    );
}
