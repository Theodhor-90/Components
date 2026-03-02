Interesting — the dialog component uses plain string exports for styles, not CVA. But the phase spec explicitly requires CVA for all selection controls. Let me check the checkbox/switch styles one more time to confirm the CVA pattern, then check what Radix radio-group exports look like and review the shadcn reference for Radio Group.

Now I have all the information I need. Let me produce the detailed implementation plan.

# Task Plan: Radio Group Component

## 1. Deliverables

| #   | File                                                             | Action | Purpose                                                                                 |
| --- | ---------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------- |
| 1   | `packages/ui/src/components/radio-group/radio-group.types.ts`    | Create | `RadioGroupProps` and `RadioGroupItemProps` type definitions extending Radix primitives |
| 2   | `packages/ui/src/components/radio-group/radio-group.styles.ts`   | Create | `radioGroupVariants` and `radioGroupItemVariants` CVA definitions with base classes     |
| 3   | `packages/ui/src/components/radio-group/radio-group.tsx`         | Create | `RadioGroup` and `RadioGroupItem` components wrapping `@radix-ui/react-radio-group`     |
| 4   | `packages/ui/src/components/radio-group/radio-group.test.tsx`    | Create | Vitest + Testing Library + vitest-axe test suite                                        |
| 5   | `packages/ui/src/components/radio-group/radio-group.stories.tsx` | Create | Storybook CSF3 stories with autodocs                                                    |
| 6   | `packages/ui/src/index.ts`                                       | Modify | Add `RadioGroup`, `RadioGroupItem`, types, and CVA variant exports                      |

## 2. Dependencies

### Already Installed

- `@radix-ui/react-radio-group@^1.3.2` — already present in `packages/ui/package.json` (installed by t01)
- `class-variance-authority@^0.7.1` — already present
- `@components/utils` (workspace) — provides `cn()` helper
- `vitest@^3.2.4`, `@testing-library/react@^16.3.2`, `@testing-library/user-event@^14.6.1`, `vitest-axe@^0.1.0` — already present as devDependencies

### Runtime Prerequisites

- Label component from Milestone 1 — used in story and test composition (already exported from `packages/ui/src/index.ts`)

### No New Packages Required

This task does not require installing any new dependencies.

## 3. Implementation Details

### 3.1 `radio-group.types.ts`

**Purpose**: Define TypeScript types for both exported components.

**Exports**:

- `RadioGroupProps` — extends `React.ComponentProps<typeof RadioGroupPrimitive.Root>` intersected with `VariantProps<typeof radioGroupVariants>`. This includes all Radix RadioGroup root props: `value`, `defaultValue`, `onValueChange`, `disabled`, `required`, `orientation`, `dir`, `loop`, `name`, plus `ref` from React 19 `ComponentProps`.
- `RadioGroupItemProps` — extends `React.ComponentProps<typeof RadioGroupPrimitive.Item>` intersected with `VariantProps<typeof radioGroupItemVariants>`. This includes Radix item props: `value`, `disabled`, `required`, `id`, plus `ref`.

**Pattern**: Follows the exact same pattern as `checkbox.types.ts` and `switch.types.ts` — import `VariantProps` from CVA, import the Radix namespace as a type, import the CVA variants as a type, compose with intersection.

```typescript
import type { VariantProps } from 'class-variance-authority';
import type * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

import type { radioGroupVariants } from './radio-group.styles.js';
import type { radioGroupItemVariants } from './radio-group.styles.js';

export type RadioGroupProps = React.ComponentProps<typeof RadioGroupPrimitive.Root> &
  VariantProps<typeof radioGroupVariants>;

export type RadioGroupItemProps = React.ComponentProps<typeof RadioGroupPrimitive.Item> &
  VariantProps<typeof radioGroupItemVariants>;
```

### 3.2 `radio-group.styles.ts`

**Purpose**: CVA variant definitions for both the group container and individual items.

**Exports**:

- `radioGroupVariants` — CVA with base classes only (no variant config object), consistent with the checkbox/switch pattern:
  - `grid gap-2` — grid layout with gap between items
- `radioGroupItemVariants` — CVA with base classes only:
  - Layout: `aspect-square h-4 w-4 rounded-full`
  - Border: `border border-primary`
  - Focus: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background`
  - Disabled: `disabled:cursor-not-allowed disabled:opacity-50`
  - Checked state styling is handled by the Indicator child, not via data attributes on the item itself

```typescript
import { cva } from 'class-variance-authority';

export const radioGroupVariants = cva('grid gap-2');

