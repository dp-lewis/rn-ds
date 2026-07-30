# Reference: token layers

Three layers, bottom to top. Each layer may read the one below it and nothing
above.

```
primitives/   raw values, per-brand ramps          no meaning
    ↓
alias.ts      generic roles, resolves brand+mode   "the raised background"
    ↓
semantic.ts   product meaning                      "the story tile surface"
    ↓
components    consume semantic only
```

---

## Layer 1 — primitives

`src/theme/primitives/`

### scales.ts

Mode- and brand-independent. Named for what they are.

| Token | Values |
|---|---|
| `space` | `0:0, 1:2, 2:4, 3:6, 4:8, 5:12, 6:16, 7:20, 8:24, 9:32, 10:40` |
| `radii` | `none:0, sm:6, md:10, lg:14, full:999` |
| `dimension` | `dot:6, thumb:92, control:40` |
| `opacities` | `full:1, pressed:0.7, disabled:0.4` |
| `fontSize` | `100:11, 200:12, 300:14, 400:16, 500:17, 600:20, 700:27, 800:30` |
| `fontWeight` | `regular:'400', bold:'700', black:'800'` |
| `lineHeight` | `100:20, 200:22, 300:25, 400:26, 500:32, 600:36` |
| `tracking` | `tighter:-0.7, tight:-0.6, snug:-0.3, normal:0, wide:0.4, wider:1.1, widest:1.5` |
| `scrims` | `lead`, `hero` — gradient stop arrays |

`scrims` are fixed rgba strings. They sit over photography, not over a themed
surface, so they do not vary.

### Brand ramps

One file per brand: `meridian.ts`, `tribune.ts`, `pulse.ts`. Each satisfies
`BrandPrimitives` — see [brand contract](brand-contract.md).

**`color.neutral`** spans light and dark in a single ramp, ordered lightest to
darkest:

```
0, 25, 50, 100, 150, 300, 400, 500, 550, 800, 850, 900, 925, 975
```

**`color.hue`** — five hues (`azure`, `teal`, `violet`, `green`, `magenta`),
each with two steps:

- `600` — dark enough to read on a light surface, and behind white text
- `400` — light enough to read on a dark surface

**`color.critical`** — same two-step shape, reserved for breaking news.

### Registry

`primitives/index.ts` exports:

| Export | Type |
|---|---|
| `brands` | `Record<BrandId, BrandPrimitives>` |
| `BrandId` | `'meridian' \| 'tribune' \| 'pulse'` |
| `BRAND_IDS` | `BrandId[]` |
| `DEFAULT_BRAND` | `'meridian'` |
| `BRAND_OPTIONS` | `{ id, name, shortName }[]` — metadata only, no colour |

---

## Layer 2 — alias

`src/theme/alias.ts`. `createAlias(brand, mode) → Alias`.

The only layer that knows light from dark, and the only one that reads a step
out of a ramp.

| Alias role | Light | Dark |
|---|---|---|
| `bg.base` | `neutral[25]` | `neutral[975]` |
| `bg.raised` | `neutral[0]` | `neutral[900]` |
| `bg.sunken` | `neutral[100]` | `neutral[850]` |
| `fg.default` | `neutral[925]` | `neutral[50]` |
| `fg.muted` | `neutral[550]` | `neutral[300]` |
| `fg.subtle` | `neutral[400]` | `neutral[500]` |
| `fg.inverse` | `neutral[0]` | `neutral[0]` |
| `line.default` | `neutral[150]` | `neutral[800]` |
| `critical.default` | `critical[600]` | `critical[400]` |
| `critical.onImage` | `critical[600]` | `critical[600]` |
| `hue.*` | `hue[600]` | `hue[400]` |
| `hueOnImage.*` | `hue[600]` | `hue[600]` |

`fg.inverse`, `critical.onImage` and `hueOnImage` do **not** vary by mode.
Anything sitting on a photograph is behind a dark scrim regardless of the app
surface.

---

## Layer 3 — semantic

`src/theme/semantic.ts`. This is what components consume.

### Colour — `createSemanticColors(alias) → SemanticColors`

| Semantic token | Source |
|---|---|
| `surface.page` | `alias.bg.base` |
| `surface.card` | `alias.bg.raised` |
| `surface.image` | `alias.bg.sunken` |
| `text.primary` | `alias.fg.default` |
| `text.muted` | `alias.fg.muted` |
| `text.faint` | `alias.fg.subtle` |
| `text.inverse` | `alias.fg.inverse` |
| `border.hairline` | `alias.line.default` |
| `signal` | `alias.critical.default` |
| `category[Category]` | `alias.hue[hue]` |
| `onImage.signal` | `alias.critical.onImage` |
| `onImage.category[Category]` | `alias.hueOnImage[hue]` |
| `onImage.text` | `alias.fg.inverse` |

**`text.faint` is decorative only.** It is held to 3:1, not 4.5:1. Do not use
it for content.

### Category → hue

Defined by `CATEGORY_HUE` in `semantic.ts`:

| Desk | Hue |
|---|---|
| World | azure |
| Business | teal |
| Science | violet |
| Climate | green |
| Culture | magenta |

### Non-colour semantic tokens

| Export | Shape |
|---|---|
| `semanticSpacing` | `xxs, xs, sm, md, lg, xl, xxl, xxxl` → `space[2..9]` |
| `semanticRadius` | `sm, md, lg, pill` |
| `semanticSizes` | `eyebrowDot, thumb, backButton` |
| `semanticOpacity` | `pressed` |
| `semanticScrims` | `lead`, `hero` |
| `semanticTypography` | roles below |
| `DISPLAY_ROLES` | `wordmark, leadHeadline, headline, articleHeadline` |

Typography roles: `wordmark`, `leadHeadline`, `headline`, `articleHeadline`,
`summary`, `standfirst`, `byline`, `paragraph`, `eyebrow`, `wire`.

`semanticTypography` carries **no `fontFamily`**. Families are attached in
`createTheme`, which is where the platform lookup happens — see
[verification strategy](../explanation/verification-strategy.md) for why that
boundary exists.

---

## Composition

`src/theme/createTheme.ts` builds the final `Theme` and pre-computes every
brand × mode combination into `themes`:

```ts
themes[brandId][mode] // → Theme
```

`createTheme` also:

- resolves font stacks through `Platform.select`
- attaches the brand display face to `DISPLAY_ROLES`
- attaches the brand mono face to `wire`
