I now have all the context needed. Let me also verify the stories import pattern to make sure I note the correct `@storybook/react-vite` import.

Now I have complete context. Let me produce the detailed implementation plan.

# Task Plan: Textarea Component

## 1. Deliverables

| #   | File                                                       | Action | Purpose                                                                                           |
| --- | ---------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------- |
| 1   | `packages/ui/src/components/textarea/textarea.types.ts`    | Create | `TextareaProps` type extending `React.ComponentProps<'textarea'>` with `asChild` and `autoResize` |
| 2   | `packages/ui/src/components/textarea/textarea.styles.ts`   | Create | `textareaVariants` CVA definition with base classes (no variants)                                 |
| 3   | `packages/ui/src/components/textarea/textarea.tsx`         | Create | Textarea component implementation with Slot/asChild, data-slot, cn(), autoResize                  |
| 4   | `packages/ui/src/components/textarea/textarea.test.tsx`    | Create | Vitest + Testing Library + vitest-axe test suite                                                  |
| 5   | `packages/ui/src/components/textarea/textarea.stories.tsx` | Create | Storybook CSF3 stories with autodocs                                                              |
| 6   | `packages/ui/src/index.ts`                                 | Modify | Add Textarea, TextareaProps, and textareaVariants exports                                         |

## 2. Dependencies

**No new npm dependencies required.** All packages are already installed:

- `@radix-ui/react-slot` (v1.2.4) — for `asChild` support via `Slot`
- `class-variance-authority` (v0.7.1) — for CVA variants definition
- `@components/utils` (workspace) — for `cn()` helper
- `@testing-library/react`, `@testing-library/user-event`, `vitest`, `vitest-axe` — for tests
- `@storybook/react-vite` — for stories

**Prerequisites:**

- Milestone 1 complete (Label component exists for story composition)
- Task t01 (Input component) complete — establishes the pattern for native HTML element wrappers

## 3. Implementation Details

### 3.1 `textarea.types.ts`

**Purpose:** Define the `TextareaProps` type.

**Exports:** `TextareaProps`

**Shape:**

```typescript
import type { VariantProps } from 'class-variance-authority';
import type { textareaVariants } from './textarea.styles.js';

export type TextareaProps = React.ComponentProps<'textarea'> &
  VariantProps<typeof textareaVariants> & {
    asChild?: boolean;
    autoResize?: boolean;
  };
```

**Notes:**

- Extends `React.ComponentProps<'textarea'>` which includes `ref` in React 19
- `VariantProps<typeof textareaVariants>` is included for pattern consistency even though there are no variants — it resolves to `Record<never, never>` (no-op)
- `asChild` enables polymorphic rendering via Radix Slot
- `autoResize` is a behavioral flag (default `false`) — not a CVA variant

### 3.2 `textarea.styles.ts`

**Purpose:** CVA base class definition for the Textarea. No variant/size options — only a base class string, mirroring Input's approach.

**Exports:** `textareaVariants`

**Base classes:**

```typescript
import { cva } from 'class-variance-authority';

export const textareaVariants = cva(
  'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive',
);
```

**Class breakdown:**
| Category | Classes |
| ----------- | ------------------------------------------------------------------------------------------- |
| Layout | `flex min-h-[80px] w-full rounded-md px-3 py-2` |
| Typography | `text-sm` |
| Colors | `bg-background text-foreground placeholder:text-muted-foreground` |
| Border | `border border-input` |
| Ring offset | `ring-offset-background` |
| Focus | `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` |
| Disabled | `disabled:cursor-not-allowed disabled:opacity-50` |
| Error | `aria-[invalid=true]:border-destructive` |

**Differences from Input's base classes:**

- `min-h-[80px]` instead of `h-10` (textarea needs multi-line height)
- No `file:` pseudo-class styles (not applicable to textarea)

### 3.3 `textarea.tsx`

**Purpose:** The Textarea component implementation.

**Exports:** `Textarea` (function component), re-exports `TextareaProps` (type)

**Key logic:**

```typescript
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils.js';
import { textareaVariants } from './textarea.styles.js';
import type { TextareaProps } from './textarea.types.js';

export type { TextareaProps } from './textarea.types.js';

export function Textarea({
  className,
  asChild = false,
  autoResize = false,
  style,
  ref,
  ...props
}: TextareaProps): React.JSX.Element {
  const Comp = asChild ? Slot : 'textarea';

  return (
    <Comp
      data-slot="textarea"
      className={cn(textareaVariants({ className }))}
      style={autoResize ? { fieldSizing: 'content', ...style } : style}
      ref={ref}
      {...props}
    />
  );
}
```

**Implementation details:**

