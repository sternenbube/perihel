# Development environment

Set up on 19.09.2026 with Expo SDK 57, React Native 0.86 and React 19.

## What is needed

| Tool | Version | Why |
| ---- | ------- | --- |
| Node | 24 LTS | React Native and Expo are tested against long-term-support versions |
| nvm | 0.40.7 | switches between Node versions |
| git | any recent | version control; on macOS it comes with the Xcode command line tools |
| Expo Go | from the app store | runs the app on a real phone without a native build |

## Steps

**1. Install nvm** with its official script, not with Homebrew. nvm has to be a shell function so that it can change the Node version of the running shell. Installed as a Homebrew package it does not work properly, and its maintainers do not support that route.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.7/install.sh | bash
```

The script adds a block to `~/.zshrc`. Open a new shell afterwards.

**2. Install Node 24.**

```bash
nvm install --lts
nvm use --lts
nvm alias default lts/*
```

Node alternates release lines: even numbers (22, 24) become long-term support, odd ones (23, 25) never do. React Native targets LTS. An odd release usually works — until something in the native build chain fails with an error that points nowhere near the real cause.

The third line makes the LTS version the default for every new terminal. Without it the next terminal is back on the old version.

**3. Create the project.**

```bash
npx create-expo-app@latest perihel
```

Without a `--template` flag this uses the default template: Expo Router, TypeScript and a small example app. It also initialises a git repository and writes a `.gitignore`.

**4. Run it.**

```bash
npx expo start
```

This starts Metro, the bundler: it compiles the TypeScript into one JavaScript bundle and serves it over the local network. Scanning the QR code with Expo Go loads it onto the phone, and saving a file updates the phone within a second.

Phone and computer have to be on the same Wi-Fi. If they cannot reach each other, `npx expo start --tunnel` routes through Expo's servers instead — slower, but works anywhere.

## Rules for dependencies

- Install packages with `npx expo install <package>`, not `npm install`. The Expo version picks releases that match the installed SDK.
- Do not hand-edit the versions of `expo`, `react` or `react-native` in `package.json`. They are pinned to each other on purpose; `npx expo install --fix` corrects them.

## Note on Expo Go

Expo Go is Expo's ready-made host app and contains only the native modules Expo ships with — enough for a long while, SQLite included. Goal V1-1 asks for a development build, which becomes necessary as soon as the app needs a native module that Expo Go does not contain.
