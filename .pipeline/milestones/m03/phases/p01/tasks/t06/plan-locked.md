I now have a complete understanding of the codebase. This is task t06 — Integration verification. The task requires running quality checks and verifying all exports. Let me produce the plan.

## 1. Deliverables

This task produces no new files. It verifies the correctness and completeness of all artifacts created by tasks t01–t05.

| #   | Artifact                                | Purpose                                                                                                                 |
| --- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 1   | `pnpm typecheck` pass                   | Verify zero TypeScript errors across all packages                                                                       |
| 2   | `pnpm test` pass                        | Verify all Vitest tests pass, including vitest-axe accessibility assertions for Sheet, Tabs, Accordion, and Scroll Area |
| 3   | `pnpm build` pass                       | Verify clean build with no warnings                                                                                     |
| 4   | `packages/ui/src/index.ts` export audit | Verify all sub-components, types, and variant exports are present for all four new components                           |
| 5   | File presence audit                     | Verify all 5 files exist in each of the 4 new component directories                                                     |
| 6   | Storybook launch verification           | Verify Storybook loads and renders autodocs for all four new components                                                 |

## 2. Dependencies

- **Tasks t01–t05 must all be completed.** All four component directories (sheet, tabs, accordion, scroll-area) and their 5 files each must already exist, along with Radix dependency installations and `globals.css` keyframe additions.
- **No new packages to install.** All dependencies (`@radix-ui/react-tabs`, `@radix-ui/react-accordion`, `@radix-ui/react-scroll-area`, `@radix-ui/react-dialog`) are already in `packages/ui/package.json`.
- **No file modifications expected.** If verification commands reveal errors, fixes are applied as part of this task, but the intent is to confirm zero-error state.

## 3. Implementation Details

### 3.1 TypeScript Type Check

Run `pnpm typecheck` from the repository root. Turborepo runs `tsc --noEmit` in each package. This validates:

- All four new component directories have valid TypeScript (no type errors)
- All `import type` references resolve correctly
- `index.ts` re-exports match the actual exports from each component module
- No missing or circular references

**Expected outcome:** Exit code 0, zero errors.

### 3.2 Test Suite

Run `pnpm test` from the repository root. Turborepo runs `vitest run` in `packages/ui`. This validates:

- **Sheet tests** (19 tests): smoke render, all 4 sides, ESC close, overlay click close, X button close, title/description render, focus trap, controlled mode, 8 data-slot checks, className merging, axe accessibility
- **Tabs tests** (14 tests): default tab, click switch, arrow key navigation, Enter activation, controlled/uncontrolled modes, disabled tab, data-slot checks, className merging, axe accessibility
- **Accordion tests** (14 tests): smoke render, single mode, multiple mode, collapsible, non-collapsible, animation classes, Enter/Space/ArrowDown/ArrowUp keyboard, defaultValue, data-slot checks, className merging, axe accessibility
- **Scroll Area tests** (8 tests): smoke render, children content, vertical scrollbar, horizontal scrollbar, data-slot checks, className merging, axe accessibility

**Expected outcome:** Exit code 0, all tests pass, no skipped or todo tests.

### 3.3 Build

Run `pnpm build` from the repository root. Turborepo runs `tsc --build` in dependency order (tokens → utils → hooks → ui). This validates:

- All four new component directories compile to ESM output in `dist/`
- `index.ts` exports compile without errors
- No warnings in build output

**Expected outcome:** Exit code 0, no warnings.

### 3.4 Export Audit

Manually verify `packages/ui/src/index.ts` contains the following export blocks:

**Sheet** (lines 181–202):

- Components: `Sheet`, `SheetTrigger`, `SheetPortal`, `SheetOverlay`, `SheetContent`, `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription`, `SheetClose`
- Types: `SheetProps`, `SheetTriggerProps`, `SheetPortalProps`, `SheetOverlayProps`, `SheetContentProps`, `SheetHeaderProps`, `SheetFooterProps`, `SheetTitleProps`, `SheetDescriptionProps`, `SheetCloseProps`
- Variants: `sheetContentVariants` (from `sheet.styles.js`)

**Tabs** (lines 203–212):

- Components: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- Types: `TabsProps`, `TabsListProps`, `TabsTriggerProps`, `TabsContentProps`

**Accordion** (lines 213–222):

- Components: `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`
- Types: `AccordionProps`, `AccordionItemProps`, `AccordionTriggerProps`, `AccordionContentProps`

