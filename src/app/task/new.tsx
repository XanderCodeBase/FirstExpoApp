import { useRouter } from 'expo-router';
import { ArrowLeft, Save } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { v4 as uuidv4 } from 'uuid';

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

export default function NewTaskScreen() {
    const router = useRouter();

    const [form, setForm] = useState({
        title: '',
        description: '',
        is_completed: false,
        due_date: '',
        start_date: '',
        life_domains: '',
        priority: 0,
    });

    const handleSave = async () => {
        if (!form.title.trim()) {
            Alert.alert('Error', 'Title is required');
            return;
        }

        await db.insert(tasks).values({
            id: uuidv4(),
            title: form.title,
            description: form.description || null,
            is_completed: form.is_completed,
            due_date: form.due_date || null,
            start_date: form.start_date || null,
            life_domains: form.life_domains || null,
            priority: form.priority,
            position: Date.now(),
            user_id: 'local-user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });

        Alert.alert('Success', 'Task created successfully');
        router.back();
    };

    return (
        <Box className="flex-1 bg-gray-50 dark:bg-zinc-950">
            <HStack className="items-center justify-between border-b bg-white px-6 pb-4 pt-12 dark:bg-zinc-900">
                <Pressable onPress={() => router.back()} className="p-2">
                    <ArrowLeft size={28} />
                </Pressable>
                <Text className="text-2xl font-semibold">New Task</Text>
                <Button onPress={handleSave} className="rounded-xl">
                    <Save color="white" size={24} />
                    <Text className="ml-2 font-medium text-white">Save</Text>
                </Button>
            </HStack>

            <ScrollView className="flex-1 p-6">
                <VStack space="md">
                    <VStack>
                        <Text className="mb-1.5 font-medium">Title *</Text>
                        <Input>
                            <InputField
                                placeholder="Enter task title"
                                value={form.title}
                                onChangeText={(text) => setForm({ ...form, title: text })}
                            />
                        </Input>
                    </VStack>

                    <VStack>
                        <Text className="mb-1.5 font-medium">Description</Text>
                        <Input>
                            <InputField
                                placeholder="Enter description"
                                value={form.description}
                                onChangeText={(text) => setForm({ ...form, description: text })}
                                multiline
                                numberOfLines={4}
                                className="min-h-[100px]"
                            />
                        </Input>
                    </VStack>

                    <VStack>
                        <Text className="mb-1.5 font-medium">Due Date</Text>
                        <Input>
                            <InputField
                                placeholder="YYYY-MM-DD"
                                value={form.due_date}
                                onChangeText={(text) => setForm({ ...form, due_date: text })}
                            />
                        </Input>
                    </VStack>

                    <VStack>
                        <Text className="mb-1.5 font-medium">Start Date</Text>
                        <Input>
                            <InputField
                                placeholder="YYYY-MM-DD"
                                value={form.start_date}
                                onChangeText={(text) => setForm({ ...form, start_date: text })}
                            />
                        </Input>
                    </VStack>

                    <VStack>
                        <Text className="mb-1.5 font-medium">Life Domains (comma separated)</Text>
                        <Input>
                            <InputField
                                placeholder="health, career, family"
                                value={form.life_domains}
                                onChangeText={(text) => setForm({ ...form, life_domains: text })}
                            />
                        </Input>
                    </VStack>

                    <HStack className="items-center justify-between py-2">
                        <Text className="font-medium">Mark as completed</Text>
                        <Switch
                            value={form.is_completed}
                            onValueChange={(val) => setForm({ ...form, is_completed: val })}
                        />
                    </HStack>

                    <VStack>
                        <Text className="mb-1.5 font-medium">Priority</Text>
                        <Input>
                            <InputField
                                keyboardType="numeric"
                                placeholder="0"
                                value={form.priority.toString()}
                                onChangeText={(text) =>
                                    setForm({ ...form, priority: parseInt(text) || 0 })
                                }
                            />
                        </Input>
                    </VStack>
                </VStack>
            </ScrollView>
        </Box>
    );
}
