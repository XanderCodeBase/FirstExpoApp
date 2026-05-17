import { FlashList } from '@shopify/flash-list';
import { addDays, format, isToday, subDays } from 'date-fns';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import React, { useState } from 'react';

import TaskView from '@/components/task/task-view';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTasksForDate } from '@/db/hooks/useTasks';

export default function DailyOverviewScreen() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const { data: tasks = [] } = useTasksForDate(selectedDate); // isLoading, refetch

    const goToPreviousDay = () => setSelectedDate(subDays(selectedDate, 1));
    const goToNextDay = () => setSelectedDate(addDays(selectedDate, 1));
    const goToToday = () => setSelectedDate(new Date());

    const displayDate = format(selectedDate, 'EEEE, MMMM d, yyyy');
    const isTodayDate = isToday(selectedDate);

    return (
        <Box className="flex-1 bg-gray-50 dark:bg-zinc-950">
            <HStack className="items-center justify-between border-b bg-white px-6 py-4 dark:bg-zinc-900">
                <Pressable onPress={goToPreviousDay} className="p-3">
                    <ArrowLeft size={24} />
                </Pressable>

                <VStack className="items-center">
                    <Text className="text-xl font-semibold">
                        {isTodayDate ? 'Today' : displayDate} ({tasks.length})
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
                data={tasks}
                keyExtractor={(item) => item.occurrenceId}
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
