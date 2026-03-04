Now I have all the information needed. Let me produce the definitive plan.

## 1. Deliverables

| # | File | Purpose |
|---|------|---------|
| 1 | `packages/ui/src/components/stepper/stepper.types.ts` | Public and internal prop types, context type definition |
| 2 | `packages/ui/src/components/stepper/stepper.styles.ts` | CVA variant definitions for container and item, plain string constants for sub-elements |
| 3 | `packages/ui/src/components/stepper/stepper.tsx` | `Stepper` container, `StepperItem` sub-component, `StepperContext` for orientation |
| 4 | `packages/ui/src/components/stepper/stepper.test.tsx` | Vitest + Testing Library + vitest-axe test suite |
| 5 | `packages/ui/src/components/stepper/stepper.stories.tsx` | Storybook CSF3 stories with autodocs |

## 2. Dependencies

### Prior Milestones (must be complete)
- Milestones 1–5 — the 5-file component pattern, testing infrastructure, Storybook configuration, CVA setup, `cn()` utility, and public export conventions are all established.

### Internal Packages (already installed)
- `class-variance-authority` — CVA variant definitions
- `@components/utils` — `cn()` helper (via `../../lib/utils.js`)

### External Libraries
- **None** — Stepper is a custom component built from native HTML `<div>` elements and existing internal utilities. No new dependencies to install.

### Browser APIs
- None required for this task.

## 3. Implementation Details

### 3.1 `stepper.types.ts`

**Purpose:** Define all TypeScript types for the Stepper compound component.

**Exports:**
- `StepperContextType` — `{ orientation: 'horizontal' | 'vertical' }` — shape of the React Context value
- `StepperProps` — extends `React.ComponentProps<'div'>` with `VariantProps<typeof stepperVariants>` for `orientation` (defaults to `'horizontal'`)
- `StepperItemProps` — extends `React.ComponentProps<'div'>` with:
  - `status: 'pending' | 'active' | 'completed' | 'error'` (required)
  - `title: string` (required)
  - `description?: string` (optional)
- `StepperItemInternalProps` — extends `StepperItemProps` with `isLast?: boolean`, annotated with `@internal` JSDoc. This type is NOT exported from `index.ts`.

**Key decisions:**
- `StepperItemProps` does NOT include `orientation` — it reads orientation from context.
- `isLast` is on the internal type only, never exposed to consumers.
- Import `VariantProps` from CVA and `stepperVariants` from styles file using `import type` and `.js` extension.

```typescript
import type { VariantProps } from 'class-variance-authority';

import type { stepperVariants } from './stepper.styles.js';

export type StepperContextType = {
  orientation: 'horizontal' | 'vertical';
};

export type StepperProps = React.ComponentProps<'div'> &
  VariantProps<typeof stepperVariants>;

export type StepperItemProps = React.ComponentProps<'div'> & {
  status: 'pending' | 'active' | 'completed' | 'error';
  title: string;
  description?: string;
};

/** @internal Used by Stepper to inject last-item detection. Not part of the public API. */
export type StepperItemInternalProps = StepperItemProps & {
  isLast?: boolean;
};
```

### 3.2 `stepper.styles.ts`

**Purpose:** CVA variant definitions for `Stepper` container and `StepperItem`, plus plain string constants for sub-element styles.

**Exports:**
- `stepperVariants` — CVA with `orientation` variant:
  - `horizontal`: `'flex-row items-start'`
  - `vertical`: `'flex-col items-start'`
  - Default: `horizontal`
- `stepperItemVariants` — CVA with `status` variant (applied to the icon wrapper):
  - `pending`: `'border-2 border-muted-foreground text-muted-foreground'` (hollow circle outline)
  - `active`: `'bg-primary text-primary-foreground'` (filled primary)
  - `completed`: `'bg-primary text-primary-foreground'` (filled primary with checkmark)
  - `error`: `'bg-destructive text-destructive-foreground'` (filled destructive red)
  - Default: `pending`
