import { View } from 'react-native';

export function Card({ children }: React.PropsWithChildren) {
    return (
        <View className="mb-4 rounded-2xl border border-slate-700 bg-card p-4">
            {children}
        </View>
    );
}
