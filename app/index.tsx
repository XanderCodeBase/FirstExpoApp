import {FlatList, Pressable, View} from 'react-native'
import {router} from 'expo-router'
import {Screen} from '@/components/ui/Screen'
import {Text} from '@/components/ui/Text'
import {Card} from '@/components/ui/Card'
import {LogoutButton} from '@/components/LogoutButton'
import {useEffect, useState} from "react";
import {supabase} from "@/lib/supabase";
import {Item} from "@/types/Item";

export default function HomeScreen() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchItems = async () => {
        const {data, error} = await supabase
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
                <Text size="xl">Overview</Text>
            </View>

            <FlatList
                data={items}
                keyExtractor={(item) => "id" + item.id}
                renderItem={({item}) => (
                    <Pressable
                        onPress={() => router.push(`/items/${item.id}`)}
                    >
                        <Card>
                            <Text size="lg">{item.title}</Text>

                            <View className="mt-2">
                                <Text size="sm">{item.description}</Text>
                            </View>
                        </Card>
                    </Pressable>
                )}
            />

            {/* Footer with Logout */}
            <View className="p-4 border-t border-slate-800 bg-slate-900">
                <LogoutButton variant="default" />
            </View>
        </Screen>
    )
}
