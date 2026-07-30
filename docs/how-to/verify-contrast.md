# How to verify colour contrast

Goal: prove every brand and mode meets WCAG AA, without opening a browser.

## Run it

```bash
npm run check:contrast
```

```
3 brands x 2 modes — 150 contrast assertions
All pass.
```

Exits non-zero on failure, so it drops straight into CI or a pre-commit hook.

## What it checks

For every brand, in both modes:

| Pair | Minimum |
|---|---|
| `text.primary` on `surface.page` and `surface.card` | 4.5:1 |
| `text.muted` on both surfaces | 4.5:1 |
| `text.faint` on both surfaces | 3:1 |
| `signal` on both surfaces | 4.5:1 |
| every `category` on both surfaces | 4.5:1 |
| `onImage.text` on every `onImage.category` and on `onImage.signal` | 4.5:1 |
| `surface.page` vs `surface.card` | must be distinguishable |

## Reading a failure

```
1 FAILED:
  pulse/light  category.Business on page  4.49:1 < 4.5  (#00806B on #F5F5F7)
```

Brand, mode, which pair, the measured ratio, and the two colours. Fix by
adjusting the **primitive** — `color.hue.teal[600]` in `primitives/pulse.ts` —
not the alias or semantic layer. Those are wiring; the value lives at the
bottom.

To find a passing value:

```bash
node -e '
const lum=(h)=>{const c=h.replace("#","").match(/../g).map(x=>{const v=parseInt(x,16)/255;
  return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)});
  return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]};
const R=(a,b)=>{const[x,y]=[lum(a),lum(b)].sort((m,n)=>n-m);return (x+0.05)/(y+0.05)};
for (const hex of ["#00806B","#007A66","#007561"])
  console.log(hex, R(hex,"#F5F5F7").toFixed(2), R(hex,"#FFFFFF").toFixed(2));'
```

## Why 4.5:1 for the eyebrow

The eyebrow is 11px bold. WCAG's 3:1 allowance applies to "large text" — 18pt,
or 14pt bold. 11px bold is neither, so it needs the full 4.5:1.

## Why this can run in Node at all

`primitives`, `alias` and `semantic` import no React Native. The script
compiles just those files with `tsc` into a temp directory and requires them,
so it asserts against the **real** tokens. A hand-copied palette in a test file
would drift from the source the first time someone tweaks a hex.

`createTheme.ts` is the first file that touches `Platform`, and it is
deliberately outside this boundary. See
[verification strategy](../explanation/verification-strategy.md).

## What it does not check

- Text over photographs. The scrim makes that dependent on the image.
- Non-text contrast for borders and icons (WCAG 1.4.11).
- Anything about layout, focus order or touch target size.

For those, use the a11y panel in Storybook — `@storybook/addon-a11y` runs axe
against each story.
