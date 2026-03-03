Now I have all the context I need. This is Task 5 — Integration Verification. Let me produce the definitive specification.

# Task 5: Integration Verification — Implementation Plan

## 1. Deliverables

This task produces no new files. It is a verification-only task that runs the monorepo's quality gates and confirms all Phase 1 (Menus) components are correctly integrated.

| Check | Artifact Verified | Expected Result |
| --- | --- | --- |
| TypeScript compilation | All `.ts`/`.tsx` files across monorepo | `pnpm typecheck` exits with code 0, zero errors |
| Test suite | All `.test.tsx` files across monorepo | `pnpm test` exits with code 0, all tests pass |
| Build | `packages/ui/dist/` output | `pnpm build` exits with code 0, all new components in output |
| Export verification | `packages/ui/src/index.ts` | All 3 components' sub-components, types, and CVA variants are exported |
| Storybook build | All `.stories.tsx` files | `pnpm build-storybook` succeeds (or `pnpm storybook` renders; build preferred for CI) |

### Fixes (conditional)

If any check fails, the following files may need modification:

| File | Potential Fix |
| --- | --- |
| `packages/ui/src/index.ts` | Add missing exports for Dropdown Menu, Context Menu, or Command sub-components/types/variants |
| `packages/ui/src/components/dropdown-menu/dropdown-menu.tsx` | Fix type errors, missing imports, or incorrect ref handling |
| `packages/ui/src/components/dropdown-menu/dropdown-menu.types.ts` | Fix type mismatches or missing type exports |
| `packages/ui/src/components/dropdown-menu/dropdown-menu.styles.ts` | Fix CVA variant definition errors |
| `packages/ui/src/components/dropdown-menu/dropdown-menu.test.tsx` | Fix failing tests |
| `packages/ui/src/components/dropdown-menu/dropdown-menu.stories.tsx` | Fix Storybook rendering issues |
| `packages/ui/src/components/context-menu/context-menu.tsx` | Fix type errors, missing imports, or incorrect ref handling |
| `packages/ui/src/components/context-menu/context-menu.types.ts` | Fix type mismatches or missing type exports |
| `packages/ui/src/components/context-menu/context-menu.styles.ts` | Fix CVA variant definition errors |
| `packages/ui/src/components/context-menu/context-menu.test.tsx` | Fix failing tests |
| `packages/ui/src/components/context-menu/context-menu.stories.tsx` | Fix Storybook rendering issues |
| `packages/ui/src/components/command/command.tsx` | Fix type errors, missing imports, or incorrect ref handling |
| `packages/ui/src/components/command/command.types.ts` | Fix type mismatches or missing type exports |
| `packages/ui/src/components/command/command.styles.ts` | Fix style constant errors |
| `packages/ui/src/components/command/command.test.tsx` | Fix failing tests |
| `packages/ui/src/components/command/command.stories.tsx` | Fix Storybook rendering issues |

## 2. Dependencies

### Prerequisites (must be complete before this task)

- **Task t01** (completed): `@radix-ui/react-dropdown-menu`, `@radix-ui/react-context-menu`, and `cmdk` installed in `packages/ui/package.json`
- **Task t02** (completed): Dropdown Menu component — all 5 files created, exports added to `index.ts`
- **Task t03** (completed): Context Menu component — all 5 files created, exports added to `index.ts`
- **Task t04** (completed): Command component — all 5 files created, exports added to `index.ts`

### Infrastructure

- Node.js >= 22
- pnpm 9.15.4 (as specified in `packageManager`)
- Turborepo (orchestrates `build`, `test`, `typecheck` across packages)
- Vitest + Testing Library + vitest-axe (test infrastructure)
- Storybook 8.5 (documentation infrastructure)

### External Packages (no new installations)

No new packages are required. All dependencies were installed in Task t01.

## 3. Implementation Details

This task is a sequence of verification steps with a fix-then-re-verify loop for any failures.

### Step 1: Export Audit

**Purpose:** Confirm `packages/ui/src/index.ts` exports every sub-component, type, and CVA variant for all three Phase 1 components.

