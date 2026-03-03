Now I have all the context needed. The task (t03) is "Integration Verification" — it's about running quality gates. Let me produce the complete specification.

# Task: Integration Verification — Implementation Plan

## 1. Deliverables

This task produces no new source files. It verifies that the artifacts created by Task 1 (Table) and Task 2 (Pagination) pass all quality gates.

| #   | Artifact                | Action | Purpose                                                                   |
| --- | ----------------------- | ------ | ------------------------------------------------------------------------- |
| 1   | TypeScript verification | Run    | Confirm `pnpm typecheck` passes with zero errors                          |
| 2   | Test suite verification | Run    | Confirm `pnpm test` passes with zero failures including vitest-axe checks |
| 3   | Build verification      | Run    | Confirm `pnpm build` succeeds with new components in output               |
| 4   | Storybook verification  | Run    | Confirm Storybook renders all Table and Pagination stories correctly      |
| 5   | Export verification     | Audit  | Confirm `packages/ui/src/index.ts` exports all new components and types   |
| 6   | Bug fixes (if needed)   | Modify | Fix any issues discovered during verification in Task 1/Task 2 files      |

## 2. Dependencies

### Completed Tasks

- **Task 1 (Table Component)** — must be complete. All 5 files exist under `packages/ui/src/components/table/` and exports added to `index.ts`.
- **Task 2 (Pagination Component)** — must be complete. All 5 files exist under `packages/ui/src/components/pagination/` and exports added to `index.ts`.

### Infrastructure

- Monorepo build pipeline (`pnpm`, Turborepo, `tsc --build`) operational
- Storybook 8.5 running with Tailwind v4 theme integration
- Vitest + Testing Library + vitest-axe test infrastructure operational

### Packages

No new packages to install. All dependencies were already present before Task 1 and Task 2:

- `@radix-ui/react-slot` — already installed (used by Table for `asChild`)
- `class-variance-authority` — already installed (used by Pagination for `buttonVariants` composition)
- `@components/utils` — already installed (used by both for `cn()`)

## 3. Implementation Details

### 3.1 TypeScript Verification

**Purpose**: Ensure all new Table and Pagination types compile without errors across the entire `@components/ui` package.

**What to check**:

- All 8 Table prop types (`TableProps`, `TableHeaderProps`, `TableBodyProps`, `TableRowProps`, `TableHeadProps`, `TableCellProps`, `TableCaptionProps`, `TableFooterProps`) extend correct `React.ComponentProps<'element'>` with `{ asChild?: boolean }`
- All 7 Pagination prop types (`PaginationProps`, `PaginationContentProps`, `PaginationItemProps`, `PaginationLinkProps`, `PaginationPreviousProps`, `PaginationNextProps`, `PaginationEllipsisProps`) are correctly typed
- `PaginationLinkProps` correctly uses `Pick<VariantProps<typeof buttonVariants>, 'size'>` without type errors
- All type re-exports in `index.ts` resolve correctly
- No `any` types used anywhere
- No TypeScript errors in test files or story files

**Command**: `pnpm typecheck`

**Pass criteria**: Zero TypeScript errors.

### 3.2 Test Suite Verification

**Purpose**: Confirm all Table and Pagination tests pass, including vitest-axe accessibility checks, and that no existing tests regress.

**What to check**:

- Table tests (`table.test.tsx`): smoke renders for all 8 sub-components, `data-slot` attributes on all sub-components, base styling verification, className merging, ref forwarding, `asChild` rendering, semantic HTML structure (table > thead > tr > th, table > tbody > tr > td), overflow container wrapping, vitest-axe accessibility assertions
- Pagination tests (`pagination.test.tsx`): smoke render of composed pagination, `<nav>` with `aria-label="pagination"`, `<ul>` structure, PaginationLink as `<a>` by default, `isActive` styling and `aria-current`, `asChild` rendering, PaginationPrevious/Next aria-labels, chevron SVG icons, PaginationEllipsis `aria-hidden` and sr-only label, `data-slot` attributes, className merging, vitest-axe accessibility assertions
- All pre-existing component tests continue to pass (no regressions)

**Command**: `pnpm test`

**Pass criteria**: Zero test failures across the entire test suite.

### 3.3 Build Verification

**Purpose**: Confirm the `@components/ui` package builds successfully and includes the new Table and Pagination components in the compiled output.

**What to check**:

- `tsc --build` completes without errors
- `dist/` output includes compiled files for `components/table/table.js`, `components/table/table.d.ts`, `components/table/table.types.d.ts`, `components/table/table.styles.js`, `components/table/table.styles.d.ts`
- `dist/` output includes compiled files for `components/pagination/pagination.js`, `components/pagination/pagination.d.ts`, `components/pagination/pagination.types.d.ts`, `components/pagination/pagination.styles.js`, `components/pagination/pagination.styles.d.ts`
- `dist/index.js` and `dist/index.d.ts` include all new exports

**Command**: `pnpm build`

**Pass criteria**: Build completes with exit code 0 and all expected files exist in `dist/`.

### 3.4 Storybook Verification

**Purpose**: Confirm all Table and Pagination stories render correctly with autodocs.

**What to check**:

- Table stories render: Default, WithCaption, WithFooter, Striped, Empty
- Pagination stories render: Default, WithEllipsis, FirstPage, LastPage, AsChild
- Autodocs generate proper documentation for both components (via `tags: ['autodocs']`)
- Stories are interactive — table rows display data, pagination links are clickable
- No console errors in the browser during rendering

**Command**: `pnpm storybook` (manual verification in browser at `localhost:6006`)

**Pass criteria**: All 10 stories (5 Table + 5 Pagination) render without errors and display correct content.

### 3.5 Export Verification

