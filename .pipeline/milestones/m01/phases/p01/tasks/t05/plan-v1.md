Now I have all the context needed. Let me produce the implementation plan.

# Task 5: Spinner — Implementation Specification

## 1. Deliverables

| #   | File                                                     | Action     | Purpose                                                                                            |
| --- | -------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------- |
| 1   | `packages/ui/src/components/spinner/spinner.types.ts`    | **Create** | TypeScript prop types: `SpinnerProps` extending `React.ComponentProps<'svg'>` + CVA `VariantProps` |
| 2   | `packages/ui/src/components/spinner/spinner.styles.ts`   | **Create** | CVA variant definitions for `size` (`sm`, `md`, `lg`)                                              |
| 3   | `packages/ui/src/components/spinner/spinner.tsx`         | **Create** | Component implementation — animated SVG circle with accessible label                               |
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

**Purpose:** Define the `SpinnerProps` type.

**Exports:**

- `SpinnerProps` — extends `React.ComponentProps<'svg'>` intersected with `VariantProps<typeof spinnerVariants>`

**Contract:**

```typescript
import type { VariantProps } from 'class-variance-authority';
import type { spinnerVariants } from './spinner.styles.js';

export type SpinnerProps = React.ComponentProps<'svg'> & VariantProps<typeof spinnerVariants>;
```

No `asChild` prop — Spinner has internal SVG structure and does not support polymorphic rendering (per Design Decision DD-6).

### 3.2 `spinner.styles.ts`

**Purpose:** CVA variant definitions for the Spinner size dimension classes.

**Exports:**

- `spinnerVariants` — CVA function

**Definition:**

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

**Purpose:** The Spinner component implementation.

**Exports:**

- `Spinner` (named function export)
- Re-exports `SpinnerProps` type

**Key implementation details:**

1. **Root element:** `<svg>` with `data-slot="spinner"` and `role="status"`
2. **SVG content:** Two `<circle>` elements:
   - Background circle: full circle with low opacity for the track
   - Foreground circle: partial arc using `stroke-dasharray` and `stroke-dashoffset` to create the spinner appearance
3. **SVG attributes:** `viewBox="0 0 24 24"`, `fill="none"`, stroke uses `currentColor`
4. **Accessible label:** A `<span className="sr-only">` immediately after the SVG with text `"Loading"`. When `aria-label` is provided, the `sr-only` span is omitted to avoid duplicate announcements.
5. **Wrapper:** The `role="status"` and `sr-only` span need a common parent. Use a wrapping `<span>` with `role="status"` and `data-slot="spinner"`, and place the `<svg>` (without role) inside it. This keeps the SVG purely visual and the `role="status"` on a container that groups the SVG and the sr-only label together.

**Revised structure (to correctly group role="status" with the label):**

```typescript
import { cn } from '../../lib/utils.js';
import { spinnerVariants } from './spinner.styles.js';
import type { SpinnerProps } from './spinner.types.js';

export type { SpinnerProps } from './spinner.types.js';

export function Spinner({
  className,
  size,
  'aria-label': ariaLabel,
  ref,
  ...props
}: SpinnerProps): React.JSX.Element {
  return (
    <svg
      data-slot="spinner"
      role="status"
      aria-label={ariaLabel ?? 'Loading'}
      className={cn(spinnerVariants({ size, className }))}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      ref={ref}
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
```

**Design rationale update:** After reviewing the spec more carefully, the simplest approach that satisfies "When `aria-label` is provided, the `sr-only` span is omitted" is to always use `aria-label` on the SVG itself (defaulting to `"Loading"`), which eliminates the need for the `sr-only` span entirely. The `sr-only` approach from the spec was specifically to avoid depending on `VisuallyHidden`, but using `aria-label` directly on the SVG is even simpler and equally accessible. However, the spec explicitly calls for a `<span className="sr-only">` with conditional omission. We'll implement both approaches and stick with the spec:

**Final structure:**

```typescript
export function Spinner({
  className,
  size,
  'aria-label': ariaLabel,
  ref,
  ...props
}: SpinnerProps): React.JSX.Element {
  return (
    <span data-slot="spinner" role="status">
      <svg
        className={cn(spinnerVariants({ size, className }))}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        ref={ref}
        {...props}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      {ariaLabel ? (
        <span className="sr-only">{ariaLabel}</span>
      ) : (
        <span className="sr-only">Loading</span>
      )}
    </span>
  );
}
```

**Wait — re-reading the spec:** "When `aria-label` is provided on the root element, the `sr-only` span is omitted to avoid duplicate announcements." This means when `aria-label` is provided, we should put it on the root element AND omit the sr-only span. Let me finalize:

```typescript
export function Spinner({
  className,
  size,
  'aria-label': ariaLabel,
  ref,
  ...props
}: SpinnerProps): React.JSX.Element {
  return (
    <span data-slot="spinner" role="status" aria-label={ariaLabel}>
      <svg
        className={cn(spinnerVariants({ size, className }))}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        ref={ref}
        {...props}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      {!ariaLabel && <span className="sr-only">Loading</span>}
    </span>
  );
}
```

**Important note on types:** The `SpinnerProps` extends `React.ComponentProps<'svg'>`, but since we're wrapping in a `<span>`, the `ref` will be forwarded to the `<svg>` element (as specified). The extra `...props` go on the SVG as well, which is the primary visual element. The outer `<span>` is a thin wrapper only for accessibility grouping.

