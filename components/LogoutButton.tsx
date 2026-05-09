import { router } from 'expo-router';
import { Alert, Text, TouchableOpacity } from 'react-native';

import { useAuth } from '@/providers/AuthProvider';

export function LogoutButton({
    variant = 'default',
}: {
    variant?: 'default' | 'destructive' | 'small';
}) {
    const { signOut } = useAuth();

    const handleLogout = async () => {
        Alert.alert('Logout', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await signOut();
                        router.replace('/');
                    } catch (error) {
                        Alert.alert(
                            'Error',
                            `Failed to logout. Please try again. ${error}`,
                        );
                    }
                },
            },
        ]);
    };

    if (variant === 'small') {
        return (
            <TouchableOpacity
                onPress={handleLogout}
                className="rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-2 active:bg-red-500/20"
            >
                <Text className="text-sm font-medium text-red-500">Logout</Text>
            </TouchableOpacity>
        );
    }

    // Default / Destructive style
    return (
        <TouchableOpacity
            onPress={handleLogout}
            className={`rounded-2xl px-6 py-3 ${
                variant === 'destructive'
                    ? 'bg-red-600 active:bg-red-700'
                    : 'border border-red-500 bg-red-500/10 active:bg-red-500/20'
            }`}
        >
            <Text
                className={`text-base font-semibold ${
                    variant === 'destructive' ? 'text-white' : 'text-red-500'
                }`}
            >
                Logout
            </Text>
        </TouchableOpacity>
    );
}
