import { Text, View } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";

export default function Page() {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-xl font-bold text-blue-500">
                Prototype Ready 🚀
            </Text>

            <Button>
                <ButtonText>Click me</ButtonText>
            </Button>
        </View>
    );
}