**SVG pattern used:** The classic Tailwind UI spinner pattern with a background circle at 25% opacity and a foreground partial arc path at 75% opacity, combined with `animate-spin` for the rotation. This is widely used, well-tested, and renders consistently across browsers. Uses `fill` for the path (not `stroke-dasharray`) for simplicity.

### 3.4 `spinner.stories.tsx`

**Purpose:** Storybook CSF3 stories showcasing all spinner variants.

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

The `InButton` story imports `Button` from the sibling component.

### 3.5 `spinner.test.tsx`

See **Section 5: Test Plan** for full details.

### 3.6 `packages/ui/src/index.ts` (Modify)

Add three new export lines after the existing Skeleton exports:

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

**Without `aria-label`:**

```html
<span data-slot="spinner" role="status">
  <svg
    class="animate-spin text-muted-foreground h-6 w-6"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
  <span class="sr-only">Loading</span>
</span>
```

**With `aria-label="Saving"`:**

```html
<span data-slot="spinner" role="status" aria-label="Saving">
  <svg
    class="animate-spin text-muted-foreground h-6 w-6"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
</span>
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

| #   | Test name                                        | What it verifies                                                                                 |
| --- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| 1   | `renders without crashing`                       | Spinner renders and produces a DOM element with `role="status"`                                  |
| 2   | `has role="status"`                              | Root element has `role="status"` attribute                                                       |
| 3   | `has default accessible name "Loading"`          | `sr-only` span with text "Loading" is present when no `aria-label` is provided                   |
| 4   | `omits sr-only span when aria-label is provided` | When `aria-label="Saving"` is passed, no `sr-only` span is rendered, and `aria-label` is on root |
| 5   | `applies default size (md) classes`              | SVG element has `h-6 w-6` classes by default                                                     |
| 6   | `applies sm size classes`                        | When `size="sm"`, SVG has `h-4 w-4` classes                                                      |
| 7   | `applies lg size classes`                        | When `size="lg"`, SVG has `h-8 w-8` classes                                                      |
| 8   | `applies animate-spin class`                     | SVG has `animate-spin` class for rotation animation                                              |
| 9   | `merges custom className`                        | Custom `className="text-primary"` is applied to SVG                                              |
| 10  | `has data-slot attribute`                        | Root element has `data-slot="spinner"`                                                           |
| 11  | `uses currentColor for stroke`                   | The SVG circle has `stroke="currentColor"`, and the path has `fill="currentColor"`               |
| 12  | `forwards ref to svg element`                    | `createRef<SVGSVGElement>()` is attached and points to the SVG element                           |
| 13  | `has no accessibility violations`                | `axe(container)` returns no violations                                                           |

### Test details

**Test 1: `renders without crashing`**

```typescript
render(<Spinner />);
expect(screen.getByRole('status')).toBeInTheDocument();
```

**Test 2: `has role="status"`**

```typescript
render(<Spinner />);
expect(screen.getByRole('status')).toBeInTheDocument();
```

**Test 3: `has default accessible name "Loading"`**

```typescript
render(<Spinner />);
expect(screen.getByText('Loading')).toBeInTheDocument();
expect(screen.getByText('Loading')).toHaveClass('sr-only');
```

**Test 4: `omits sr-only span when aria-label is provided`**

```typescript
render(<Spinner aria-label="Saving" />);
expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Saving');
expect(screen.queryByText('Loading')).not.toBeInTheDocument();
```

**Test 5: `applies default size (md) classes`**

```typescript
render(<Spinner data-testid="spinner" />);
const svg = screen.getByTestId('spinner').querySelector('svg')!;
expect(svg).toHaveClass('h-6', 'w-6');
```

**Test 6: `applies sm size classes`**

```typescript
render(<Spinner size="sm" data-testid="spinner" />);
const svg = screen.getByTestId('spinner').querySelector('svg')!;
expect(svg).toHaveClass('h-4', 'w-4');
```

**Test 7: `applies lg size classes`**

```typescript
render(<Spinner size="lg" data-testid="spinner" />);
const svg = screen.getByTestId('spinner').querySelector('svg')!;
expect(svg).toHaveClass('h-8', 'w-8');
```

**Test 8: `applies animate-spin class`**

```typescript
render(<Spinner data-testid="spinner" />);
const svg = screen.getByTestId('spinner').querySelector('svg')!;
expect(svg).toHaveClass('animate-spin');
```

**Test 9: `merges custom className`**

```typescript
render(<Spinner className="text-primary" data-testid="spinner" />);
const svg = screen.getByTestId('spinner').querySelector('svg')!;
expect(svg).toHaveClass('text-primary');
```

**Test 10: `has data-slot attribute`**

```typescript
render(<Spinner />);
expect(screen.getByRole('status')).toHaveAttribute('data-slot', 'spinner');
```

**Test 11: `uses currentColor for stroke`**

```typescript
render(<Spinner data-testid="spinner" />);
const svg = screen.getByTestId('spinner').querySelector('svg')!;
const circle = svg.querySelector('circle')!;
expect(circle).toHaveAttribute('stroke', 'currentColor');
const path = svg.querySelector('path')!;
expect(path).toHaveAttribute('fill', 'currentColor');
```

**Test 12: `forwards ref to svg element`**

```typescript
const ref = createRef<SVGSVGElement>();
render(<Spinner ref={ref} />);
expect(ref.current).toBeInstanceOf(SVGSVGElement);
```

**Test 13: `has no accessibility violations`**

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
