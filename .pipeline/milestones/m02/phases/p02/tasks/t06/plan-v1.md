Now I have complete understanding of the codebase patterns. Here is the implementation plan:

## 1. Deliverables

| #   | File                                                               | Action | Purpose                                                                                                                                |
| --- | ------------------------------------------------------------------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `packages/ui/src/components/toggle-group/toggle-group.types.ts`    | Create | `ToggleGroupProps` and `ToggleGroupItemProps` type definitions, plus `ToggleGroupContextType` for internal context                     |
| 2   | `packages/ui/src/components/toggle-group/toggle-group.styles.ts`   | Create | `toggleGroupVariants` CVA definition with base classes for the group container                                                         |
| 3   | `packages/ui/src/components/toggle-group/toggle-group.tsx`         | Create | `ToggleGroup` and `ToggleGroupItem` components wrapping `@radix-ui/react-toggle-group` with React context for variant/size propagation |
| 4   | `packages/ui/src/components/toggle-group/toggle-group.test.tsx`    | Create | Vitest + Testing Library + vitest-axe test suite                                                                                       |
| 5   | `packages/ui/src/components/toggle-group/toggle-group.stories.tsx` | Create | Storybook CSF3 stories with autodocs                                                                                                   |
| 6   | `packages/ui/src/index.ts`                                         | Modify | Add `ToggleGroup`, `ToggleGroupItem`, types, and CVA variant exports                                                                   |

## 2. Dependencies

### Already Installed (No Action Needed)

- `@radix-ui/react-toggle-group@^1.1.10` — already in `packages/ui/package.json` (installed in task t01)
- `@radix-ui/react-toggle@^1.1.9` — already installed (Toggle component dependency)
- `class-variance-authority@^0.7.1` — already installed
- `@components/utils` — `cn()` helper already available

### Prerequisite Tasks (Completed)

- **Task t01** — Radix dependencies installed
- **Task t05 (Toggle)** — `toggleVariants` from `../toggle/toggle.styles.js` is available and will be reused by `ToggleGroupItem` for styling

## 3. Implementation Details

### 3.1 `toggle-group.types.ts`

**Purpose**: Define TypeScript types for the ToggleGroup component, its items, and the internal context.

**Exports**:

- `ToggleGroupContextType` — Shape of the React context: `{ variant?: 'default' | 'outline'; size?: 'default' | 'sm' | 'lg' }`
- `ToggleGroupProps` — Extends `React.ComponentProps<typeof ToggleGroupPrimitive.Root>` intersected with `VariantProps<typeof toggleGroupVariants>`, plus optional `variant` and `size` fields typed from `VariantProps<typeof toggleVariants>`
- `ToggleGroupItemProps` — Extends `React.ComponentProps<typeof ToggleGroupPrimitive.Item>` intersected with `VariantProps<typeof toggleVariants>`

**Key details**:

- Import `VariantProps` from `class-variance-authority` as `import type`
- Import `toggleVariants` from `../toggle/toggle.styles.js` as `import type`
- Import `toggleGroupVariants` from `./toggle-group.styles.js` as `import type`
- Import `ToggleGroupPrimitive` from `@radix-ui/react-toggle-group` as `import type * as`
- The `variant` and `size` on `ToggleGroupProps` are for context propagation to children — they are typed identically to `toggleVariants`' `VariantProps`

**Exact code**:

```typescript
import type { VariantProps } from 'class-variance-authority';
import type * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';

import type { toggleVariants } from '../toggle/toggle.styles.js';
import type { toggleGroupVariants } from './toggle-group.styles.js';

export type ToggleGroupContextType = VariantProps<typeof toggleVariants>;

export type ToggleGroupProps = React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleGroupVariants> &
  ToggleGroupContextType;

export type ToggleGroupItemProps = React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>;
```

### 3.2 `toggle-group.styles.ts`

**Purpose**: CVA variant definition for the group container. Base classes only, no configurable variants (consistent with DD-2 from phase spec — components without visual variants use `cva()` with base classes only).

**Exports**:

- `toggleGroupVariants` — CVA with base classes: `flex items-center justify-center gap-1`

**Exact code**:

```typescript
import { cva } from 'class-variance-authority';

export const toggleGroupVariants = cva('flex items-center justify-center gap-1');
```

### 3.3 `toggle-group.tsx`

**Purpose**: Implementation of `ToggleGroup` (container) and `ToggleGroupItem` (individual items) with React context for variant/size propagation.

**Exports**:

- `ToggleGroup` — function component
- `ToggleGroupItem` — function component
- Re-exports `ToggleGroupProps` and `ToggleGroupItemProps` types

