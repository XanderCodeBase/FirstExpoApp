import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { config } from "@/components/ui/gluestack-ui-provider/config";
import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <GluestackUIProvider config={config}>
            <Stack />
        </GluestackUIProvider>
    );
}