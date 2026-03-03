No problem — I have sufficient context from the task spec and existing patterns. Here is the full implementation plan:

# Task 5: Progress Component — Implementation Plan

## 1. Deliverables

| #   | File                                                       | Action | Purpose                                                             |
| --- | ---------------------------------------------------------- | ------ | ------------------------------------------------------------------- |
| 1   | `packages/ui/src/components/progress/progress.types.ts`    | Create | Props type for Progress extending Radix `ProgressPrimitive.Root`    |
| 2   | `packages/ui/src/components/progress/progress.styles.ts`   | Create | Static string constants for track and indicator styles              |
| 3   | `packages/ui/src/components/progress/progress.tsx`         | Create | Implementation of Progress with translateX-based animated indicator |
| 4   | `packages/ui/src/components/progress/progress.test.tsx`    | Create | Vitest + Testing Library + vitest-axe test suite                    |
| 5   | `packages/ui/src/components/progress/progress.stories.tsx` | Create | Storybook CSF3 stories with `tags: ['autodocs']`                    |
| 6   | `packages/ui/src/index.ts`                                 | Modify | Add Progress, ProgressProps, and style constants to public exports  |
| 7   | `packages/ui/package.json`                                 | Modify | Add `@radix-ui/react-progress` dependency                           |

## 2. Dependencies

### New Dependency to Install

- `@radix-ui/react-progress` — Radix primitive providing accessible `<div role="progressbar">` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` attributes built in.

### Existing Dependencies Used

- `@components/utils` — `cn()` helper (clsx + tailwind-merge) for className merging
- No CVA dependency needed — Progress has no variants, only static string constants

### Prerequisites

- Phase 1 (Tables & Pagination) must be complete (it is).
- Tasks 1–4 of this phase are complete (they are). This task has no dependency on them but they establish the current state of `index.ts` and `package.json`.

## 3. Implementation Details

### 3.1 `progress.types.ts`

**Purpose**: Define the `ProgressProps` type.

**Exports**:

- `ProgressProps` — type alias

**Contract**:

```typescript
import type * as ProgressPrimitive from '@radix-ui/react-progress';

export type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root>;
```

The `value` prop (number 0–100) is inherited from `React.ComponentProps<typeof ProgressPrimitive.Root>`. No additional custom props are needed. The type extends Radix's Root component props, which includes `ref` via React 19's `ComponentProps`.

### 3.2 `progress.styles.ts`

**Purpose**: Define static string constants for the track and indicator.

**Exports**:

- `progressStyles` — string constant for the track (root) element
- `progressIndicatorStyles` — string constant for the fill indicator element

**Values**:

```typescript
export const progressStyles = 'relative h-4 w-full overflow-hidden rounded-full bg-secondary';

