import React, { forwardRef, ReactNode } from 'react';
import { View } from 'react-native';

import {
    BottomSheet,
    BottomSheetBackdrop,
    BottomSheetContent,
    BottomSheetDragIndicator,
    BottomSheetPortal,
} from '@/components/ui/bottomsheet';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

type Props = {
    title?: string;
    children: ReactNode;
    showFooter?: boolean;
    confirmText?: string;
    cancelText?: string;
    onClose: () => void;
    onConfirm?: () => void;
};

const BottomSheetModal = forwardRef<any, Props>(function BottomSheetModal(props, ref) {
    return (
        <BottomSheet ref={ref}>
            <BottomSheetPortal
                snapPoints={['44%']}
                backdropComponent={BottomSheetBackdrop}
                handleComponent={BottomSheetDragIndicator}
                enablePanDownToClose={true}
                onClose={props.onClose}
            >
                <BottomSheetContent className="grid gap-2 px-8 py-4">
                    {/* Title */}
                    {props.title && (
                        <Text className="text-center text-xl font-semibold">{props.title}</Text>
                    )}

                    {/* Dynamic Content */}
                    <View>{props.children}</View>

                    {/* Optional Footer Buttons */}
                    {props.showFooter !== false && (
                        <View className="flex-row gap-3">
                            <Button variant="outline" onPress={props.onClose} className="flex-1">
                                <Text>{props.cancelText || 'Cancel'}</Text>
                            </Button>

                            {props.onConfirm && (
                                <Button onPress={props.onConfirm} className="flex-1">
                                    <Text className="text-white">
                                        {props.confirmText || 'Confirm'}
                                    </Text>
                                </Button>
                            )}
                        </View>
                    )}
                </BottomSheetContent>
            </BottomSheetPortal>
        </BottomSheet>
    );
});

BottomSheetModal.displayName = 'BottomSheetModal';

export default BottomSheetModal;
