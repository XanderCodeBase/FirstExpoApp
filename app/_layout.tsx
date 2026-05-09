import {Stack, useRouter, useSegments} from 'expo-router';
import {useEffect} from 'react';
import {AuthProvider, useAuth} from '@/providers/AuthProvider';

import '../styles/globals.css';

function RootLayoutNav() {
    const {user, loading} = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        const inAuthGroup = segments[0] === 'login';

        if (!user && !inAuthGroup) {
            router.replace('/login'); // Not logged in → redirect to login
        } else if (user && inAuthGroup) {
            router.replace('/'); // Logged in → redirect to home
        }
    }, [user, loading, segments]);

    return (
        <Stack screenOptions={{headerShown: true}}>
            <Stack.Screen name="login"/>
            <Stack.Screen name="index"/>
            {/* Add other screens here later */}
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <RootLayoutNav/>
        </AuthProvider>
    );
}
