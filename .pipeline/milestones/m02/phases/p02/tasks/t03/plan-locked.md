Now I have all the context I need. Let me produce the implementation plan.

# Task t03: Switch Component — Implementation Plan

## 1. Deliverables

| #   | File                                                   | Action | Purpose                                                         |
| --- | ------------------------------------------------------ | ------ | --------------------------------------------------------------- |
| 1   | `packages/ui/src/components/switch/switch.types.ts`    | Create | `SwitchProps` type extending Radix `SwitchPrimitive.Root` props |
| 2   | `packages/ui/src/components/switch/switch.styles.ts`   | Create | `switchVariants` and `switchThumbVariants` CVA definitions      |
| 3   | `packages/ui/src/components/switch/switch.tsx`         | Create | Switch component wrapping `@radix-ui/react-switch` with thumb   |
| 4   | `packages/ui/src/components/switch/switch.test.tsx`    | Create | Vitest + Testing Library + vitest-axe test suite                |
| 5   | `packages/ui/src/components/switch/switch.stories.tsx` | Create | Storybook CSF3 stories with autodocs                            |
| 6   | `packages/ui/src/index.ts`                             | Modify | Add `Switch`, `SwitchProps`, `switchVariants` exports           |

## 2. Dependencies

### Already Installed

All required dependencies are already present in `packages/ui/package.json`:

- `@radix-ui/react-switch@^1.2.2` — installed by sibling task t01
- `class-variance-authority@^0.7.1` — for CVA variant definitions
- `@components/utils` (workspace) — for `cn()` helper
- `@radix-ui/react-label` — Label component from Milestone 1 (used in stories/tests)

### Dev Dependencies (already installed)

- `vitest@^3.2.4`, `vitest-axe@^0.1.0` — testing
- `@testing-library/react@^16.3.2`, `@testing-library/user-event@^14.6.1` — test utilities
- `@storybook/react-vite` — Storybook CSF3 types

### No new packages need to be installed.

## 3. Implementation Details

### 3.1 `switch.types.ts`

**Purpose**: Define the `SwitchProps` type.

**Exports**:

- `SwitchProps` — extends `React.ComponentProps<typeof SwitchPrimitive.Root>` intersected with `VariantProps<typeof switchVariants>`. No additional custom props are needed; Radix provides `checked`, `defaultChecked`, `onCheckedChange`, `disabled`, `required`, `name`, `value`.

**Exact implementation**:

```typescript
import type { VariantProps } from 'class-variance-authority';
import type * as SwitchPrimitive from '@radix-ui/react-switch';

import type { switchVariants } from './switch.styles.js';

export type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root> &
  VariantProps<typeof switchVariants>;
```

This mirrors the Checkbox types pattern exactly — extending Radix primitive root props with CVA VariantProps. No `asChild` is declared (Radix includes it already per DD-1).

### 3.2 `switch.styles.ts`

**Purpose**: Define CVA style variants for the switch root track and thumb.

**Exports**:

- `switchVariants` — CVA with base classes only for the root track element
- `switchThumbVariants` — CVA with base classes only for the thumb element

**Exact implementation**:

```typescript
import { cva } from 'class-variance-authority';

export const switchVariants = cva(
  'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
);

export const switchThumbVariants = cva(
  'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
);
```

**Key classes explained**:

- `peer` — enables peer selectors for associated labels
- `h-6 w-11` — track dimensions (24px × 44px)
- `border-2 border-transparent` — transparent border to maintain sizing consistency
- `data-[state=checked]:bg-primary` / `data-[state=unchecked]:bg-input` — state-driven background colors using semantic tokens
- `ring-offset-background` / `ring-ring` — focus ring using semantic tokens
- Thumb: `h-5 w-5` (20px circle inside 24px track), `translate-x-5` shifts thumb right when checked, `translate-x-0` when unchecked
- `transition-transform` on thumb for animated slide effect

### 3.3 `switch.tsx`

**Purpose**: Implement the Switch component wrapping `@radix-ui/react-switch`.

**Exports**:

- `Switch` — named function component
- `SwitchProps` — re-exported type from types file

**Exact implementation**:

```typescript
import * as SwitchPrimitive from '@radix-ui/react-switch';

import { cn } from '../../lib/utils.js';
import { switchVariants, switchThumbVariants } from './switch.styles.js';
import type { SwitchProps } from './switch.types.js';

export type { SwitchProps } from './switch.types.js';

export function Switch({ className, ref, ...props }: SwitchProps): React.JSX.Element {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(switchVariants({ className }))}
      ref={ref}
      {...props}
    >
      <SwitchPrimitive.Thumb className={cn(switchThumbVariants())} />
    </SwitchPrimitive.Root>
  );
}
```

