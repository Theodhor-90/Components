# Task 5: Spinner

## Objective

Implement the Spinner component — a custom component (no shadcn/ui equivalent) that renders an animated SVG loading indicator with `sm`, `md`, `lg` size variants via CVA. This is the first custom component in the library, benefiting from conventions established by the earlier shadcn ports.

## Deliverables

### Files to Create

Create `packages/ui/src/components/spinner/` directory with 5 files:

1. **`spinner.tsx`** — Renders an animated SVG with a circular path. Props: `size` (`"sm" | "md" | "lg"`), `className`, `ref`. Applies `data-slot="spinner"`, `role="status"`. Includes a `<span className="sr-only">` element with default text `"Loading"`. When `aria-label` is provided on the root element, the `sr-only` span is omitted to avoid duplicate announcements. SVG uses `currentColor` for stroke so it inherits text color from parent.

2. **`spinner.styles.ts`** — CVA definition with `size` variant: `sm` → `h-4 w-4`, `md` → `h-6 w-6`, `lg` → `h-8 w-8`. Default: `"md"`. Base classes: `animate-spin text-muted-foreground`.

3. **`spinner.types.ts`** — `SpinnerProps` extending `React.ComponentProps<'svg'>` intersected with `VariantProps<typeof spinnerVariants>`.

4. **`spinner.test.tsx`** — Tests: smoke render, `role="status"` present, default accessible name ("Loading"), all three sizes apply correct dimension classes, custom className, `data-slot`, custom `aria-label` overrides default, accessibility (axe).

5. **`spinner.stories.tsx`** — Stories: `Default` (md), `Small`, `Large`, `CustomColor` (with `className="text-primary"`), `InButton` (Spinner inside a disabled Button).

### Files to Modify

- Export `Spinner`, `type SpinnerProps`, and `spinnerVariants` from `packages/ui/src/index.ts`

## Implementation Constraints

- Follow the canonical 5-file pattern established by the Button reference component
- Custom animated SVG with `stroke-dasharray` animation (Design Decision DD-3)
- No `asChild` support (Design Decision DD-6 — SVG with internal structure)
- Accessible label uses `<span className="sr-only">Loading</span>` (Tailwind's built-in screen-reader-only utility), NOT the VisuallyHidden component which hasn't been built yet (Design Decision DD-8)
- SVG uses `currentColor` for stroke to inherit text color
- Use `cn()` helper to merge className with CVA variants
- Apply `data-slot="spinner"` on the root element
- React 19 ref-as-prop — do NOT use `forwardRef`
- Named exports only — no default exports
- Storybook stories must use CSF3 format with `tags: ['autodocs']`
- Tests must include vitest-axe accessibility assertions

## Dependencies

- No dependency on other tasks within this phase (though it benefits from conventions established by earlier tasks)
- Pre-existing: `cn()` helper, `class-variance-authority`, Button reference

## Verification Criteria

1. `packages/ui/src/components/spinner/` exists with exactly 5 files
2. Spinner renders an animated SVG in three sizes (`sm`/`md`/`lg`)
3. `role="status"` is present on the root element
4. Default accessible label "Loading" is present via `sr-only` span
5. When `aria-label` is provided, `sr-only` span is omitted
6. SVG uses `currentColor` and inherits text color from parent
7. `data-slot="spinner"` is present on the root element
8. `pnpm test` passes for spinner tests including axe accessibility assertions
9. `pnpm typecheck` passes with no errors
10. Spinner, SpinnerProps, and spinnerVariants are exported from `packages/ui/src/index.ts`
11. Storybook stories render all sizes and color variants correctly
