Now I have all the context I need. Let me produce the phase specification.

# Phase 1: Text Inputs — Detailed Specification

## Goal

Deliver the two foundational text input components — **Input** and **Textarea** — as shadcn/ui ports adapted to the project's 5-file pattern. These styled native HTML element wrappers provide the accessible text entry primitives upon which all subsequent form controls, composed inputs, and the Form component build. After this phase, consumer apps can render styled text fields, password inputs, email fields, file inputs, and multi-line text areas with error states, disabled states, and both controlled and uncontrolled usage.

---

## Design Decisions

### DD-1: No CVA Variants for Input

Input does not define visual variants (no `variant` or `size` props). The shadcn/ui Input is a single-style component — all visual differentiation comes from HTML `type` attributes and state-driven classes (`aria-invalid`, `disabled`, `file:` pseudo-selector). The `inputVariants` CVA call exists solely to hold the base class string, keeping the pattern consistent with other components. This matches the shadcn/ui reference implementation.

### DD-2: No CVA Variants for Textarea

Like Input, Textarea has no visual variants. The `textareaVariants` CVA call holds only the base class string. The `autoResize` prop is a behavioral flag, not a style variant, so it lives in the props type rather than CVA.

### DD-3: Textarea Auto-Resize via CSS `field-sizing: content`

The `autoResize` prop will be implemented using the CSS `field-sizing: content` property. This is a pure-CSS solution that requires no JavaScript, no refs, no effect hooks, and no resize event listeners. Browser support covers Chrome 123+, Edge 123+, and Firefox 132+ (all shipped by early 2025). Safari support landed in Safari 18.4. Given that this is an internal component library for Portfolio projects (not a public npm package), modern browser support is acceptable. If a consumer requires broader support in the future, the implementation can be swapped to a JS-based approach without changing the public API.

### DD-4: `asChild` Support via Radix Slot

