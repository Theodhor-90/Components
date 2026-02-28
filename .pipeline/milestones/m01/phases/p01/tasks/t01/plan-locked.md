Now I have all the context needed. Let me produce the complete implementation plan.

# Task 1: Separator — Implementation Plan

## 1. Deliverables

| #   | File                                                         | Purpose                                                               |
| --- | ------------------------------------------------------------ | --------------------------------------------------------------------- |
| 1   | `packages/ui/package.json`                                   | **Modify** — add `@radix-ui/react-separator` to `dependencies`        |
| 2   | `packages/ui/src/components/separator/separator.types.ts`    | **Create** — TypeScript prop types for Separator                      |
| 3   | `packages/ui/src/components/separator/separator.styles.ts`   | **Create** — CVA variant definitions for orientation                  |
| 4   | `packages/ui/src/components/separator/separator.tsx`         | **Create** — Component implementation wrapping Radix Separator        |
| 5   | `packages/ui/src/components/separator/separator.test.tsx`    | **Create** — Vitest + Testing Library + vitest-axe tests              |
| 6   | `packages/ui/src/components/separator/separator.stories.tsx` | **Create** — Storybook CSF3 stories with autodocs                     |
| 7   | `packages/ui/src/index.ts`                                   | **Modify** — add Separator, SeparatorProps, separatorVariants exports |

## 2. Dependencies

### Pre-existing (already installed)

- `@radix-ui/react-slot` — already in `packages/ui/package.json`
- `class-variance-authority` — already in `packages/ui/package.json`
- `@components/utils` — provides `cn()` via `../../lib/utils.js`
- `vitest`, `@testing-library/react`, `@testing-library/user-event`, `vitest-axe` — in devDependencies
- `@storybook/react-vite` — available in `apps/docs/`

### To install

- `@radix-ui/react-separator` — add to `packages/ui/package.json` `dependencies` section

**Install command:**

```bash
pnpm --filter @components/ui add @radix-ui/react-separator
```

## 3. Implementation Details

### 3.1 `separator.types.ts`

**Purpose:** Define the `SeparatorProps` type for the Separator component.

**Exports:**

- `SeparatorProps` — type alias

**Definition:**

```typescript
import type { VariantProps } from 'class-variance-authority';
import type * as SeparatorPrimitive from '@radix-ui/react-separator';

import type { separatorVariants } from './separator.styles.js';

export type SeparatorProps = React.ComponentProps<typeof SeparatorPrimitive.Root> &
  VariantProps<typeof separatorVariants>;
```

**Notes:**

- Extends `React.ComponentProps<typeof SeparatorPrimitive.Root>` which already includes `orientation`, `decorative`, `className`, and `ref` (React 19 ref-as-prop).
- Intersected with `VariantProps<typeof separatorVariants>` for the CVA `orientation` variant.
- No `asChild` prop needed — Radix Separator Root already supports it natively via its own props. However, per phase spec DD-6, `asChild` is supported on Separator as a single-element leaf component. Since `@radix-ui/react-separator` Root already exposes `asChild` in its component props, it is inherited automatically — no manual addition needed.

### 3.2 `separator.styles.ts`

**Purpose:** CVA variant definitions for the Separator component.

**Exports:**

- `separatorVariants` — CVA function

**Definition:**

```typescript
import { cva } from 'class-variance-authority';

export const separatorVariants = cva('shrink-0 bg-border', {
  variants: {
    orientation: {
      horizontal: 'h-px w-full',
      vertical: 'h-full w-px',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});
```

**Key logic:**

- Base classes: `shrink-0` (prevent shrinking in flex containers) + `bg-border` (uses semantic `--border` token)
- `horizontal` variant: full width, 1px height (`h-px w-full`)
- `vertical` variant: full height, 1px width (`h-full w-px`)
- Default: `horizontal`

### 3.3 `separator.tsx`

**Purpose:** Separator component implementation wrapping `@radix-ui/react-separator`.

**Exports:**

- `Separator` — function component
- `SeparatorProps` — re-exported type from `.types.js`

**Definition:**

```typescript
import * as SeparatorPrimitive from '@radix-ui/react-separator';

import { cn } from '../../lib/utils.js';
import { separatorVariants } from './separator.styles.js';
import type { SeparatorProps } from './separator.types.js';

export type { SeparatorProps } from './separator.types.js';

export function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ref,
  ...props
}: SeparatorProps): React.JSX.Element {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(separatorVariants({ orientation, className }))}
      ref={ref}
      {...props}
    />
  );
}
```

**Key logic:**

- Destructures `orientation` and `decorative` with defaults matching Radix defaults (`'horizontal'` and `true`).
- Passes `orientation` to both the Radix primitive (for `aria-orientation` semantics) and CVA (for visual styling).
- Uses `cn()` to merge CVA-generated classes with any consumer-provided `className`.
- `data-slot="separator"` on root element per project convention.
- React 19 ref-as-prop pattern — `ref` destructured directly from props, no `forwardRef`.
- Return type explicitly annotated as `React.JSX.Element` matching Button reference.

### 3.4 `separator.test.tsx`

