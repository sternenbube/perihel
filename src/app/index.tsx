import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-yellow-300">
      <Text className="text-2xl font-bold">Home</Text>

      <Link href="/entry" asChild>
        <Pressable className="rounded-lg bg-white px-4 py-2">
          <Text>Entry</Text>
        </Pressable>
      </Link>

      <Link
        href={{ pathname: "/month/[month]", params: { month: "2026-08" } }}
        asChild
      >
        <Pressable className="rounded-lg bg-white px-4 py-2">
          <Text>Month 2026-08</Text>
        </Pressable>
      </Link>

      <Link
        href={{ pathname: "/month/[month]", params: { month: "2026-09" } }}
        asChild
      >
        <Pressable className="rounded-lg bg-white px-4 py-2">
          <Text>Month 2026-09</Text>
        </Pressable>
      </Link>

      <Link href="/settings" asChild>
        <Pressable className="rounded-lg bg-white px-4 py-2">
          <Text>Settings</Text>
        </Pressable>
      </Link>
    </View>
  );
}