export const radioGroupItemVariants = cva(
  'aspect-square h-4 w-4 rounded-full border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
);
```

### 3.3 `radio-group.tsx`

**Purpose**: Implementation of both `RadioGroup` and `RadioGroupItem` components.

**Exports**:

- `RadioGroup` function component
- `RadioGroupItem` function component
- Re-exports `RadioGroupProps` and `RadioGroupItemProps` types

**Key implementation details**:

**RadioGroup**:

- Wraps `RadioGroupPrimitive.Root`
- Applies `data-slot="radio-group"`
- Applies `cn(radioGroupVariants({ className }))`
- Destructures `className` and `ref` from props, spreads rest
- React 19 ref-as-prop pattern (no forwardRef)

**RadioGroupItem**:

- Wraps `RadioGroupPrimitive.Item`
- Applies `data-slot="radio-group-item"`
- Applies `cn(radioGroupItemVariants({ className }))`
- Renders `RadioGroupPrimitive.Indicator` inside the item
- Indicator contains an inline SVG filled circle icon (consistent with Checkbox's inline SVG approach per DD-4)
- The filled circle SVG: a simple `<circle>` element rendered at center, using `fill="currentColor"`

```typescript
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

import { cn } from '../../lib/utils.js';
import { radioGroupVariants, radioGroupItemVariants } from './radio-group.styles.js';
import type { RadioGroupProps, RadioGroupItemProps } from './radio-group.types.js';

export type { RadioGroupProps, RadioGroupItemProps } from './radio-group.types.js';

export function RadioGroup({ className, ref, ...props }: RadioGroupProps): React.JSX.Element {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn(radioGroupVariants({ className }))}
      ref={ref}
      {...props}
    />
  );
}

