Now I have all the context I need. Here is the complete implementation plan:

# Task Plan: Input Component

## 1. Deliverables

| #   | File                                                 | Action | Purpose                                                                    |
| --- | ---------------------------------------------------- | ------ | -------------------------------------------------------------------------- |
| 1   | `packages/ui/src/components/input/input.types.ts`    | Create | `InputProps` type extending `React.ComponentProps<'input'>` with `asChild` |
| 2   | `packages/ui/src/components/input/input.styles.ts`   | Create | `inputVariants` CVA definition with base classes (no variants)             |
| 3   | `packages/ui/src/components/input/input.tsx`         | Create | Input component implementation with Slot/asChild, data-slot, cn()          |
| 4   | `packages/ui/src/components/input/input.test.tsx`    | Create | Vitest + Testing Library + vitest-axe test suite                           |
| 5   | `packages/ui/src/components/input/input.stories.tsx` | Create | Storybook CSF3 stories with autodocs                                       |
| 6   | `packages/ui/src/index.ts`                           | Modify | Add Input, InputProps, and inputVariants exports                           |

## 2. Dependencies

**No new npm dependencies required.** All packages are already installed:

- `@radix-ui/react-slot` (v1.2.4) — for `asChild` support
- `class-variance-authority` (v0.7.1) — for CVA variant definitions
- `@components/utils` — for `cn()` helper
- `@radix-ui/react-label` (v2.1.8) — Label component already exists (used in stories)
- `vitest` + `@testing-library/react` + `@testing-library/user-event` + `vitest-axe` — all in devDependencies

**Prerequisite**: Milestone 1 is complete (Label component, Button reference, cn() utility, Tailwind v4 theme, Storybook 8.5, Vitest + vitest-axe all operational).

## 3. Implementation Details

### 3.1 `input.types.ts`

**Purpose**: Define the `InputProps` type.

**Exports**: `InputProps`

**Contract**:

```typescript
import type { VariantProps } from 'class-variance-authority';
import type { inputVariants } from './input.styles.js';

export type InputProps = React.ComponentProps<'input'> &
  VariantProps<typeof inputVariants> & {
    asChild?: boolean;
  };
```

**Notes**:

- Extends `React.ComponentProps<'input'>` which includes `ref` in React 19 (no `forwardRef` needed)
- `VariantProps<typeof inputVariants>` is included for pattern consistency even though there are no visual variants — it resolves to `{}` since inputVariants has no `variants` config
- `asChild` enables polymorphic rendering via Radix `Slot`

### 3.2 `input.styles.ts`

**Purpose**: Define the CVA base classes for Input.

**Exports**: `inputVariants`

**Contract**:

```typescript
import { cva } from 'class-variance-authority';

export const inputVariants = cva(
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive',
);
```

**Notes**:

- No `variants` or `defaultVariants` configuration — Input is a single-style component (matches shadcn/ui reference, which has no variant/size props)
- `ring-offset-background` is included for the focus ring offset to match the background, consistent with Button's focus ring pattern
- `file:` pseudo-class styles handle `<input type="file">` appearance
- `aria-[invalid=true]:border-destructive` provides error state via semantic attribute

### 3.3 `input.tsx`

**Purpose**: The Input component implementation.

**Exports**: `Input` (function component), re-exports `InputProps` type

**Key logic**:

```typescript
import { Slot } from '@radix-ui/react-slot';

import { cn } from '../../lib/utils.js';
import { inputVariants } from './input.styles.js';
import type { InputProps } from './input.types.js';

export type { InputProps } from './input.types.js';

export function Input({
  className,
  type,
  asChild = false,
  ref,
  ...props
}: InputProps): React.JSX.Element {
  const Comp = asChild ? Slot : 'input';

  return (
    <Comp
      data-slot="input"
      type={type}
      className={cn(inputVariants({ className }))}
      ref={ref}
      {...props}
    />
  );
}
```

