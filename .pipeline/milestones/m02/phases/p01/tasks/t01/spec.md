# Task: Input Component

## Objective

Deliver a complete Input component as a shadcn/ui port adapted to the project's 5-file pattern. The Input is a styled native `<input>` wrapper supporting all HTML input types, error states, disabled states, and both controlled and uncontrolled usage.

## Deliverables

Complete `packages/ui/src/components/input/` directory with all 5 files, plus public API export in `packages/ui/src/index.ts`.

## Files to Create

1. **`packages/ui/src/components/input/input.types.ts`** — `InputProps` extending `React.ComponentProps<'input'>` with `asChild?: boolean`. No CVA `VariantProps` (no visual variants — only base style).

2. **`packages/ui/src/components/input/input.styles.ts`** — `inputVariants` CVA definition with base classes only:
   - Layout: `flex h-10 w-full rounded-md px-3 py-2`
   - Typography: `text-sm`
   - Colors: `bg-background text-foreground placeholder:text-muted-foreground`
   - Border: `border border-input`
   - Focus: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`
   - Disabled: `disabled:cursor-not-allowed disabled:opacity-50`
   - Error: `aria-[invalid=true]:border-destructive`
   - File input: `file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground`

3. **`packages/ui/src/components/input/input.tsx`** — Functional component using `Slot` (from `@radix-ui/react-slot`) or `'input'` based on `asChild` prop. Applies `data-slot="input"`, `cn(inputVariants({ className }))`, and spreads remaining props. React 19 `ref` as prop (no `forwardRef`).

4. **`packages/ui/src/components/input/input.test.tsx`** — Vitest + Testing Library + vitest-axe tests:
   - Smoke render (renders without crashing)
   - Applies `data-slot="input"`
   - Supports custom `className`
   - Renders with `type="password"`, `type="email"`, `type="number"`, etc.
   - Supports `disabled` state
   - Shows error styling with `aria-invalid="true"`
   - Supports `placeholder`
   - Controlled usage (`value` + `onChange`)
   - Uncontrolled usage (`defaultValue`)
   - `asChild` composition
   - Accessibility: `axe` assertions on default render and error state
   - Ref forwarding

5. **`packages/ui/src/components/input/input.stories.tsx`** — CSF3 stories with `tags: ['autodocs']`:
   - Default, With Placeholder, With Value, Disabled, With Error (`aria-invalid="true"`), Password type, Email type, Number type, File type, With Label (composing with the Label component from M1)

## Files to Modify

- **`packages/ui/src/index.ts`** — Add exports:
  ```typescript
  export { Input, type InputProps } from './components/input/input.js';
  export { inputVariants } from './components/input/input.styles.js';
  ```

## Key Implementation Details

- **No CVA variants**: Input has no `variant` or `size` props. The shadcn/ui Input is single-style — visual differentiation comes from HTML `type` attributes and state-driven classes. The `inputVariants` CVA call holds only the base class string for pattern consistency.
- **Error state via `aria-invalid`**: Error styling is driven by the `aria-invalid` attribute, not a custom `error` prop. Styles target `aria-[invalid=true]:border-destructive`.
- **File input styling**: Includes `file:` variant pseudo-class styles matching shadcn/ui: `file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground`.
- **`asChild` support**: Uses `@radix-ui/react-slot` (already installed) for polymorphic rendering.
- **Follow the canonical Button component pattern**: Study all 5 files of `packages/ui/src/components/button/` as the reference implementation.
- **React 19 conventions**: `ref` as prop, no `forwardRef`, named exports only, `import type` for type-only imports.

## Dependencies

- No dependencies on other tasks in this phase (this is the first task).
- Requires Milestone 1 complete (Label component for story composition, `cn()` utility, CVA, Tailwind v4, Vitest + vitest-axe, Storybook 8.5).
- Requires `@radix-ui/react-slot` (already installed).
- No new npm dependencies needed.

## Verification Criteria

1. `packages/ui/src/components/input/` contains all 5 files
2. `pnpm test` passes — all Input tests green, including vitest-axe accessibility assertions
3. `pnpm typecheck` passes with no errors in the `@components/ui` package
4. Input renders correctly for `type="text"`, `type="password"`, `type="email"`, `type="number"`, and `type="file"`
5. Supports controlled (`value` + `onChange`) and uncontrolled (`defaultValue`) usage
6. Displays destructive border color when `aria-invalid="true"` is set
7. Shows disabled styling when `disabled` prop is set
8. Renders in Storybook with all stories visible under autodocs
9. Exported from `packages/ui/src/index.ts` (component, props type, and variants function)
10. Root element includes `data-slot="input"` attribute
