Now I have a comprehensive understanding of the codebase. Let me produce the detailed implementation plan for Task t06 (Integration Verification).

## 1. Deliverables

| # | File/Action | Action | Purpose |
|---|---|---|---|
| 1 | `packages/ui/package.json` | Verify | Confirm `@radix-ui/react-avatar`, `@radix-ui/react-tooltip`, `@radix-ui/react-hover-card`, `@radix-ui/react-progress` are listed under `dependencies` |
| 2 | `packages/ui/src/index.ts` | Verify | Confirm all Phase 2 components, types, and style exports are present |
| 3 | TypeScript compilation | Verify | Run `pnpm typecheck` — zero errors across the entire workspace |
| 4 | Test suite | Verify | Run `pnpm test` — all Avatar, Avatar Group, Tooltip, Hover Card, and Progress tests pass with vitest-axe accessibility assertions |
| 5 | Build output | Verify | Run `pnpm build` — `@components/ui` package builds successfully with all Phase 2 components included in `dist/` |
| 6 | Storybook rendering | Verify | Run `pnpm storybook` — all five components render with all stories visible and autodocs generating documentation |

## 2. Dependencies

### Prerequisites

- **Tasks t01–t05 must be complete.** All five component directories must exist under `packages/ui/src/components/` with their full 5-file implementations:
  - `avatar/` (t01)
  - `avatar-group/` (t02)
  - `tooltip/` (t03)
  - `hover-card/` (t04)
  - `progress/` (t05)

### Packages Already Installed

All four Radix dependencies are already present in `packages/ui/package.json` (verified from current file state):

- `@radix-ui/react-avatar: ^1.1.6`
- `@radix-ui/react-tooltip: ^1.2.8`
- `@radix-ui/react-hover-card: ^1.1.11`
- `@radix-ui/react-progress: ^1.1.4`

No new package installations are required.

### External Requirements

None — all verification uses existing project scripts.

## 3. Implementation Details

### 3.1 Dependency Verification (`packages/ui/package.json`)

**Purpose:** Confirm all Radix primitives used by Phase 2 components are declared as runtime dependencies.

**What to check:**
- `@radix-ui/react-avatar` is listed under `dependencies`
- `@radix-ui/react-tooltip` is listed under `dependencies`
- `@radix-ui/react-hover-card` is listed under `dependencies`
- `@radix-ui/react-progress` is listed under `dependencies`

**Current state:** All four are already present. No modifications needed.

### 3.2 Exports Audit (`packages/ui/src/index.ts`)

**Purpose:** Confirm every Phase 2 component, type, and style constant is exported from the public API entry point.

**Expected exports — Avatar (t01):**
- Components: `Avatar`, `AvatarImage`, `AvatarFallback`
- Types: `AvatarProps`, `AvatarImageProps`, `AvatarFallbackProps`
- Styles: `avatarVariants`

**Expected exports — Avatar Group (t02):**
- Components: `AvatarGroup`
- Types: `AvatarGroupProps`

**Expected exports — Tooltip (t03):**
- Components: `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider`
- Types: `TooltipProps`, `TooltipTriggerProps`, `TooltipContentProps`, `TooltipProviderProps`

**Expected exports — Hover Card (t04):**
- Components: `HoverCard`, `HoverCardTrigger`, `HoverCardContent`
- Types: `HoverCardProps`, `HoverCardTriggerProps`, `HoverCardContentProps`

**Expected exports — Progress (t05):**
- Components: `Progress`
- Types: `ProgressProps`
- Styles: `progressStyles`, `progressIndicatorStyles`

**Current state:** All exports are already present in `packages/ui/src/index.ts` (lines 311–340). No modifications needed.

### 3.3 TypeScript Compilation

**Purpose:** Verify the entire `@components/ui` package type-checks with zero errors after adding all five Phase 2 components.

**Key concerns:**
- All `import type` statements resolve correctly (Radix primitive types, CVA `VariantProps`)
- Component props extending Radix primitive types are structurally compatible
- All exports in `index.ts` resolve to valid module paths (`.js` extensions for ESM)
- No circular dependencies between components

### 3.4 Test Suite

**Purpose:** Verify all Phase 2 component tests pass, including vitest-axe accessibility assertions.

**Test files to verify:**
- `packages/ui/src/components/avatar/avatar.test.tsx` — 13 tests (smoke render, fallback, data-slot, className merging, size variants, ref forwarding, a11y)
- `packages/ui/src/components/avatar-group/avatar-group.test.tsx` — 10 tests (multiple avatars, max overflow, z-index ordering, data-slot, className merging, ref forwarding, a11y)
- `packages/ui/src/components/tooltip/tooltip.test.tsx` — 9 tests (trigger render, hidden by default, show on hover, hide on leave, data-slot, className merging, sideOffset, ref forwarding, a11y)
- `packages/ui/src/components/hover-card/hover-card.test.tsx` — 11 tests (trigger render, hidden by default, show on hover, hide on leave, data-slot, className merging, default props, rich content, ref forwarding, a11y)
- `packages/ui/src/components/progress/progress.test.tsx` — 13 tests (smoke render, translateX positions, undefined value, data-slot, className merging, ref forwarding, aria attributes, role, a11y)

**Total: ~56 tests across 5 files.**

### 3.5 Build Output

**Purpose:** Verify `tsc --build` produces correct ESM output in `dist/` including all Phase 2 components.

**What to check:**
- `pnpm build` exits with code 0
- `dist/index.js` contains re-exports for all Phase 2 components
- `dist/index.d.ts` contains type declarations for all Phase 2 exports
- Individual component `.js` and `.d.ts` files exist under `dist/components/`

### 3.6 Storybook Rendering

**Purpose:** Verify all five component story files render correctly in Storybook with autodocs.

