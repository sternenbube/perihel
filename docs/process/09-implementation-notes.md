# 9. Implementation notes


### Step 2: Database

**Drizzle instead of hand-written migrations.** Decision 2 planned SQL and migrations written by
hand. During the build this changed to Drizzle, for type safety derived from the schema — see
Decision 9. The rule that only the data layer contains SQL is unchanged: the schema, the
migrations and the database connection all live in `src/db/`.

**No `sort_order` in V1.** The data model in chapter 7 gives categories and accounts a
`sort_order` column. Reordering is goal V3-7, so in V1 nobody can change the order, and the column
would only mirror the creation order that `id` already gives. It was left out; lists are sorted by
`id`. When V3-7 is built, a migration adds the column and fills it from `id`, so the existing
order stays the same. Accounts will then be numbered across all categories, not per category, so
moving an account to another category never needs renumbering.

**The snapshot status comes as migration 2.** Decision 8 promises that the snapshot table holds
the state of an unfinished entry (V1-5). The status column is not part of the first migration; it
is added when step 5 is built. This is deliberate: it will be the first migration on a database
that already holds real data — the situation every app update is in.

**Constraints the data model did not specify.** Chapter 7 lists the columns; the build added the
rules: every column `NOT NULL`, one entry per account and month (a composite unique constraint),
a `CHECK` on `year_month` for format and month range, and `restrict` on every reference, so
deleting history always takes deliberate code. Reasoning in
[Schema design and constraints](../learnings/schema-design.md).

---

[← Screens and user flow](08-screens.md)  ·  [Test cases and results →](10-test-cases.md)  ·  [Overview](../../README.md)
