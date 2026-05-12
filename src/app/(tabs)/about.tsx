import { ScrollView } from 'react-native';

import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

export default function AboutScreen() {
    return (
        <ScrollView className="flex-1 bg-slate-900 p-4">
            <Heading size="3xl" bold className="mb-2 text-white">
                About This App
            </Heading>

            <Text className="text-[17px] leading-7 text-slate-300">
                This is a modern Expo app built with Supabase authentication,
                protected routes, and NativeWind styling.
            </Text>
        </ScrollView>
    );
}
