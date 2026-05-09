import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { useAuth } from '@/providers/AuthProvider';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLoginMode, setIsLoginMode] = useState(true); // Toggle between Login & Sign Up

    const { signIn, signUp } = useAuth();

    const handleSubmit = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);

        try {
            if (isLoginMode) {
                // Login
                await signIn(email, password);
                router.replace('/(auth)');
            } else {
                // Sign Up
                await signUp(email, password);
                Alert.alert(
                    'Account Created',
                    'Your account has been created successfully!\n\nYou can now sign in.',
                    [
                        {
                            text: 'Go to Sign In',
                            onPress: () => setIsLoginMode(true),
                        },
                    ],
                );
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }

        setLoading(false);
    };

    return (
        <ScrollView className="flex-1 bg-slate-950">
            <View className="flex-1 justify-center p-6 pt-20">
                <Text className="mb-2 text-center text-4xl font-bold text-white">
                    {isLoginMode ? 'Welcome Back' : 'Create Account'}
                </Text>
                <Text className="mb-10 text-center text-slate-400">
                    {isLoginMode
                        ? 'Sign in to continue'
                        : 'Sign up to get started'}
                </Text>

                <TextInput
                    className="mb-4 rounded-2xl border border-slate-700 bg-slate-800 p-5 text-base text-white"
                    placeholder="Email address"
                    placeholderTextColor="#888"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <TextInput
                    className="mb-8 rounded-2xl border border-slate-700 bg-slate-800 p-5 text-base text-white"
                    placeholder="Password (min 6 characters)"
                    placeholderTextColor="#888"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading}
                    className="mb-6 rounded-2xl bg-blue-600 py-5 active:bg-blue-700"
                >
                    <Text className="text-center text-lg font-semibold text-white">
                        {loading
                            ? 'Processing...'
                            : isLoginMode
                              ? 'Sign In'
                              : 'Create Account'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setIsLoginMode(!isLoginMode)}
                    className="py-3"
                >
                    <Text className="text-center font-medium text-blue-400">
                        {isLoginMode
                            ? "Don't have an account? Sign Up"
                            : 'Already have an account? Sign In'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
