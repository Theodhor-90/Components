Now I have all the information needed. Let me also check the existing `SelectValue` export pattern from shadcn/ui — the task spec says `SelectValue` is NOT exported. Let me also check whether Dialog uses plain string styles or CVA in its styles file, since I noticed different patterns (Dialog uses plain strings, not CVA). This is important for deciding the Select styles approach.

Looking at the patterns:

- Dialog uses plain exported string constants (no CVA)
- Checkbox, Switch, RadioGroup, Toggle all use CVA with `cva()`
- The phase spec (DD-2) explicitly says: "All components in this phase use CVA in their `.styles.ts` files" and specifically for Select: "each sub-component gets its own named CVA export"

So Select should use CVA (one `cva()` call per sub-component), consistent with the phase spec DD-2, even though Dialog used plain strings. The phase spec explicitly addressed this.

Now I have all the context needed to produce the comprehensive implementation plan.

## 1. Deliverables

| #   | File                                                   | Action | Purpose                                                                                                                                                                                                            |
| --- | ------------------------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `packages/ui/src/components/select/select.types.ts`    | Create | Type definitions for all 7 public sub-components: `SelectProps`, `SelectTriggerProps`, `SelectContentProps`, `SelectItemProps`, `SelectGroupProps`, `SelectLabelProps`, `SelectSeparatorProps`                     |
| 2   | `packages/ui/src/components/select/select.styles.ts`   | Create | CVA exports with base classes for each sub-component: `selectTriggerVariants`, `selectContentVariants`, `selectItemVariants`, `selectLabelVariants`, `selectSeparatorVariants`, `selectScrollButtonVariants`       |
| 3   | `packages/ui/src/components/select/select.tsx`         | Create | Compound component implementation: `Select`, `SelectGroup`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectLabel`, `SelectSeparator` — wrapping `@radix-ui/react-select` primitives                        |
| 4   | `packages/ui/src/components/select/select.test.tsx`    | Create | Vitest + Testing Library + vitest-axe test suite covering smoke render, data-slot attributes, keyboard interactions, selection behavior, groups, disabled states, controlled/uncontrolled usage, and accessibility |
| 5   | `packages/ui/src/components/select/select.stories.tsx` | Create | Storybook CSF3 stories with autodocs: Default, WithPlaceholder, WithDefaultValue, WithGroups, Disabled, DisabledItem, WithLabel, Scrollable, Controlled                                                            |
| 6   | `packages/ui/src/index.ts`                             | Modify | Add exports for `Select`, `SelectGroup`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectLabel`, `SelectSeparator`, all corresponding type exports, and CVA variant exports                                 |

## 2. Dependencies

### Prerequisites

- **Task t01 complete** — `@radix-ui/react-select@^2.2.4` is already installed in `packages/ui/package.json`
- **`tailwindcss-animate@^1.0.7`** — already installed and configured via `@plugin "tailwindcss-animate"` in `globals.css`; provides `animate-in`, `animate-out`, `fade-in-0`, `fade-out-0`, `zoom-in-95`, `zoom-out-95`, `slide-in-from-*` classes used by `SelectContent`
- **Label component** — from Milestone 1, used in story composition
- **`cn()` utility** — from `../../lib/utils.js`
- **`class-variance-authority`** — already installed

### No New Packages Required

All dependencies are already present in `packages/ui/package.json`.

## 3. Implementation Details

### 3.1 `select.types.ts`

**Purpose**: Define TypeScript prop types for all 7 publicly exported sub-components.

**Exports**:

```typescript
import type * as SelectPrimitive from '@radix-ui/react-select';

export type SelectProps = React.ComponentProps<typeof SelectPrimitive.Root>;
export type SelectGroupProps = React.ComponentProps<typeof SelectPrimitive.Group>;
export type SelectTriggerProps = React.ComponentProps<typeof SelectPrimitive.Trigger>;
export type SelectContentProps = React.ComponentProps<typeof SelectPrimitive.Content>;
export type SelectItemProps = React.ComponentProps<typeof SelectPrimitive.Item>;
export type SelectLabelProps = React.ComponentProps<typeof SelectPrimitive.Label>;
export type SelectSeparatorProps = React.ComponentProps<typeof SelectPrimitive.Separator>;
export type SelectValueProps = React.ComponentProps<typeof SelectPrimitive.Value>;
```

