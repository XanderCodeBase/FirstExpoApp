import { FlashList } from '@shopify/flash-list';
import { addDays, endOfDay, format, isToday, startOfDay, subDays } from 'date-fns';
import { and, gte, lte } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import React, { useState } from 'react';

import TaskView from '@/components/task/task-view';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { db } from '@/db';
import { tasks } from '@/db/schema';

export default function DailyOverviewScreen() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const dayStart = startOfDay(currentDate).toISOString();
    const dayEnd = endOfDay(currentDate).toISOString();

    const { data: taskList = [] } = useLiveQuery(
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
            <HStack className="items-center justify-between border-b bg-white px-6 py-4 dark:bg-zinc-900">
                <Pressable onPress={goToPreviousDay} className="p-3">
                    <ArrowLeft size={24} />
                </Pressable>

                <VStack className="items-center">
                    <Text className="text-xl font-semibold">
                        {isTodayDate ? 'Today' : displayDate} ({taskList.length})
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

            <FlashList
                data={taskList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <TaskView task={item} />}
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
