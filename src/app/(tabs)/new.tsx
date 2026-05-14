import { useRouter } from 'expo-router';
import { Save } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { v4 as uuidv4 } from 'uuid';

import DateTimePickerModal from '@/components/dateTime/DateTimePickerModal';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import {
    Select,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectInput,
    SelectItem,
    SelectPortal,
    SelectTrigger,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { db } from '@/db';
import { tasks } from '@/db/schema';
import { life_domains, LifeDomainKeys } from '@/types/life_domains';

export default function NewTaskScreen() {
    const router = useRouter();

    const [form, setForm] = useState({
        title: '',
        description: '',
        is_completed: false,
        due_date: '' as string,
        start_date: '' as string,
        life_domains: '',
        priority: 0,
    });

    const [showModal, setShowModal] = useState(false);
    const [currentField, setCurrentField] = useState<'due_date' | 'start_date' | null>(null);
    const [tempDate, setTempDate] = useState(new Date());

    const openPicker = (field: 'due_date' | 'start_date') => {
        setCurrentField(field);
        setTempDate(form[field] ? new Date(form[field]) : new Date());
        setShowModal(true);
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        if (selectedDate) setTempDate(selectedDate);
    };

    const handleConfirm = () => {
        if (currentField) {
            setForm((prev) => ({
                ...prev,
                [currentField]: tempDate.toISOString(),
            }));
        }
        setShowModal(false);
    };

    const handleCancel = () => setShowModal(false);

    const formatDisplay = (isoString: string) => {
        if (!isoString) return 'Not set';
        return new Date(isoString).toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    const handleSave = async () => {
        if (!form.title.trim()) {
            Alert.alert('Error', 'Title is required');
            return;
        }

        await db.insert(tasks).values({
            id: uuidv4(),
            title: form.title.trim(),
            description: form.description.trim() || null,
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
            <HStack className="items-center justify-between border-b bg-white px-6 py-4 dark:bg-zinc-900">
                <Text className="text-2xl font-semibold">New Task</Text>
                <Button onPress={handleSave} className="rounded-xl">
                    <Save color="white" size={24} />
                    <Text className="ml-2 font-medium text-white">Save</Text>
                </Button>
            </HStack>

            <ScrollView className="flex-1 p-6">
                <VStack space="lg">
                    <VStack>
                        <Text className="text-typography-700 mb-1.5 font-medium">Title *</Text>
                        <Input>
                            <InputField
                                placeholder="What needs to be done?"
                                value={form.title}
                                onChangeText={(text) => setForm({ ...form, title: text })}
                            />
                        </Input>
                    </VStack>

                    <VStack>
                        <Text className="text-typography-700 mb-1.5 font-medium">Description</Text>
                        <Input>
                            <InputField
                                placeholder="Add more details..."
                                value={form.description}
                                onChangeText={(text) => setForm({ ...form, description: text })}
                                multiline
                                numberOfLines={4}
                                className="min-h-[110px]"
                            />
                        </Input>
                    </VStack>

                    <VStack>
                        <Text className="text-typography-700 mb-1.5 font-medium">Life Domain</Text>
                        <Select
                            onValueChange={(value) => setForm({ ...form, life_domains: value })}
                        >
                            <SelectTrigger>
                                <SelectInput
                                    placeholder="Select a domain"
                                    value={form.life_domains}
                                />
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop />
                                <SelectContent>
                                    <SelectDragIndicatorWrapper>
                                        <SelectDragIndicator />
                                    </SelectDragIndicatorWrapper>
                                    {Object.entries(life_domains).map(([key, label]) => (
                                        <SelectItem
                                            key={key}
                                            value={key as LifeDomainKeys}
                                            label={label}
                                        />
                                    ))}
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                    </VStack>

                    {/* Start */}
                    <VStack>
                        <Text className="text-typography-700 mb-1.5 font-medium">Start</Text>
                        <Pressable className="flex-1" onPress={() => openPicker('start_date')}>
                            <Input pointerEvents="none">
                                <InputField
                                    value={formatDisplay(form.start_date)}
                                    editable={false}
                                />
                            </Input>
                        </Pressable>
                    </VStack>

                    {/* Due */}
                    <VStack>
                        <Text className="text-typography-700 mb-1.5 font-medium">Due</Text>
                        <Pressable className="flex-1" onPress={() => openPicker('due_date')}>
                            <Input pointerEvents="none">
                                <InputField value={formatDisplay(form.due_date)} editable={false} />
                            </Input>
                        </Pressable>
                    </VStack>

                    <HStack className="items-center justify-between py-3">
                        <Text className="font-medium">Mark as completed</Text>
                        <Switch
                            value={form.is_completed}
                            onValueChange={(val) => setForm({ ...form, is_completed: val })}
                        />
                    </HStack>
                </VStack>
            </ScrollView>

            {/* Date/Time Picker Modal */}
            <DateTimePickerModal
                open={showModal}
                onClose={handleCancel}
                currentField={currentField}
                value={tempDate}
                onChange={onDateChange}
                onPress={handleConfirm}
            />
        </Box>
    );
}
