Now I have all the context needed. Here is the complete specification:

## 1. Deliverables

This is a verification-only task — no new component code should be created. The deliverables are verification results and targeted fixes to any failures found.

| # | File | Action | Purpose |
|---|------|--------|---------|
| 1 | N/A (monorepo-wide) | Verify | Run `pnpm typecheck` — fix any TypeScript errors in `packages/ui/src/components/combobox/` and `packages/ui/src/components/color-picker/` files |
| 2 | N/A (monorepo-wide) | Verify | Run `pnpm test` — ensure all tests pass including combobox, color-picker, and all existing component tests |
| 3 | N/A (monorepo-wide) | Verify | Run `pnpm lint` — fix any ESLint errors in new combobox and color-picker files |
| 4 | N/A (Storybook) | Verify | Run `pnpm storybook` — confirm both Combobox and Color Picker render with all stories and autodocs |
| 5 | `packages/ui/src/index.ts` | Verify | Confirm all 5 exports are present: `Combobox`, `ComboboxProps`, `ComboboxOption`, `ColorPicker`, `ColorPickerProps` |
| 6 | Existing test suites | Verify | Confirm no regressions in any prior component tests (M1 through M5/P2) |

If any verification step fails, the corresponding source files will be modified to fix the issue. Potential fix targets:

| File | Condition |
|------|-----------|
| `packages/ui/src/components/combobox/combobox.tsx` | TypeScript errors, lint violations, or test failures related to the Combobox component |
| `packages/ui/src/components/combobox/combobox.types.ts` | Type errors affecting the Combobox |
| `packages/ui/src/components/combobox/combobox.styles.ts` | Lint violations in the styles file |
| `packages/ui/src/components/combobox/combobox.test.tsx` | Test failures in the Combobox test suite |
| `packages/ui/src/components/combobox/combobox.stories.tsx` | Storybook rendering issues |
| `packages/ui/src/components/color-picker/color-picker.tsx` | TypeScript errors, lint violations, or test failures related to the Color Picker component |
| `packages/ui/src/components/color-picker/color-picker.types.ts` | Type errors affecting the Color Picker |
| `packages/ui/src/components/color-picker/color-picker.styles.ts` | Lint violations in the styles file |
| `packages/ui/src/components/color-picker/color-picker.test.tsx` | Test failures in the Color Picker test suite |
| `packages/ui/src/components/color-picker/color-picker.stories.tsx` | Storybook rendering issues |
| `packages/ui/src/index.ts` | Missing or incorrect exports |

## 2. Dependencies

### Prerequisites

All three sibling tasks must be complete before this task can run:

- **Task t01** (Combobox — Single-Select Mode) — completed
- **Task t02** (Combobox — Multi-Select and Create-Option) — completed
- **Task t03** (Color Picker — Core Implementation) — completed

### Packages

No new packages to install. All dependencies are already present in `packages/ui/package.json`:

- `cmdk` ^1.1.1 — used by Combobox via Command
- `@radix-ui/react-popover` — used by both Combobox and Color Picker
- `@components/hooks` (workspace) — `useControllableState` used by both components

### Tools

- Node.js >= 22 (per root `package.json` engines)
- pnpm 9.15.4 (per root `package.json` packageManager)
- Turborepo (orchestrates monorepo commands)
- Vitest (test runner)
- TypeScript (type checking)
- ESLint (linting)
- Storybook 8.5 (visual verification)

## 3. Implementation Details

### Step 1: TypeScript Verification (`pnpm typecheck`)

**Purpose:** Confirm all new and existing TypeScript compiles without errors across the entire monorepo.

**Key checks:**
- `combobox.types.ts` discriminated union (`ComboboxSingleProps | ComboboxMultipleProps`) resolves cleanly
- `combobox.tsx` — type assertions for `valueProp as string[]` and `onValueChange as ((v: string[]) => void)` are safe within their discriminated branches
- `color-picker.types.ts` — `ColorPickerProps` is a simple object type with optional fields, should have no issues
- `color-picker.tsx` — `useControllableState<string | undefined>` generic matches `onValueChange?: (value: string | undefined) => void`
- `index.ts` — all named exports match actual export names in the component files:
  - `Combobox`, `ComboboxProps`, `ComboboxOption` from `./components/combobox/combobox.js`
  - `ColorPicker`, `ColorPickerProps` from `./components/color-picker/color-picker.js`

**Potential issues:**
- The Combobox uses `as` type assertions for the discriminated union props. If `useControllableState`'s generic parameter doesn't align with the callback type, there could be errors. The current code casts at the call site, which should be safe.
- If `useControllableState`'s `onChange` parameter type is `((value: T) => void) | undefined` and Color Picker passes `onValueChange?: (value: string | undefined) => void`, the generic `T = string | undefined` must match. Check that the hook's signature permits `undefined` in the generic.

