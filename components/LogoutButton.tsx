import {TouchableOpacity, Text, Alert} from 'react-native';
import {router} from 'expo-router';
import {useAuth} from '@/providers/AuthProvider';

export function LogoutButton({variant = "default"}: { variant?: "default" | "destructive" | "small" }) {
    const {signOut} = useAuth();

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to log out?",
            [
                {text: "Cancel", style: "cancel"},
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await signOut();
                            router.replace('/login');
                        } catch (error) {
                            Alert.alert("Error", "Failed to logout. Please try again.");
                        }
                    },
                },
            ]
        );
    };

    if (variant === "small") {
        return (
            <TouchableOpacity
                onPress={handleLogout}
                className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/50 active:bg-red-500/20"
            >
                <Text className="text-red-500 font-medium text-sm">Logout</Text>
            </TouchableOpacity>
        );
    }

    // Default / Destructive style
    return (
        <TouchableOpacity
            onPress={handleLogout}
            className={`px-6 py-3 rounded-2xl ${
                variant === "destructive"
                    ? "bg-red-600 active:bg-red-700"
                    : "bg-red-500/10 border border-red-500 active:bg-red-500/20"
            }`}
        >
            <Text
                className={`font-semibold text-base ${
                    variant === "destructive" ? "text-white" : "text-red-500"
                }`}
            >
                Logout
            </Text>
        </TouchableOpacity>
    );
}
