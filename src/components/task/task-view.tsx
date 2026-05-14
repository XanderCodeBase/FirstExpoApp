import { eq } from 'drizzle-orm';
import { router } from 'expo-router';
import { Calendar, Edit2, Flag, Trash2 } from 'lucide-react-native';
import React from 'react';
import { Alert } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import { Badge } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { db } from '@/db';
import { tasks } from '@/db/schema';
import { Task } from '@/types/Task';

export default function TaskView({ task }: { task: Task }) {
    const toggleComplete = async () => {
        await db
            .update(tasks)
            .set({ is_completed: !task.is_completed, updated_at: new Date().toISOString() })
            .where(eq(tasks.id, task.id));
    };

    const deleteTask = () => {
        Alert.alert('Delete Task', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    await db.delete(tasks).where(eq(tasks.id, task.id));
                },
            },
        ]);
    };

    const renderRightActions = () => (
        <Pressable onPress={deleteTask} className="justify-center bg-red-500 px-8">
            <Trash2 size={28} color="white" />
        </Pressable>
    );

    return (
        <Box className="border-t border-gray-900">
            <Swipeable
                renderRightActions={renderRightActions}
                rightThreshold={80}
                overshootRight={false}
                friction={2}
                onSwipeableOpen={(direction) => direction === 'right' && deleteTask()}
            >
                <Pressable onPress={() => router.push(`/task/${task.id}`)} className="bg-white p-4">
                    <HStack className="items-start justify-between">
                        <HStack className="flex-1 items-start gap-3">
                            <Switch
                                value={task.is_completed || false}
                                onValueChange={toggleComplete}
                            />
                            <VStack className="flex-1">
                                <Text
                                    className={`text-lg font-semibold ${task.is_completed ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}
                                >
                                    {task.title}
                                </Text>
                                {task.description && (
                                    <Text
                                        className="mt-1 text-sm text-gray-500 dark:text-gray-400"
                                        numberOfLines={2}
                                    >
                                        {task.description}
                                    </Text>
                                )}
                                <HStack className="mt-3 flex-wrap gap-2">
                                    {task.due_date && (
                                        <Badge
                                            variant="outline"
                                            className="flex-row items-center gap-1"
                                        >
                                            <Calendar size={16} />
                                            <Text className="text-xs">
                                                {new Date(task.due_date).toLocaleDateString()}
                                            </Text>
                                        </Badge>
                                    )}
                                    {task.life_domains && (
                                        <Badge className="flex-row items-center gap-1">
                                            <Flag size={16} />
                                            <Text className="text-xs">{task.life_domains}</Text>
                                        </Badge>
                                    )}
                                </HStack>
                            </VStack>
                        </HStack>

                        <Pressable
                            onPress={() => router.push(`/task/edit/${task.id}`)}
                            className="p-2"
                        >
                            <Edit2 size={24} className="text-blue-600" />
                        </Pressable>
                    </HStack>
                </Pressable>
            </Swipeable>
        </Box>
    );
}
