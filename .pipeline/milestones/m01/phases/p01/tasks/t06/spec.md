# Task 6: Alert

## Objective

Implement the Alert compound component — a shadcn/ui port with three sub-components (`Alert`, `AlertTitle`, `AlertDescription`) supporting `default` and `destructive` variants. This is the final and most complex task in the phase, combining the CVA variant pattern (from Badge) with the compound component pattern (from Card).

## Deliverables

### Files to Create

Create `packages/ui/src/components/alert/` directory with 5 files:

1. **`alert.tsx`** — Three named exports:
   - `Alert` (`<div role="alert">`, `data-slot="alert"`) — supports `variant` prop (`"default" | "destructive"`)
   - `AlertTitle` (`<h5>`, `data-slot="alert-title"`)
   - `AlertDescription` (`<div>`, `data-slot="alert-description"`)
     No sub-component supports `asChild`.

2. **`alert.styles.ts`** — CVA definition for Alert with `variant`:
   - `default` → `bg-background text-foreground`
   - `destructive` → `border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive`
   - Base classes: `relative w-full rounded-lg border p-4 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&:has(svg)]:pl-11`
   - Default variant: `"default"`

3. **`alert.types.ts`** — `AlertProps` extending `React.ComponentProps<'div'>` + `VariantProps<typeof alertVariants>`. `AlertTitleProps` extending `React.ComponentProps<'h5'>`. `AlertDescriptionProps` extending `React.ComponentProps<'div'>`.

4. **`alert.test.tsx`** — Tests: smoke render, `role="alert"` present, default variant classes, destructive variant classes, compound composition (Alert + AlertTitle + AlertDescription), with icon (SVG child shifts content), custom className on each, `data-slot` on each, accessibility (axe).

5. **`alert.stories.tsx`** — Stories: `Default`, `Destructive`, `WithIcon` (using an inline SVG icon), `WithTitle`, `WithTitleAndDescription`.

### Files to Modify

- Export `Alert`, `AlertTitle`, `AlertDescription`, their prop types, and `alertVariants` from `packages/ui/src/index.ts`

## Implementation Constraints

- Follow the canonical 5-file pattern established by the Button reference component
- Uses semantic color tokens, not hardcoded colors (Design Decision DD-5): `default` uses `bg-background text-foreground`, `destructive` uses `border-destructive/50 text-destructive` with dark mode adjustments
- No `asChild` support on any sub-component (Design Decision DD-6)
- The SVG icon positioning pattern uses CSS selectors `[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4` with `[&:has(svg)]:pl-11` padding adjustment
- Use `cn()` helper to merge className with CVA variants
- Apply unique `data-slot` on each sub-component
- React 19 ref-as-prop — do NOT use `forwardRef`
- Named exports only — no default exports
- Storybook stories must use CSF3 format with `tags: ['autodocs']`
- Tests must include vitest-axe accessibility assertions

## Dependencies

- No hard dependency on other tasks, but this task combines patterns from Badge (CVA variants) and Card (compound component), so implementing those first is recommended
- Pre-existing: `cn()` helper, `class-variance-authority`, `globals.css` with semantic tokens, Button reference

## Verification Criteria

1. `packages/ui/src/components/alert/` exists with exactly 5 files
2. Alert renders with `role="alert"` on the root element
3. Default variant applies `bg-background text-foreground` classes
4. Destructive variant applies `border-destructive/50 text-destructive` classes
5. SVG icon child is absolutely positioned and content is shifted with `pl-11`
6. Each sub-component has its own `data-slot` value
7. `pnpm test` passes for alert tests including axe accessibility assertions
8. `pnpm typecheck` passes with no errors
9. Alert, AlertTitle, AlertDescription, their prop types, and alertVariants are exported from `packages/ui/src/index.ts`
10. Storybook stories render all variants and compositions correctly
11. No new ESLint or Prettier violations are introduced
