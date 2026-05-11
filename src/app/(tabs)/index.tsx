import { Link } from 'expo-router';
import { ScrollView, TouchableOpacity, View } from 'react-native';

import { LogoutButton } from '@/components/LogoutButton';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

export default function HomeScreen() {
    return (
        <ScrollView className="flex-1 bg-slate-950">
            <View className="grid flex-1 justify-center gap-4 p-6">
                <Heading size="4xl" bold className="text-center text-white">
                    Home Screen
                </Heading>

                <Link href="/items" asChild>
                    <TouchableOpacity className="rounded-xl bg-slate-700 px-5 py-2.5">
                        <Text className="font-medium text-white">
                            Go to Items
                        </Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/about" asChild>
                    <TouchableOpacity className="rounded-xl bg-slate-700 px-5 py-2.5">
                        <Text className="font-medium text-white">About</Text>
                    </TouchableOpacity>
                </Link>

                <LogoutButton />
            </View>
        </ScrollView>
    );
}
