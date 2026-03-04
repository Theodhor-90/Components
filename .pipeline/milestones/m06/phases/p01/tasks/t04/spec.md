## Objective

Perform a full integration verification of all Phase 1 deliverables to confirm the Stepper and Timeline components meet all exit criteria before the phase is marked complete.

## Files to Verify (No New Files Created)

| File | Check |
|------|-------|
| `packages/ui/src/components/stepper/stepper.tsx` | Exists, implements Stepper + StepperItem |
| `packages/ui/src/components/stepper/stepper.types.ts` | Exists, defines all required types |
| `packages/ui/src/components/stepper/stepper.styles.ts` | Exists, defines CVA variants |
| `packages/ui/src/components/stepper/stepper.test.tsx` | Exists, all tests pass |
| `packages/ui/src/components/stepper/stepper.stories.tsx` | Exists, all stories render |
| `packages/ui/src/components/timeline/timeline.tsx` | Exists, implements Timeline + TimelineItem |
| `packages/ui/src/components/timeline/timeline.types.ts` | Exists, defines all required types |
| `packages/ui/src/components/timeline/timeline.styles.ts` | Exists, defines CVA variants |
| `packages/ui/src/components/timeline/timeline.test.tsx` | Exists, all tests pass |
| `packages/ui/src/components/timeline/timeline.stories.tsx` | Exists, all stories render |
| `packages/ui/src/index.ts` | Contains all required exports |

## Verification Steps

1. **TypeScript check:** Run `pnpm typecheck` across the entire monorepo — must produce zero errors.
2. **Test suite:** Run `pnpm test` across the entire monorepo — must produce zero failures, including all vitest-axe accessibility assertions for both Stepper and Timeline.
3. **Storybook rendering:** Verify Storybook renders both components with autodocs enabled, all stories load without errors, and variant controls work interactively.
4. **Stepper visual verification:** Confirm both horizontal and vertical orientations display correctly with connecting lines aligned between steps.
5. **Timeline visual verification:** Confirm the connecting line is continuous between dots with no gaps.

## Dependencies
- **Task 1 (Stepper Component)**, **Task 2 (Timeline Component)**, and **Task 3 (Export Registration)** must all be complete before this task

## Verification Criteria
1. `pnpm typecheck` — zero errors
2. `pnpm test` — zero failures (including vitest-axe for both components)
3. All 10 component files exist in the correct directories
4. Both components render in Storybook with autodocs and interactive controls
5. Stepper horizontal and vertical orientations display correctly with aligned connecting lines
6. Timeline connecting line is continuous between dots with no visible gaps
7. All phase exit criteria from the phase spec are satisfied