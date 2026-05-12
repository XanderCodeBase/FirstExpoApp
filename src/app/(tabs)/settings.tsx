import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

export default function SettingsScreen() {
    return (
        <ScrollView className="flex-1 bg-slate-950">
            <View className="flex-1 p-6 pt-20">
                <Heading
                    size="4xl"
                    bold
                    className="mb-8 text-center text-white"
                >
                    Settings
                </Heading>

                <Pressable
                    onPress={() => router.push('/settings/change-password')}
                    className="mb-4 flex-row items-center justify-between rounded-2xl border border-slate-700 bg-slate-900 p-5 active:bg-slate-800"
                >
                    <View>
                        <Text className="text-lg font-semibold text-white">
                            Change Password
                        </Text>
                        <Text className="text-sm text-slate-400">
                            Update your account password
                        </Text>
                    </View>
                    <Text className="text-2xl text-slate-500">→</Text>
                </Pressable>

                {/* You can add more settings options here later */}
            </View>
        </ScrollView>
    );
}
