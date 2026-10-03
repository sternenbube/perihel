# Engineering judgment

Learned while designing Perihel's navigation and database (steps 1 and 2, 28.09.–02.10.2026).
Less about a technology, more about how to decide. Examples are from
[Schema design and constraints](schema-design.md) and [Local database and migrations](migrations.md).

## Where to draw the line

"Could this go wrong?" is the wrong question — anything could. Three questions decide whether
something deserves protection:

| Question | Protect when |
| -------- | ------------ |
| Is the damage permanent? | A bad value in the database outlives the bug that wrote it. A UI bug disappears with the next update. |
| Is the damage silent? | A crash gets noticed. A wrong number in a chart may never be. |
| Is the protection cheap? | One line, not a day of work. |

**Permanent, silent and cheap → protect. Visible, temporary or expensive → don't.**

Applied to `year_month`: in V1 the user never types a month, so validating user input would
protect against nothing. The real risk is my own code — `getMonth()` counts from 0 and adds no
leading zero, so September easily becomes `"2026-8"`. Permanent, silent, and one line to prevent.
So: a database `CHECK` and one tested function. Not more.

## Defense in depth

Several layers, each catching what the others miss — but only layers that cover a real risk.

| Layer | Runs | Protects |
| ----- | ---- | -------- |
| Unit test | On my computer, before shipping | One function — only the code it tests |
| Database `CHECK` | On the phone, on every write | Every path into the table, including code that does not exist yet |

A passing test does not make the constraint unnecessary: a second helper written months later, a
CSV import or a migration would bypass the tested function. The constraint does not care who
writes.

## Make bugs loud

A silent bug writes data that the database accepts but the app cannot use. Nothing fails, so
nothing points at the cause, and it is found months later — if ever. A loud bug fails at the first
test and points at the line.

Choices that make bugs loud: no default as a safety net (a forgotten `sort_order` fails instead of
becoming `0`), `NOT NULL` instead of a third state, `CHECK` constraints, `restrict` instead of
`cascade`.

## Absence is a fact

"Not entered" and "zero" are different facts. A month that was not entered has no rows; NULL is
not used to mean "nothing", because a missing row already says it. One way to say a thing — two
ways end up disagreeing somewhere.

## Build for now, postpone safely

V1 only gets what V1 needs. Postponed in step 2:

- `sort_order` — reordering is V3-7; V1 sorts by `id`
- normalizing month strings — only needed for the CSV import (V2-9)
- the snapshot status — added as migration 2 when step 5 needs it

Postponing is safe when two things hold:

1. **Adding later is cheap.** A migration can fill `sort_order` from `id`; nothing is lost by waiting.
2. **The door is already guarded.** Bad months are rejected by the `CHECK` until normalization exists.

**Do not postpone what cannot be reconstructed.** Structure can be added later; data that was
never recorded cannot be recovered. A timestamp of when a month was entered, for example, exists
only from the day it is stored.

Postponing also has a learning benefit: the status column will be the first migration on a
database that already holds real data — the situation every app update is in.

## Reversible and irreversible decisions

How carefully to decide depends on how hard the decision is to undo.

| Decision | Cost to reverse | How it was decided |
| -------- | --------------- | ------------------ |
| Stack vs Tabs | A group folder and a layout | Quickly, with a recommendation |
| The schema | A migration on every phone, forever | Column by column, every constraint argued |

## Changing my mind

I first chose hand-written migrations (A1), then switched to Drizzle before writing a line. The
new information was my own goal: judgment and good practice, not writing SQL strings by hand —
and Drizzle delivers the type safety that TypeScript was chosen for. The switch was cheap at that
moment because no migration existed yet. A week later it would have needed a migration of the
migration tracking itself.

Changing a decision is not a failure. Changing it late, after the cost has grown, is the thing to
avoid — which is why it pays to ask "what do I know now that I did not know then?" before
building on a decision.
