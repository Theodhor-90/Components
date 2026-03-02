Now I have everything I need. Let me produce the specification.

# Task 03: Exports and Integration Verification — Implementation Plan

## 1. Deliverables

| File                       | Action                     | Purpose                                                                                                                                                                       |
| -------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/ui/src/index.ts` | Verify (no changes needed) | Confirm that `Header`, `type HeaderProps`, `headerVariants`, `AppLayout`, `type AppLayoutProps`, and `appLayoutVariants` exports are already present and correctly structured |
| (no new files)             | —                          | This task is a verification-only task; t01 and t02 already added the export lines                                                                                             |

**Note:** Inspection of the current `packages/ui/src/index.ts` (lines 273–276) shows the following exports already exist:

```typescript
export { Header, type HeaderProps } from './components/header/header.js';
export { headerVariants } from './components/header/header.styles.js';
export { AppLayout, type AppLayoutProps } from './components/app-layout/app-layout.js';
export { appLayoutVariants } from './components/app-layout/app-layout.styles.js';
```

These follow the established project pattern (named exports, `type` keyword for type-only exports, `.js` extensions for ESM). No modifications to `index.ts` are required.

## 2. Dependencies

No new dependencies are needed. All required packages are already installed:

- `class-variance-authority` — already in `packages/ui/package.json`
- `@radix-ui/react-slot` — already in `packages/ui/package.json`
- `@components/hooks` — already in `packages/ui/package.json` (workspace dependency)
- `@radix-ui/react-scroll-area` — already in `packages/ui/package.json`
- `@radix-ui/react-dialog` — already in `packages/ui/package.json` (used by Sheet in AppLayout)
- `@radix-ui/react-separator` — already in `packages/ui/package.json` (used by Header)

## 3. Implementation Details

### 3.1 Verify `packages/ui/src/index.ts` exports

**Purpose:** Confirm all Phase 3 (Application Shell) component exports are present and correctly structured.

**Expected exports (already present at lines 273–276):**

| Export              | Source                                         | Type                                 |
| ------------------- | ---------------------------------------------- | ------------------------------------ |
| `Header`            | `./components/header/header.js`                | Value (function component)           |
| `HeaderProps`       | `./components/header/header.js`                | Type (re-export with `type` keyword) |
| `headerVariants`    | `./components/header/header.styles.js`         | Value (CVA function)                 |
| `AppLayout`         | `./components/app-layout/app-layout.js`        | Value (function component)           |
| `AppLayoutProps`    | `./components/app-layout/app-layout.js`        | Type (re-export with `type` keyword) |
| `appLayoutVariants` | `./components/app-layout/app-layout.styles.js` | Value (CVA function)                 |

**Verification checklist:**

1. Each export uses `.js` extension (ESM convention for TypeScript build output)
2. Type exports use `type` keyword: `type HeaderProps`, `type AppLayoutProps`
3. CVA variants are exported from the `.styles.js` file (separate from the component file)
4. Exports follow the same pattern as other components (e.g., Button at line 4–5, Separator at line 6–7)

### 3.2 Run full verification pipeline

Run the four verification commands in sequence to confirm the entire monorepo builds and passes correctly with the new Phase 3 components.

## 4. API Contracts

N/A — This task does not introduce any new API surface. It verifies existing exports.

The public API surface added by t01 and t02 (and confirmed by this task) is:

```typescript
// Header (from t01)
import { Header, type HeaderProps, headerVariants } from '@components/ui';

// AppLayout (from t02)
import { AppLayout, type AppLayoutProps, appLayoutVariants } from '@components/ui';
```

## 5. Test Plan

This task does not create new test files. It runs the existing test suites to verify integration.

### 5.1 TypeScript compilation verification (`pnpm typecheck`)

**What to verify:**

- Zero type errors across the entire monorepo
- All export paths resolve correctly (no "module not found" errors)
- `HeaderProps` and `AppLayoutProps` types are correctly re-exported
- No circular dependency warnings

### 5.2 Unit test verification (`pnpm test`)

**What to verify:**

- All existing tests continue to pass (no regressions from new components)
- Header tests pass: smoke render, data-slot, children/actions/userInfo slots, Separator conditional rendering, asChild, className merge, accessibility (vitest-axe)
- AppLayout tests pass: smoke render, data-slot, sidebar desktop/mobile rendering, header rendering, scroll area, defaultOpen, controlled state, className merge, accessibility (vitest-axe)

### 5.3 Build verification (`pnpm build`)

**What to verify:**

- Clean build with no errors
- `dist/index.js` contains the Header and AppLayout exports
- `dist/index.d.ts` contains the type declarations

### 5.4 Storybook verification (manual)

**What to verify:**

- Header stories render: Default, WithActions, WithUserInfo, FullHeader, AsChild
- AppLayout stories render: Default, CollapsedSidebar, WithHeaderAndSidebar, FullShell, MobileView
- Autodocs pages generate correctly for both components

## 6. Implementation Order

1. **Verify `index.ts` exports** — Read `packages/ui/src/index.ts` and confirm lines 273–276 contain the correct Header and AppLayout exports matching the established pattern. If any exports are missing or incorrectly structured, add/fix them.

2. **Run `pnpm typecheck`** — Execute at monorepo root. Must exit with code 0 and zero errors. If type errors are found, diagnose and fix before proceeding.

3. **Run `pnpm test`** — Execute at monorepo root. All tests must pass, including Header (10 tests) and AppLayout (9 tests) with vitest-axe accessibility assertions. If any tests fail, diagnose and fix.

4. **Run `pnpm build`** — Execute at monorepo root. Must produce clean build output. Verify that `packages/ui/dist/index.js` and `packages/ui/dist/index.d.ts` are generated.

5. **Verify Storybook rendering** — Run `pnpm storybook` and manually confirm both Header and AppLayout components render correctly with all stories and autodocs. (Note: This is a manual step that cannot be fully automated in CI.)

## 7. Verification Commands

```bash
# 1. Verify exports exist in index.ts (quick sanity check)
grep -n "Header\|AppLayout" packages/ui/src/index.ts

# 2. TypeScript type checking across the entire monorepo
pnpm typecheck

# 3. Run all tests (including Header and AppLayout tests with vitest-axe)
pnpm test

# 4. Build all packages (tokens → utils → hooks → ui)
pnpm build

# 5. Verify dist output contains the exports
grep "Header\|AppLayout" packages/ui/dist/index.js
grep "Header\|AppLayout" packages/ui/dist/index.d.ts

# 6. Launch Storybook for manual visual verification (optional, interactive)
# pnpm storybook
```

All commands run from the monorepo root (`/Users/theodhor/Desktop/Portfolio/Components`). The package manager is pnpm 9. Build orchestration is handled by Turborepo.

## 8. Design Deviations

None.

The task spec prescribes adding exports to `index.ts` and running verification commands. Inspection of the current `index.ts` (lines 273–276) shows the exports were already added by t01 and t02 following the correct pattern. This task therefore focuses entirely on verification rather than modification. No deviation from the spec is needed — the spec says "Add exports" and the exports exist; the verification commands are run exactly as prescribed.
