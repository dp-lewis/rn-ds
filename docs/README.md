# rn-ds documentation

Notes from building a React Native design system with multi-brand theming and
light/dark support, on Expo, with Storybook running through react-native-web.

These docs follow [Diátaxis](https://diataxis.fr): four kinds of documentation
that answer four different questions. Keeping them apart is the point — a
recipe interrupted by theory is a bad recipe, and an explanation cluttered with
steps is a bad explanation.

| | Serves | Read when |
|---|---|---|
| [Tutorials](#tutorials) | Learning | You are new here and want to build something end to end |
| [How-to guides](#how-to-guides) | A goal | You know what you want and need the steps |
| [Reference](#reference) | Facts | You need to look up what exists |
| [Explanation](#explanation) | Understanding | You want to know why it is built this way |

## Tutorials

- [Build a themed component](tutorials/build-a-themed-component.md) — create a
  component from scratch, style it from tokens, give it a story, and watch it
  re-skin across three brands.

## How-to guides

- [Add a brand](how-to/add-a-brand.md)
- [Add a desk category](how-to/add-a-desk-category.md)
- [Theme a component](how-to/theme-a-component.md)
- [Verify colour contrast](how-to/verify-contrast.md)
- [Troubleshoot Storybook with Expo packages](how-to/troubleshoot-storybook-expo.md)

## Reference

- [Token layers](reference/token-layers.md) — every token, layer by layer
- [Brand contract](reference/brand-contract.md) — what a brand must supply
- [Theme API](reference/theme-api.md) — providers, hooks, helpers
- [Project layout](reference/project-layout.md)

## Explanation

- [Why three token layers](explanation/why-three-token-layers.md)
- [Theming in React Native](explanation/theming-react-native.md)
- [Colour and contrast decisions](explanation/colour-and-contrast.md)
- [How this codebase gets verified](explanation/verification-strategy.md)
- [Storybook on react-native-web](explanation/storybook-on-rnw.md)

## The short version

If you read nothing else:

1. **Components import from `src/theme` and nothing below it.** Never
   `theme/primitives` or `theme/alias`. That single rule is what makes a brand
   swap propagate.
2. **Styles come from `makeStyles`, not `StyleSheet.create`.** A module-level
   stylesheet cannot see the theme, so it cannot follow light/dark or brand.
3. **Colour decisions get verified, not eyeballed.** 4.5:1 for text, 3:1 for
   decoration, checked by script across every brand and mode.
