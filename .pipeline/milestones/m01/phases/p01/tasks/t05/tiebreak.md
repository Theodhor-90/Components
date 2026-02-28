Now I have all the context needed. Let me produce the definitive specification.

# Task 5: Spinner — Implementation Specification

## 1. Deliverables

| #   | File                                                     | Action     | Purpose                                                                                            |
| --- | -------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------- |
| 1   | `packages/ui/src/components/spinner/spinner.types.ts`    | **Create** | TypeScript prop types: `SpinnerProps` extending `React.ComponentProps<'svg'>` + CVA `VariantProps` |
| 2   | `packages/ui/src/components/spinner/spinner.styles.ts`   | **Create** | CVA variant definitions for `size` (`sm`, `md`, `lg`)                                              |
| 3   | `packages/ui/src/components/spinner/spinner.tsx`         | **Create** | Component implementation — animated SVG circle with `stroke-dasharray` and accessible label        |
| 4   | `packages/ui/src/components/spinner/spinner.test.tsx`    | **Create** | Vitest + Testing Library + vitest-axe tests                                                        |
| 5   | `packages/ui/src/components/spinner/spinner.stories.tsx` | **Create** | Storybook CSF3 stories with autodocs                                                               |
| 6   | `packages/ui/src/index.ts`                               | **Modify** | Add `Spinner`, `type SpinnerProps`, and `spinnerVariants` exports                                  |

## 2. Dependencies

### Pre-existing (no installation needed)

- `class-variance-authority` — already in `packages/ui/package.json`
- `@components/utils` — `cn()` helper, already available
- `vitest`, `@testing-library/react`, `@testing-library/user-event`, `vitest-axe` — already in devDependencies
- `@storybook/react-vite` — already configured in `apps/docs/`

### New dependencies

**None.** Spinner is a custom SVG component with no Radix dependency and no third-party library requirements.

## 3. Implementation Details

### 3.1 `spinner.types.ts`

**Exports:**

- `SpinnerProps` — extends `React.ComponentProps<'svg'>` intersected with `VariantProps<typeof spinnerVariants>`

```typescript
import type { VariantProps } from 'class-variance-authority';
import type { spinnerVariants } from './spinner.styles.js';

export type SpinnerProps = React.ComponentProps<'svg'> & VariantProps<typeof spinnerVariants>;
```

No `asChild` prop — Spinner has internal SVG structure and does not support polymorphic rendering (per Design Decision DD-6).

### 3.2 `spinner.styles.ts`

**Exports:**

- `spinnerVariants` — CVA function

```typescript
import { cva } from 'class-variance-authority';

export const spinnerVariants = cva('animate-spin text-muted-foreground', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
```

- **Base classes:** `animate-spin` for rotation animation, `text-muted-foreground` for default stroke color (inheritable via `currentColor`)
- **Variants:** `size` with three options mapping to Tailwind dimension classes
- **Default:** `"md"` (24×24)

### 3.3 `spinner.tsx`

**Exports:**

- `Spinner` (named function export)
- Re-exports `SpinnerProps` type

**Design deviation from spec — `aria-label` instead of `sr-only` span:** The task spec calls for a `<span className="sr-only">Loading</span>` with conditional omission when `aria-label` is provided. This plan uses `aria-label` directly on the `<svg>` root instead. Rationale: the v1 review identified that a wrapper `<span>` creates a type mismatch (`SpinnerProps` extends `React.ComponentProps<'svg'>` but the root would be a `<span>`), and causes `ref`, `data-slot`, `role`, and spread props to land on different elements. Using `aria-label` on the SVG root is simpler, avoids the wrapper, keeps `SpinnerProps` accurate, and provides equivalent accessibility. This was explicitly recommended by the v1 reviewer.

**SVG animation technique:** Uses the `stroke-dasharray` approach specified in Design Decision DD-3. The SVG renders a single `<circle>` element with:

- `stroke="currentColor"` — inherits text color from parent
- `fill="none"` — no fill, stroke-only rendering
- `strokeDasharray="20 44"` — creates a visible arc covering roughly 30% of the circumference (circle circumference ≈ 62.83 with r=10; dash of 20 units ≈ 32% visible)
- `strokeLinecap="round"` — rounded end caps for visual polish

The `animate-spin` Tailwind class on the `<svg>` rotates the entire element, creating the spinner effect. The circle has `cx="12" cy="12" r="10"` with `strokeWidth="4"` centered in a `viewBox="0 0 24 24"`.

**Root element:** The `<svg>` element is the single root element. It carries `data-slot="spinner"`, `role="status"`, `aria-label`, `className`, `ref`, and all spread props. There is no wrapper element — this ensures `SpinnerProps` (extending `React.ComponentProps<'svg'>`) accurately describes the root, and `ref` points to the same element that has `data-slot` and `role="status"`.

