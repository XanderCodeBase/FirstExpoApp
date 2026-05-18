import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import React, { useMemo, useRef, useState } from 'react';
import { FlatList, useWindowDimensions, View } from 'react-native';

import DateTimePickerField from '@/components/dateTime/DateTimePickerField';
import { formatDate } from '@/components/dateTime/dateUtil';
import DailyContent from '@/components/task/task-view-list';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

const DAY_MS = 86_400_000;

const dateToEpochDay = (date: Date) => Math.floor(date.getTime() / DAY_MS);
const epochDayToDate = (day: number) => new Date(day * DAY_MS);

const BASE_EPOCH = dateToEpochDay(new Date());
const WINDOW_SIZE = 100000;
const CENTER = WINDOW_SIZE / 2;

export default function CalendarScreen() {
    const { width } = useWindowDimensions();
    const listRef = useRef<FlatList>(null);

    const [epochDay, setEpochDay] = useState(BASE_EPOCH);

    const data = useMemo(() => Array.from({ length: WINDOW_SIZE }, (_, i) => i), []);

    const goToEpochDay = (day: number) => {
        setEpochDay(day);

        const index = day - BASE_EPOCH + CENTER;

        requestAnimationFrame(() => {
            listRef.current?.scrollToIndex({
                index,
                animated: true,
            });
        });
    };

    const getDateFromIndex = (i: number) => {
        return epochDayToDate(BASE_EPOCH + (i - CENTER));
    };

    const initialDate = epochDayToDate(epochDay);

    return (
        <>
            <HStack className="items-center justify-between border-b bg-white px-6 py-4 dark:bg-zinc-900">
                <Pressable onPress={() => goToEpochDay(epochDay - 1)} className="p-3">
                    <ArrowLeft size={24} />
                </Pressable>

                <VStack className="items-center">
                    <DateTimePickerField
                        title={formatDate('date', initialDate)}
                        className="text-xl font-semibold"
                        initialDate={initialDate}
                        mode="date"
                        onSave={(newDate) => {
                            const newEpochDay = dateToEpochDay(newDate);
                            goToEpochDay(newEpochDay);
                        }}
                    />
                    {BASE_EPOCH !== epochDay && (
                        <Pressable onPress={() => goToEpochDay(BASE_EPOCH)}>
                            <Text className="text-sm text-blue-600">Go to Today</Text>
                        </Pressable>
                    )}
                </VStack>

                <Pressable onPress={() => goToEpochDay(epochDay + 1)} className="p-3">
                    <ArrowRight size={24} />
                </Pressable>
            </HStack>

            <FlatList
                ref={listRef}
                data={data}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(i) => i.toString()}
                initialScrollIndex={CENTER}
                getItemLayout={(_, i) => ({
                    length: width,
                    offset: width * i,
                    index: i,
                })}
                decelerationRate="fast"
                onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.x / width);

                    const newEpochDay = BASE_EPOCH + (index - CENTER);
                    setEpochDay(newEpochDay);
                }}
                renderItem={({ item: i }) => {
                    const date = getDateFromIndex(i);

                    return (
                        <View style={{ width }}>
                            <DailyContent date={date} />
                        </View>
                    );
                }}
            />
        </>
    );
}
