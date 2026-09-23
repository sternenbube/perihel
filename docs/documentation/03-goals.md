# 3. Goals


The goals are split into three versions. Every goal belongs to exactly one version and is written so that it can be answered with yes or no.

The idea behind the split: V1 is the smallest version that lets me track my own money for real. V2 is the version other people can use. V3 is everything that can wait. This way there is a working result after a few weeks instead of only at the end, and the remaining work becomes improvement rather than obligation.

Target dates: **V1 by the end of October 2026, V2 by 24.12.2026, V3 open.**

### V1 — I can track my own money

| Nr | Goal |
| --- | ---- |
| V1-1 | The app runs on my own phone as a development build. |
| V1-2 | I can create categories and freely named accounts inside them, and rename both. |
| V1-3 | A snapshot belongs to a month and holds one number per account; negative values are allowed and reduce the total. |
| V1-4 | Entering a snapshot works as a guided flow, one account at a time. |
| V1-5 | The entry flow survives switching to another app — it resumes at the same account with the entered values intact. |
| V1-6 | The home screen shows the current net worth and the change compared to the previous month. |
| V1-7 | The home screen shows the development over time as a line chart. |
| V1-8 | A detail view shows all numbers of one month, with buttons to move to the previous and next month. |
| V1-9 | Any past entry can be corrected at any time. |
| V1-10 | All data stays on the device and survives closing the app and installing a new version. |
| V1-11 | The app is in English. |

### V2 — Ready for other people

| Nr | Goal |
| --- | ---- |
| V2-1 | The app runs on at least one test user's phone. |
| V2-2 | The app has been tested on both Android and iOS. |
| V2-3 | Accounts can be deactivated and reactivated without losing their history; deactivated accounts are not asked for during entry. |
| V2-4 | On first start the app guides the user through creating categories and accounts, with examples, and lets them choose the check day. |
| V2-5 | While only one snapshot exists, the app shows a countdown to the next check day instead of invented data. |
| V2-6 | Months without an entry are shown as a dotted line in the chart. |
| V2-7 | The detail view can be swiped left and right to move between months. |
| V2-8 | All data can be exported as a CSV file that opens in Excel. |
| V2-9 | Data can be imported from a CSV file, and the app provides a template with the correct structure. |
| V2-10 | At least 3 test users have each entered one real snapshot. |

### V3 — Later

| Nr | Goal |
| --- | ---- |
| V3-1 | Available on TestFlight for external testers. |
| V3-2 | Monthly reminder on the chosen check day, leading into the entry form. |
| V3-3 | Dark mode. |
| V3-4 | Prepared for further languages. |
| V3-5 | The app can be locked with the device's biometric lock. |
| V3-6 | A button that reports a bug or a feature wish as a pre-filled email. |
| V3-7 | Categories and accounts can be reordered. |
| V3-8 | The chart can be shown per category, not only as a total. |

### Notes on the goals

TestFlight is deliberately in V3. It requires a paid Apple developer account, a build on a Mac and a review by Apple. That is a dependency outside my own control and it should not decide whether a version is finished on time.

V2-5 exists because the app must never show invented data. The whole idea of the product is to show the truth instead of an illusion, and a fake trend line for new users would contradict that in the first thirty seconds. The countdown to the next check day is honest and still gives the user a reason to come back.

V1-5 comes from how the app is really used: the user switches to a banking app, reads a number, switches back. If that switch loses the progress of the entry, the five-minute promise does not hold. It is therefore in V1 and not a later improvement.

The CSV export sits in V2 rather than V1, because in V1 the only data at risk is my own and only a few months old. From the moment other people enter their numbers, getting the data out again becomes part of the promise.

---

[← Current situation and problem](02-current-situation.md)  ·  [Requirements →](04-requirements.md)  ·  [Overview](../../README.md)
