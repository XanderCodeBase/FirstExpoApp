import { View } from 'react-native';

export function Card({ children }: React.PropsWithChildren) {
    return (
        <View className="rounded-2xl bg-card p-4 mb-4 border border-slate-700">
            {children}
        </View>
    );
}
