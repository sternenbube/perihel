# NativeWind setup

Set up on 23.09.2026 with NativeWind 4.2.7 and Tailwind 3.4, following the official NativeWind v4
installation guide. Why it works this way: [Styling with NativeWind](../learnings/styling.md).

## Steps

**1. Install the packages.**

```bash
npm install nativewind@4.2.7 react-native-reanimated react-native-safe-area-context
npm install -D tailwindcss@^3.4.17
```

Tailwind **v3**, not v4: NativeWind v4 only works with Tailwind v3. Reanimated and safe-area-context
come with the Expo template already.

**2. Create `tailwind.config.js`.**

```js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: { extend: {} },
  plugins: [],
};
```

`content` lists every file Tailwind scans for classes — here everything under `src/`. The NativeWind
preset adapts Tailwind's output to React Native.

**3. Create `src/global.css`** with the three Tailwind directives:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**4. Configure Babel** in `babel.config.js`:

```js
presets: [
  ["babel-preset-expo", { jsxImportSource: "nativewind" }],
  "nativewind/babel",
],
```

`jsxImportSource` routes every JSX element through NativeWind, which turns `className` into `style`.

**5. Configure Metro** in `metro.config.js`:

```js
const { withNativeWind } = require("nativewind/metro");
module.exports = withNativeWind(config, { input: "./src/global.css" });
```

Metro runs Tailwind over the CSS file at build time. Other changes to `config` (like the `sql`
extension) go before this line.

**6. Import the CSS** once, at the top of `src/app/_layout.tsx`:

```ts
import "../global.css";
```

**7. Web bundler** in `app.json`: `"web": { "bundler": "metro" }`.

**8. TypeScript types.** Create `nativewind-env.d.ts` at the root with
`/// <reference types="nativewind/types" />` and add it to `include` in `tsconfig.json`. Without it
TypeScript does not know the `className` prop.

**9. Test it.** Start with `npx expo start --clear` and give the home screen a class like
`bg-yellow-300`. A yellow screen means the whole chain works.
