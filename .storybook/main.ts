import type { StorybookConfig } from '@storybook/react-native-web-vite';

const config: StorybookConfig = {
  // Add '../src/**/*.mdx' here if you start writing MDX docs pages.
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-native-web-vite',
    options: {
      // Lets Vite resolve Expo's platform-specific files (.web.ts, .web.tsx)
      // the way Metro does, so packages like expo-linear-gradient work here.
      pluginReactNativeWeb: {
        extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js'],
      },
    },
  },
};

export default config;
