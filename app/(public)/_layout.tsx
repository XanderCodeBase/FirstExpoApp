import { Stack } from 'expo-router';

export default function PublicLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="about"
                options={{ headerShown: false, title: 'About' }}
            />
        </Stack>
    );
}
