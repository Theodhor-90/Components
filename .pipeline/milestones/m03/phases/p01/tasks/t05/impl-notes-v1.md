- **`packages/ui/src/components/scroll-area/scroll-area.types.ts`** — Created. Exports `ScrollAreaProps` (extends Radix Root) and `ScrollBarProps` (extends Radix ScrollAreaScrollbar)
- **`packages/ui/src/components/scroll-area/scroll-area.styles.ts`** — Created. Exports 6 static style constants: `scrollAreaStyles`, `scrollAreaViewportStyles`, `scrollBarStyles`, `scrollBarVerticalStyles`, `scrollBarHorizontalStyles`, `scrollBarThumbStyles`
- **`packages/ui/src/components/scroll-area/scroll-area.tsx`** — Created. Exports `ScrollArea` (Root + Viewport + default vertical ScrollBar + Corner) and `ScrollBar` (orientation-aware scrollbar + thumb). Both use `data-slot`, `cn()`, ref-as-prop
- **`packages/ui/src/components/scroll-area/scroll-area.test.tsx`** — Created. 8 tests: smoke render, children content, vertical scrollbar default, horizontal scrollbar, data-slot on scroll-area, data-slot on scroll-bar, className merging, axe a11y — all pass
- **`packages/ui/src/components/scroll-area/scroll-area.stories.tsx`** — Created. 5 CSF3 stories: Vertical, Horizontal, BothDirections, WithTags, CustomHeight. Meta has `tags: ['autodocs']`
- **`packages/ui/src/index.ts`** — Modified. Added `ScrollArea`, `ScrollBar`, `ScrollAreaProps`, `ScrollBarProps` exports from scroll-area component

Verification: `pnpm test` — 396/396 tests pass (28 files). `pnpm typecheck` — 0 errors. `pnpm build` — clean build.
