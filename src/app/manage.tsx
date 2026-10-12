import {
  type CategoryWithAccounts,
  createCategory,
  getCategoriesWithAccounts,
} from "@/data/categories";
import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function Manage() {
  const [text, setText] = useState("");
  const [categoriesWithAccounts, setCategoriesWithAccounts] = useState<
    CategoryWithAccounts[] | null
  >(null);

  useEffect(() => {
    async function load() {
      setCategoriesWithAccounts(await getCategoriesWithAccounts());
    }
    load();
  }, []);

  async function handleAdd() {
    await createCategory(text);
    setText("");
    setCategoriesWithAccounts(await getCategoriesWithAccounts());
  }

  if (categoriesWithAccounts === null) return null; // or a loading indicator

  return (
    <View className="items-center justify-center flex-1 bg-purple-300">
      <Text className="text-2xl font-bold">Manage</Text>

      {categoriesWithAccounts.length === 0 ? (
        <Text>No categories yet</Text>
      ) : (
        categoriesWithAccounts.map((cat) => (
          <Text key={cat.id}>{cat.name}</Text>
        ))
      )}
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Bank/ETF/Cash"
      />
      <Pressable onPress={handleAdd}>
        <Text>Add</Text>
      </Pressable>
    </View>
  );
}
