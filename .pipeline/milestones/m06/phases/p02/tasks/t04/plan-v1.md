All exports are already in place from the sibling tasks. The task t04 is purely about verification and confirming the exports are correct. Now I have all the information I need to produce the plan.

# Task 4: Public API Exports & Integration Verification — Implementation Plan

## 1. Deliverables

| # | File | Type | Purpose |
|---|------|------|---------|
| 1 | `packages/ui/src/index.ts` | Verify (no changes needed) | Confirm all Phase 2 component exports are present and correct |

**Note:** Tasks t01, t02, and t03 already added the required exports to `packages/ui/src/index.ts` as part of their deliverables. This task verifies correctness and runs integration checks. No new files are created or modified.

### Exports to Verify

The following exports must already be present in `packages/ui/src/index.ts` (lines 461–474):

```typescript
export {
  CopyToClipboard,
  type CopyToClipboardProps,
} from './components/copy-to-clipboard/copy-to-clipboard.js';
export { copyToClipboardStyles } from './components/copy-to-clipboard/copy-to-clipboard.styles.js';
export { CodeBlock, type CodeBlockProps } from './components/code-block/code-block.js';
export {
  ConnectionStatus,
  type ConnectionStatusProps,
} from './components/connection-status/connection-status.js';
export {
  connectionStatusVariants,
  connectionStatusDotVariants,
} from './components/connection-status/connection-status.styles.js';
```

## 2. Dependencies

### Prior Tasks (must be complete)

- **Task t01 (Copy to Clipboard)** — all 5 files in `packages/ui/src/components/copy-to-clipboard/` must exist and pass tests
- **Task t02 (Code Block)** — all 5 files in `packages/ui/src/components/code-block/` must exist and pass tests
- **Task t03 (Connection Status)** — all 5 files in `packages/ui/src/components/connection-status/` must exist and pass tests

### External Libraries

No new dependencies. All three components use only packages already installed in the monorepo.

## 3. Implementation Details

### Deliverable 1: Verify `packages/ui/src/index.ts`

**Purpose:** Confirm that all Phase 2 components, their prop types, and CVA variant functions are correctly exported from the package's public API.

**What to verify:**

1. **CopyToClipboard exports** (added by t01):
   - `CopyToClipboard` — component function
   - `type CopyToClipboardProps` — props type
   - `copyToClipboardStyles` — plain string style constant (exported from styles file)
   - No CVA variants to export (plain string styles, not CVA)

2. **CodeBlock exports** (added by t02):
   - `CodeBlock` — component function
   - `type CodeBlockProps` — props type
   - No CVA variants to export (plain string styles, not CVA)
   - Note: `codeBlockStyles`, `codeBlockPreStyles`, `codeBlockHeaderStyles`, `codeBlockLineNumberStyles` are internal style constants. Per the phase spec, CodeBlock has no CVA variants to re-export. The task spec does not require exporting the plain string style constants for CodeBlock (unlike CopyToClipboard, whose `copyToClipboardStyles` was exported by t01).

3. **ConnectionStatus exports** (added by t03):
   - `ConnectionStatus` — component function
   - `type ConnectionStatusProps` — props type
   - `connectionStatusVariants` — CVA variant function for the container
   - `connectionStatusDotVariants` — CVA variant function for the status dot

**Current state:** All exports are already present at lines 461–474 of `packages/ui/src/index.ts`. The task confirms these are correct and runs verification commands.

## 4. API Contracts

N/A — This task does not introduce new API surface. It verifies the existing exports added by t01, t02, and t03.

### Verified Public API Surface

| Export | Type | Source |
|--------|------|--------|
| `CopyToClipboard` | Component function | `copy-to-clipboard.tsx` |
| `CopyToClipboardProps` | Type | `copy-to-clipboard.types.ts` |
| `copyToClipboardStyles` | `string` constant | `copy-to-clipboard.styles.ts` |
| `CodeBlock` | Component function | `code-block.tsx` |
| `CodeBlockProps` | Type | `code-block.types.ts` |
| `ConnectionStatus` | Component function | `connection-status.tsx` |
| `ConnectionStatusProps` | Type | `connection-status.types.ts` |
| `connectionStatusVariants` | CVA function | `connection-status.styles.ts` |
| `connectionStatusDotVariants` | CVA function | `connection-status.styles.ts` |

