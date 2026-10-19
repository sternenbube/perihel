# Session memory

Where the build stands between sessions, so work can continue on any computer.
Loaded automatically through `CLAUDE.md`. Last updated: 19.10.2026.

## Where we left off

**Step 2 is done.** 2a: the database opens at startup and migration 1 has run on my phone.
2b: the chart spike is done — **Decision 10: react-native-gifted-charts**, no development build
needed for the chart. Decisions 9 (Drizzle) and 10 are in `docs/process/06-decisions.md`, step 2
notes in `09-implementation-notes.md`.

**The spike code is kept on the branch `spike-chart`** (pushed, never merged). It has every
working prop for the mockup style: dashed gaps via `lineSegments`, hidden y-axis and rules,
colours `#3B4A8C` (line) and `#9AA3C7` (gap), equal `initialSpacing`/`endSpacing`, the chart
wrapped in a plain `View` to centre it. **Start step 8 from it.** The chart packages are not on
`main`: install them again in step 8 with
`npx expo install react-native-gifted-charts expo-linear-gradient react-native-svg`.

**Step 3 in progress (05.10.2026):**
- Decided: Manage needs `getCategoriesWithAccounts()` (nested, the shape the screen needs),
  `createCategory(name)`, `renameCategory(id, name)`, `createAccount(categoryId, name)`,
  `renameAccount(id, name)`. A flat `getAccounts()` comes in step 4. **Deleting is not in V1**
  (V1-2 is create and rename only).
- Checks on three layers, each with its own job: screen helps before failing and shows errors;
  data function trims and translates database errors into readable messages; database is the
  final guard. No check-then-act: insert and handle the rejection.
- **Migration 2 `0001_name_rules.sql`**: category names unique case-insensitively (unique index on
  `lower(name)`, ASCII only — "Ä"/"ä" still differ) and not empty (`length(trim(name)) > 0`) on
  category and account. First run failed because of the drizzle-kit bug below and rolled back;
  the SQL was fixed by hand. Has run on the phone, Home appears.
- **Testing is set up** (Jest + jest-expo, `npm test`, `moduleNameMapper` for `@/`, tests in
  `__tests__` folders, never under `src/app/`). First test-driven function done:
  `src/data/errors.ts` → `toUserMessage(error: unknown): string | null`, 6 tests green. Guard
  `instanceof Error`, then reads **`error.message`** and matches constraint names with `includes`.
  (First version read `error.cause.message`, which was wrong for our driver, see Known traps.)