export const progressIndicatorStyles = 'h-full w-full flex-1 bg-primary transition-all';
```

No CVA is used — Progress has a single visual treatment with no variants.

### 3.3 `progress.tsx`

**Purpose**: Implement the Progress component.

**Exports**:

- `Progress` — function component
- Re-export `ProgressProps` type from `progress.types.js`

**Key Logic**:

- Renders `ProgressPrimitive.Root` with `data-slot="progress"` and `progressStyles` merged via `cn()`.
- Inside, renders `ProgressPrimitive.Indicator` with `data-slot="progress-indicator"` and `progressIndicatorStyles` merged via `cn()`.
- The indicator's position is controlled via inline `style={{ transform: \`translateX(-${100 - (value || 0)}%)\` }}`. This uses CSS `translateX` to slide the full-width indicator left, where:
  - `value=0` → `translateX(-100%)` → indicator is fully hidden
  - `value=50` → `translateX(-50%)` → indicator fills half the track
  - `value=100` → `translateX(0%)` → indicator fills the full track
  - `value=undefined` → treated as 0 → `translateX(-100%)`
- The `value` prop is destructured from props to compute the transform and is also passed through to the Radix primitive (via `...props`). Since `value` is a native prop of `ProgressPrimitive.Root`, it must be explicitly passed or included in the spread.

**Implementation**:

```typescript
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '../../lib/utils.js';
import { progressIndicatorStyles, progressStyles } from './progress.styles.js';
import type { ProgressProps } from './progress.types.js';

export type { ProgressProps } from './progress.types.js';

export function Progress({
  className,
  value,
  ref,
  ...props
}: ProgressProps): React.JSX.Element {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(progressStyles, className)}
      ref={ref}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(progressIndicatorStyles)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
```

**Notes**:

- `value` is destructured separately so it can be used in the transform calculation and still passed to the Radix Root.
- The Indicator does not accept a `className` prop from consumers — it uses a fixed style. If a consumer wants to override the indicator color, they can use a custom `className` on the root and target the indicator via CSS, or the spec allows `className` override on `ProgressPrimitive.Indicator` — but the task spec does not call for this. The stories include a "CustomColor" story that overrides via className on the root. On reflection, to match the stories spec which says "CustomColor (progress with overridden indicator color via className)", we should not expose a separate indicator className prop. The consumer can override the indicator using `[data-slot="progress-indicator"]` CSS selector or by overriding via className on the root. However, looking at the shadcn/ui pattern more carefully, they do NOT expose a separate indicator className. The "CustomColor" story can demonstrate wrapping with a `className` that targets the indicator child via Tailwind's `[&>div]` or by demonstrating that the base styles can be overridden.

### 3.4 `progress.test.tsx`

**Purpose**: Comprehensive test suite for the Progress component.

**Test Helper**: A `TestProgress` wrapper is not strictly needed since Progress is a simple single component, but tests will render `<Progress />` directly.

**Tests**:

1. **Smoke render** — renders without crashing with a default value.
2. **Indicator at value=0** — inline style has `translateX(-100%)`.
3. **Indicator at value=50** — inline style has `translateX(-50%)`.
4. **Indicator at value=100** — inline style has `translateX(0%)`.
5. **Undefined value renders as 0%** — when no `value` prop is passed, transform is `translateX(-100%)`.
6. **`data-slot` on root** — root element has `data-slot="progress"`.
7. **`data-slot` on indicator** — indicator element has `data-slot="progress-indicator"`.
8. **className merging** — custom className on root merges with base styles.
9. **ref forwarding** — ref points to the root HTML element (a `<div>`).
10. **`aria-valuenow` reflects value** — Radix sets this attribute automatically.
11. **`aria-valuemin` and `aria-valuemax` are set** — Radix sets `aria-valuemin="0"` and `aria-valuemax="100"`.
12. **role="progressbar"** — Radix sets this automatically.
13. **vitest-axe accessibility** — no accessibility violations.

**Pattern**: Follows the same testing patterns as Avatar (`avatar.test.tsx`) and Tooltip (`tooltip.test.tsx`) — using `createRef`, `render`, `screen`, `axe`, `describe`/`expect`/`it` from vitest.

```typescript
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Progress } from './progress.js';

describe('Progress', () => {
  it('renders without crashing', () => {
    render(<Progress value={60} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders indicator with translateX(-100%) for value=0', () => {
    render(<Progress value={0} />);
    const indicator = document.querySelector('[data-slot="progress-indicator"]');
    expect(indicator).toHaveStyle({ transform: 'translateX(-100%)' });
  });

  it('renders indicator with translateX(-50%) for value=50', () => {
    render(<Progress value={50} />);
    const indicator = document.querySelector('[data-slot="progress-indicator"]');
    expect(indicator).toHaveStyle({ transform: 'translateX(-50%)' });
  });

  it('renders indicator with translateX(0%) for value=100', () => {
    render(<Progress value={100} />);
    const indicator = document.querySelector('[data-slot="progress-indicator"]');
    expect(indicator).toHaveStyle({ transform: 'translateX(0%)' });
  });

  it('treats undefined value as 0%', () => {
    render(<Progress />);
    const indicator = document.querySelector('[data-slot="progress-indicator"]');
    expect(indicator).toHaveStyle({ transform: 'translateX(-100%)' });
  });

  it('has data-slot="progress" on root', () => {
    render(<Progress value={60} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('data-slot', 'progress');
  });

  it('has data-slot="progress-indicator" on indicator', () => {
    render(<Progress value={60} />);
    expect(document.querySelector('[data-slot="progress-indicator"]')).toBeInTheDocument();
  });

  it('merges custom className on root', () => {
    render(<Progress value={60} className="custom-class" />);
    const root = screen.getByRole('progressbar');
    expect(root).toHaveClass('custom-class');
    expect(root).toHaveClass('rounded-full');
  });

  it('forwards ref to root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Progress value={60} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute('data-slot', 'progress');
  });

  it('sets aria-valuenow to the value', () => {
    render(<Progress value={75} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
  });

  it('sets aria-valuemin and aria-valuemax', () => {
    render(<Progress value={50} />);
    const root = screen.getByRole('progressbar');
    expect(root).toHaveAttribute('aria-valuemin', '0');
    expect(root).toHaveAttribute('aria-valuemax', '100');
  });

  it('has role="progressbar"', () => {
    render(<Progress value={60} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Progress value={60} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### 3.5 `progress.stories.tsx`

**Purpose**: Storybook documentation with CSF3 format.

**Meta configuration**:

- `title: 'Components/Progress'`
- `component: Progress`
- `tags: ['autodocs']`

**Stories**:

1. **Default** — Progress at 60% (`value={60}`).
2. **Empty** — Progress at 0% (`value={0}`).
3. **Complete** — Progress at 100% (`value={100}`).
4. **Animated** — Interactive story using `React.useState` and a button that increments value by 10 on each click, demonstrating the CSS transition. Uses `render` function in the story.
5. **CustomColor** — Progress with an overridden indicator color. Demonstrates using `className` with `[&>[data-slot=progress-indicator]]:bg-destructive` to change the indicator color to destructive.

```typescript
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../button/button.js';
import { Progress } from './progress.js';

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 60,
  },
};