- `stepperItemTitleStyles` — `'text-sm font-medium'`
- `stepperItemDescriptionStyles` — `'text-xs text-muted-foreground'`
- `stepperConnectorCompletedStyles` — `'bg-primary'` (solid line for completed)
- `stepperConnectorPendingStyles` — `'bg-border'` (muted solid line for non-completed)

```typescript
import { cva } from 'class-variance-authority';

export const stepperVariants = cva('flex gap-0', {
  variants: {
    orientation: {
      horizontal: 'flex-row items-start',
      vertical: 'flex-col items-start',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

export const stepperItemVariants = cva(
  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
  {
    variants: {
      status: {
        pending: 'border-2 border-muted-foreground text-muted-foreground',
        active: 'bg-primary text-primary-foreground',
        completed: 'bg-primary text-primary-foreground',
        error: 'bg-destructive text-destructive-foreground',
      },
    },
    defaultVariants: {
      status: 'pending',
    },
  },
);

export const stepperItemTitleStyles = 'text-sm font-medium';

export const stepperItemDescriptionStyles = 'text-xs text-muted-foreground';

export const stepperConnectorCompletedStyles = 'bg-primary';

export const stepperConnectorPendingStyles = 'bg-border';
```

### 3.3 `stepper.tsx`

**Purpose:** Main implementation of `Stepper` container and `StepperItem` sub-component.

**Exports:**
- `Stepper` — container component
- `StepperItem` — sub-component
- Re-exports `StepperProps` and `StepperItemProps` types

**Key logic:**

**`StepperContext`** — Created with `createContext<StepperContextType>({ orientation: 'horizontal' })`.

**`Stepper`**:
1. Destructures `className`, `orientation`, `children`, `ref`, `...props`.
2. Uses `Children.toArray(children)` to get child array.
3. Maps over the array. For each child, checks if it's the last element. If so, clones it with `cloneElement(child, { isLast: true })`. The phase spec prescribes this `cloneElement` approach for internal prop injection.
4. Wraps children in `StepperContext.Provider` with `{ orientation: orientation ?? 'horizontal' }`.
5. Renders a root `<div>` with `data-slot="stepper"`, applies `stepperVariants({ orientation, className })` via `cn()`, and forwards `ref`.

**`StepperItem`**:
1. Destructures `className`, `status`, `title`, `description`, `ref`, `...props` — but receives `isLast` from `StepperItemInternalProps` (destructured separately and not spread to the DOM).
2. Reads `orientation` from `useContext(StepperContext)`.
3. Renders a `<div>` with `data-slot="stepper-item"`.
4. Adds `aria-current="step"` when `status === 'active'`.
5. Internal structure depends on orientation:

   **Horizontal layout:**
   ```
   <div class="flex flex-1 flex-col items-center gap-2">
     <div class="flex items-center w-full">
       <div class="icon circle"><!-- SVG icon --></div>
       {!isLast && <div class="connector h-0.5 flex-1 mx-2" />}
     </div>
     <div class="text-center">
       <p class="title">{title}</p>
       {description && <p class="description">{description}</p>}
     </div>
   </div>
   ```

   **Vertical layout:**
   ```
   <div class="flex flex-row gap-3">
     <div class="flex flex-col items-center">
       <div class="icon circle"><!-- SVG icon --></div>
       {!isLast && <div class="connector w-0.5 flex-1 my-1" />}
     </div>
     <div class="pb-6">
       <p class="title">{title}</p>
       {description && <p class="description">{description}</p>}
     </div>
   </div>
   ```

6. **Status icons** — Inline SVGs wrapped in `<span aria-hidden="true">`:
   - `pending`: Small empty circle (`<circle>` with stroke, no fill)
   - `active`: Filled circle (`<circle>` with fill)
   - `completed`: Checkmark (`<polyline>` path)
   - `error`: X mark (two crossed `<line>` elements)