- **Error handling decided:** expected errors (duplicate, empty) → data functions return a result
  object `{ ok: false, error }` / `{ ok: true, ... }` (option B). Unexpected errors → data functions
  re-throw; **the screen catches them and shows a general message** ("Something went wrong on our
  side. It's not something you did.") — never silence, because an uncaught async error in a
  release build does nothing visible. A shared helper only once a second screen needs it.
- `getCategoriesWithAccounts()` uses two plain selects grouped in the function, not relational
  queries (their API changes in Drizzle 1.0).
- **Category data functions done (12.10.2026)** in `src/data/categories.ts`: `createCategory`,
  `renameCategory`, `getCategoriesWithAccounts` (map + filter + spread). Names are trimmed in the
  data function. `renameCategory` throws when `changes === 0` (wrong id is a bug, not a user
  error). Write functions return `WriteResult` (`src/data/write-result.ts`,
  `{ ok: true } | { ok: false; error: string }`). Row types via `$inferSelect`: `Category`,
  `CategoryWithAccounts`, and `Account` for now — **move `Account` to `accounts.ts`** when that
  file is created.
- **Account data functions done** in `src/data/accounts.ts` (`createAccount`, `renameAccount`,
  type `Account`). A wrong `categoryId` fails the foreign key and is re-thrown (bug, not user error).
- **Repeated catch body** (4 copies): decided to **keep it inline** (option A), no
  `toWriteFailure` helper.
- **Manage screen, bites 1–3a done (12.10.2026)** in `src/app/manage.tsx`: loads in `useEffect`
  (inner async function, `[]`), state starts as `null` = "not loaded yet" (early return), list of
  category names, "No categories yet" when empty. `TextInput` + "Add" `Pressable` →
  `handleAdd` (create → on `{ ok: false }` show `errorMessage`, keep the text; on success reload,
  clear text and message). `handleChangeText` clears the message while typing. Errors render with
  `errorMessage !== null &&` (never `"" &&` in React Native: a bare string crashes).
- **Screen-level catch done (13.10.2026):** `handleAdd` and the initial load catch unexpected
  errors → `UNEXPECTED_ERROR_MESSAGE` (constant at the top of the file) + `console.error`.
  Load state is a discriminated union `LoadState` (`loading` / `loaded` with `data` / `failed`).
  Title and frame always render; only `renderContent()` inside depends on the status.
- **Rename category done in place (13.10.2026)**, then superseded by Decision 11 below. The code
  (`editing` union state, `handleEditChange`, `handleEditSave`) is still in
  `manage/index.tsx`, **unused** since rows became links. It moves to the category screen.
- **Decision 11 (14.10.2026): one screen per category.** Manage lists categories; tapping one
  opens `manage/[categoryId].tsx` with its name (renamable) and its accounts (add, rename).
  Adding works the same on both screens: a "+ Add" row at the end of the list opens an input with
  Save and Cancel. The editing state must say *what* is edited (`kind`: category name / account /
  new account), because ids of different tables can be equal.
- **Routing done (14.10.2026):** `manage.tsx` moved to `manage/index.tsx` (`git mv`), Manage rows
  are `Link`s with an href object to `/manage/[categoryId]`. **Title rule B:** every screen sets
  its own `Stack.Title`; `_layout.tsx` is just `<Stack />` (entries only when a screen needs
  navigator options).
- **`getCategoryWithAccounts(id)` done (14.10.2026)** in `categories.ts`: returns
  `CategoryWithAccounts | null`. `null` = no such id (not a bug: a URL that leads nowhere).
  Category query first, `length === 0` → `null`, then the accounts with `where` + `orderBy`.

**Start of the next session (decided 19.10.2026):** I answer these framing questions for the
category screen first, then theory and challenge:
1. Which statuses does its `LoadState` need, compared to Manage's three, and what does "loaded"
   carry?
2. In which order do converting the id, checking `Number.isInteger` and the query happen, and
   should the query run at all for an invalid id?
3. Should the effect's dependency list stay `[]`, or does `categoryId` belong in it? What would
   happen if the param changed while the screen stays open?
4. What does the header show while loading, when not found, and when loading failed?

**V1 target moved to the end of November 2026** (19.10.2026, from the end of October: steps 4–9
did not fit into 12 days). In `roadmap.md`; `03-goals.md` still says October, see the open to-do
below.

**Next:**

1. ~~Middle path~~ decided: **seeds (option C)** — a dev-only function writes deliberately awkward
   test data into the real database through the real data functions. Set it up before step 6.
2. **Step 3, next bite: the category screen** (`manage/[categoryId].tsx`, shows only the raw id
   so far): load it with `getCategoryWithAccounts`, check the id, not-found, the category name as
   the title. Same shape as Manage (title outside, `renderContent()` inside). Starts with the
   framing questions above; their answers are deliberately not written here.
3. Then: move the rename code from Manage to the category screen (with the `kind` union), the
   "+ Add category" row on Manage, then adding and renaming accounts. Rows need a tap cue
   (chevron or pencil) in a later styling pass.
4. **Open to-do:** move the V1 date in `docs/process/03-goals.md` to the end of November and note
   the change in `09-implementation-notes.md` (draft shown in the chat on 19.10.2026, not applied).

**Version caution:** Drizzle docs are written for the 1.0 RC; we use stable 0.45. Check imports
and APIs against the installed package (`node_modules/drizzle-orm/expo-sqlite/`) before advising.
Expo docs: always the SDK 57 versioned pages.

## Where things stand

- **Step 1 done:** empty screens with a Stack. `src/app/`: `index.tsx` (Home, `/`), `entry.tsx`,
  `month/[month].tsx` (reads the param, header via `Stack.Title`), `settings.tsx` (one link to
  Manage), `manage/index.tsx`, `manage/[categoryId].tsx`. Each screen has its own background
  colour for now.
- **Styling:** NativeWind 4.2.7 with Tailwind v3, works on the phone. Decision 3.
- **Step 2a done:** Drizzle 0.45 + drizzle-kit 0.31 + `expo-sqlite` 57, configured
  (`drizzle.config.ts`, Babel inline-import, Metro `sql` extension). Schema in
  `src/db/schema.ts`, migration 1 in `src/db/migrations/0000_initial_schema.sql`, run at startup
  through `useMigrations`. The database file lives in the app's sandbox on the phone.
- The app runs in Expo Go. A development build is needed before V1 is done (V1-1), earlier if the
  chart library needs native code.
- **Viewing the database:** the built-in expo-sqlite inspector. With the app running, press
  Shift + M in the Expo terminal and choose "Open expo-sqlite". Browse, query, export. Editing rows
  there skips the data functions, and `__drizzle_migrations` must never be edited.

## The schema (migration 1)

| Table | Columns | Key rules |
| ----- | ------- | --------- |
| `category` | `id`, `name` | `name` unique |
| `account` | `id`, `category_id`, `name`, `is_active` | `category_id` → category, restrict; `is_active` boolean, default true; names may repeat |
| `snapshot` | `id`, `year_month` | `year_month` unique, CHECK: `GLOB '[0-9][0-9][0-9][0-9]-[0-1][0-9]'` AND month 01–12 |
| `entry` | `id`, `snapshot_id`, `account_id`, `value` | both references restrict; unique (`snapshot_id`, `account_id`); `value` integer, not null, may be negative |
| `setting` | `key`, `value` | `key` text primary key, `value` not null |

Everything is `NOT NULL`. Database names snake_case, TypeScript keys camelCase. No `sort_order`.
Full reasoning: `docs/learnings/schema-design.md`.

**Open question for step 4:** the unique constraint on `entry` rejects a second insert for the
same account and month. Correcting a value therefore needs an update (or upsert), not an insert.

## Build order

In [roadmap.md](roadmap.md). Notes that belong to single steps:

- Step 5 adds the snapshot status as a migration.
- Step 8 starts from the `spike-chart` branch; segments and labels are computed in the data layer.

**Decided — seeds (option C):** screens that show data use real queries from the start. Test data
comes from a dev-only seed that writes deliberately awkward data (a missing month, a negative
value, a zero, a realistic jump) through the real data functions. Set it up before step 6.

## Decisions so far

**Step 1:**
- Home is `src/app/index.tsx` at `/`. Navigation is a Stack; Tabs could be added later.
- Settings exists in V1 with one row, Manage, so Home's gear never changes.
- Month detail gets the month as a route param (`month/[month].tsx`). Not validated yet —
  `/month/mange` gets through.
- No central `paths.ts`: the file tree defines routes, typed routes catch broken links. A
  `monthHref()` helper may make sense once a second screen links to months.

**Step 2:**
- Drizzle instead of hand-written `user_version` migrations, for types derived from the schema.
  Prisma for Expo is Early Access and stalled. Stable 0.45, not the 1.0 RC.
- `sort_order` dropped for V1 (reordering is V3-7); V1 sorts by `id`. Added by migration later.
- Snapshot status (V1-5) comes as migration 2 in step 5.
- All references `onDelete: "restrict"`. Deleting a category will ask the user to move or delete
  its accounts (Decision 6 applies to accounts with history).
- `year_month`: database CHECK plus one tested function that turns a date into `year_month`
  (watch out: `getMonth()` counts from 0, no leading zero). Normalizing strings waits for the
  CSV import (V2-9).
- Defaults only for genuinely correct values, never as a safety net.

## Known traps

- **The expo-sqlite driver does not wrap errors.** Drizzle's async drivers throw a
  `DrizzleQueryError` with the SQLite error in `cause`. The expo driver is synchronous and calls
  `executeSync` directly (`node_modules/drizzle-orm/expo-sqlite/session.js`), so the error is a
  plain `Error` from expo-sqlite with everything in `message`:
  `Calling the 'runSync' function has failed → Caused by: SQLiteErrorException: Error code 19:
  UNIQUE constraint failed: index 'category_name_lower_unique'`. Test fakes are copied from this
  real message. If Drizzle is upgraded, check the shape on the phone again.
- **Lint `react-hooks/set-state-in-effect`** flags an effect that calls a `useCallback` function
  containing setState, even if the setState runs after `await`. Keep the async function *inside*
  the effect, and in handlers reload directly.

- **drizzle-kit 0.31 quotes expression indexes wrongly** (`(\`lower("name")\`)` instead of
  `(lower("name"))`). Always read generated SQL; fix expression indexes by hand before the
  migration runs anywhere.
- **`PRAGMA foreign_keys=OFF` in a generated migration does nothing**: Drizzle runs all pending
  migrations in one transaction, and SQLite ignores that PRAGMA inside a transaction. A table
  rebuild of a table that others reference (category, account, snapshot) therefore fails with
  `FOREIGN KEY constraint failed` once rows exist. Decide a solution before the next rebuild
  migration (e.g. switch foreign keys off in `client.ts` before migrating and on afterwards,
  plus `PRAGMA foreign_key_check`). Adding a column does not rebuild and is not affected.
- **Backfill:** a new rule that existing rows would break needs an `UPDATE` in the migration
  first (`drizzle-kit generate --custom` for hand-written SQL). A default only affects new rows.
- After editing a `.sql` migration, start with `npx expo start --clear` (Babel caches the inlined SQL).

## Testing

Set up on 08.10.2026, first test: `toUserMessage`. Next candidates, tests written **before** the
function: the date → `year_month` function (January, September, December, single-digit months),
the chart segment computation (step 8). I write the functions myself from now on — I know the
shape (guard clause, `includes`, red → green).
**Lesson (12.10.2026):** green tests only prove the code matches the fake. Build fakes from what
the device really produced (log it once), not from what the docs suggest.

## Later: bug reports (V3-6)

The report button for unexpected errors is goal V3-6 (pre-filled email). Privacy requirements:
show the user what will be sent, leave out query parameters (they can contain account names and
values), send through the user's own email app. Copy: friendly but clear, not jokey.

## Parked ideas

Not in V1–V3. Noted so they don't get lost; decide when the time comes.

- **Shortcut from Month detail to Manage** (13.10.2026). An edit link in Month detail that opens
  Manage. Merging the two screens was dropped: viewing and managing stay separate
  (`08-screens.md`). Candidate for the UX polish after V2.
- **Promotion website** (14.10.2026). Apple-style product page (iPhone pages as reference):
  high quality page as a promise of a high quality app. Interactive dummy screens to try the app
  in the browser, or demo videos, then links to the stores. Depends on store publishing (N7, out
  of scope for this project). Ideas: no tracking on the page either (same promise as the app);
  check whether Expo's web build can turn the real screens with seed data into the demo (a demo
  page is not a web version of the app, N11).
