import { desc, eq, sql } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useRouter } from 'expo-router';
import { Calendar, Edit2, Flag, Plus, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, FlatList, RefreshControl } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import { Badge } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { db } from '@/db';
import { tasks } from '@/db/schema';
import { Task } from '@/types/Task';

const PAGE_SIZE = 10;

export default function TasksScreen() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);

    const { data: taskList = [] } = useLiveQuery(
        db
            .select()
            .from(tasks)
            .where(eq(tasks.user_id, 'local-user'))
            .orderBy(desc(tasks.position), desc(tasks.due_date))
            .limit(PAGE_SIZE)
            .offset((page - 1) * PAGE_SIZE),
    );

    const totalQuery = useLiveQuery(db.select({ count: sql<number>`count(*)` }).from(tasks));
    const total = totalQuery.data?.[0]?.count || 0;

    const loadMore = () => {
        if (page * PAGE_SIZE < total) setPage((p) => p + 1);
    };

    const toggleComplete = async (id: string, current: boolean) => {
        await db
            .update(tasks)
            .set({ is_completed: !current, updated_at: new Date().toISOString() })
            .where(eq(tasks.id, id));
    };

    const deleteTask = (id: string) => {
        Alert.alert('Delete Task', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    await db.delete(tasks).where(eq(tasks.id, id));
                },
            },
        ]);
    };

    const renderRightActions = (id: string) => (
        <Pressable onPress={() => deleteTask(id)} className="justify-center bg-red-500 px-8">
            <Trash2 size={28} color="white" />
        </Pressable>
    );

    const renderTask = ({ item }: { item: Task }) => (
        <Box className="border-t border-gray-900">
            <Swipeable renderRightActions={() => renderRightActions(item.id)} rightThreshold={80}>
                <Pressable onPress={() => router.push(`/task/${item.id}`)} className="bg-white p-4">
                    <HStack className="items-start justify-between">
                        <HStack className="flex-1 items-start gap-3">
                            <Switch
                                value={item.is_completed || false}
                                onValueChange={() =>
                                    toggleComplete(item.id, item.is_completed || false)
                                }
                            />
                            <VStack className="flex-1">
                                <Text
                                    className={`text-lg font-semibold ${item.is_completed ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}
                                >
                                    {item.title}
                                </Text>
                                {item.description && (
                                    <Text
                                        className="mt-1 text-sm text-gray-500 dark:text-gray-400"
                                        numberOfLines={2}
                                    >
                                        {item.description}
                                    </Text>
                                )}
                                <HStack className="mt-3 flex-wrap gap-2">
                                    {item.due_date && (
                                        <Badge
                                            variant="outline"
                                            className="flex-row items-center gap-1"
                                        >
                                            <Calendar size={16} />
                                            <Text className="text-xs">
                                                {new Date(item.due_date).toLocaleDateString()}
                                            </Text>
                                        </Badge>
                                    )}
                                    {item.life_domains && (
                                        <Badge className="flex-row items-center gap-1">
                                            <Flag size={16} />
                                            <Text className="text-xs">{item.life_domains}</Text>
                                        </Badge>
                                    )}
                                </HStack>
                            </VStack>
                        </HStack>

                        <Pressable
                            onPress={() => router.push(`/task/edit/${item.id}`)}
                            className="p-2"
                        >
                            <Edit2 size={24} className="text-blue-600" />
                        </Pressable>
                    </HStack>
                </Pressable>
            </Swipeable>
        </Box>
    );

    return (
        <Box className="flex-1 bg-gray-50 dark:bg-zinc-950">
            <HStack className="items-center justify-between border-b border-gray-200 bg-white px-6 pb-6 pt-12 dark:border-zinc-800 dark:bg-zinc-900">
                <Text className="text-3xl font-bold text-gray-900 dark:text-white">My Tasks</Text>
                <Button onPress={() => router.push('/task/new')} className="rounded-2xl">
                    <Plus color="white" size={28} />
                </Button>
            </HStack>

            <FlatList
                data={taskList}
                keyExtractor={(item) => item.id}
                renderItem={renderTask}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => setPage(1)} />
                }
                ListEmptyComponent={
                    <Box className="items-center justify-center py-20">
                        <Text className="text-lg text-gray-400">No tasks yet</Text>
                        <Text className="mt-1 text-gray-400">Tap + to create one</Text>
                    </Box>
                }
            />
        </Box>
    );
}
