# Error handling

Learned while building the Manage screen (step 3, 05.–13.10.2026). How errors travel from the
database to the screen, who catches what, and how to test it. Related:
[Engineering judgment](engineering-judgment.md) (make bugs loud).

## Expected and unexpected errors

Every decision below starts with one question: did I see this error coming?

| Kind | Examples | Who can fix it | What happens |
| ---- | -------- | -------------- | ------------ |
| Expected | Duplicate name, empty name | The user | Translated into a message, the user corrects the input |
| Unexpected | Broken database, wrong id, a bug in my code | Only me, with a bug fix | Caught, general message to the user, original error logged |

Expected errors are not luck. A database constraint (unique index, `CHECK`) is what turns "a
duplicate slipped in" into a known error with a name I can recognise.

## Catch where you can respond

An error is caught where something meaningful can be done about it, not where it happens.

- **The data function** knows what a constraint error means, so it translates the expected ones.
  It does not know which screen is open, whether the typed text should stay, or what to show.
  Everything it cannot translate, it re-throws.
- **The screen** knows all of that, so it is the last stop for unexpected errors.

Catching in the wrong place has no good outcome: returning `[]` from a failed read is a lie (the
screen shows "No categories yet"), logging and re-throwing logs twice, and returning a result
object everywhere makes every read noisy.

## How errors travel: result or throw

|               | Expected                                       | Unexpected                                 |
| ------------- | ---------------------------------------------- | ------------------------------------------ |
| Data function | Returns `{ ok: false, error }` (`WriteResult`) | Re-throws                                  |
| Screen        | Shows `error`, keeps the typed text            | `catch`: general message + `console.error` |

**Translating:** `toUserMessage(error)` returns a message for the errors it knows and `null` for
everything else. `null` means "I don't know this one", so the caller re-throws it. The helper
never guesses.

**A bug is not a user error.** `changes === 0` after an update means the caller passed an id that
does not exist; a wrong `categoryId` fails the foreign key. The user cannot cause either through
the UI, so both are thrown, not returned as messages.

## Never silent

- **The user is always told.** An `async` handler without `catch` ends as an unhandled rejection:
  a warning in development, nothing at all in a release build. The user taps and nothing happens.
- **Two audiences.** The user gets a general, honest message ("Something went wrong on our side.
  It's not something you did.") and keeps their input. I get the original through `console.error`.
- **The original does not reach me by itself.** In development it is in the Metro terminal. In a
  release build it is gone unless the app hands it over and the user chooses to send it (V3-6).

## Three layers of checks

| Layer | Job | Example |
| ----- | --- | ------- |
| Screen | Help before failing, show errors | Message under the input, cleared while typing |
| Data function | Prepare and translate | `trim()`, constraint error → readable message |
| Database | Final guard on every write path | Unique index on `lower(name)`, `CHECK (length(trim(name)) > 0)` |

The database rule matters most: screens change, a CSV import comes later, the constraint stays.

**No check-then-act.** Don't ask "does this name exist?" before inserting. Insert, and handle the
rejection. Between check and insert the facts can change, and the rule would live in two places.

## Testing errors

**Fakes from reality.** The first `toUserMessage` read `error.cause.message`, because the Drizzle
docs describe a wrapped `DrizzleQueryError`. The expo-sqlite driver throws a plain `Error` with
everything in `message`. The tests were green, the app was wrong. Green tests only prove the code
matches the fake: trigger the real error once on the device, log it, and build the fake from that.

**Trigger word.** To test a screen's catch without touching the real code, add one temporary line
as the first line inside the `try`:

```tsx
if (text === "boom") throw new Error("test"); // TEMP
```

One run tests every branch: "boom" → unexpected, an existing name → expected, a new name → happy
path. Delete the line before committing; searching for `TEMP` finds it. Don't comment out the real
code to test the catch: then the version you commit never ran.
