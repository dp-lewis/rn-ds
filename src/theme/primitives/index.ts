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