**Expected exports per component:**

**Dropdown Menu** (from `./components/dropdown-menu/dropdown-menu.js`):
- Components: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioItem`, `DropdownMenuRadioGroup`, `DropdownMenuGroup`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`, `DropdownMenuPortal`, `DropdownMenuShortcut`
- Types: `DropdownMenuProps`, `DropdownMenuTriggerProps`, `DropdownMenuContentProps`, `DropdownMenuItemProps`, `DropdownMenuCheckboxItemProps`, `DropdownMenuRadioItemProps`, `DropdownMenuRadioGroupProps`, `DropdownMenuGroupProps`, `DropdownMenuLabelProps`, `DropdownMenuSeparatorProps`, `DropdownMenuSubProps`, `DropdownMenuSubTriggerProps`, `DropdownMenuSubContentProps`, `DropdownMenuPortalProps`, `DropdownMenuShortcutProps`
- CVA variants (from `./components/dropdown-menu/dropdown-menu.styles.js`): `dropdownMenuItemVariants`, `dropdownMenuLabelVariants`

**Context Menu** (from `./components/context-menu/context-menu.js`):
- Components: `ContextMenu`, `ContextMenuTrigger`, `ContextMenuContent`, `ContextMenuItem`, `ContextMenuCheckboxItem`, `ContextMenuRadioItem`, `ContextMenuRadioGroup`, `ContextMenuGroup`, `ContextMenuLabel`, `ContextMenuSeparator`, `ContextMenuSub`, `ContextMenuSubTrigger`, `ContextMenuSubContent`, `ContextMenuPortal`, `ContextMenuShortcut`
- Types: `ContextMenuProps`, `ContextMenuTriggerProps`, `ContextMenuContentProps`, `ContextMenuItemProps`, `ContextMenuCheckboxItemProps`, `ContextMenuRadioItemProps`, `ContextMenuRadioGroupProps`, `ContextMenuGroupProps`, `ContextMenuLabelProps`, `ContextMenuSeparatorProps`, `ContextMenuSubProps`, `ContextMenuSubTriggerProps`, `ContextMenuSubContentProps`, `ContextMenuPortalProps`, `ContextMenuShortcutProps`
- CVA variants (from `./components/context-menu/context-menu.styles.js`): `contextMenuItemVariants`, `contextMenuLabelVariants`

**Command** (from `./components/command/command.js`):
- Components: `Command`, `CommandDialog`, `CommandEmpty`, `CommandGroup`, `CommandInput`, `CommandItem`, `CommandList`, `CommandSeparator`, `CommandShortcut`
- Types: `CommandProps`, `CommandDialogProps`, `CommandEmptyProps`, `CommandGroupProps`, `CommandInputProps`, `CommandItemProps`, `CommandListProps`, `CommandSeparatorProps`, `CommandShortcutProps`
- CVA variants: None — Command uses plain string style constants (not CVA functions), and these are not re-exported per the established pattern (only CVA `cva()` return values get exported)

**Action:** Read `packages/ui/src/index.ts` and compare against the lists above. If any export is missing, add it following the existing pattern.

### Step 2: TypeScript Type Check

**Purpose:** Verify all TypeScript across the monorepo compiles without errors.

**Command:** `pnpm typecheck`

**What this runs:** `turbo run typecheck` which runs `tsc --noEmit` in each package.

**Common failure modes:**
- Missing type exports in component `.types.ts` files
- Incorrect `React.ComponentProps<typeof Primitive>` usage when Radix primitive types don't match
- Import path mismatches (e.g., missing `.js` extension in import specifiers)
- CVA `VariantProps` not matching actual variant definitions

**Fix approach:** Read the error output, identify the offending file and line, fix the type issue, re-run `pnpm typecheck`.

### Step 3: Test Suite

**Purpose:** Verify all tests pass, including the new Dropdown Menu, Context Menu, and Command tests, without breaking any pre-existing tests.

**Command:** `pnpm test`

**What this runs:** `turbo run test` which runs `vitest run` in each package.

