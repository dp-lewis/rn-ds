import { createContext, useContext, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { themes, type Theme } from './createTheme';
import type { ThemeMode } from './palettes';

const ThemeContext = createContext<Theme>(themes.light);

type Props = {
  children: ReactNode;
  /** Forces a mode instead of following the OS. Storybook uses this. */
  mode?: ThemeMode;
};

export function ThemeProvider({ children, mode }: Props) {
  const scheme = useColorScheme();
  const resolved: ThemeMode = mode ?? (scheme === 'dark' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={themes[resolved]}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
