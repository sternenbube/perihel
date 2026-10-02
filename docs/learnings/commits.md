# Commit messages

The convention for commit messages in this project, based on Conventional Commits.

## Format

```
<type>(<scope>): <subject>
```

The scope is optional and names the part of the app the commit touches: `db`, `data`, `entry`,
`chart`, `home`, `nav`.

| Type | When |
| ---- | ---- |
| `feat` | A new capability |
| `fix` | A bug fix |
| `refactor` | Same behaviour, different code |
| `docs` | Documentation only |
| `chore` | Dependencies, config, tooling |
| `test` | Tests only |
| `style` | Formatting only |

Examples for Perihel:

```
feat(db): add migration runner
feat(entry): keep progress when app goes to background
fix(chart): show gap month as dotted instead of skipping it
refactor(data): move totals calculation out of the home screen
chore: add expo-sqlite and react-native-svg
docs: split concept documentation into chapters
```

## Three rules for the subject line

**1. Imperative mood.** "add", not "added" or "adds". The convention reads as _this commit will_
add X. It feels odd for two days, then it is automatic.

**2. At most about 50 characters, no full stop.** If it does not fit, the commit usually does two
things and should be two commits.

**3. Say what changed, not what you did.** "fix login" is weak. "fix crash when month has no
entries" tells you whether this is the commit you are looking for.

## When to write a body

When the _why_ is not visible in the diff. The diff already shows what changed. It cannot show
what was tried first, what constraint forced it, or what breaks if someone undoes it. Working
alone needs more of this discipline, not less: in half a year nobody remembers the reason.

```
fix(totals): treat missing entries as absent, not zero

A month without entries was summing to 0 and drawing a crash in the
chart. Missing and zero are different facts (docs/process/07-architecture.md,
Decision 5), so the query now filters them out instead of coalescing.
```

The body is separated from the subject by an empty line, which is how git tells the two apart.

Rule of thumb: no body for routine work; a body for anything where future me might ask "why on
earth did I do it like that?"

## Goal IDs

Commits that work towards a goal from [chapter 3](../process/03-goals.md) end with its ID:

```
feat(entry): guided flow, one account per step (V1-4)
```

Then `git log --grep "V1-4"` lists everything that went into that goal. That is traceability
for almost no effort, and it makes the test results in chapter 10 much easier to write.
