# Theming in React Native

Theming on the web is mostly solved by CSS custom properties: declare them on
`:root`, override them in a media query, and every rule that references them
follows. React Native has no cascade and no custom properties, which changes
the shape of the problem.

## The StyleSheet.create problem

The idiomatic RN pattern puts styles at module scope:

```tsx
const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF' },
});
```

This runs **once, at import time**, before any provider has mounted. It cannot
read a theme, so it cannot follow light/dark or brand. Every themed value has
to reach the component some other way.

Three options, roughly:

**Inline styles.** Simple, but gives up `StyleSheet.create`'s caching and
scatters values through JSX.

**Pass the theme into a style factory on every render.** Correct, but rebuilds
the stylesheet constantly unless memoised by hand at each call site.

**A factory wrapped in a hook** — what this codebase does:

```ts
export function makeStyles(factory) {
  return function useStyles() {
    const theme = useTheme();
    return useMemo(() => StyleSheet.create(factory(theme)), [theme]);
  };
}
```

Usage keeps the familiar shape, one line moves inside the component:

```tsx
const styles = useStyles();
...
const useStyles = makeStyles((t) => ({ card: { backgroundColor: t.color.surface.card } }));
```

The memo is keyed on the theme object, and themes are pre-built statics — the
whole brand × mode matrix is constructed once at module load. So the dependency
is referentially stable and the stylesheet is rebuilt only when the brand or
mode genuinely changes, not on every render.

## Controlled vs stateful providers

Two consumers wanted different things:

- **Storybook** owns the brand in its toolbar and passes it down. It needs a
  *controlled* provider.
- **The app** needs the brand to change at runtime from a control inside the
  UI. It needs *state*.

Trying to serve both from one component leads to the usual controlled/
uncontrolled mess. Instead `ThemeProvider` stays controlled, and
`BrandProvider` wraps it with `useState` and exposes `useBrand()`. The app
uses the wrapper; Storybook uses the inner one directly.

## Following the OS

`useColorScheme()` from React Native reports the OS appearance and updates
live. `ThemeProvider` uses it only when no explicit `mode` is passed, so the
app follows the system while Storybook can pin a mode.

On web this maps to `prefers-color-scheme`, which is also how it can be tested
— a headless browser can emulate the setting.

## Fonts

There is no font stack fallback in RN the way CSS has one. `fontFamily` takes a
single name, and a name that is not present fails rather than falling through.

Two consequences:

**Not setting `fontFamily` is a real choice.** It yields the platform's native
face — SF on iOS, Roboto on Android — which is usually what you want for UI
text. So a brand's `display: {}` is meaningful, not a missing value.

**Per-platform names are unavoidable.** `Menlo` exists on iOS but not Android,
where the generic `monospace` is the equivalent. Brands store
`{ ios, android, default }` as plain data and `createTheme` resolves it through
`Platform.select`. Anything beyond the built-in faces means bundling with
`expo-font`.

## Where the platform boundary sits

`Platform.select` is the only React Native dependency in the whole token
pipeline, and it lives in `createTheme.ts` — the top of the stack. Everything
below is plain data and pure functions.

That was not a stylistic choice. It is what makes the colour system testable
outside a simulator; see
[verification strategy](verification-strategy.md).

## Navigation chrome

React Navigation keeps its own theme for the surfaces it draws itself. It has
to be handed the palette separately, or you get a white flash between screens
in dark mode:

```tsx
<NavigationContainer theme={toNavigationTheme(theme)}>
```

The status bar is a third system again — `expo-status-bar` takes
`style="light" | "dark"`, driven off `theme.mode`.

Three separate places that need telling about the theme. Easy to wire one and
forget the others; the symptom is usually a flash of the wrong colour during a
transition.
