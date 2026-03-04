## Objective

Register both Stepper and Timeline components, their types, and CVA variant functions in the public API barrel file, then verify the entire monorepo builds and tests cleanly.

## Files to Modify

| File | Change |
|------|--------|
| `packages/ui/src/index.ts` | Add export statements for Stepper and Timeline |

## Implementation Details

### Stepper Exports
Add to `packages/ui/src/index.ts`:
- From `./components/stepper/stepper.js`: `Stepper`, `StepperItem`, `type StepperProps`, `type StepperItemProps`
- From `./components/stepper/stepper.styles.js`: `stepperVariants`, `stepperItemVariants`

### Timeline Exports
Add to `packages/ui/src/index.ts`:
- From `./components/timeline/timeline.js`: `Timeline`, `TimelineItem`, `type TimelineProps`, `type TimelineItemProps`
- From `./components/timeline/timeline.styles.js`: `timelineItemDotVariants`

### Important Constraints
- Internal types (`StepperItemInternalProps`, `TimelineItemInternalProps`) are **not** exported from `index.ts`
- Follow the existing export pattern in `index.ts`: `export { Component, type ComponentProps } from './components/{name}/{name}.js'`
- CVA variant functions use `.styles.js` source path

### Verifications to Run
- `pnpm typecheck` — must pass with zero errors
- `pnpm test` — must pass with zero failures
- `pnpm storybook` — both components render with autodocs

## Dependencies
- **Task 1 (Stepper Component)** and **Task 2 (Timeline Component)** must be complete before this task

## Verification Criteria
1. `packages/ui/src/index.ts` contains all specified export statements for both components
2. No internal types are exported
3. Export paths use `.js` extensions (matching existing convention)
4. `pnpm typecheck` passes with zero errors across the monorepo
5. `pnpm test` passes with zero failures
6. Both components render in Storybook via `pnpm storybook`