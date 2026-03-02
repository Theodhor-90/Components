# Task: Textarea Component

## Objective

Deliver a complete Textarea component as a shadcn/ui port adapted to the project's 5-file pattern. The Textarea is a styled native `<textarea>` wrapper with consistent styling matching Input, an optional `autoResize` behavior, error states, disabled states, and both controlled and uncontrolled usage.

## Deliverables

Complete `packages/ui/src/components/textarea/` directory with all 5 files, plus public API export in `packages/ui/src/index.ts`.

## Files to Create

1. **`packages/ui/src/components/textarea/textarea.types.ts`** — `TextareaProps` extending `React.ComponentProps<'textarea'>` with:
   - `asChild?: boolean`
   - `autoResize?: boolean` (default `false`)

2. **`packages/ui/src/components/textarea/textarea.styles.ts`** — `textareaVariants` CVA definition with base classes:
   - Layout: `flex min-h-[80px] w-full rounded-md px-3 py-2`
   - Typography: `text-sm`
   - Colors: `bg-background text-foreground placeholder:text-muted-foreground`
   - Border: `border border-input`
   - Focus: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`
   - Disabled: `disabled:cursor-not-allowed disabled:opacity-50`
   - Error: `aria-[invalid=true]:border-destructive`
   - Note: The `field-sizing: content` style for auto-resize is applied conditionally in the component file, not as a CVA variant.

3. **`packages/ui/src/components/textarea/textarea.tsx`** — Functional component using `Slot` (from `@radix-ui/react-slot`) or `'textarea'` based on `asChild` prop. Applies `data-slot="textarea"`, merges `cn(textareaVariants({ className }))`. When `autoResize` is `true`, adds the inline style `{ fieldSizing: 'content' }` via the `style` prop (CSS `field-sizing: content`). React 19 `ref` as prop (no `forwardRef`).

4. **`packages/ui/src/components/textarea/textarea.test.tsx`** — Vitest + Testing Library + vitest-axe tests:
   - Smoke render
   - Applies `data-slot="textarea"`
   - Supports custom `className`
   - Supports `disabled` state
   - Shows error styling with `aria-invalid="true"`
   - Supports `placeholder`
   - Controlled usage (`value` + `onChange`)
   - Uncontrolled usage (`defaultValue`)
   - `autoResize` prop applies `field-sizing: content` style
   - `asChild` composition
   - Accessibility: `axe` assertions
   - Ref forwarding

5. **`packages/ui/src/components/textarea/textarea.stories.tsx`** — CSF3 stories with `tags: ['autodocs']`:
   - Default, With Placeholder, With Value, Disabled, With Error (`aria-invalid="true"`), Auto Resize (`autoResize={true}`), With Label (composing with Label component)

## Files to Modify

- **`packages/ui/src/index.ts`** — Add exports:
  ```typescript
  export { Textarea, type TextareaProps } from './components/textarea/textarea.js';
  export { textareaVariants } from './components/textarea/textarea.styles.js';
  ```

## Key Implementation Details

- **No CVA variants**: Like Input, Textarea has no visual variants. The `textareaVariants` CVA call holds only the base class string. The `autoResize` prop is a behavioral flag, not a style variant.
- **Auto-resize via CSS `field-sizing: content`**: Pure CSS solution — no JavaScript, no refs, no effect hooks, no resize listeners. Applied as inline style `{ fieldSizing: 'content' }` when `autoResize={true}`. Browser support: Chrome 123+, Edge 123+, Firefox 132+, Safari 18.4+.
- **Error state via `aria-invalid`**: Same approach as Input — styles target `aria-[invalid=true]:border-destructive`.
- **Consistent styling with Input**: Textarea shares the same color, border, focus, and disabled styles as Input, differing only in minimum height (`min-h-[80px]` vs `h-10`).
- **`asChild` support**: Uses `@radix-ui/react-slot` for polymorphic rendering.
- **Follow the canonical Button component pattern**: Study `packages/ui/src/components/button/` and the Input component (Task 1) as references.
- **React 19 conventions**: `ref` as prop, no `forwardRef`, named exports only, `import type` for type-only imports.

## Dependencies

- **Task 1 (Input Component)**: No hard dependency, but Input should be implemented first as it establishes the pattern for native HTML element wrappers in this phase. Textarea mirrors Input's structure.
- Requires Milestone 1 complete (Label component for story composition, `cn()` utility, CVA, Tailwind v4, Vitest + vitest-axe, Storybook 8.5).
- Requires `@radix-ui/react-slot` (already installed).
- No new npm dependencies needed.

## Verification Criteria

1. `packages/ui/src/components/textarea/` contains all 5 files
2. `pnpm test` passes — all Textarea tests green, including vitest-axe accessibility assertions
3. `pnpm typecheck` passes with no errors in the `@components/ui` package
4. Supports controlled (`value` + `onChange`) and uncontrolled (`defaultValue`) usage
5. Displays destructive border color when `aria-invalid="true"` is set
6. Shows disabled styling when `disabled` prop is set
7. `autoResize` prop enables content-driven height sizing via `field-sizing: content`
8. Renders in Storybook with all stories visible under autodocs
9. Exported from `packages/ui/src/index.ts` (component, props type, and variants function)
10. Root element includes `data-slot="textarea"` attribute