Both Input and Textarea will support the `asChild` prop using `@radix-ui/react-slot`, consistent with Button and other leaf components in the library. This enables polymorphic rendering (e.g., rendering an Input's styles onto a custom component).

### DD-5: Error State via `aria-invalid`

Error styling is driven by the `aria-invalid` attribute, not a custom `error` prop. This follows the shadcn/ui convention and keeps the API accessible by default. Styles target `aria-[invalid=true]:border-destructive` to show a red border on invalid inputs. The Form component (Phase 3) will set `aria-invalid` automatically based on validation state.

### DD-6: File Input Styling

The Input component includes `file:` variant pseudo-class styles for `<input type="file">`, matching shadcn/ui's approach: `file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground`. The file button inherits the foreground color and has no visible border, integrating cleanly with the overall input styling.

---

## Tasks

### Task 1: Input Component

**Deliverables**: Complete `packages/ui/src/components/input/` directory with all 5 files, plus public API export.

**Files to create**:

1. **`input.types.ts`** — `InputProps` extending `React.ComponentProps<'input'>` with `asChild?: boolean`. No CVA `VariantProps` needed (no variants beyond base).

2. **`input.styles.ts`** — `inputVariants` CVA definition with base classes only:
   - Layout: `flex h-10 w-full rounded-md px-3 py-2`
   - Typography: `text-sm`
   - Colors: `bg-background text-foreground placeholder:text-muted-foreground`
   - Border: `border border-input`
   - Focus: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`
   - Disabled: `disabled:cursor-not-allowed disabled:opacity-50`
   - Error: `aria-[invalid=true]:border-destructive`
   - File input: `file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground`

3. **`input.tsx`** — Functional component using `Slot` or `'input'` based on `asChild`, applying `data-slot="input"`, `cn(inputVariants({ className }))`, and spreading remaining props. React 19 `ref` as prop.

4. **`input.test.tsx`** — Vitest + Testing Library + vitest-axe tests:
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

5. **`input.stories.tsx`** — CSF3 stories with `tags: ['autodocs']`:
   - Default
   - With Placeholder
   - With Value
   - Disabled
   - With Error (`aria-invalid="true"`)
   - Password type
   - Email type
   - Number type
   - File type
   - With Label (composing with the Label component from M1)

**Export to add to `packages/ui/src/index.ts`**:

```typescript
export { Input, type InputProps } from './components/input/input.js';
export { inputVariants } from './components/input/input.styles.js';
```

---

### Task 2: Textarea Component

**Deliverables**: Complete `packages/ui/src/components/textarea/` directory with all 5 files, plus public API export.

**Files to create**:

1. **`textarea.types.ts`** — `TextareaProps` extending `React.ComponentProps<'textarea'>` with:
   - `asChild?: boolean`
   - `autoResize?: boolean` (default `false`)

2. **`textarea.styles.ts`** — `textareaVariants` CVA definition with base classes:
   - Layout: `flex min-h-[80px] w-full rounded-md px-3 py-2`
   - Typography: `text-sm`
   - Colors: `bg-background text-foreground placeholder:text-muted-foreground`
   - Border: `border border-input`
   - Focus: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`
   - Disabled: `disabled:cursor-not-allowed disabled:opacity-50`
   - Error: `aria-[invalid=true]:border-destructive`
   - Note: The `field-sizing: content` style for auto-resize is applied conditionally in the component file via `cn()`, not as a CVA variant.

3. **`textarea.tsx`** — Functional component using `Slot` or `'textarea'` based on `asChild`. Applies `data-slot="textarea"`, merges `cn(textareaVariants({ className }))`. When `autoResize` is `true`, adds the inline style `{ fieldSizing: 'content' }` (or a utility class if available in Tailwind v4). React 19 `ref` as prop.

4. **`textarea.test.tsx`** — Vitest + Testing Library + vitest-axe tests:
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

5. **`textarea.stories.tsx`** — CSF3 stories with `tags: ['autodocs']`:
   - Default
   - With Placeholder
   - With Value
   - Disabled
   - With Error (`aria-invalid="true"`)
   - Auto Resize (`autoResize={true}`)
   - With Label (composing with Label component)

**Export to add to `packages/ui/src/index.ts`**:

```typescript
export { Textarea, type TextareaProps } from './components/textarea/textarea.js';
export { textareaVariants } from './components/textarea/textarea.styles.js';
```

---

## Exit Criteria

1. `packages/ui/src/components/input/` contains all 5 files (`input.tsx`, `input.styles.ts`, `input.types.ts`, `input.test.tsx`, `input.stories.tsx`)
2. `packages/ui/src/components/textarea/` contains all 5 files (`textarea.tsx`, `textarea.styles.ts`, `textarea.types.ts`, `textarea.test.tsx`, `textarea.stories.tsx`)
3. `pnpm test` passes — all Input and Textarea tests green, including vitest-axe accessibility assertions
4. `pnpm typecheck` passes with no errors in the `@components/ui` package
5. Input renders correctly for `type="text"`, `type="password"`, `type="email"`, `type="number"`, and `type="file"`
6. Input and Textarea both support controlled (`value` + `onChange`) and uncontrolled (`defaultValue`) usage
7. Input and Textarea both display destructive border color when `aria-invalid="true"` is set
8. Input and Textarea both show disabled styling when `disabled` prop is set
9. Textarea `autoResize` prop enables content-driven height sizing
10. Both components render in Storybook with all stories visible under autodocs
11. Both components are exported from `packages/ui/src/index.ts` (component, props type, and variants function)
12. Both components include `data-slot` attributes on their root elements

---

## Dependencies

1. **Milestone 1 complete** — Label component (for story composition), `cn()` utility, CVA, Tailwind v4 theme with OKLCH tokens, Vitest + vitest-axe, Storybook 8.5 must all be operational
2. **Button component** — exists as the canonical 5-file pattern reference for implementation structure
3. **`@radix-ui/react-slot`** — already installed (used by Button), required for `asChild` support
4. **No new npm dependencies** — Input and Textarea wrap native HTML elements; all required packages are already in `package.json`

---

## Artifacts

| Artifact                                                   | Action | Description                          |
| ---------------------------------------------------------- | ------ | ------------------------------------ |
| `packages/ui/src/components/input/input.tsx`               | Create | Input component implementation       |
| `packages/ui/src/components/input/input.styles.ts`         | Create | CVA base class definition            |
| `packages/ui/src/components/input/input.types.ts`          | Create | InputProps type definition           |
| `packages/ui/src/components/input/input.test.tsx`          | Create | Vitest + vitest-axe test suite       |
| `packages/ui/src/components/input/input.stories.tsx`       | Create | Storybook CSF3 stories with autodocs |
| `packages/ui/src/components/textarea/textarea.tsx`         | Create | Textarea component implementation    |
| `packages/ui/src/components/textarea/textarea.styles.ts`   | Create | CVA base class definition            |
| `packages/ui/src/components/textarea/textarea.types.ts`    | Create | TextareaProps type definition        |
| `packages/ui/src/components/textarea/textarea.test.tsx`    | Create | Vitest + vitest-axe test suite       |
| `packages/ui/src/components/textarea/textarea.stories.tsx` | Create | Storybook CSF3 stories with autodocs |
| `packages/ui/src/index.ts`                                 | Modify | Add Input and Textarea exports       |