- **Flatter settings** (14.10.2026). "Manage" stays the title for now. Maybe later: settings less
  deeply nested, and the check day as its own setting instead of inside Manage.

## Dev-process tips

Collected on the go; a `docs/learnings/` file once there are enough.

- **Sketch a screen's interactions before its first bite** (14.10.2026): elements, what each tap
  does, the states and errors. Paper is enough. Visual polish can come later. (Manage's look was
  deliberately not designed, but its interactions weren't either, so UI questions came up while
  coding.)

## Docs

- `docs/process/`: the concept chapters 1–11.
- `docs/learnings/`: concepts and best practices. Done: schema design, migrations, styling,
  engineering judgment, error handling. New topics only when I name them.
- `docs/guides/`: step-by-step instructions to repeat. Done: setup, commits, database setup
  (complete), NativeWind setup, testing setup.
- `docs/technical/`: this file, `DEFAULT_README.md`.
- Style for learnings and guides: like `docs/guides/setup.md` — short dated intro, tables, bold
  numbered steps, prose that explains why. Every new file gets a row in its README table.
- Process for learning docs: I name the topic, Claude gives keywords, I write what I remember,
  Claude corrects it and shows a draft in the chat, I confirm, Claude writes the file.
- Commits: Conventional Commits with `feat:` (not `feature:`), see `docs/guides/commits.md`.

