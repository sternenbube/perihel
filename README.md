# Perihel

_Your money, once around the sun._

A finance tracker you open once a month. You sit down for five minutes, write down the current
balance of each of your accounts, and that is it. Over the months you see whether your money is going up or down.

It does not build a budget, it does not import transactions, it does not categorise spending.
It records real numbers, as they actually are in your real accounts. Most budgeting apps sell you a plan that was never going to survive contact with reality. This one shows what is actually there.

**Why the name.** The perihelion is the point in an orbit where a body comes closest to the sun —
reached once per orbit, on schedule, every time. That is what this app is: one moment in each cycle when you come close, take a look, and carry on.

> The name still has to be checked against the app stores and the trademark registers.

**Status:** concept finished, implementation starting.
**Stack:** React Native with Expo, TypeScript, SQLite on the device.
**Target dates:** V1 end of October 2026 · V2 on 24.12.2026 · V3 open.

[Expos Default Readme](DEFAULT_README.md)

---

## Documentation

| Chapter                                                          | What it answers                               |
| ---------------------------------------------------------------- | --------------------------------------------- |
| [1. Introduction](docs/01-introduction.md)                       | What the app is, why it exists, who it is for |
| [2. Current situation and problem](docs/02-current-situation.md) | Why it needs to exist at all                  |
| [3. Goals](docs/03-goals.md)                                     | What has to be true for each version          |
| [4. Requirements](docs/04-requirements.md)                       | How well it has to do those things            |
| [5. Out of scope](docs/05-out-of-scope.md)                       | What is deliberately not being built          |
| [6. Options and decisions](docs/06-decisions.md)                 | Framework, storage, and why                   |
| [7. Architecture and data model](docs/07-architecture.md)        | Tables, rules, layering                       |
| [8. Screens and user flow](docs/08-screens.md)                   | Screens, navigation, mockups                  |
| [9. Implementation notes](docs/09-implementation-notes.md)       | What changed during the build                 |
| [10. Test cases and results](docs/10-test-cases.md)              | One test per goal                             |
| [11. Evaluation and self-reflection](docs/11-evaluation.md)      | What worked, what did not                     |

[CLAUDE.md](CLAUDE.md) describes how Claude works on this project.

---

## Progress

### V1 — I can track my own money

| Nr    | Goal                                                                                                              | Done |
| ----- | ----------------------------------------------------------------------------------------------------------------- | ---- |
| V1-1  | The app runs on my own phone as a development build.                                                              |      |
| V1-2  | I can create categories and freely named accounts inside them, and rename both.                                   |      |
| V1-3  | A snapshot belongs to a month and holds one number per account; negative values are allowed and reduce the total. |      |
| V1-4  | Entering a snapshot works as a guided flow, one account at a time.                                                |      |
| V1-5  | The entry flow survives switching to another app — it resumes at the same account with the entered values intact. |      |
| V1-6  | The home screen shows the current net worth and the change compared to the previous month.                        |      |
| V1-7  | The home screen shows the development over time as a line chart.                                                  |      |
| V1-8  | A detail view shows all numbers of one month, with buttons to move to the previous and next month.                |      |
| V1-9  | Any past entry can be corrected at any time.                                                                      |      |
| V1-10 | All data stays on the device and survives closing the app and installing a new version.                           |      |
| V1-11 | The app is in English.                                                                                            |      |

### V2 — Ready for other people

| Nr    | Goal                                                                                                | Done |
| ----- | --------------------------------------------------------------------------------------------------- | ---- |
| V2-1  | The app runs on at least one test user's phone.                                                     |      |
| V2-2  | The app has been tested on both Android and iOS.                                                    |      |
| V2-3  | Accounts can be deactivated and reactivated without losing their history.                           |      |
| V2-4  | On first start the app guides the user through creating categories and accounts, and the check day. |      |
| V2-5  | While only one snapshot exists, the app shows a countdown instead of invented data.                 |      |
| V2-6  | Months without an entry are shown as a dotted line in the chart.                                    |      |
| V2-7  | The detail view can be swiped left and right to move between months.                                |      |
| V2-8  | All data can be exported as a CSV file that opens in Excel.                                         |      |
| V2-9  | Data can be imported from a CSV file, and the app provides a template.                              |      |
| V2-10 | At least 3 test users have each entered one real snapshot.                                          |      |

### V3 — Later

| Nr   | Goal                                                                 | Done |
| ---- | -------------------------------------------------------------------- | ---- |
| V3-1 | Available on TestFlight for external testers.                        |      |
| V3-2 | Monthly reminder on the chosen check day.                            |      |
| V3-3 | Dark mode.                                                           |      |
| V3-4 | Prepared for further languages.                                      |      |
| V3-5 | The app can be locked with the device's biometric lock.              |      |
| V3-6 | A button that reports a bug or a feature wish as a pre-filled email. |      |
| V3-7 | Categories and accounts can be reordered.                            |      |
| V3-8 | The chart can be shown per category.                                 |      |
