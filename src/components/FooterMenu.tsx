import { Link, router, usePathname } from 'expo-router';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

import { useAuth } from '@/providers/AuthProvider';

export default function FooterMenu() {
    const pathname = usePathname();
    const { user, signOut } = useAuth();

    const isHome = pathname === '/(auth)' || pathname === '/(auth)/index';
    const isAbout = pathname.includes('/about');

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    await signOut();
                    router.replace('/');
                },
            },
        ]);
    };

    return (
        <View className="border-t border-slate-700 bg-slate-900 px-6 pb-10 pt-3">
            <View className="flex-row items-center justify-around">
                {/* Home Button */}
                <Link href="/" asChild>
                    <TouchableOpacity className="flex-1 items-center py-2">
                        <Text
                            className={`mb-1 text-3xl ${isHome ? 'text-blue-500' : 'text-slate-400'}`}
                        >
                            🏠
                        </Text>
                        <Text
                            className={`text-xs font-medium ${isHome ? 'text-blue-500' : 'text-slate-400'}`}
                        >
                            Home
                        </Text>
                    </TouchableOpacity>
                </Link>

                {/* Items Button */}
                <Link href="/items" asChild>
                    <TouchableOpacity className="flex-1 items-center py-2">
                        <Text
                            className={`mb-1 text-3xl ${isHome ? 'text-blue-500' : 'text-slate-400'}`}
                        >
                            📋
                        </Text>
                        <Text
                            className={`text-xs font-medium ${isHome ? 'text-blue-500' : 'text-slate-400'}`}
                        >
                            Items
                        </Text>
                    </TouchableOpacity>
                </Link>

                {/* About Button */}
                <Link href="/about" asChild>
                    <TouchableOpacity className="flex-1 items-center py-2">
                        <Text
                            className={`mb-1 text-3xl ${isAbout ? 'text-blue-500' : 'text-slate-400'}`}
                        >
                            ℹ️
                        </Text>
                        <Text
                            className={`text-xs font-medium ${isAbout ? 'text-blue-500' : 'text-slate-400'}`}
                        >
                            About
                        </Text>
                    </TouchableOpacity>
                </Link>

                {/* Login / Logout Button */}
                {user ? (
                    // Logged In → Show Logout
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="flex-1 items-center py-2"
                    >
                        <Text className="mb-1 text-3xl text-red-500">⏻</Text>
                        <Text className="text-xs font-medium text-red-500">
                            Logout
                        </Text>
                    </TouchableOpacity>
                ) : (
                    // Not Logged In → Show Login
                    <Link href="/login" asChild>
                        <TouchableOpacity className="flex-1 items-center py-2">
                            <Text className="mb-1 text-3xl text-blue-500">
                                🔑
                            </Text>
                            <Text className="text-xs font-medium text-blue-500">
                                Login
                            </Text>
                        </TouchableOpacity>
                    </Link>
                )}
            </View>
        </View>
    );
}