- Follows the exact same pattern as `input.tsx` (Slot/asChild, data-slot, cn with CVA, ref as prop)
- Destructures `autoResize` from props so it is NOT spread onto the DOM element (React would warn about unknown DOM prop)
- Destructures `style` to merge the `fieldSizing: 'content'` inline style when `autoResize` is `true`, preserving any user-provided styles
- `fieldSizing: 'content'` is the CSS property that enables the textarea to grow with content — pure CSS, no JS needed
- Uses inline style ONLY for `field-sizing` because this is a CSS property not available as a Tailwind utility; all other styling uses Tailwind classes per project convention
- The `style` prop type from `React.ComponentProps<'textarea'>` accepts `React.CSSProperties`, but `fieldSizing` may not be in the TS typings yet — use a type assertion `{ fieldSizing: 'content' } as React.CSSProperties` if needed

### 3.4 `textarea.test.tsx`

**Purpose:** Comprehensive test suite for the Textarea component.

**Test setup:** Vitest + @testing-library/react + @testing-library/user-event + vitest-axe

**Imports:**

```typescript
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Textarea } from './textarea.js';
```

**Test specifications:**

| #   | Test Name                                            | Description                                                                                              |
| --- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 1   | `renders without crashing`                           | Renders `<Textarea aria-label="Test" />`, asserts `screen.getByRole('textbox')` is in the document       |
| 2   | `has data-slot attribute`                            | Asserts `data-slot="textarea"` on the rendered element                                                   |
| 3   | `merges custom className`                            | Renders with `className="custom-class"`, asserts it has that class                                       |
| 4   | `supports disabled state`                            | Renders with `disabled`, asserts `toBeDisabled()`                                                        |
| 5   | `supports aria-invalid for error state`              | Renders with `aria-invalid="true"`, asserts attribute present                                            |
| 6   | `renders placeholder text`                           | Renders with `placeholder="Enter text..."`, asserts placeholder visible                                  |
| 7   | `supports controlled usage`                          | Renders with `value` + `onChange`, types a character, asserts onChange called                            |
| 8   | `supports uncontrolled usage`                        | Renders with `defaultValue`, types new text, asserts value updates                                       |
| 9   | `applies field-sizing style when autoResize is true` | Renders with `autoResize`, asserts `style.fieldSizing` is `'content'`                                    |
| 10  | `does not apply field-sizing style by default`       | Renders without `autoResize`, asserts `fieldSizing` is not in the style                                  |
| 11  | `merges user style with autoResize style`            | Renders with `autoResize` and `style={{ color: 'red' }}`, asserts both styles present                    |
| 12  | `renders as child element when asChild is true`      | Renders with `asChild` wrapping a `<div>`, asserts tag is `DIV` with `data-slot="textarea"`              |
| 13  | `forwards ref to the textarea element`               | Creates ref via `createRef<HTMLTextAreaElement>()`, asserts `ref.current instanceof HTMLTextAreaElement` |
| 14  | `has no accessibility violations`                    | Runs axe on default render, asserts no violations                                                        |
| 15  | `has no accessibility violations in error state`     | Runs axe with `aria-invalid="true"`, asserts no violations                                               |

### 3.5 `textarea.stories.tsx`

**Purpose:** Storybook CSF3 stories with autodocs for all states and behaviors.

**Meta configuration:**

```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from '../label/label.js';
import { Textarea } from './textarea.js';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    autoResize: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;
```

**Stories:**

| Story Name        | Description                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------ |
| `Default`         | Basic textarea with `aria-label`                                                           |
| `WithPlaceholder` | With `placeholder="Type your message here..."`                                             |
| `WithValue`       | With `defaultValue` set to a multi-line string                                             |
| `Disabled`        | With `disabled={true}` and `defaultValue`                                                  |
| `WithError`       | With `aria-invalid={true}` and `defaultValue`                                              |
| `AutoResize`      | With `autoResize={true}` and `placeholder`, demonstrating content-driven height            |
| `WithLabel`       | Render function composing `<Label htmlFor="...">` + `<Textarea id="...">` in a grid layout |

### 3.6 `index.ts` modification

**Purpose:** Add public API exports for Textarea.

**Lines to add after the Input exports (line 106):**

```typescript
export { Textarea, type TextareaProps } from './components/textarea/textarea.js';
export { textareaVariants } from './components/textarea/textarea.styles.js';
```

## 4. API Contracts

### TextareaProps

```typescript
type TextareaProps = React.ComponentProps<'textarea'> &
  VariantProps<typeof textareaVariants> & {
    /** Render as the child element instead of a <textarea>, merging props and behavior. */
    asChild?: boolean;
    /** Enable auto-resize behavior so the textarea grows with its content. Default: false. */
    autoResize?: boolean;
  };
```

### Usage examples

**Basic:**

```tsx
<Textarea placeholder="Enter description..." aria-label="Description" />
```

**Controlled:**

```tsx
const [value, setValue] = useState('');
<Textarea value={value} onChange={(e) => setValue(e.target.value)} aria-label="Notes" />;
```

**With error state:**

```tsx
<Textarea aria-invalid="true" aria-label="Invalid field" defaultValue="Bad input" />
```

**Auto-resize:**