## How Claude works with me

These add to `CLAUDE.md`.

- **The loop, in bites (since 12.10.2026):** each step is split into small bites. One bite = a
  short theory piece with the exact syntax (checked against the installed versions, examples on
  unrelated data) + one small challenge. I implement, come back, get a short review, next bite.
  Claude gives the syntax, the logic is mine. If I'm stuck on syntax, Claude shows the structure
  with a blank for the logic. Tried on `getCategoriesWithAccounts()`, and it was the right balance
  between theory and coding.
- **Who writes what:** the first time a concept appears, I write it (in bites). Repeats of a
  pattern I already wrote (e.g. `createAccount` after `createCategory`) Claude may draft for me
  to review. Small fixes (typos, a forgotten import) Claude applies directly and says what it
  changed. Design questions always come to me.
- **Reviews** list everything in one pass. The question → hint → concept ladder only when I ask
  for a hint.
- When I explicitly ask Claude to write something, it does — then explains it.
- **Commands:** I run every command in the project myself, including type checks. Claude gives
  the command and explains it.
- **Docs:** always show a draft in the chat and say where it goes before editing a doc file.
- **Config** copied from official docs Claude may write when I ask, then explains every line.
- **Check-questions are optional.** One at a time at most; when I want to move on, move on.
- **Over-engineering:** I want good practice, not overkill. Use the "permanent, silent, cheap"
  test and say when something is overkill.
- **Next steps:** every reply ends with one "Next steps" list (to-dos and the challenge together)
  and all open questions written out in full. No repeated reminders I already acknowledged.
- **Options at the end (since 13.10.2026):** **w** = next bite (its framing questions come at the
  start of that bite, not at the end of the previous one), **r** = review my fixes in the code,
  **e** = end the session and update this file.
- **Background:** I know React, Next.js and Tailwind and studied software engineering. First
  React Native app, first SQLite on a device. Styling is not my strength. My goal is to think and
  judge like an engineer, not to memorise syntax.
