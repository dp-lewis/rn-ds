# Tutorial: build a themed component

By the end of this you will have built a `PullQuote` component, styled it
entirely from design tokens, given it a Storybook story, and watched it re-skin
across three brands and two colour schemes without changing a line of it.

Takes about fifteen minutes. You need the repo cloned and `npm install` done.

## 1. Start Storybook

```bash
npm run storybook
```

It opens on http://localhost:6006. Leave it running — it reloads as you save.

## 2. Create the component

Create `src/components/PullQuote.tsx`:

```tsx
import { Text, View } from 'react-native';

import { makeStyles } from '../theme';

type Props = {
  quote: string;
  attribution: string;
};

export default function PullQuote({ quote, attribution }: Props) {
  const styles = useStyles();

  return (
    <View style={styles.wrap}>
      <Text style={styles.quote}>{quote}</Text>
      <Text style={styles.attribution}>{attribution.toUpperCase()}</Text>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  wrap: {
    borderLeftWidth: 3,
    borderLeftColor: t.color.signal,
    paddingLeft: t.spacing.lg,
    gap: t.spacing.sm,
  },
  quote: {
    ...t.typography.standfirst,
    color: t.color.text.primary,
  },
  attribution: {
    ...t.typography.wire,
    color: t.color.text.muted,
  },
}));
```

Three things to notice.

`makeStyles` takes a function of the theme and returns a **hook**. You call it
inside the component: `const styles = useStyles()`. This is the whole reason
the component can follow the theme — a module-level `StyleSheet.create` runs
before any provider mounts and can never see one.

Every value comes from `t`. No hex codes, no raw pixel numbers.

`t.typography.wire` already carries the brand's monospace face. You do not set
`fontFamily` yourself.

## 3. Add a story

Create `src/components/PullQuote.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';

import PullQuote from './PullQuote';

const meta = {
  title: 'Components/PullQuote',
  component: PullQuote,
  args: {
    quote:
      'We have built a single market for electricity and kept twenty-seven national emergency plans.',
    attribution: 'EU official, Brussels',
  },
} satisfies Meta<typeof PullQuote>;

export default meta;

type SBStory = StoryObj<typeof meta>;

export const Default: SBStory = {};

export const Short: SBStory = {
  args: { quote: 'The maps model the river, not the storm.' },
};
```

Save. Storybook picks up the new file automatically — `Components/PullQuote`
appears in the sidebar.

## 4. Watch it follow the theme

In the Storybook toolbar:

- Switch **Theme** to **Dark**. The quote text, the attribution and the
  background all move. You wrote no dark-mode code.
- Switch **Brand** to **Tribune**. The paper turns warm, the ink goes
  brown-black, and the accent rule changes to Tribune's critical red.
- Switch to **Pulse**. Higher contrast, a different red again.

Six combinations, one component.

## 5. Break it on purpose

Change the border colour to a literal:

```tsx
    borderLeftColor: '#C4231A',
```

Save, then switch brand and theme again. The rule now stays the same red in
every combination while everything around it moves. That mismatch is what a
hard-coded value looks like, and it is why the token rule exists.

Put it back:

```tsx
    borderLeftColor: t.color.signal,
```

## 6. Check contrast

```bash
npm run check:contrast
```

```
3 brands x 2 modes — 150 contrast assertions
All pass.
```

Your component used `text.primary` and `text.muted`, both already covered
across every brand and mode. Building from tokens means inheriting that
guarantee rather than re-establishing it.

## 7. Typecheck

```bash
npx tsc --noEmit
```

Clean exit, no output.

## What you learned

- `makeStyles` is how a component reads the theme
- Components only ever touch **semantic** tokens — `t.color.*`, `t.spacing.*`,
  `t.typography.*` — never primitives or aliases
- A single component definition serves every brand and both modes
- A hard-coded value is visible the moment you switch brand

## Next

- [Theme a component](../how-to/theme-a-component.md) — which token for which job
- [Why three token layers](../explanation/why-three-token-layers.md) — the reasoning
- [Token layers](../reference/token-layers.md) — everything available on `t`

## Cleaning up

`PullQuote` is not part of the app. Delete both files, or keep them around to
experiment with:

```bash
rm src/components/PullQuote.tsx src/components/PullQuote.stories.tsx
```
