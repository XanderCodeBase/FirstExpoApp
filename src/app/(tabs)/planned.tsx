import { FlashList } from '@shopify/flash-list';
import React from 'react';

import TaskView from '@/components/task/task-view';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { useAllTasks } from '@/db/hooks/useTasks';

export default function PlannedOverviewScreen() {
    const { data: tasks = [] } = useAllTasks(); // isLoading, refetch

    return (
        <Box className="flex-1 bg-gray-50 dark:bg-zinc-950">
            <HStack className="items-center justify-between border-b bg-white px-6 py-4 dark:bg-zinc-900">
                <Text className="text-xl font-semibold">Planned ({tasks.length})</Text>
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
