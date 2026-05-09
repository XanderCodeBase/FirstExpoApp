import { ScrollView, Text, View } from 'react-native';

export default function About() {
    return (
        <ScrollView className="flex-1 bg-slate-950">
            <View className="flex-1 justify-center p-6 pt-20">
                <Text className="mb-6 text-4xl font-bold text-white">
                    About This App
                </Text>

                <View className="rounded-3xl bg-slate-900 p-6">
                    <Text className="text-[17px] leading-7 text-slate-300">
                        This is a modern Expo app built with Supabase
                        authentication, protected routes, and NativeWind
                        styling.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}