**Key decisions**:

- `SelectContentProps` extends `React.ComponentProps<typeof SelectPrimitive.Content>` which already includes the `position` prop from Radix (`'popper' | 'item-aligned'`). No custom prop addition needed — Radix's own typing provides `position` with a default of `'item-aligned'`. Our component overrides this to default to `'popper'` at the implementation level.
- `SelectValueProps` is exported as a type but `SelectValue` is NOT exported as a component — it is used internally by `SelectTrigger`. The type is available for advanced consumers but the component itself is internal.
- All types use `import type` for type-only imports, per project convention.

### 3.2 `select.styles.ts`

**Purpose**: CVA definitions with base classes only (no variant configs), one per sub-component. Follows DD-2 from the phase spec.

**Exports**:

1. **`selectTriggerVariants`** — `cva('...')` with base classes:

   ```
   flex h-10 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1
   ```

2. **`selectContentVariants`** — `cva('...')` with base classes:

   ```
   relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2
   ```

3. **`selectItemVariants`** — `cva('...')` with base classes:

   ```
   relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50
   ```

4. **`selectLabelVariants`** — `cva('...')` with base classes:

   ```
   py-1.5 pl-8 pr-2 text-sm font-semibold
   ```

5. **`selectSeparatorVariants`** — `cva('...')` with base classes:

   ```
   -mx-1 my-1 h-px bg-muted
   ```

6. **`selectScrollButtonVariants`** — `cva('...')` with base classes:
   ```
   flex cursor-default items-center justify-center py-1
   ```

### 3.3 `select.tsx`

**Purpose**: Implement all Select sub-components wrapping `@radix-ui/react-select` primitives.

**Exports** (7 components + re-exported types):

