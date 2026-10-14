import { Link, Stack } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Home() {
  return (
    <>
      <Stack.Title>Home</Stack.Title>
      <View className="items-center justify-center flex-1 gap-4 bg-yellow-300">
        <Text className="text-2xl font-bold">Home</Text>

        <Link href="/entry" asChild>
          <Pressable className="px-4 py-2 bg-white rounded-lg">
            <Text>Entry</Text>
          </Pressable>
        </Link>

        <Link
          href={{ pathname: "/month/[month]", params: { month: "2026-08" } }}
          asChild
        >
          <Pressable className="px-4 py-2 bg-white rounded-lg">
            <Text>Month 2026-08</Text>
          </Pressable>
        </Link>

        <Link
          href={{ pathname: "/month/[month]", params: { month: "2026-09" } }}
          asChild
        >
          <Pressable className="px-4 py-2 bg-white rounded-lg">
            <Text>Month 2026-09</Text>
          </Pressable>
        </Link>

        <Link href="/settings" asChild>
          <Pressable className="px-4 py-2 bg-white rounded-lg">
            <Text>Settings</Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}
