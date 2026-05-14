import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { Platform } from 'react-native';

import { Button } from '@/components/ui/button';
import {
    Modal,
    ModalBackdrop,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@/components/ui/modal';
import { Text } from '@/components/ui/text';

export default function DateTimePickerModal(props: {
    open: boolean;
    onClose: () => void;
    currentField: 'due_date' | 'start_date' | null;
    value: Date;
    onChange: (event: any, selectedDate?: Date) => void;
    onPress: () => void;
}) {
    return (
        <Modal isOpen={props.open} onClose={props.onClose}>
            <ModalBackdrop />
            <ModalContent className="max-w-[380px]">
                <ModalHeader>
                    <Text className="text-lg font-semibold">
                        {props.currentField === 'start_date' ? 'Select Start' : 'Select Due'} Date &
                        Time
                    </Text>
                </ModalHeader>

                <ModalBody contentContainerClassName="py-6 items-center">
                    {props.open && (
                        <DateTimePicker
                            value={props.value}
                            mode="datetime" // ← Combined mode
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={props.onChange}
                        />
                    )}
                </ModalBody>

                <ModalFooter className="gap-3">
                    <Button variant="outline" onPress={props.onClose} className="flex-1">
                        <Text>Cancel</Text>
                    </Button>
                    <Button onPress={props.onPress} className="flex-1">
                        <Text className="text-white">Confirm</Text>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