7. **Connecting lines**: Rendered as a `<div>` with height/width depending on orientation. Line color determined by status:
   - `completed` → `stepperConnectorCompletedStyles` (`bg-primary`)
   - All others → `stepperConnectorPendingStyles` (`bg-border`)

8. **Screen reader text**: Each icon wrapper includes an sr-only `<span>` with the status text (e.g., "Completed", "Active") so screen readers announce the status even though the icon is `aria-hidden`.

```typescript
import { Children, cloneElement, createContext, isValidElement, useContext } from 'react';

import { cn } from '../../lib/utils.js';
import {
  stepperConnectorCompletedStyles,
  stepperConnectorPendingStyles,
  stepperItemDescriptionStyles,
  stepperItemTitleStyles,
  stepperItemVariants,
  stepperVariants,
} from './stepper.styles.js';
import type { StepperContextType, StepperItemInternalProps, StepperProps } from './stepper.types.js';

export type { StepperItemProps, StepperProps } from './stepper.types.js';

const StepperContext = createContext<StepperContextType>({ orientation: 'horizontal' });

export function Stepper({ className, orientation, children, ref, ...props }: StepperProps): React.JSX.Element {
  const childArray = Children.toArray(children);
  const lastIndex = childArray.length - 1;

  return (
    <StepperContext.Provider value={{ orientation: orientation ?? 'horizontal' }}>
      <div
        data-slot="stepper"
        className={cn(stepperVariants({ orientation, className }))}
        ref={ref}
        {...props}
      >
        {childArray.map((child, index) =>
          isValidElement(child) && index === lastIndex
            ? cloneElement(child as React.ReactElement<StepperItemInternalProps>, { isLast: true })
            : child,
        )}
      </div>
    </StepperContext.Provider>
  );
}

function StatusIcon({ status }: { status: StepperItemInternalProps['status'] }): React.JSX.Element {
  switch (status) {
    case 'completed':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <polyline points="2.5,7 5.5,10 11.5,4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'error':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <line x1="3.5" y1="3.5" x2="10.5" y2="10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="10.5" y1="3.5" x2="3.5" y2="10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'active':
      return (
        <svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="5" cy="5" r="5" fill="currentColor" />
        </svg>
      );
    case 'pending':
    default:
      return (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
  }
}

export function StepperItem({
  className,
  status,
  title,
  description,
  isLast = false,
  ref,
  ...props
}: StepperItemInternalProps): React.JSX.Element {
  const { orientation } = useContext(StepperContext);
  const connectorStyles = status === 'completed' ? stepperConnectorCompletedStyles : stepperConnectorPendingStyles;

  if (orientation === 'vertical') {
    return (
      <div
        data-slot="stepper-item"
        className={cn('flex flex-row gap-3', className)}
        ref={ref}
        aria-current={status === 'active' ? 'step' : undefined}
        {...props}
      >
        <div className="flex flex-col items-center">
          <div className={cn(stepperItemVariants({ status }))}>
            <StatusIcon status={status} />
          </div>
          {!isLast && <div className={cn('w-0.5 flex-1 my-1', connectorStyles)} />}
        </div>
        <div className="pb-6">
          <p className={stepperItemTitleStyles}>{title}</p>
          {description && <p className={stepperItemDescriptionStyles}>{description}</p>}
          <span className="sr-only">{status}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      data-slot="stepper-item"
      className={cn('flex flex-1 flex-col items-center gap-2', className)}
      ref={ref}
      aria-current={status === 'active' ? 'step' : undefined}
      {...props}
    >
      <div className="flex w-full items-center">
        <div className={cn(stepperItemVariants({ status }))}>
          <StatusIcon status={status} />
        </div>
        {!isLast && <div className={cn('mx-2 h-0.5 flex-1', connectorStyles)} />}
      </div>
      <div className="text-center">
        <p className={stepperItemTitleStyles}>{title}</p>
        {description && <p className={stepperItemDescriptionStyles}>{description}</p>}
        <span className="sr-only">{status}</span>
      </div>
    </div>
  );
}
```

