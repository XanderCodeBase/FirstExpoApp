import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
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

    if (loading) return <Heading>Loading...</Heading>;
    if (!item) return <Heading>Item not found</Heading>;

    return (
        <View className="flex-1 bg-slate-900 p-4">
            <Card className="rounded-2xl border border-slate-700 p-4">
                <Heading size="2xl" className="text-blue-600">
                    Item {item.title}
                </Heading>

                <Text className="text-xl font-semibold">
                    {item.description}
                </Text>

                <Button onPress={() => router.back()}>
                    <ButtonText>Do Something</ButtonText>
                </Button>
            </Card>
        </View>
    );
}
