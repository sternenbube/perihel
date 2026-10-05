# Session memory

Where the build stands between sessions, so work can continue on any computer.
Loaded automatically through `CLAUDE.md`. Last updated: 05.10.2026.

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

**Next:**

1. **Decide the "middle path"** (see Build order) — ask me before step 3.
2. **Step 3: data functions for categories and accounts, and the Manage screen (V1-2).** The first
   real queries through the Drizzle `db` from `src/db/client.ts`. Framing first: ask me how I
   would approach it. Testing gets set up with the first pure function (see Testing).

**Version caution:** Drizzle docs are written for the 1.0 RC; we use stable 0.45. Check imports
and APIs against the installed package (`node_modules/drizzle-orm/expo-sqlite/`) before advising.
Expo docs: always the SDK 57 versioned pages.

## Where things stand

- **Step 1 done:** empty screens with a Stack. `src/app/`: `index.tsx` (Home, `/`), `entry.tsx`,
  `month/[month].tsx` (reads the param, header via `Stack.Title`), `settings.tsx` (one link to
  Manage), `manage.tsx`. Each screen has its own background colour for now.
- **Styling:** NativeWind 4.2.7 with Tailwind v3, works on the phone. Decision 3.
- **Step 2a done:** Drizzle 0.45 + drizzle-kit 0.31 + `expo-sqlite` 57, configured
  (`drizzle.config.ts`, Babel inline-import, Metro `sql` extension). Schema in
  `src/db/schema.ts`, migration 1 in `src/db/migrations/0000_initial_schema.sql`, run at startup
  through `useMigrations`. The database file lives in the app's sandbox on the phone.
- The app runs in Expo Go. A development build is needed before V1 is done (V1-1), earlier if the
  chart library needs native code.

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

1. ~~Empty screens and navigation~~ done
2. ~~Open the database, migration 1, chart test~~ done (Decisions 9 and 10)
3. **Next:** data functions for categories and accounts, Manage screen (V1-2) — first real queries
4. Entry flow, one account at a time (V1-3, V1-4)
5. Resume an interrupted entry (V1-5) — adds the snapshot status as migration 2
6. Home: total and change since last month (V1-6)
7. Month detail with previous/next and corrections (V1-8, V1-9)
8. Chart (V1-7) — start from the `spike-chart` branch; segments and labels computed in the data layer
9. Development build, check that an update keeps the data (V1-1, V1-10)

**Proposed, not yet confirmed — the "middle path":** screens that only show data start with
dummy data returned by typed functions in `src/data/`, deliberately awkward (a missing month, a
negative value, a zero). Screens that create data (Manage, Entry) use the real database from the
start. Ask me before step 3.

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

## Testing

I want to learn testing. Set it up with the first pure data-layer function — the date →
`year_month` function. Write the tests **before** the function: January, September, December,
single-digit months.

## Docs

- `docs/process/`: the concept chapters 1–11.
- `docs/learnings/`: concepts and best practices. Done: schema design, migrations, styling,
  engineering judgment. New topics only when I name them.
- `docs/guides/`: step-by-step instructions to repeat. Done: setup, commits, database setup
  (complete), NativeWind setup.
- `docs/technical/`: this file, `DEFAULT_README.md`.
- Style for learnings and guides: like `docs/guides/setup.md` — short dated intro, tables, bold
  numbered steps, prose that explains why. Every new file gets a row in its README table.
- Process for learning docs: I name the topic, Claude gives keywords, I write what I remember,
  Claude corrects it and shows a draft in the chat, I confirm, Claude writes the file.
- Commits: Conventional Commits with `feat:` (not `feature:`), see `docs/guides/commits.md`.

## How Claude works with me

These add to `CLAUDE.md`.

- **The loop:** I frame the task, Claude gives a short theory intro with a small illustrative
  snippet, I implement, Claude reviews on request. When I explicitly ask Claude to write
  something, it does — then explains it.
- **Commands:** I run every command in the project myself, including type checks. Claude gives
  the command and explains it.
- **Docs:** always show a draft in the chat and say where it goes before editing a doc file.
- **Config** copied from official docs Claude may write when I ask, then explains every line.
- **Check-questions are optional.** One at a time at most; when I want to move on, move on.
- **Over-engineering:** I want good practice, not overkill. Use the "permanent, silent, cheap"
  test and say when something is overkill.
- **Background:** I know React, Next.js and Tailwind and studied software engineering. First
  React Native app, first SQLite on a device. Styling is not my strength. My goal is to think and
  judge like an engineer, not to memorise syntax.
