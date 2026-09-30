import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function MonthDetail() {
  const { month } = useLocalSearchParams<{ month: string }>();

  return (
    <>
      <Stack.Title>Month {month}</Stack.Title>
      <View className="items-center justify-center flex-1 gap-2 bg-blue-300">
        <Text className="text-2xl font-bold">Month detail</Text>
        <Text>month param: {month}</Text>
      </View>
    </>
  );
}
