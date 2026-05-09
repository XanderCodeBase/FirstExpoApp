import { Link } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';

export default function HomeScreen() {
    return (
        <Screen>
            <View className="mb-6">
                <Text className="text-3xl font-bold text-white">
                    Home Screen
                </Text>
                <Link href="/items" asChild>
                    <TouchableOpacity className="rounded-xl bg-slate-700 px-5 py-2.5">
                        <Text className="font-medium text-white">
                            Go to Items
                        </Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/about" asChild>
                    <TouchableOpacity className=" rounded-xl bg-slate-700 px-5 py-2.5">
                        <Text className="font-medium text-white">About</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </Screen>
    );
}
