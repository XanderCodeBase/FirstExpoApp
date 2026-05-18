import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform } from 'react-native';

import { createDate, formatDate } from '@/components/dateTime/dateUtil';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useBottomSheet } from '@/providers/BottomSheetProvider';

type Props = {
    title: string;
    initialDate: string;
    onSave: (newDate: string) => void;
};

export default function DateTimePickerField({ title, initialDate, onSave }: Props) {
    const { openBottomSheet } = useBottomSheet();
    const [selectedDate, setSelectedDate] = useState(createDate(initialDate));

    const openDatePicker = () => {
        openBottomSheet({
            title: `Select ${title}`,
            content: (
                <DateTimePicker
                    value={selectedDate}
                    mode="datetime"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    minuteInterval={15}
                    onChange={(_: any, date?: Date) => {
                        if (date) setSelectedDate(date);
                    }}
                />
            ),
            onConfirm: () => {
                onSave(selectedDate.toISOString());
            },
        });
    };

    return (
        <VStack>
            <Text className="mb-1.5 font-bold">{title}</Text>
            <Pressable onPress={openDatePicker}>
                <Text>{formatDate(initialDate ? selectedDate : undefined)}</Text>
            </Pressable>
        </VStack>
    );
}
