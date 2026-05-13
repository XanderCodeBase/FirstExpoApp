import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, TextInput } from 'react-native';

import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/providers/AuthProvider';

export default function ChangePassword() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { changePassword } = useAuth();

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'New password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await changePassword(oldPassword, newPassword);

            Alert.alert('Success', 'Your password has been updated successfully!', [
                { text: 'OK', onPress: () => router.back() },
            ]);
        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', error.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView className="flex-1 p-4">
            <Heading size="3xl" bold className="mb-2 text-center text-white">
                Change Password
            </Heading>
            <Text className="mb-10 text-center text-slate-400">
                Enter your current and new password
            </Text>

            <TextInput
                className="mb-4 rounded-2xl border border-slate-700 bg-slate-800 p-5 text-base text-white"
                placeholder="Current Password"
                placeholderTextColor="#888"
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry
            />

            <TextInput
                className="mb-4 rounded-2xl border border-slate-700 bg-slate-800 p-5 text-base text-white"
                placeholder="New Password (min 6 characters)"
                placeholderTextColor="#888"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
            />

            <TextInput
                className="mb-8 rounded-2xl border border-slate-700 bg-slate-800 p-5 text-base text-white"
                placeholder="Confirm New Password"
                placeholderTextColor="#888"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />

            <Pressable
                onPress={handleChangePassword}
                disabled={loading}
                className="mb-6 rounded-2xl bg-blue-600 py-5 active:bg-blue-700"
            >
                <Text className="text-center text-lg font-semibold text-white">
                    {loading ? 'Updating...' : 'Update Password'}
                </Text>
            </Pressable>

            <Pressable onPress={() => router.back()} className="py-3">
                <Text className="text-center font-medium text-blue-400">Cancel</Text>
            </Pressable>
        </ScrollView>
    );
}
