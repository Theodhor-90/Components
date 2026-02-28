# Task 1: Separator

## Objective

Implement the Separator component — a shadcn/ui port wrapping `@radix-ui/react-separator` that renders a horizontal or vertical visual divider. This is the simplest component in the phase and introduces the Radix wrapping pattern.

## Deliverables

### Dependency Installation

- Install `@radix-ui/react-separator` as a dependency in `packages/ui/package.json`

### Files to Create

Create `packages/ui/src/components/separator/` directory with 5 files:

1. **`separator.tsx`** — Wraps `@radix-ui/react-separator` Root. Props: `orientation` (`"horizontal" | "vertical"`, default `"horizontal"`), `decorative` (boolean, default `true`), `className`, `ref`. Applies `data-slot="separator"`. Renders with `shrink-0 bg-border` base classes, `h-px w-full` for horizontal, `h-full w-px` for vertical.

2. **`separator.styles.ts`** — CVA definition with `orientation` variant (`horizontal` / `vertical`). Default variant: `"horizontal"`.

3. **`separator.types.ts`** — `SeparatorProps` extending `React.ComponentProps<typeof SeparatorPrimitive.Root>` intersected with `VariantProps<typeof separatorVariants>`.

4. **`separator.test.tsx`** — Tests: smoke render (horizontal), vertical orientation, custom className merging, `data-slot` attribute, `role="separator"` for non-decorative, `aria-orientation` for vertical, accessibility (axe).

5. **`separator.stories.tsx`** — Stories: `Horizontal` (default), `Vertical` (in a flex row), `InCard` (demonstrating real usage between content sections).

### Files to Modify

- Export `Separator`, `type SeparatorProps`, and `separatorVariants` from `packages/ui/src/index.ts`

## Implementation Constraints

- Follow the canonical 5-file pattern established by the Button reference component in `packages/ui/src/components/button/`
- Use `@radix-ui/react-separator` for correct `role="separator"` semantics and `aria-orientation` on vertical separators (Design Decision DD-2)
- Use `cn()` helper from `../../lib/utils.js` to merge className with CVA variants
- Apply `data-slot="separator"` on the root element
- React 19 ref-as-prop — do NOT use `forwardRef`
- Named exports only — no default exports
- Storybook stories must use CSF3 format with `tags: ['autodocs']`
- Tests must include vitest-axe accessibility assertions
- Use `@testing-library/user-event` for interaction tests (not `fireEvent`)

## Dependencies

- No dependency on other tasks within this phase
- Pre-existing: monorepo scaffolding, Button reference, `cn()` helper, `globals.css`, Storybook, Vitest infrastructure, `@radix-ui/react-slot`, `class-variance-authority`

## Verification Criteria

1. `packages/ui/src/components/separator/` exists with exactly 5 files
2. `@radix-ui/react-separator` is listed in `packages/ui/package.json` dependencies
3. Separator renders as a horizontal divider by default and as a vertical divider when `orientation="vertical"`
4. Non-decorative instances have correct `role="separator"` and `aria-orientation`
5. `data-slot="separator"` is present on the root element
6. `pnpm test` passes for separator tests including axe accessibility assertions
7. `pnpm typecheck` passes with no errors
8. Separator, SeparatorProps, and separatorVariants are exported from `packages/ui/src/index.ts`
9. Storybook stories render all variants correctly
