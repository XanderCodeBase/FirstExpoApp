import React, { createContext, ReactNode, useCallback, useContext, useRef, useState } from 'react';

import BottomSheetModal from '@/components/bottomSheetModal/BottomSheetModal';

type BottomSheetConfig = {
    title?: string;
    content: ReactNode;
    onConfirm?: () => void;
    showFooter?: boolean;
};

type BottomSheetContextType = {
    openBottomSheet: (config: BottomSheetConfig) => void;
    closeBottomSheet: () => void;
};

const BottomSheetContext = createContext<BottomSheetContextType | null>(null);

export function BottomSheetProvider({ children }: { children: React.ReactNode }) {
    const [config, setConfig] = useState<BottomSheetConfig | null>(null);

    const bottomSheetRef = useRef<any>(null);

    const openBottomSheet = useCallback((newConfig: BottomSheetConfig) => {
        setConfig(newConfig);
        bottomSheetRef.current?.open();
    }, []);

    const closeBottomSheet = useCallback(() => {
        bottomSheetRef.current?.close();
    }, []);

    const handleConfirm = useCallback(() => {
        config?.onConfirm?.();
        closeBottomSheet();
    }, [config, closeBottomSheet]);

    return (
        <BottomSheetContext.Provider value={{ openBottomSheet, closeBottomSheet }}>
            {children}

            <BottomSheetModal
                ref={bottomSheetRef}
                title={config?.title}
                onClose={closeBottomSheet}
                onConfirm={config?.onConfirm ? handleConfirm : undefined}
                showFooter={config?.showFooter}
            >
                {config?.content}
            </BottomSheetModal>
        </BottomSheetContext.Provider>
    );
}

export const useBottomSheet = () => {
    const context = useContext(BottomSheetContext);
    if (!context) {
        throw new Error('useBottomSheet must be used within BottomSheetProvider');
    }
    return context;
};
