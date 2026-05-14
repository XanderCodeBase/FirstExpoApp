import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Save } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';

import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { db } from '@/db';
import { tasks } from '@/db/schema';

export default function EditTaskScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const { data: taskData } = useLiveQuery(db.select().from(tasks).where(eq(tasks.id, id!)));

    const task = taskData?.[0];

    const [form, setForm] = useState({
        title: '',
        description: '',
        is_completed: false,
        due_date: '',
        start_date: '',
        life_domains: '',
        priority: 0,
    });

    useEffect(() => {
        if (task) {
            setForm({
                title: task.title,
                description: task.description || '',
                is_completed: task.is_completed || false,
                due_date: task.due_date || '',
                start_date: task.start_date || '',
                life_domains: task.life_domains || '',
                priority: task.priority || 0,
            });
        }
    }, [task]);

    const handleUpdate = async () => {
        if (!form.title.trim()) {
            Alert.alert('Error', 'Title is required');
            return;
        }

        await db
            .update(tasks)
            .set({
                title: form.title,
                description: form.description || null,
                is_completed: form.is_completed,
                due_date: form.due_date || null,
                start_date: form.start_date || null,
                life_domains: form.life_domains || null,
                priority: form.priority,
                updated_at: new Date().toISOString(),
            })
            .where(eq(tasks.id, id!));

        Alert.alert('Success', 'Task updated successfully');
        router.back();
    };

    if (!task) {
        return (
            <Box className="flex-1 items-center justify-center">
                <Text>Loading task...</Text>
            </Box>
        );
    }

    return (
        <Box className="flex-1 bg-gray-50 dark:bg-zinc-950">
            <HStack className="items-center justify-between border-b bg-white px-6 py-4 dark:bg-zinc-900">
                <Pressable onPress={() => router.back()} className="p-2">
                    <ArrowLeft size={28} />
                </Pressable>
                <Text className="text-2xl font-semibold">Edit Task</Text>
                <Button onPress={handleUpdate} className="rounded-xl">
                    <Save color="white" size={24} />
                    <Text className="ml-2 font-medium text-white">Update</Text>
                </Button>
            </HStack>

            <ScrollView className="flex-1 p-6">
                <VStack space="md">
                    {/* Same Input + InputField structure as New Task */}
                    <VStack>
                        <Text className="mb-1.5 font-medium">Title *</Text>
                        <Input>
                            <InputField
                                placeholder="Enter task title"
                                value={form.title}
                                onChangeText={(text: string) => setForm({ ...form, title: text })}
                            />
                        </Input>
                    </VStack>

                    <VStack>
                        <Text className="mb-1.5 font-medium">Description</Text>
                        <Input>
                            <InputField
                                placeholder="Enter description"
                                value={form.description}
                                onChangeText={(text: string) =>
                                    setForm({ ...form, description: text })
                                }
                                multiline
                                numberOfLines={4}
                                className="min-h-[100px]"
                            />
                        </Input>
                    </VStack>

                    {/* Add the other fields (Due Date, Start Date, Life Domains, Priority) exactly like in NewTask */}

                    <HStack className="items-center justify-between py-2">
                        <Text className="font-medium">Mark as completed</Text>
                        <Switch
                            value={form.is_completed}
                            onValueChange={(val: boolean) =>
                                setForm({ ...form, is_completed: val })
                            }
                        />
                    </HStack>
                </VStack>
            </ScrollView>
        </Box>
    );
}
