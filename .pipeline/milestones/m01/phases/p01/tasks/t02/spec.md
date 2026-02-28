# Task 2: Badge

## Objective

Implement the Badge component — a shadcn/ui port that renders an inline status label with `default`, `secondary`, `destructive`, and `outline` variants via CVA. Supports `asChild` via Radix `Slot` for polymorphic rendering.

## Deliverables

### Files to Create

Create `packages/ui/src/components/badge/` directory with 5 files:

1. **`badge.tsx`** — Renders a `<div>` (or `Slot` when `asChild`). Props: `variant` (`"default" | "secondary" | "destructive" | "outline"`), `className`, `asChild`, `ref`. Applies `data-slot="badge"`.

2. **`badge.styles.ts`** — CVA definition with `variant` variants. Base classes: `inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2`. Variant classes:
   - `default` → `border-transparent bg-primary text-primary-foreground`
   - `secondary` → `border-transparent bg-secondary text-secondary-foreground`
   - `destructive` → `border-transparent bg-destructive text-destructive-foreground`
   - `outline` → `text-foreground`
     Default variant: `"default"`.

3. **`badge.types.ts`** — `BadgeProps` extending `React.ComponentProps<'div'>` intersected with `VariantProps<typeof badgeVariants>` plus `asChild?: boolean`.

4. **`badge.test.tsx`** — Tests: smoke render, all four variants apply correct classes, `asChild` rendering, custom className, `data-slot`, accessibility (axe).

5. **`badge.stories.tsx`** — Stories: `Default`, `Secondary`, `Destructive`, `Outline`, `AsChild`.

### Files to Modify

- Export `Badge`, `type BadgeProps`, and `badgeVariants` from `packages/ui/src/index.ts`

## Implementation Constraints

- Follow the canonical 5-file pattern established by the Button reference component
- Support `asChild` prop via `@radix-ui/react-slot` (already installed) for polymorphic rendering (Design Decision DD-6)
- Use `cn()` helper to merge className with CVA variants
- Apply `data-slot="badge"` on the root element
- React 19 ref-as-prop — do NOT use `forwardRef`
- Named exports only — no default exports
- All colors use semantic tokens from `globals.css` (e.g., `bg-primary`, `text-primary-foreground`)
- Storybook stories must use CSF3 format with `tags: ['autodocs']`
- Tests must include vitest-axe accessibility assertions

## Dependencies

- No dependency on other tasks within this phase
- Pre-existing: `@radix-ui/react-slot`, `class-variance-authority`, `cn()` helper, Button reference

## Verification Criteria

1. `packages/ui/src/components/badge/` exists with exactly 5 files
2. Badge renders all four variants (`default`, `secondary`, `destructive`, `outline`) with correct semantic token classes
3. `asChild` prop correctly renders children via Radix `Slot`
4. `data-slot="badge"` is present on the root element
5. `pnpm test` passes for badge tests including axe accessibility assertions
6. `pnpm typecheck` passes with no errors
7. Badge, BadgeProps, and badgeVariants are exported from `packages/ui/src/index.ts`
8. Storybook stories render all variants correctly
