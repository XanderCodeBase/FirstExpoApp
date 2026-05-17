import { useRouter } from 'expo-router';
import { Save } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

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
    SelectInput,
    SelectItem,
    SelectPortal,
    SelectTrigger,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useCreateTask } from '@/db/hooks/useTasks';
import { life_domains, LifeDomainKeys } from '@/types/life_domains';

type FrequencyType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export default function NewTaskScreen() {
    const router = useRouter();
    const createMutation = useCreateTask();

    const [form, setForm] = useState({
        title: '',
        description: '',
        start_date: '' as string,
        due_date: '' as string,
        life_domains: '',
        priority: 0,

        // Recurrence
        is_recurring: false,
        frequency: 'daily' as FrequencyType,
        interval: 1,
        days_of_week: [] as number[], // 1=Mon, 2=Tue...
        time_of_day: '12:00:00',
        end_date: '' as string,
    });

    const [showModal, setShowModal] = useState(false);
    const [currentField, setCurrentField] = useState<'start_date' | 'due_date' | 'end_date' | null>(
        null,
    );
    const [tempDate, setTempDate] = useState(new Date());

    const openPicker = (field: 'start_date' | 'due_date' | 'end_date') => {
        setCurrentField(field);
        setTempDate(form[field] ? new Date(form[field]) : new Date());
        setShowModal(true);
    };

    const handleConfirm = () => {
        if (currentField) {
            setForm((prev) => ({ ...prev, [currentField]: tempDate.toISOString() }));
        }
        setShowModal(false);
    };

    const formatDisplay = (isoString: string) =>
        isoString
            ? new Date(isoString).toLocaleString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
              })
            : 'Not set';

    const toggleDayOfWeek = (day: number) => {
        setForm((prev) => ({
            ...prev,
            days_of_week: prev.days_of_week.includes(day)
                ? prev.days_of_week.filter((d) => d !== day)
                : [...prev.days_of_week, day].sort((a, b) => a - b),
        }));
    };

    const handleSave = async () => {
        if (!form.title.trim()) {
            Alert.alert('Error', 'Title is required');
            return;
        }

        createMutation.mutate(
            {
                title: form.title,
                description: form.description,
                start_date: form.start_date,
                due_date: form.due_date,
                life_domains: form.life_domains,
                priority: form.priority,
                is_recurring: form.is_recurring,
                frequency: form.frequency,
                interval: form.interval,
                days_of_week: form.days_of_week,
                time_of_day: form.time_of_day,
                end_date: form.end_date,
            },
            {
                onSuccess: (taskId) => {
                    Alert.alert('Success', 'Task created successfully!', taskId);
                    router.back();
                },
            },
        );
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
                    {/* Title & Description */}
                    <VStack>
                        <Text className="mb-1.5 font-medium">Title *</Text>
                        <Input>
                            <InputField
                                value={form.title}
                                onChangeText={(t) => setForm({ ...form, title: t })}
                                placeholder="Task title"
                            />
                        </Input>
                    </VStack>

                    <VStack>
                        <Text className="mb-1.5 font-medium">Description</Text>
                        <Input>
                            <InputField
                                multiline
                                numberOfLines={4}
                                value={form.description}
                                onChangeText={(t) => setForm({ ...form, description: t })}
                            />
                        </Input>
                    </VStack>

                    {/* Life Domain */}
                    <VStack>
                        <Text className="mb-1.5 font-medium">Life Domain</Text>
                        <Select onValueChange={(v) => setForm({ ...form, life_domains: v })}>
                            <SelectTrigger>
                                <SelectInput
                                    placeholder="Select domain"
                                    value={form.life_domains}
                                />
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop />
                                <SelectContent>
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

                    {/* Recurrence Section */}
                    <HStack className="items-center justify-between py-3">
                        <Text className="font-medium">Repeat task</Text>
                        <Switch
                            value={form.is_recurring}
                            onValueChange={(v) => setForm({ ...form, is_recurring: v })}
                        />
                    </HStack>

                    {form.is_recurring && (
                        <VStack space="md" className="ml-1 border-l-2 border-blue-500 pl-4">
                            <VStack>
                                <Text className="text-typography-700 mb-1.5 font-medium">
                                    Frequency
                                </Text>
                                <Select
                                    onValueChange={(value: FrequencyType) =>
                                        setForm({ ...form, frequency: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectInput value={form.frequency} />
                                    </SelectTrigger>
                                    <SelectPortal>
                                        <SelectBackdrop />
                                        <SelectContent>
                                            <SelectItem value="daily" label="Daily" />
                                            <SelectItem value="weekly" label="Weekly" />
                                            <SelectItem value="monthly" label="Monthly" />
                                            <SelectItem value="yearly" label="Yearly" />
                                        </SelectContent>
                                    </SelectPortal>
                                </Select>
                            </VStack>

                            <VStack>
                                <Text className="text-typography-700 mb-1.5 font-medium">
                                    Every
                                </Text>
                                <Input>
                                    <InputField
                                        keyboardType="numeric"
                                        value={form.interval.toString()}
                                        onChangeText={(text) =>
                                            setForm({ ...form, interval: parseInt(text) || 1 })
                                        }
                                    />
                                </Input>
                            </VStack>

                            {/* Weekly Days */}
                            {form.frequency === 'weekly' && (
                                <VStack>
                                    <Text className="text-typography-700 mb-2 font-medium">
                                        On these days
                                    </Text>
                                    <View className="flex-row flex-wrap gap-2">
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                                            (day, index) => {
                                                const dayNum = index + 1;
                                                const isSelected =
                                                    form.days_of_week.includes(dayNum);
                                                return (
                                                    <Pressable
                                                        key={day}
                                                        onPress={() => toggleDayOfWeek(dayNum)}
                                                        className={`rounded-full border px-4 py-2 ${
                                                            isSelected
                                                                ? 'border-blue-600 bg-blue-600'
                                                                : 'border-gray-300'
                                                        }`}
                                                    >
                                                        <Text
                                                            className={
                                                                isSelected ? 'text-white' : ''
                                                            }
                                                        >
                                                            {day}
                                                        </Text>
                                                    </Pressable>
                                                );
                                            },
                                        )}
                                    </View>
                                </VStack>
                            )}

                            {/* Time of Day */}
                            <VStack>
                                <Text className="text-typography-700 mb-1.5 font-medium">
                                    Time of day
                                </Text>
                                <Pressable onPress={() => openPicker('start_date')}>
                                    {/* Reuse for time */}
                                    <Input pointerEvents="none">
                                        <InputField value={form.time_of_day} editable={false} />
                                    </Input>
                                </Pressable>
                            </VStack>

                            {/* End Date */}
                            <VStack>
                                <Text className="text-typography-700 mb-1.5 font-medium">
                                    End date (optional)
                                </Text>
                                <Pressable onPress={() => openPicker('end_date')}>
                                    <Input pointerEvents="none">
                                        <InputField
                                            value={formatDisplay(form.end_date)}
                                            editable={false}
                                        />
                                    </Input>
                                </Pressable>
                            </VStack>
                        </VStack>
                    )}

                    {/* Start & Due Date */}
                    <VStack>
                        <Text className="mb-1.5 font-medium">Start Date</Text>
                        <Pressable onPress={() => openPicker('start_date')}>
                            <Input pointerEvents="none">
                                <InputField
                                    value={formatDisplay(form.start_date)}
                                    editable={false}
                                />
                            </Input>
                        </Pressable>
                    </VStack>

                    <VStack>
                        <Text className="mb-1.5 font-medium">Due Date</Text>
                        <Pressable onPress={() => openPicker('due_date')}>
                            <Input pointerEvents="none">
                                <InputField value={formatDisplay(form.due_date)} editable={false} />
                            </Input>
                        </Pressable>
                    </VStack>
                </VStack>
            </ScrollView>

            <DateTimePickerModal
                open={showModal}
                onClose={() => setShowModal(false)}
                currentField={currentField}
                value={tempDate}
                onChange={(e, date) => date && setTempDate(date)}
                onPress={handleConfirm}
            />
        </Box>
    );
}