**Notes**:

- `type` is destructured explicitly so it can be passed as a named prop (for clarity), then spread would override it; placing it as a named attribute before `{...props}` means explicit `type` attribute takes precedence. Actually, since `type` is already removed from `...props` via destructuring, we pass it explicitly. This mirrors how shadcn/ui treats the type prop.
- No `variant` or `size` destructuring needed since there are no CVA variants
- Pattern follows Button exactly: `Slot` for `asChild`, `data-slot`, `cn()` with `inputVariants`, `ref` as prop

### 3.4 `input.test.tsx`

**Purpose**: Comprehensive test suite covering all verification criteria.

**Test setup**: Uses the existing vitest config (`jsdom` environment, `test-setup.ts` with `@testing-library/jest-dom` matchers and `vitest-axe` matchers).

**Tests (12 total)**:

1. **Smoke render** — Renders an `<input>` element without crashing
2. **`data-slot` attribute** — Root element has `data-slot="input"`
3. **Custom className** — Merges user-provided `className` with CVA base classes
4. **HTML type attribute** — Renders correctly with `type="password"`, `type="email"`, `type="number"`
5. **Disabled state** — Applies `disabled` attribute
6. **Error state** — When `aria-invalid="true"` is set, the attribute is present on the element
7. **Placeholder** — Renders `placeholder` text
8. **Controlled usage** — Accepts `value` + `onChange`, onChange fires on user input
9. **Uncontrolled usage** — Accepts `defaultValue`, value updates on user input
10. **`asChild` composition** — Renders as child element (e.g., a custom component) with merged props
11. **Ref forwarding** — `ref` receives the DOM element reference
12. **Accessibility (axe)** — No axe violations on default render (with `aria-label`) and on error state render

**Implementation**:

```typescript
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Input } from './input.js';

describe('Input', () => {
  it('renders without crashing', () => {
    render(<Input aria-label="Test input" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<Input aria-label="Test" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('data-slot', 'input');
  });

  it('merges custom className', () => {
    render(<Input aria-label="Test" className="custom-class" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });

  it('renders with different type attributes', () => {
    const { rerender } = render(<Input type="password" aria-label="Password" />);
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');

    rerender(<Input type="email" aria-label="Email" />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');

    rerender(<Input type="number" aria-label="Number" />);
    expect(screen.getByLabelText('Number')).toHaveAttribute('type', 'number');
  });

  it('supports disabled state', () => {
    render(<Input disabled aria-label="Disabled" />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('supports aria-invalid for error state', () => {
    render(<Input aria-invalid="true" aria-label="Error" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders placeholder text', () => {
    render(<Input placeholder="Enter text..." aria-label="With placeholder" />);
    expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument();
  });

  it('supports controlled usage', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input value="hello" onChange={onChange} aria-label="Controlled" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('hello');

    await user.type(input, 'a');
    expect(onChange).toHaveBeenCalled();
  });

  it('supports uncontrolled usage', async () => {
    const user = userEvent.setup();
    render(<Input defaultValue="initial" aria-label="Uncontrolled" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('initial');

    await user.clear(input);
    await user.type(input, 'updated');
    expect(input).toHaveValue('updated');
  });

  it('renders as child element when asChild is true', () => {
    render(
      <Input asChild>
        <textarea aria-label="Custom element" />
      </Input>,
    );
    const el = screen.getByLabelText('Custom element');
    expect(el.tagName).toBe('TEXTAREA');
    expect(el).toHaveAttribute('data-slot', 'input');
  });

  it('forwards ref to the input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} aria-label="Ref test" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Input aria-label="Accessible input" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations in error state', async () => {
    const { container } = render(
      <Input aria-invalid="true" aria-label="Error input" />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### 3.5 `input.stories.tsx`

**Purpose**: Storybook autodocs stories covering all visual states and input types.

**Exports**: `default` (meta) — Note: Stories files are the one exception where default export is required by CSF3 format.

**Stories (10)**:

1. `Default` — Basic text input
2. `WithPlaceholder` — Shows placeholder text
3. `WithValue` — Pre-filled value
4. `Disabled` — Disabled state
5. `WithError` — `aria-invalid="true"` error styling
6. `Password` — `type="password"`
7. `Email` — `type="email"`
8. `Number` — `type="number"`
9. `File` — `type="file"`
10. `WithLabel` — Composed with Label component from M1

**Implementation**:

```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from '../label/label.js';
import { Input } from './input.js';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'file', 'search', 'tel', 'url'],
    },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { 'aria-label': 'Default input' },
};

