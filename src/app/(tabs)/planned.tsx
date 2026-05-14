import { FlashList } from '@shopify/flash-list';
import { desc } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import React from 'react';

import TaskView from '@/components/task/task-view';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { db } from '@/db';
import { tasks } from '@/db/schema';

export default function PlannedOverviewScreen() {
    const { data: taskList = [] } = useLiveQuery(
        db.select().from(tasks).orderBy(desc(tasks.start_date)),
    );

    return (
        <Box className="flex-1 bg-gray-50 dark:bg-zinc-950">
            <HStack className="items-center justify-between border-b bg-white px-6 py-4 dark:bg-zinc-900">
                <Text className="text-xl font-semibold">Planned ({taskList.length})</Text>
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
