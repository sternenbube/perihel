# Styling with NativeWind

Learned while setting up styling on 23.09.2026 and building the first screens. The decision is
Decision 3 in [06-decisions.md](../process/06-decisions.md); the setup steps are in the
[NativeWind setup guide](../guides/nativewind-setup.md).

## There is no CSS

React Native has no browser, no DOM and no CSS. Styles are JavaScript objects passed to a `style`
prop, usually created with `StyleSheet.create`:

```tsx
<View style={{ flex: 1, padding: 16, backgroundColor: "yellow" }} />
```

NativeWind lets me write Tailwind classes instead, and turns them into exactly these objects.

## How a className becomes a style

| When | What happens |
| ---- | ------------ |
| Build | Metro runs Tailwind over every file listed in `content`. Each class found becomes a React Native style object. |
| Runtime | NativeWind looks up the `className` of each element and passes the matching style on as a normal `style` prop. |

The link between the two is one Babel setting, `jsxImportSource: "nativewind"`: every JSX element
goes through NativeWind's JSX function, which converts `className` into `style`. No wrapper
component is needed — `View`, `Text` and `Pressable` accept `className` out of the box. Components
NativeWind does not know may ignore it.

A class in a file outside `content` is never generated and silently has no effect.

## React Native's rules still apply

The classes look like Tailwind on the web, but they style a different system underneath:

| Rule | On the web | In React Native |
| ---- | ---------- | --------------- |
| Layout | Block by default, flex on request | Every element is flexbox, direction **column** |
| Inheritance | Text colour and font flow down to children | No inheritance — style the `Text` itself. Only nested `Text` inherits. |
| Units | `px`, `rem`, `%`, `vh` | Plain numbers in device-independent points |
| Missing | — | No CSS grid, no hover |
| Text | Any element can hold text | Text must be inside `<Text>`, or the app crashes |

**When a class seems to have no effect,** check these first: is the parent a column when a row was
meant, is the text style on the `View` instead of the `Text`, is the file inside `content`.

## Why NativeWind

| Option | Verdict |
| ------ | ------- |
| `StyleSheet` with a theme file | No setup, nothing between code and screen — but every spacing and colour decision made by hand |
| **NativeWind v4 (Tailwind v3)** | Tailwind's fixed scale makes most decisions already; known from Next.js |
| NativeWind v5 (Tailwind v4) | Pre-release — not for a project with fixed dates |
| Uniwind | Support for Expo SDK 57 unconfirmed, partly paid |

The project is not about learning to style; it is about a clean, consistent app built
efficiently. Tutorials for Tailwind v4 or NativeWind v5 use a different setup and partly different
syntax — check the version before copying.
