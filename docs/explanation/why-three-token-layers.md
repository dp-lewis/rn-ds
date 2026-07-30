# Why three token layers

## The problem

A design system that supports several brands has to answer one question: when
the brand changes, what has to change with it?

The naive answer is a flat object of colours that gets swapped wholesale. That
works until you notice the flat object contains two different kinds of thing —
*values* (`#2340C8`) and *decisions* (this is the colour a World story wears).
Brands disagree about values. They mostly agree about decisions. Mixing them
means every brand restates every decision, and adding a fourth brand means
re-deriving all of it.

Three layers separate the two.

## The layers

**Primitives** are values with no meaning. `neutral[550]`, `hue.azure[600]`,
`space[4]`. Named for what they are, so nothing about them implies where they
go. Each brand supplies its own set.

**Alias** assigns generic roles: `bg.raised`, `fg.muted`, `line.default`. This
is the only layer that knows light from dark, and the only one that reaches
into a ramp for a specific step. It still knows nothing about news.

**Semantic** says what things mean in this product: `surface.card`,
`text.faint`, `category.World`. Components consume this and nothing else.

## What each boundary buys

**Primitive → alias** is where light and dark are resolved. Because the neutral
ramp spans both ends in a single ordered list, light and dark are the same
decision read from opposite ends:

```
light: bg.base = neutral[25]     dark: bg.base = neutral[975]
light: fg.default = neutral[925] dark: fg.default = neutral[50]
```

Dark mode is not a second palette to maintain. It is a different index into
the same one, which is why adding a brand does not double the work.

**Alias → semantic** is where product meaning attaches. `category.World` is
`hue.azure` because someone decided World stories are blue — an editorial
decision, not a palette one, and it holds across every brand. That mapping is
written once in `semantic.ts`. A new brand supplies five hues and inherits the
decision.

## The rule that makes it work

> Components import from `src/theme` and never from `theme/primitives` or
> `theme/alias`.

Layers are only worth having if the bottom ones are unreachable. One component
importing `hue.azure[600]` directly is a component that stops following the
brand, and it will not announce itself — it will look right in the brand you
developed against.

The rule is checkable:

```bash
grep -rn "theme/primitives\|theme/alias" src/components src/screens
```

Worth an ESLint `no-restricted-imports` rule if this grows.

## The cost

This is more indirection than a small app needs. Tracing `surface.card` back to
a hex means three hops. For a single-brand app with no dark mode, one flat
object is the right answer and this would be over-engineering.

It pays off at the second brand, and again at the second mode. The signal to
adopt it is a concrete plan for either, not the possibility of one.

## Where the seam actually landed

One thing that only became obvious while building: not everything should
follow the theme.

The pill eyebrow on a lead tile sits on a photograph behind a dark scrim. If
its colour followed the mode, dark mode would put a light hue on a dark
photo. So the alias layer exposes `hueOnImage` and `critical.onImage`, which
always take the deep step regardless of mode, and semantic surfaces them as
`color.onImage.*`.

The general shape: **tokens follow the theme when they sit on a themed
surface, and stop following it when they sit on content.** That distinction
does not appear in most token taxonomies, and it is not obvious until a lead
tile is in front of you in dark mode.
