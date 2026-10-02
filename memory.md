# Session memory

Where the build stands between sessions, so work can continue on any computer.
Last updated: 30.09.2026.

## Where things stand

- **Step 1 done:** empty screens with a Stack. `src/app/`: `index.tsx` (Home, `/`), `entry.tsx`,
  `month/[month].tsx` (reads the param, sets its header with `Stack.Title`), `settings.tsx`
  (one link to Manage), `manage.tsx`. Each screen has its own background color for now.
- NativeWind v4.2.7 with Tailwind v3 is set up and works on the phone (yellow test screen).
  Recorded as Decision 3 in `06-decisions.md`; the decisions in chapter 7 are now 4–8.
- The app runs in Expo Go. A development build is still needed before V1 is done (V1-1),
  earlier if the chart library needs native code.
- The data layer lives under `src/` (`src/db/`, `src/data/`). Not documented on purpose: the rule
  "only the data layer contains SQL" is unchanged.

## Build order

1. Empty screens and navigation: Home, Entry, Month detail, Manage
   (Settings has nothing to do in V1, Onboarding is V2)
2. Open the database, first migration with the five tables
   → **Chart test here** (option C): try a chart library with dummy data, then decide on
   the library and whether a development build is needed now
3. Data functions for categories and accounts, Manage screen (V1-2) — first real SQL
4. Entry flow, one account at a time (V1-3, V1-4)
5. Resume an interrupted entry (V1-5)
6. Home: total and change since last month (V1-6)
7. Month detail with previous/next and corrections (V1-8, V1-9)
8. Chart (V1-7)
9. Development build, check that an update keeps the data (V1-1, V1-10)

**Proposed, not yet confirmed — the "middle path":** screens that only show data start with
dummy data returned by typed functions in `src/data/`. The dummy data is deliberately awkward:
a missing month, a negative value, a zero. Screens that create data (Manage, Entry) use the real
database from the start. The screens never change when the dummy data is replaced by SQL.

## Decided in step 1

- Home is `src/app/index.tsx` at `/`, no `/home`.
- The month reaches Month detail as a route param: `month/[month].tsx`, read with
  `useLocalSearchParams`. Not validated yet — `/month/mange` or `2026-13` get through.
- Navigation: Stack (A). Tabs can be added later with a group layout if wanted.
- Settings exists in V1 with a single row, Manage (option B), so Home's gear never has to change.
- No central `paths.ts`: the file tree is the route definition and typed routes catch broken
  links. A `monthHref()` helper may make sense once a second screen links to months.

## Testing

I want to learn testing, I have done too little of it. Set it up when the first pure data-layer
function exists (the year_month function, step 2/3). Write the tests **before** the function:
my list of awkward inputs is the test.

## Next step

Step 2: open the database, first migration with the five tables, then the chart test.
The "middle path" for dummy data is still unconfirmed.

## How Claude works with me

These add to `CLAUDE.md`. Since 30.09.2026 the core rule is: Claude gives a short theory
introduction in the chat, I implement, Claude reviews on request. I run all commands.

- **Docs:** always show a draft in the chat and say where it goes before editing any
  documentation file.
- **Files:** Claude creates files only when I ask. Configuration copied from official docs
  (babel, metro, tailwind config) Claude may write when I ask, then explains every line —
  retyping it teaches nothing. App logic stays mine.
- **Check-questions are optional.** One at a time at most; when I want to move on, move on.
- **Background:** I know React, Next.js and Tailwind. This is my first React Native app and my
  first time with SQLite on a device. Styling is not my strength.