export const Empty: Story = {
  args: {
    value: 0,
  },
};

export const Complete: Story = {
  args: {
    value: 100,
  },
};

export const Animated: Story = {
  render: () => {
    const [value, setValue] = useState(0);
    return (
      <div className="space-y-4">
        <Progress value={value} />
        <Button
          variant="outline"
          onClick={() => setValue((prev) => Math.min(prev + 10, 100))}
        >
          Increment (+10)
        </Button>
      </div>
    );
  },
};

export const CustomColor: Story = {
  render: () => (
    <Progress
      value={60}
      className="[&>[data-slot=progress-indicator]]:bg-destructive"
    />
  ),
};
```

### 3.6 `packages/ui/src/index.ts` (Modify)

Append the following exports after the existing HoverCard exports:

```typescript
export { Progress, type ProgressProps } from './components/progress/progress.js';
export { progressStyles, progressIndicatorStyles } from './components/progress/progress.styles.js';
```

### 3.7 `packages/ui/package.json` (Modify)

Add `@radix-ui/react-progress` to the `dependencies` object. The version should match the Radix version range used by sibling dependencies (e.g., `^1.x.x`). Looking at the existing pattern:

```json
"@radix-ui/react-progress": "^1.1.4"
```

The exact minor version will be resolved by pnpm; using `^1.1.4` as the minimum version (the latest stable as of the project's dependency pattern).

## 4. API Contracts

### Progress Component Props

```typescript
type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root>;
```

This inherits from Radix's Progress Root, which includes:

| Prop        | Type                        | Default     | Description                                    |
| ----------- | --------------------------- | ----------- | ---------------------------------------------- |
| `value`     | `number \| null`            | `undefined` | Current progress value (0–100)                 |
| `max`       | `number`                    | `100`       | Maximum value                                  |
| `className` | `string`                    | `undefined` | Additional CSS classes merged with base styles |
| `ref`       | `React.Ref<HTMLDivElement>` | `undefined` | Ref forwarded to the root `<div>`              |

### Rendered HTML Output

```html
<div
  role="progressbar"
  aria-valuenow="60"
  aria-valuemin="0"
  aria-valuemax="100"
  data-slot="progress"
  data-state="loading"
  data-value="60"
  data-max="100"
  class="relative h-4 w-full overflow-hidden rounded-full bg-secondary"
>
  <div
    data-slot="progress-indicator"
    data-state="loading"
    data-value="60"
    data-max="100"
    class="h-full w-full flex-1 bg-primary transition-all"
    style="transform: translateX(-40%)"
  ></div>
