import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="entry" options={{ title: "Entry" }} />
      <Stack.Screen name="month/[month]" options={{ title: "Month" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen name="manage" options={{ title: "Manage" }} />
    </Stack>
  );
}
