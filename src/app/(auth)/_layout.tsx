import {
    Stack,
    useRootNavigationState,
    useRouter,
    useSegments,
} from 'expo-router';
import { useEffect } from 'react';

import { useAuth } from '@/providers/AuthProvider';

export default function AuthLayout() {
    const { user, loading } = useAuth();
    const segments = useSegments();
    const router = useRouter();
    const navigationState = useRootNavigationState();

    useEffect(() => {
        if (loading || !navigationState?.key) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!user && inAuthGroup) {
            // Not logged in but trying to access protected route
            router.replace('/login');
        } else if (user && !inAuthGroup) {
            // Logged in but on login page
            router.replace('/(auth)/items');
        }
    }, [user, loading, segments, navigationState, router]);

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{ headerShown: false, title: 'My Items' }}
            />
            <Stack.Screen
                name="items/[id]"
                options={{ headerShown: false, title: 'Detail' }}
            />
        </Stack>
    );
}
