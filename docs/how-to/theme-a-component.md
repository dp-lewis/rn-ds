# How to theme a component

Goal: write a component whose colours, spacing and type follow brand and
light/dark automatically.

## Use makeStyles, not StyleSheet.create

```tsx
import { Text, View } from 'react-native';
import { makeStyles } from '../theme';

export default function Notice({ children }: { children: string }) {
  const styles = useStyles();
  return (
    <View style={styles.box}>
      <Text style={styles.label}>{children}</Text>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  box: {
    backgroundColor: t.color.surface.card,
    borderColor: t.color.border.hairline,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: t.radius.lg,
    padding: t.spacing.lg,
    gap: t.spacing.sm,
  },
  label: {
    ...t.typography.summary,
    color: t.color.text.muted,
  },
}));
```

`makeStyles` returns a hook. Call it inside the component.

## Picking the right token

| You want | Use |
|---|---|
| The page background | `t.color.surface.page` |
| A card or tile | `t.color.surface.card` |
| Behind an image while it loads | `t.color.surface.image` |
| Body and heading text | `t.color.text.primary` |
| Secondary text, metadata | `t.color.text.muted` |
| A separator glyph or dot | `t.color.text.faint` |
| Text over a photograph | `t.color.text.inverse` |
| A hairline rule or border | `t.color.border.hairline` |
| Breaking news only | `t.color.signal` |
| A desk label | `t.color.category[category]` |
| A chip over a photograph | `t.color.onImage.*` |

**Never use `border.hairline` as a text colour.** It is a border tone at
roughly 1.3:1 — invisible as text. That exact mistake shipped twice here. If
you want a recessive text tone, that is `text.faint`.

## Values that change per interaction

Colours that depend on runtime state go inline, not in the stylesheet:

```tsx
const theme = useTheme();

<Pressable
  style={({ pressed }) => [
    styles.card,
    pressed && { opacity: theme.opacity.pressed },
  ]}
/>
```

Use `theme.opacity.pressed` rather than a literal, so every pressable in the
app agrees.

## Anything over photography

Use the `onImage` tokens, which do not follow the mode:

```tsx
<Eyebrow category={story.category} variant="pill" />
```

Desk colours are tuned for app surfaces. On a photo behind a dark scrim they
are unreadable, which is why the `pill` variant exists.

## Add a story

One `*.stories.tsx` per component, next to it. Cover **every variant and every
state**, including the ones your sample data never produces:

```tsx
export const NonBreakingLead: SBStory = {
  args: { story: scienceStory, variant: 'lead' },
};
```

That story exists because a non-breaking lead tile rendered with no desk label
at all, and nothing caught it — the only story that sorted into the lead slot
happened to be breaking.

## Check it

```bash
npx tsc --noEmit
npm run storybook
```

In Storybook, flip **Brand** and **Theme** in the toolbar. If anything stays
put, you hard-coded a value.