```tsx
<Textarea autoResize placeholder="This grows as you type..." aria-label="Auto-grow" />
```

**With Label:**

```tsx
<Label htmlFor="bio">Bio</Label>
<Textarea id="bio" placeholder="Tell us about yourself..." />
```

**asChild:**

```tsx
<Textarea asChild>
  <div role="textbox" contentEditable />
</Textarea>
```

## 5. Test Plan

### Test setup

- **Runner:** Vitest (via `pnpm test` or `pnpm --filter @components/ui test`)
- **DOM:** jsdom (configured in Vitest config)
- **Libraries:** `@testing-library/react` for rendering, `@testing-library/user-event` for interactions, `vitest-axe` for accessibility
- **Pattern:** Follow `input.test.tsx` structure exactly — `describe('Textarea', () => { ... })`

### Per-test specification

1. **Smoke render** — `render(<Textarea aria-label="Test" />)` → `screen.getByRole('textbox')` exists
2. **data-slot attribute** — rendered element has `data-slot="textarea"`
3. **Custom className** — `className="custom-class"` → element `toHaveClass('custom-class')`
4. **Disabled state** — `disabled` → `toBeDisabled()`
5. **Error state (aria-invalid)** — `aria-invalid="true"` → `toHaveAttribute('aria-invalid', 'true')`
6. **Placeholder** — `placeholder="Enter text..."` → `getByPlaceholderText('Enter text...')` exists
7. **Controlled usage** — `value="hello"` + `onChange={vi.fn()}` → value displays, `onChange` fires on type
8. **Uncontrolled usage** — `defaultValue="initial"` → `toHaveValue('initial')`, then clear + type → `toHaveValue('updated')`
9. **autoResize applies field-sizing** — `autoResize` → `element.style.fieldSizing === 'content'`
10. **No field-sizing by default** — no `autoResize` → `element.style.fieldSizing` is falsy/empty
11. **autoResize merges user styles** — `autoResize style={{ color: 'red' }}` → element has both `fieldSizing: 'content'` and `color: 'red'`
12. **asChild composition** — `<Textarea asChild><div aria-label="Custom" /></Textarea>` → tag is `DIV` with `data-slot="textarea"`
13. **Ref forwarding** — `createRef<HTMLTextAreaElement>()` → `ref.current instanceof HTMLTextAreaElement`
14. **Accessibility (default)** — `axe(container)` → `toHaveNoViolations()`
15. **Accessibility (error state)** — `axe(container)` with `aria-invalid="true"` → `toHaveNoViolations()`

## 6. Implementation Order

1. **`textarea.types.ts`** — Define `TextareaProps` type. No runtime dependencies.
2. **`textarea.styles.ts`** — Define `textareaVariants` CVA base classes. Depends on `class-variance-authority` (installed).
3. **`textarea.tsx`** — Implement the component. Depends on types (step 1), styles (step 2), `@radix-ui/react-slot`, and `cn()`.
4. **`textarea.test.tsx`** — Write the full test suite. Depends on the component (step 3).
5. **`textarea.stories.tsx`** — Write all Storybook stories. Depends on the component (step 3) and Label component (M1).
6. **`index.ts`** — Add the three export lines for Textarea, TextareaProps, and textareaVariants.

## 7. Verification Commands

```bash
# Run Textarea tests specifically
pnpm --filter @components/ui test -- textarea

# Run all tests across the monorepo
pnpm test

# TypeScript type checking
pnpm typecheck

# Lint the ui package
pnpm --filter @components/ui lint

# Verify the build compiles
pnpm build
```

## 8. Design Deviations

### Deviation 1: `fieldSizing` as inline style

**What the AGENTS.md requires:** "Never do — Use inline styles instead of Tailwind classes"

**Why inline style is necessary here:** The CSS property `field-sizing: content` is not available as a Tailwind CSS v4 utility class. There is no `field-sizing-content` utility or equivalent in the Tailwind v4 class system. The `autoResize` behavior requires this CSS property, and the only way to apply it is via the `style` prop.

**Alternative chosen:** Apply `{ fieldSizing: 'content' }` as an inline style conditionally when `autoResize={true}`, while keeping all other styling in Tailwind classes. This is the minimal deviation — a single CSS property that has no Tailwind equivalent. The phase spec (DD-3) explicitly prescribes this approach: "adds the inline style `{ fieldSizing: 'content' }` via the `style` prop."

### Deviation 2: TypeScript `fieldSizing` type

**What may be needed:** `fieldSizing` might not be in React's `CSSProperties` type definition yet (it was added to CSS relatively recently). If TypeScript raises a type error, the inline style object should use a type assertion: `{ fieldSizing: 'content' } as React.CSSProperties`.

**Why this is correct:** The CSS property is valid and supported in all target browsers (Chrome 123+, Edge 123+, Firefox 132+, Safari 18.4+). The type assertion is a narrow workaround for TS type definitions lagging behind browser implementations, not a type-safety bypass.
