import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Edit2, Flag } from 'lucide-react-native';
import React from 'react';
import { ScrollView } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { db } from '@/db';
import { tasks } from '@/db/schema';

export default function TaskDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const { data: taskData } = useLiveQuery(db.select().from(tasks).where(eq(tasks.id, id!)));

    const task = taskData?.[0];

    if (!task) {
        return (
            <Box className="flex-1 items-center justify-center">
                <Text>Task not found</Text>
            </Box>
        );
    }

    return (
        <Box className="flex-1 bg-gray-50 dark:bg-zinc-950">
            <HStack className="items-center justify-between border-b bg-white px-6 py-4 dark:bg-zinc-900">
                <Pressable onPress={() => router.back()} className="p-2">
                    <ArrowLeft size={28} />
                </Pressable>
                <Text className="text-2xl font-semibold">Task Detail</Text>
                <Button onPress={() => router.push(`/task/edit/${id}`)}>
                    <Edit2 size={24} color="white" />
                </Button>
            </HStack>

            <ScrollView className="flex-1 p-6">
                <VStack space="lg">
                    <Text
                        className={`text-3xl font-bold ${task.is_completed ? 'text-gray-400 line-through' : ''}`}
                    >
                        {task.title}
                    </Text>

                    {task.description && (
                        <Text className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                            {task.description}
                        </Text>
                    )}

                    <HStack className="flex-wrap gap-3">
                        {task.due_date && (
                            <Badge variant="outline" className="flex-row items-center gap-2">
                                <Calendar size={18} />
                                <Text>{new Date(task.due_date).toLocaleDateString()}</Text>
                            </Badge>
                        )}

                        {task.start_date && (
                            <Badge variant="outline">
                                <Text>Start: {new Date(task.start_date).toLocaleDateString()}</Text>
                            </Badge>
                        )}

                        {task.life_domains && (
                            <Badge className="flex-row items-center gap-2">
                                <Flag size={18} />
                                <Text>{task.life_domains}</Text>
                            </Badge>
                        )}
                    </HStack>

                    <Box className="rounded-2xl bg-white p-5 dark:bg-zinc-800">
                        <Text className="mb-2 font-medium">Status</Text>
                        <Text
                            className={`text-lg font-semibold ${task.is_completed ? 'text-green-600' : 'text-orange-600'}`}
                        >
                            {task.is_completed ? '✅ Completed' : '⏳ In Progress'}
                        </Text>
                    </Box>
                </VStack>
            </ScrollView>
        </Box>
    );
}