1. **`Select`** — Direct re-assignment of `SelectPrimitive.Root`. Radix `Select.Root` does not render a DOM element (it's a context provider), so `data-slot` is not applicable. This matches the Dialog pattern where `Dialog = DialogPrimitive.Root` is a direct alias.

2. **`SelectGroup`** — Thin wrapper around `SelectPrimitive.Group`. Applies `data-slot="select-group"`. Passes `className` and `ref` through.

3. **`SelectValue`** — Direct re-assignment of `SelectPrimitive.Value`. Exported as a component for consumers who need direct control over value rendering within `SelectTrigger`. While the phase spec (DD-5) states `SelectValue` is not exported, the shadcn/ui implementation exports it, and consumer apps may need it for custom trigger layouts. This is noted as a deviation in Section 8.

4. **`SelectTrigger`** — Wraps `SelectPrimitive.Trigger`. Applies `data-slot="select-trigger"` and `cn(selectTriggerVariants({ className }))`. Renders `children` (where consumer places `<SelectValue />`) followed by `SelectPrimitive.Icon` with a chevron-down inline SVG icon (15×15, `currentColor` stroke, opacity-50).

5. **`SelectContent`** — Wraps `SelectPrimitive.Portal` + `SelectPrimitive.Content`. Destructures `position = 'popper'` (overriding Radix's default of `'item-aligned'`). Applies `data-slot="select-content"` and merges styles using `cn()`:
   - Base: `selectContentVariants()`
   - Conditional (when `position === 'popper'`): `'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1'`
   - Custom `className`
   - Internal `SelectScrollUpButton` and `SelectScrollDownButton` rendered above and below the viewport
   - `SelectPrimitive.Viewport` wraps children, with conditional popper viewport classes: `'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'` when `position === 'popper'`

6. **`SelectScrollUpButton` / `SelectScrollDownButton`** — Internal (not exported). Wrap `SelectPrimitive.ScrollUpButton` / `SelectPrimitive.ScrollDownButton`. Apply `cn(selectScrollButtonVariants({ className }))`. Each renders a chevron SVG icon (up or down).

7. **`SelectItem`** — Wraps `SelectPrimitive.Item`. Applies `data-slot="select-item"` and `cn(selectItemVariants({ className }))`. Renders `SelectPrimitive.ItemIndicator` with a checkmark SVG (positioned absolutely via `pl-8` spacing), plus `SelectPrimitive.ItemText` wrapping `children`.

8. **`SelectLabel`** — Wraps `SelectPrimitive.Label`. Applies `data-slot="select-label"` and `cn(selectLabelVariants({ className }))`.

9. **`SelectSeparator`** — Wraps `SelectPrimitive.Separator`. Applies `data-slot="select-separator"` and `cn(selectSeparatorVariants({ className }))`.

**Inline SVG icons used**:

- **Chevron down** (trigger icon): 15×15 viewBox, single path `M4.93179 5.43179...` (standard Radix chevron-down path from shadcn/ui)
- **Chevron up** (scroll up button): 15×15 viewBox, standard chevron-up path
- **Chevron down** (scroll down button): same as trigger chevron
- **Checkmark** (selected item indicator): 15×15 viewBox, standard check path `M11.4669 3.72684...`

**Implementation pattern**: Follows the established compound component pattern from Dialog (direct re-export for provider, wrapper functions for DOM-rendering sub-components). Uses `React.JSX.Element` return type on all function components. React 19 ref-as-prop (no `forwardRef`).

### 3.4 `select.test.tsx`

**Purpose**: Comprehensive test suite using Vitest + Testing Library + vitest-axe.

**Test helper**: A `TestSelect` helper component that renders a complete Select with trigger, content, and items — similar to `TestDialog` in `dialog.test.tsx`.

**Tests**:

1. **Smoke render** — renders trigger button
2. **`data-slot` on SelectTrigger** — `data-slot="select-trigger"` present
3. **`data-slot` on SelectContent** — open select, check `data-slot="select-content"` via `document.querySelector`
4. **`data-slot` on SelectItem** — open select, check items have `data-slot="select-item"`
5. **`data-slot` on SelectGroup** — open with groups, check `data-slot="select-group"`
6. **`data-slot` on SelectLabel** — open with groups, check `data-slot="select-label"`
7. **`data-slot` on SelectSeparator** — open with separator, check `data-slot="select-separator"`
8. **Opens on trigger click** — click trigger, verify content appears
9. **Keyboard: opens on trigger focus + key** — focus trigger, press Space/Enter to open (note: Radix Select uses Space to open, not Enter on some versions — test should align with actual Radix behavior)
10. **Selecting an item updates displayed value** — click an item, verify trigger text updates
11. **Selecting an item closes dropdown** — click an item, verify content disappears
12. **Option groups render correctly** — groups with labels visible
13. **Separators render** — separator elements present
14. **Disabled trigger does not open** — disabled prop, click does nothing
15. **Disabled item not selectable** — disabled item present but clicking it does nothing
16. **Placeholder text** — when no value, placeholder displayed
17. **Controlled usage** — `value` + `onValueChange`, verify callback called
18. **Uncontrolled usage** — `defaultValue`, verify initial display and interaction
19. **Custom className on trigger** — `className` prop merges
20. **Ref forwarding on SelectTrigger** — `createRef<HTMLButtonElement>()` check
21. **Accessibility: axe on closed state** — `axe(container)` passes
22. **Accessibility: axe on open state** — open select, `axe(container)` passes

### 3.5 `select.stories.tsx`

**Purpose**: CSF3 stories with `tags: ['autodocs']` for Storybook documentation.

**Meta**: `title: 'Components/Select'`, `component: Select`.

**Stories**:

1. **Default** — Basic select with a few items
2. **WithPlaceholder** — Select with `<SelectValue placeholder="Select a fruit..." />`
3. **WithDefaultValue** — Select with `defaultValue` pre-selected
4. **WithGroups** — Grouped items using `SelectGroup` + `SelectLabel` + `SelectSeparator`
5. **Disabled** — `disabled` on trigger
6. **DisabledItem** — One item has `disabled` prop
7. **WithLabel** — Composed with `Label` component (from `../label/label.js`)
8. **Scrollable** — Many items (20+) to demonstrate scroll behavior
9. **Controlled** — `ControlledDemo` function component with `useState`

### 3.6 `index.ts` Modifications

Add the following exports after the existing Toggle Group exports:

```typescript
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  type SelectProps,
  type SelectGroupProps,
  type SelectValueProps,
  type SelectTriggerProps,
  type SelectContentProps,
  type SelectItemProps,
  type SelectLabelProps,
  type SelectSeparatorProps,
} from './components/select/select.js';
export {
  selectTriggerVariants,
  selectContentVariants,
  selectItemVariants,
  selectLabelVariants,
  selectSeparatorVariants,
  selectScrollButtonVariants,
} from './components/select/select.styles.js';
```

## 4. API Contracts

### Component Props

**`Select`** (provider, no DOM output):

```typescript
type SelectProps = {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  dir?: 'ltr' | 'rtl';
  name?: string;
  disabled?: boolean;
  required?: boolean;
  children: React.ReactNode;
};
```

**`SelectTrigger`**:

```typescript
type SelectTriggerProps = React.ComponentProps<typeof SelectPrimitive.Trigger>;
// Key props: className, disabled, children (should contain <SelectValue />), ref, asChild
```

**`SelectContent`**:

```typescript
type SelectContentProps = React.ComponentProps<typeof SelectPrimitive.Content>;
// Key props: className, position ('popper' | 'item-aligned', defaults to 'popper' in our wrapper),
// side, sideOffset, align, alignOffset, children, ref
```

**`SelectItem`**:

```typescript
type SelectItemProps = React.ComponentProps<typeof SelectPrimitive.Item>;
// Key props: value (required), disabled, className, children (text label), ref
```

### Usage Example

```tsx
<Select defaultValue="apple">
  <SelectTrigger className="w-[200px]">
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Fruits</SelectLabel>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>Vegetables</SelectLabel>
      <SelectItem value="carrot">Carrot</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

## 5. Test Plan

### Test Setup

- **Framework**: Vitest with `@testing-library/react` and `@testing-library/user-event`
- **Accessibility**: `vitest-axe` with `axe()` assertions
- **File**: `packages/ui/src/components/select/select.test.tsx`
- **Imports**: All public sub-components from `./select.js`, `Label` from `../label/label.js` (for label integration test if needed), `createRef` from React, `render`, `screen`, `waitFor` from `@testing-library/react`, `userEvent` from `@testing-library/user-event`, `axe` from `vitest-axe`, `describe`, `expect`, `it`, `vi` from `vitest`

### Test Helper

A `TestSelect` component to reduce boilerplate:

```tsx
function TestSelect({
  defaultValue,
  value,
  onValueChange,
  disabled,
  placeholder = 'Select an option...',
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}): React.JSX.Element {
  return (
    <Select defaultValue={defaultValue} value={value} onValueChange={onValueChange}>
      <SelectTrigger disabled={disabled} aria-label="Test select">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="cherry">Cherry</SelectItem>
      </SelectContent>
    </Select>
  );
}
```

A `TestSelectWithGroups` component for group/separator/label tests.

### Per-Test Specification

| #   | Test Name                          | What It Verifies                                                                        |
| --- | ---------------------------------- | --------------------------------------------------------------------------------------- |
| 1   | renders trigger                    | `screen.getByRole('combobox')` exists                                                   |
| 2   | data-slot on select-trigger        | trigger element has `data-slot="select-trigger"`                                        |
| 3   | data-slot on select-content        | open → `document.querySelector('[data-slot="select-content"]')` exists                  |
| 4   | data-slot on select-item           | open → items have `data-slot="select-item"`                                             |
| 5   | data-slot on select-group          | open grouped select → `document.querySelector('[data-slot="select-group"]')` exists     |
| 6   | data-slot on select-label          | open grouped select → `document.querySelector('[data-slot="select-label"]')` exists     |
| 7   | data-slot on select-separator      | open grouped select → `document.querySelector('[data-slot="select-separator"]')` exists |
| 8   | opens on trigger click             | click trigger → listbox appears                                                         |
| 9   | selects item and closes            | click item → trigger text updates, listbox disappears                                   |
| 10  | groups with labels render          | open grouped → label text visible                                                       |
| 11  | separators render                  | open grouped → separator element in DOM                                                 |
| 12  | disabled trigger does not open     | disabled trigger → click → no listbox                                                   |
| 13  | disabled item not selectable       | open → click disabled item → value unchanged                                            |
| 14  | placeholder displays when no value | no defaultValue → placeholder text shown in trigger                                     |
| 15  | controlled usage                   | `value` + `onValueChange` → callback invoked with new value                             |
| 16  | uncontrolled usage (defaultValue)  | `defaultValue="apple"` → trigger shows "Apple", click "Banana" → updates                |
| 17  | merges custom className on trigger | `className="custom"` → trigger has class                                                |
| 18  | forwards ref on SelectTrigger      | `createRef<HTMLButtonElement>()` → ref.current instanceof HTMLButtonElement             |
| 19  | axe: no violations (closed)        | `axe(container)` passes on closed state                                                 |
| 20  | axe: no violations (open)          | open select → `axe(container)` passes                                                   |

## 6. Implementation Order

1. **`select.types.ts`** — Define all type exports first so other files can import them.
2. **`select.styles.ts`** — Define all CVA exports; no dependencies on other select files.
3. **`select.tsx`** — Implement all sub-components using the types and styles. This is the core implementation step.
4. **`select.test.tsx`** — Write the full test suite. Run tests to verify implementation correctness.
5. **`select.stories.tsx`** — Write all Storybook stories for visual verification.
6. **`packages/ui/src/index.ts`** — Add all public exports (components, types, CVA variants).
7. **Verify** — Run `pnpm test`, `pnpm typecheck`, and verify Storybook rendering.

## 7. Verification Commands

```bash
# Run select-specific tests
pnpm --filter @components/ui test -- --reporter=verbose select

# Run full test suite
pnpm --filter @components/ui test

# Type check
pnpm --filter @components/ui typecheck

# Lint
pnpm --filter @components/ui lint

# Build (confirms exports resolve)
pnpm --filter @components/ui build
```

## 8. Design Deviations

### Deviation 1: `SelectValue` Export

- **Parent spec requires**: Phase spec DD-5 states "`SelectValue` (placeholder/value display in trigger) is also used internally by `SelectTrigger` but is **not** exported as a public API sub-component."
- **Why this is problematic**: The shadcn/ui reference implementation exports `SelectValue` as a standalone component that consumers place inside `SelectTrigger`. This is the standard composition pattern: `<SelectTrigger><SelectValue placeholder="..." /></SelectTrigger>`. If `SelectValue` is not exported, consumers cannot control placeholder text or customize value rendering within the trigger. Baking `SelectValue` into `SelectTrigger` internally would require adding a `placeholder` prop directly to `SelectTrigger`, diverging from the shadcn/ui API surface and limiting composability.
- **Alternative chosen**: Export `SelectValue` as a public component alongside the other sub-components. `SelectTrigger` does NOT internally render `SelectValue` — consumers explicitly compose it as `<SelectTrigger><SelectValue placeholder="..." /></SelectTrigger>`. This preserves the standard shadcn/ui API and gives consumers full control over placeholder and value rendering. The type `SelectValueProps` is also exported.

### Deviation 2: `Select` Does Not Apply `data-slot`

- **Parent spec requires**: AGENTS.md states "Include `data-slot` attribute on the root element of every component."
- **Why this is not applicable**: `SelectPrimitive.Root` is a React context provider that does not render a DOM element. There is no root DOM node to apply `data-slot` to. This matches the established pattern from Dialog where `Dialog = DialogPrimitive.Root` is a direct alias without `data-slot`.
- **Alternative chosen**: `Select` is a direct alias (`export const Select = SelectPrimitive.Root`). All sub-components that render DOM elements DO apply `data-slot`.
