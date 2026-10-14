import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function ManageCategory() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();

  // todo: Function that loads category and all its accounts

  return (
    <>
      <Stack.Title>Manage Category</Stack.Title>
      <View className="items-center justify-center flex-1 gap-2 bg-lime-300">
        <Text className="text-2xl font-bold">name..</Text>
        <Text>Category ID: {categoryId}</Text>
      </View>
    </>
  );
}