### 3.4 `stepper.test.tsx`

**Purpose:** Comprehensive test suite covering smoke render, variants, interactions, refs, data-slots, and accessibility.

**Test setup:** Uses `@testing-library/react` for rendering/queries, `vitest` for assertions/mocking, `vitest-axe` for accessibility testing. Follows the same import pattern as `button.test.tsx`.

**Test cases (16 tests):**

```typescript
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Stepper, StepperItem } from './stepper.js';

describe('Stepper', () => {
  it('renders with default horizontal orientation', () => { ... });
  it('renders with vertical orientation', () => { ... });
  it('renders pending status icon', () => { ... });
  it('renders active status icon', () => { ... });
  it('renders completed status icon', () => { ... });
  it('renders error status icon', () => { ... });
  it('renders connecting lines between items but not after the last', () => { ... });
  it('completed step connector has distinct style from pending', () => { ... });
  it('renders title and description', () => { ... });
  it('merges custom className on Stepper', () => { ... });
  it('merges custom className on StepperItem', () => { ... });
  it('has data-slot attributes', () => { ... });
  it('forwards ref to Stepper root element', () => { ... });
  it('sets aria-current="step" on active item only', () => { ... });
  it('has no accessibility violations (horizontal)', async () => { ... });
  it('has no accessibility violations (vertical)', async () => { ... });
});
```

**Key test details:**

1. **Smoke render (horizontal)**: Renders `<Stepper>` with 3 `StepperItem` children (completed, active, pending). Asserts all three titles are in the document. Asserts root has `data-slot="stepper"`.

2. **Vertical orientation**: Renders `<Stepper orientation="vertical">` with items. Asserts the root element has the `flex-col` class.

3. **Status icons (4 tests)**: Renders a single `StepperItem` wrapped in `<Stepper>` with each status. Asserts the presence of the corresponding SVG element by querying for `svg` within the `data-slot="stepper-item"` element. Uses `container.querySelector` to find the SVG and verify its content (e.g., `polyline` for checkmark, `line` for X).

4. **Connecting lines**: Renders 3 items. Uses `container.querySelectorAll` to count connector elements. Expects 2 connectors (between items 1-2 and 2-3, not after item 3).

5. **Completed vs pending connector style**: Renders items with completed and pending statuses. Asserts the completed connector has `bg-primary` class and the pending connector has `bg-border` class.

6. **Title and description**: Renders an item with both `title` and `description`. Asserts `screen.getByText(title)` and `screen.getByText(description)` are present.

7. **Custom className merging**: Renders `<Stepper className="custom-stepper">`. Asserts root has both `custom-stepper` and `flex` classes.

8. **data-slot attributes**: Asserts `data-slot="stepper"` on root and `data-slot="stepper-item"` on items.

9. **Ref forwarding**: Creates `createRef<HTMLDivElement>()`, passes to `<Stepper ref={ref}>`. Asserts `ref.current` is `instanceof HTMLDivElement`.

10. **aria-current**: Renders 3 items (completed, active, pending). Asserts only the active item has `aria-current="step"`. The other items do not have `aria-current`.

11. **Accessibility**: Renders full stepper in both orientations. Runs `axe(container)` and asserts no violations.

### 3.5 `stepper.stories.tsx`

**Purpose:** Storybook CSF3 stories covering all variants and realistic use cases.

**Meta configuration:**
```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Stepper, StepperItem } from './stepper.js';

const meta: Meta<typeof Stepper> = {
  title: 'Components/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;
```

**Stories (7 stories):**

