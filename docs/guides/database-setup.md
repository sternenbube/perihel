# Database setup with Drizzle

Set up on 01.10.2026 with `expo-sqlite` 57, `drizzle-orm` 0.45 and `drizzle-kit` 0.31.
The schema lives in [src/db/schema.ts](../../src/db/schema.ts), the migrations in
`src/db/migrations/`. Why it works this way: [Local database and migrations](../learnings/migrations.md).

## Steps

**1. Install the packages.**

```bash
npx expo install expo-sqlite
npm install drizzle-orm
npm install -D drizzle-kit babel-plugin-inline-import
```

`expo-sqlite` through `npx expo install`, so it matches the SDK. The rest with plain npm: they are
not native modules. `-D` marks dev dependencies — needed on the computer only, never shipped in
the app.

**2. Configure drizzle-kit** in `drizzle.config.ts` at the project root:

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  driver: "expo",
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
});
```

`driver: "expo"` makes drizzle-kit also write a `migrations.js` that bundles all migrations for the
app. `out` sits under `src/db/` because only the data layer contains SQL.

**3. Let the app bundle `.sql` files.** Two config changes, because the migrations are `.sql` files
that must travel inside the app:

```js
// metro.config.js — Metro, the bundler, treats .sql as part of the app
config.resolver.sourceExts.push("sql");

// babel.config.js — the import of a .sql file becomes its content as a string
plugins: [["inline-import", { extensions: [".sql"] }]],
```

After config changes, start once with `npx expo start --clear` to throw away the bundler cache.

**4. Write the schema** in `src/db/schema.ts`. One table as an example:

```ts
export const account = sqliteTable("account", {
  id: integer("id").primaryKey(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => category.id, { onDelete: "restrict" }),
  name: text("name").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});
```

TypeScript keys in camelCase, database names in snake_case. Tables must be exported, or
drizzle-kit does not see them.

**5. Generate the migration** — always with a name:

```bash
npx drizzle-kit generate --name=initial_schema
```

This writes `0000_initial_schema.sql`, a `meta/` folder with the journal, and `migrations.js`.
The number keeps the order, the name says what the migration does — like a commit message:
`initial_schema`, later `add_snapshot_status`. Never rename the files by hand: the journal stores
the name. Never edit a migration that has already run on a phone — see
[the golden rule](../learnings/migrations.md#the-golden-rule).

**6. Read the generated SQL** before committing. Check that every constraint arrived: `NOT NULL`,
`UNIQUE`, `CHECK`, `ON DELETE restrict`.

**7. Open the database and run the migrations.** _To be completed in step 2a:_ the database module
in `src/db/` (open the database, `PRAGMA foreign_keys = ON` — SQLite ignores foreign keys without
it — and create the Drizzle object), and `useMigrations` in `src/app/_layout.tsx`.

## Changing the schema later

1. Change `schema.ts`.
2. `npx drizzle-kit generate --name=<what_it_does>`.
3. Read the new `.sql` file. Never edit an older one.
4. Start the app: the phone runs only the new migration.
