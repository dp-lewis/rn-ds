import type { Alias } from './alias';
import {
  dimension,
  fontSize,
  fontWeight,
  lineHeight,
  opacities,
  radii,
  scrims,
  space,
  tracking,
  type HueName,
} from './primitives';
import { CATEGORIES, type Category } from '../types';

/**
 * LAYER 3 — SEMANTIC
 *
 * Named for what it means in this product. Components consume this layer and
 * nothing below it: no component should ever import a primitive or an alias.
 * That is what lets a brand swap underneath without touching a component.
 */

/** Which hue each desk wears. The one genuinely editorial decision in here. */
const CATEGORY_HUE: Record<Category, HueName> = {
  World: 'azure',
  Business: 'teal',
  Science: 'violet',
  Climate: 'green',
  Culture: 'magenta',
};

function mapCategories(hues: Record<HueName, string>): Record<Category, string> {
  return Object.fromEntries(
    CATEGORIES.map((category) => [category, hues[CATEGORY_HUE[category]]]),
  ) as Record<Category, string>;
}

export type SemanticColors = {
  surface: { page: string; card: string; image: string };
  text: { primary: string; muted: string; faint: string; inverse: string };
  border: { hairline: string };
  /** Breaking news only. Using it elsewhere spends its meaning. */
  signal: string;
  category: Record<Category, string>;
  /** Fixed treatments for anything sitting on a photograph. */
  onImage: {
    signal: string;
    category: Record<Category, string>;
    text: string;
  };
};

export function createSemanticColors(alias: Alias): SemanticColors {
  return {
    surface: {
      page: alias.bg.base,
      card: alias.bg.raised,
      image: alias.bg.sunken,
    },
    text: {
      primary: alias.fg.default,
      muted: alias.fg.muted,
      faint: alias.fg.subtle,
      inverse: alias.fg.inverse,
    },
    border: {
      hairline: alias.line.default,
    },
    signal: alias.critical.default,
    category: mapCategories(alias.hue),
    onImage: {
      signal: alias.critical.onImage,
      category: mapCategories(alias.hueOnImage),
      text: alias.fg.inverse,
    },
  };
}

/** Spacing named for the job, not the number. */
export const semanticSpacing = {
  xxs: space[2],
  xs: space[3],
  sm: space[4],
  md: space[5],
  lg: space[6],
  xl: space[7],
  xxl: space[8],
  xxxl: space[9],
} as const;

export const semanticRadius = {
  sm: radii.sm,
  md: radii.md,
  lg: radii.lg,
  pill: radii.full,
} as const;

export const semanticSizes = {
  eyebrowDot: dimension.dot,
  thumb: dimension.thumb,
  backButton: dimension.control,
} as const;

export const semanticOpacity = {
  pressed: opacities.pressed,
} as const;

export const semanticScrims = scrims;

/**
 * Type ramp. Font families are attached in createTheme, which is where the
 * platform lookup happens — this file stays free of React Native so the token
 * pipeline can be verified in plain Node.
 */
export const semanticTypography = {
  wordmark: {
    fontSize: fontSize[600],
    fontWeight: fontWeight.black,
    letterSpacing: tracking.widest,
  },
  leadHeadline: {
    fontSize: fontSize[700],
    fontWeight: fontWeight.black,
    letterSpacing: tracking.tight,
    lineHeight: lineHeight[500],
  },
  headline: {
    fontSize: fontSize[500],
    fontWeight: fontWeight.bold,
    letterSpacing: tracking.snug,
    lineHeight: lineHeight[200],
  },
  articleHeadline: {
    fontSize: fontSize[800],
    fontWeight: fontWeight.black,
    letterSpacing: tracking.tighter,
    lineHeight: lineHeight[600],
  },
  summary: { fontSize: fontSize[300], lineHeight: lineHeight[100] },
  standfirst: { fontSize: fontSize[500], lineHeight: lineHeight[300] },
  byline: {
    fontSize: fontSize[200],
    fontWeight: fontWeight.bold,
    letterSpacing: 0.3,
  },
  paragraph: { fontSize: fontSize[400], lineHeight: lineHeight[400] },
  eyebrow: {
    fontSize: fontSize[100],
    fontWeight: fontWeight.bold,
    letterSpacing: tracking.wider,
  },
  wire: { fontSize: fontSize[100], letterSpacing: tracking.wide },
} as const;

/** Roles that carry the brand's display face rather than the platform sans. */
export const DISPLAY_ROLES = [
  'wordmark',
  'leadHeadline',
  'headline',
  'articleHeadline',
] as const;
