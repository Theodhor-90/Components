I have sufficient context from the task spec, phase spec, and existing sibling implementations. Let me produce the implementation plan.

## 1. Deliverables

| #   | File                                                   | Action | Purpose                                                                                             |
| --- | ------------------------------------------------------ | ------ | --------------------------------------------------------------------------------------------------- |
| 1   | `packages/ui/src/components/toggle/toggle.types.ts`    | Create | `ToggleProps` type extending Radix `TogglePrimitive.Root` props intersected with CVA `VariantProps` |
| 2   | `packages/ui/src/components/toggle/toggle.styles.ts`   | Create | `toggleVariants` CVA definition with `variant` (default/outline) and `size` (sm/default/lg)         |
| 3   | `packages/ui/src/components/toggle/toggle.tsx`         | Create | Toggle component wrapping `@radix-ui/react-toggle` with variant and size destructuring              |
| 4   | `packages/ui/src/components/toggle/toggle.test.tsx`    | Create | Vitest + Testing Library + vitest-axe test suite                                                    |
| 5   | `packages/ui/src/components/toggle/toggle.stories.tsx` | Create | Storybook CSF3 stories with autodocs                                                                |
| 6   | `packages/ui/src/index.ts`                             | Modify | Add `Toggle`, `ToggleProps`, `toggleVariants` exports                                               |

## 2. Dependencies

### Already Installed

All required dependencies are already present in `packages/ui/package.json`:

- `@radix-ui/react-toggle@^1.1.9` — installed in task t01
- `class-variance-authority@^0.7.1` — existing dependency
- `@components/utils` (workspace) — provides `cn()` helper
- `vitest@^3.2.4`, `@testing-library/react@^16.3.2`, `@testing-library/user-event@^14.6.1`, `vitest-axe@^0.1.0` — existing dev dependencies
- `@storybook/react-vite` — existing dev dependency in docs app

### Prerequisites

- Tasks t01–t04 are already complete (Radix deps installed, Checkbox, Switch, Radio Group implemented)
- The Toggle component directory does not yet exist and must be created
- **Critical**: This task's `toggleVariants` export is a dependency for Task t06 (Toggle Group) — `ToggleGroupItem` will import and reuse it for styling

## 3. Implementation Details

### 3.1 `toggle.types.ts`

**Purpose**: Define the `ToggleProps` type.

**Exports**:

- `ToggleProps`

**Interface**:

```typescript
import type { VariantProps } from 'class-variance-authority';
import type * as TogglePrimitive from '@radix-ui/react-toggle';

import type { toggleVariants } from './toggle.styles.js';

export type ToggleProps = React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>;
```

**Pattern notes**: Follows the established pattern from `checkbox.types.ts`, `switch.types.ts`, and `radio-group.types.ts`. Uses `import type * as TogglePrimitive` for namespace-style type import. Intersects Radix props with CVA `VariantProps` so `variant` and `size` are typed from the CVA definition.

Unlike Checkbox/Switch/Radio Group (which have no configurable variants), Toggle includes `VariantProps<typeof toggleVariants>` which adds optional `variant` and `size` props to the type — matching the Button pattern since Toggle is the first Phase 2 component with configurable visual variants.

### 3.2 `toggle.styles.ts`

**Purpose**: Define CVA variants for the Toggle component with configurable `variant` and `size` dimensions.

**Exports**:

- `toggleVariants`

**Implementation**:

```typescript
import { cva } from 'class-variance-authority';

export const toggleVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-3 min-w-10',
        sm: 'h-9 px-2.5 min-w-9',
        lg: 'h-11 px-5 min-w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);
```

**Key design notes**:

