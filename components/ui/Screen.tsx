import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';

export function Screen({ children }: React.PropsWithChildren) {
    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="flex-1 px-4 py-3">{children}</View>
        </SafeAreaView>
    );
}
