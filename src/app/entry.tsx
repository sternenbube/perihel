import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function Entry() {
  return (
    <>
      <Stack.Title>Entry</Stack.Title>
      <View className="items-center justify-center flex-1 bg-green-300">
        <Text className="text-2xl font-bold">Entry</Text>
      </View>
    </>
  );
}
