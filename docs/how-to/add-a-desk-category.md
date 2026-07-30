# How to add a desk category

Goal: add a new desk (e.g. `Sport`) that stories can be filed to.

The type system is arranged so this fails loudly at each step until finished.

## 1. Add it to the domain

`src/types.ts`:

```ts
export const CATEGORIES = [
  'World', 'Business', 'Science', 'Climate', 'Culture', 'Sport',
] as const;
```

`Category` derives from this array, so both the type and the runtime list
update together.

## 2. Build — and read the error

```bash
npx tsc --noEmit
```

```
src/theme/semantic.ts: Property 'Sport' is missing in type
'{ World: HueName; ... }' but required in type 'Record<Category, HueName>'
```

That is the safety net. `CATEGORY_HUE` in `semantic.ts` must map every desk to
a hue.

## 3. Map it to a hue

`src/theme/semantic.ts`:

```ts
const CATEGORY_HUE: Record<Category, HueName> = {
  World: 'azure',
  Business: 'teal',
  Science: 'violet',
  Climate: 'green',
  Culture: 'magenta',
  Sport: 'azure',      // ← reuse, or add a sixth hue
};
```

### If you want a distinct colour

Adding a sixth hue means touching every brand:

1. Add the name to `HueName` in `primitives/types.ts`
2. Add a `{ 400, 600 }` ramp to `color.hue` in **every** brand file
3. Point `CATEGORY_HUE.Sport` at it

`Record<HueName, HueRamp>` makes step 2 a compile error until all brands have
it, which is the point.

## 4. Validate the data

Stories carry `category` as a string in `stories.json`. `parseStory` checks it
against `CATEGORIES` at load, so a typo now throws:

```
stories.json[2]: category "Sprot" is not a known desk
(expected one of: World, Business, Science, Climate, Culture, Sport)
```

No extra work — the validator reads the same list.

## 5. Verify contrast

If you added a hue, run the contrast check from
[verify colour contrast](verify-contrast.md). A new hue is 6 new assertions per
brand per mode.

## Checklist

- [ ] Added to `CATEGORIES`
- [ ] Mapped in `CATEGORY_HUE`
- [ ] If new hue: added to `HueName` and to every brand
- [ ] `npx tsc --noEmit` clean
- [ ] Contrast script passes
- [ ] `Components/Eyebrow/AllCategories` shows it in both modes
