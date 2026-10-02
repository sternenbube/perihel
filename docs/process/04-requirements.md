# 4. Requirements


The goals in chapter 3 say what the app must be able to do. This chapter says how well it has to do it. These qualities are not features, but they decide whether the app is worth using.

| Nr | Area | Requirement |
|----|------|-------------|
| R1 | Speed | Entering a full monthly snapshot takes the user 5 to 10 minutes including logging into their bank accounts. The app itself must never be the reason it takes longer — the time belongs to the banks, not to the entry form. |
| R2 | Speed | The app opens and shows the current numbers without a noticeable waiting time. |
| R3 | Data safety | Nothing is deleted without an explicit confirmation by the user. |
| R4 | Data safety | An app update never loses or overwrites existing entries. |
| R5 | Offline | The app works completely without an internet connection. |
| R6 | Scale | The number of accounts and the number of months are not limited. The chart stays readable by letting the user choose the time range shown, instead of squeezing all years onto one screen. |
| R7 | Simplicity | A new user understands the main screen without reading a guide. |
| R8 | Privacy | No tracking, no analytics, no data leaves the device. Data only ever leaves through an export that the user starts themselves. |
| R9 | Maintainability | The code is modular, so new functions can be added later without rebuilding the existing ones. |

R1 is the reason for V1-5. The real time is spent logging into the bank accounts, so an entry form that cannot be interrupted and resumed would break the five-minute promise no matter how fast the app itself is.

---

[← Goals](03-goals.md)  ·  [Out of scope →](05-out-of-scope.md)  ·  [Overview](../../README.md)
