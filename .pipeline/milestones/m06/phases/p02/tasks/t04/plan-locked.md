Now I understand the landscape. There is precedent for exporting plain string style constants (e.g., `avatarGroupStyles`, `progressStyles`), so the `copyToClipboardStyles` export has consistency rationale. However, the task spec explicitly says "not re-exported." The cleanest resolution: add a step to remove the `copyToClipboardStyles` export line to match the task spec.

Now let me produce the revised plan:

# Task 4: Public API Exports & Integration Verification — Implementation Plan

## 1. Deliverables

| # | File | Type | Purpose |
|---|------|------|---------|
| 1 | `packages/ui/src/index.ts` | Modified | Remove extraneous `copyToClipboardStyles` export to match task spec |

**Note:** Tasks t01, t02, and t03 already added the required exports to `packages/ui/src/index.ts` as part of their deliverables. This task corrects one extraneous export (see Section 3, Deliverable 1) and then runs integration checks to verify the full Phase 2 surface is correct.

### Exports After Correction

The following exports must be present in `packages/ui/src/index.ts` after this task completes:

```typescript
export {
  CopyToClipboard,
  type CopyToClipboardProps,
} from './components/copy-to-clipboard/copy-to-clipboard.js';
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

The following export must be **removed**:

```typescript
// REMOVE this line (currently at line 465):
export { copyToClipboardStyles } from './components/copy-to-clipboard/copy-to-clipboard.styles.js';
```

## 2. Dependencies

### Prior Tasks (must be complete)

- **Task t01 (Copy to Clipboard)** — all 5 files in `packages/ui/src/components/copy-to-clipboard/` must exist and pass tests
- **Task t02 (Code Block)** — all 5 files in `packages/ui/src/components/code-block/` must exist and pass tests
- **Task t03 (Connection Status)** — all 5 files in `packages/ui/src/components/connection-status/` must exist and pass tests

### External Libraries

No new dependencies. All three components use only packages already installed in the monorepo.

## 3. Implementation Details

### Deliverable 1: Correct and verify `packages/ui/src/index.ts`

**Purpose:** Ensure that all Phase 2 components, their prop types, and CVA variant functions are correctly exported from the package's public API — and that no extraneous exports are present.

**Step 1 — Remove the `copyToClipboardStyles` export:**

Task t01 added a `copyToClipboardStyles` export at line 465 of `packages/ui/src/index.ts`. The task spec explicitly states: "Copy to Clipboard has no CVA variants to export (plain string styles, not re-exported)." The phase spec confirms: "CodeBlock has no CVA variants to export (plain string styles, not CVA)" and uses the same "not re-exported" language for CopyToClipboard. Therefore, the `copyToClipboardStyles` line must be deleted.

**Action:** Delete the line:
```typescript
export { copyToClipboardStyles } from './components/copy-to-clipboard/copy-to-clipboard.styles.js';
```

**Step 2 — Verify the remaining exports are correct:**

1. **CopyToClipboard exports** (added by t01):
   - `CopyToClipboard` — component function
   - `type CopyToClipboardProps` — props type
   - No style constants or CVA variants exported (per task spec: "plain string styles, not re-exported")

2. **CodeBlock exports** (added by t02):
   - `CodeBlock` — component function
   - `type CodeBlockProps` — props type
   - No style constants or CVA variants exported (per task spec: "Code Block has no CVA variants to export")

3. **ConnectionStatus exports** (added by t03):
   - `ConnectionStatus` — component function
   - `type ConnectionStatusProps` — props type
   - `connectionStatusVariants` — CVA variant function for the container
   - `connectionStatusDotVariants` — CVA variant function for the status dot

## 4. API Contracts

### Verified Public API Surface

| Export | Type | Source |
|--------|------|--------|
| `CopyToClipboard` | Component function | `copy-to-clipboard.tsx` |
| `CopyToClipboardProps` | Type | `copy-to-clipboard.types.ts` |
| `CodeBlock` | Component function | `code-block.tsx` |
| `CodeBlockProps` | Type | `code-block.types.ts` |
| `ConnectionStatus` | Component function | `connection-status.tsx` |
| `ConnectionStatusProps` | Type | `connection-status.types.ts` |
| `connectionStatusVariants` | CVA function | `connection-status.styles.ts` |
| `connectionStatusDotVariants` | CVA function | `connection-status.styles.ts` |

**Not exported** (internal implementation detail):
- `copyToClipboardStyles` — plain string constant, consumed only by `copy-to-clipboard.tsx` internally
- `codeBlockStyles`, `codeBlockPreStyles`, `codeBlockHeaderStyles`, `codeBlockLineNumberStyles` — plain string constants, consumed only by `code-block.tsx` internally

## 5. Test Plan

This task does not create new test files. It runs the existing test suites and type checker to confirm integration correctness after the export correction.

### 5.1 Type Check Verification

**Command:** `pnpm typecheck`

**What it verifies:**
- All export paths in `index.ts` resolve to valid modules
- All re-exported types are correctly defined
- Removing `copyToClipboardStyles` from the public API causes no type errors (the constant is not consumed externally)
- No circular dependency issues between components (e.g., CodeBlock → CopyToClipboard)
- No type errors across the entire monorepo

### 5.2 Test Suite Verification

**Command:** `pnpm test`

**What it verifies:**
- All 15 Phase 2 component files (5 per component) are correctly structured
- Copy to Clipboard tests pass (smoke, data-slot, ref, className, clipboard API, icon swap, timeout reset, aria-label toggle, asChild, a11y)
- Code Block tests pass (smoke, data-slot, ref, className, pre/code elements, language label, line numbers on/off, copy button, a11y)
- Connection Status tests pass (smoke, data-slot root/dot, ref, className, default labels ×3, custom label, color classes, animate-pulse, ARIA attributes, a11y)
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
2. **Remove `copyToClipboardStyles` export** — Delete line 465 from `packages/ui/src/index.ts` to match the task spec
3. **Verify remaining `index.ts` exports** — Read `packages/ui/src/index.ts` and confirm all Phase 2 exports match Section 1 of this plan
4. **Run `pnpm typecheck`** — Ensure TypeScript compilation succeeds across the monorepo with no errors
5. **Run `pnpm test`** — Ensure all test suites pass including the three new component test suites
6. **Run `pnpm storybook`** — Start Storybook and verify all three components render correctly with autodocs (manual verification)

## 7. Verification Commands

```bash
# 1. Verify all 15 Phase 2 component files exist
ls packages/ui/src/components/copy-to-clipboard/copy-to-clipboard.{types,styles,tsx,test.tsx,stories.tsx}
ls packages/ui/src/components/code-block/code-block.{types,styles,tsx,test.tsx,stories.tsx}
ls packages/ui/src/components/connection-status/connection-status.{types,styles,tsx,test.tsx,stories.tsx}

