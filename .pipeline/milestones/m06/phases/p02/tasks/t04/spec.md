# Task 4: Public API Exports & Integration Verification

## Objective

Add all three new components and their types to the public API barrel file and verify that the entire phase integrates correctly by running type checks, tests, and Storybook.

## Deliverables

### 1. Update `packages/ui/src/index.ts`

Add the following exports, following the existing pattern in the file:

```typescript
export { CopyToClipboard, type CopyToClipboardProps } from './components/copy-to-clipboard/copy-to-clipboard.js'
export { CodeBlock, type CodeBlockProps } from './components/code-block/code-block.js'
export { ConnectionStatus, type ConnectionStatusProps, connectionStatusVariants, connectionStatusDotVariants } from './components/connection-status/connection-status.js'
```

### 2. Verification Steps

- Run `pnpm typecheck` — must pass with no TypeScript errors across the monorepo
- Run `pnpm test` — must pass with zero failures for all component tests including the three new ones
- Run `pnpm storybook` and verify all three components render correctly with all variants documented via autodocs

## Dependencies
- **Task 1 (Copy to Clipboard)** must be complete
- **Task 2 (Code Block)** must be complete
- **Task 3 (Connection Status)** must be complete
- All 15 component files must exist before this task begins

## Key Constraints
- Follow the existing export pattern in `packages/ui/src/index.ts`
- Export components, prop types, and CVA variant functions (where applicable)
- Connection Status exports both `connectionStatusVariants` and `connectionStatusDotVariants`
- Copy to Clipboard has no CVA variants to export (plain string styles, not re-exported)
- Code Block has no CVA variants to export (plain string styles, not re-exported)

## Verification Criteria
1. `packages/ui/src/index.ts` contains exports for all three components, their prop types, and CVA variant functions
2. `pnpm typecheck` passes with no errors
3. `pnpm test` passes with zero failures
4. All three components render in Storybook with autodocs
5. No regressions in existing component tests or type checks