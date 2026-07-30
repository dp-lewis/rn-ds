import { meridian } from './meridian';
import { pulse } from './pulse';
import { tribune } from './tribune';
import type { BrandPrimitives } from './types';

export * from './scales';
export * from './types';

/** Every brand the app can wear. Add one here and it is available everywhere. */
export const brands = {
  meridian,
  tribune,
  pulse,
} satisfies Record<string, BrandPrimitives>;

export type BrandId = keyof typeof brands;

export const BRAND_IDS = Object.keys(brands) as BrandId[];

export const DEFAULT_BRAND: BrandId = 'meridian';

/**
 * Metadata only — no colour. A brand picker needs the list of brands, but it
 * has no business reaching into their ramps, so this is what it gets.
 */
export const BRAND_OPTIONS: { id: BrandId; name: string; shortName: string }[] =
  BRAND_IDS.map((id) => ({
    id,
    name: brands[id].name,
    shortName: brands[id].shortName,
  }));
