import { sql } from "drizzle-orm";
import {
  check,
  integer,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";

// e.g. Bank, Cash, Investments
export const category = sqliteTable("category", {
  id: integer("id").primaryKey(),
  name: text("name").notNull().unique(),
});

// e.g. UBS savings, Revolut, Credit card
export const account = sqliteTable("account", {
  id: integer("id").primaryKey(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => category.id, { onDelete: "restrict" }),
  name: text("name").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});

// One month, e.g. "2026-09". Exists only once.
export const snapshot = sqliteTable(
  "snapshot",
  {
    id: integer("id").primaryKey(),
    yearMonth: text("year_month").notNull().unique(),
  },
  // Valid: any four-digit year, months 01 to 12
  (table) => [
    check(
      "year_month_format",
      sql`${table.yearMonth} GLOB '[0-9][0-9][0-9][0-9]-[0-1][0-9]'
        AND substr(${table.yearMonth}, 6, 2) BETWEEN '01' AND '12'`,
    ),
  ],
);

// The number of one account in one month, e.g. UBS savings in 2026-09
export const entry = sqliteTable(
  "entry",
  {
    id: integer("id").primaryKey(),
    snapshotId: integer("snapshot_id")
      .notNull()
      .references(() => snapshot.id, { onDelete: "restrict" }),
    accountId: integer("account_id")
      .notNull()
      .references(() => account.id, { onDelete: "restrict" }),
    // Whole number, negative for debt. Never null: a month that was not
    // entered has no rows at all.
    value: integer("value").notNull(),
  },
  (table) => [
    unique("entry_per_account_and_month").on(table.snapshotId, table.accountId),
  ],
);

// Diverse Settings e.g. check_day = 15
export const setting = sqliteTable("setting", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});