1. **Horizontal** (default): 4 items with statuses completed → completed → active → pending. Uses `render` function.
2. **Vertical**: Same 4 items, `orientation="vertical"`.
3. **AllStatuses**: 4 items showing one of each status (pending, active, completed, error) to demonstrate all icons.
4. **WithDescriptions**: 3 items each with a `description` prop showing helper text below the title.
5. **ThreeStepProgress**: Realistic scenario — "Account Setup" (completed), "Profile Details" (completed), "Verification" (active), "Complete" (pending).
6. **SingleStep**: Single `StepperItem` with `status="active"` — verifies no connector is rendered.
7. **ErrorState**: 4 items where the 3rd is `error` — "Payment" (completed), "Shipping" (completed), "Confirmation" (error), "Done" (pending).

All stories use `render` functions (not `args`) since Stepper requires `StepperItem` children.

## 4. API Contracts

### `<Stepper>` Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction of the stepper |
| `className` | `string` | — | Additional CSS classes merged via `cn()` |
| `ref` | `React.Ref<HTMLDivElement>` | — | Forwarded to the root `<div>` |
| `children` | `React.ReactNode` | — | `StepperItem` elements |
| `...props` | `React.ComponentProps<'div'>` | — | All native `<div>` attributes |

### `<StepperItem>` Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `'pending' \| 'active' \| 'completed' \| 'error'` | — (required) | Current step status |
| `title` | `string` | — (required) | Step title text |
| `description` | `string` | — | Optional helper text below title |
| `className` | `string` | — | Additional CSS classes merged via `cn()` |
| `ref` | `React.Ref<HTMLDivElement>` | — | Forwarded to the item `<div>` |
| `...props` | `React.ComponentProps<'div'>` | — | All native `<div>` attributes |

### Usage Example

```tsx
<Stepper orientation="horizontal">
  <StepperItem status="completed" title="Account" description="Create your account" />
  <StepperItem status="active" title="Profile" description="Fill in your details" />
  <StepperItem status="pending" title="Review" />
</Stepper>
```

### Exported Symbols from `index.ts`

```typescript
// From ./components/stepper/stepper.js:
export { Stepper, StepperItem, type StepperProps, type StepperItemProps }

// From ./components/stepper/stepper.styles.js:
export { stepperVariants, stepperItemVariants }
```

Note: `StepperItemInternalProps`, `StepperContextType`, `stepperItemTitleStyles`, `stepperItemDescriptionStyles`, `stepperConnectorCompletedStyles`, `stepperConnectorPendingStyles` are internal and NOT exported from `index.ts`.

## 5. Test Plan

### Test Setup

- **Framework:** Vitest with jsdom environment
- **Libraries:** `@testing-library/react`, `@testing-library/user-event`, `vitest-axe`
- **Setup file:** `src/test-setup.ts` (already configured with jest-dom matchers, vitest-axe matchers, cleanup, and jsdom polyfills)
- **Run command:** `pnpm --filter @components/ui test`

### Test Specifications

