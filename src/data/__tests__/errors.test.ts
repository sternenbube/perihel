import { toUserMessage } from "../errors";

// ! This file creates TestCases that should simulate real errors that might occur

// This fake has the same shape as real errors thrown by sqlite (Copied from a real expo-sqlite error on the phone)
function databaseError(sqliteMessage: string) {
  return new Error(
    `Calling the 'runSync' function has failed\n→ Caused by: SQLiteErrorException: Error code 19: ${sqliteMessage}`,
  );
}

describe("toUserMessage", () => {
  test("translates a duplicate category name", () => {
    const error = databaseError(
      "UNIQUE constraint failed: index 'category_name_lower_unique'",
    );
    expect(toUserMessage(error)).toBe(
      "A category with this name already exists.",
    );
  });

  test("translates an empty category name", () => {
    const error = databaseError(
      "CHECK constraint failed: category_name_not_empty",
    );
    expect(toUserMessage(error)).toBe("The name cannot be empty.");
  });

  test("translates an empty account name", () => {
    const error = databaseError(
      "CHECK constraint failed: account_name_not_empty",
    );
    expect(toUserMessage(error)).toBe("The name cannot be empty.");
  });

  test("returns null for a database error the user did not cause", () => {
    const error = databaseError("FOREIGN KEY constraint failed");
    expect(toUserMessage(error)).toBeNull();
  });

  test("returns null for an error that is not from the database", () => {
    expect(toUserMessage(new Error("something else"))).toBeNull();
  });

  test("returns null for an error that is not of type Error", () => {
    expect(toUserMessage("Ooops")).toBeNull();
  });
});