**Key patterns** (matching Checkbox implementation):

- `data-slot="switch"` on root element
- `cn(switchVariants({ className }))` to merge user className with base styles
- React 19 ref-as-prop destructured from props
- Thumb is always rendered inside root (Radix handles the toggle state)
- No `asChild` destructuring needed (Radix includes it)

### 3.4 `switch.test.tsx`

**Purpose**: Comprehensive test suite for the Switch component.

**Test cases** (12 tests):

1. **Smoke render** — renders a switch role element
2. **data-slot** — has `data-slot="switch"` attribute
3. **Custom className** — merges custom className onto root
4. **Click toggles** — clicking toggles `data-state` between `unchecked` and `checked`
5. **Space key toggles** — Space key toggles state when focused
6. **Role and aria-checked** — has `role="switch"` and correct `aria-checked` value reflecting state
7. **Disabled state** — does not toggle on click when disabled
8. **Controlled usage** — calls `onCheckedChange` with toggled value, `checked` prop controls state
9. **Uncontrolled usage** — `defaultChecked` sets initial state, toggles internally
10. **Label integration** — clicking an associated `<Label>` toggles the switch
11. **Ref forwarding** — ref points to the underlying `HTMLButtonElement`
12. **Accessibility (axe)** — no violations in default and checked states

**Imports and setup** pattern (matching Checkbox test file):

```typescript
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Label } from '../label/label.js';
import { Switch } from './switch.js';
```

### 3.5 `switch.stories.tsx`

**Purpose**: Storybook documentation with interactive stories.

**Meta configuration**:

- `title: 'Components/Switch'`
- `component: Switch`
- `tags: ['autodocs']`
- `argTypes`: `checked` (boolean control), `disabled` (boolean control)

**Stories** (6 stories):

1. **Default** — unchecked switch with `aria-label`
2. **Checked** — switch with `defaultChecked: true`
3. **Disabled** — disabled unchecked switch
4. **DisabledChecked** — disabled + defaultChecked
5. **WithLabel** — render function composing Switch + Label with `htmlFor`/`id` wiring, in a flex container with `gap-2`
6. **Controlled** — render function with `ControlledDemo` component using `useState<boolean>(false)`

**Import pattern** (matching Checkbox stories):

```typescript
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from '../label/label.js';
import { Switch } from './switch.js';
```

### 3.6 `index.ts` modification

**Purpose**: Add Switch to the public API.

**Lines to append** (after the existing Checkbox exports at lines 109–110):

```typescript
export { Switch, type SwitchProps } from './components/switch/switch.js';
export { switchVariants } from './components/switch/switch.styles.js';
```