```typescript
import { cn } from '../../lib/utils.js';
import { spinnerVariants } from './spinner.styles.js';
import type { SpinnerProps } from './spinner.types.js';

export type { SpinnerProps } from './spinner.types.js';

export function Spinner({
  className,
  size,
  'aria-label': ariaLabel = 'Loading',
  ref,
  ...props
}: SpinnerProps): React.JSX.Element {
  return (
    <svg
      data-slot="spinner"
      role="status"
      aria-label={ariaLabel}
      className={cn(spinnerVariants({ size, className }))}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      ref={ref}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
        strokeDasharray="20 44"
        strokeLinecap="round"
      />
    </svg>
  );
}
```

**Key design points:**

- Single root `<svg>` — no wrapper span. All props, ref, data-slot, and role live on the same element.
- `aria-label` defaults to `"Loading"` via destructuring default, so the component always has an accessible name.
- Consumers override the label by passing `aria-label="Saving changes"`.
- `strokeDasharray="20 44"` on a circle with circumference ~62.83 (`2π×10`) creates a visible arc covering ~32% of the circle.
- `currentColor` for stroke ensures color inheritance from Tailwind text utilities.

### 3.4 `spinner.stories.tsx`

**Stories:**

| Story         | Description                                                |
| ------------- | ---------------------------------------------------------- |
| `Default`     | Medium size spinner (default)                              |
| `Small`       | `size="sm"` (16×16)                                        |
| `Large`       | `size="lg"` (32×32)                                        |
| `CustomColor` | `className="text-primary"` overrides default muted color   |
| `InButton`    | Spinner inside a disabled Button demonstrating composition |

**Meta config:**

- `title: 'Components/Spinner'`
- `component: Spinner`
- `tags: ['autodocs']`
- `argTypes` for `size` with `control: 'select'` and options `['sm', 'md', 'lg']`

The `InButton` story imports `Button` from the sibling component:

```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../button/button.js';
import { Spinner } from './spinner.js';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Large: Story = {
  args: { size: 'lg' },
};

export const CustomColor: Story = {
  args: { className: 'text-primary' },
};

export const InButton: Story = {
  render: () => (
    <Button disabled>
      <Spinner size="sm" className="text-primary-foreground" />
      Saving...
    </Button>
  ),
};
```

### 3.5 `spinner.test.tsx`

See **Section 5: Test Plan** for full details.

### 3.6 `packages/ui/src/index.ts` (Modify)

Add two new export lines after the existing Skeleton exports:

```typescript
export { Spinner, type SpinnerProps } from './components/spinner/spinner.js';
export { spinnerVariants } from './components/spinner/spinner.styles.js';
```

## 4. API Contracts

### Component API

```typescript
// Props
type SpinnerProps = React.ComponentProps<'svg'> & VariantProps<typeof spinnerVariants>;

// The size variant
type size = 'sm' | 'md' | 'lg' | null | undefined;
```

### Usage Examples

**Basic usage (defaults to medium, "Loading" label):**

```tsx
<Spinner />
```

**With explicit size:**

```tsx
<Spinner size="lg" />
```

**Custom color:**

```tsx
<Spinner className="text-primary" />
```

**Custom accessible label:**

```tsx
<Spinner aria-label="Saving changes" />
```

**Inside a button:**

```tsx
<Button disabled>
  <Spinner size="sm" className="text-primary-foreground" />
  Saving...
</Button>
```

### Rendered DOM structure

The Spinner renders a single `<svg>` element with no wrapper:

```html
<svg
  data-slot="spinner"
  role="status"
  aria-label="Loading"
  class="animate-spin text-muted-foreground h-6 w-6"
  viewBox="0 0 24 24"
  fill="none"
>
  <circle
    cx="12"
    cy="12"
    r="10"
    stroke="currentColor"
    stroke-width="4"
    fill="none"
    stroke-dasharray="20 44"
    stroke-linecap="round"
  />
</svg>
```

**With custom `aria-label`:**

```html
<svg
  data-slot="spinner"
  role="status"
  aria-label="Saving changes"
  class="animate-spin text-muted-foreground h-6 w-6"
  viewBox="0 0 24 24"
  fill="none"
>
  <circle
    cx="12"
    cy="12"
    r="10"
    stroke="currentColor"
    stroke-width="4"
    fill="none"
    stroke-dasharray="20 44"
    stroke-linecap="round"
  />
</svg>
```

## 5. Test Plan

### Test file: `spinner.test.tsx`

**Imports:**

```typescript
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Spinner } from './spinner.js';
```

### Test cases

