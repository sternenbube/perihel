# Testing setup

Set up on 08.10.2026 with Jest 29.7 and `jest-expo` 57, following the Expo unit testing guide.
The first test: [src/data/__tests__/errors.test.ts](../../src/data/__tests__/errors.test.ts).

## Steps

**1. Install.**

```bash
npx expo install jest-expo jest @types/jest --dev
```

Jest is the test runner. `jest-expo` is a preset that configures it for Expo: TypeScript, JSX, and
mocks for native modules. `--dev` because tests never ship in the app.

**2. Configure Jest** in `package.json`:

```json
"scripts": { "test": "jest" },
"jest": {
  "preset": "jest-expo",
  "moduleNameMapper": { "^@/(.*)$": "<rootDir>/src/$1" }
}
```

`moduleNameMapper` teaches Jest the `@/` shortcut. Metro and TypeScript know it from
`tsconfig.json`, Jest does not — without it, any import with `@/` fails with "Cannot find module".
The Expo guide does not mention this.

**3. Tell TypeScript about Jest** in `tsconfig.json`, inside `compilerOptions`:

```json
"types": ["jest"]
```

Otherwise `describe`, `test` and `expect` are unknown names.

**4. Run the tests.**

```bash
npm test
```

## Rules for test files

- **Where:** in a `__tests__` folder next to the code: `src/data/__tests__/errors.test.ts`.
  Jest finds every file in a `__tests__` folder and every file ending in `.test.ts`.
- **Never under `src/app/`.** Expo Router treats every file there as a route.
- **Tests import the code, never the other way round.** Metro bundles only what the app imports;
  a test file imported by app code ends up in the app, where `test` and `expect` do not exist.
- **Tested functions do not import `db`.** Jest runs on the computer, where there is no SQLite
  database. Pure functions get their own module, like `src/data/errors.ts`.

## How a test looks

```ts
describe("toUserMessage", () => {
  test("translates an empty category name", () => {
    const error = databaseError("CHECK constraint failed: category_name_not_empty");
    expect(toUserMessage(error)).toBe("The name cannot be empty.");
  });
});
```

`describe` groups the tests for one function; `test` registers one case, run later by Jest. Each
test builds its input, calls the function and checks the result with `expect` — which throws when
the values differ, and a throw is a red test. Jest provides all three globally, no import needed.

## Writing tests first

1. Write the tests, one per case, before the function exists.
2. Create the function so that it only returns a placeholder, and run `npm test`: red. This proves
   the tests can fail.
3. Write the function until every test is green.

Tests that pass against the placeholder by accident prove little on their own — they matter
together with the others.