**Expected test files for new components:**
- `packages/ui/src/components/dropdown-menu/dropdown-menu.test.tsx`
- `packages/ui/src/components/context-menu/context-menu.test.tsx`
- `packages/ui/src/components/command/command.test.tsx`

**Common failure modes:**
- Missing `Element.prototype` polyfills (`hasPointerCapture`, `setPointerCapture`, `releasePointerCapture`, `scrollIntoView`) in `beforeAll` — required by Radix UI in jsdom
- Timing issues with async menu opening — use `waitFor` or `findBy` queries
- `axe()` accessibility violations (missing ARIA attributes, roles, labels)
- Import path issues (`.js` extensions required for ESM)

**Fix approach:** Read the test failure output, identify which test(s) fail, fix the root cause in the component or test file, re-run `pnpm test`.

### Step 4: Build

**Purpose:** Verify the TypeScript compiler emits valid ESM output for all components.

**Command:** `pnpm build`

**What this runs:** `turbo run build` which runs `tsc --build` in each package in dependency order (tokens → utils → hooks → ui).

**Expected output:** `packages/ui/dist/` contains compiled `.js` and `.d.ts` files for all components, including the three new menu components.

**Post-build check:** Verify the built output includes the new component directories:
- `packages/ui/dist/components/dropdown-menu/`
- `packages/ui/dist/components/context-menu/`
- `packages/ui/dist/components/command/`

**Common failure modes:**
- Same type errors as `typecheck` (build runs `tsc --build` which also type-checks)
- `references` in `tsconfig.json` not including dependent packages
- Missing or incorrect `outDir` / `rootDir` in `tsconfig.json`

**Fix approach:** Read the build error output, fix the issue, re-run `pnpm build`.

### Step 5: Storybook Build Verification

**Purpose:** Verify all new Storybook stories render and the Storybook build succeeds.

**Command:** `pnpm --filter @components/docs build-storybook` (if `build-storybook` script exists) or verify via the Storybook dev server.

**Expected stories for new components:**
- Dropdown Menu (7 stories): Default, WithCheckboxItems, WithRadioGroup, WithSubMenu, WithShortcuts, WithInsetItems, Destructive
- Context Menu (6 stories): Default, WithCheckboxItems, WithRadioGroup, WithSubMenu, WithShortcuts, WithInsetItems
- Command (6 stories): Default, WithGroups, WithShortcuts, Empty, InDialog, WithIcons

**Common failure modes:**
- Missing Storybook addon configuration for new component patterns
- Import errors in story files
- Missing dependencies in the docs app

**Fix approach:** Read the build/render error, fix the story file or Storybook config, re-verify.

### Step 6: Phase Exit Criteria Verification

**Purpose:** Manually verify the behavioral requirements from the phase spec are met.

**Checklist:**
1. Dropdown Menu opens on trigger click — verified by `dropdown-menu.test.tsx` "opens on trigger click" test
2. Dropdown Menu supports nested sub-menus — verified by "sub-menu renders on hover" and "sub-menu renders with keyboard navigation" tests
3. Dropdown Menu supports checkbox items — verified by "checkbox item toggles checked state" test
4. Dropdown Menu supports radio items with group exclusivity — verified by "radio item group exclusivity" test
5. Dropdown Menu keyboard navigation — verified by "keyboard navigation with arrow keys" and "keyboard Enter selects focused item" tests
6. Context Menu opens on right-click — verified by `context-menu.test.tsx` corresponding test
7. Context Menu supports same item types as Dropdown Menu — verified by checkbox, radio, and sub-menu tests
8. Command filters in real time — verified by `command.test.tsx` "filters items by typing in input" test
9. Command supports arrow-key/Enter/Escape — verified by "navigates items with arrow keys", "selects item with Enter", and "calls onOpenChange with false when Escape is pressed" tests
10. CommandDialog composes Dialog — verified by "opens CommandDialog when open is true" test
11. `variant` prop with `"default" | "destructive"` on DropdownMenuItem and ContextMenuItem — verified by "destructive variant applies correct styles" tests
12. `data-slot` attributes on all sub-components — verified by dedicated data-slot tests in each component
13. All exports in `packages/ui/src/index.ts` — verified by export audit in Step 1

