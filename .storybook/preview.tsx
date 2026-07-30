import type { Preview } from '@storybook/react-native-web-vite';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import {
  BRAND_IDS,
  DEFAULT_BRAND,
  ThemeProvider,
  brands,
  useTheme,
  type BrandId,
  type ThemeMode,
} from '../src/theme';

/**
 * Components are designed to sit on the app's page ground inside a padded
 * list at phone width, so every story gets that context rather than a bare
 * white canvas stretched across a desktop viewport.
 */
function Frame({ children }: { children: ReactNode }) {
  const theme = useTheme();

  return (
    <View style={{ backgroundColor: theme.color.surface.page, padding: theme.spacing.lg }}>
      <View style={{ width: '100%', maxWidth: 420, alignSelf: 'center' }}>{children}</View>
    </View>
  );
}

const preview: Preview = {
  globalTypes: {
    brand: {
      description: 'Masthead',
      toolbar: {
        title: 'Brand',
        icon: 'globe',
        items: BRAND_IDS.map((id) => ({ value: id, title: brands[id].name })),
        dynamicTitle: true,
      },
    },
    theme: {
      description: 'Colour scheme',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    brand: DEFAULT_BRAND,
    theme: 'light',
  },
  decorators: [
    (Story, context) => (
      <ThemeProvider
        brand={context.globals.brand as BrandId}
        mode={context.globals.theme as ThemeMode}
      >
        <Frame>
          <Story />
        </Frame>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    a11y: {
      // Surface violations in the panel rather than failing the story.
      test: 'todo',
    },
  },
};

export default preview;
