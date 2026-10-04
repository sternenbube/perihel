import { db } from "@/db/client";
import migrations from "@/db/migrations/migrations";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Stack } from "expo-router";
import { Text, View } from "react-native";
import "../global.css";

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <View className="items-center justify-center flex-1 p-4">
        <Text className="text-lg font-bold">Database error</Text>
        <Text>{error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return null;
  }

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
