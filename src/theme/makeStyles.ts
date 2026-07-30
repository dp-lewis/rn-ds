import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import type { Theme } from './createTheme';
import { useTheme } from './ThemeProvider';

/**
 * Builds a style hook from a theme-aware factory.
 *
 * Module-level StyleSheet.create cannot see the theme, which is what blocked
 * dark mode. This keeps the same call shape at the usage site:
 *
 *   const useStyles = makeStyles((t) => ({ card: { backgroundColor: t.color.surface.card } }));
 *   const styles = useStyles();
 *
 * Themes are static objects, so the memo only recomputes when the mode flips.
 */
export function makeStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (theme: Theme) => T,
): () => T {
  return function useStyles(): T {
    const theme = useTheme();
    return useMemo(() => StyleSheet.create(factory(theme)), [theme]);
  };
}