export function RadioGroupItem({ className, ref, ...props }: RadioGroupItemProps): React.JSX.Element {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(radioGroupItemVariants({ className }))}
      ref={ref}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="currentColor"
        >
          <circle cx="4" cy="4" r="4" />
        </svg>
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}
```

### 3.4 `radio-group.test.tsx`

**Purpose**: Comprehensive test suite covering smoke render, interactions, accessibility.

**Test setup**: Uses `@testing-library/react` for rendering, `@testing-library/user-event` for interactions, `vitest-axe` for a11y assertions, `vitest` for test primitives. Imports `Label` from sibling component for composition testing.

**Tests** (13 total):

1. **Smoke render** — renders RadioGroup with multiple RadioGroupItem children, asserts `radiogroup` role is present
2. **data-slot on RadioGroup** — asserts `data-slot="radio-group"` on the group container
3. **data-slot on RadioGroupItem** — asserts `data-slot="radio-group-item"` on each item
4. **Custom className** — passes `className` to RadioGroup and RadioGroupItem, asserts both merge correctly
5. **Mutual exclusion** — clicks one item, then another; asserts only the last-clicked item has `data-state="checked"`, previous one reverts to `data-state="unchecked"`
6. **Keyboard navigation (arrow keys)** — focuses the group, uses arrow keys to move between items, asserts focus moves between radio items
7. **Disabled group** — renders with `disabled` on RadioGroup, attempts to click an item, asserts no state change
8. **Disabled individual item** — renders with one disabled item, asserts that item is not selectable but others still work
9. **Controlled usage** — renders with `value` + `onValueChange`, clicks an item, asserts `onValueChange` called with expected value
10. **Uncontrolled usage** — renders with `defaultValue`, asserts the corresponding item has `data-state="checked"`; clicks another item, asserts it becomes checked
11. **With Label** — renders RadioGroupItem with associated Label, clicks the label text, asserts the item becomes checked
12. **Ref forwarding on RadioGroup** — passes `createRef<HTMLDivElement>()` to RadioGroup, asserts `ref.current` is an HTMLDivElement
13. **Ref forwarding on RadioGroupItem** — passes `createRef<HTMLButtonElement>()` to RadioGroupItem, asserts `ref.current` is an HTMLButtonElement
14. **Accessibility: axe on default state** — renders a group with items and aria labels, runs `axe()`, asserts no violations
15. **Accessibility: axe on checked state** — renders with `defaultValue` set, runs `axe()`, asserts no violations

**Helper pattern**: Each test renders a small group of 3 items ("option-a", "option-b", "option-c") with `aria-label` or associated Labels for accessibility compliance.

### 3.5 `radio-group.stories.tsx`

**Purpose**: Storybook CSF3 stories demonstrating all variants and usage patterns.

**Meta configuration**:

```typescript
const meta: Meta<typeof RadioGroup> = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
  },
};
export default meta;
```

**Stories** (6 total):

1. **Default** — RadioGroup with 3 RadioGroupItems, no selection, each with associated Label. Uses `render` function to compose the compound structure.
2. **WithDefaultValue** — Same layout but with `defaultValue="option-b"` to show pre-selected state.
3. **Disabled** — RadioGroup with `disabled` prop, showing all items in disabled visual state.
4. **WithLabels** — Each RadioGroupItem paired with a Label component, showing the standard form pattern with `flex items-center gap-2` wrapper per item.
5. **HorizontalLayout** — RadioGroup with `className="flex gap-4"` override (instead of default `grid gap-2`) to show items in a horizontal row.
6. **Controlled** — Uses a `ControlledDemo` helper component with `useState` to demonstrate controlled `value` + `onValueChange` usage pattern (consistent with Checkbox and Switch Controlled stories).

### 3.6 `index.ts` Modifications

Add the following exports after the existing Switch exports (line 112):

```typescript
export {
  RadioGroup,
  RadioGroupItem,
  type RadioGroupProps,
  type RadioGroupItemProps,
} from './components/radio-group/radio-group.js';
export {
  radioGroupVariants,
  radioGroupItemVariants,
} from './components/radio-group/radio-group.styles.js';
```

## 4. API Contracts

### RadioGroup Component

**Input props** (extends `RadioGroupPrimitive.Root`):
| Prop | Type | Default | Description |
| --------------- | ----------------------------- | ------------- | ---------------------------------------------- |
| `value` | `string` | — | Controlled selected value |
| `defaultValue` | `string` | — | Uncontrolled default selected value |
| `onValueChange` | `(value: string) => void` | — | Callback when selection changes |
| `disabled` | `boolean` | `false` | Disable all items in the group |
| `required` | `boolean` | `false` | Whether a selection is required |
| `orientation` | `'horizontal' \| 'vertical'` | `'vertical'` | Layout orientation for arrow key navigation |
| `loop` | `boolean` | `true` | Whether arrow keys loop at boundaries |
| `name` | `string` | — | Name for form submission |
| `className` | `string` | — | Additional CSS classes merged via `cn()` |
| `ref` | `React.Ref<HTMLDivElement>` | — | React 19 ref-as-prop |

**Output**: Renders a `<div>` with `role="radiogroup"` and `data-slot="radio-group"`.

### RadioGroupItem Component

**Input props** (extends `RadioGroupPrimitive.Item`):
| Prop | Type | Default | Description |
| ----------- | -------------------------------- | ------- | ------------------------------------------ |
| `value` | `string` | — | **Required.** The value for this item |
| `disabled` | `boolean` | `false` | Disable this specific item |
| `id` | `string` | — | HTML id for Label association |
| `className` | `string` | — | Additional CSS classes merged via `cn()` |
| `ref` | `React.Ref<HTMLButtonElement>` | — | React 19 ref-as-prop |

**Output**: Renders a `<button>` with `role="radio"`, `aria-checked`, and `data-slot="radio-group-item"`. Contains the `RadioGroupPrimitive.Indicator` with filled circle SVG when checked.

### Usage Example

```tsx
<RadioGroup defaultValue="option-b" onValueChange={(val) => console.log(val)}>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="option-a" id="r1" />
    <Label htmlFor="r1">Option A</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="option-b" id="r2" />
    <Label htmlFor="r2">Option B</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="option-c" id="r3" />
    <Label htmlFor="r3">Option C</Label>
  </div>
</RadioGroup>
```

## 5. Test Plan

### Test Setup

- **Framework**: Vitest (`describe`, `it`, `expect`, `vi`)
- **DOM**: `@testing-library/react` (`render`, `screen`)
- **Interactions**: `@testing-library/user-event` (`userEvent.setup()`)
- **Accessibility**: `vitest-axe` (`axe`)
- **Ref creation**: `createRef` from React
- **Sibling import**: `Label` from `../label/label.js`

### Helper: Standard Radio Group Fixture

Most tests render a group of 3 items. Define inline in each test (following the checkbox/switch pattern of not extracting shared render helpers):

```tsx
<RadioGroup aria-label="Test group">
  <RadioGroupItem value="a" aria-label="Option A" />
  <RadioGroupItem value="b" aria-label="Option B" />
  <RadioGroupItem value="c" aria-label="Option C" />
