import { router } from 'expo-router';
import { ChevronRight, Lock } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';

import { LogoutButton } from '@/components/ui/button/logout-button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

export default function SettingsScreen() {
    return (
        <ScrollView className="flex-1 bg-slate-900 p-4">
            <Heading size="3xl" bold className="mb-2 text-white">
                Settings
            </Heading>

            <Pressable
                onPress={() => router.push('/settings/change-password')}
                className="mb-4 flex-row items-center justify-between rounded-2xl border border-slate-700 bg-slate-900 p-5 active:bg-slate-800"
            >
                <View className="flex-row items-center gap-4">
                    <View className="rounded-xl bg-slate-800 p-3">
                        <Lock size={20} color="#ffffff" />
                    </View>

                    <View>
                        <Text className="text-lg font-semibold text-white">Change Password</Text>

                        <Text className="text-sm text-slate-400">Update your account password</Text>
                    </View>
                </View>

                <ChevronRight size={22} color="#64748b" />
            </Pressable>

            <LogoutButton />
        </ScrollView>
    );
}