**Story files to verify:**
- `avatar.stories.tsx` — Stories: Default, Fallback, Sizes, WithBrokenImage, CustomFallback
- `avatar-group.stories.tsx` — Stories: Default, MaxOverflow, AllVisible, SingleAvatar, ManyAvatars
- `tooltip.stories.tsx` — Stories: Default, CustomDelay, Positions, RichContent, OnFocus
- `hover-card.stories.tsx` — Stories: Default, WithAvatar, LinkTrigger, CustomAlign
- `progress.stories.tsx` — Stories: Default, Empty, Complete, Animated, CustomColor

## 4. API Contracts

N/A — This task is a verification-only task. It does not create or modify any component APIs. All API contracts were defined and implemented in tasks t01–t05.

## 5. Test Plan

This task does not create new tests. It runs and validates the existing test suites created in tasks t01–t05.

### Test Execution

| Step | Command | Expected Outcome |
|------|---------|-----------------|
| 1 | `pnpm test --filter @components/ui -- --reporter=verbose` | All tests pass, zero failures |
| 2 | Verify avatar tests | 13 tests pass: smoke render (fallback), smoke render (image), fallback when no image, data-slot on all sub-components, className merging (×3), size variants (sm/md/lg), ref forwarding, a11y |
| 3 | Verify avatar-group tests | 10 tests pass: multiple avatars, all visible without max, max overflow, overflow count, no overflow when max >= count, z-index ordering, data-slot, className merging, ref forwarding, a11y |
| 4 | Verify tooltip tests | 9 tests pass: trigger render, hidden by default, show on hover, hide on leave, data-slot on trigger/content, className merging, sideOffset default, ref forwarding, a11y |
| 5 | Verify hover-card tests | 11 tests pass: trigger render, hidden by default, show on hover, hide on leave, data-slot on trigger/content, className merging (trigger/content), default align/sideOffset, rich content, ref forwarding, a11y |
| 6 | Verify progress tests | 13 tests pass: smoke render, translateX at 0/50/100, undefined value, data-slot on root/indicator, className merging, ref forwarding, aria-valuenow, aria-valuemin/max, role, a11y |

### Accessibility Verification

Every test file includes at least one `vitest-axe` assertion using `expect(await axe(container)).toHaveNoViolations()`. These assertions run as part of the standard test suite and verify:

- Correct ARIA roles and attributes
- No missing labels or descriptions
- Proper focus management
- Color contrast compliance (where applicable in jsdom)

## 6. Implementation Order

| Step | Action | Command/Check | Pass Criteria |
|------|--------|---------------|---------------|
| 1 | Verify Radix dependencies in `package.json` | Read `packages/ui/package.json` and confirm all four Radix packages are present | All four `@radix-ui/react-*` packages listed under `dependencies` |
| 2 | Verify public API exports in `index.ts` | Read `packages/ui/src/index.ts` and confirm all Phase 2 exports | All components, types, and style exports present for Avatar, Avatar Group, Tooltip, Hover Card, Progress |
| 3 | Run `pnpm install` | `pnpm install` | Exit code 0, no unresolved peer dependencies |
| 4 | Run TypeScript type check | `pnpm typecheck` | Exit code 0, zero TypeScript errors |
| 5 | Run full test suite | `pnpm test --filter @components/ui` | Exit code 0, all ~56 Phase 2 tests pass |
| 6 | Run build | `pnpm build` | Exit code 0, `dist/` output includes all Phase 2 components |
| 7 | Verify build output | Check that `dist/components/avatar/`, `dist/components/avatar-group/`, `dist/components/tooltip/`, `dist/components/hover-card/`, `dist/components/progress/` directories exist with `.js` and `.d.ts` files | All component directories and files present in `dist/` |
| 8 | Validate phase exit criteria | Cross-reference all 18 exit criteria from the phase spec against test results and build output | All 18 criteria satisfied |

## 7. Verification Commands

```bash
# Step 1: Ensure all dependencies are installed
pnpm install

# Step 2: TypeScript type checking (entire workspace)
pnpm typecheck

# Step 3: Run the full @components/ui test suite with verbose output
pnpm --filter @components/ui test -- --reporter=verbose

# Step 4: Run only Phase 2 component tests for targeted verification
pnpm --filter @components/ui test -- --reporter=verbose src/components/avatar/avatar.test.tsx src/components/avatar-group/avatar-group.test.tsx src/components/tooltip/tooltip.test.tsx src/components/hover-card/hover-card.test.tsx src/components/progress/progress.test.tsx

# Step 5: Build the @components/ui package
pnpm build

# Step 6: Verify build output includes all Phase 2 components
ls packages/ui/dist/components/avatar/
ls packages/ui/dist/components/avatar-group/
ls packages/ui/dist/components/tooltip/
ls packages/ui/dist/components/hover-card/
ls packages/ui/dist/components/progress/

# Step 7: Verify all Phase 2 exports are in the compiled index
grep -E "avatar|tooltip|hover-card|progress" packages/ui/dist/index.d.ts

# Step 8: Verify Storybook starts without errors (manual check — starts on port 6006)
pnpm storybook
```

## 8. Design Deviations

None.

All five component implementations (t01–t05) followed the phase spec and task specs as written. The integration verification task confirms correctness without requiring any deviations from the prescribed approach.

The task spec mentions "Install new Radix dependencies" as a deliverable, but all four Radix dependencies (`@radix-ui/react-avatar`, `@radix-ui/react-tooltip`, `@radix-ui/react-hover-card`, `@radix-ui/react-progress`) were already added to `packages/ui/package.json` during the implementation of tasks t01, t03, t04, and t05 respectively. No additional installation is needed — this step becomes a verification rather than an action.