**Fix approach:** If type errors are found, adjust the type assertions or generic parameters in the component files. Do not modify the `useControllableState` hook itself.

### Step 2: Test Suite Verification (`pnpm test`)

**Purpose:** Ensure all 298+ tests pass across the entire monorepo with zero failures.

**Combobox tests to pass (19 tests in `combobox.test.tsx`):**

Single-select tests:
1. `renders without crashing` — smoke render, expects `role="combobox"` in DOM
2. `renders default placeholder when no value` — "Select..." with `text-muted-foreground` class
3. `opens popover on trigger click` — clicks trigger, expects `[data-slot="command"]` in DOM
4. `filters options as user types` — types "app", expects only "Apple" visible
5. `selects an option and closes popover` — clicks "Banana", popover closes, trigger shows "Banana"
6. `displays selected option label in trigger` — `defaultValue="banana"`, trigger shows "Banana"
7. `supports controlled mode` — `value="apple"`, select "Banana" calls `onValueChange("banana")`, trigger still shows "Apple"
8. `supports uncontrolled mode` — `defaultValue="cherry"`, trigger shows "Cherry"
9. `disabled state prevents opening` — trigger is disabled, click doesn't open popover
10. `renders custom placeholder` — `placeholder="Choose fruit..."` renders
11. `passes custom searchPlaceholder to CommandInput` — `searchPlaceholder="Find..."` appears
12. `shows custom emptyMessage when no matches` — type "xyz", "Nothing here" appears
13. `has no accessibility violations` — axe check on closed state

Multi-select tests:
14. `multi-select toggles items` — select Apple (check visible), deselect (check hidden)
15. `multi-select trigger shows single label for one selection` — `defaultValue={['apple']}` → "Apple"
16. `multi-select trigger shows count for multiple selections` — `defaultValue={['apple', 'banana']}` → "2 selected"
17. `multi-select popover stays open after selection` — command still in DOM after clicking option
18. `multi-select onValueChange fires with array` — callback receives `['apple']`
19. `has no accessibility violations (multi)` — axe check on multi mode

Create-option tests:
20. `create-option appears for unmatched input` — type "Mango", "Create Mango" visible
21. `create-option callback fires with typed value` — click "Create Mango", callback receives "Mango"
22. `create-option hidden when options match` — type "Apple", no "Create Apple" in DOM
23. `create-option not shown when onCreateOption not provided` — type "xyz", no "Create xyz"
24. `create-option clears search after creation` — click "Create Mango", search input value is ""
25. `multi-select with create-option works together` — multi mode + create, callback fires

**Color Picker tests to pass (13 tests in `color-picker.test.tsx`):**

1. `renders without crashing` — button in DOM
2. `renders default placeholder when no value` — "Pick a color" with `text-muted-foreground`
3. `opens popover on trigger click` — `[data-slot="popover-content"]` in DOM
4. `clicking preset swatch sets value` — click "red", trigger shows "#ef4444"
5. `hex input updates value in real time` — type "ff0000", trigger shows "#ff0000", preview has backgroundColor
6. `hex input rejects invalid characters` — type "gg", input doesn't contain "g"
7. `preview swatch reflects current value` — `defaultValue="#3b82f6"`, preview has backgroundColor
8. `trigger shows selected color swatch and hex text` — `defaultValue="#ef4444"`, trigger has text and swatch
9. `controlled mode works` — `value="#ef4444"`, click blue, callback called with "#3b82f6", trigger still shows "#ef4444"
10. `uncontrolled mode works` — `defaultValue="#3b82f6"`, trigger shows "#3b82f6"
11. `disabled state prevents opening` — trigger disabled, click doesn't open
12. `palette swatches are focusable buttons` — 22 `<button>` elements with `aria-label` in popover
13. `has data-slot attribute` — `[data-slot="color-picker"]` in DOM
14. `has no accessibility violations` — axe check

**Existing component tests:** All tests from M1 (Button, Separator, Badge, Card, Skeleton, Spinner, Alert, Dialog, AlertDialog, Popover, Sonner, Label, VisuallyHidden, Collapsible), M2 (Input, Textarea, Checkbox, Switch, RadioGroup, Toggle, ToggleGroup, Select, Slider, Form), M3 (Sheet, Tabs, Accordion, ScrollArea, Breadcrumb, Sidebar, Resizable, Header, AppLayout), M4 (Table, Pagination, Avatar, AvatarGroup, Tooltip, HoverCard, Progress, EmptyState, SearchInput), and M5/P1-P2 (DropdownMenu, ContextMenu, Command, Calendar, DatePicker, TimePicker) must continue to pass.

