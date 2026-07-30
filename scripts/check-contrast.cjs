#!/usr/bin/env node
/**
 * Checks every semantic colour pair, for every brand, in both modes, against
 * WCAG AA.
 *
 * This works because the colour pipeline (primitives → alias → semantic)
 * imports no React Native. It is compiled to a temp directory and required
 * here, so the assertions run against the real tokens rather than a copy that
 * can drift. `createTheme.ts` is the first file to touch `Platform`, and it is
 * deliberately not part of this.
 *
 * Usage: npm run check:contrast
 */

const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const OUT = fs.mkdtempSync(path.join(os.tmpdir(), 'rn-ds-contrast-'));

const SOURCES = [
  'src/theme/semantic.ts',
  'src/theme/alias.ts',
  'src/theme/primitives/index.ts',
  'src/types.ts',
];

// Minimums. 4.5:1 is AA for normal text; the eyebrow is 11px bold, which is
// not "large text", so it does not get the 3:1 allowance. text.faint is
// decorative only and is held to 3:1.
const TEXT = 4.5;
const DECORATIVE = 3;

function compile() {
  execFileSync(
    'npx',
    [
      'tsc', ...SOURCES,
      '--ignoreConfig',
      '--outDir', OUT,
      '--module', 'commonjs',
      '--target', 'es2020',
      '--skipLibCheck',
      '--esModuleInterop',
    ],
    { cwd: ROOT, stdio: 'pipe' },
  );
}

const luminance = (hex) => {
  const channels = hex.replace('#', '').match(/../g).map((pair) => {
    const v = parseInt(pair, 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
};

const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

function main() {
  compile();

  const { createAlias } = require(path.join(OUT, 'theme/alias.js'));
  const { createSemanticColors } = require(path.join(OUT, 'theme/semantic.js'));
  const { brands, BRAND_IDS } = require(path.join(OUT, 'theme/primitives/index.js'));
  const { CATEGORIES } = require(path.join(OUT, 'types.js'));

  const failures = [];
  let assertions = 0;

  const assert = (brand, mode, label, fg, bg, min) => {
    assertions++;
    const r = ratio(fg, bg);
    if (r < min) {
      failures.push(
        `${brand}/${mode}  ${label}  ${r.toFixed(2)}:1 < ${min}  (${fg} on ${bg})`,
      );
    }
  };

  for (const brand of BRAND_IDS) {
    for (const mode of ['light', 'dark']) {
      const c = createSemanticColors(createAlias(brands[brand], mode));

      for (const [name, surface] of Object.entries({
        page: c.surface.page,
        card: c.surface.card,
      })) {
        assert(brand, mode, `text.primary on ${name}`, c.text.primary, surface, TEXT);
        assert(brand, mode, `text.muted on ${name}`, c.text.muted, surface, TEXT);
        assert(brand, mode, `text.faint on ${name}`, c.text.faint, surface, DECORATIVE);
        assert(brand, mode, `signal on ${name}`, c.signal, surface, TEXT);
        for (const category of CATEGORIES) {
          assert(brand, mode, `category.${category} on ${name}`, c.category[category], surface, TEXT);
        }
      }

      // Pills sit on photography and use the fixed on-image fills.
      assert(brand, mode, 'onImage.signal pill', c.onImage.text, c.onImage.signal, TEXT);
      for (const category of CATEGORIES) {
        assert(brand, mode, `onImage.${category} pill`, c.onImage.text, c.onImage.category[category], TEXT);
      }

      // page and card must be tellable apart, or cards vanish into the ground.
      assertions++;
      const separation = ratio(c.surface.page, c.surface.card);
      if (separation < 1.02) {
        failures.push(
          `${brand}/${mode}  surface.page vs surface.card indistinguishable (${separation.toFixed(3)}:1)`,
        );
      }
    }
  }

  console.log(
    `${BRAND_IDS.length} brands x 2 modes — ${assertions} contrast assertions`,
  );

  if (failures.length) {
    console.error(`\n${failures.length} FAILED:`);
    failures.forEach((f) => console.error('  ' + f));
    process.exitCode = 1;
    return;
  }

  console.log('All pass.');
}

try {
  main();
} finally {
  fs.rmSync(OUT, { recursive: true, force: true });
}
