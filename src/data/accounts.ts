import { eq } from "drizzle-orm";

import { toUserMessage } from "@/data/errors";
import type { WriteResult } from "@/data/write-result";
import { db } from "@/db/client";
import { account } from "@/db/schema";

export type Account = typeof account.$inferSelect;

// A categoryId that does not exist fails the foreign key. toUserMessage does not
// know that error, so it is re-thrown: the screen only offers existing categories.
export async function createAccount(
  categoryId: number,
  name: string,
): Promise<WriteResult> {
  try {
    await db.insert(account).values({ categoryId, name: name.trim() });
  } catch (error) {
    const message = toUserMessage(error);
    if (message === null) throw error;
    return { ok: false, error: message };
  }
  return { ok: true };
}

export async function renameAccount(
  id: number,
  name: string,
): Promise<WriteResult> {
  try {
    const result = await db
      .update(account)
      .set({ name: name.trim() })
      .where(eq(account.id, id));

    // Same as renameCategory: no row means a bug in the caller, so throw.
    if (result.changes === 0) {
      throw new Error(`renameAccount: no account with id ${id}`);
    }
  } catch (error) {
    const message = toUserMessage(error);
    if (message === null) throw error;
    return { ok: false, error: message };
  }
  return { ok: true };
}
