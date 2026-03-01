# Task 4: Milestone 1 Completion Verification

## Objective

Verify that all 13 Milestone 1 components (across all 3 phases) are fully implemented, tested, type-safe, documented in Storybook, and exported from the public API. This is the final quality gate before closing Milestone 1.

## Deliverables

- Run `pnpm test` across the full `packages/ui` workspace and confirm zero failures for all 13 Milestone 1 components
- Run `pnpm typecheck` across the monorepo and confirm zero errors
- Verify all 13 components render in Storybook (`pnpm storybook`) with autodocs
- Verify `packages/ui/src/index.ts` exports all 13 components, their props types, and their CVA variant functions (where applicable)

## Components to Verify (all 13)

### Phase 1 — Display Primitives (6 components)

1. Separator
2. Badge
3. Card (with CardHeader, CardContent, CardFooter, CardTitle, CardDescription)
4. Skeleton
5. Spinner
6. Alert (with AlertTitle, AlertDescription)

### Phase 2 — Overlay Primitives (4 components)

7. Dialog (with DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose)
8. Alert Dialog (with AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel)
9. Popover (with PopoverTrigger, PopoverContent)
10. Sonner (Toaster component)

### Phase 3 — Accessibility Primitives (3 components)

11. Label
12. Visually Hidden
13. Collapsible (with CollapsibleTrigger, CollapsibleContent)

## Verification Checklist

1. **Tests**: `pnpm test` passes with zero failures — all 13 components have passing test suites including vitest-axe accessibility assertions
2. **Type checking**: `pnpm typecheck` passes with zero errors across the entire monorepo
3. **Storybook**: All 13 components render in Storybook with all variants, sizes, and states documented via CSF3 stories with `tags: ['autodocs']`
4. **Exports**: `packages/ui/src/index.ts` exports all 13 components, their sub-components, their props types, and their CVA variant functions (where applicable)
5. **Milestone Exit Criteria**:
   - Dialog and Alert Dialog correctly trap focus and support ESC to close
   - Popover positions content relative to trigger and closes on outside click
   - Sonner toast renders with theme-appropriate colors in both light and dark mode
   - All components use semantic tokens from `globals.css`

## Dependencies

- **Tasks 0–3** in this phase must all be completed first
- **Phase 1** (Display Primitives) — previously completed
- **Phase 2** (Overlay Primitives) — previously completed

## Verification Criteria

1. `pnpm test` exits with code 0 and all test suites pass
2. `pnpm typecheck` exits with code 0
3. All 13 component directories exist under `packages/ui/src/components/` with all 5 required files each
4. `packages/ui/src/index.ts` contains export statements for all 13 components and their associated types
5. Storybook builds and renders without errors (`pnpm storybook`)
6. No regressions in previously completed Phase 1 and Phase 2 components
