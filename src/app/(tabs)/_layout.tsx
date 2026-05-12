import '@/styles/globals.css';

import { Tabs } from 'expo-router';
import {
    Home,
    ListTodo,
    LogInIcon,
    Search,
    Settings,
} from 'lucide-react-native';

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
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Home size={28} color={color} />,
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

            <Tabs.Screen
                name="task"
                options={{
                    title: 'Task',
                    tabBarIcon: ({ color }) => (
                        <ListTodo size={28} color={color} />
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
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => (
                        <Settings size={28} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
