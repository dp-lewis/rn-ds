# Reference: theme API

Everything below is exported from `src/theme`. Components import from there and
nowhere deeper.

## Providers

### `ThemeProvider`

Controlled. Takes the brand as a prop and never changes it itself.

```tsx
<ThemeProvider brand="tribune" mode="dark">{children}</ThemeProvider>
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `brand` | `BrandId` | `DEFAULT_BRAND` | |
| `mode` | `ThemeMode` | — | Omit to follow the OS via `useColorScheme()` |

Used directly by Storybook, whose toolbar owns the selection.

### `BrandProvider`

Stateful. Owns the selected brand and renders `ThemeProvider` with it.

```tsx
<BrandProvider initialBrand="meridian">{children}</BrandProvider>
```

| Prop | Type | Default |
|---|---|---|
| `initialBrand` | `BrandId` | `DEFAULT_BRAND` |
| `mode` | `ThemeMode` | — (forwarded to `ThemeProvider`) |

Used by the app, so `BrandSwitcher` has something to change. Selection is in
memory and resets on reload.

## Hooks

### `useTheme(): Theme`

```ts
type Theme = {
  brand: BrandId;
  brandName: string;
  mode: ThemeMode;
  color: SemanticColors;
  spacing; radius; sizes; opacity; scrims; typography;
  fonts: { display?: string; mono?: string };
};
```

### `useBrand(): { brand, setBrand }`

Reads and changes the active brand. Returns a no-op setter outside a
`BrandProvider`, so a component using it still renders under a bare
`ThemeProvider` — it just cannot change anything.

## `makeStyles`

```ts
const useStyles = makeStyles((t) => ({
  card: { backgroundColor: t.color.surface.card, padding: t.spacing.lg },
}));

function Card() {
  const styles = useStyles();
  return <View style={styles.card} />;
}
```

Returns a hook. Internally: `useTheme()` then a `useMemo` around
`StyleSheet.create`, keyed on the theme object. Themes are pre-built static
objects, so the memo only recomputes when brand or mode actually changes.

Use this instead of a module-level `StyleSheet.create`, which cannot see the
theme.

## Values

| Export | Type | Notes |
|---|---|---|
| `themes` | `Record<BrandId, Record<ThemeMode, Theme>>` | Pre-built matrix |
| `brands` | `Record<BrandId, BrandPrimitives>` | Raw ramps — avoid in components |
| `BRAND_OPTIONS` | `{ id, name, shortName }[]` | Metadata only; safe for a picker |
| `BRAND_IDS` | `BrandId[]` | |
| `DEFAULT_BRAND` | `BrandId` | `'meridian'` |

## Types

`Theme`, `BrandId`, `ThemeMode`.

## Import rule

```
✅ import { useTheme, makeStyles } from '../theme';
❌ import { space } from '../theme/primitives';
❌ import { createAlias } from '../theme/alias';
```

Reaching past the barrel into `primitives` or `alias` from a component breaks
brand propagation. Check with:

```bash
grep -rn "theme/primitives\|theme/alias\|theme/semantic" src/components src/screens App.tsx
```

`themes` and `brands` are exported from the barrel because Storybook and the
brand switcher legitimately need them, but a normal component should not.