**Potential test failures and fixes:**
- **jsdom missing APIs:** Combobox and Color Picker tests already include `beforeAll` blocks polyfilling `hasPointerCapture`, `setPointerCapture`, `releasePointerCapture`, and `scrollIntoView`. If other missing APIs cause failures, add polyfills to the respective test files.
- **Timing issues:** Tests use `waitFor` for async popover operations. If flaky, increase timeouts or add explicit `waitFor` wrappers.
- **axe violations:** If vitest-axe reports issues, fix the component's ARIA attributes (e.g., missing labels, roles, or descriptions).

### Step 3: Lint Verification (`pnpm lint`)

**Purpose:** Ensure all files pass ESLint with zero errors.

**Files to lint:**
- `packages/ui/src/components/combobox/combobox.tsx`
- `packages/ui/src/components/combobox/combobox.types.ts`
- `packages/ui/src/components/combobox/combobox.styles.ts`
- `packages/ui/src/components/combobox/combobox.test.tsx`
- `packages/ui/src/components/combobox/combobox.stories.tsx`
- `packages/ui/src/components/color-picker/color-picker.tsx`
- `packages/ui/src/components/color-picker/color-picker.types.ts`
- `packages/ui/src/components/color-picker/color-picker.styles.ts`
- `packages/ui/src/components/color-picker/color-picker.test.tsx`
- `packages/ui/src/components/color-picker/color-picker.stories.tsx`
- `packages/ui/src/index.ts`

**Common lint issues to watch for:**
- Unused variables or imports
- Missing `import type` for type-only imports
- Inconsistent quote style
- Missing semicolons or trailing commas (per project Prettier config)
- `any` type usage (prohibited per AGENTS.md)

**Fix approach:** Run `pnpm lint --fix` first to auto-fix formatting issues. Manually address any remaining structural issues.

### Step 4: Storybook Verification

**Purpose:** Confirm both components render visually in Storybook with all stories and autodocs.

**Combobox stories to verify (9 stories):**
1. `Default` — renders with placeholder "Select...", opens on click, shows 3 options
2. `WithDefaultValue` — trigger shows "Banana" on initial render
3. `Controlled` — wrapper component with state, selecting an option updates trigger
4. `Disabled` — trigger is grayed out, click does nothing
5. `ManyOptions` — 60 options rendered, scroll works, filter works
6. `MultiSelect` — `mode="multiple"`, selecting multiple shows count
7. `MultiSelectWithDefaults` — `defaultValue={['apple', 'cherry']}`, trigger shows "2 selected"
8. `WithCreateOption` — type non-matching text, "Create" option appears
9. `MultiSelectWithCreateOption` — multi mode + create option combined

**Color Picker stories to verify (4 stories):**
1. `Default` — renders with "Pick a color" placeholder, opens popover with 22 swatches
2. `WithDefaultValue` — trigger shows "#ef4444" with red swatch
3. `Controlled` — wrapper component with state, selecting a swatch updates trigger
4. `Disabled` — trigger is grayed out, click does nothing

**Both components must:**
- Appear in the Storybook sidebar under "Components/" category
- Render the autodocs page (from `tags: ['autodocs']`)
- Show props table in autodocs

**Verification method:** Launch Storybook with `pnpm storybook`, navigate to Components/Combobox and Components/ColorPicker, visually confirm each story renders and interactions work. This is a manual check that cannot be fully automated.

### Step 5: Export Verification

**Purpose:** Confirm `packages/ui/src/index.ts` exports all required symbols.

**Required exports (already present from t01/t02/t03, but must be verified):**

Line 449: `export { Combobox, type ComboboxProps, type ComboboxOption } from './components/combobox/combobox.js';`
Line 450: `export { ColorPicker, type ColorPickerProps } from './components/color-picker/color-picker.js';`

**Verification method:** Grep `index.ts` for each export name. If any are missing, add them following the existing export pattern.

### Step 6: Regression Check

**Purpose:** Confirm no existing tests from prior milestones/phases broke.

The `pnpm test` command (Step 2) already runs all tests monorepo-wide. This step is about specifically reviewing the output to confirm:
- No tests from M1–M4 components failed
- No tests from M5/P1 (DropdownMenu, ContextMenu, Command) failed
- No tests from M5/P2 (Calendar, DatePicker, TimePicker) failed

If regressions are found, investigate whether the new Combobox/ColorPicker code introduced the issue (e.g., an index.ts export conflict) or if it's a pre-existing issue.

## 4. API Contracts

N/A — This is a verification task. No new API surfaces are being created. The API contracts for Combobox and Color Picker were defined and implemented in tasks t01, t02, and t03.

**For reference, the existing API surfaces to verify:**

### Combobox

