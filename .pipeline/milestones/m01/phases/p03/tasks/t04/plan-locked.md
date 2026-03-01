Now I have all the context needed. Let me produce the implementation plan.

# Task 4: Milestone 1 Completion Verification — Implementation Plan

## 1. Deliverables

This task produces no new source files. It is a verification-only task that validates the completeness and correctness of all 13 Milestone 1 components across all 3 phases.

| Deliverable                                | Action | Purpose                                                                                                                         |
| ------------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Test suite validation                      | Run    | Confirm all 13 component test suites pass with zero failures, including vitest-axe accessibility assertions                     |
| Type checking validation                   | Run    | Confirm `pnpm typecheck` passes with zero errors across the full monorepo                                                       |
| Export audit of `packages/ui/src/index.ts` | Verify | Confirm all 13 components, their sub-components, props types, and CVA variant functions are exported                            |
| Storybook rendering validation             | Run    | Confirm all 13 components render in Storybook with `tags: ['autodocs']`                                                         |
| Component file completeness audit          | Verify | Confirm each component directory contains all 5 required files (`.tsx`, `.styles.ts`, `.types.ts`, `.test.tsx`, `.stories.tsx`) |

## 2. Dependencies

- **Tasks 0–3 of Phase 3** must all be completed (they are)
- **Phase 1 (Display Primitives)** must be completed (it is)
- **Phase 2 (Overlay Primitives)** must be completed (it is)
- No new packages to install

## 3. Implementation Details

### 3.1 Component File Completeness Audit

Verify that each of the 13 component directories under `packages/ui/src/components/` contains exactly 5 files matching the `{name}.{suffix}` pattern:

**Phase 1 — Display Primitives (6 components):**

1. `separator/` — `separator.tsx`, `separator.styles.ts`, `separator.types.ts`, `separator.test.tsx`, `separator.stories.tsx`
2. `badge/` — `badge.tsx`, `badge.styles.ts`, `badge.types.ts`, `badge.test.tsx`, `badge.stories.tsx`
3. `card/` — `card.tsx`, `card.styles.ts`, `card.types.ts`, `card.test.tsx`, `card.stories.tsx`
4. `skeleton/` — `skeleton.tsx`, `skeleton.styles.ts`, `skeleton.types.ts`, `skeleton.test.tsx`, `skeleton.stories.tsx`
5. `spinner/` — `spinner.tsx`, `spinner.styles.ts`, `spinner.types.ts`, `spinner.test.tsx`, `spinner.stories.tsx`
6. `alert/` — `alert.tsx`, `alert.styles.ts`, `alert.types.ts`, `alert.test.tsx`, `alert.stories.tsx`

**Phase 2 — Overlay Primitives (4 components):** 7. `dialog/` — `dialog.tsx`, `dialog.styles.ts`, `dialog.types.ts`, `dialog.test.tsx`, `dialog.stories.tsx` 8. `alert-dialog/` — `alert-dialog.tsx`, `alert-dialog.styles.ts`, `alert-dialog.types.ts`, `alert-dialog.test.tsx`, `alert-dialog.stories.tsx` 9. `popover/` — `popover.tsx`, `popover.styles.ts`, `popover.types.ts`, `popover.test.tsx`, `popover.stories.tsx` 10. `sonner/` — `sonner.tsx`, `sonner.styles.ts`, `sonner.types.ts`, `sonner.test.tsx`, `sonner.stories.tsx`

**Phase 3 — Accessibility Primitives (3 components):** 11. `label/` — `label.tsx`, `label.styles.ts`, `label.types.ts`, `label.test.tsx`, `label.stories.tsx` 12. `visually-hidden/` — `visually-hidden.tsx`, `visually-hidden.styles.ts`, `visually-hidden.types.ts`, `visually-hidden.test.tsx`, `visually-hidden.stories.tsx` 13. `collapsible/` — `collapsible.tsx`, `collapsible.styles.ts`, `collapsible.types.ts`, `collapsible.test.tsx`, `collapsible.stories.tsx`

For each directory, verify the 5 files exist. Report any missing files.

### 3.2 Export Audit of `packages/ui/src/index.ts`

Verify that `packages/ui/src/index.ts` exports the following for each component:

