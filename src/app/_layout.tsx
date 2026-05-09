import '@/styles/globals.css';

import { Tabs } from 'expo-router';
import { Home, LogInIcon, Search, Settings } from 'lucide-react-native';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import FooterMenu from '@/components/FooterMenu';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { AuthProvider } from '@/providers/AuthProvider';

export default function RootLayout() {
    return (
        <AuthProvider>
            <GluestackUIProvider mode="dark">
                <SafeAreaProvider>
                    <View className="flex-1 bg-slate-950">
                        <Tabs screenOptions={{ headerShown: false }}>
                            <Tabs.Screen name="index"
                                options={{
                                    title: 'Home',
                                    tabBarIcon: ({ color }) => <Home size={28} color={color} />,
                                }}/>
                            <Tabs.Screen name="login"
                                options={{
                                    title: 'Home',
                                    tabBarIcon: ({ color }) => <Settings size={28} color={color} />,
                                }}/>
                            <Tabs.Screen name="(public)"
                                options={{
                                    title: 'Home',
                                    tabBarIcon: ({ color }) => <Search size={28} color={color} />,
                                }}/>
                            <Tabs.Screen name="(auth)"
                                options={{
                                    title: 'Login',
                                    tabBarIcon: ({ color }) => <LogInIcon size={28} color={color} />,
                                }}/>
                        </Tabs>
                        <FooterMenu />
                    </View>
                </SafeAreaProvider>
            </GluestackUIProvider>
        </AuthProvider>
    );
}
