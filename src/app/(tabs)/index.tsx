import { Link } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

import { LogoutButton } from '@/components/ui/button/logout-button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

export default function HomeScreen() {
    return (
        <ScrollView className="flex-1 bg-slate-900 p-4">
            <View className="grid flex-1 justify-center gap-4">
                <Heading size="3xl" bold className="mb-2 text-white">
                    Home Screen
                </Heading>

                <Link href="/items" asChild>
                    <Pressable className="rounded-xl bg-slate-700 px-5 py-2.5">
                        <Text className="font-medium text-white">Go to Items</Text>
                    </Pressable>
                </Link>

                <Link href="/about" asChild>
                    <Pressable className="rounded-xl bg-slate-700 px-5 py-2.5">
                        <Text className="font-medium text-white">About</Text>
                    </Pressable>
                </Link>

                <LogoutButton variant="small" />
            </View>
        </ScrollView>
    );
}
