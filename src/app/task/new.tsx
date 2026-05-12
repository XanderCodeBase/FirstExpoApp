// app/tasks/new.tsx
import { useRouter } from 'expo-router';
import { Flag, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView } from 'react-native';

import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
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

export default function NewTaskScreen() {
    const router = useRouter();

    const [task, setTask] = useState({
        title: '',
        description: '',
        is_completed: false,
        due_date: '',
        life_domains: '',
        priority: 3,
    });

    const [loading, setLoading] = useState(false);

    const createTask = async () => {
        if (!task.title.trim()) {
            Alert.alert('Error', 'Task title is required');
            return;
        }

        setLoading(true);

        const { error } = await supabase.from('tasks').insert({
            title: task.title.trim(),
            description: task.description.trim() || null,
            is_completed: task.is_completed,
            due_date: task.due_date || null,
            life_domains: task.life_domains.trim() || null,
            priority: task.priority,
        });

        setLoading(false);

        if (error) {
            Alert.alert('Error', 'Failed to create task');
            console.error(error);
        } else {
            router.back(); // Go back to tasks list
        }
    };

    return (
        <ScrollView className="flex-1 bg-gray-50 dark:bg-zinc-950">
            <Box className="p-6 pt-12">
                <VStack space="6">
                    {/* Header */}
                    <HStack className="mb-2 items-center gap-3">
                        <Icon as={Plus} size="xl" className="text-blue-600" />
                        <Text className="text-3xl font-bold text-gray-900 dark:text-white">
                            New Task
                        </Text>
                    </HStack>

                    {/* Title */}
                    <Input
                        value={task.title}
                        onChangeText={(text) =>
                            setTask({ ...task, title: text })
                        }
                        placeholder="What needs to be done?"
                        className="text-xl font-semibold"
                    />

                    {/* Description */}
                    <Textarea
                        value={task.description}
                        onChangeText={(text) =>
                            setTask({ ...task, description: text })
                        }
                        placeholder="Add more details (optional)"
                        className="min-h-[120px]"
                    />

                    {/* Completed Toggle */}
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

                    {/* Due Date */}
                    <Input
                        label="Due Date"
                        type="datetime-local"
                        value={task.due_date?.slice(0, 16) || ''}
                        onChangeText={(text) =>
                            setTask({ ...task, due_date: text })
                        }
                        placeholder="Select due date & time"
                    />

                    {/* Life Domains */}
                    <Input
                        label="Life Domains"
                        value={task.life_domains}
                        onChangeText={(text) =>
                            setTask({ ...task, life_domains: text })
                        }
                        placeholder="e.g. Physical Health, Work, Family"
                        leftIcon={<Icon as={Flag} className="text-gray-400" />}
                    />

                    {/* Priority */}
                    <VStack space="2">
                        <Text className="px-1 text-sm font-medium text-gray-500">
                            Priority
                        </Text>
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
                                <SelectItem
                                    label="Priority 1 (Highest)"
                                    value="1"
                                />
                                <SelectItem label="Priority 2" value="2" />
                                <SelectItem
                                    label="Priority 3 (Medium)"
                                    value="3"
                                />
                                <SelectItem label="Priority 4" value="4" />
                                <SelectItem
                                    label="Priority 5 (Lowest)"
                                    value="5"
                                />
                            </SelectContent>
                        </Select>
                    </VStack>

                    {/* Action Buttons */}
                    <VStack space="4" className="mt-6">
                        <Button
                            onPress={createTask}
                            size="lg"
                            isDisabled={loading || !task.title.trim()}
                        >
                            <Text className="text-lg font-semibold text-white">
                                {loading ? 'Creating...' : 'Create Task'}
                            </Text>
                        </Button>

                        <Button
                            variant="outline"
                            onPress={() => router.back()}
                            size="lg"
                        >
                            <Text>Cancel</Text>
                        </Button>
                    </VStack>
                </VStack>
            </Box>
        </ScrollView>
    );
}
