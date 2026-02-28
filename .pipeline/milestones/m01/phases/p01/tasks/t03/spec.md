# Task 3: Card

## Objective

Implement the Card compound component — a shadcn/ui port with six sub-components (`Card`, `CardHeader`, `CardContent`, `CardFooter`, `CardTitle`, `CardDescription`), each with its own `data-slot` value. This task introduces the compound component pattern that will be reused by Alert (Task 6) and many later components.

## Deliverables

### Files to Create

Create `packages/ui/src/components/card/` directory with 5 files:

1. **`card.tsx`** — Six named exports:
   - `Card` (`<div>`, `data-slot="card"`) — root container with `rounded-xl border bg-card text-card-foreground shadow-sm`
   - `CardHeader` (`<div>`, `data-slot="card-header"`)
   - `CardTitle` (`<div>`, `data-slot="card-title"`)
   - `CardDescription` (`<div>`, `data-slot="card-description"`)
   - `CardContent` (`<div>`, `data-slot="card-content"`)
   - `CardFooter` (`<div>`, `data-slot="card-footer"`)
     No sub-component supports `asChild`.

2. **`card.styles.ts`** — Separate class strings for each sub-component. No variant props (Card has no variants in shadcn/ui).

3. **`card.types.ts`** — `CardProps`, `CardHeaderProps`, `CardTitleProps`, `CardDescriptionProps`, `CardContentProps`, `CardFooterProps` — each extending `React.ComponentProps<'div'>`.

4. **`card.test.tsx`** — Tests: smoke render of each sub-component, compound composition, custom className on each, `data-slot` on each, accessibility (axe) on a fully composed card.

5. **`card.stories.tsx`** — Stories: `Default` (fully composed card), `WithFooter`, `WithForm` (card containing form elements).

### Files to Modify

- Export all six components and all six prop types from `packages/ui/src/index.ts`

## Implementation Constraints

- Follow the canonical 5-file pattern established by the Button reference component
- All six sub-components are co-located in a single `card.tsx` file and share a single `card.styles.ts` file (Design Decision DD-4)
- Each sub-component has its own `data-slot` value
- No `asChild` support on any sub-component (Design Decision DD-6)
- Use `cn()` helper to merge className
- Card root uses semantic tokens: `bg-card`, `text-card-foreground`
- React 19 ref-as-prop — do NOT use `forwardRef`
- Named exports only — no default exports
- Storybook stories must use CSF3 format with `tags: ['autodocs']`
- Tests must include vitest-axe accessibility assertions

## Dependencies

- No dependency on other tasks within this phase
- Pre-existing: `cn()` helper, `globals.css` with card semantic tokens, Button reference

## Verification Criteria

1. `packages/ui/src/components/card/` exists with exactly 5 files
2. Card renders as a composed group of six sub-components
3. Each sub-component has its own `data-slot` value
4. Card root is styled with `bg-card` and `text-card-foreground`
5. `pnpm test` passes for card tests including axe accessibility assertions
6. `pnpm typecheck` passes with no errors
7. All six components and their prop types are exported from `packages/ui/src/index.ts`
8. Storybook stories render composed cards correctly