</div>
```

### Style Constants Exported

| Export                    | Value                                                             |
| ------------------------- | ----------------------------------------------------------------- |
| `progressStyles`          | `'relative h-4 w-full overflow-hidden rounded-full bg-secondary'` |
| `progressIndicatorStyles` | `'h-full w-full flex-1 bg-primary transition-all'`                |

## 5. Test Plan

### Test Setup

- **Framework**: Vitest + @testing-library/react + vitest-axe
- **Imports**: `createRef` from `react`, `render`/`screen` from `@testing-library/react`, `axe` from `vitest-axe`, `describe`/`expect`/`it` from `vitest`
- **No mock setup needed**: Progress does not depend on image loading or timers — it is a simple render-based component
- **No `userEvent` needed**: Progress has no user interactions (no click, hover, keyboard)

### Test Specifications

| #   | Test Name                               | Category      | Assertion                                                                  |
| --- | --------------------------------------- | ------------- | -------------------------------------------------------------------------- |
| 1   | renders without crashing                | Smoke         | `getByRole('progressbar')` is in the document                              |
| 2   | indicator translateX(-100%) for value=0 | Render        | `data-slot="progress-indicator"` has `style.transform = translateX(-100%)` |
| 3   | indicator translateX(-50%) for value=50 | Render        | `data-slot="progress-indicator"` has `style.transform = translateX(-50%)`  |
| 4   | indicator translateX(0%) for value=100  | Render        | `data-slot="progress-indicator"` has `style.transform = translateX(0%)`    |
| 5   | undefined value renders as 0%           | Render        | No `value` prop → `translateX(-100%)`                                      |
| 6   | data-slot on root                       | Data Attrs    | Root has `data-slot="progress"`                                            |
| 7   | data-slot on indicator                  | Data Attrs    | Child has `data-slot="progress-indicator"`                                 |
| 8   | className merging on root               | Styling       | Custom class present alongside `rounded-full`                              |
| 9   | ref forwarding                          | Ref           | `ref.current` is `HTMLDivElement` with correct data-slot                   |
| 10  | aria-valuenow reflects value            | Accessibility | `aria-valuenow="75"` when `value={75}`                                     |
| 11  | aria-valuemin and aria-valuemax set     | Accessibility | `aria-valuemin="0"` and `aria-valuemax="100"`                              |
| 12  | role="progressbar"                      | Accessibility | Element has `role="progressbar"`                                           |
| 13  | no accessibility violations             | Accessibility | `axe(container)` has no violations                                         |

## 6. Implementation Order

1. **Install dependency** — Add `@radix-ui/react-progress` to `packages/ui/package.json` and run `pnpm install`.
2. **Create `progress.types.ts`** — Define the `ProgressProps` type.
3. **Create `progress.styles.ts`** — Define the static string constants for track and indicator.
4. **Create `progress.tsx`** — Implement the Progress component with Radix primitives, data-slot attributes, cn() merging, and translateX transform.
5. **Create `progress.test.tsx`** — Write all 13 tests covering smoke, render states, data attributes, className merging, ref forwarding, ARIA attributes, and accessibility.
6. **Create `progress.stories.tsx`** — Write all 5 stories (Default, Empty, Complete, Animated, CustomColor).
7. **Modify `packages/ui/src/index.ts`** — Add Progress, ProgressProps, progressStyles, and progressIndicatorStyles exports.
8. **Verify** — Run `pnpm typecheck`, `pnpm test`, and confirm all passes.

## 7. Verification Commands

```bash
# Install the new dependency
pnpm --filter @components/ui add @radix-ui/react-progress

# Type check the entire project
pnpm typecheck

# Run only progress tests
pnpm --filter @components/ui test -- progress

# Run all tests
pnpm test

# Verify the build compiles
pnpm --filter @components/ui build

# Launch Storybook to visually verify stories (manual check)
pnpm storybook
```

## 8. Design Deviations

None.

The task spec's prescribed approach aligns with established codebase patterns:

- Static string constants (no CVA) match the Tooltip and HoverCard patterns for non-variant components.
- The `translateX` transform pattern matches the shadcn/ui reference implementation.
- Extending `React.ComponentProps<typeof ProgressPrimitive.Root>` follows the exact pattern used by Avatar, Tooltip, and HoverCard types files.
- No `asChild` support is added, which is correct — the Progress root is a Radix container (like Avatar), not a leaf element that needs polymorphic rendering.
