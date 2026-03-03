# Task: Empty State — Implementation

## Objective

Create the Empty State component following the established 5-file pattern (implementation, styles, and types files only — tests and stories are a separate task). Empty State is a custom component (no shadcn equivalent) that renders a centered placeholder layout for use when data is absent.

## Files to Create

All files under `packages/ui/src/components/empty-state/`:

### 1. `empty-state.types.ts`

Define `EmptyStateProps` extending `React.ComponentProps<'div'>` with:
- `icon?: React.ReactNode` — optional icon rendered above the title
- `title: string` — required heading text
- `description?: string` — optional body text
- `action?: React.ReactNode` — optional CTA button or link

### 2. `empty-state.styles.ts`

Export **static style strings** (no CVA — this component has no variants):
- `emptyStateStyles` — flexbox container: `flex flex-col items-center justify-center text-center p-8`
- `emptyStateIconStyles` — icon wrapper: `mb-4 text-muted-foreground [&>svg]:h-10 [&>svg]:w-10`
- `emptyStateTitleStyles` — title: `text-lg font-semibold text-foreground`
- `emptyStateDescriptionStyles` — description: `mt-1 text-sm text-muted-foreground max-w-sm`
- `emptyStateActionStyles` — action wrapper: `mt-4`

### 3. `empty-state.tsx`

Implementation requirements:
- Render a `<div data-slot="empty-state">` root with `cn(emptyStateStyles, className)`
- Conditionally render icon wrapped in `<div data-slot="empty-state-icon">` with `emptyStateIconStyles`
- Render title in `<h3 data-slot="empty-state-title">` with `emptyStateTitleStyles`
- Conditionally render description in `<p data-slot="empty-state-description">` with `emptyStateDescriptionStyles`
- Conditionally render action wrapped in `<div data-slot="empty-state-action">` with `emptyStateActionStyles`
- Accept `ref` prop (React 19 ref-as-prop pattern — no forwardRef)
- Named export only: `EmptyState`
- Use `cn()` from `@components/utils` for className merging

## Key Constraints

- This is a render-prop slots pattern, NOT a compound component — icon and action are `ReactNode` props
- No Radix primitives needed — this is pure HTML + Tailwind
- No CVA variant definitions — styles are static string constants
- Do NOT render empty wrappers when optional props are omitted
- Follow the canonical Button component as architectural reference for the 5-file pattern

## Dependencies

- No prior tasks in this phase
- Depends on M01 (Foundation) for the 5-file pattern and `cn()` utility
- No new npm dependencies required

## Verification

- `packages/ui/src/components/empty-state/` contains `empty-state.types.ts`, `empty-state.styles.ts`, and `empty-state.tsx`
- Component renders a centered layout with only the title when optional props are omitted
- Component renders all slots (icon, title, description, action) when all props are provided
- `data-slot="empty-state"` is present on the root element
- `pnpm typecheck` passes with no errors related to the new files