**Scroll Area** (lines 223–228):

- Components: `ScrollArea`, `ScrollBar`
- Types: `ScrollAreaProps`, `ScrollBarProps`

### 3.5 File Presence Audit

Verify each component directory has exactly 5 files:

```
packages/ui/src/components/sheet/
  sheet.tsx
  sheet.styles.ts
  sheet.types.ts
  sheet.test.tsx
  sheet.stories.tsx

packages/ui/src/components/tabs/
  tabs.tsx
  tabs.styles.ts
  tabs.types.ts
  tabs.test.tsx
  tabs.stories.tsx

packages/ui/src/components/accordion/
  accordion.tsx
  accordion.styles.ts
  accordion.types.ts
  accordion.test.tsx
  accordion.stories.tsx

packages/ui/src/components/scroll-area/
  scroll-area.tsx
  scroll-area.styles.ts
  scroll-area.types.ts
  scroll-area.test.tsx
  scroll-area.stories.tsx
```

### 3.6 Storybook Verification

Run `pnpm storybook` and confirm all four components appear in the Storybook sidebar with autodocs:

- `Components/Sheet` — 6 stories (Default, Left, Top, Bottom, WithForm, WithLongContent)
- `Components/Tabs` — 5 stories (Default, Controlled, ManyTabs, WithDisabledTab, WithIcons)
- `Components/Accordion` — 5 stories (Single, Multiple, Collapsible, WithNestedContent, DefaultOpen)
- `Components/ScrollArea` — 5 stories (Vertical, Horizontal, BothDirections, WithTags, CustomHeight)

## 4. API Contracts

N/A — this task verifies existing implementations; it introduces no new API surface.

## 5. Test Plan

This task does not create new tests. It runs and validates the existing test suites.

### 5.1 Existing Tests to Pass

| Component   | Test File                          | Test Count | Key Assertions                                                                                                                 |
| ----------- | ---------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Sheet       | `sheet/sheet.test.tsx`             | 19         | Smoke, sides, ESC, overlay click, X close, focus trap, controlled, data-slots, className, axe                                  |
| Tabs        | `tabs/tabs.test.tsx`               | 14         | Default, click switch, arrows, Enter, controlled/uncontrolled, disabled, data-slots, className, axe                            |
| Accordion   | `accordion/accordion.test.tsx`     | 14         | Smoke, single, multiple, collapsible, non-collapsible, animation, Enter/Space/arrows, defaultValue, data-slots, className, axe |
| Scroll Area | `scroll-area/scroll-area.test.tsx` | 8          | Smoke, children, vertical, horizontal, data-slots, className, axe                                                              |

### 5.2 Pass Criteria

- All 55+ tests (4 new components plus all pre-existing components) pass
- Zero test failures, zero skipped tests
- All `vitest-axe` assertions report no accessibility violations
- Test output shows no warnings or deprecation notices

## 6. Implementation Order

1. **File presence audit** — List the contents of all 4 component directories to confirm every expected file exists
2. **Export audit** — Read `packages/ui/src/index.ts` and confirm all expected exports for Sheet, Tabs, Accordion, and Scroll Area are present
3. **Type check** — Run `pnpm typecheck` and confirm exit code 0 with zero errors
4. **Test suite** — Run `pnpm test` and confirm exit code 0 with all tests passing
5. **Build** — Run `pnpm build` and confirm exit code 0 with no warnings
6. **Storybook** — Run `pnpm storybook`, wait for it to start, then confirm all 4 components appear with autodocs (terminate after verification)
7. **Fix any issues** — If any step fails, identify the root cause, apply targeted fixes, and re-run the failed verification step

## 7. Verification Commands

All commands are run from the repository root (`/Users/theodhor/Desktop/Portfolio/Components`).

```bash
# 1. File presence audit — confirm all 20 files exist
ls packages/ui/src/components/sheet/
ls packages/ui/src/components/tabs/
ls packages/ui/src/components/accordion/
ls packages/ui/src/components/scroll-area/

# 2. Export audit — check index.ts contains all export lines
grep -c 'Sheet\|Tabs\|Accordion\|ScrollArea\|ScrollBar' packages/ui/src/index.ts

# 3. Type check
pnpm typecheck

# 4. Test suite
pnpm test

# 5. Build
pnpm build

# 6. Storybook (manual — launch, verify in browser, then Ctrl+C)
pnpm storybook
```

## 8. Design Deviations

None.
