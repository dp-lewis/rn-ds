import { createContext, useContext, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import type { ThemeMode } from './alias';
import { DEFAULT_BRAND, type BrandId } from './primitives';
import { themes, type Theme } from './createTheme';

const ThemeContext = createContext<Theme>(themes[DEFAULT_BRAND].light);

type Props = {
  children: ReactNode;
  /** Which title the app is wearing. Defaults to Meridian. */
  brand?: BrandId;
  /** Forces a mode instead of following the OS. Storybook uses this. */
  mode?: ThemeMode;
};

export function ThemeProvider({ children, brand = DEFAULT_BRAND, mode }: Props) {
  const scheme = useColorScheme();
  const resolvedMode: ThemeMode = mode ?? (scheme === 'dark' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={themes[brand][resolvedMode]}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
