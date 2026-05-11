import { ScrollView, View } from 'react-native';

import { Heading } from '@/components/ui/heading';

export default function SettingsScreen() {
    return (
        <ScrollView className="flex-1 bg-slate-950">
            <View className="flex-1 justify-center p-6 pt-20">
                <Heading size="4xl" bold className="mb-4 text-center text-white">
                    Settings
                </Heading>
            </View>
        </ScrollView>
    );
}
