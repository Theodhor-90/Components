Now I have all the context I need. Let me produce the specification.

## 1. Deliverables

This task creates no new files and modifies no files. It is a verification-only task that validates the correctness and integration of all t01–t04 deliverables.

| Artifact               | Type         | Purpose                                                                               |
| ---------------------- | ------------ | ------------------------------------------------------------------------------------- |
| `pnpm typecheck` pass  | Verification | Confirms zero TypeScript errors across the monorepo                                   |
| `pnpm test` pass       | Verification | Confirms all Breadcrumb, Sidebar, and Resizable tests pass (including vitest-axe)     |
| Storybook visual check | Verification | Confirms all three components render correctly with autodocs                          |
| Export audit           | Verification | Confirms all components and types are exported from `packages/ui/src/index.ts`        |
| Bug fixes (if any)     | Modification | Any issues found during verification are fixed in the source files created by t01–t04 |

## 2. Dependencies

- **t01 complete**: `react-resizable-panels` installed in `packages/ui/package.json`
- **t02 complete**: Breadcrumb component (7 sub-components) implemented and exported
- **t03 complete**: Sidebar component (8 sub-components + `useSidebar` hook) implemented and exported
- **t04 complete**: Resizable component (3 sub-components) implemented and exported
- **pnpm**: Package manager (v9.15.4) for running monorepo scripts
- **Turborepo**: Orchestrates `typecheck` and `test` across all packages
- **Node.js >= 22**: Required by engine constraint in root `package.json`

## 3. Implementation Details

This task has no new code to implement. It consists of running verification commands and fixing any issues discovered. The implementation is structured as a sequential verification pipeline:

### Step A: Type Checking

- **Command**: `pnpm typecheck` (delegates to `turbo run typecheck`, which runs `tsc --noEmit` in each package)
- **Expected result**: Exit code 0, zero TypeScript errors
- **If failing**: Examine error output, identify the offending file(s), and fix type issues. Common problems:
  - Missing `import type` for type-only imports
  - `React.ComponentProps` extended with wrong element type
  - CVA `VariantProps` type mismatch between `.styles.ts` and `.types.ts`
  - `react-resizable-panels` type mismatches on `PanelGroupProps`, `PanelProps`, or `PanelResizeHandleProps`

### Step B: Test Suite

- **Command**: `pnpm test` (delegates to `turbo run test`, which runs `vitest run` in `packages/ui`)
- **Expected result**: Exit code 0, all tests passing
- **Files under test**:
  - `packages/ui/src/components/breadcrumb/breadcrumb.test.tsx` — 12 tests: smoke render, nav element with aria-label, ol element render, anchor link default, asChild renders custom element, aria-current="page", separator chevron default, custom separator children, ellipsis SVG + sr-only, data-slot attributes, className merging, accessibility (vitest-axe)
  - `packages/ui/src/components/sidebar/sidebar.test.tsx` — 16 tests: renders content, toggle on click, Cmd+B shortcut, Ctrl+B shortcut, active state via data-active, variant classes, size classes, asChild on MenuButton, asChild on GroupLabel, context via useSidebar, throw outside provider, data-slot attributes, className merging, controlled mode, sidebar-\* tokens, accessibility (vitest-axe)
  - `packages/ui/src/components/resizable/resizable.test.tsx` — 10 tests: renders panels and handle, handle between panels, withHandle grip SVG, no grip without withHandle, horizontal direction attribute, vertical direction attribute, data-slot attributes, className merging on group, className merging on handle, accessibility (vitest-axe)
- **If failing**: Read the test failure output, identify root cause, and fix the corresponding source file. Common issues:
  - `data-slot` attribute missing or misnamed
  - `cn()` not merging className correctly (import path issue)
  - `useSidebar` context not wired up correctly
  - `vitest-axe` violations (missing ARIA attributes, incorrect role usage)

### Step C: Export Audit

- **Verification**: Read `packages/ui/src/index.ts` and confirm presence of all required exports:
  - **Breadcrumb** (7 components + 7 types): `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis` + corresponding `*Props` types
  - **Sidebar** (8 components + 1 hook + 8 types + 1 CVA export): `SidebarProvider`, `SidebarTrigger`, `SidebarContent`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, `useSidebar` + corresponding `*Props` types + `sidebarMenuButtonVariants`
  - **Resizable** (3 components + 3 types): `ResizablePanelGroup`, `ResizablePanel`, `ResizableHandle` + corresponding `*Props` types
- **If missing**: Add the missing export line(s) to `packages/ui/src/index.ts` following the existing pattern

### Step D: Storybook Rendering

- **Command**: `pnpm storybook` (launches Storybook on port 6006)
- **Verification**: Confirm the following stories render without console errors:
  - Breadcrumb: Default, WithCustomSeparator, WithEllipsis, WithRouterLink, ResponsiveCollapsed
  - Sidebar: Default, Collapsed, WithNestedMenus, ControlledState
  - Resizable: Horizontal, Vertical, WithHandle, ThreePanels, NestedGroups
- **Additional check**: Confirm `tags: ['autodocs']` is present in each story's meta and autodocs pages generate correctly
- **If failing**: Inspect browser console for errors, identify the offending component or story, and fix

## 4. API Contracts

N/A — This task does not introduce or modify any API surface. It validates the APIs created by t02–t04.

## 5. Test Plan

This task does not create new tests. It runs the existing test suites and validates their results.

### Test Inventory (existing, run by this task)

#### Breadcrumb (`breadcrumb.test.tsx`) — 12 tests

