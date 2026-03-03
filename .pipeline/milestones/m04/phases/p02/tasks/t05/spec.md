# Task: Progress Component

## Objective

Implement the Progress component following the 5-file pattern. Progress wraps `@radix-ui/react-progress` using `ProgressRoot` and `ProgressIndicator` with a CSS transition-driven animated fill bar.

## Files to Create

- `packages/ui/src/components/progress/progress.types.ts` — Props type for Progress extending `React.ComponentProps<typeof ProgressPrimitive.Root>`. The `value` prop is inherited from Radix and accepts a number 0–100. No additional custom props.
- `packages/ui/src/components/progress/progress.styles.ts` — Static string constants: `progressStyles` for the track (`relative h-4 w-full overflow-hidden rounded-full bg-secondary`) and `progressIndicatorStyles` for the fill bar (`h-full w-full flex-1 bg-primary transition-all`).
- `packages/ui/src/components/progress/progress.tsx` — Implementation of Progress as a named export. Renders `ProgressPrimitive.Root` with `data-slot="progress"` and track styles. Inside, renders `ProgressPrimitive.Indicator` with `data-slot="progress-indicator"` and indicator styles. The indicator's position is controlled via inline `style={{ transform: \`translateX(-${100 - (value || 0)}%)\` }}`, matching the shadcn/ui implementation.
- `packages/ui/src/components/progress/progress.test.tsx` — Test suite covering: smoke render with default value, renders indicator at correct position for value=0 (fully left/hidden), value=50 (half width), value=100 (full width), `data-slot` attributes on root and indicator, className merging, ref forwarding, `aria-valuenow` reflects value, `aria-valuemin` and `aria-valuemax` are set (Radix handles this), undefined value renders as 0%, and vitest-axe accessibility assertions.
- `packages/ui/src/components/progress/progress.stories.tsx` — Storybook CSF3 stories with `tags: ['autodocs']`. Stories: Default (progress at 60%), Empty (progress at 0%), Complete (progress at 100%), Animated (interactive story with a button that increments value to demonstrate transition), CustomColor (progress with overridden indicator color via className).

## Files to Modify

- `packages/ui/src/index.ts` — Export Progress, its type, and style constants.

## Key Implementation Details

- The indicator's width is controlled via `translateX` transform driven by the `value` prop (0–100), matching the shadcn/ui implementation: `style={{ transform: \`translateX(-${100 - (value || 0)}%)\` }}`.
- CSS transition on transform via `transition-all` for smooth animation when `value` changes. No JavaScript animation or requestAnimationFrame — pure CSS transition.
- No CVA variants — single visual treatment. Indicator uses `bg-primary` on a `bg-secondary` track.
- Progress renders `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` attributes (provided by Radix) for screen reader accessibility.

## Dependencies

- **New dependency**: `@radix-ui/react-progress` must be installed in `packages/ui/package.json`.
- **Existing dependencies**: `@components/utils` (cn helper).
- No dependency on Tasks 1, 2, 3, or 4 — can be implemented in parallel with them.
- Phase 1 of this milestone must be complete.

## Verification Criteria

1. Progress bar renders an indicator whose position is controlled by `translateX` transform based on the `value` prop (0–100) with a smooth CSS transition.
2. Progress renders `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` attributes for screen reader accessibility.
3. `data-slot` attributes are present on root (`progress`) and indicator (`progress-indicator`).
4. Indicator renders at correct position for value=0, value=50, and value=100.
5. Undefined value renders as 0%.
6. `pnpm typecheck` passes with zero TypeScript errors.
7. `pnpm test` passes for progress tests including vitest-axe accessibility assertions.
8. Storybook stories render correctly with `tags: ['autodocs']`.
9. All exports are present in `packages/ui/src/index.ts`.
