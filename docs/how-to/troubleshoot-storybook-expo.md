# How to troubleshoot Storybook with Expo packages

Storybook here runs through `@storybook/react-native-web-vite` — your RN
components in a browser, in the normal Storybook UI. Expo packages sometimes
need help getting through Vite. These are the failures seen so far and what
actually fixed them.

## "does not provide an export named 'EventEmitter'"

```
[MISSING_EXPORT] "EventEmitter" is not exported by
"node_modules/expo-modules-core/src/ts-declarations/EventEmitter.ts"
```

**Cause.** `expo-modules-core` ships TypeScript *source* as its runtime entry
(`"default": "./src/index.ts"`) because it expects Metro to compile it. Its
`index.ts` side-effect-imports `./ts-declarations/global`, which imports four
symbols *without* the `type` modifier. They are `declare`-only, so there is
nothing to import at runtime and the module evaluation throws.

**Fix.** Stub that directory. Every file in it is declaration-only, so an empty
module is a no-op. In `.storybook/main.ts`:

```ts
const stubExpoTypeDeclarations = {
  name: 'stub-expo-modules-core-ts-declarations',
  enforce: 'pre',
  load(id) {
    const path = id.split('?')[0];
    return path.includes('expo-modules-core/src/ts-declarations/')
      ? 'export {};'
      : null;
  },
};
```

Register it in **both** places — the plugin list and the dependency
pre-bundler, which reads files before plugins apply:

```ts
async viteFinal(config) {
  config.plugins = [...(config.plugins ?? []), stubExpoTypeDeclarations];
  config.optimizeDeps = {
    ...config.optimizeDeps,
    include: [...(config.optimizeDeps?.include ?? []), 'expo-image'],
    rollupOptions: {
      ...config.optimizeDeps?.rollupOptions,
      plugins: [
        ...(config.optimizeDeps?.rollupOptions?.plugins ?? []),
        stubExpoTypeDeclarations,
      ],
    },
  };
  return config;
}
```

Confirm the directory really is declaration-only before stubbing another one:

```bash
grep -hnE "^(export )?(const|let|var|function|class) " \
  node_modules/expo-modules-core/src/ts-declarations/*.ts | grep -v declare
```

No output means no runtime code.

## Do not "fix" it with optimizeDeps.exclude

The obvious move is to exclude the offending packages from pre-bundling. It
does not work:

1. The build error becomes a **runtime** `SyntaxError` instead — same cause,
   later.
2. Excluded packages are served unbundled, so their CommonJS dependencies lose
   ESM interop. You get `'invariant' does not provide an export named
   'default'`, fix that, and then hit
   `@react-native/normalize-colors`, and so on.

Keep packages *in* pre-bundling and fix the actual bad file.

## Stale cache after changing main.ts

Vite caches pre-bundled deps. After editing `viteFinal`:

```bash
rm -rf node_modules/.vite && npm run storybook
```

## "Missing script: storybook"

You are not in the repo root. `npm --prefix /path/to/rn-ds run storybook`, or
`cd` back.

## Checking every story actually renders

The Storybook UI shows one story at a time. To sweep them all, hit the preview
iframe directly and watch the console:

```
http://localhost:6006/iframe.html?id=<story-id>&viewMode=story&globals=brand:tribune;theme:dark
```

`globals` is how you drive the toolbar from a URL, which makes brand × mode
sweeps scriptable. See
[verification strategy](../explanation/verification-strategy.md).

## An expected console error

`Components/StoryImage/BrokenUrl` logs `net::ERR_NAME_NOT_RESOLVED`. That story
points at `example.invalid` on purpose, to exercise the dead-URL fallback.
