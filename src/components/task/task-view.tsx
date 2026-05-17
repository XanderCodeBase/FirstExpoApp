import { router } from 'expo-router';
import { Calendar, Edit2, Flag, Trash2 } from 'lucide-react-native';
import React, { useRef } from 'react';
import { Animated } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import { Badge } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useDeleteTaskOccurrence, useToggleTaskCompletion } from '@/db/hooks/useTasks';
import { TaskWithOccurrence } from '@/db/types';

export default function TaskView({ task }: { task: TaskWithOccurrence }) {
    const deleteMutation = useDeleteTaskOccurrence();
    const completeMutation = useToggleTaskCompletion();

    const heightAnim = useRef(new Animated.Value(72)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;
    const translateXAnim = useRef(new Animated.Value(0)).current;

    const deleteTask = () => {
        Animated.parallel([
            Animated.timing(heightAnim, {
                toValue: 0,
                duration: 280,
                useNativeDriver: false,
            }),
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 220,
                useNativeDriver: false,
            }),
            Animated.timing(translateXAnim, {
                toValue: -80,
                duration: 280,
                useNativeDriver: false,
            }),
        ]).start(async () => {
            deleteMutation.mutate(task.occurrenceId);
        });
    };

    const renderRightActions = () => (
        <Pressable onPress={deleteTask} className="justify-center bg-red-500 px-8">
            <Trash2 size={28} color="white" />
        </Pressable>
    );

    return (
        <Animated.View
            style={{
                height: heightAnim,
                opacity: opacityAnim,
                transform: [{ translateX: translateXAnim }],
                overflow: 'hidden',
            }}
        >
            <Box className="border-t border-gray-900">
                <Swipeable
                    renderRightActions={renderRightActions}
                    rightThreshold={80}
                    overshootRight={false}
                    friction={2}
                    onSwipeableOpen={(direction) => direction === 'left' && deleteTask()}
                >
                    <Pressable
                        onPress={() => router.push(`/task/${task.occurrenceId}`)}
                        className="bg-white p-4"
                    >
                        <HStack className="items-start justify-between">
                            <HStack className="flex-1 items-start gap-3">
                                <Switch
                                    value={task.isCompleted}
                                    onValueChange={() => {
                                        completeMutation.mutate(task);
                                    }}
                                />
                                <VStack className="flex-1">
                                    <Text
                                        className={`text-lg font-semibold ${task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}
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
                                        {task.occurrenceDate && (
                                            <Badge
                                                variant="outline"
                                                className="flex-row items-center gap-1"
                                            >
                                                <Calendar size={16} />
                                                <Text className="text-xs">
                                                    {new Date(
                                                        task.occurrenceDate,
                                                    ).toLocaleDateString()}
                                                </Text>
                                            </Badge>
                                        )}
                                        {task.lifeDomains && (
                                            <Badge className="flex-row items-center gap-1">
                                                <Flag size={16} />
                                                <Text className="text-xs">{task.lifeDomains}</Text>
                                            </Badge>
                                        )}
                                    </HStack>
                                </VStack>
                            </HStack>

                            <Pressable
                                onPress={() => router.push(`/task/edit/${task.occurrenceId}`)}
                                className="p-2"
                            >
                                <Edit2 size={24} className="text-blue-600" />
                            </Pressable>
                        </HStack>
                    </Pressable>
                </Swipeable>
            </Box>
        </Animated.View>
    );
}
