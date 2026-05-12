// app/tasks/[id].tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Flag } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';

import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectInput,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';
import { VStack } from '@/components/ui/vstack';
import { supabase } from '@/lib/supabase';
import { Task } from '@/types/task';

export default function TaskDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const isNew = id === 'new';

    const [task, setTask] = useState<Partial<Task>>({
        title: '',
        description: '',
        is_completed: false,
        due_date: '',
        life_domains: '',
        priority: 3,
    });

    useEffect(() => {
        if (!isNew) loadTask();
    }, [id]);

    const loadTask = async () => {
        const { data } = await supabase
            .from('tasks')
            .select('*')
            .eq('id', id)
            .single();
        if (data) setTask(data);
    };

    const saveTask = async () => {
        if (!task.title?.trim()) {
            Alert.alert('Error', 'Title is required');
            return;
        }

        const payload = {
            title: task.title,
            description: task.description,
            is_completed: task.is_completed,
            due_date: task.due_date || null,
            life_domains: task.life_domains,
            priority: task.priority,
        };

        if (isNew) {
            await supabase.from('tasks').insert(payload);
        } else {
            await supabase.from('tasks').update(payload).eq('id', id);
        }

        router.back();
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Task',
            'Are you sure you want to delete this task?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await supabase.from('tasks').delete().eq('id', id);
                        router.back();
                    },
                },
            ],
        );
    };

    return (
        <ScrollView className="flex-1 bg-gray-50 dark:bg-zinc-950">
            <Box className="p-6 pt-12">
                <VStack space="6">
                    <Input
                        value={task.title}
                        onChangeText={(text) =>
                            setTask({ ...task, title: text })
                        }
                        placeholder="Task title"
                        className="text-xl font-semibold"
                    />

                    <Textarea
                        value={task.description || ''}
                        onChangeText={(text) =>
                            setTask({ ...task, description: text })
                        }
                        placeholder="Add description..."
                        className="min-h-[100px]"
                    />

                    <HStack className="items-center justify-between px-1">
                        <Text className="text-base font-medium">
                            Mark as Completed
                        </Text>
                        <Switch
                            value={task.is_completed}
                            onValueChange={(val) =>
                                setTask({ ...task, is_completed: val })
                            }
                        />
                    </HStack>

                    <Input
                        label="Due Date"
                        type="datetime-local"
                        value={task.due_date?.slice(0, 16) || ''}
                        onChangeText={(text) =>
                            setTask({ ...task, due_date: text })
                        }
                        placeholder="Select due date"
                    />

                    <Input
                        label="Life Domains"
                        value={task.life_domains || ''}
                        onChangeText={(text) =>
                            setTask({ ...task, life_domains: text })
                        }
                        placeholder="health, work, family, finance..."
                        leftIcon={<Flag className="text-gray-400" />}
                    />

                    <Select
                        value={String(task.priority)}
                        onValueChange={(val) =>
                            setTask({ ...task, priority: parseInt(val) })
                        }
                    >
                        <SelectTrigger>
                            <SelectInput placeholder="Select Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            {[1, 2, 3, 4, 5].map((p) => (
                                <SelectItem
                                    key={p}
                                    label={`Priority ${p}`}
                                    value={String(p)}
                                />
                            ))}
                        </SelectContent>
                    </Select>

                    <Button onPress={saveTask} size="lg" className="mt-4">
                        <Text className="text-lg font-semibold text-white">
                            {isNew ? 'Create Task' : 'Save Changes'}
                        </Text>
                    </Button>

                    {!isNew && (
                        <Button
                            variant="outline"
                            onPress={handleDelete}
                            size="lg"
                        >
                            <Text className="font-medium text-red-500">
                                Delete Task
                            </Text>
                        </Button>
                    )}
                </VStack>
            </Box>
        </ScrollView>
    );
}