</RadioGroup>
```

### Per-Test Specification

| #   | Test Name                                 | Setup                                                   | Action                          | Assertion                                                           |
| --- | ----------------------------------------- | ------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------- |
| 1   | renders without crashing                  | Render group with 3 items                               | None                            | `screen.getByRole('radiogroup')` is in document                     |
| 2   | has data-slot on RadioGroup               | Render group                                            | None                            | radiogroup element has `data-slot="radio-group"`                    |
| 3   | has data-slot on RadioGroupItem           | Render group with 3 items                               | None                            | All 3 radio elements have `data-slot="radio-group-item"`            |
| 4   | merges custom className on RadioGroup     | Render with `className="custom-group"`                  | None                            | radiogroup element has class `custom-group`                         |
| 5   | merges custom className on RadioGroupItem | Render item with `className="custom-item"`              | None                            | radio element has class `custom-item`                               |
| 6   | selects item on click (mutual exclusion)  | Render uncontrolled group                               | Click item A, then click item B | A has `data-state="unchecked"`, B has `data-state="checked"`        |
| 7   | navigates with arrow keys                 | Render group, focus first item                          | Press ArrowDown                 | Focus moves to next item                                            |
| 8   | does not select when group is disabled    | Render with `disabled`                                  | Click item A                    | Item A remains `data-state="unchecked"`, `onValueChange` not called |
| 9   | does not select disabled individual item  | Render with item B disabled                             | Click item B, then click item A | B stays unchecked, A becomes checked                                |
| 10  | supports controlled usage                 | Render with `value="a"` + `onValueChange` mock          | Click item B                    | `onValueChange` called with `"b"`                                   |
| 11  | supports uncontrolled usage               | Render with `defaultValue="b"`                          | None, then click item C         | Initially B is checked; after click, C is checked                   |
| 12  | works with Label                          | Render items with Labels using `htmlFor`/`id`           | Click label text "Option A"     | Corresponding radio becomes checked                                 |
| 13  | forwards ref on RadioGroup                | Render with `ref={createRef<HTMLDivElement>()}`         | None                            | `ref.current` is `HTMLDivElement`                                   |
| 14  | forwards ref on RadioGroupItem            | Render item with `ref={createRef<HTMLButtonElement>()}` | None                            | `ref.current` is `HTMLButtonElement`                                |
| 15  | has no accessibility violations (default) | Render group with aria-labels                           | `axe(container)`                | No violations                                                       |
| 16  | has no accessibility violations (checked) | Render group with `defaultValue`                        | `axe(container)`                | No violations                                                       |

## 6. Implementation Order

1. **`radio-group.styles.ts`** — Create CVA definitions first (no dependencies on other files)
2. **`radio-group.types.ts`** — Create type definitions (depends on styles for `VariantProps`)
3. **`radio-group.tsx`** — Create component implementation (depends on styles + types)
4. **`radio-group.test.tsx`** — Create test suite (depends on component)
5. **`radio-group.stories.tsx`** — Create Storybook stories (depends on component)
6. **`packages/ui/src/index.ts`** — Add public API exports (depends on component + styles)

## 7. Verification Commands

```bash
# Run radio-group tests specifically
pnpm --filter @components/ui test -- radio-group

# Run full test suite to check for regressions
pnpm --filter @components/ui test

# Type-check the UI package
pnpm --filter @components/ui typecheck

# Verify the 5-file directory structure exists
ls -la packages/ui/src/components/radio-group/

# Verify exports are present in index.ts (quick grep)
grep -n "radio-group" packages/ui/src/index.ts
```

## 8. Design Deviations

**Deviation 1: Indicator SVG dimensions**

- **Phase spec requires**: "inline SVG filled circle icon" inside `RadioGroupPrimitive.Indicator` — no specific dimensions given
- **Implementation choice**: Uses an 8×8 SVG with `<circle cx="4" cy="4" r="4" />` and `fill="currentColor"`. This is proportionally appropriate for the `h-4 w-4` (16×16px) radio item, creating a filled circle that is exactly half the container size — matching the standard shadcn/ui Radio Group visual. The color inherits from `text-primary` applied by the item's `data-[state=checked]` styling. This is consistent with Checkbox's approach of using specific small SVG dimensions (12×12 for checkmark/dash inside a 16×16 container).

**Deviation 2: Checked state text color on item**

- **Phase spec states**: `data-[state=checked]:text-primary` in `radioGroupItemVariants` base classes
- **Implementation note**: This class is important because the Indicator's SVG uses `fill="currentColor"`, which inherits the text color. When the item is checked, `text-primary` ensures the filled circle renders in the primary color. This is intentional and correct — unlike Checkbox which uses `data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground` (background fill + contrasting text), RadioGroup items show a colored circle indicator inside a bordered ring, so `text-primary` is the correct token to use for the indicator fill color.

No other deviations from the task spec or phase spec are needed.
