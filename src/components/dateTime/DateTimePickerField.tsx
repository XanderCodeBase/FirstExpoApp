import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useRef } from 'react';
import { Platform } from 'react-native';

import { formatDate, IOSMode } from '@/components/dateTime/dateUtil';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { useBottomSheet } from '@/providers/BottomSheetProvider';

type Props = {
    className?: string;
    title: string;
    initialDate?: Date;
    mode?: IOSMode;
    onSave: (newDate: Date) => void;
};

export default function DateTimePickerField({
    className,
    title,
    initialDate,
    mode = 'datetime',
    onSave,
}: Props) {
    const { openBottomSheet } = useBottomSheet();
    const selectedDateRef = useRef<Date>(initialDate);

    const openDatePicker = (value?: Date) => {
        openBottomSheet({
            title,
            content: (
                <DateTimePicker
                    value={value || new Date()}
                    mode={mode}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    minuteInterval={15}
                    onChange={(_: any, date?: Date) => {
                        if (date) selectedDateRef.current = date;
                    }}
                />
            ),
            onConfirm: () => {
                onSave(selectedDateRef.current || new Date());
            },
        });
    };

    return (
        <Pressable onPress={() => openDatePicker(initialDate)}>
            <Text className={className}>{formatDate(mode, initialDate)}</Text>
        </Pressable>
    );
}
