import { eq } from "drizzle-orm";

import type { Account } from "@/data/accounts";
import { toUserMessage } from "@/data/errors";
import type { WriteResult } from "@/data/write-result";
import { db } from "@/db/client";
import { account, category } from "@/db/schema";

export type Category = typeof category.$inferSelect;
export type CategoryWithAccounts = Category & { accounts: Account[] };

export async function createCategory(name: string): Promise<WriteResult> {
  try {
    await db.insert(category).values({ name: name.trim() });
  } catch (error) {
    const message = toUserMessage(error);
    if (message === null) throw error;
    return { ok: false, error: message };
  }
  return { ok: true };
}

export async function renameCategory(
  id: number,
  name: string,
): Promise<WriteResult> {
  try {
    const result = await db
      .update(category)
      .set({ name: name.trim() })
      .where(eq(category.id, id));

    // A WHERE that matches nothing is not an error in SQL. No row means a bug in
    // the caller, not something the user did, so throw. The catch below re-throws
    // it, because toUserMessage only knows database errors.
    if (result.changes === 0) {
      throw new Error(`renameCategory: no category with id ${id}`);
    }
  } catch (error) {
    const message = toUserMessage(error);
    if (message === null) throw error;
    return { ok: false, error: message };
  }
  return { ok: true };
}

export async function getCategoriesWithAccounts(): Promise<
  CategoryWithAccounts[]
> {
  const categories = await db.select().from(category).orderBy(category.id);
  const accounts = await db.select().from(account).orderBy(account.id);

  return categories.map((cat) => ({
    ...cat,
    accounts: accounts.filter((acc) => acc.categoryId === cat.id),
  }));
}