## 5. Test Plan

This task does not create new test files. It runs the existing test suites and type checker to confirm integration correctness.

### 5.1 Type Check Verification

**Command:** `pnpm typecheck`

**What it verifies:**
- All export paths in `index.ts` resolve to valid modules
- All re-exported types are correctly defined
- No circular dependency issues between components (e.g., CodeBlock → CopyToClipboard)
- No type errors across the entire monorepo

### 5.2 Test Suite Verification

**Command:** `pnpm test`

**What it verifies:**
- All 15 Phase 2 component files (5 per component) are correctly structured
- Copy to Clipboard: 10 tests (smoke, data-slot, ref, className, clipboard API, icon swap, timeout reset, aria-label toggle, asChild, a11y)
- Code Block: 10 tests (smoke, data-slot, ref, className, pre/code elements, language label, line numbers on/off, copy button, a11y)
- Connection Status: 12 tests (smoke, data-slot root/dot, ref, className, default labels ×3, custom label, color classes, animate-pulse, ARIA attributes, a11y)
- No regressions in existing component tests from prior milestones

### 5.3 Storybook Verification

**Command:** `pnpm storybook` (manual visual check)

**What it verifies:**
- CopyToClipboard stories: Default, AsChild, WithLongText
- CodeBlock stories: Default, WithLanguageLabel, WithLineNumbers, WithLineNumbersAndLanguage, LongContent, EmptyContent
- ConnectionStatus stories: Connected, Connecting, Disconnected, CustomLabel, AllStates
- All stories render with autodocs enabled
- No console errors in Storybook

## 6. Implementation Order

1. **Verify file existence** — Confirm all 15 component files exist across the three directories (`copy-to-clipboard/`, `code-block/`, `connection-status/`)
2. **Verify `index.ts` exports** — Read `packages/ui/src/index.ts` and confirm all Phase 2 exports are present with correct paths and export names
3. **Run `pnpm typecheck`** — Ensure TypeScript compilation succeeds across the monorepo with no errors
4. **Run `pnpm test`** — Ensure all test suites pass including the three new component test suites
5. **Run `pnpm storybook`** — Start Storybook and verify all three components render correctly with autodocs (manual verification)

## 7. Verification Commands

```bash
# 1. Verify all 15 Phase 2 component files exist
ls packages/ui/src/components/copy-to-clipboard/copy-to-clipboard.{types,styles,tsx,test.tsx,stories.tsx}
ls packages/ui/src/components/code-block/code-block.{types,styles,tsx,test.tsx,stories.tsx}
ls packages/ui/src/components/connection-status/connection-status.{types,styles,tsx,test.tsx,stories.tsx}

# 2. Verify exports in index.ts contain all Phase 2 components
grep -n 'CopyToClipboard\|CodeBlock\|ConnectionStatus\|connectionStatusVariants\|connectionStatusDotVariants\|copyToClipboardStyles' packages/ui/src/index.ts

# 3. Run TypeScript type checking across the monorepo
pnpm typecheck

# 4. Run the full test suite
pnpm test

# 5. Run tests filtered to Phase 2 components only (quick check)
pnpm --filter @components/ui test -- --reporter=verbose copy-to-clipboard code-block connection-status

# 6. Launch Storybook for manual visual verification
pnpm storybook
```

## 8. Design Deviations

None.

All exports follow the existing pattern in `packages/ui/src/index.ts`. The sibling tasks (t01, t02, t03) already added their exports as part of their deliverables, so this task is purely a verification step confirming the integration is correct. The export pattern matches the phase spec exactly:
- Components and types are exported from the component `.tsx` file
- CVA variant functions are exported from the `.styles.ts` file
- Plain string style constants (like `copyToClipboardStyles`) are also exported from the `.styles.ts` file where applicable