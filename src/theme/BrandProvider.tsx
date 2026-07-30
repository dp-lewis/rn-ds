import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import type { ThemeMode } from './alias';
import { DEFAULT_BRAND, type BrandId } from './primitives';
import { ThemeProvider } from './ThemeProvider';

type BrandControls = {
  brand: BrandId;
  setBrand: (brand: BrandId) => void;
};

const BrandContext = createContext<BrandControls>({
  brand: DEFAULT_BRAND,
  setBrand: () => {},
});

type Props = {
  children: ReactNode;
  initialBrand?: BrandId;
  /** Forwarded to ThemeProvider. Omit to follow the OS appearance setting. */
  mode?: ThemeMode;
};

/**
 * Owns the selected brand and feeds it to ThemeProvider.
 *
 * ThemeProvider stays controlled on purpose — Storybook drives it directly by
 * prop from the toolbar. This wrapper is what the app uses instead, so the
 * brand can change at runtime.
 *
 * Selection is in memory only; it resets on reload. Persisting it would mean
 * adding async storage.
 */
export function BrandProvider({ children, initialBrand = DEFAULT_BRAND, mode }: Props) {
  const [brand, setBrand] = useState<BrandId>(initialBrand);
  const value = useMemo(() => ({ brand, setBrand }), [brand]);

  return (
    <BrandContext.Provider value={value}>
      <ThemeProvider brand={brand} mode={mode}>
        {children}
      </ThemeProvider>
    </BrandContext.Provider>
  );
}

/** Read and change the active brand. Returns a no-op setter outside a provider. */
export function useBrand(): BrandControls {
  return useContext(BrandContext);
}
