import { Link, Stack } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Settings() {
  return (
    <>
      <Stack.Title>Settings</Stack.Title>
      <View className="items-center justify-center flex-1 gap-4 bg-gray-300">
        <Text className="text-2xl font-bold">Settings</Text>

        <Link href="/manage" asChild>
          <Pressable className="px-4 py-2 bg-white rounded-lg">
            <Text>Manage</Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}
