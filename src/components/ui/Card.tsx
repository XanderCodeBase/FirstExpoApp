import { View } from 'react-native';

export function Card({ children }: React.PropsWithChildren) {
    return (
        <View className="bg-card m-7 mb-4 rounded-2xl border border-slate-700 p-4">
            {children}
        </View>
    );
}