| Component      | Expected Exports                                                                                                                                                                                                                                                             |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button         | `Button`, `ButtonProps`, `buttonVariants`                                                                                                                                                                                                                                    |
| Separator      | `Separator`, `SeparatorProps`, `separatorVariants`                                                                                                                                                                                                                           |
| Badge          | `Badge`, `BadgeProps`, `badgeVariants`                                                                                                                                                                                                                                       |
| Card           | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `CardProps`, `CardHeaderProps`, `CardTitleProps`, `CardDescriptionProps`, `CardContentProps`, `CardFooterProps`                                                                           |
| Skeleton       | `Skeleton`, `SkeletonProps`                                                                                                                                                                                                                                                  |
| Spinner        | `Spinner`, `SpinnerProps`, `spinnerVariants`                                                                                                                                                                                                                                 |
| Alert          | `Alert`, `AlertTitle`, `AlertDescription`, `AlertProps`, `AlertTitleProps`, `AlertDescriptionProps`, `alertVariants`                                                                                                                                                         |
| Dialog         | `Dialog`, `DialogTrigger`, `DialogPortal`, `DialogOverlay`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`, `DialogClose`, and all corresponding `*Props` types                                                                         |
| AlertDialog    | `AlertDialog`, `AlertDialogTrigger`, `AlertDialogPortal`, `AlertDialogOverlay`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogFooter`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogAction`, `AlertDialogCancel`, and all corresponding `*Props` types |
| Popover        | `Popover`, `PopoverTrigger`, `PopoverContent`, `PopoverProps`, `PopoverTriggerProps`, `PopoverContentProps`                                                                                                                                                                  |
| Sonner         | `Toaster`, `toast`, `ToasterProps`                                                                                                                                                                                                                                           |
| Label          | `Label`, `LabelProps`, `labelVariants`                                                                                                                                                                                                                                       |
| VisuallyHidden | `VisuallyHidden`, `VisuallyHiddenProps`                                                                                                                                                                                                                                      |
| Collapsible    | `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`, `CollapsibleProps`, `CollapsibleTriggerProps`, `CollapsibleContentProps`                                                                                                                                          |

### 3.3 Test Suite Validation

Run `pnpm test` from the repository root. This invokes `turbo run test`, which runs `vitest run` in `packages/ui`. All 13 test suites must pass with zero failures. Each test suite includes at minimum:

- Smoke render test
- `data-slot` attribute test
- `className` merging test
- vitest-axe accessibility test (`expect(results).toHaveNoViolations()`)

### 3.4 Type Checking Validation

Run `pnpm typecheck` from the repository root. This invokes `turbo run typecheck`, which runs `tsc --noEmit` across all packages. Must exit with code 0 and zero errors.

### 3.5 Storybook Rendering Validation

Run `pnpm storybook` from the repository root. Verify:

- Storybook starts without build errors
- All 13 components appear in the sidebar under `Components/`
- Each component's autodocs page renders (due to `tags: ['autodocs']` in meta)
- Stories render interactively without console errors

### 3.6 Milestone Exit Criteria Spot-Checks

After the automated checks pass, manually verify (or confirm via test coverage) the following behavioral requirements from the Milestone 1 exit criteria:

1. **Dialog & Alert Dialog** — Focus trap and ESC-to-close behavior (covered by their `.test.tsx` files)
2. **Popover** — Positions content relative to trigger, closes on outside click (covered by `.test.tsx`)
3. **Sonner** — Theme-aware styling in light/dark mode (covered by `.test.tsx` and `.stories.tsx`)
4. **Label** — `htmlFor` binding, peer-disabled styling (covered by `.test.tsx`)
5. **Visually Hidden** — Content in DOM but visually hidden, screen reader accessible (covered by `.test.tsx`)
6. **Collapsible** — Toggle on click, controlled/uncontrolled modes, keyboard activation (covered by `.test.tsx`)

### 3.7 Remediation

If any check fails:

1. Identify the failing component and specific failure
2. Fix the issue in the component source file(s)
3. Re-run the failing verification command
4. Repeat until all checks pass

**Potential issues to watch for:**

- Missing exports in `index.ts` (e.g., a CVA variant function or sub-component type not exported)
- Axe violations from missing ARIA attributes or improper heading hierarchy in test fixtures
- TypeScript errors from mismatched Radix primitive type versions
- Storybook build errors from incorrect import paths (`.js` extension required for ESM)

## 4. API Contracts

N/A — This task does not create or modify any API surface. It only verifies the existing API surface established by Tasks 0–3 and Phases 1–2.

## 5. Test Plan

This task IS the test plan. No new tests are written. The verification validates:

### 5.1 Test Execution (`pnpm test`)

| Test Suite                 | Expected Tests                                                                                                          | Key Assertions                                    |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `separator.test.tsx`       | Smoke, orientation variants, data-slot, className merge, a11y                                                           | `role="separator"`, `aria-orientation`            |
| `badge.test.tsx`           | Smoke, all 4 variants, data-slot, className merge, a11y                                                                 | Variant-specific classes applied                  |
| `card.test.tsx`            | Smoke per sub-component, data-slot on each, className merge, a11y                                                       | All 6 sub-components render                       |
| `skeleton.test.tsx`        | Smoke, animate-pulse class, data-slot, className merge, a11y                                                            | `animate-pulse` applied                           |
| `spinner.test.tsx`         | Smoke, size variants (sm/md/lg), data-slot, className merge, a11y                                                       | SVG element rendered, size classes                |
| `alert.test.tsx`           | Smoke, default/destructive variants, sub-components, data-slot, a11y                                                    | `role="alert"` present                            |
| `dialog.test.tsx`          | Smoke, open/close, focus trap, ESC dismiss, data-slot, a11y                                                             | Focus trapped within dialog                       |
| `alert-dialog.test.tsx`    | Smoke, open/close, no backdrop dismiss, action/cancel, a11y                                                             | `role="alertdialog"` present                      |
| `popover.test.tsx`         | Smoke, open/close on click, outside click dismiss, data-slot, a11y                                                      | Popover content visible on trigger click          |
| `sonner.test.tsx`          | Smoke, theme-aware rendering, data-slot, a11y                                                                           | Toaster renders                                   |
| `label.test.tsx`           | Smoke, `<label>` element, htmlFor, data-slot, asChild, CVA classes, className merge, a11y                               | `for` attribute binding                           |
| `visually-hidden.test.tsx` | Smoke, inline styles for hiding, screen reader accessible, data-slot, asChild, a11y                                     | `position: absolute`, `overflow: hidden` in style |
| `collapsible.test.tsx`     | Smoke (collapsed), toggle click, defaultOpen, controlled mode, keyboard (Enter/Space), data-slot, className merge, a11y | Content visibility toggles                        |

### 5.2 Type Checking (`pnpm typecheck`)

- `tsc --noEmit` across all packages
- Zero errors expected
- Validates all import/export chains, Radix primitive type extensions, CVA VariantProps intersections

### 5.3 Storybook Validation (`pnpm storybook`)

- All 13 components appear in sidebar
- Autodocs pages generate without errors
- Stories render interactively

## 6. Implementation Order

1. **Step 1: File completeness audit** — Run shell commands to verify all 13 component directories contain their 5 required files. This catches missing files before running tests/typecheck.

2. **Step 2: Export audit** — Read `packages/ui/src/index.ts` and verify against the expected export list from Section 3.2. This catches missing public API exports before consumers try to use them.

3. **Step 3: Run `pnpm typecheck`** — Type-check the entire monorepo. Fix any TypeScript errors before proceeding to tests, since type errors can cause confusing test failures.

4. **Step 4: Run `pnpm test`** — Execute all test suites. If any fail, diagnose and fix the issue, then re-run. This is the primary quality gate.

5. **Step 5: Run `pnpm storybook`** — Launch Storybook and verify all 13 components render with autodocs. Check for console errors.

6. **Step 6: Spot-check milestone exit criteria** — Review test output and stories to confirm Dialog/AlertDialog focus trap, Popover positioning, Sonner theming, and Phase 3 component behaviors are all covered.

## 7. Verification Commands

All commands are run from the monorepo root (`/Users/theodhor/Desktop/Portfolio/Components`).

```bash
# Step 1: File completeness audit — verify 5 files per component
for component in separator badge card skeleton spinner alert dialog alert-dialog popover sonner label visually-hidden collapsible; do
  echo "=== $component ==="
  ls "packages/ui/src/components/$component/"
done

# Step 2: Export audit — check index.ts contains all expected component exports
grep -c "export" packages/ui/src/index.ts

# Step 3: Type checking
pnpm typecheck

# Step 4: Run all tests
pnpm test

# Step 5: Launch Storybook (manual visual verification)
pnpm storybook

# Step 6: Run tests with coverage to confirm all components are covered
pnpm test:coverage
```

## 8. Design Deviations

None.

This is a verification-only task that validates existing implementations — it does not introduce any new code or architectural decisions that could deviate from the parent specs.
