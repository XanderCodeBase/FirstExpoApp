import { View, Text, TouchableOpacity } from 'react-native';
import { Link, usePathname, router } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { Alert } from 'react-native';

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
        <View className="bg-slate-900 border-t border-slate-700 px-6 pt-3 pb-10">
            <View className="flex-row justify-around items-center">
                {/* Home Button */}
                <Link href="/" asChild>
                    <TouchableOpacity className="items-center flex-1 py-2">
                        <Text
                            className={`text-3xl mb-1 ${isHome ? 'text-blue-500' : 'text-slate-400'}`}
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
                    <TouchableOpacity className="items-center flex-1 py-2">
                        <Text
                            className={`text-3xl mb-1 ${isHome ? 'text-blue-500' : 'text-slate-400'}`}
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
                    <TouchableOpacity className="items-center flex-1 py-2">
                        <Text
                            className={`text-3xl mb-1 ${isAbout ? 'text-blue-500' : 'text-slate-400'}`}
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
                        className="items-center flex-1 py-2"
                    >
                        <Text className="text-3xl mb-1 text-red-500">⏻</Text>
                        <Text className="text-xs font-medium text-red-500">
                            Logout
                        </Text>
                    </TouchableOpacity>
                ) : (
                    // Not Logged In → Show Login
                    <Link href="/login" asChild>
                        <TouchableOpacity className="items-center flex-1 py-2">
                            <Text className="text-3xl mb-1 text-blue-500">
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