export const WithPlaceholder: Story = {
  args: { placeholder: 'Enter your name...', 'aria-label': 'Name' },
};

export const WithValue: Story = {
  args: { defaultValue: 'John Doe', 'aria-label': 'Name' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Cannot edit', 'aria-label': 'Disabled input' },
};

export const WithError: Story = {
  args: { 'aria-invalid': true, defaultValue: 'Invalid value', 'aria-label': 'Error input' },
};

export const Password: Story = {
  args: { type: 'password', placeholder: 'Enter password...', 'aria-label': 'Password' },
};

export const Email: Story = {
  args: { type: 'email', placeholder: 'you@example.com', 'aria-label': 'Email' },
};

export const NumberInput: Story = {
  args: { type: 'number', placeholder: '0', 'aria-label': 'Number' },
};

export const File: Story = {
  args: { type: 'file', 'aria-label': 'File upload' },
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email-input">Email</Label>
      <Input type="email" id="email-input" placeholder="you@example.com" />
    </div>
  ),
};
```

### 3.6 `index.ts` modification

**Purpose**: Export Input component, props type, and CVA variants from the public API.

**Lines to add** (after the existing Toaster/sonner exports at the end of the file):

```typescript
export { Input, type InputProps } from './components/input/input.js';
export { inputVariants } from './components/input/input.styles.js';
```

## 4. API Contracts

### InputProps

```typescript
type InputProps = React.ComponentProps<'input'> & {
  asChild?: boolean; // Default: false. Render as child element via Radix Slot.
};
```

**Notable inherited props from `React.ComponentProps<'input'>`**:

- `type?: string` — HTML input type (`'text'`, `'password'`, `'email'`, `'number'`, `'file'`, etc.)
- `value?: string | number | readonly string[]` — Controlled value
- `defaultValue?: string | number | readonly string[]` — Uncontrolled default value
- `onChange?: React.ChangeEventHandler<HTMLInputElement>` — Change handler
- `placeholder?: string` — Placeholder text
- `disabled?: boolean` — Disabled state
- `aria-invalid?: boolean | 'true' | 'false'` — Error state (drives visual error styling)
- `className?: string` — Additional CSS classes (merged via cn())
- `ref?: React.Ref<HTMLInputElement>` — DOM element ref (React 19 ref-as-prop)

### inputVariants

```typescript
// CVA call with base classes, no variants
const inputVariants: (props?: { className?: string }) => string;
```

**Usage example**:

```tsx
import { Input } from '@components/ui';

// Basic text input
<Input placeholder="Enter text..." />

// Password input with error state
<Input type="password" aria-invalid="true" />

// Controlled input
<Input value={val} onChange={(e) => setVal(e.target.value)} />

// Polymorphic rendering via asChild
<Input asChild>
  <CustomInput />
