import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Clock, Edit2, Flag } from 'lucide-react-native';
import React from 'react';
import { ScrollView } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTaskDetail } from '@/db/hooks/useTasks';

export default function TaskDetailScreen() {
    const router = useRouter();
    const { id, occurrenceId } = useLocalSearchParams<{ id?: string; occurrenceId?: string }>();
    const { data: task } = useTaskDetail(occurrenceId || id!); // isLoading, refetch

    if (!task) {
        return (
            <Box className="flex-1 items-center justify-center bg-gray-50 dark:bg-zinc-950">
                <Text>Task not found</Text>
            </Box>
        );
    }

    const displayTitle = task.customTitle || task.title;
    const displayDate = new Date(task.occurrenceDate);

    return (
        <Box className="flex-1 bg-gray-50 dark:bg-zinc-950">
            <HStack className="items-center justify-between border-b bg-white px-6 py-4 dark:bg-zinc-900">
                <Pressable onPress={() => router.back()} className="p-2">
                    <ArrowLeft size={28} />
                </Pressable>
                <Text className="text-2xl font-semibold">Task Detail</Text>
                <Button onPress={() => router.push(`/task/edit/${task.taskId}`)}>
                    <Edit2 size={24} color="white" />
                </Button>
            </HStack>

            <ScrollView className="flex-1 p-6">
                <VStack space="lg">
                    {/* Title */}
                    <Text
                        className={`text-3xl font-bold ${task.isCompleted ? 'text-gray-400 line-through' : ''}`}
                    >
                        {displayTitle}
                    </Text>
                    {/* Description */}
                    {task.description && (
                        <Text className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                            {task.description}
                        </Text>
                    )}
                    {/* Badges */}
                    <HStack className="flex-wrap gap-3">
                        {displayDate && (
                            <Badge variant="outline" className="flex-row items-center gap-2">
                                <Calendar size={18} />
                                <Text>{displayDate.toLocaleDateString()}</Text>
                            </Badge>
                        )}

                        {task.occurrenceDate && (
                            <Badge variant="outline" className="flex-row items-center gap-2">
                                <Clock size={18} />
                                <Text>
                                    {new Date(task.occurrenceDate).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </Text>
                            </Badge>
                        )}

                        {task.lifeDomains && (
                            <Badge className="flex-row items-center gap-2">
                                <Flag size={18} />
                                <Text>{task.lifeDomains}</Text>
                            </Badge>
                        )}

                        {task.isRecurring && (
                            <Badge variant="secondary">
                                <Text>🔄 Recurring</Text>
                            </Badge>
                        )}
                    </HStack>
                    {/* Status */}
                    <Box className="rounded-2xl bg-white p-5 dark:bg-zinc-800">
                        <Text className="mb-2 font-medium">Status</Text>
                        <Text
                            className={`text-lg font-semibold ${
                                task.isCompleted ? 'text-green-600' : 'text-orange-600'
                            }`}
                        >
                            {task.isCompleted ? '✅ Completed' : '⏳ Pending'}
                        </Text>
                        {task.completedAt && (
                            <Text className="mt-1 text-sm text-gray-500">
                                Completed on {new Date(task.completedAt).toLocaleString()}
                            </Text>
                        )}
                    </Box>
                    {/* Notes */}
                    {task.notes && (
                        <Box className="rounded-2xl bg-white p-5 dark:bg-zinc-800">
                            <Text className="mb-2 font-medium">Notes</Text>
                            <Text className="text-gray-600 dark:text-gray-300">{task.notes}</Text>
                        </Box>
                    )}
                </VStack>
            </ScrollView>
        </Box>
    );
}
