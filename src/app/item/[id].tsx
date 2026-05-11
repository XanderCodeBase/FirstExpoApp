import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/heading';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/text';
import { supabase } from '@/lib/supabase';
import { Item } from '@/types/Item';

export default function DetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

        if (id) fetchItem();
    }, [id]);

    if (loading)
        return (
            <Screen>
                <Heading>Loading...</Heading>
            </Screen>
        );
    if (!item)
        return (
            <Screen>
                <Heading>Item not found</Heading>
            </Screen>
        );

    return (
        <Screen>
            <Text>asdf asdf asdf asdf</Text>
            <Card>
                <Heading
                    size="4xl"
                    bold
                    className="mb-4 text-center text-white"
                >
                    Home Screen
                </Heading>

                <Heading size="3xl" className="text-blue-600">
                    Item {item.title}
                </Heading>

                <Text className="text-3xl font-bold">{item.title}</Text>

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
