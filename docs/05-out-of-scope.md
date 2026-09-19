# 5. Out of scope


Everything in this list is deliberately not part of this version. The list exists so that these things are not accidentally built later "just quickly".

| Nr  | Not in scope | Reason |
| --- | ------------ | ------ |
| N1  | Budgeting and planning | The product tracks what is real. Planning is the thing every other app does and the thing this app deliberately refuses. |
| N2  | Tracking single transactions, expenses or receipts | Would turn the five minutes a month into a daily task. |
| N3  | Automatic connection to banks | Needs banking interfaces, agreements and constant maintenance, and would break the local-only principle. |
| N4  | Several currencies and currency conversion | One number per account is enough. The user knows their own currency. |
| N5  | Cloud sync, user accounts, login, server | Contradicts V1-10 and R8, and would introduce exactly the privacy questions this app avoids. |
| N6  | Sharing, households, several users on one dataset | The app belongs to one person on one device. |
| N7  | Publishing in the App Store and Play Store | A separate project with its own costs, accounts and review processes. |
| N8  | Monetisation, ads, subscriptions | Not a goal of this project. |
| N9  | Financial advice, forecasts or recommendations | The app shows numbers, it does not interpret them. |
| N10 | More languages than English | Planned for later, prepared for in the structure (K4). |
| N11 | A web or desktop version | Mobile only. |
| N12 | Return calculations, performance or tax figures | A snapshot cannot tell whether a change came from saving or from the market. Pretending otherwise would be an illusion, not the truth. |
| N13 | An in-app chat or a feedback server | Feedback runs through the user's own email app (K6), so the app needs no backend. |

### Note on N12

If an investment account grows by 2000, the app cannot know whether the user paid 2000 in or the market moved. Any return figure would be invented, which is the same mistake as a fake trend line. A later version could add a "deposits this month" field per account, which would make a real return calculation possible. That is a future direction, not part of this version.

---

[← Requirements](04-requirements.md)  ·  [Options and decisions →](06-decisions.md)  ·  [Overview](../README.md)
