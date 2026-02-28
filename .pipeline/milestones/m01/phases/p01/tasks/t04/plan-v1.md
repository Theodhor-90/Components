Now I have full context. Here is the complete implementation plan:

## 1. Deliverables

| #   | File                                                       | Action     | Purpose                                                                                      |
| --- | ---------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------- |
| 1   | `packages/ui/src/components/skeleton/skeleton.types.ts`    | **Create** | TypeScript prop types for Skeleton (`SkeletonProps` extending `React.ComponentProps<'div'>`) |
| 2   | `packages/ui/src/components/skeleton/skeleton.styles.ts`   | **Create** | Base class string constant for the variant-free Skeleton component                           |
| 3   | `packages/ui/src/components/skeleton/skeleton.tsx`         | **Create** | Component implementation — `<div>` with `animate-pulse rounded-md bg-muted`                  |
| 4   | `packages/ui/src/components/skeleton/skeleton.test.tsx`    | **Create** | Vitest + Testing Library + vitest-axe tests                                                  |
| 5   | `packages/ui/src/components/skeleton/skeleton.stories.tsx` | **Create** | Storybook CSF3 stories with autodocs                                                         |
| 6   | `packages/ui/src/index.ts`                                 | **Modify** | Add `Skeleton` and `type SkeletonProps` exports                                              |

## 2. Dependencies

### Pre-existing (no action required)

- `cn()` helper — available at `../../lib/utils.js` (clsx + tailwind-merge)
- `globals.css` — contains `bg-muted` semantic token
- Tailwind CSS v4 — provides `animate-pulse`, `rounded-md` utility classes
- Vitest + Testing Library + vitest-axe — test infrastructure configured
- Storybook 8.5 — configured in `apps/docs/` with CSF3 and autodocs support

### To install

None. Skeleton has no external dependencies beyond what is already in `packages/ui/package.json`.

## 3. Implementation Details

### 3.1 `skeleton.types.ts`

**Purpose**: Define the prop type for the Skeleton component.

**Exports**:

- `SkeletonProps` — a type alias extending `React.ComponentProps<'div'>`

**Content**:

```typescript
export type SkeletonProps = React.ComponentProps<'div'>;
```

No CVA `VariantProps` intersection is needed because Skeleton is intentionally variant-free (DD-7). No `asChild` property is needed (DD-7).

### 3.2 `skeleton.styles.ts`

**Purpose**: Export the base class string constant for the Skeleton component.

**Exports**:

- `skeletonStyles` — a plain string constant (not a CVA function, matching the Card pattern for variant-free components)

**Content**:

```typescript
export const skeletonStyles = 'animate-pulse rounded-md bg-muted';
```

This follows the same pattern as `card.styles.ts` which exports plain class string constants rather than CVA definitions because Card is also variant-free. Skeleton applies only three base classes:

- `animate-pulse` — Tailwind's pulsing opacity animation for loading states
- `rounded-md` — default border radius
- `bg-muted` — semantic muted background token

### 3.3 `skeleton.tsx`

**Purpose**: Skeleton component implementation — a simple `<div>` that consumers dimension via `className`.

**Exports**:

- `Skeleton` — named function component
- `SkeletonProps` — re-exported type from `skeleton.types.js`

**Key logic**:

- Destructure `className`, `ref`, and spread remaining `...props`
- Apply `data-slot="skeleton"` on the root `<div>`
- Use `cn(skeletonStyles, className)` to merge base classes with consumer-provided classes
- Pass `ref` as a prop (React 19, no `forwardRef`)
- Return type annotation: `React.JSX.Element`

**Content**:

```typescript
import { cn } from '../../lib/utils.js';
import { skeletonStyles } from './skeleton.styles.js';
import type { SkeletonProps } from './skeleton.types.js';

export type { SkeletonProps } from './skeleton.types.js';

export function Skeleton({ className, ref, ...props }: SkeletonProps): React.JSX.Element {
  return <div data-slot="skeleton" className={cn(skeletonStyles, className)} ref={ref} {...props} />;
}
```

### 3.4 `skeleton.test.tsx`

**Purpose**: Comprehensive test suite covering smoke render, class application, className merging, data-slot, ref forwarding, and accessibility.

**Test setup**: Import `render`, `screen` from `@testing-library/react`, `axe` from `vitest-axe`, `createRef` from `react`, `describe`, `expect`, `it` from `vitest`.

**Tests** (8 test cases):

| #   | Test Name                                | What it verifies                                                           |
| --- | ---------------------------------------- | -------------------------------------------------------------------------- |
| 1   | `renders without crashing`               | Smoke test — component mounts and renders children/text content            |
| 2   | `applies animate-pulse class`            | Base styling — `animate-pulse` class is present on the element             |
| 3   | `applies rounded-md class`               | Base styling — `rounded-md` class is present                               |
| 4   | `applies bg-muted class`                 | Base styling — `bg-muted` semantic token class is present                  |
| 5   | `merges custom className for dimensions` | `className="h-4 w-[250px]"` is merged alongside base classes               |
| 6   | `has data-slot attribute`                | `data-slot="skeleton"` is set on the root element                          |
| 7   | `forwards ref`                           | A `createRef<HTMLDivElement>()` is assigned and points to the rendered div |
| 8   | `has no accessibility violations`        | `axe(container)` returns no violations                                     |

### 3.5 `skeleton.stories.tsx`

**Purpose**: Storybook CSF3 stories demonstrating Skeleton usage across common loading placeholder shapes.

**Meta configuration**:

