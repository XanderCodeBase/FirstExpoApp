import { router } from 'expo-router';
import { ChevronRight, LogOut } from 'lucide-react-native';
import { Alert, Pressable, Text, View } from 'react-native';

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
                        Alert.alert('Error', `Failed to logout. Please try again. ${error}`);
                    }
                },
            },
        ]);
    };

    if (variant === 'small') {
        return (
            <Pressable
                onPress={handleLogout}
                className="rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-2 active:bg-red-500/20"
            >
                <View className="flex-row items-center gap-4">
                    <LogOut size={16} color="#ef4444" />
                    <Text className="text-sm font-medium text-red-500">Logout</Text>
                </View>
            </Pressable>
        );
    }

    return (
        <Pressable
            onPress={handleLogout}
            className={`mb-4 flex-row items-center justify-between rounded-2xl p-5 ${
                variant === 'destructive'
                    ? 'bg-red-600 active:bg-red-700'
                    : 'border border-red-500 bg-red-500/10 active:bg-red-500/20'
            }`}
        >
            <View className="flex-row items-center gap-4">
                <View className="rounded-xl bg-red-500/20 p-3">
                    <LogOut size={20} color={variant === 'destructive' ? '#ffffff' : '#ef4444'} />
                </View>

                <View>
                    <Text
                        className={`text-lg font-semibold ${
                            variant === 'destructive' ? 'text-white' : 'text-red-500'
                        }`}
                    >
                        Logout
                    </Text>

                    <Text
                        className={`text-sm ${
                            variant === 'destructive' ? 'text-red-100' : 'text-red-400'
                        }`}
                    >
                        Sign out of your account
                    </Text>
                </View>
            </View>

            <ChevronRight size={22} color={variant === 'destructive' ? '#ffffff80' : '#f87171'} />
        </Pressable>
    );
}
