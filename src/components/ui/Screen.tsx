import { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Screen({ children }: PropsWithChildren) {
    return (
        <SafeAreaView>
            <View className="m-3">{children}</View>
        </SafeAreaView>
    );
}
