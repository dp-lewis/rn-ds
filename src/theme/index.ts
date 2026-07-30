/**
 * Three layers, bottom to top:
 *
 *   primitives/  raw values and per-brand ramps. No meaning.
 *   alias.ts     generic roles. Resolves brand + light/dark.
 *   semantic.ts  product meaning. The only layer components may touch.
 *
 * Import `useTheme` and `makeStyles` from here. Reaching past them into
 * primitives or alias from a component defeats the point — a brand swap would
 * stop propagating.
 */

export { BRAND_IDS, DEFAULT_BRAND, brands, type BrandId } from './primitives';
export type { ThemeMode } from './alias';
export { themes, type Theme } from './createTheme';
export { ThemeProvider, useTheme } from './ThemeProvider';
export { makeStyles } from './makeStyles';
