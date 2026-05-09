import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, ScrollView, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { supabase } from '@/lib/supabase';
import { Item } from '@/types/Item';

export default function HomeScreen() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchItems = async () => {
        const { data, error } = await supabase
            .from('items')
            .select('*')
            .order('title');

        if (error) console.error(error);
        else setItems(data || []);

        setLoading(false);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    if (loading) return <Text>Loading...</Text>;

    return (
        <ScrollView className="flex-1 bg-slate-950">
            <View className="flex-1 justify-center p-6 pt-20">
                <Heading size="3xl" className="text-white">Overview</Heading>
            </View>

            <FlatList
                data={items}
                keyExtractor={(item) => 'id' + item.id}
                renderItem={({ item }) => (
                    <Pressable onPress={() => router.push(`/item/${item.id}`)}>
                        <Card>
                            <Text className="text-xl font-semibold">
                                {item.title}
                            </Text>

                            <View className="mt-2">
                                <Text>
                                    {item.description}
                                </Text>
                            </View>
                        </Card>
                    </Pressable>
                )}
            />
        </ScrollView>
    );
}
