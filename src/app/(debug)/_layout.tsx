import { Tabs } from 'expo-router';
import { AlarmClockCheck, Database } from 'lucide-react-native';

export default function DebugLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="notifications"
                options={{
                    title: 'Notifications',
                    tabBarIcon: ({ color }) => <AlarmClockCheck size={28} color={color} />,
                }}
            />

            <Tabs.Screen
                name="drizzle"
                options={{
                    title: 'Drizzle DB',
                    tabBarIcon: ({ color }) => <Database size={28} color={color} />,
                }}
            />
        </Tabs>
    );
}
