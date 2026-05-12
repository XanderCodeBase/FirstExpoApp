import { useRouter } from 'expo-router';
import { Calendar, Edit2, Flag, Plus, Trash2 } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { supabase } from '@/lib/supabase';
import { Task } from '@/types/task';

export default function TasksScreen() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .order('position', { ascending: true })
            .order('due_date', { ascending: true });

        if (error) console.error('Error fetching tasks:', error);
        else setTasks(data || []);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const toggleComplete = async (id: string, current: boolean) => {
        await supabase
            .from('tasks')
            .update({ is_completed: !current })
            .eq('id', id);
        fetchTasks();
    };

    const deleteTask = (id: string) => {
        Alert.alert('Delete Task', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    await supabase.from('tasks').delete().eq('id', id);
                    fetchTasks();
                },
            },
        ]);
    };

    const renderTask = ({ item }: { item: Task }) => (
        <Pressable
            onPress={() => router.push(`/task/${item.id}`)}
            className="mb-3 px-4"
        >
            <Box className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
                <HStack className="items-start justify-between">
                    <HStack className="flex-1 items-start gap-3">
                        <Switch
                            value={item.is_completed}
                            onValueChange={() =>
                                toggleComplete(item.id, item.is_completed)
                            }
                            className="mt-0.5"
                        />

                        <VStack className="flex-1">
                            <Text
                                className={`text-lg font-semibold ${
                                    item.is_completed
                                        ? 'text-gray-400 line-through'
                                        : 'text-gray-900 dark:text-white'
                                }`}
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
                                        <Calendar size={28} />
                                        <Text className="text-xs">
                                            {new Date(
                                                item.due_date,
                                            ).toLocaleDateString()}
                                        </Text>
                                    </Badge>
                                )}

                                {item.life_domains && (
                                    <Badge className="flex-row items-center gap-1">
                                        <Flag size={28} />
                                        <Text className="text-xs">
                                            {item.life_domains}
                                        </Text>
                                    </Badge>
                                )}
                            </HStack>
                        </VStack>
                    </HStack>

                    <HStack className="gap-1">
                        <Pressable
                            onPress={() => router.push(`/task/${item.id}`)}
                            className="p-3 active:opacity-70"
                        >
                            <Edit2 size={28} className="text-blue-600" />
                        </Pressable>
                        <Pressable
                            onPress={() => deleteTask(item.id)}
                            className="p-3 active:opacity-70"
                        >
                            <Trash2 size={28} className="text-red-500" />
                        </Pressable>
                    </HStack>
                </HStack>
            </Box>
        </Pressable>
    );

    return (
        <Box className="flex-1 bg-gray-50 dark:bg-zinc-950">
            {/* Header */}
            <HStack className="items-center justify-between border-b border-gray-200 bg-white px-6 pt-12 pb-6 dark:border-zinc-800 dark:bg-zinc-900">
                <Text className="text-3xl font-bold text-gray-900 dark:text-white">
                    My Tasks
                </Text>
                <Button
                    onPress={() => router.push('/task/new')}
                    size="default"
                    className="rounded-2xl"
                >
                    <Plus color="white" size={28} />
                </Button>
            </HStack>

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={renderTask}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={fetchTasks}
                    />
                }
                ListEmptyComponent={
                    <Box className="items-center justify-center py-20">
                        <Text className="text-lg text-gray-400">
                            No tasks yet
                        </Text>
                        <Text className="mt-1 text-gray-400">
                            Tap + to create one
                        </Text>
                    </Box>
                }
            />
        </Box>
    );
}