- Base classes include `data-[state=on]:bg-accent data-[state=on]:text-accent-foreground` for the pressed/on state styling
- `[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0` for consistent icon sizing within the toggle (matches shadcn/ui pattern and Button's approach to nested SVGs)
- `default` variant uses `bg-transparent` as the explicit value (not empty string) for clarity
- `outline` variant adds border matching the Input border style
- `min-w-*` on each size ensures toggles with only icons maintain square proportions
- `ring-offset-background` enables the focus ring offset to match the page background
- Semantic tokens used: `bg-muted`, `text-muted-foreground`, `bg-accent`, `text-accent-foreground`, `border-input`, `ring-ring`, `ring-offset-background`
- **This export is reused by Toggle Group (Task t06)** — `ToggleGroupItem` imports `toggleVariants` from this file

### 3.3 `toggle.tsx`

**Purpose**: Toggle component implementation wrapping `@radix-ui/react-toggle`.

**Exports**:

- `Toggle` (component function)
- `ToggleProps` (re-exported type)

**Implementation**:

```typescript
import * as TogglePrimitive from '@radix-ui/react-toggle';

import { cn } from '../../lib/utils.js';
import { toggleVariants } from './toggle.styles.js';
import type { ToggleProps } from './toggle.types.js';

export type { ToggleProps } from './toggle.types.js';

export function Toggle({
  className,
  variant,
  size,
  ref,
  ...props
}: ToggleProps): React.JSX.Element {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
}
```

**Key logic**:

- Destructures `variant`, `size`, `className` from props to pass to CVA; remaining props spread to Radix Root
- `data-slot="toggle"` on the root element per project convention
- `cn()` merges CVA output with any consumer-provided `className`
- React 19 `ref` as prop — no `forwardRef`
- No custom `asChild` handling — Radix `TogglePrimitive.Root` already supports `asChild` through its own props (DD-1 from phase spec)
- Follows the Button pattern for destructuring variant props, rather than the simpler Checkbox/Switch pattern (which have no variant props to destructure)

### 3.4 `toggle.test.tsx`

**Purpose**: Comprehensive test suite covering smoke, variants, interactions, keyboard, accessibility.

**Test setup**:

- `import { createRef } from 'react'`
- `import { render, screen } from '@testing-library/react'`
- `import userEvent from '@testing-library/user-event'`
- `import { axe } from 'vitest-axe'`
- `import { describe, expect, it, vi } from 'vitest'`
- `import { Toggle } from './toggle.js'`

**Test cases** (following established patterns from checkbox.test.tsx, switch.test.tsx):

1. **`renders without crashing`** — Render `<Toggle aria-label="Test toggle">Toggle</Toggle>`, assert `screen.getByRole('button')` is in the document (Radix Toggle renders as a `<button>`)
2. **`has data-slot attribute`** — Assert `data-slot="toggle"` on the button
3. **`merges custom className`** — Render with `className="custom-class"`, assert it's present
4. **`renders default variant by default`** — Render without variant prop, assert element has `bg-transparent` class (from default variant)
5. **`renders outline variant`** — Render with `variant="outline"`, assert element has border classes
6. **`renders sm size`** — Render with `size="sm"`, assert `h-9` class
7. **`renders lg size`** — Render with `size="lg"`, assert `h-11` class
8. **`toggles data-state on click`** — Render uncontrolled Toggle, click it, assert `data-state` changes from `off` to `on`
9. **`has aria-pressed reflecting state`** — Render, verify `aria-pressed="false"`, click, verify `aria-pressed="true"`
10. **`does not toggle when disabled`** — Render with `disabled`, click, assert `onPressedChange` not called
11. **`supports controlled usage`** — Render with `pressed={false}` and `onPressedChange={vi.fn()}`, click, assert callback called with `true`
12. **`supports uncontrolled usage`** — Render with `defaultPressed`, verify initial state is `on`, click, verify state toggles to `off`
13. **`forwards ref`** — Create ref via `createRef<HTMLButtonElement>()`, render with ref, assert `ref.current instanceof HTMLButtonElement`
14. **`has no accessibility violations (default)`** — Render, run `axe(container)`, assert no violations
15. **`has no accessibility violations (pressed)`** — Render with `defaultPressed`, run axe

### 3.5 `toggle.stories.tsx`

**Purpose**: Storybook documentation with all variants and states.

**Setup**:

```typescript
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Toggle } from './toggle.js';
```

**Meta configuration**:

```typescript
const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
    },
    disabled: { control: 'boolean' },
  },
};
```

**Stories**:

1. **`Default`** — Default variant with text "Bold" and `aria-label`
2. **`Outline`** — `variant="outline"` with text
3. **`Small`** — `size="sm"` with text
4. **`Large`** — `size="lg"` with text
5. **`Pressed`** — `defaultPressed={true}` showing on state
6. **`Disabled`** — `disabled={true}`
7. **`WithIcon`** — Render function with inline SVG icon (bold/italic style icon) inside the Toggle, demonstrating icon-only usage
8. **`Controlled`** — Render function with `ControlledDemo` component using `useState<boolean>` for `pressed`/`onPressedChange`

**Pattern**: Follows the established structure from `checkbox.stories.tsx` and `switch.stories.tsx` — `default export` for meta, named exports for each story, render functions for interactive demos.

### 3.6 `index.ts` Modification

**Purpose**: Add Toggle to the public API.

**Lines to append** (after the existing Radio Group exports at the end of the file):

```typescript
export { Toggle, type ToggleProps } from './components/toggle/toggle.js';
export { toggleVariants } from './components/toggle/toggle.styles.js';
```

**Pattern**: Follows the same two-line export pattern used by Button, Input, Checkbox, Switch. Component + type from the `.tsx` file, CVA variants from the `.styles.ts` file.

## 4. API Contracts

### Toggle Component Props

```typescript
type ToggleProps = {
  // From Radix TogglePrimitive.Root:
  pressed?: boolean; // Controlled pressed state
  defaultPressed?: boolean; // Uncontrolled initial pressed state
  onPressedChange?: (pressed: boolean) => void; // Callback when pressed changes
  disabled?: boolean; // Disable interaction
  asChild?: boolean; // Render as child element (Radix built-in)

  // From CVA VariantProps:
  variant?: 'default' | 'outline' | null; // Visual style (default: 'default')
  size?: 'default' | 'sm' | 'lg' | null; // Size preset (default: 'default')

  // From React.ComponentProps<'button'>:
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
  children?: React.ReactNode;
  // ...all other native button attributes
};
```

### Usage Examples

```tsx
// Basic toggle
<Toggle aria-label="Bold">B</Toggle>

// Outline variant
<Toggle variant="outline" aria-label="Italic">I</Toggle>

// Small with icon
<Toggle size="sm" aria-label="Underline">
  <UnderlineIcon />
</Toggle>

// Controlled
<Toggle pressed={isActive} onPressedChange={setIsActive}>Active</Toggle>

// Disabled
<Toggle disabled aria-label="Strikethrough">S</Toggle>
```

### CVA Variants Export

```typescript
// Can be composed externally:
import { toggleVariants } from '@components/ui';

const classes = toggleVariants({ variant: 'outline', size: 'sm' });
// Returns the resolved class string
```

## 5. Test Plan

### Test Setup

- **Framework**: Vitest with jsdom environment
- **Libraries**: `@testing-library/react`, `@testing-library/user-event`, `vitest-axe`
- **Run command**: `pnpm test` (runs `vitest run` across all packages)
- **File location**: `packages/ui/src/components/toggle/toggle.test.tsx`

### Test Specifications

| #   | Test Name                                 | Category      | Description                                                                                         |
| --- | ----------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------- |
| 1   | renders without crashing                  | Smoke         | Renders `<Toggle>` with aria-label, asserts `getByRole('button')` exists                            |
| 2   | has data-slot attribute                   | Convention    | Asserts `data-slot="toggle"` on root element                                                        |
| 3   | merges custom className                   | Convention    | Renders with `className="custom-class"`, asserts class is present on element                        |
| 4   | renders default variant by default        | Variant       | Renders without `variant` prop, asserts `bg-transparent` class                                      |
| 5   | renders outline variant                   | Variant       | Renders with `variant="outline"`, asserts `border` class is present                                 |
| 6   | renders sm size                           | Variant       | Renders with `size="sm"`, asserts `h-9` class                                                       |
| 7   | renders lg size                           | Variant       | Renders with `size="lg"`, asserts `h-11` class                                                      |
| 8   | toggles data-state on click               | Interaction   | Clicks the toggle, asserts `data-state` changes from `off` to `on`                                  |
| 9   | has aria-pressed reflecting state         | Accessibility | Checks `aria-pressed="false"` initially, `"true"` after click                                       |
| 10  | does not toggle when disabled             | Interaction   | Renders disabled, clicks, asserts `onPressedChange` not called                                      |
| 11  | supports controlled usage                 | State         | Renders with `pressed={false}` + `onPressedChange` spy, clicks, asserts callback called with `true` |
| 12  | supports uncontrolled usage               | State         | Renders with `defaultPressed`, verifies initial on state, clicks to toggle off                      |
| 13  | forwards ref                              | Convention    | Creates `createRef<HTMLButtonElement>()`, renders with ref, asserts `instanceof HTMLButtonElement`  |
| 14  | has no accessibility violations (default) | A11y          | Runs `axe(container)` on default render, asserts no violations                                      |
| 15  | has no accessibility violations (pressed) | A11y          | Runs `axe(container)` on defaultPressed render, asserts no violations                               |

## 6. Implementation Order

1. **`toggle.styles.ts`** — Define CVA variants first since both the types file and component file depend on it
2. **`toggle.types.ts`** — Define `ToggleProps` type referencing the styles file
3. **`toggle.tsx`** — Implement the component using types and styles
4. **`toggle.test.tsx`** — Write the test suite to verify the implementation
5. **`toggle.stories.tsx`** — Create Storybook stories for visual documentation
6. **`index.ts`** — Add exports to the public API

## 7. Verification Commands

```bash
# Run toggle tests specifically
pnpm --filter @components/ui test -- toggle

# Run all tests across the workspace
pnpm test

# Type-check the ui package
pnpm --filter @components/ui typecheck

# Type-check all packages
pnpm typecheck

# Lint the ui package
pnpm --filter @components/ui lint

# Build all packages (validates the export works)
pnpm build
```

## 8. Design Deviations

**Deviation 1: `default` variant uses `bg-transparent` instead of empty string**

- **Parent spec requires**: The phase spec states: `variant: default: (empty string — base classes handle default appearance)`
- **Why this is problematic**: An empty string for the `default` variant is functionally correct but makes it less explicit. When Toggle Group reuses `toggleVariants`, having an explicit `bg-transparent` for the default variant ensures the background is explicitly transparent and can be properly overridden by `tailwind-merge` if a consumer passes a background class in `className`. With an empty string, there is no background class to merge against.
- **Alternative chosen**: Use `bg-transparent` as the explicit default variant value. This is consistent with the shadcn/ui Toggle implementation and ensures predictable `tailwind-merge` behavior when consumers or Toggle Group provide className overrides.

**Deviation 2: Added SVG utility classes to base string**

- **Parent spec requires**: The phase spec's base classes do not include `[&_svg]` selectors.
- **Why the addition is needed**: The Toggle component commonly renders SVG icons as children (the stories include a "With Icon" story). Without `[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0`, icons inside the toggle would not have consistent sizing and could intercept pointer events. This matches the shadcn/ui Toggle and Button patterns.
- **Alternative chosen**: Added `[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0` to the base classes. This ensures consistent icon rendering without requiring consumers to add these utility classes manually.

**Deviation 3: Added `min-w-*` to size variants**

- **Parent spec requires**: Sizes defined as `default: h-10 px-3`, `sm: h-9 px-2.5`, `lg: h-11 px-5` without minimum width.
- **Why the addition is needed**: When Toggle contains only an icon (no text), the horizontal padding alone may not produce a square button. Adding `min-w-10`, `min-w-9`, `min-w-11` respectively ensures icon-only toggles maintain a square aspect ratio, matching the shadcn/ui reference.
- **Alternative chosen**: Added `min-w-*` matching each size's height value. This ensures icon-only toggles are properly sized.
