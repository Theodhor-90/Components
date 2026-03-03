# Task: Export Registration & Integration Verification

## Objective

Register both new components in the package's public API and verify the entire phase integrates correctly with the monorepo build, test, and documentation systems.

## Files to Modify

### `packages/ui/src/index.ts`

Add the following exports:

**Empty State:**
```ts
export { EmptyState, type EmptyStateProps } from './components/empty-state/empty-state.js';
export { emptyStateStyles, emptyStateIconStyles, emptyStateTitleStyles, emptyStateDescriptionStyles, emptyStateActionStyles } from './components/empty-state/empty-state.styles.js';
```

**Search Input:**
```ts
export { SearchInput, type SearchInputProps } from './components/search-input/search-input.js';
export { searchInputContainerStyles, searchInputIconStyles, searchInputClearStyles, searchInputFieldStyles } from './components/search-input/search-input.styles.js';
```

## Integration Verification Checklist

1. **TypeScript**: Run `pnpm typecheck` — must pass with zero errors across the entire `@components/ui` package
2. **Tests**: Run `pnpm test` — must pass with zero failures, including all new vitest-axe accessibility assertions for Empty State and Search Input
3. **Storybook**: Verify both components render correctly in Storybook (`pnpm storybook`) with all stories visible and autodocs generated
4. **Exports**: Confirm that `EmptyState`, `EmptyStateProps`, `SearchInput`, `SearchInputProps`, and all style constants are importable from `@components/ui`

## Dependencies

- **Task t01** (Empty State — Implementation) must be complete
- **Task t02** (Empty State — Tests & Stories) must be complete
- **Task t03** (Search Input — Implementation) must be complete
- **Task t04** (Search Input — Tests & Stories) must be complete

## Verification

- `packages/ui/src/index.ts` contains export lines for both components, their types, and their style constants
- `pnpm typecheck` passes with no TypeScript errors
- `pnpm test` passes with zero failures
- Both components render correctly in Storybook with all stories and autodocs
- All exports are accessible: components, prop types, and style string constants