**Purpose:** Comprehensive test suite for the Separator component.

**Test setup:** Uses the project's existing `test-setup.ts` which configures jsdom environment, `@testing-library/jest-dom` matchers, `vitest-axe` matchers, and automatic cleanup.

**Tests:**

| #   | Test Name                                               | What It Verifies                                                               |
| --- | ------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 1   | `renders with default props`                            | Renders a horizontal separator element with `role="none"` (decorative default) |
| 2   | `renders as horizontal by default`                      | Has `h-px` and `w-full` classes                                                |
| 3   | `renders as vertical when orientation is vertical`      | Has `h-full` and `w-px` classes                                                |
| 4   | `has role="separator" when not decorative`              | Non-decorative separator has `role="separator"`                                |
| 5   | `has aria-orientation when vertical and non-decorative` | `aria-orientation="vertical"` present on non-decorative vertical separator     |
| 6   | `merges custom className`                               | Consumer-provided className is present alongside base classes                  |
| 7   | `has data-slot attribute`                               | `data-slot="separator"` is present                                             |
| 8   | `has no accessibility violations`                       | vitest-axe `axe()` passes with no violations                                   |

**Implementation:**

```typescript
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Separator } from './separator.js';

describe('Separator', () => {
  it('renders with default props', () => {
    render(<Separator />);
    // Decorative separators get role="none" from Radix
    expect(screen.getByRole('none')).toBeInTheDocument();
  });

  it('renders as horizontal by default', () => {
    render(<Separator data-testid="sep" />);
    const el = screen.getByTestId('sep');
    expect(el).toHaveClass('h-px');
    expect(el).toHaveClass('w-full');
  });

  it('renders as vertical when orientation is vertical', () => {
    render(<Separator orientation="vertical" data-testid="sep" />);
    const el = screen.getByTestId('sep');
    expect(el).toHaveClass('h-full');
    expect(el).toHaveClass('w-px');
  });

  it('has role="separator" when not decorative', () => {
    render(<Separator decorative={false} />);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('has aria-orientation when vertical and non-decorative', () => {
    render(<Separator orientation="vertical" decorative={false} />);
    const el = screen.getByRole('separator');
    expect(el).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('merges custom className', () => {
    render(<Separator className="my-4" data-testid="sep" />);
    const el = screen.getByTestId('sep');
    expect(el).toHaveClass('my-4');
    expect(el).toHaveClass('bg-border');
  });

  it('has data-slot attribute', () => {
    render(<Separator data-testid="sep" />);
    expect(screen.getByTestId('sep')).toHaveAttribute('data-slot', 'separator');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <div>
        <p>Above</p>
        <Separator />
        <p>Below</p>
      </div>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

**Notes:**

- Decorative separators in Radix get `role="none"` — the test queries by `role("none")` for default decorative behavior and `role("separator")` for non-decorative.
- `data-testid` is used when role-based queries aren't practical (e.g., decorative separators for class checks).
- The axe test wraps the Separator in contextual content to ensure realistic DOM structure.

### 3.5 `separator.stories.tsx`

**Purpose:** Storybook CSF3 stories demonstrating all Separator variants and usage patterns.

**Stories:**

| Story        | Description                                                                    |
| ------------ | ------------------------------------------------------------------------------ |
| `Horizontal` | Default horizontal separator (full width, 1px tall)                            |
| `Vertical`   | Vertical separator inside a `flex flex-row items-stretch h-20` container       |
| `InCard`     | Realistic usage — separator between content sections inside a styled container |

**Implementation:**

```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Separator } from './separator.js';

const meta: Meta<typeof Separator> = {
  title: 'Components/Separator',
  component: Separator,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    decorative: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  args: {},
  render: (args) => (
    <div className="w-full max-w-sm">
      <p className="text-sm">Content above</p>
      <Separator {...args} className="my-4" />
      <p className="text-sm">Content below</p>
    </div>
  ),
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <div className="flex h-20 items-stretch gap-4">
      <p className="text-sm">Left</p>
      <Separator {...args} />
      <p className="text-sm">Right</p>
    </div>
  ),
};

export const InCard: Story = {
  render: () => (
    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <h3 className="text-lg font-semibold">Section Title</h3>
      <p className="text-sm text-muted-foreground">Section description goes here.</p>
      <Separator className="my-4" />
      <p className="text-sm">Additional content below the separator.</p>
    </div>
  ),
};
```

**Notes:**

- `meta` uses `default export` — this is required by Storybook CSF3 and is the one exception to the "no default exports" rule (Storybook requires it).
- `tags: ['autodocs']` enables automatic documentation generation.
- `argTypes` provide interactive controls for orientation and decorative props.
- Render functions wrap the separator in realistic containers to demonstrate spacing and layout.

### 3.6 `packages/ui/src/index.ts` modification

**Purpose:** Add Separator exports to the public API.

**Lines to add** (after the existing Button exports):

```typescript
export { Separator, type SeparatorProps } from './components/separator/separator.js';
export { separatorVariants } from './components/separator/separator.styles.js';
```

### 3.7 `packages/ui/package.json` modification

**Purpose:** Add `@radix-ui/react-separator` as a runtime dependency.

**Change:** Add to the `dependencies` object:

```json
"@radix-ui/react-separator": "^1.1.0"
```

The version `^1.1.0` aligns with the existing `@radix-ui/react-slot` version already in the project.

## 4. API Contracts

### Component API

```typescript
import { Separator } from '@components/ui';

