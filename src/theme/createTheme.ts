import { palettes, type Palette, type ThemeMode } from './palettes';
import {
  fonts,
  opacity,
  radius,
  scrims,
  sizes,
  spacing,
  typography,
} from './tokens';

export type Theme = {
  mode: ThemeMode;
  color: Palette;
  spacing: typeof spacing;
  radius: typeof radius;
  sizes: typeof sizes;
  opacity: typeof opacity;
  fonts: typeof fonts;
  typography: typeof typography;
  scrims: typeof scrims;
};

function createTheme(mode: ThemeMode): Theme {
  return {
    mode,
    color: palettes[mode],
    spacing,
    radius,
    sizes,
    opacity,
    fonts,
    typography,
    scrims,
  };
}

/** Built once at module load — themes are static, so nothing needs to rebuild. */
export const themes: Record<ThemeMode, Theme> = {
  light: createTheme('light'),
  dark: createTheme('dark'),
};