**Purpose**: Confirm `packages/ui/src/index.ts` exports all new components, types, and style functions.

**Expected Table exports** (already present based on current `index.ts`):

- Components: `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`, `TableFooter`
- Types: `TableProps`, `TableHeaderProps`, `TableBodyProps`, `TableRowProps`, `TableHeadProps`, `TableCellProps`, `TableCaptionProps`, `TableFooterProps`
- Note: Table uses static string styles (not CVA), so no variant function is exported — this follows the Card precedent

**Expected Pagination exports** (already present based on current `index.ts`):

- Components: `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`, `PaginationNext`, `PaginationEllipsis`
- Types: `PaginationProps`, `PaginationContentProps`, `PaginationItemProps`, `PaginationLinkProps`, `PaginationPreviousProps`, `PaginationNextProps`, `PaginationEllipsisProps`
- Note: Pagination uses `buttonVariants` from the Button component directly (no `paginationLinkVariants` CVA was created), and static string styles that are not exported from `index.ts`

**Verification method**: Read `packages/ui/src/index.ts` and confirm all exports listed above are present.

**Pass criteria**: All components and types listed above are exported.

### 3.6 Bug Fixes

If any verification step fails, diagnose and fix the issue in the relevant Task 1 or Task 2 source files. Common potential issues:

- **TypeScript errors**: Mismatched prop types, missing `import type` annotations, incorrect `React.ComponentProps` generic arguments
- **Test failures**: Incorrect `data-slot` values, missing className in assertions, axe violations from missing ARIA attributes
- **Build failures**: Incorrect import paths (missing `.js` extensions), circular dependencies
- **Storybook errors**: Missing story metadata, incorrect `render` function props

After each fix, re-run the failing verification command to confirm the fix resolves the issue.

## 4. API Contracts

N/A — This task does not create new API surface. It verifies the API surfaces created by Task 1 and Task 2.

## 5. Test Plan

This task is itself a verification task. The "tests" are the verification steps described in Section 3.

| #   | Verification Step | Command/Method             | Pass Criteria                                 |
| --- | ----------------- | -------------------------- | --------------------------------------------- |
| 1   | TypeScript check  | `pnpm typecheck`           | Zero errors                                   |
| 2   | Test suite        | `pnpm test`                | Zero failures, all vitest-axe assertions pass |
| 3   | Build             | `pnpm build`               | Exit code 0, all expected files in `dist/`    |
| 4   | Storybook         | `pnpm storybook` + browser | All 10 stories render, autodocs generate      |
| 5   | Export audit      | Read `index.ts`            | All 15 components + 15 types exported         |
| 6   | Regression check  | `pnpm test` (full suite)   | All pre-existing tests continue to pass       |

## 6. Implementation Order

1. **Audit exports** — Read `packages/ui/src/index.ts` and verify all Table and Pagination exports are present. If any are missing, add them.
2. **Run `pnpm typecheck`** — Fix any TypeScript errors found. Re-run until zero errors.
3. **Run `pnpm test`** — Fix any test failures found. Re-run until zero failures.
4. **Run `pnpm build`** — Fix any build errors found. Verify `dist/` output contains the expected files. Re-run until clean build.
5. **Run `pnpm storybook`** — Open browser and verify all 10 stories render correctly with autodocs. Fix any rendering issues.
6. **Final pass** — Re-run `pnpm typecheck && pnpm test && pnpm build` to confirm everything passes after any fixes applied.

## 7. Verification Commands

```bash
# 1. TypeScript type checking (from monorepo root)
pnpm typecheck

# 2. Run full test suite
pnpm test

# 3. Build the UI package
pnpm build

# 4. Launch Storybook for manual verification
pnpm storybook

# 5. Verify dist output exists after build (Table)
ls packages/ui/dist/components/table/

# 6. Verify dist output exists after build (Pagination)
ls packages/ui/dist/components/pagination/

# 7. Combined verification (typecheck + test + build in sequence)
pnpm typecheck && pnpm test && pnpm build
```

## 8. Design Deviations

**Deviation 1: No `paginationLinkVariants` CVA export**

- **Parent spec requires**: The phase spec's Task 2 description mentions "`paginationLinkVariants` CVA in its styles file that composes `buttonVariants`" and the task spec's export verification mentions "Style exports: `paginationLinkVariants`".
- **Why the actual implementation differs**: Task 2 (completed) implemented PaginationLink by importing `buttonVariants` directly from `../button/button.styles.js` and applying it inline in the component, rather than creating a separate `paginationLinkVariants` CVA wrapper. The `pagination.styles.ts` file exports only static string constants (`paginationStyles`, `paginationContentStyles`, `paginationItemStyles`).
- **Why this is acceptable**: The current implementation achieves the same visual result — PaginationLink uses `buttonVariants` with `variant: isActive ? 'default' : 'outline'` and a configurable `size` prop. Creating a wrapper CVA would add indirection without functional benefit. The `isActive` toggle between `default` and `outline` button variants is handled directly in the component's JSX, which is simpler and more readable. No `paginationLinkVariants` export is needed in `index.ts`.

**Deviation 2: No separate table style constant exports from `index.ts`**

- **Parent spec mentions**: The task spec's export verification says "and any table style constants if exported".
- **Why not exported**: Table styles are static string constants (following the Card component precedent), not CVA variant functions. The existing codebase convention only exports CVA variant functions (e.g., `buttonVariants`, `badgeVariants`, `inputVariants`) from `index.ts`, not static string constants. Card's style constants are similarly not exported from `index.ts`. Exporting plain strings provides no consumer value since they aren't composable.
- **Alternative chosen**: Table style constants remain importable via deep import (`@components/ui/components/table/table.styles.js`) for any consumer that needs them, but they are not part of the public API barrel.
