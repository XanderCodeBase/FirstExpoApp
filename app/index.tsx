import { TouchableOpacity, View, Text } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Link } from 'expo-router';

export default function HomeScreen() {
    return (
        <Screen>
            <View className="mb-6">
                <Text className="text-3xl font-bold text-white">
                    Home Screen
                </Text>
                <Link href="/items" asChild>
                    <TouchableOpacity className="bg-slate-700 px-5 py-2.5 rounded-xl">
                        <Text className="text-white font-medium">
                            Go to Items
                        </Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/about" asChild>
                    <TouchableOpacity className="bg-slate-700 px-5 py-2.5 rounded-xl">
                        <Text className="text-white font-medium">About</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </Screen>
    );
}
