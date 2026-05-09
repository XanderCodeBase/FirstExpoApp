import { ScrollView, View } from 'react-native';

import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

export default function About() {
    return (
        <ScrollView className="flex-1 bg-slate-950">
            <View className="flex-1 justify-center p-6 pt-20">
                <Heading size="3xl" className="text-white">
                    About This App
                </Heading>

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
