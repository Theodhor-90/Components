Now I have all the context. The feedback is very specific: fix the test count headers in Section 5. EmptyState header says "10 tests" but the table has 11 rows; SearchInput header says "14 tests" but the table has 15 rows. Let me produce the revised plan with those headers corrected.

## 1. Deliverables

| # | File | Action | Purpose |
|---|------|--------|---------|
| 1 | `packages/ui/src/index.ts` | Verify (no-op) | Confirm EmptyState and SearchInput exports are already present from t01–t04 |

**Note:** Tasks t01 through t04 have already added all component files (types, styles, implementation, tests, stories) and their corresponding export lines to `packages/ui/src/index.ts`. This task performs no file creation or modification — it is a verification-only task that confirms integration correctness across typecheck, tests, and Storybook.

## 2. Dependencies

### Prerequisites

- **Task t01** (Empty State — Implementation): Complete. Files exist at `packages/ui/src/components/empty-state/`.
- **Task t02** (Empty State — Tests & Stories): Complete. Test and story files exist.
- **Task t03** (Search Input — Implementation): Complete. Files exist at `packages/ui/src/components/search-input/`.
- **Task t04** (Search Input — Tests & Stories): Complete. Test and story files exist.

### Packages to Install

None. All dependencies are already installed.

### Export State

The following export lines are already present in `packages/ui/src/index.ts` (lines 342–356):

```ts
export { EmptyState, type EmptyStateProps } from './components/empty-state/empty-state.js';
export {
  emptyStateStyles,
  emptyStateIconStyles,
  emptyStateTitleStyles,
  emptyStateDescriptionStyles,
  emptyStateActionStyles,
} from './components/empty-state/empty-state.styles.js';
export { SearchInput, type SearchInputProps } from './components/search-input/search-input.js';
export {
  searchInputContainerStyles,
  searchInputIconStyles,
  searchInputClearStyles,
  searchInputFieldStyles,
} from './components/search-input/search-input.styles.js';
```

## 3. Implementation Details

This task has no implementation work — it is purely a verification task. The implementation agent must:

### Step 1: Verify export presence in `packages/ui/src/index.ts`

Confirm that **all** of the following named exports exist in the file:

**From EmptyState:**
- `EmptyState` (component)
- `EmptyStateProps` (type)
- `emptyStateStyles` (style constant)
- `emptyStateIconStyles` (style constant)
- `emptyStateTitleStyles` (style constant)
- `emptyStateDescriptionStyles` (style constant)
- `emptyStateActionStyles` (style constant)

**From SearchInput:**
- `SearchInput` (component)
- `SearchInputProps` (type)
- `searchInputContainerStyles` (style constant)
- `searchInputIconStyles` (style constant)
- `searchInputClearStyles` (style constant)
- `searchInputFieldStyles` (style constant)

### Step 2: Run TypeScript type checking

Run `pnpm typecheck` from the repository root. This executes `turbo run typecheck`, which runs `tsc --noEmit` in the `@components/ui` package. The command must exit with code 0 and produce no errors.

### Step 3: Run test suite

Run `pnpm test` from the repository root. This executes `turbo run test`, which runs `vitest run` in all packages. All tests — including the new EmptyState and SearchInput test suites — must pass with zero failures.

### Step 4: Verify Storybook renders (manual/visual)

Run `pnpm storybook` to launch Storybook and verify both components appear in the sidebar under `Components/EmptyState` and `Components/SearchInput` with all their stories visible and autodocs generated.

**If any verification step fails**, the implementation agent must diagnose the root cause and fix it. Possible issues include:
- Missing or mismatched export names in `index.ts`
- TypeScript errors from type mismatches between component files
- Test failures from broken component logic
- Import path issues (must use `.js` extensions for ESM compatibility)

## 4. API Contracts

N/A — This task does not introduce any new API surface. It verifies the existing exports from t01–t04 are correctly integrated.

## 5. Test Plan

No new tests are created in this task. The verification runs the existing test suites:

### EmptyState tests (`empty-state.test.tsx` — 11 tests)
| # | Test | Expected |
|---|------|----------|
| 1 | Renders with only required title prop | `<h3>` with title text present |
| 2 | Has `data-slot="empty-state"` on root | Root div has correct data attribute |
| 3 | Renders icon when provided | SVG and icon wrapper present |
| 4 | No icon wrapper when absent | `[data-slot="empty-state-icon"]` is null |
| 5 | Renders description when provided | `<p>` with description text |
| 6 | No description when absent | `[data-slot="empty-state-description"]` is null |
| 7 | Renders action when provided | Button and action wrapper present |
| 8 | No action wrapper when absent | `[data-slot="empty-state-action"]` is null |
| 9 | Merges custom className | Root has both base and custom classes |
| 10 | Forwards ref to root div | ref.current is HTMLDivElement |
| 11 | No accessibility violations | vitest-axe returns no violations |

### SearchInput tests (`search-input.test.tsx` — 15 tests)
| # | Test | Expected |
|---|------|----------|
| 1 | Renders without crashing | Searchbox role present |
| 2 | Has `data-slot` on root | `[data-slot="search-input"]` present |
| 3 | Renders search icon | SVG with `aria-hidden="true"` present |
| 4 | Hides clear button when empty | No "Clear search" button |
| 5 | Shows clear button with value | "Clear search" button visible |
| 6 | Calls `onSearch` on Enter | `onSearch` called with current value |
| 7 | Calls `onClear` on clear click | `onClear` called once |
| 8 | Clears input value on clear | Input value is empty string |
| 9 | Refocuses input after clear | Input has focus |
| 10 | Controlled mode | Value reflects prop, onChange fires |
| 11 | Uncontrolled mode | Typing updates displayed value |
| 12 | Forwards ref to input | ref.current is HTMLInputElement with type="search" |
| 13 | Merges className onto container | Container has custom class |
| 14 | Passes placeholder through | Placeholder text present |
| 15 | No accessibility violations | vitest-axe returns no violations |

## 6. Implementation Order

1. **Verify exports** — Read `packages/ui/src/index.ts` and confirm all EmptyState and SearchInput exports (components, types, style constants) are present and correctly formatted
2. **Run `pnpm typecheck`** — Must pass with zero errors
3. **Run `pnpm test`** — Must pass with zero failures across all packages
4. **Fix any failures** — If typecheck or tests fail, diagnose and fix the issue in the relevant file(s)
5. **Re-verify after fixes** — Re-run typecheck and tests to confirm green status
6. **Verify Storybook** — Run `pnpm storybook` and confirm both components render with all stories and autodocs

## 7. Verification Commands

```bash
# 1. Verify exports are present in index.ts (quick grep check)
grep -n "EmptyState\|SearchInput" packages/ui/src/index.ts

# 2. TypeScript type checking (must exit 0)
pnpm typecheck

# 3. Run full test suite (must exit 0 with all tests passing)
pnpm test

# 4. Run only EmptyState and SearchInput tests for faster iteration
pnpm --filter @components/ui test -- --reporter=verbose empty-state search-input

# 5. Launch Storybook for visual verification (manual check)
pnpm storybook
```

## 8. Design Deviations

None.