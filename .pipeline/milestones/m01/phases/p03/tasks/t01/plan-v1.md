Good — the Radix dependencies are already installed (task t00 completed). Now I have all the context I need. Let me produce the implementation plan.

# Task 1 Plan: Label Component

## 1. Deliverables

| File                                                 | Action | Purpose                                                                                      |
| ---------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------- |
| `packages/ui/src/components/label/label.types.ts`    | Create | TypeScript props type extending Radix Label Root + CVA VariantProps                          |
| `packages/ui/src/components/label/label.styles.ts`   | Create | CVA definition with base styles for label text and peer-disabled behavior                    |
| `packages/ui/src/components/label/label.tsx`         | Create | Implementation wrapping `@radix-ui/react-label` Root with data-slot, cn(), and ref-as-prop   |
| `packages/ui/src/components/label/label.test.tsx`    | Create | Vitest + Testing Library + vitest-axe tests covering smoke, htmlFor, asChild, disabled, a11y |
| `packages/ui/src/components/label/label.stories.tsx` | Create | Storybook CSF3 stories with autodocs: Default, WithInput, Disabled, AsChild                  |
| `packages/ui/src/index.ts`                           | Modify | Add exports for `Label`, `LabelProps`, and `labelVariants`                                   |

## 2. Dependencies

### Already installed (by Task t00)

- `@radix-ui/react-label` — `^2.1.0` in `packages/ui/package.json`

### Pre-existing infrastructure

- `class-variance-authority` — CVA for variant management
- `@components/utils` — `cn()` helper via `../../lib/utils.js`
- Vitest + Testing Library + vitest-axe — test infrastructure
- Storybook 8.5 — documentation infrastructure

### No new packages required

Task t00 has already installed all Radix dependencies for Phase 3.

## 3. Implementation Details

### label.types.ts

**Purpose**: Define the `LabelProps` type.

**Exports**: `LabelProps`

**Contract**:

```typescript
import type { VariantProps } from 'class-variance-authority';
import type * as LabelPrimitive from '@radix-ui/react-label';

import type { labelVariants } from './label.styles.js';

export type LabelProps = React.ComponentProps<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants>;
```

**Key details**:

- Extends `React.ComponentProps<typeof LabelPrimitive.Root>` which includes `ref` (React 19), `className`, `htmlFor`, `asChild`, `children`, and all standard `<label>` HTML attributes
- Intersected with `VariantProps<typeof labelVariants>` for type-safe CVA variant props (currently no variants, but the intersection establishes the pattern)
- No additional custom props needed — the Radix primitive already provides `asChild` and `htmlFor`
- Uses `import type` for all type-only imports per project convention
- Pattern follows Separator's types file exactly

### label.styles.ts

**Purpose**: Define CVA variant function with base label styles.

**Exports**: `labelVariants`

**Contract**:

```typescript
import { cva } from 'class-variance-authority';

export const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
);
```

**Key details**:

- Base styles: `text-sm` (14px), `font-medium` (500 weight), `leading-none` (line-height: 1)
- Peer-disabled styles: `peer-disabled:cursor-not-allowed peer-disabled:opacity-50` — when a sibling input with the `peer` class is disabled, the label automatically shows disabled styling
- No variants object — CVA is called with base string only (no `{ variants: ... }` block). This matches the shadcn/ui Label which has base styles only
- The `labelVariants` function is exported so consumers can compose it and so `VariantProps<typeof labelVariants>` resolves correctly in the types file
- This is the same pattern as Separator: a CVA function with a base string and optional variants

### label.tsx

**Purpose**: Label component implementation wrapping Radix Label Root.

**Exports**: `Label` (component function), re-export of `LabelProps` type

**Contract**:

```typescript
import * as LabelPrimitive from '@radix-ui/react-label';

import { cn } from '../../lib/utils.js';
import { labelVariants } from './label.styles.js';
import type { LabelProps } from './label.types.js';

export type { LabelProps } from './label.types.js';

export function Label({
  className,
  ref,
  ...props
}: LabelProps): React.JSX.Element {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(labelVariants(), className)}
      ref={ref}
      {...props}
    />
  );
}
```

**Key details**:

- Wraps `LabelPrimitive.Root` — the Radix label primitive renders a `<label>` element
- `data-slot="label"` — root element identification per project convention
- `cn(labelVariants(), className)` — merges CVA base styles with consumer className. Note `labelVariants()` is called with no arguments since there are no variant props to pass
- `ref` is destructured as a regular prop (React 19 ref-as-prop, no forwardRef)
- `asChild` is not explicitly destructured — it flows through `...props` to the Radix primitive, which handles it natively. This is consistent with how Separator works (Separator doesn't destructure `asChild` either; it passes through via `...props`)
- `htmlFor` also flows through `...props` — the Radix primitive handles it
- Return type annotation `React.JSX.Element` per existing pattern
- Pattern follows Separator's implementation file closely

### label.test.tsx

**Purpose**: Comprehensive test suite for Label component.

**Test setup**: Uses `@testing-library/react`, `@testing-library/user-event`, `vitest-axe`, and `vitest`.

**Tests** (8 total):

1. **Smoke render** — `render(<Label>Name</Label>)` and assert `screen.getByText('Name')` is in the document
2. **Renders correct text** — Label renders with the provided children text
3. **Renders as `<label>` element** — Assert `screen.getByText('Name').tagName` equals `'LABEL'`
4. **`htmlFor` attribute binding** — `render(<Label htmlFor="email">Email</Label>)` and assert `screen.getByText('Email')` has attribute `for` equal to `email`
5. **`data-slot="label"` present** — Assert `screen.getByText('Name')` has `data-slot` attribute equal to `label`
6. **`asChild` renders as child element** — `render(<Label asChild><span data-testid="custom">Custom</span></Label>)` and assert element with `data-testid="custom"` is in the document and has the `data-slot="label"` attribute and the base CVA classes
7. **Custom className merging** — `render(<Label className="custom-class">Name</Label>)` and assert the element has both `custom-class` and the base CVA class `text-sm`
8. **vitest-axe accessibility check** — Render `<div><Label htmlFor="test-input">Name</Label><input id="test-input" /></div>` and assert `axe(container)` has no violations. The label is paired with an input to satisfy the `htmlFor` → `id` association for a proper accessibility check

### label.stories.tsx

**Purpose**: Storybook documentation with interactive examples.

**Meta**: `title: 'Components/Label'`, `component: Label`, `tags: ['autodocs']`

**Stories** (4 total):

1. **Default** — Simple `<Label>Label text</Label>` render
2. **WithInput** — Label paired with a native `<input>` via `htmlFor`/`id` binding, wrapped in a flex container with gap. Uses `render` function to compose the pairing:
   ```tsx
   <div className="grid w-full max-w-sm gap-1.5">
     <Label htmlFor="email">Email</Label>
     <input
       type="email"
       id="email"
       placeholder="email@example.com"
       className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
     />
   </div>
   ```
3. **Disabled** — Label paired with a disabled input to demonstrate `peer-disabled` styling. The input gets `className="peer"` and `disabled`:
   ```tsx
   <div className="grid w-full max-w-sm gap-1.5">
     <Label htmlFor="disabled-input">Disabled field</Label>
     <input
       type="text"
       id="disabled-input"
       disabled
       className="peer flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm disabled:opacity-50"
     />
   </div>
   ```
   Note: For the `peer-disabled` classes on Label to activate, the input needs the `peer` class and must appear **before** the label in DOM order, or the label needs to be a sibling following the input. In shadcn/ui Form usage, the input typically comes after the label but the `peer-disabled` classes work because react-hook-form applies them through the Form component's CSS structure. For this story, we demonstrate the styling by showing the concept — the actual peer-disabled activation depends on DOM order (input with `peer` before the label).
4. **AsChild** — Label rendering as a custom element via `asChild`:
   ```tsx
   <Label asChild>
     <span>Label as span</span>
   </Label>
   ```

### index.ts modification

**Purpose**: Export Label's public API from the package entry point.

**New lines to add** (after existing Toaster export):

```typescript
export { Label, type LabelProps } from './components/label/label.js';
export { labelVariants } from './components/label/label.styles.js';
```

**Pattern**: Matches how Button exports its component, type, and CVA variants from index.ts.

## 4. API Contracts

### Label Component

**Input (Props)**:

| Prop        | Type                            | Default | Description                                      |
| ----------- | ------------------------------- | ------- | ------------------------------------------------ |
| `children`  | `React.ReactNode`               | —       | Label text content                               |
| `htmlFor`   | `string`                        | —       | Associates label with a form element by its `id` |
| `asChild`   | `boolean`                       | `false` | Render as the child element instead of `<label>` |
| `className` | `string`                        | —       | Additional CSS classes merged with base styles   |
| `ref`       | `React.Ref<HTMLLabelElement>`   | —       | Ref forwarded to the root element                |
| `...props`  | `React.ComponentProps<'label'>` | —       | All standard HTML label attributes               |

**Output (Rendered DOM)**:

```html
<!-- Default -->
<label
  data-slot="label"
  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
  for="email"
>
  Email
</label>

<!-- With asChild -->
<span
  data-slot="label"
  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
>
  Custom label
</span>
```

### labelVariants Function

**Input**: `(props?: { className?: string }) => string`

**Output**: Merged Tailwind class string. Since there are no variant options, calling `labelVariants()` always returns the base classes. Passing `{ className: 'extra' }` merges the extra class into the output.

## 5. Test Plan

### Test Setup

- **Framework**: Vitest with jsdom environment
- **Rendering**: `@testing-library/react` (`render`, `screen`)
- **Interactions**: `@testing-library/user-event`
- **Accessibility**: `vitest-axe` (`axe` function, `toHaveNoViolations` matcher)
- **Imports**: `describe`, `expect`, `it` from `vitest`

### Per-Test Specification

| #   | Test Name                             | Setup                                                                        | Action | Assertion                                                                                            |
| --- | ------------------------------------- | ---------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------- |
| 1   | renders with default props            | `render(<Label>Name</Label>)`                                                | —      | `screen.getByText('Name')` is in the document                                                        |
| 2   | renders as a label element            | `render(<Label>Name</Label>)`                                                | —      | `screen.getByText('Name').tagName` equals `'LABEL'`                                                  |
| 3   | binds htmlFor attribute               | `render(<Label htmlFor="email">Email</Label>)`                               | —      | `screen.getByText('Email')` has attribute `for` equal to `email`                                     |
| 4   | has data-slot attribute               | `render(<Label>Name</Label>)`                                                | —      | `screen.getByText('Name')` has attribute `data-slot` equal to `label`                                |
| 5   | applies base CVA classes              | `render(<Label>Name</Label>)`                                                | —      | Element has classes `text-sm`, `font-medium`                                                         |
| 6   | renders as child element with asChild | `render(<Label asChild><span data-testid="custom">Custom</span></Label>)`    | —      | `screen.getByTestId('custom')` is in the document; its tagName is `SPAN`; it has `data-slot="label"` |
| 7   | merges custom className               | `render(<Label className="custom-class">Name</Label>)`                       | —      | Element has both `custom-class` and `text-sm`                                                        |
| 8   | has no accessibility violations       | `render(<div><Label htmlFor="input">Name</Label><input id="input" /></div>)` | —      | `axe(container)` returns no violations                                                               |

## 6. Implementation Order

1. **`label.styles.ts`** — Define CVA base styles. No dependencies on other label files.
2. **`label.types.ts`** — Define `LabelProps` type. Depends on `label.styles.ts` for `VariantProps<typeof labelVariants>`.
3. **`label.tsx`** — Implement the Label component. Depends on `label.styles.ts` and `label.types.ts`.
4. **`label.test.tsx`** — Write tests. Depends on `label.tsx`.
5. **`label.stories.tsx`** — Write Storybook stories. Depends on `label.tsx`.
6. **`index.ts`** — Add exports. Depends on `label.tsx` and `label.styles.ts`.
7. **Verify** — Run `pnpm test` and `pnpm typecheck` to confirm everything passes.

## 7. Verification Commands

```bash
# Run Label tests only
pnpm --filter @components/ui test -- --run src/components/label/label.test.tsx

# Run all tests in the UI package
pnpm --filter @components/ui test

# Type-check the entire monorepo
pnpm typecheck

# Lint the UI package
pnpm --filter @components/ui lint

# Build the UI package (confirm exports compile)
pnpm --filter @components/ui build
```

## 8. Design Deviations

**Deviation 1: CVA called without variant arguments**

- **Parent spec requires**: The task spec says `labelVariants` is a CVA definition with base styles and "no variants initially." The AGENTS.md component creation guide pattern shows `cva('base-classes', { variants: { ... }, defaultVariants: { ... } })`.
- **Why this is adjusted**: Since there are no variants, passing an empty variants object serves no purpose. The `cva('base-classes')` single-argument form is valid CVA usage and produces the same result.
- **Alternative chosen**: `cva('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50')` — called with base string only, no second argument. In the component, `labelVariants()` is called with no arguments (not `labelVariants({ className })`) and `cn()` handles className merging externally: `cn(labelVariants(), className)`. This matches how the shadcn/ui Label works and is cleaner than passing an empty variants config.

**Deviation 2: `asChild` not explicitly destructured**

- **Parent spec mentions**: The task spec says Label "accepts `ref`, `className`, `asChild`, and all standard `<label>` props."
- **Why adjusted**: The Radix `LabelPrimitive.Root` already accepts `asChild` as part of its prop type. Destructuring it explicitly to pass it through would be redundant — it flows through `...props` to the Radix primitive which handles it natively. This is the exact same pattern used by Separator (see `separator.tsx` which also does not destructure `asChild`).
- **Alternative chosen**: Only destructure `className` and `ref` (which need special handling); let all other props including `asChild` and `htmlFor` flow through `...props`.
