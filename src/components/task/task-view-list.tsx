import { FlashList } from '@shopify/flash-list';

import TaskView from '@/components/task/task-view';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { useTasksForDate } from '@/db/hooks/useTasks';

export default function DailyContent({ date }: { date: Date }) {
    const { data: tasks = [] } = useTasksForDate(date);

    return (
        <FlashList
            data={tasks}
            keyExtractor={(item) => item.occurrenceId}
            renderItem={({ item }) => <TaskView task={item} />}
            ListEmptyComponent={
                <Box className="items-center justify-center py-20">
                    <Text className="text-lg text-gray-400">No tasks yet</Text>
                </Box>
            }
        />
    );
}
