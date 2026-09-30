import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Settings() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-gray-300">
      <Text className="text-2xl font-bold">Settings</Text>

      <Link href="/manage" asChild>
        <Pressable className="rounded-lg bg-white px-4 py-2">
          <Text>Manage</Text>
        </Pressable>
      </Link>
    </View>
  );
}
