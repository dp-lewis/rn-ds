# rn-ds

A piece of research exploring how to set up a design system in React Native.

The question was what it actually takes to support **multiple brands** and
**light/dark mode** properly in RN — where there is no CSS cascade and no
custom properties, so the web answers do not transfer. The result is a
three-layer token system (primitive → alias → semantic), three brands that
re-skin the whole app at runtime, and a Storybook that runs in the browser.

It is built around a small fictional news app, **Meridian**, because a design
system needs something real to be a system *for*. The app is a vehicle, not the
point.

## What's here

- Three-layer design tokens, with light/dark resolved in the alias layer
- Three brands (Meridian, Tribune, Pulse), switchable at runtime
- Storybook via `react-native-web-vite`, with brand and theme toolbar switches
- A contrast script that checks every brand and mode against WCAG AA
- Two screens and a handful of themed components

Expo SDK 57 · React Native 0.86 · React 19 · TypeScript 6 · Storybook 10

## Running it

```bash
npm install
npm start          # then scan the QR code with Expo Go on a phone
```

Other ways in:

```bash
npm run web        # browser, fastest feedback loop
npm run storybook  # component library on :6006
npm run ios        # needs Xcode
npm run android    # needs Android Studio
```

Checks:

```bash
npx tsc --noEmit
npm run check:contrast
```

## Docs

**[docs/](docs/)** — written in [Diátaxis](https://diataxis.fr) style.

- [Build a themed component](docs/tutorials/build-a-themed-component.md) — start here
- [Token layers](docs/reference/token-layers.md) — what exists
- [Add a brand](docs/how-to/add-a-brand.md) — the main thing this repo is about
- [Why three token layers](docs/explanation/why-three-token-layers.md) — the reasoning

Two rules carry most of the weight:

1. Components import from `src/theme` and never from `theme/primitives` or
   `theme/alias`.
2. Styles come from `makeStyles`, not a module-level `StyleSheet.create`.

## Status

Exploratory. The story data is a hard-coded JSON file behind a fake API, and
the brand selection is not persisted. Not a product.
