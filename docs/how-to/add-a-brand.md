# How to add a brand

Goal: register a new masthead that re-skins the whole app.

## 1. Create the primitive file

`src/theme/primitives/gazette.ts`:

```ts
import type { BrandPrimitives } from './types';

export const gazette: BrandPrimitives = {
  id: 'gazette',
  name: 'THE GAZETTE',
  shortName: 'Gazette',
  fontFamily: {
    display: {},  // empty = platform native face
    mono: { ios: 'Menlo', android: 'monospace', default: 'Menlo' },
  },
  color: {
    neutral: {
      0: '#FFFFFF',  25: '#F4F2EF', 50: '#EFEDE9', 100: '#E4E1DC',
      150: '#D8D4CE', 300: '#A0998F', 400: '#847D73', 500: '#6E675E',
      550: '#5F594F', 800: '#33302B', 850: '#272420', 900: '#1D1B18',
      925: '#191714', 975: '#121110',
    },
    critical: { 400: '#FF7A68', 600: '#BE2A1F' },
    hue: {
      azure:   { 400: '#8FA6F0', 600: '#2A4BA8' },
      teal:    { 400: '#5CC4AC', 600: '#146B5C' },
      violet:  { 400: '#BFA0E8', 600: '#63428C' },
      green:   { 400: '#8CC98F', 600: '#3B6E34' },
      magenta: { 400: '#F096B8', 600: '#A82A5E' },
    },
  },
};
```

Copy the step list from an existing brand — the ramp keys are fixed by
`NeutralRamp`, and TypeScript will tell you if one is missing.

## 2. Register it

`src/theme/primitives/index.ts`:

```ts
import { gazette } from './gazette';

export const brands = {
  meridian,
  tribune,
  pulse,
  gazette,          // ← add
} satisfies Record<string, BrandPrimitives>;
```

`BrandId`, `BRAND_IDS`, `BRAND_OPTIONS` and the `themes` matrix all derive from
this object. Nothing else needs registering — the Storybook toolbar and the
in-app switcher both read `BRAND_OPTIONS`.

## 3. Verify contrast

```bash
npx tsc --noEmit
```

then follow [verify colour contrast](verify-contrast.md). Do not skip this. A
ramp that looks fine can miss AA by hundredths — Pulse's teal came in at
4.49:1 and had to be darkened.

## 4. Look at it

```bash
npm run storybook
```

Pick the brand from the **Brand** toolbar dropdown, then flip **Theme** to dark.
Check `Components/StoryTile/AllDesks` and
`Components/Eyebrow/AllCategoriesAsPills`.

## Checklist

- [ ] All 14 neutral steps present
- [ ] All five hues, both steps each
- [ ] `critical` both steps
- [ ] `name` and `shortName` set
- [ ] Registered in `brands`
- [ ] `npx tsc --noEmit` clean
- [ ] Contrast script passes
- [ ] Eyeballed in Storybook, light and dark

## If you want a serif masthead

```ts
display: { ios: 'Georgia', android: 'serif', default: 'Georgia' },
```

The display face is applied to `wordmark`, `leadHeadline`, `headline` and
`articleHeadline` — the `DISPLAY_ROLES` list in `semantic.ts`. Stick to fonts
present on both platforms unless you are ready to bundle one with
`expo-font`.
