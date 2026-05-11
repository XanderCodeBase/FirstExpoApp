import '@/styles/globals.css';

import { Tabs } from 'expo-router';
import { Home, LogInIcon, Search, Settings } from 'lucide-react-native';
import { View } from 'react-native';

export default function RootLayout() {
    return (
        <View className="flex-1 bg-slate-950">
            <Tabs screenOptions={{ headerShown: false }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color }) => (
                            <Home size={28} color={color} />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Profile',
                        tabBarIcon: ({ color }) => (
                            <Settings size={28} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        title: 'Settings',
                        tabBarIcon: ({ color }) => (
                            <Settings size={28} color={color} />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="about"
                    options={{
                        title: 'About',
                        tabBarIcon: ({ color }) => (
                            <Search size={28} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="items"
                    options={{
                        title: 'Items',
                        tabBarIcon: ({ color }) => (
                            <LogInIcon size={28} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </View>
    );
}
