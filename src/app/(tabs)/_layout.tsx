import '@/styles/globals.css';

import { router, Tabs } from 'expo-router';
import { Bug, CalendarCheck, CalendarDays, Settings, SquarePlus } from 'lucide-react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#0f172a',
                    borderTopWidth: 1,
                    borderTopColor: '#334155',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: '#22d3ee',
                tabBarInactiveTintColor: '#94a3b8',
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Daily',
                    tabBarIcon: ({ color }) => <CalendarDays size={28} color={color} />,
                }}
            />

            <Tabs.Screen
                name="planned"
                options={{
                    title: 'Planned',
                    tabBarIcon: ({ color }) => <CalendarCheck size={28} color={color} />,
                }}
            />

            <Tabs.Screen
                name="new"
                options={{
                    title: 'New',
                    tabBarIcon: ({ color }) => <SquarePlus size={28} color={color} />,
                }}
            />

            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <Settings size={28} color={color} />,
                }}
            />

            <Tabs.Screen
                name="debug"
                options={{
                    title: 'Debug',
                    tabBarIcon: ({ color }) => <Bug size={28} color={color} />,
                }}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault();
                        router.push('/(debug)/notifications');
                    },
                }}
            />
        </Tabs>
    );
}
