# Storybook on react-native-web

## Two things share the name

"Storybook for React Native" means two different products:

**`@storybook/react-native`** renders stories on a device or simulator, in a
custom UI built from RN components. It exercises the real native runtime.

**`@storybook/react-native-web-vite`** renders RN components in a browser
through `react-native-web`, in the standard Storybook web UI — the sidebar,
Controls, Docs and addons you know from web projects.

This project uses the second, because the ask was for the experience closest to
web Storybook. It is worth being explicit about which one you mean; the
tradeoff is real.

## What react-native-web actually gives you

`react-native-web` maps RN primitives onto DOM elements: `View` → `div`,
`Text` → `div` with text styles, `StyleSheet` → atomic CSS classes. It is a
faithful mapping for layout, flexbox, and most styling.

It is not the native runtime. Things that differ:

- Native modules that have no web implementation
- Gesture and touch behaviour
- Platform-specific font rendering and metrics
- `Platform.OS` is `'web'`, so any `Platform.select` branch you are testing is
  the web one

For a design system whose surface is layout, colour and type, this is a good
trade: fast iteration, real addons, no simulator. For anything touching native
behaviour, it is the wrong tool and Expo Go on a real device is the answer.

The honest framing: **Storybook here reviews the design system, it does not
validate the app on a device.**

## Where the friction is

Vite expects packages to ship compiled JavaScript with correct ESM exports.
Several Expo packages do not — `expo-modules-core` ships TypeScript *source* as
its runtime entry, because it expects Metro, which compiles `node_modules`.

That mismatch is the root of essentially every Storybook build problem here.
Metro compiles whatever it is pointed at; Vite pre-bundles dependencies and
expects them to already be valid ESM.

The specific failures and fixes are in
[troubleshoot Storybook with Expo packages](../how-to/troubleshoot-storybook-expo.md).

## The debugging lesson

The first instinct on a dependency pre-bundling error is to exclude the package
from pre-bundling. That was wrong, in an instructive way:

1. Excluding it moved the failure from build time to runtime — same cause,
   later, and harder to read.
2. Excluded packages are served unbundled, so their CommonJS dependencies lost
   ESM interop. Fixing `invariant` surfaced `@react-native/normalize-colors`,
   and it was clear a third would follow.

Two rounds of whack-a-mole is enough signal that the approach is wrong rather
than incomplete. Keeping everything *in* pre-bundling and neutralising the one
genuinely broken file — four declaration-only modules — fixed it in one move.

Worth verifying an assumption before acting on it, too: the stub is only safe
because those files contain no runtime statements, which is a one-line grep to
confirm rather than something to assume from the directory name.

## What the web build buys beyond convenience

Because stories are URLs in a browser, the whole matrix becomes scriptable:

```
/iframe.html?id=<story>&viewMode=story&globals=brand:tribune;theme:dark
```

Toolbar globals in the query string mean a headless browser can sweep every
story across every brand and mode, collecting console errors. That is 48
combinations here, and it is the check that actually earns its keep on a
multi-brand system.

On-device Storybook has no equivalent.

## Addons worth having

`@storybook/addon-a11y` runs axe against each story. For a design system it is
the highest-value addon by some distance — it catches contrast and ARIA
problems in the panel, without anyone remembering to look.

It has limits. It found nothing about the `aria-checked` problem on the brand
switcher, because a missing state attribute is not an axe violation; the
element was still a valid radio. Automated a11y checks catch violations, not
omissions.
