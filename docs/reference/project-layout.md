# Reference: project layout

```
App.tsx                     SafeAreaProvider → BrandProvider → navigation
index.ts                    Expo entry point

src/
├── theme/
│   ├── index.ts            barrel — the only import surface for components
│   ├── primitives/
│   │   ├── scales.ts       space, radii, fontSize, tracking, scrims
│   │   ├── types.ts        BrandPrimitives and ramp types
│   │   ├── meridian.ts     ┐
│   │   ├── tribune.ts      ├ brand ramps + font stacks
│   │   ├── pulse.ts        ┘
│   │   └── index.ts        registry: brands, BRAND_IDS, BRAND_OPTIONS
│   ├── alias.ts            createAlias(brand, mode)
│   ├── semantic.ts         createSemanticColors + semantic scales
│   ├── createTheme.ts      composes the layers; builds the themes matrix
│   ├── ThemeProvider.tsx   controlled provider + useTheme
│   ├── BrandProvider.tsx   stateful provider + useBrand
│   └── makeStyles.ts       theme-aware StyleSheet helper
│
├── components/
│   ├── StoryTile.tsx       lead | standard variants
│   ├── Eyebrow.tsx         inline | pill variants
│   ├── WireLine.tsx        the dateline / filed / read-length line
│   ├── StoryImage.tsx      expo-image + placeholder + dead-URL fallback
│   ├── BrandSwitcher.tsx   segmented control
│   └── *.stories.tsx       one story file per component
│
├── screens/
│   ├── HomeScreen.tsx      feed; lead tile + list
│   └── ArticleScreen.tsx   article template
│
├── api/
│   ├── newsApi.ts          fetchTopStories, fetchStoryById
│   └── parseStory.ts       runtime validation of the JSON
│
├── data/stories.json       mock API payload
├── navigation/types.ts     RootStackParamList
├── lib/time.ts             formatFiled
└── types.ts                Story, Category, CATEGORIES

.storybook/
├── main.ts                 framework config + Vite workarounds for Expo
└── preview.tsx             brand/theme toolbar globals + decorator
```

## Layer boundaries

| Module | May import |
|---|---|
| `theme/primitives/*` | `src/types` (for `Category`) |
| `theme/alias.ts` | `theme/primitives` |
| `theme/semantic.ts` | `theme/primitives`, `theme/alias`, `src/types` |
| `theme/createTheme.ts` | all of the above, plus `react-native` |
| components, screens | `src/theme` barrel only |

`primitives`, `alias` and `semantic` deliberately import **no React Native**.
That boundary is what lets the colour pipeline be compiled and tested in plain
Node. `createTheme` is the first file that touches `Platform`.

## Dependency direction

`src/types.ts` owns `Category` and `CATEGORIES`. The theme depends on the
domain, never the reverse — `theme/primitives/types.ts` imports `Category` so
that `Record<Category, HueRamp>` fails to compile when a desk has no colour.

## Scripts

| Command | Does |
|---|---|
| `npm start` | Expo dev server; scan the QR with Expo Go |
| `npm run web` | app in a browser via react-native-web |
| `npm run ios` / `android` | needs Xcode / Android Studio |
| `npm run storybook` | Storybook on :6006 |
| `npm run build-storybook` | static build to `storybook-static/` |
| `npx tsc --noEmit` | typecheck |
