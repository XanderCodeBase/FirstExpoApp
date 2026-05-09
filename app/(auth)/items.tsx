import { FlatList, Pressable, View, Text } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { useEffect, useState } from 'react';
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
        <Screen>
            <View className="mb-6">
                <Text className="text-3xl font-bold text-white">Overview</Text>
            </View>

            <FlatList
                data={items}
                keyExtractor={(item) => 'id' + item.id}
                renderItem={({ item }) => (
                    <Pressable onPress={() => router.push(`/item/${item.id}`)}>
                        <Card>
                            <Text className="text-xl font-semibold text-white">
                                {item.title}
                            </Text>

                            <View className="mt-2">
                                <Text className="text-white">
                                    {item.description}
                                </Text>
                            </View>
                        </Card>
                    </Pressable>
                )}
            />
        </Screen>
    );
}