- `title`: `'Components/Skeleton'`
- `component`: `Skeleton`
- `tags`: `['autodocs']`

**Stories** (4 stories):

| #   | Story Name     | Description                                                  | Render                                                                                                                                        |
| --- | -------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `Default`      | Default skeleton (no custom dimensions)                      | `<Skeleton className="h-4 w-full" />`                                                                                                         |
| 2   | `TextLine`     | Text placeholder line                                        | `<Skeleton className="h-4 w-[250px]" />`                                                                                                      |
| 3   | `Circle`       | Circular avatar placeholder                                  | `<Skeleton className="h-12 w-12 rounded-full" />`                                                                                             |
| 4   | `CardSkeleton` | Realistic card loading state with multiple skeleton elements | Composed layout with multiple `<Skeleton>` elements of varying dimensions arranged to simulate a card's title, description, and content areas |

The `CardSkeleton` story renders:

```tsx
<div className="flex flex-col space-y-3">
  <Skeleton className="h-[125px] w-[250px] rounded-xl" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
  </div>
</div>
```

### 3.6 `index.ts` modification

Add the following two export lines after the existing Card exports:

```typescript
export { Skeleton, type SkeletonProps } from './components/skeleton/skeleton.js';
```

No CVA variants export is needed since Skeleton uses a plain class string, not a CVA function. This follows the same pattern as Card, which also has no `cardVariants` export.

## 4. API Contracts

### `Skeleton` component

**Input (props)**:

```typescript
type SkeletonProps = React.ComponentProps<'div'>;
// Includes: className, ref, children, style, id, data-*, aria-*, onClick, etc.
```

**Output**: A `<div>` element with `data-slot="skeleton"` and classes `animate-pulse rounded-md bg-muted` merged with any consumer-provided `className`.

**Usage examples**:

```tsx
// Text line placeholder
<Skeleton className="h-4 w-[250px]" />

// Circle avatar placeholder
<Skeleton className="h-12 w-12 rounded-full" />

// Custom card skeleton
<div className="space-y-2">
  <Skeleton className="h-[125px] w-full rounded-xl" />
  <Skeleton className="h-4 w-3/4" />
  <Skeleton className="h-4 w-1/2" />
</div>
```

**Note**: `rounded-full` in the circle example overrides the base `rounded-md` thanks to `tailwind-merge` via `cn()`.

## 5. Test Plan

### Test setup

```typescript
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Skeleton } from './skeleton.js';
```

### Per-test specification

#### Test 1: `renders without crashing`

```typescript
it('renders without crashing', () => {
  render(<Skeleton data-testid="skeleton" />);
  expect(screen.getByTestId('skeleton')).toBeInTheDocument();
});
```

Uses `data-testid` since Skeleton renders a generic `<div>` with no role or text content by default.

#### Test 2: `applies animate-pulse class`

```typescript
it('applies animate-pulse class', () => {
  render(<Skeleton data-testid="skeleton" />);
  expect(screen.getByTestId('skeleton')).toHaveClass('animate-pulse');
});
```

#### Test 3: `applies rounded-md class`

```typescript
it('applies rounded-md class', () => {
  render(<Skeleton data-testid="skeleton" />);
  expect(screen.getByTestId('skeleton')).toHaveClass('rounded-md');
});
```

#### Test 4: `applies bg-muted class`

```typescript
it('applies bg-muted class', () => {
  render(<Skeleton data-testid="skeleton" />);
  expect(screen.getByTestId('skeleton')).toHaveClass('bg-muted');
});
```

#### Test 5: `merges custom className for dimensions`

```typescript
it('merges custom className for dimensions', () => {
  render(<Skeleton data-testid="skeleton" className="h-4 w-[250px]" />);
  const el = screen.getByTestId('skeleton');
  expect(el).toHaveClass('h-4', 'w-[250px]', 'animate-pulse');
});
```

#### Test 6: `has data-slot attribute`

```typescript
it('has data-slot attribute', () => {
  render(<Skeleton data-testid="skeleton" />);
  expect(screen.getByTestId('skeleton')).toHaveAttribute('data-slot', 'skeleton');
});
```

#### Test 7: `forwards ref`

```typescript
it('forwards ref', () => {
  const ref = createRef<HTMLDivElement>();
  render(<Skeleton ref={ref} />);
  expect(ref.current).toBeInstanceOf(HTMLDivElement);
  expect(ref.current).toHaveAttribute('data-slot', 'skeleton');
});
```

#### Test 8: `has no accessibility violations`

```typescript
it('has no accessibility violations', async () => {
  const { container } = render(<Skeleton />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## 6. Implementation Order

1. **`skeleton.types.ts`** — Define `SkeletonProps` type. No dependencies on other files.
2. **`skeleton.styles.ts`** — Define `skeletonStyles` class string constant. No dependencies on other files.
3. **`skeleton.tsx`** — Implement the Skeleton component. Depends on `skeleton.types.ts` and `skeleton.styles.ts`.
4. **`skeleton.test.tsx`** — Write the test suite. Depends on `skeleton.tsx`.
5. **`skeleton.stories.tsx`** — Write Storybook stories. Depends on `skeleton.tsx`.
6. **`index.ts`** — Add Skeleton and SkeletonProps exports. Depends on `skeleton.tsx` existing.

## 7. Verification Commands

```bash
# Run Skeleton tests only
pnpm --filter @components/ui test -- skeleton

# Run all tests across the monorepo
pnpm test

# TypeScript type checking
pnpm typecheck

# ESLint
pnpm lint

# Storybook (manual visual verification)
pnpm storybook
```
