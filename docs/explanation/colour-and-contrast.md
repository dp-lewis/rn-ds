# Colour and contrast decisions

## Group colours by role, not by tone

The first version of this palette was flat:

```ts
colors = { paper, card, ink, inkMuted, inkInverse, rule, imagePlaceholder, signal }
```

`rule` was the hairline border colour. Twice, it got used as a *text* colour —
once for the `·` separators in the wire line, once for the `— ENDS —` mark at
the foot of an article. Both landed at about **1.32:1**. Invisible.

That is not a careless-developer story. Nothing in a flat namespace signals
that `rule` is a border tone and `inkMuted` is a text tone. They sit side by
side, both are greys, and autocomplete offers them equally.

Grouping by role removes the choice:

```ts
color.surface.{page,card,image}
color.text.{primary,muted,faint,inverse}
color.border.{hairline}
```

Reaching for `color.border.hairline` as a text colour now requires typing
"border" while thinking "text". The mistake is still possible, but it is no
longer the path of least resistance.

The replacement for the recessive-text case is `text.faint`, which is held to
3:1 and documented as decorative-only.

## Two thresholds, deliberately

| Threshold | Applies to |
|---|---|
| 4.5:1 | anything carrying content |
| 3:1 | separators, dividers, decorative marks |

WCAG allows 3:1 for "large text" — 18pt, or 14pt bold. The eyebrow is **11px
bold**, which is neither, so it gets the full 4.5:1. This is worth stating
because "it's bold, so 3:1" is a common and wrong shortcut.

`text.faint` at 3:1 is not a WCAG text conformance claim. It applies to glyphs
that carry no information — remove every `·` from a wire line and it still
reads. If a separator ever becomes load-bearing, it needs `text.muted`.

## Contrast is symmetric, which halves the work

The ratio of A on B equals the ratio of B on A. So a hue's `600` step used as
inline text on white, and as a pill *fill* behind white text, is a single
check. Useful when a palette has to serve both.

## Things that stop following the theme

Not every colour should invert in dark mode.

The pill eyebrow on a lead tile sits on a photograph behind a dark scrim. Its
background is *always* dark, whatever the app surface is doing. A themed hue
would put pale lavender on a photo in dark mode.

Hence `onImage` tokens — `hueOnImage`, `critical.onImage` — which always take
the deep step. The rule that fell out:

> A token follows the theme when it sits on a themed surface, and stops
> following it when it sits on content.

## Eyeballing does not work at these margins

Failures found by script that no one would have caught by looking:

| Value | Measured | Status |
|---|---|---|
| Pulse teal `#00806B` on its light page | 4.49:1 | fails by 0.01 |
| Meridian `text.muted` on its light page | 4.54:1 | passes by 0.04 |
| Original signal red on the light page | ~4.4:1 | failed; darkened to `#C4231A` |

None of these are visible to the eye. All of them are the difference between
conforming and not. That is the entire argument for
[running the check as a script](../how-to/verify-contrast.md) rather than
reviewing colours in a screenshot.

The 4.54:1 case is worth noting separately: it *passes*, but a later decision
to darken the page ground by a few percent would silently break it. The script
is also a regression guard, not just a one-time audit.

## What the numbers do not cover

Contrast ratios say nothing about whether five desk hues are
*distinguishable from each other*, particularly for the ~8% of men with a
red-green deficiency. Every desk colour here is also paired with a text label,
so colour is never the sole carrier of meaning — which is the actual WCAG
requirement (1.4.1 Use of Colour). The colour is redundant reinforcement.

Worth keeping in mind if a future design drops the label and keeps the dot.
