import type { StorybookConfig } from '@storybook/react-native-web-vite';

/**
 * expo-modules-core's package entry is TypeScript source (`"default":
 * "./src/index.ts"`), because it expects Metro to compile it. Its index does a
 * side-effect import of `./ts-declarations/global`, which in turn imports
 * EventEmitter, NativeModule, SharedObject and SharedRef *without* the `type`
 * modifier. Those are `declare`-only files with no runtime exports, so Vite
 * preserves the imports and the browser throws at module evaluation.
 *
 * Every file in that directory is declaration-only — verified: no const, let,
 * var, function or class statements outside `declare`. Replacing them with an
 * empty module is therefore a no-op at runtime, and it lets expo-image work in
 * Storybook.
 */
const stubExpoTypeDeclarations = {
  name: 'stub-expo-modules-core-ts-declarations',
  enforce: 'pre' as const,
  load(id: string) {
    const path = id.split('?')[0];
    return path.includes('expo-modules-core/src/ts-declarations/') ? 'export {};' : null;
  },
};

const config: StorybookConfig = {
  // Add '../src/**/*.mdx' here if you start writing MDX docs pages.
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
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
  async viteFinal(config) {
    config.plugins = [...(config.plugins ?? []), stubExpoTypeDeclarations];

    // GitHub Pages serves this under /<repo>/storybook/. Unset locally, so
    // `npm run storybook` still serves from the root.
    if (process.env.STORYBOOK_BASE_URL) {
      config.base = process.env.STORYBOOK_BASE_URL;
    }

    // The dependency pre-bundler hits the same files before plugins apply, so
    // keep these two out of it and let the normal pipeline handle them.
    // The pre-bundler reads these files before the plugin above can apply, so
    // it needs the same stub. Excluding the packages instead is not viable:
    // they would then be served unbundled and every CommonJS dependency down
    // the chain would fail to default-import.
    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: [...(config.optimizeDeps?.include ?? []), 'expo-image'],
      rollupOptions: {
        ...config.optimizeDeps?.rollupOptions,
        plugins: [
          ...((config.optimizeDeps?.rollupOptions?.plugins as unknown[]) ?? []),
          stubExpoTypeDeclarations,
        ],
      },
    } as typeof config.optimizeDeps;

    return config;
  },
};

export default config;