**Key implementation details**:

1. **Context**: Create `ToggleGroupContext` using `React.createContext<ToggleGroupContextType>({})` with empty defaults (meaning items fall back to Toggle's `defaultVariants` when no group-level variant/size is set)

2. **ToggleGroup component**:
   - Destructures `className`, `variant`, `size`, `ref`, and `...props`
   - Wraps children in `ToggleGroupContext.Provider` with `value={{ variant, size }}`
   - Renders `ToggleGroupPrimitive.Root` with:
     - `data-slot="toggle-group"`
     - `className={cn(toggleGroupVariants({ className }))}`
     - `ref={ref}`
     - `...props`
   - Return type: `React.JSX.Element`

3. **ToggleGroupItem component**:
   - Destructures `className`, `variant`, `size`, `ref`, and `...props`
   - Reads context via `React.useContext(ToggleGroupContext)`
   - Item-level `variant`/`size` override context values: `variant ?? context.variant`, `size ?? context.size`
   - Renders `ToggleGroupPrimitive.Item` with:
     - `data-slot="toggle-group-item"`
     - `className={cn(toggleVariants({ variant: resolvedVariant, size: resolvedSize, className }))}`
     - `ref={ref}`
     - `...props`
   - Imports `toggleVariants` from `../toggle/toggle.styles.js` (runtime import, not type-only)
   - Return type: `React.JSX.Element`

**Exact code**:

```typescript
import { createContext, useContext } from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';

import { cn } from '../../lib/utils.js';
import { toggleVariants } from '../toggle/toggle.styles.js';
import { toggleGroupVariants } from './toggle-group.styles.js';
import type { ToggleGroupContextType, ToggleGroupItemProps, ToggleGroupProps } from './toggle-group.types.js';

export type { ToggleGroupItemProps, ToggleGroupProps } from './toggle-group.types.js';

const ToggleGroupContext = createContext<ToggleGroupContextType>({});

export function ToggleGroup({
  className,
  variant,
  size,
  ref,
  ...props
}: ToggleGroupProps): React.JSX.Element {
  return (
    <ToggleGroupContext.Provider value={{ variant, size }}>
      <ToggleGroupPrimitive.Root
        data-slot="toggle-group"
        className={cn(toggleGroupVariants({ className }))}
        ref={ref}
        {...props}
      />
    </ToggleGroupContext.Provider>
  );
}

export function ToggleGroupItem({
  className,
  variant,
  size,
  ref,
  ...props
}: ToggleGroupItemProps): React.JSX.Element {
  const context = useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        toggleVariants({
          variant: variant ?? context.variant,
          size: size ?? context.size,
          className,
        }),
      )}
      ref={ref}
      {...props}
    />
  );
}
```

### 3.4 `toggle-group.test.tsx`

**Purpose**: Comprehensive test suite covering smoke render, data-slot, single/multiple selection modes, context propagation, context override, disabled state, keyboard navigation, controlled/uncontrolled usage, ref forwarding, and accessibility.

**Imports**:

- `createRef` from `react`
- `render`, `screen` from `@testing-library/react`
- `userEvent` from `@testing-library/user-event`
- `axe` from `vitest-axe`
- `describe`, `expect`, `it`, `vi` from `vitest`
- `ToggleGroup`, `ToggleGroupItem` from `./toggle-group.js`

**Test cases** (16 tests in `describe('ToggleGroup', () => { ... })`):

1. **`renders without crashing`** — Renders a ToggleGroup with 3 ToggleGroupItems, asserts group element exists via `getByRole('group')`
2. **`has data-slot on ToggleGroup`** — Asserts `data-slot="toggle-group"` on the group element
3. **`has data-slot on ToggleGroupItem`** — Asserts `data-slot="toggle-group-item"` on each item button
4. **`merges custom className on ToggleGroup`** — Passes `className="custom-group"`, asserts it's applied
5. **`merges custom className on ToggleGroupItem`** — Passes `className="custom-item"`, asserts it's applied
6. **`type="single" allows only one active item`** — Clicks item A, asserts `data-state="on"` on A. Clicks item B, asserts `data-state="on"` on B and `data-state="off"` on A
7. **`type="multiple" allows multiple active items`** — Clicks items A and B, asserts both have `data-state="on"`
8. **`items inherit variant from group context`** — Renders with `variant="outline"`, asserts items have outline classes (`border`, `border-input`)
9. **`items inherit size from group context`** — Renders with `size="sm"`, asserts items have `h-9` class
10. **`item-level variant overrides group context`** — Group has `variant="default"`, one item has `variant="outline"`. Asserts that item has `border` class
11. **`disabled group prevents toggling`** — Renders disabled group, clicks item, asserts `onValueChange` not called
12. **`supports controlled usage (single)`** — Passes `value="a"` + `onValueChange`, clicks item B, asserts callback called with `"b"`
13. **`supports uncontrolled usage (single)`** — Passes `defaultValue="a"`, asserts item A has `data-state="on"`, clicks B, asserts B is on and A is off
14. **`forwards ref on ToggleGroup`** — Creates ref, passes to ToggleGroup, asserts `ref.current instanceof HTMLDivElement`
15. **`forwards ref on ToggleGroupItem`** — Creates ref, passes to ToggleGroupItem, asserts `ref.current instanceof HTMLButtonElement`
16. **`has no accessibility violations`** — Renders group with items with `aria-label`, runs `axe`, asserts no violations

### 3.5 `toggle-group.stories.tsx`

**Purpose**: Storybook CSF3 stories with autodocs demonstrating all usage patterns.

**Meta configuration**:

- `title: 'Components/ToggleGroup'`
- `component: ToggleGroup`
- `tags: ['autodocs']`
- `argTypes` for `type` (select: `single`, `multiple`), `disabled` (boolean)

**Stories** (9 total):

1. **`SingleSelection`** — `type="single"` with 3 text items (Bold, Italic, Underline), each with `aria-label` and inline SVG icons
2. **`MultipleSelection`** — `type="multiple"` with same items
3. **`OutlineVariant`** — `type="single"` with `variant="outline"` and 3 items
4. **`SmallSize`** — `type="single"` with `size="sm"` and 3 items
5. **`LargeSize`** — `type="single"` with `size="lg"` and 3 items
6. **`Disabled`** — `type="single"` with `disabled` and 3 items
7. **`WithIcons`** — `type="multiple"` with inline SVG icons (bold, italic, underline icons from the Toggle stories pattern)
8. **`DefaultValue`** — `type="single"` with `defaultValue="bold"` showing pre-selected item
9. **`Controlled`** — `render` function with `ControlledDemo` component using `useState` for single selection

**Pattern**: Follows existing stories conventions — `export default meta`, `type Story = StoryObj<typeof ToggleGroup>`, render functions for complex stories, inline helper component for controlled demo.

### 3.6 `packages/ui/src/index.ts` modification

**Action**: Append the following export block after the existing Toggle exports (line 124):

```typescript
export {
  ToggleGroup,
  ToggleGroupItem,
  type ToggleGroupProps,
  type ToggleGroupItemProps,
} from './components/toggle-group/toggle-group.js';
export { toggleGroupVariants } from './components/toggle-group/toggle-group.styles.js';
```

## 4. API Contracts

### ToggleGroup Props

```typescript
// Extends Radix ToggleGroupPrimitive.Root props
type ToggleGroupProps = {
  // From Radix - required
  type: 'single' | 'multiple';

  // From Radix - single mode
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;

  // From Radix - multiple mode
  // value?: string[];
  // defaultValue?: string[];
  // onValueChange?: (value: string[]) => void;

  // Context propagation to children
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';

  // Standard
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  disabled?: boolean;
  children: React.ReactNode;
};
```

### ToggleGroupItem Props

```typescript
type ToggleGroupItemProps = {
  // From Radix - required
  value: string;

  // Override group context
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';

  // Standard
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
  disabled?: boolean;
  children?: React.ReactNode;
};
```

### Usage Examples

```tsx
// Single selection
<ToggleGroup type="single" defaultValue="bold" variant="outline" size="sm">
  <ToggleGroupItem value="bold" aria-label="Bold">B</ToggleGroupItem>
  <ToggleGroupItem value="italic" aria-label="Italic">I</ToggleGroupItem>
  <ToggleGroupItem value="underline" aria-label="Underline">U</ToggleGroupItem>
</ToggleGroup>

// Multiple selection
<ToggleGroup type="multiple" variant="default">
  <ToggleGroupItem value="bold" aria-label="Bold">B</ToggleGroupItem>
  <ToggleGroupItem value="italic" aria-label="Italic">I</ToggleGroupItem>
</ToggleGroup>

// Item-level override
<ToggleGroup type="single" variant="default" size="default">
  <ToggleGroupItem value="a">A</ToggleGroupItem>
  <ToggleGroupItem value="b" variant="outline" size="lg">B (overridden)</ToggleGroupItem>
</ToggleGroup>
```

## 5. Test Plan

### Test Setup

- Framework: Vitest with `jsdom` environment (already configured in project)
- Libraries: `@testing-library/react`, `@testing-library/user-event`, `vitest-axe`
- File: `packages/ui/src/components/toggle-group/toggle-group.test.tsx`

### Test Specifications

| #   | Test Name                                    | Category     | Description                        | Assertion                                       |
| --- | -------------------------------------------- | ------------ | ---------------------------------- | ----------------------------------------------- |
| 1   | renders without crashing                     | Smoke        | Render ToggleGroup with 3 items    | `getByRole('group')` exists                     |
| 2   | has data-slot on ToggleGroup                 | data-slot    | Check root attribute               | `data-slot="toggle-group"`                      |
| 3   | has data-slot on ToggleGroupItem             | data-slot    | Check item attributes              | Each button has `data-slot="toggle-group-item"` |
| 4   | merges custom className on ToggleGroup       | className    | Pass custom class to group         | Group element has `custom-group` class          |
| 5   | merges custom className on ToggleGroupItem   | className    | Pass custom class to item          | Item element has `custom-item` class            |
| 6   | type="single" allows only one active item    | Interaction  | Click A then B                     | A is `off`, B is `on`                           |
| 7   | type="multiple" allows multiple active items | Interaction  | Click A then B                     | Both A and B are `on`                           |
| 8   | items inherit variant from group context     | Context      | Group `variant="outline"`          | Items have `border` and `border-input` classes  |
| 9   | items inherit size from group context        | Context      | Group `size="sm"`                  | Items have `h-9` class                          |
| 10  | item-level variant overrides group context   | Context      | Group default, item outline        | Item has `border` class                         |
| 11  | disabled group prevents toggling             | Disabled     | Render disabled, click item        | `onValueChange` not called                      |
| 12  | supports controlled usage                    | Controlled   | Pass `value` + `onValueChange`     | Callback called with clicked value              |
| 13  | supports uncontrolled usage                  | Uncontrolled | Pass `defaultValue`, click another | States update correctly                         |
| 14  | forwards ref on ToggleGroup                  | Ref          | Pass `createRef` to group          | `ref.current instanceof HTMLDivElement`         |
| 15  | forwards ref on ToggleGroupItem              | Ref          | Pass `createRef` to item           | `ref.current instanceof HTMLButtonElement`      |
| 16  | has no accessibility violations              | a11y         | Render with aria-labels            | `axe(container)` has no violations              |

## 6. Implementation Order

1. **`toggle-group.styles.ts`** — Create CVA definition first (no dependencies on other new files)
2. **`toggle-group.types.ts`** — Create type definitions (depends on styles for `VariantProps`, and on toggle styles)
3. **`toggle-group.tsx`** — Create component implementation (depends on types, styles, and toggle styles)
4. **`toggle-group.test.tsx`** — Create test suite (depends on component)
5. **`toggle-group.stories.tsx`** — Create stories (depends on component)
6. **`packages/ui/src/index.ts`** — Add public API exports (depends on component and styles)

## 7. Verification Commands

```bash
# Run toggle-group tests specifically
pnpm --filter @components/ui test -- toggle-group

# Run all tests to ensure nothing is broken
pnpm test

# Type-check the entire UI package
pnpm typecheck

# Verify the build succeeds
pnpm build

# Verify stories render (manual — launch Storybook)
pnpm storybook
```

## 8. Design Deviations

**Deviation 1: `ToggleGroupContextType` naming and structure**

- **Parent spec requires**: The types file exports a type named `ToggleGroupContext` as `{ variant: ToggleProps['variant']; size: ToggleProps['size'] }`, referencing `ToggleProps` directly.
- **Why that is problematic**: Naming the type `ToggleGroupContext` creates a naming collision with the actual React context constant `ToggleGroupContext` created in `toggle-group.tsx`. Additionally, referencing `ToggleProps['variant']` introduces an unnecessary coupling to the Toggle component's props type when `VariantProps<typeof toggleVariants>` already provides the correct type and is what `ToggleProps` itself derives from.
- **Alternative chosen**: The type is named `ToggleGroupContextType` to avoid collision with the React context constant. It is typed as `VariantProps<typeof toggleVariants>` which produces the identical shape (`{ variant?: 'default' | 'outline' | null; size?: 'default' | 'sm' | 'lg' | null }`) without importing `ToggleProps`. This is consistent with how other sibling components (RadioGroup, Switch) type their props using `VariantProps<typeof ...Variants>` rather than referencing sibling component prop types.