// Horizontal separator (default)
<Separator />

// Vertical separator
<Separator orientation="vertical" />

// Non-decorative (semantic role="separator")
<Separator decorative={false} />

// With custom spacing
<Separator className="my-4" />

// All props combined
<Separator
  orientation="vertical"
  decorative={false}
  className="mx-2"
/>
```

### Props Shape

```typescript
type SeparatorProps = {
  /** Visual orientation. Default: "horizontal" */
  orientation?: 'horizontal' | 'vertical';
  /** Whether the separator is purely decorative (role="none") or semantic (role="separator"). Default: true */
  decorative?: boolean;
  /** Additional CSS class names merged via cn() */
  className?: string;
  /** React 19 ref */
  ref?: React.Ref<HTMLDivElement>;
  /** All other HTML div props are forwarded */
  [key: string]: unknown;
};
```

### CVA Variants Export

```typescript
import { separatorVariants } from '@components/ui';

// Use programmatically to get class strings
const classes = separatorVariants({ orientation: 'vertical' });
// → "shrink-0 bg-border h-full w-px"
```

## 5. Test Plan

### Test Environment

- **Runner:** Vitest with jsdom environment
- **Setup:** `packages/ui/src/test-setup.ts` — registers `@testing-library/jest-dom` matchers, `vitest-axe` matchers, and automatic cleanup
- **Libraries:** `@testing-library/react` for rendering, `vitest-axe` for accessibility assertions
- **Run command:** `pnpm --filter @components/ui test`

### Test Specifications

| #   | Test                                              | Category   | Setup                                                             | Assertion                                       |
| --- | ------------------------------------------------- | ---------- | ----------------------------------------------------------------- | ----------------------------------------------- |
| 1   | renders with default props                        | Smoke      | `render(<Separator />)`                                           | `screen.getByRole('none')` exists in document   |
| 2   | renders as horizontal by default                  | Variant    | `render(<Separator data-testid="sep" />)`                         | Element has `h-px` and `w-full` classes         |
| 3   | renders as vertical                               | Variant    | `render(<Separator orientation="vertical" data-testid="sep" />)`  | Element has `h-full` and `w-px` classes         |
| 4   | has role="separator" when not decorative          | A11y/ARIA  | `render(<Separator decorative={false} />)`                        | `screen.getByRole('separator')` exists          |
| 5   | has aria-orientation when vertical non-decorative | A11y/ARIA  | `render(<Separator orientation="vertical" decorative={false} />)` | `aria-orientation="vertical"` attribute present |
| 6   | merges custom className                           | className  | `render(<Separator className="my-4" data-testid="sep" />)`        | Has both `my-4` and `bg-border` classes         |
| 7   | has data-slot attribute                           | Convention | `render(<Separator data-testid="sep" />)`                         | `data-slot="separator"` attribute present       |
| 8   | has no accessibility violations                   | Axe        | `render(<div><p>Above</p><Separator /><p>Below</p></div>)`        | `axe(container)` returns no violations          |

## 6. Implementation Order

1. **Install dependency** — Run `pnpm --filter @components/ui add @radix-ui/react-separator` to add the Radix primitive. This must happen first so TypeScript can resolve the import.

2. **Create `separator.styles.ts`** — CVA variant definitions. No imports from other Separator files, so it can be created first.

3. **Create `separator.types.ts`** — Props type definition. Depends on `separator.styles.ts` for the `VariantProps` import and on the Radix package for `SeparatorPrimitive.Root`.

4. **Create `separator.tsx`** — Component implementation. Depends on both `.styles.ts` and `.types.ts`.

5. **Update `packages/ui/src/index.ts`** — Add Separator, SeparatorProps, and separatorVariants exports. Do this before tests/stories so that the public API is complete.

6. **Create `separator.test.tsx`** — Tests. Depends on the component implementation to be in place.

7. **Create `separator.stories.tsx`** — Storybook stories. Depends on the component implementation. Created last because it has no downstream dependents.

8. **Run verification** — Execute test, typecheck, and lint commands to confirm everything works.

## 7. Verification Commands

```bash
# 1. Verify dependency was installed
pnpm --filter @components/ui exec -- node -e "require.resolve('@radix-ui/react-separator')"

# 2. Run the Separator tests specifically
pnpm --filter @components/ui test -- separator

# 3. Run the full test suite to ensure nothing was broken
pnpm --filter @components/ui test

# 4. Type-check the ui package
pnpm --filter @components/ui typecheck

# 5. Lint the ui package
pnpm --filter @components/ui lint

# 6. Verify the 5-file structure exists
ls -la packages/ui/src/components/separator/

# 7. Verify exports are in index.ts (should show Separator lines)
grep -n "separator" packages/ui/src/index.ts
```
