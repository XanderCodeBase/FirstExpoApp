import { View, Text, ScrollView } from 'react-native';

export default function About() {
    return (
        <ScrollView className="flex-1 bg-slate-950">
            <View className="flex-1 justify-center p-6 pt-20">
                <Text className="text-4xl font-bold text-white mb-6">
                    About This App
                </Text>

                <View className="bg-slate-900 p-6 rounded-3xl">
                    <Text className="text-slate-300 text-[17px] leading-7">
                        This is a modern Expo app built with Supabase
                        authentication, protected routes, and NativeWind
                        styling.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}
