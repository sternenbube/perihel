// Translates a database error the user caused into a message for the screen.
// Returns null for everything else: that is a bug and should be re-thrown.
export function toUserMessage(error: unknown): string | null {
  // expo-sqlite throws a plain Error with the SQLite text in its message.
  if (!(error instanceof Error)) return null;
  const message = error.message;

  // Match on the constraint names (check, uniqueIndex) from schema.ts with includes, not ===:
  // the real message has more text around it ("Error code 19: ..."), and SQLite's wording
  // can change, while our constraint names stay the same.
  if (message.includes("category_name_lower_unique")) {
    return "A category with this name already exists.";
  }

  if (
    message.includes("category_name_not_empty") ||
    message.includes("account_name_not_empty")
  ) {
    return "The name cannot be empty.";
  }

  return null;
}
