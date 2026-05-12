import { ScrollView } from 'react-native';

import { Heading } from '@/components/ui/heading';

export default function NotFoundScreen() {
    return (
        <ScrollView className="flex-1 p-4">
            <Heading size="3xl" bold className="mb-4 text-center text-white">
                Not Found
            </Heading>
        </ScrollView>
    );
}
