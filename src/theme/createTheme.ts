import { Platform } from 'react-native';

import { createAlias, type ThemeMode } from './alias';
import { brands, type BrandId, type FontFamily } from './primitives';
import {
  createSemanticColors,
  DISPLAY_ROLES,
  semanticOpacity,
  semanticRadius,
  semanticScrims,
  semanticSizes,
  semanticSpacing,
  semanticTypography,
  type SemanticColors,
} from './semantic';

export type { ThemeMode } from './alias';
export type { BrandId } from './primitives';

export type Theme = {
  brand: BrandId;
  /** Masthead text, so the UI can render whichever title it is wearing. */
  brandName: string;
  mode: ThemeMode;
  color: SemanticColors;
  spacing: typeof semanticSpacing;
  radius: typeof semanticRadius;
  sizes: typeof semanticSizes;
  opacity: typeof semanticOpacity;
  scrims: typeof semanticScrims;
  fonts: { display?: string; mono?: string };
  typography: typeof semanticTypography;
};

/** Undefined for an empty stack, which is how you get the native face. */
function resolveFamily(family: FontFamily): string | undefined {
  return Platform.select({
    ios: family.ios,
    android: family.android,
    default: family.default,
  });
}

function createTheme(brandId: BrandId, mode: ThemeMode): Theme {
  const brand = brands[brandId];
  const alias = createAlias(brand, mode);

  const display = resolveFamily(brand.fontFamily.display);
  const mono = resolveFamily(brand.fontFamily.mono);

  // Headline roles wear the brand's display face; the wire line always wears
  // the mono. Everything else rides the platform default.
  const typography = Object.fromEntries(
    Object.entries(semanticTypography).map(([role, value]) => {
      if ((DISPLAY_ROLES as readonly string[]).includes(role)) {
        return [role, display ? { ...value, fontFamily: display } : value];
      }
      if (role === 'wire') {
        return [role, mono ? { ...value, fontFamily: mono } : value];
      }
      return [role, value];
    }),
  ) as typeof semanticTypography;

  return {
    brand: brandId,
    brandName: brand.name,
    mode,
    color: createSemanticColors(alias),
    spacing: semanticSpacing,
    radius: semanticRadius,
    sizes: semanticSizes,
    opacity: semanticOpacity,
    scrims: semanticScrims,
    fonts: { display, mono },
    typography,
  };
}

/**
 * Every brand/mode combination, built once at module load. Themes are static,
 * so switching brand is a lookup rather than a rebuild.
 */
export const themes = Object.fromEntries(
  (Object.keys(brands) as BrandId[]).map((id) => [
    id,
    { light: createTheme(id, 'light'), dark: createTheme(id, 'dark') },
  ]),
) as Record<BrandId, Record<ThemeMode, Theme>>;
