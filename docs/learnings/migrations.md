# Local database and migrations

Learned on 01.10.2026 while setting up Perihel's database (step 2). The steps to set it up are
in the [database setup guide](../guides/database-setup.md); the design of the tables in
[Schema design and constraints](schema-design.md).

## The database lives on the phone

SQLite is a single file inside the app's storage. Nothing leaves the device — privacy by design,
see the conventions in the README.

The consequence for migrations: with a server, one database is migrated once. Here every phone
migrates its own copy, whenever its user updates, possibly skipping versions — someone may go
from version 1 straight to version 4. Migrations must therefore run in order from whatever
version a phone is on.

## What a migration is

A migration is one numbered step that changes the schema: create a table, add a column. The
schema at any moment is the result of all migrations run in order. An update must never lose
existing entries, which is why the app has migrations from version one.

## The golden rule

Once a migration has run on a real phone, its content never changes. Any change becomes a new
migration. Otherwise phones that ran the old version and fresh installs end up with different
databases, and neither notices.

**Exception:** as long as a migration has only run on my own phone, it may be changed — delete the
migrations folder, delete the database (clear Expo Go's data), regenerate. After the first release
this exception is gone.

## Transactions

Each migration runs as all or nothing. The operating system can kill the app at any moment, even
halfway through a migration. With a transaction the half-finished work is rolled back and the
migration runs again on the next start.

## Why Drizzle

| Option | Verdict |
| ------ | ------- |
| Hand-written SQL with `PRAGMA user_version` | Works, no dependency — but TypeScript only believes the types written next to each query |
| **Drizzle** | Schema in TypeScript, migrations generated as plain SQL, query types derived from the schema |
| Prisma | Early Access for Expo and stalled — not an option for an app that must not lose data |

The deciding reason is type safety: rename a column and every query using the old name turns red.
SQL is still read — every generated migration is reviewed before it is committed.

**Version:** the stable `0.45` line, not the `1.0` release candidate the Drizzle docs are written
for. An app that promises not to lose data does not run on a release candidate. Upgrading to 1.0
is a planned step later; until then, commands in the docs may differ slightly.

## Who does what

| Step | Runs where | What it does |
| ---- | ---------- | ------------ |
| Edit `schema.ts` | My computer | Describe the tables in TypeScript |
| `npx drizzle-kit generate` | My computer | Compare schema with existing migrations, write the difference as SQL. Touches no database. |
| Review the `.sql` file | My computer | Check that the SQL is what was intended |
| App start | The phone | Run every migration the phone has not run yet, record it in Drizzle's tracking table |