```typescript
// Single-select
<Combobox
  options={[{ value: "apple", label: "Apple" }]}
  value="apple"                    // optional, controlled
  defaultValue="apple"             // optional, uncontrolled
  onValueChange={(v: string) => {}} // optional
  placeholder="Select..."          // optional, default "Select..."
  searchPlaceholder="Search..."    // optional, default "Search..."
  emptyMessage="No results found." // optional, default "No results found."
  disabled={false}                 // optional
  className=""                     // optional
  ref={ref}                        // optional
/>

// Multi-select
<Combobox
  mode="multiple"
  options={[{ value: "apple", label: "Apple" }]}
  value={["apple"]}                      // optional, string[]
  defaultValue={["apple"]}               // optional, string[]
  onValueChange={(v: string[]) => {}}    // optional
  onCreateOption={(v: string) => {}}     // optional
/>
```

### Color Picker

```typescript
<ColorPicker
  value="#ef4444"                          // optional, controlled
  defaultValue="#ef4444"                   // optional, uncontrolled
  onValueChange={(v: string | undefined) => {}} // optional
  disabled={false}                         // optional
  placeholder="Pick a color"               // optional, default "Pick a color"
  className=""                             // optional
  ref={ref}                                // optional
/>
```

## 5. Test Plan

This task does not write new tests. It runs existing tests and verifies they pass.

### Test Setup

The test environment is already configured:
- **Runner:** Vitest (configured in `packages/ui/vitest.config.ts`)
- **Environment:** jsdom
- **Setup file:** `packages/ui/src/test-setup.ts`
- **Polyfills:** `hasPointerCapture`, `setPointerCapture`, `releasePointerCapture`, `scrollIntoView` — polyfilled in each test file's `beforeAll` block

### Test Execution

Run: `pnpm test` (from monorepo root — delegates to `turbo run test`)

This runs Vitest across all packages. Only `packages/ui` has tests.

### Expected Outcomes

| Test Suite | Expected Tests | Status |
|------------|---------------|--------|
| Combobox (single-select) | 13 | All pass |
| Combobox (multi-select) | 6 | All pass |
| Combobox (create-option) | 6 | All pass |
| Color Picker | 14 | All pass |
| All prior components (M1–M5/P2) | ~260+ | All pass, no regressions |

### Failure Response Protocol

For each failing test:

1. **Read the error message** — identify whether it's a runtime error, assertion failure, or timeout
2. **Classify the root cause:**
   - **Type error at compile time** → fix in `.types.ts` or `.tsx`
   - **Missing DOM element** → fix component rendering logic in `.tsx`
   - **Incorrect assertion** → verify the assertion matches intended behavior; fix the test only if the assertion is wrong, fix the component if the behavior is wrong
   - **axe violation** → fix ARIA attributes in the component `.tsx`
   - **Timeout / flaky** → add `waitFor` or increase timeout; ensure async operations resolve
3. **Apply the minimal fix** — do not refactor surrounding code
4. **Re-run `pnpm test`** — confirm the fix resolves the failure without introducing new ones

## 6. Implementation Order

1. **Run `pnpm typecheck`** — address any TypeScript errors first, since type errors can cascade into test and lint failures
2. **Run `pnpm test`** — run the full test suite; fix any test failures found
3. **Run `pnpm lint`** — run the linter; fix any ESLint violations (auto-fix first with `--fix`)
4. **Verify exports in `packages/ui/src/index.ts`** — grep for all 5 required exports (`Combobox`, `ComboboxProps`, `ComboboxOption`, `ColorPicker`, `ColorPickerProps`)
5. **Launch Storybook (`pnpm storybook`)** — visually confirm all 13 stories render (9 Combobox + 4 Color Picker)
6. **Review test output for regressions** — confirm no prior component tests failed in step 2
7. **Re-run all three commands** (`pnpm typecheck && pnpm test && pnpm lint`) — final clean run to confirm everything passes after any fixes

## 7. Verification Commands

```bash
# Step 1: TypeScript type checking (from monorepo root)
pnpm typecheck

# Step 2: Run full test suite (from monorepo root)
pnpm test

# Step 3: Run linter (from monorepo root)
pnpm lint

# Step 4: Verify exports exist in index.ts
grep -n 'Combobox' packages/ui/src/index.ts
grep -n 'ComboboxProps' packages/ui/src/index.ts
grep -n 'ComboboxOption' packages/ui/src/index.ts
grep -n 'ColorPicker' packages/ui/src/index.ts
grep -n 'ColorPickerProps' packages/ui/src/index.ts

# Step 5: Launch Storybook for visual verification
pnpm storybook

# Step 6: Final clean run after all fixes
pnpm typecheck && pnpm test && pnpm lint
```

## 8. Design Deviations

None.