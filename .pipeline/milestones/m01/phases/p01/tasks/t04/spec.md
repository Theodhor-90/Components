# Task 4: Skeleton

## Objective

Implement the Skeleton component — a shadcn/ui port that renders an `animate-pulse` placeholder div for loading states. Consumers control dimensions entirely through `className`. This component has no variants and no `asChild` support.

## Deliverables

### Files to Create

Create `packages/ui/src/components/skeleton/` directory with 5 files:

1. **`skeleton.tsx`** — Renders a `<div>` with `animate-pulse rounded-md bg-muted` base classes. Props: `className`, `ref`, and all `div` props. Applies `data-slot="skeleton"`. No variants, no `asChild`.

2. **`skeleton.styles.ts`** — Exports base class string constant. A variant-less CVA definition may be used for consistency with other components.

3. **`skeleton.types.ts`** — `SkeletonProps` extending `React.ComponentProps<'div'>`.

4. **`skeleton.test.tsx`** — Tests: smoke render, `animate-pulse` class present, custom className with custom dimensions, `data-slot`, accessibility (axe).

5. **`skeleton.stories.tsx`** — Stories: `Default`, `TextLine` (`h-4 w-[250px]`), `Circle` (`h-12 w-12 rounded-full`), `CardSkeleton` (composed layout showing realistic loading state).

### Files to Modify

- Export `Skeleton` and `type SkeletonProps` from `packages/ui/src/index.ts`

## Implementation Constraints

- Follow the canonical 5-file pattern established by the Button reference component
- Skeleton is intentionally variant-free (Design Decision DD-7)
- No `asChild` support (Design Decision DD-7)
- Consumers control dimensions entirely through `className` (e.g., `className="h-4 w-[200px]"`)
- Only applies base styling: `animate-pulse`, `rounded-md`, and `bg-muted`
- Use `cn()` helper to merge className
- Apply `data-slot="skeleton"` on the root element
- React 19 ref-as-prop — do NOT use `forwardRef`
- Named exports only — no default exports
- Storybook stories must use CSF3 format with `tags: ['autodocs']`
- Tests must include vitest-axe accessibility assertions

## Dependencies

- No dependency on other tasks within this phase
- Pre-existing: `cn()` helper, `globals.css` with `bg-muted` token, Button reference

## Verification Criteria

1. `packages/ui/src/components/skeleton/` exists with exactly 5 files
2. Skeleton renders with `animate-pulse` and `bg-muted` classes
3. Custom dimensions via `className` are properly merged
4. `data-slot="skeleton"` is present on the root element
5. `pnpm test` passes for skeleton tests including axe accessibility assertions
6. `pnpm typecheck` passes with no errors
7. Skeleton and SkeletonProps are exported from `packages/ui/src/index.ts`
8. Storybook stories render all shape variants correctly
