# Schema design and constraints

Learned on 02.10.2026 while designing Perihel's first migration (step 2). The schema itself lives
in [src/db/schema.ts](../../src/db/schema.ts).

## The idea

A schema decides what the database accepts, not only what it stores. Every rule written into the
schema is checked on every write, no matter which code path wrote it — a bug, a future import,
a migration. Rules that only live in application code protect only the code that remembers them.

The goal is all the data that is needed, and nothing that could contradict itself.

## NULL is a state of its own

NULL does not mean "nothing". It is a third value next to "a value" and "no row", and every
nullable column forces every reader to handle it.

In Perihel a month that was not entered has no entry rows at all. If `entry.value` could be NULL,
there would be two ways to say "no number": a missing row and a row with NULL. Two ways of saying
the same thing end up disagreeing somewhere. So `value` is `NOT NULL`: if a row exists, it has a
number. The same reasoning made `setting.value` and `account.is_active` `NOT NULL`.

**Rule:** a column is `NOT NULL` unless there is a real meaning for "empty" that the absence of a
row cannot express.

## The constraints

| Constraint | Guarantees | In Perihel |
| ---------- | ---------- | ---------- |
| `NOT NULL` | The column always has a value | Almost every column |
| `PRIMARY KEY` | Unique and not null; identifies the row | `id` in every table, `key` in `setting` |
| `UNIQUE` | No two rows share the value | `category.name`, `snapshot.year_month` |
| Composite `UNIQUE` | No two rows share the *combination* | `entry (snapshot_id, account_id)` |
| `CHECK` | A condition holds on every write | Format and range of `year_month` |
| `REFERENCES` | The value points to an existing row | `account → category`, `entry → snapshot`, `entry → account` |

**Primary key.** Already unique and not null, so `.unique()` on top would only build a redundant
index. An `INTEGER PRIMARY KEY` is special in SQLite: it becomes the internal row number and is
filled automatically on insert.

**Composite unique.** `snapshot_id` alone cannot be unique, or a month could hold only one
account's number. What must not repeat is the pair: September + UBS savings exists once.

```ts
unique("entry_per_account_and_month").on(table.snapshotId, table.accountId)
```

**CHECK.** `year_month` is text, so `"2026-9"` and `"2026-09"` would both pass a unique
constraint and silently split one month in two. The check needs two parts:

```sql
year_month GLOB '[0-9][0-9][0-9][0-9]-[0-1][0-9]'
AND substr(year_month, 6, 2) BETWEEN '01' AND '12'
```

`GLOB` checks the shape (four digits, a dash, two digits). It cannot express ranges, so `"2026-13"`
would pass. `substr` cuts out the month (SQLite counts from 1) and `BETWEEN` checks the range.
The string comparison only works because `GLOB` already guarantees two digits.

## Foreign keys: restrict or cascade

A reference also decides what happens when the parent row is deleted.

| Option | Deleting a parent that still has children | Risk |
| ------ | ----------------------------------------- | ---- |
| `restrict` | Fails. The code must delete the children first. | Slightly more code |
| `cascade` | Deletes all children automatically | One wrong call silently wipes years of history |

Perihel uses `restrict` everywhere, written out explicitly so the intent is visible. Deleting
history always takes deliberate code.

Asking the user ("move the accounts or delete them?") is not the database's job: it only sees
rows and knows nothing about the user. The database refuses, the app asks, and the data layer
deletes in the right order inside one transaction.

## Defaults

A default is right when there is a genuinely correct value for most rows: a new account is
active, so `is_active` defaults to `true`.

A default is harmful when it is a safety net for code that forgot a value. A forgotten
`sort_order` with default `0` would give several rows the same number — a silent bug, found
months later if ever. Without a default the insert fails immediately and points at the missing
column.

**Rule:** defaults for correct values, never to hide a missing one. Loud bugs are cheap.

## Indexes

An index is a sorted lookup structure, like the index at the back of a book. SQLite needs one to
enforce `UNIQUE` without scanning the whole table, so every unique constraint becomes a unique
index — Drizzle writes them into the migration.

A composite index also speeds up lookups on its first column alone: the index on
`entry (snapshot_id, account_id)` makes "all entries of September" fast for free.

## Types in SQLite

| Type | Use |
| ---- | --- |
| `INTEGER` | Ids, money (whole numbers), booleans as 0/1 |
| `TEXT` | Names, `"2026-09"`, settings |
| `REAL` | Decimals — not used, money is whole numbers |
| `BLOB` | Raw bytes — not used |

There is no boolean and no date type. Drizzle's `integer("is_active", { mode: "boolean" })` lets
TypeScript see `true`/`false` while the database stores 1/0.

## Naming

One file, two languages. TypeScript keys are camelCase, database names are snake_case:

```ts
categoryId: integer("category_id")
```

The string is a name inside the database, which is SQL and follows SQL's convention. The database
also outlives the code: these names appear in migrations, database viewers and exports.
Tables are singular, because a name describes one row: a row in `account` is an account.

## SQLite quirks

- **Foreign keys are off by default.** `REFERENCES` is ignored until `PRAGMA foreign_keys = ON`
  runs — every time the database is opened, not once in a migration.
- **A non-integer primary key may be NULL**, a historical bug kept for compatibility. Drizzle's
  `.primaryKey()` adds `NOT NULL` automatically.
- **`UNIQUE` is case-sensitive**: "Bank" and "bank" are different names.
- **Table order does not matter.** References are checked when rows are written, not when tables
  are created, so Drizzle can create them alphabetically.
