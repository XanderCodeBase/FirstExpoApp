import { addDays, endOfDay, format, isToday, startOfDay, subDays } from 'date-fns';
import { and, gte, lte } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useRouter } from 'expo-router';
import { ArrowLeft, ArrowRight, Calendar, Plus } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { ScrollView } from 'react-native';

import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { db } from '@/db';
import { tasks } from '@/db/schema';

export default function DailyOverview() {
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState(new Date());

    const dayStart = useMemo(() => startOfDay(currentDate).toISOString(), [currentDate]);
    const dayEnd = useMemo(() => endOfDay(currentDate).toISOString(), [currentDate]);

    const { data: dayTasks = [] } = useLiveQuery(
        db
            .select()
            .from(tasks)
            .where(and(gte(tasks.start_date, dayStart), lte(tasks.start_date, dayEnd)))
            .orderBy(tasks.start_date),
        [dayStart, dayEnd],
    );

    const goToPreviousDay = () => setCurrentDate(subDays(currentDate, 1));
    const goToNextDay = () => setCurrentDate(addDays(currentDate, 1));
    const goToToday = () => setCurrentDate(new Date());

    const displayDate = format(currentDate, 'EEEE, MMMM d, yyyy');
    const isTodayDate = isToday(currentDate);

    return (
        <Box className="flex-1 bg-gray-50 dark:bg-zinc-950">
            {/* Header */}
            <HStack className="items-center justify-between border-b bg-white px-6 py-4 dark:bg-zinc-900">
                <Pressable onPress={goToPreviousDay} className="p-3">
                    <ArrowLeft size={24} />
                </Pressable>

                <VStack className="items-center">
                    <Text className="text-xl font-semibold">
                        {isTodayDate ? 'Today' : displayDate}
                    </Text>
                    {!isTodayDate && (
                        <Pressable onPress={goToToday}>
                            <Text className="text-sm text-blue-600">Go to Today</Text>
                        </Pressable>
                    )}
                </VStack>

                <Pressable onPress={goToNextDay} className="p-3">
                    <ArrowRight size={24} />
                </Pressable>
            </HStack>

            {/* Add Task Button */}
            <HStack className="justify-end px-6 pt-4">
                <Button onPress={() => router.push('/task/new')} className="rounded-xl">
                    <Plus color="white" size={20} />
                    <Text className="ml-2">New Task</Text>
                </Button>
            </HStack>

            <ScrollView className="flex-1 px-6 pt-4">
                {dayTasks.length === 0 ? (
                    <VStack className="items-center justify-center py-20">
                        <Calendar size={60} className="text-gray-300" />
                        <Text className="mt-6 text-xl font-medium text-gray-400">
                            No tasks for this day
                        </Text>
                        <Text className="mt-2 text-gray-500">Swipe left/right to change days</Text>
                    </VStack>
                ) : (
                    <VStack space="lg">
                        {dayTasks.map((task) => {
                            const taskTime = task.start_date
                                ? format(new Date(task.start_date), 'HH:mm')
                                : 'No time';

                            return (
                                <Pressable
                                    key={task.id}
                                    onPress={() => router.push(`/task/${task.id}`)}
                                    className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-800"
                                >
                                    <HStack className="items-start justify-between">
                                        <VStack className="flex-1">
                                            <HStack className="items-center gap-3">
                                                <Text className="font-mono text-sm font-semibold text-blue-600">
                                                    {taskTime}
                                                </Text>
                                                {task.is_completed && (
                                                    <Text className="text-xs text-green-600">
                                                        ✓ Completed
                                                    </Text>
                                                )}
                                            </HStack>

                                            <Text
                                                className={`mt-1 text-lg font-semibold ${task.is_completed ? 'text-gray-400 line-through' : ''}`}
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

                                            {task.life_domains && (
                                                <Text className="mt-3 text-xs text-gray-500">
                                                    #{task.life_domains.replace(/_/g, ' ')}
                                                </Text>
                                            )}
                                        </VStack>
                                    </HStack>
                                </Pressable>
                            );
                        })}
                    </VStack>
                )}
            </ScrollView>
        </Box>
    );
}
