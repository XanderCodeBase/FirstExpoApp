import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { supabase } from '@/lib/supabase';
import { Item } from '@/types/Item';

export default function HomeScreen() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchItems = async () => {
        const { data, error } = await supabase.from('items').select('*').order('title');

        if (error) console.error(error);
        else setItems(data || []);

        setLoading(false);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    if (loading) return <Text>Loading...</Text>;

    return (
        <View className="flex-1 bg-slate-900 p-4">
            <Heading size="3xl" bold className="mb-2 text-white">
                Overview
            </Heading>

            <FlatList
                data={items}
                keyExtractor={(item) => 'id-' + item.id}
                renderItem={({ item }) => (
                    <Pressable onPress={() => router.push(`/item/${item.id}`)}>
                        <Card className="mb-4 rounded-2xl border border-slate-700 p-4">
                            <Heading size="2xl" className="text-blue-600">
                                Item {item.title}
                            </Heading>

                            <Text className="text-xl font-semibold">{item.description}</Text>
                        </Card>
                    </Pressable>
                )}
            />
        </View>
    );
}
