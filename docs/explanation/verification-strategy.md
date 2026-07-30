# How this codebase gets verified

A design system has a specific testing problem: most of what it asserts is
visual, and most visual assertions are either expensive (screenshot diffing) or
worthless (snapshotting a style object). What follows is what turned out to be
worth doing here, and why.

## Keep the pure part pure

The colour pipeline — `primitives` → `alias` → `semantic` — imports no React
Native. It is plain data and pure functions. `createTheme.ts` is the first file
to touch `Platform`, and it sits above the boundary.

That single constraint means the entire colour system can be compiled with
`tsc` into a temp directory and required by a plain Node script. No simulator,
no jest transform, no react-native preset, no mocking. `npm run check:contrast`
runs 150 assertions across three brands and two modes in a couple of seconds.

Crucially it asserts against the **real** tokens. The obvious alternative —
copying the palette into a test fixture — produces a file that drifts from the
source the first time someone adjusts a hex, and then passes forever while
testing nothing.

Getting this property was cheap, but only because it was decided up front.
Retrofitting it means untangling `Platform.select` calls from twenty files.

## Let types carry what they can

Some invariants do not need a test at all:

```ts
export const categoryColors: Record<Category, string>
```

Add a desk to `CATEGORIES` and the build fails until it has a colour. Verified
by temporarily adding a `'Sport'` desk and confirming:

```
src/theme/semantic.ts: Property 'Sport' is missing in type ...
```

A type that makes the invalid state unrepresentable beats a test that checks
for it. The same shape does the work for `Record<HueName, HueRamp>` across
brands.

Worth actually *testing the guard* — write the broken version, watch it fail,
revert. A guard nobody has seen fail is a guard nobody knows works.

## Validate at the boundary, not in the types

The counterpart: types do nothing at runtime. This shipped early:

```ts
const stories = storiesJson as Story[];
```

A cast, not a check. A typo'd category compiled fine and rendered an eyebrow
with no colour — degraded silently, which is worse than crashing. `parseStory`
now checks every field where the data enters, and names the offending value:

```
stories.json[2]: category "Sprot" is not a known desk
(expected one of: World, Business, Science, Climate, Culture)
```

Tested by compiling the validator standalone and feeding it eight bad payloads.

## Drive the real thing

For anything visual, the useful test is the actual rendered app, not a mock.

Because the app runs on react-native-web, a headless browser can drive it:
click a story tile, assert the article opens, click back, assert the feed
returns, and **collect every console error and page error along the way**.

The error collection matters as much as the assertions. A story can render
while throwing — several did during the `expo-image` integration, reporting
"ok" visually while logging a `SyntaxError` on every load.

## Sweep the matrix

Storybook's preview iframe takes globals in the URL:

```
/iframe.html?id=<story>&viewMode=story&globals=brand:tribune;theme:dark
```

Which makes the whole matrix scriptable — 8 stories × 3 brands × 2 modes = 48
renders, each checked for render failure and console noise. Combinatorial
coverage is exactly what a multi-brand system needs and exactly what manual
review will not give you.

## Look at the screenshots

Several defects here were invisible to every automated check and obvious in a
screenshot:

- the `— ENDS —` mark rendering in a border tone, effectively invisible
- the article back button floating over body text once scrolled
- a non-breaking lead tile with no desk label at all

All three passed typecheck, rendered without errors, and were wrong. Rendering
a component and *looking at it* remains an irreplaceable step.

## Check the DOM when accessibility is the claim

`accessibilityState={{ selected }}` on the brand switcher produced no attribute
at all — react-native-web drops it there. `{{ checked }}` did nothing either.
The control worked, looked right, and announced no state to a screen reader.

Nothing surfaced this except dumping `outerHTML` and reading it. The fix was
passing `aria-checked` directly, which RN maps to native accessibility state on
iOS and Android.

The lesson generalises: an accessibility affordance is a claim about output
that assistive technology receives. Verify the output, not the source.

## Roughly in order of value

1. **Types**, for anything expressible as an invariant — free, and cannot drift
2. **A pure core**, so the logic is testable without a device
3. **Boundary validation**, because types vanish at runtime
4. **Driving the real app** with errors collected, not just assertions
5. **Matrix sweeps** for combinatorial surface
6. **Screenshots**, for everything the machine cannot judge

What is deliberately absent: unit tests asserting that a component renders a
particular style object. They restate the implementation, break on every
refactor, and would not have caught a single defect found here.
