import { ScrollView } from 'react-native';

import { Heading } from '@/components/ui/heading';

export default function ProfileScreen() {
    return (
        <ScrollView className="flex-1 bg-slate-900 p-4">
            <Heading size="3xl" bold className="mb-2 text-white">
                Profile
            </Heading>
        </ScrollView>
    );
}