Note: `switchThumbVariants` is NOT exported from the public API — it is an internal implementation detail of the Switch component (consumers don't need to style the thumb independently). This is consistent with the phase spec which lists only `switchVariants` for export.

## 4. API Contracts

### Component Props

```typescript
// SwitchProps — extends Radix Switch.Root props
type SwitchProps = {
  // From Radix:
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  // From React 19:
  ref?: React.Ref<HTMLButtonElement>;
  // From CVA (no variants currently):
  className?: string;
  // Inherited from Radix:
  asChild?: boolean;
  // ...all other HTML button attributes
};
```

### Usage Examples

```tsx
// Uncontrolled
<Switch defaultChecked aria-label="Notifications" />

// Controlled
const [enabled, setEnabled] = useState(false);
<Switch checked={enabled} onCheckedChange={setEnabled} aria-label="Dark mode" />

// With Label
<div className="flex items-center gap-2">
  <Switch id="airplane-mode" />
  <Label htmlFor="airplane-mode">Airplane Mode</Label>
</div>

// Disabled
<Switch disabled aria-label="Unavailable" />
```

### Rendered DOM Structure

```html
<button
  role="switch"
  aria-checked="false"
  data-state="unchecked"
  data-slot="switch"
  class="peer inline-flex h-6 w-11 ..."
>
  <span data-state="unchecked" class="pointer-events-none block h-5 w-5 ..."></span>
</button>
```

## 5. Test Plan

### Test Setup

- **Framework**: Vitest with jsdom environment
- **Libraries**: `@testing-library/react`, `@testing-library/user-event`, `vitest-axe`
- **Pattern**: Follows exact same structure as `checkbox.test.tsx`
- **Run**: `pnpm test` (runs `vitest run`)

### Per-Test Specification

| #   | Test Name                                   | Setup                                                                     | Action                       | Assertion                                          |
| --- | ------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------- | -------------------------------------------------- |
| 1   | renders without crashing                    | `render(<Switch aria-label="Test" />)`                                    | None                         | `getByRole('switch')` is in document               |
| 2   | has data-slot attribute                     | `render(<Switch aria-label="Test" />)`                                    | None                         | `getByRole('switch')` has `data-slot="switch"`     |
| 3   | merges custom className                     | `render(<Switch className="custom-class" aria-label="Test" />)`           | None                         | `getByRole('switch')` has class `custom-class`     |
| 4   | toggles checked state on click              | `render(<Switch aria-label="Test" />)`                                    | `user.click(switch)`         | `data-state` changes from `unchecked` to `checked` |
| 5   | toggles state with Space key                | `render(<Switch aria-label="Test" />)`                                    | Focus + `user.keyboard(' ')` | `data-state` changes from `unchecked` to `checked` |
| 6   | has role="switch" with correct aria-checked | `render(<Switch defaultChecked aria-label="Test" />)`                     | None                         | `role="switch"`, `aria-checked="true"`             |
| 7   | does not toggle when disabled               | `render(<Switch disabled onCheckedChange={vi.fn()} aria-label="Test" />)` | `user.click(switch)`         | `onCheckedChange` not called                       |
| 8   | supports controlled usage                   | `render(<Switch checked={false} onCheckedChange={fn} />)`                 | `user.click(switch)`         | `onCheckedChange` called with `true`               |
| 9   | supports uncontrolled usage                 | `render(<Switch defaultChecked aria-label="Test" />)`                     | `user.click(switch)`         | Switch goes from checked to unchecked              |
| 10  | works with Label                            | Render Switch with id + Label with htmlFor                                | `user.click(label text)`     | Switch becomes checked                             |
| 11  | forwards ref                                | `createRef<HTMLButtonElement>()`, render with ref                         | None                         | `ref.current` is `instanceof HTMLButtonElement`    |
| 12  | has no accessibility violations (default)   | `render(<Switch aria-label="Test" />)`                                    | None                         | `axe(container)` has no violations                 |
| 13  | has no accessibility violations (checked)   | `render(<Switch defaultChecked aria-label="Test" />)`                     | None                         | `axe(container)` has no violations                 |

## 6. Implementation Order

1. **`switch.styles.ts`** — Create CVA variant definitions first (no dependencies on other files)
2. **`switch.types.ts`** — Create type definitions (imports from styles file)
3. **`switch.tsx`** — Create component implementation (imports from styles and types)
4. **`switch.test.tsx`** — Create test suite (imports the component)
5. **`switch.stories.tsx`** — Create Storybook stories (imports the component)
6. **`index.ts`** — Modify to add Switch exports (must be done after component file exists)

Steps 1–3 are sequential (each depends on the previous). Steps 4 and 5 are independent of each other but depend on step 3. Step 6 depends on step 3.

## 7. Verification Commands

```bash
# Run Switch tests only
pnpm --filter @components/ui test -- --run switch

# Run all tests across the ui package
pnpm --filter @components/ui test

# Type check the ui package
pnpm --filter @components/ui typecheck

# Run full monorepo test suite
pnpm test

# Run full monorepo type check
pnpm typecheck

# Lint the ui package source
pnpm --filter @components/ui lint
```

## 8. Design Deviations

**Deviation 1: `switchThumbVariants` not exported from public API**

- **Parent spec states**: The phase spec (DD-2) mandates a `switchThumbVariants` CVA export in the styles file.
- **What this plan does**: `switchThumbVariants` is created in `switch.styles.ts` and used internally by `switch.tsx`, but only `switchVariants` is exported from `index.ts`.
- **Rationale**: The thumb is an internal implementation detail of the Switch component. Consumers cannot (and should not) independently style the thumb — the Radix `SwitchPrimitive.Thumb` is always rendered inside the Root by the Switch component itself. Exporting `switchThumbVariants` from the public API would expose an internal contract that consumers cannot use. The phase spec's export section for Switch only lists `switchVariants`. If consumers later need thumb customization, it can be added as a variant on `switchVariants` or as a prop.

No other deviations are needed. The implementation faithfully follows all project conventions (5-file pattern, React 19 ref-as-prop, `data-slot`, `cn()`, CVA, vitest-axe, CSF3 stories with autodocs).
