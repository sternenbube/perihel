import {
  type CategoryWithAccounts,
  createCategory,
  getCategoriesWithAccounts,
} from "@/data/categories";
import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function Manage() {
  const [text, setText] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [categoriesWithAccounts, setCategoriesWithAccounts] = useState<
    CategoryWithAccounts[] | null
  >(null);

  useEffect(() => {
    async function load() {
      setCategoriesWithAccounts(await getCategoriesWithAccounts());
    }
    load();
  }, []);

  function handleChangeText(newText: string) {
    setErrorMessage(null);
    setText(newText);
  }

  async function handleAdd() {
    const result = await createCategory(text);

    if (!result.ok) {
      setErrorMessage(result.error);
      return;
    }

    setCategoriesWithAccounts(await getCategoriesWithAccounts());
    setText("");
    setErrorMessage(null);
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
        onChangeText={handleChangeText}
        placeholder="Bank/ETF/Cash"
      />
      {errorMessage !== null && <Text>{errorMessage}</Text>}
      <Pressable onPress={handleAdd}>
        <Text>Add</Text>
      </Pressable>
    </View>
  );
}
