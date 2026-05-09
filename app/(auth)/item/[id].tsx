import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { Item } from '@/types/Item';
import { supabase } from '@/lib/supabase';

export default function DetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchItem();
    }, [id]);

    const fetchItem = async () => {
        const { data, error } = await supabase
            .from('items')
            .select('*')
            .eq('id', id)
            .single();

        if (error) console.error(error);
        else setItem(data);

        setLoading(false);
    };

    if (loading)
        return (
            <Screen>
                <Text>Loading...</Text>
            </Screen>
        );
    if (!item)
        return (
            <Screen>
                <Text>Item not found</Text>
            </Screen>
        );

    return (
        <Screen>
            <Card>
                <Text className="text-3xl font-bold text-white">
                    {item.title}
                </Text>

                <View className="mt-4">
                    <Text className="text-xl font-semibold text-white">
                        {item.description}
                    </Text>
                </View>

                <View className="mt-6">
                    <Button
                        title="Do Something"
                        onPress={() => console.log('Pressed')}
                    />
                </View>
            </Card>
        </Screen>
    );
}
