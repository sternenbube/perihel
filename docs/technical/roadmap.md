# Roadmap

What gets built, in which order. Rough on purpose: the details of the current step live in
[memory.md](memory.md), the goals behind each item in
[03-goals.md](../process/03-goals.md). Last updated: 19.10.2026.

## V1 — I can track my own money (target: end of November 2026)

- [x] **1. Screens and navigation**: empty screens, Stack
- [x] **2. Database and chart spike**: Drizzle, migration 1, chart library (Decisions 9, 10)
- [ ] **3. Manage (V1-2)**: categories and accounts
  - [x] List and add categories, error handling
  - [x] One screen per category, routing (Decision 11)
  - [ ] Category screen: load the category, not-found
  - [ ] Rename a category on its screen
  - [ ] "+ Add" row for categories
  - [ ] Add and rename accounts
- [ ] **4. Entry flow (V1-3, V1-4)**: one number per account for a month, one account at a time
- [ ] **5. Resume an interrupted entry (V1-5)**: snapshot status as a migration
- [ ] **Seeds**: dev-only test data (a missing month, a negative value, a zero, a jump)
- [ ] **6. Home (V1-6)**: current total and change since last month
- [ ] **7. Month detail (V1-8, V1-9)**: previous/next month, correcting values
- [ ] **8. Chart (V1-7)**: from the `spike-chart` branch
- [ ] **9. Development build (V1-1, V1-10)**: runs on my phone, an update keeps the data
- [ ] **Styling pass**: rows look tappable, screens look finished

## V2 — Ready for other people (target: 24.12.2026)

- Deactivate and reactivate accounts (V2-3)
- Onboarding with examples and the check day (V2-4)
- Countdown instead of a chart with only one month (V2-5)
- Dotted line for missing months (V2-6)
- Swipe between months (V2-7)
- CSV export and import (V2-8, V2-9)
- Tested on Android and iOS, used by test users (V2-1, V2-2, V2-10)

## V3 — Later

TestFlight, monthly reminder, dark mode, more languages, biometric lock, bug report button,
reordering, a chart per category (V3-1 to V3-8).

## Parked

Ideas outside V1–V3 are in [memory.md](memory.md#parked-ideas).
