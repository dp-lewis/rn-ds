import type { BrandPrimitives, HueName } from './primitives';

/**
 * LAYER 2 — ALIAS
 *
 * Generic roles, resolved from a brand's primitives for one mode. Still says
 * nothing about news: "the raised background", not "the story tile". This is
 * the only layer that knows light from dark, and the only one that reads a
 * specific step out of a ramp.
 */

export type ThemeMode = 'light' | 'dark';

export type Alias = {
  bg: { base: string; raised: string; sunken: string };
  fg: {
    default: string;
    muted: string;
    /** Decorative only — held to 3:1, never to 4.5:1. */
    subtle: string;
    /** For use on top of imagery and filled accents. */
    inverse: string;
  };
  line: { default: string };
  critical: { default: string; onImage: string };
  hue: Record<HueName, string>;
  /**
   * Always the deep step, whatever the mode: anything sitting on photography
   * is behind a dark scrim, so it must not follow the app surface.
   */
  hueOnImage: Record<HueName, string>;
};

const HUE_NAMES: HueName[] = ['azure', 'teal', 'violet', 'green', 'magenta'];

function mapHues(
  brand: BrandPrimitives,
  step: 400 | 600,
): Record<HueName, string> {
  return Object.fromEntries(
    HUE_NAMES.map((name) => [name, brand.color.hue[name][step]]),
  ) as Record<HueName, string>;
}

export function createAlias(brand: BrandPrimitives, mode: ThemeMode): Alias {
  const n = brand.color.neutral;
  const isDark = mode === 'dark';

  return {
    bg: {
      base: isDark ? n[975] : n[25],
      raised: isDark ? n[900] : n[0],
      sunken: isDark ? n[850] : n[100],
    },
    fg: {
      default: isDark ? n[50] : n[925],
      muted: isDark ? n[300] : n[550],
      subtle: isDark ? n[500] : n[400],
      inverse: n[0],
    },
    line: {
      default: isDark ? n[800] : n[150],
    },
    critical: {
      default: isDark ? brand.color.critical[400] : brand.color.critical[600],
      onImage: brand.color.critical[600],
    },
    hue: mapHues(brand, isDark ? 400 : 600),
    hueOnImage: mapHues(brand, 600),
  };
}