</Input>
```

## 5. Test Plan

### Test Setup

- **Runner**: Vitest with `jsdom` environment
- **Setup file**: `src/test-setup.ts` — registers `@testing-library/jest-dom` matchers and `vitest-axe` matchers, runs `cleanup()` after each test
- **Libraries**: `@testing-library/react` for rendering, `@testing-library/user-event` for interaction simulation, `vitest-axe` for accessibility assertions

### Test Specification (13 tests in 1 describe block)

| #   | Test Name                                      | Category    | What It Verifies                                                     |
| --- | ---------------------------------------------- | ----------- | -------------------------------------------------------------------- |
| 1   | renders without crashing                       | Smoke       | Component mounts and renders an `<input>` (role `textbox`)           |
| 2   | has data-slot attribute                        | Convention  | Root element has `data-slot="input"`                                 |
| 3   | merges custom className                        | Styling     | User-provided `className` is present alongside CVA classes           |
| 4   | renders with different type attributes         | Props       | `type="password"`, `type="email"`, `type="number"` all set correctly |
| 5   | supports disabled state                        | State       | `disabled` attribute is applied to the input                         |
| 6   | supports aria-invalid for error state          | State       | `aria-invalid="true"` is set on the element                          |
| 7   | renders placeholder text                       | Props       | Placeholder text appears and is queryable                            |
| 8   | supports controlled usage                      | Interaction | `value` renders correctly; `onChange` fires on user typing           |
| 9   | supports uncontrolled usage                    | Interaction | `defaultValue` renders; value updates after user clears and types    |
| 10  | renders as child element when asChild is true  | Composition | When `asChild=true`, renders as child element type with merged props |
| 11  | forwards ref to the input element              | Ref         | `ref.current` is an `HTMLInputElement` instance                      |
| 12  | has no accessibility violations                | A11y        | `axe` returns no violations on default render                        |
| 13  | has no accessibility violations in error state | A11y        | `axe` returns no violations with `aria-invalid="true"`               |

**Important note on accessibility**: All test renders of `<Input>` must include an accessible name (via `aria-label`, `aria-labelledby`, or wrapping `<label>`). An `<input>` without a label is an axe violation. Most tests use `aria-label` for simplicity.

## 6. Implementation Order

1. **Create `packages/ui/src/components/input/input.styles.ts`** — CVA base classes. No dependencies on other files. This is the foundation that other files import.

2. **Create `packages/ui/src/components/input/input.types.ts`** — Props type. Depends on `input.styles.ts` for `VariantProps<typeof inputVariants>`.

3. **Create `packages/ui/src/components/input/input.tsx`** — Component implementation. Depends on `input.styles.ts` and `input.types.ts`.

4. **Create `packages/ui/src/components/input/input.test.tsx`** — Test suite. Depends on `input.tsx`.

5. **Create `packages/ui/src/components/input/input.stories.tsx`** — Storybook stories. Depends on `input.tsx` and `../label/label.js`.

6. **Modify `packages/ui/src/index.ts`** — Add Input exports. Depends on `input.tsx` and `input.styles.ts`.

## 7. Verification Commands

```bash
# Run Input tests only
pnpm --filter @components/ui test -- src/components/input/input.test.tsx

# Run all tests across the ui package
pnpm --filter @components/ui test

# TypeScript type checking
pnpm --filter @components/ui typecheck

# Verify the 5-file structure exists
ls packages/ui/src/components/input/

# Lint the new files
pnpm --filter @components/ui lint
```

## 8. Design Deviations

**Deviation 1: `VariantProps` included despite no variants**

- **Parent spec says**: `InputProps` extending `React.ComponentProps<'input'>` with `asChild?: boolean`. "No CVA `VariantProps` needed (no variants beyond base)."
- **Why this is adjusted**: Including `VariantProps<typeof inputVariants>` in the props type is harmless (resolves to `{}` when no variants exist) and maintains structural consistency with every other component in the library (Button, Badge, etc.). This prevents a pattern divergence that would be confusing for future developers. The task spec's own note says "No CVA VariantProps _needed_" — it's not prohibited, and the component AGENTS.md template explicitly includes it.
- **What we do**: Include `VariantProps<typeof inputVariants>` in the type intersection, matching the canonical component creation guide in `packages/ui/src/components/AGENTS.md`.