| #   | Test Name                                                  | Validates                                 |
| --- | ---------------------------------------------------------- | ----------------------------------------- |
| 1   | renders a fully composed breadcrumb                        | Smoke render with all 7 sub-components    |
| 2   | Breadcrumb renders a nav element with aria-label           | `<nav aria-label="breadcrumb">` semantics |
| 3   | BreadcrumbList renders an ol element                       | `<ol>` list semantics                     |
| 4   | BreadcrumbLink renders as an anchor by default             | Default `<a>` element with `href`         |
| 5   | BreadcrumbLink renders as child element when asChild       | `asChild` composition via Slot            |
| 6   | BreadcrumbPage has aria-current="page"                     | Active page ARIA attributes               |
| 7   | BreadcrumbSeparator renders chevron by default             | Default SVG separator                     |
| 8   | BreadcrumbSeparator renders custom children                | Custom separator override                 |
| 9   | BreadcrumbEllipsis renders three-dot icon and sr-only text | Ellipsis indicator + screen reader label  |
| 10  | data-slot attributes are correct on all sub-components     | All 7 `data-slot` values                  |
| 11  | each sub-component merges custom className                 | `cn()` className merging                  |
| 12  | fully composed breadcrumb has no accessibility violations  | vitest-axe pass                           |

#### Sidebar (`sidebar.test.tsx`) — 16 tests

| #   | Test Name                                          | Validates                                 |
| --- | -------------------------------------------------- | ----------------------------------------- |
| 1   | renders sidebar with content                       | Smoke render                              |
| 2   | toggles collapse state on SidebarTrigger click     | Trigger click → width transition          |
| 3   | keyboard shortcut Cmd+B toggles sidebar            | macOS shortcut                            |
| 4   | keyboard shortcut Ctrl+B toggles sidebar           | Windows/Linux shortcut                    |
| 5   | menu button renders active state via data-active   | `isActive` prop → `data-active` attribute |
| 6   | menu button applies variant classes                | CVA variant="outline"                     |
| 7   | menu button applies size classes                   | CVA size="lg"                             |
| 8   | SidebarMenuButton asChild renders custom element   | Slot composition                          |
| 9   | SidebarGroupLabel asChild renders custom element   | Slot composition                          |
| 10  | useSidebar provides context                        | Hook returns `open` state                 |
| 11  | useSidebar throws outside SidebarProvider          | Error boundary                            |
| 12  | data-slot attributes present on all sub-components | All 8 `data-slot` values                  |
| 13  | className merging works                            | `cn()` on provider, content, button       |
| 14  | controlled mode with open and onOpenChange         | External state control                    |
| 15  | sidebar uses sidebar-\* token classes              | Token class verification                  |
| 16  | has no accessibility violations                    | vitest-axe pass                           |

#### Resizable (`resizable.test.tsx`) — 10 tests

| #   | Test Name                                        | Validates                                                                   |
| --- | ------------------------------------------------ | --------------------------------------------------------------------------- |
| 1   | renders panel group with two panels and a handle | Smoke render                                                                |
| 2   | handle renders between panels                    | Handle positioning                                                          |
| 3   | withHandle renders grip indicator SVG            | Grip indicator present                                                      |
| 4   | withHandle false hides grip                      | No grip by default                                                          |
| 5   | horizontal direction attribute                   | `data-panel-group-direction="horizontal"`                                   |
| 6   | vertical direction attribute                     | `data-panel-group-direction="vertical"`                                     |
| 7   | data-slot attributes on all sub-components       | All 3 `data-slot` values                                                    |
| 8   | className merging on ResizablePanelGroup         | `cn()` on group                                                             |
| 9   | className merging on ResizableHandle             | `cn()` on handle                                                            |
| 10  | has no accessibility violations                  | vitest-axe pass (with `aria-required-attr` rule disabled for resize handle) |

### Expected Totals

- **38 tests** total across 3 component test files
- **3 vitest-axe assertions** (one per component)
- **0 failures** required to pass

## 6. Implementation Order

1. **Run `pnpm typecheck`** — Verify all TypeScript types compile cleanly. Fix any type errors before proceeding.
2. **Run `pnpm test`** — Verify all 38 tests pass. Fix any test failures.
3. **Audit `packages/ui/src/index.ts` exports** — Verify all 18 components, 1 hook, 18 types, and 1 CVA variant function are exported. Add any missing exports.
4. **Run `pnpm storybook`** — Launch Storybook and visually verify all 14 stories render correctly with autodocs. Fix any rendering issues.
5. **Re-run `pnpm typecheck` and `pnpm test`** — If any fixes were applied in steps 1–4, re-verify that all checks still pass.

## 7. Verification Commands

```bash
# Step 1: Type check the entire monorepo
pnpm typecheck

# Step 2: Run the full test suite
pnpm test

# Step 3: Run only the three component test files (targeted verification)
pnpm --filter @components/ui test -- --run src/components/breadcrumb/breadcrumb.test.tsx src/components/sidebar/sidebar.test.tsx src/components/resizable/resizable.test.tsx

# Step 4: Launch Storybook for visual verification (manual)
pnpm storybook

# Step 5: Verify exports are present (quick grep check)
# Breadcrumb exports
grep -c "Breadcrumb" packages/ui/src/index.ts

# Sidebar exports
grep -c "Sidebar" packages/ui/src/index.ts

# Resizable exports
grep -c "Resizable" packages/ui/src/index.ts

# useSidebar hook export
grep "useSidebar" packages/ui/src/index.ts

# sidebarMenuButtonVariants CVA export
grep "sidebarMenuButtonVariants" packages/ui/src/index.ts
```

## 8. Design Deviations

None.
