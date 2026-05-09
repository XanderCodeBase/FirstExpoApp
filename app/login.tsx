// app/login.tsx
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLoginMode, setIsLoginMode] = useState(true);   // Toggle between Login & Sign Up

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
                router.replace('/');
            } else {
                // Sign Up
                await signUp(email, password);
                Alert.alert(
                    'Account Created',
                    'Your account has been created successfully!\n\nYou can now sign in.',
                    [{ text: 'Go to Sign In', onPress: () => setIsLoginMode(true) }]
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
                <Text className="text-4xl font-bold text-white mb-2 text-center">
                    {isLoginMode ? 'Welcome Back' : 'Create Account'}
                </Text>
                <Text className="text-slate-400 text-center mb-10">
                    {isLoginMode
                        ? 'Sign in to continue'
                        : 'Sign up to get started'}
                </Text>

                <TextInput
                    className="bg-slate-800 border border-slate-700 text-white p-5 rounded-2xl mb-4 text-base"
                    placeholder="Email address"
                    placeholderTextColor="#888"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <TextInput
                    className="bg-slate-800 border border-slate-700 text-white p-5 rounded-2xl mb-8 text-base"
                    placeholder="Password (min 6 characters)"
                    placeholderTextColor="#888"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading}
                    className="bg-blue-600 py-5 rounded-2xl mb-6 active:bg-blue-700"
                >
                    <Text className="text-white text-center font-semibold text-lg">
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
                    <Text className="text-blue-400 text-center font-medium">
                        {isLoginMode
                            ? "Don't have an account? Sign Up"
                            : "Already have an account? Sign In"}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