## 4. API Contracts

N/A — this is a verification task that does not introduce new API surface. All API contracts were established in Tasks t02 (Dropdown Menu), t03 (Context Menu), and t04 (Command).

## 5. Test Plan

This task does not create new tests. It runs the existing test suites and validates their results.

### Tests Run

All tests across the monorepo via `pnpm test` (which runs `turbo run test` → `vitest run` per package).

**New component tests expected to pass:**

| Test File | Test Count | Key Tests |
| --- | --- | --- |
| `dropdown-menu.test.tsx` | ~18 | smoke render, open on click, item selection, checkbox toggle, radio exclusivity, sub-menu hover/keyboard, arrow key navigation, Enter selection, Escape close, inset variant, destructive variant, data-slots (5), className merge, axe a11y |
| `context-menu.test.tsx` | ~18 | smoke render, open on right-click, item selection, checkbox toggle, radio exclusivity, sub-menu hover/keyboard, arrow key navigation, Enter selection, Escape close, inset variant, destructive variant, data-slots (5), className merge, axe a11y |
| `command.test.tsx` | ~13 | smoke render, filtering, arrow key navigation, Enter selection, CommandEmpty, CommandGroup heading, CommandSeparator, CommandShortcut, CommandDialog open/close, data-slots (8), className merge, axe a11y |

**Pre-existing tests that must continue to pass:**

All tests from Milestones 1–4 components (Button, Separator, Badge, Card, Skeleton, Spinner, Alert, Dialog, AlertDialog, Popover, Sonner, Label, VisuallyHidden, Collapsible, Input, Textarea, Checkbox, Switch, RadioGroup, Toggle, ToggleGroup, Select, Slider, Form, Sheet, Tabs, Accordion, ScrollArea, Breadcrumb, Sidebar, Resizable, Header, AppLayout, Table, Pagination, Avatar, AvatarGroup, Tooltip, HoverCard, Progress, EmptyState, SearchInput).

### Success Criteria

- `pnpm test` exits with code 0
- Zero test failures
- Zero test errors
- All accessibility assertions (vitest-axe) pass

## 6. Implementation Order

1. **Export audit** — Read `packages/ui/src/index.ts` and verify completeness against expected export list. Fix any missing exports.
2. **TypeScript check** — Run `pnpm typecheck`. Fix any type errors. Re-run until clean.
3. **Test suite** — Run `pnpm test`. Fix any test failures. Re-run until all pass.
4. **Build** — Run `pnpm build`. Fix any build errors. Re-run until clean. Verify output directories exist.
5. **Storybook** — Run Storybook build or dev server to verify stories render. Fix any issues.
6. **Phase exit criteria** — Confirm all 13 behavioral requirements from the phase spec are covered by passing tests.

Each step depends on the previous step passing. If Step 2 fails, fix and re-run before proceeding to Step 3. If Step 3 fails, fix and re-run before proceeding to Step 4.

## 7. Verification Commands

All commands run from the monorepo root (`/Users/theodhor/Desktop/Portfolio/Components`).

```bash
# Step 1: Export audit (visual inspection)
# Read packages/ui/src/index.ts and verify all exports are present

# Step 2: TypeScript type check
pnpm typecheck

# Step 3: Test suite
pnpm test

# Step 4: Build
pnpm build

# Step 4b: Verify build output includes new components
ls packages/ui/dist/components/dropdown-menu/
ls packages/ui/dist/components/context-menu/
ls packages/ui/dist/components/command/

# Step 5: Storybook build verification
pnpm --filter @components/docs build-storybook
```

If `build-storybook` is not available as a script in the docs package, check `apps/docs/package.json` for the correct script name. Alternative:

```bash
# Check available storybook scripts
cat apps/docs/package.json | grep -E '"(build|storybook)'
```

## 8. Design Deviations

None.