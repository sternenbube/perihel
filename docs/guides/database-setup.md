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

**7. Open the database once** in `src/db/client.ts`:

```ts
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

const sqlite = openDatabaseSync("perihel.db");
sqlite.execSync("PRAGMA foreign_keys = ON");
export const db = drizzle(sqlite);
```

A module runs once, on its first import, so the whole app shares this one connection. The PRAGMA
must run every time the database is opened — without it SQLite silently ignores `REFERENCES`.
The file lives in the app's private storage on the phone, not in the project; in Expo Go inside
Expo Go's storage.

**8. Run the migrations at startup** in `src/app/_layout.tsx`:

```tsx
const { success, error } = useMigrations(db, migrations);

if (error) return <ErrorView message={error.message} />;
if (!success) return null;
return <Stack>…</Stack>;
```

`useMigrations` comes from `drizzle-orm/expo-sqlite/migrator`, `migrations` from
`src/db/migrations/migrations.js`. Error is checked first, because a failed migration also leaves
`success` false. No screen renders before the migrations are done, so no screen can query a
table that does not exist yet.

**9. Test with two starts.** Log `SELECT name FROM sqlite_master WHERE type = 'table'` once
`success` is true: the first start shows the five tables plus `__drizzle_migrations`, Drizzle's
tracking table. Reload — the same list, no migration runs again. Remove the log afterwards.

## Changing the schema later

1. Change `schema.ts`.
2. `npx drizzle-kit generate --name=<what_it_does>`.
3. Read the new `.sql` file. Never edit an older one.
4. Start the app: the phone runs only the new migration.
