import {
  type CategoryWithAccounts,
  createCategory,
  getCategoriesWithAccounts,
  renameCategory,
} from "@/data/categories";
import { Link, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

const UNEXPECTED_ERROR_MESSAGE =
  "Something went wrong on our side. It’s not something you did.";

type LoadState =
  | { status: "loading" }
  | { status: "loaded"; data: CategoryWithAccounts[] }
  | { status: "failed" };

type EditingCategory = {
  id: number;
  name: string;
  error: string | null;
} | null;

export default function Manage() {
  const [text, setText] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadState, setLoadState] = useState<LoadState>({
    status: "loading",
  });
  const [editing, setEditing] = useState<EditingCategory>(null);

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

  function handleEditChange(newName: string) {
    if (editing === null) return;
    setEditing({ ...editing, name: newName, error: null });
  }

  async function handleEditSave() {
    if (editing === null) return;
    try {
      const result = await renameCategory(editing.id, editing.name);
      if (!result.ok) {
        setEditing({ ...editing, error: result.error });
        return;
      }
      const data = await getCategoriesWithAccounts();
      setLoadState({ status: "loaded", data });
      setEditing(null);
    } catch (error) {
      console.error("saving failed: ", error);
      setEditing({ ...editing, error: UNEXPECTED_ERROR_MESSAGE });
    }
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

  // Only the content depends on the load state; the title and frame are always shown.
  function renderContent() {
    if (loadState.status === "loading") return null;
    if (loadState.status === "failed") {
      return <Text>{UNEXPECTED_ERROR_MESSAGE}</Text>;
    }

    return (
      <>
        {loadState.data.length === 0 ? (
          <Text>No categories yet</Text>
        ) : (
          loadState.data.map((cat) => (
            <Link
              key={cat.id}
              href={{
                pathname: "/manage/[categoryId]",
                params: { categoryId: cat.id },
              }}
              asChild
            >
              <Pressable>
                <Text>{cat.name}</Text>
              </Pressable>
            </Link>
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
      </>
    );
  }

  return (
    <>
      <Stack.Title>Manage</Stack.Title>
      <View className="items-center justify-center flex-1 bg-purple-300">
        <Text className="text-2xl font-bold">Manage</Text>
        {renderContent()}
      </View>
    </>
  );
}
