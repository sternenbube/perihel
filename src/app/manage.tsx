import {
  type CategoryWithAccounts,
  createCategory,
  getCategoriesWithAccounts,
} from "@/data/categories";
import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

const UNEXPECTED_ERROR_MESSAGE =
  "Something went wrong on our side. It’s not something you did.";

type LoadState =
  | { status: "loading" }
  | { status: "loaded"; data: CategoryWithAccounts[] }
  | { status: "failed" };

export default function Manage() {
  const [text, setText] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadState, setLoadState] = useState<LoadState>({
    status: "loading",
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getCategoriesWithAccounts();
        setLoadState({ status: "loaded", data });
      } catch (error) {
        console.error("load failed: ", error);
        setLoadState({ status: "failed" });
      }
    }
    load();
  }, []);

  function handleChangeText(newText: string) {
    setErrorMessage(null);
    setText(newText);
  }

  async function handleAdd() {
    try {
      const result = await createCategory(text);

      if (!result.ok) {
        setErrorMessage(result.error);
        return;
      }

      const data = await getCategoriesWithAccounts();
      setLoadState({ status: "loaded", data });
      setText("");
      setErrorMessage(null);
    } catch (error) {
      console.error("handleAdd failed: ", error);
      setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
    }
  }

  if (loadState.status === "loading") return null;
  if (loadState.status === "failed") {
    return (
      <View className="items-center justify-center flex-1 bg-purple-300">
        <Text>{UNEXPECTED_ERROR_MESSAGE}</Text>
      </View>
    );
  }

  return (
    <View className="items-center justify-center flex-1 bg-purple-300">
      <Text className="text-2xl font-bold">Manage</Text>

      {loadState.data.length === 0 ? (
        <Text>No categories yet</Text>
      ) : (
        loadState.data.map((cat) => <Text key={cat.id}>{cat.name}</Text>)
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