| #   | Test name                               | What it verifies                                                                                                       |
| --- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 1   | `renders without crashing`              | Spinner renders and produces a DOM element with `role="status"`                                                        |
| 2   | `has role="status" on the svg element`  | Root SVG element has `role="status"` attribute and is an SVG element                                                   |
| 3   | `has default accessible name "Loading"` | Root SVG has `aria-label="Loading"` by default                                                                         |
| 4   | `supports custom aria-label`            | When `aria-label="Saving"` is passed, root SVG has `aria-label="Saving"`                                               |
| 5   | `applies default size (md) classes`     | Root SVG has `h-6 w-6` classes by default                                                                              |
| 6   | `applies sm size classes`               | When `size="sm"`, root SVG has `h-4 w-4` classes                                                                       |
| 7   | `applies lg size classes`               | When `size="lg"`, root SVG has `h-8 w-8` classes                                                                       |
| 8   | `applies animate-spin class`            | Root SVG has `animate-spin` class for rotation animation                                                               |
| 9   | `merges custom className`               | Custom `className="text-primary"` is applied to root SVG                                                               |
| 10  | `has data-slot attribute`               | Root SVG has `data-slot="spinner"`                                                                                     |
| 11  | `uses currentColor for stroke`          | The circle element has `stroke="currentColor"`                                                                         |
| 12  | `uses stroke-dasharray for arc`         | The circle element has a `stroke-dasharray` attribute                                                                  |
| 13  | `forwards ref to svg element`           | `createRef<SVGSVGElement>()` is attached and points to the root SVG element (same element with `data-slot` and `role`) |
| 14  | `has no accessibility violations`       | `axe(container)` returns no violations                                                                                 |

### Test details

**Test 1: `renders without crashing`**

```typescript
render(<Spinner />);
expect(screen.getByRole('status')).toBeInTheDocument();
```

**Test 2: `has role="status" on the svg element`**

```typescript
render(<Spinner />);
const spinner = screen.getByRole('status');
expect(spinner).toBeInTheDocument();
expect(spinner.tagName.toLowerCase()).toBe('svg');
```

**Test 3: `has default accessible name "Loading"`**

```typescript
render(<Spinner />);
const spinner = screen.getByRole('status');
expect(spinner).toHaveAttribute('aria-label', 'Loading');
```

**Test 4: `supports custom aria-label`**

```typescript
render(<Spinner aria-label="Saving" />);
const spinner = screen.getByRole('status');
expect(spinner).toHaveAttribute('aria-label', 'Saving');
```

**Test 5: `applies default size (md) classes`**

```typescript
render(<Spinner />);
const spinner = screen.getByRole('status');
expect(spinner).toHaveClass('h-6', 'w-6');
```

**Test 6: `applies sm size classes`**

```typescript
render(<Spinner size="sm" />);
const spinner = screen.getByRole('status');
expect(spinner).toHaveClass('h-4', 'w-4');
```

**Test 7: `applies lg size classes`**

```typescript
render(<Spinner size="lg" />);
const spinner = screen.getByRole('status');
expect(spinner).toHaveClass('h-8', 'w-8');
```

**Test 8: `applies animate-spin class`**

```typescript
render(<Spinner />);
const spinner = screen.getByRole('status');
expect(spinner).toHaveClass('animate-spin');
```

**Test 9: `merges custom className`**

```typescript
render(<Spinner className="text-primary" />);
const spinner = screen.getByRole('status');
expect(spinner).toHaveClass('text-primary');
```

**Test 10: `has data-slot attribute`**

```typescript
render(<Spinner />);
expect(screen.getByRole('status')).toHaveAttribute('data-slot', 'spinner');
```

**Test 11: `uses currentColor for stroke`**

```typescript
render(<Spinner />);
const circle = screen.getByRole('status').querySelector('circle')!;
expect(circle).toHaveAttribute('stroke', 'currentColor');
```

**Test 12: `uses stroke-dasharray for arc`**

```typescript
render(<Spinner />);
const circle = screen.getByRole('status').querySelector('circle')!;
expect(circle).toHaveAttribute('stroke-dasharray');
```

**Test 13: `forwards ref to svg element`**

```typescript
const ref = createRef<SVGSVGElement>();
render(<Spinner ref={ref} />);
expect(ref.current).toBeInstanceOf(SVGSVGElement);
expect(ref.current).toHaveAttribute('data-slot', 'spinner');
expect(ref.current).toHaveAttribute('role', 'status');
```

**Test 14: `has no accessibility violations`**

```typescript
const { container } = render(<Spinner />);
const results = await axe(container);
expect(results).toHaveNoViolations();
```

## 6. Implementation Order

1. **`spinner.styles.ts`** — Create CVA variant definitions first. No dependencies on other files.
2. **`spinner.types.ts`** — Create prop types. Imports `spinnerVariants` type from styles.
3. **`spinner.tsx`** — Create component implementation. Imports from styles and types.
4. **`spinner.test.tsx`** — Create tests. Imports from component.
5. **`spinner.stories.tsx`** — Create stories. Imports from component (and Button for the `InButton` story).
6. **`packages/ui/src/index.ts`** — Add export lines for `Spinner`, `SpinnerProps`, and `spinnerVariants`.

## 7. Verification Commands

```bash
# Run Spinner tests only
pnpm --filter @components/ui test -- spinner

# Run all tests to ensure no regressions
pnpm test

# TypeScript type checking
pnpm typecheck

# Lint check
pnpm lint

# Verify exports compile correctly
pnpm build

# Launch Storybook to visually verify stories
pnpm storybook
```
