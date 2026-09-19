# 6. Options and decisions


### Decision 1: Framework

**Options considered:** native development (Kotlin + Swift), Flutter, React Native with Expo, Capacitor/Ionic.

**Rejected early:** native development. Two codebases, two languages and two toolchains cannot be built and maintained in roughly 50 hours by one person. The result would be the best performing one and would not be finished.

**Main comparison:** Flutter against React Native with Expo. Flutter is technically the better fit for this app — charting libraries are more mature and the interface is more consistent across platforms. React Native with Expo wins on the criterion that matters most here: learning cost. I already work with React and Next.js, a React module is part of my studies, and the Expo modules cover the whole feature list of this app out of the box.

I have built an app in Flutter before, so the decision is not made out of unfamiliarity. When I first used it, I found the code harder to read than what I am used to from the React world, and I am faster and more comfortable in React today. For a project built in short evening sessions over three months, the speed at which I can work in the evening is a real factor for finishing on time.

**Decision:** React Native with Expo, written in TypeScript.

**Consequences:**

- The chart is the technically weakest point, since React Native charting libraries are less polished than Flutter's. This is the part to prototype early.
- TypeScript is used because wrong numbers are the one bug class this app cannot afford, and typed data structures catch missing or empty values before they reach a total.
- Flutter is not discarded, only postponed. A later project is a better moment for it, once React is solid.

### Decision 2: Local data storage

**Options considered:** a relational database on the device (SQLite via `expo-sqlite`), or a simple file / key-value store (AsyncStorage or a JSON file).

**The case for the simple option:** the amount of data is small. Fifteen accounts over ten years are around 1800 values, which could be kept in memory and written out as one file without any performance problem.

**The case for SQLite:** the data is genuinely relational — categories contain accounts, and each account has one value per month. Questions like "all values of March" or "the total per category over the last two years" are exactly what a database is built for. More important for this app, SQLite writes transactionally: an interrupted write does not leave a damaged file. With a single JSON file, every save rewrites the whole dataset, and a crash at the wrong moment can destroy everything. Requirements R3 and R4 make data safety non-negotiable, so this difference decides the question.

**Decision:** SQLite on the device, through `expo-sqlite`.

**Consequences:**

- Some extra setup and SQL knowledge are needed at the start. This is accepted on purpose: the project is also meant as a learning project, and a small application is a good environment to learn database work that can be reused in bigger projects later.
- Database changes need migrations. If a later version adds a column, existing entries must survive the update (R4). This has to be handled from the first version, not added afterwards.
- The CSV export (V2-8) becomes straightforward, because the data already lives in tables.

---

[← Out of scope](05-out-of-scope.md)  ·  [Architecture and data model →](07-architecture.md)  ·  [Overview](../README.md)
