# Reference: brand contract

Every brand satisfies `BrandPrimitives`, declared in
`src/theme/primitives/types.ts`. The type is what stops a brand shipping with a
hole in it — TypeScript fails the build if a ramp step or a hue is missing.

```ts
type BrandPrimitives = {
  id: string;
  name: string;        // masthead, e.g. 'THE TRIBUNE'
  shortName: string;   // compact label, e.g. 'Tribune'
  fontFamily: {
    display: FontFamily;   // wordmark and headlines
    mono: FontFamily;      // wire metadata
  };
  color: {
    neutral: NeutralRamp;
    critical: HueRamp;
    hue: Record<HueName, HueRamp>;
  };
};
```

## FontFamily

```ts
type FontFamily = { ios?: string; android?: string; default?: string };
```

Plain data, not `Platform.select` — this file must stay free of React Native
imports. Resolution happens in `createTheme`.

**An empty object is meaningful.** `display: {}` yields `undefined`, and *not*
setting `fontFamily` is what gets you the native face (SF on iOS, Roboto on
Android). It is not a missing value.

## NeutralRamp

Fourteen steps, ordered lightest to darkest. One ramp serves both modes; the
alias layer picks different steps for each.

```
0  25  50  100  150  300  400  500  550  800  850  900  925  975
```

| Step band | Used for |
|---|---|
| `0`–`150` | light-mode surfaces and lines; dark-mode foreground |
| `300`–`550` | muted and subtle foregrounds in both modes |
| `800`–`975` | dark-mode surfaces and lines; light-mode foreground |

## HueRamp

```ts
type HueRamp = { 400: string; 600: string };
```

| Step | Contract |
|---|---|
| `600` | ≥ 4.5:1 against the brand's light `page` **and** `card`, and behind white text |
| `400` | ≥ 4.5:1 against the brand's dark `page` **and** `card` |

`600` carries a double duty: inline text in light mode, and pill fill in both
modes. Because contrast is symmetric, one check covers both — the ratio of
`600` on white equals the ratio of white on `600`.

## HueName

```ts
type HueName = 'azure' | 'teal' | 'violet' | 'green' | 'magenta';
```

Five hues, one per desk. The desk-to-hue mapping is a semantic decision and
lives in `semantic.ts`, not here — a brand supplies colours, not editorial
meaning.

## Registered brands

| id | name | shortName | Character |
|---|---|---|---|
| `meridian` | MERIDIAN | Meridian | Cool oyster greys, cobalt, platform sans |
| `tribune` | THE TRIBUNE | Tribune | Warm paper, brown-black ink, Georgia masthead |
| `pulse` | PULSE | Pulse | High-contrast neutrals, electric hues, true-black dark |

## Contrast obligations

Every brand must pass the checks in
[verify colour contrast](../how-to/verify-contrast.md), which run across all
brands and both modes:

| Pair | Minimum |
|---|---|
| `text.primary` on `page` / `card` | 4.5:1 |
| `text.muted` on `page` / `card` | 4.5:1 |
| `text.faint` on `page` / `card` | 3:1 |
| `signal` on `page` / `card` | 4.5:1 |
| each `category` on `page` / `card` | 4.5:1 |
| `onImage.text` on each `onImage.category` and `onImage.signal` | 4.5:1 |
| `page` vs `card` | distinguishable |

The eyebrow is 11px bold. That is **not** WCAG "large text", so it needs the
full 4.5:1 — 3:1 does not apply.