# 2. Verify exports in index.ts contain all Phase 2 components (after removing copyToClipboardStyles)
grep -n 'CopyToClipboard\|CodeBlock\|ConnectionStatus\|connectionStatusVariants\|connectionStatusDotVariants' packages/ui/src/index.ts

# 3. Verify copyToClipboardStyles is NOT exported (should return no results)
grep -n 'copyToClipboardStyles' packages/ui/src/index.ts

# 4. Run TypeScript type checking across the monorepo
pnpm typecheck

# 5. Run the full test suite
pnpm test

# 6. Run tests filtered to Phase 2 components only (quick check)
pnpm --filter @components/ui test -- --reporter=verbose copy-to-clipboard code-block connection-status

# 7. Launch Storybook for manual visual verification
pnpm storybook
```

## 8. Design Deviations

### Deviation 1: Removal of `copyToClipboardStyles` export from `index.ts`

**Spec requirement:** The task spec states "Copy to Clipboard has no CVA variants to export (plain string styles, not re-exported)." The phase spec confirms: plain string style constants for CopyToClipboard and CodeBlock are internal and not part of the public API.

**Current state:** Task t01 added `export { copyToClipboardStyles } from './components/copy-to-clipboard/copy-to-clipboard.styles.js'` at line 465 of `packages/ui/src/index.ts`. This was likely done by analogy with other components that export their style constants (e.g., `avatarGroupStyles`, `progressStyles`), but it contradicts the explicit task spec directive.

**Decision:** Remove the `copyToClipboardStyles` export to match the task spec. The plain string constant is an internal implementation detail consumed only by `copy-to-clipboard.tsx`. Consumers who need to reference the button's base classes can import directly from the component's styles file if needed, but the public API barrel intentionally excludes it. This keeps the public API surface minimal and aligned with the spec's intent that single-presentation components (no CVA variants) do not expose their style constants.