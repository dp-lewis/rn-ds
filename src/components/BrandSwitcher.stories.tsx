import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Text, View } from 'react-native';

import BrandSwitcher from './BrandSwitcher';
import { BrandProvider, useTheme, type ThemeMode } from '../theme';

/**
 * The switcher needs a BrandProvider to have anything to change — the global
 * decorator uses the controlled ThemeProvider, driven by the toolbar. These
 * stories supply their own provider so the control is actually live: tap a
 * segment and the surrounding preview re-skins.
 */
function LiveDemo() {
  const theme = useTheme();

  return (
    <View style={{ gap: theme.spacing.md }}>
      <BrandSwitcher />
      <View
        style={{
          padding: theme.spacing.lg,
          borderRadius: theme.radius.lg,
          backgroundColor: theme.color.surface.card,
          borderWidth: 1,
          borderColor: theme.color.border.hairline,
          gap: theme.spacing.sm,
        }}
      >
        <Text style={{ ...theme.typography.wordmark, color: theme.color.text.primary }}>
          {theme.brandName}
        </Text>
        <Text style={{ ...theme.typography.wire, color: theme.color.text.muted }}>
          BRAND {theme.brand.toUpperCase()} · MODE {theme.mode.toUpperCase()}
        </Text>
      </View>
    </View>
  );
}

const meta = {
  title: 'Components/BrandSwitcher',
  component: BrandSwitcher,
} satisfies Meta<typeof BrandSwitcher>;

export default meta;

type SBStory = StoryObj<typeof meta>;

/** Tap a segment — the masthead and tokens below it change with it. */
export const Interactive: SBStory = {
  render: (_args, context) => (
    <BrandProvider mode={context.globals.theme as ThemeMode}>
      <LiveDemo />
    </BrandProvider>
  ),
};