| # | Test Name | What It Validates | Assertion Strategy |
|---|-----------|-------------------|--------------------|
| 1 | renders with default horizontal orientation | Default render and horizontal layout | Render 3 items, assert titles present, root has `flex-row` class via `stepperVariants` |
| 2 | renders with vertical orientation | Vertical orientation variant | Render with `orientation="vertical"`, assert root has `flex-col` class |
| 3 | renders pending status icon | Pending icon SVG | Render item with `status="pending"`, query SVG `circle` with `stroke` attribute (hollow) |
| 4 | renders active status icon | Active icon SVG | Render item with `status="active"`, query SVG `circle` with `fill` attribute (filled) |
| 5 | renders completed status icon | Completed icon SVG | Render item with `status="completed"`, query SVG `polyline` element (checkmark) |
| 6 | renders error status icon | Error icon SVG | Render item with `status="error"`, query SVG `line` elements (X mark) |
| 7 | renders connecting lines between items but not after last | Connector line count | Render 3 items, assert 2 connector divs exist (not 3) |
| 8 | completed step connector has distinct style | Connector visual distinction | Render completed + pending items, assert completed connector has `bg-primary`, pending has `bg-border` |
| 9 | renders title and description | Text content rendering | Render item with title and description, assert both texts present |
| 10 | merges custom className on Stepper | className forwarding on container | Render with `className="custom"`, assert root has both `custom` and `flex` |
| 11 | merges custom className on StepperItem | className forwarding on item | Render item with `className="custom-item"`, assert item div has the class |
| 12 | has data-slot attributes | DOM identification | Assert `data-slot="stepper"` on root, `data-slot="stepper-item"` on items |
| 13 | forwards ref to Stepper root element | Ref forwarding | Pass `createRef`, assert `ref.current instanceof HTMLDivElement` |
| 14 | sets aria-current="step" on active item only | Accessibility markup | Render 3 items with different statuses, assert only active has `aria-current="step"` |
| 15 | has no accessibility violations (horizontal) | axe audit (horizontal) | Render horizontal stepper, run `axe(container)`, assert no violations |
| 16 | has no accessibility violations (vertical) | axe audit (vertical) | Render vertical stepper, run `axe(container)`, assert no violations |

## 6. Implementation Order

1. **`stepper.types.ts`** — Define all types first (`StepperContextType`, `StepperProps`, `StepperItemProps`, `StepperItemInternalProps`). No dependencies on other new files.

2. **`stepper.styles.ts`** — Define CVA variants and style constants. Depends on nothing from the new files; types reference this file but only via `import type`.

3. **`stepper.tsx`** — Implement `StepperContext`, `StatusIcon`, `Stepper`, and `StepperItem`. Depends on types and styles files.

4. **`stepper.test.tsx`** — Write all 16 tests. Depends on the component implementation.

5. **`stepper.stories.tsx`** — Write all 7 stories. Depends on the component implementation.

## 7. Verification Commands

```bash
# Run only Stepper tests
pnpm --filter @components/ui vitest run src/components/stepper/stepper.test.tsx

# Run all tests in the UI package
pnpm --filter @components/ui test

# TypeScript type checking
pnpm --filter @components/ui typecheck

# ESLint
pnpm --filter @components/ui lint

# Full monorepo typecheck
pnpm typecheck

# Full monorepo test suite
pnpm test

# Launch Storybook to verify stories render
pnpm storybook
```

## 8. Design Deviations

### Deviation 1: Connector line rendering — solid muted instead of dashed

**What the parent spec says:** "Completed items show a solid primary-colored line; all other statuses show a muted dashed line."

**What this plan does:** Uses `bg-primary` (solid) vs `bg-border` (muted solid) instead of dashed lines.

**Rationale:** The connectors are rendered as `<div>` elements with background color (not borders), so Tailwind's `border-dashed` utility does not apply. Achieving a dashed look on a background-color element would require a repeating gradient or a border-based approach that adds unnecessary complexity. A solid muted line (`bg-border`) vs a solid primary line (`bg-primary`) provides clear visual distinction between completed and non-completed connectors using only simple Tailwind utilities. The phase spec's exit criterion #4 requires connectors to be "visually distinct for completed vs. non-completed steps," which this satisfies.

### Deviation 2: Stories use `StoryObj<typeof meta>` instead of `StoryObj<typeof Stepper>`

**What feedback-v1 suggested:** Use `StoryObj<typeof Stepper>` to match button.stories.tsx.

**What this plan does:** Uses `StoryObj<typeof meta>`.

**Rationale:** The codebase has a consistent split: simple components (button, badge, input) use `StoryObj<typeof Component>`, while compound components that require `render` functions (accordion, dialog, sidebar, avatar-group, collapsible, tabs, sheet) use `StoryObj<typeof meta>`. Stepper is a compound component with StepperItem children — every story will use a `render` function, making `typeof meta` the correct convention to follow. This matches the established pattern for compound components across the codebase.