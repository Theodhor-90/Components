Now I have a thorough understanding of all patterns. Let me produce the comprehensive phase specification.

# Phase 2: Selection Controls — Detailed Specification

## Goal

Deliver six interactive selection components — Checkbox, Switch, Radio Group, Toggle, Toggle Group, and Select — as shadcn/ui ports wrapping their respective Radix UI primitives, adapted to the project's 5-file pattern with React 19 conventions. These components cover all binary (on/off), single-choice, and multi-choice selection patterns needed by consumer apps. After this phase, apps can build settings pages, filter panels, preference forms, and any UI requiring option selection with full keyboard navigation and WCAG-compliant accessibility.

---

## Design Decisions

### DD-1: No `asChild` on Radix-Wrapped Components

Unlike Input and Textarea (which wrap native HTML elements and use `@radix-ui/react-slot` for `asChild` support), the six selection controls in this phase wrap Radix UI primitives that already provide their own composition patterns. Radix Checkbox, Switch, Toggle, and Select do not expose an `asChild` prop on their root in a meaningful way for end-user composition — the internal rendering is managed by the primitive. Therefore, these components will **not** add a custom `asChild` prop. The `asChild` prop is only relevant where the component renders a native HTML element directly (as with Button, Input, Textarea). Sub-components that Radix exposes with built-in `asChild` support (e.g., `SelectTrigger`) will forward it naturally through the spread props.

### DD-2: CVA Usage Per Component

- **Checkbox**: No visual variants — single style. `checkboxVariants` CVA holds only base classes (consistent with Input/Textarea pattern from DD-1/DD-2 of Phase 1).
- **Switch**: No visual variants — single style. `switchVariants` CVA holds base classes.
- **Radio Group / RadioGroupItem**: No visual variants. `radioGroupVariants` and `radioGroupItemVariants` hold base classes only.
- **Toggle**: Has `variant` (`default` | `outline`) and `size` (`sm` | `default` | `lg`) props. `toggleVariants` CVA defines these variants with `defaultVariants`, matching the shadcn/ui reference.
- **Toggle Group / ToggleGroupItem**: ToggleGroupItem inherits variant and size from group context. `toggleGroupVariants` CVA holds the group container base classes only. ToggleGroupItem reuses `toggleVariants` from the Toggle component for its styling, applying the variant/size received from context.
- **Select**: Sub-component styles are defined as plain class strings (like Dialog) rather than CVA variants, since Select sub-components have no configurable visual variants. Only `selectTriggerStyles`, `selectContentStyles`, `selectItemStyles`, `selectLabelStyles`, `selectSeparatorStyles` are needed.

### DD-3: Toggle Group Context Pattern

Toggle Group must propagate `variant` and `size` props to its ToggleGroupItem children without requiring each item to specify them explicitly. This will use a React context pattern:

1. `ToggleGroup` creates a `ToggleGroupContext` with `variant` and `size` values
2. `ToggleGroupItem` reads from this context, using context values as defaults that can be overridden by direct props
3. The context is defined in the toggle-group component files, not as a shared utility

This matches the shadcn/ui Toggle Group implementation pattern.

### DD-4: Styles File Pattern — CVA vs Plain Strings

Components with configurable visual variants (Toggle) use CVA with a `variants` config object. Components without visual variants but with a single base style use CVA with base classes only (Checkbox, Switch, Radio Group). Compound components with multiple sub-component styles but no configurable variants (Select, Dialog-like) use plain exported string constants — this matches the established Dialog pattern in the codebase where `dialogOverlayStyles`, `dialogContentStyles`, etc. are simple string exports.

### DD-5: Checkbox Indicator Icons

The Checkbox component will render inline SVG icons for the checked (checkmark) and indeterminate (dash/minus) states, consistent with how Dialog renders its close icon as inline SVG. No icon library dependency is introduced. The checkmark and dash icons will be rendered inside the `Radix CheckboxIndicator` primitive, which handles show/hide based on state.

### DD-6: Select Scroll Buttons and Viewport

The Select component will include `SelectScrollUpButton` and `SelectScrollDownButton` inside `SelectContent` for long lists, matching the shadcn/ui pattern. These are internal to `SelectContent` (not separately exported as public API) since they are implementation details of the dropdown behavior. The `SelectValue` sub-component (placeholder display in trigger) will be re-exported for consumer convenience.

### DD-7: Radix Dependency Versions

All six Radix packages will be installed at the latest stable version compatible with React 19. The existing project already uses Radix packages (react-dialog, react-popover, react-label, etc.), so version alignment should follow whatever `@radix-ui/*` version range is already established in `packages/ui/package.json`.

---

## Tasks

### Task 1: Checkbox Component

**Deliverables**: Complete `packages/ui/src/components/checkbox/` directory with all 5 files, plus public API export. Install `@radix-ui/react-checkbox`.

**Files to create**:

1. **`checkbox.types.ts`** — `CheckboxProps` extending `React.ComponentProps<typeof CheckboxPrimitive.Root>`. No additional custom props beyond what Radix provides (`checked`, `defaultChecked`, `onCheckedChange`, `disabled`, `required`, `name`, `value`).

2. **`checkbox.styles.ts`** — `checkboxVariants` CVA definition with base classes only:
   - Layout: `peer h-4 w-4 shrink-0 rounded-sm`
   - Border: `border border-primary`
   - Focus: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background`
   - Disabled: `disabled:cursor-not-allowed disabled:opacity-50`
   - Checked state: `data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground`
   - Indeterminate: `data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground`

3. **`checkbox.tsx`** — Functional component wrapping `CheckboxPrimitive.Root`. Applies `data-slot="checkbox"`, `cn(checkboxVariants({ className }))`. Renders `CheckboxPrimitive.Indicator` with inline SVG checkmark icon (checked state) and dash icon (indeterminate state). React 19 `ref` as prop.

4. **`checkbox.test.tsx`** — Vitest + Testing Library + vitest-axe tests:
   - Smoke render
   - Applies `data-slot="checkbox"`
   - Supports custom `className`
   - Checked state: clicking toggles `data-state` from `unchecked` to `checked`
   - Indeterminate state: renders with `checked="indeterminate"` and shows dash indicator
   - Disabled state: does not toggle on click
   - Controlled usage (`checked` + `onCheckedChange`)
   - Uncontrolled usage (`defaultChecked`)
   - Works with Label (clicking associated Label toggles checkbox)
   - Accessibility: `axe` assertions on default, checked, and indeterminate states
   - Ref forwarding

5. **`checkbox.stories.tsx`** — CSF3 stories with `tags: ['autodocs']`:
   - Default (unchecked)
   - Checked
   - Indeterminate
   - Disabled
   - Disabled Checked
   - With Label
   - Controlled

**Export to add to `packages/ui/src/index.ts`**:

```typescript
export { Checkbox, type CheckboxProps } from './components/checkbox/checkbox.js';
export { checkboxVariants } from './components/checkbox/checkbox.styles.js';
```

---

### Task 2: Switch Component

**Deliverables**: Complete `packages/ui/src/components/switch/` directory with all 5 files, plus public API export. Install `@radix-ui/react-switch`.

**Files to create**:

1. **`switch.types.ts`** — `SwitchProps` extending `React.ComponentProps<typeof SwitchPrimitive.Root>`. No additional custom props.

2. **`switch.styles.ts`** — Two style exports:
   - `switchVariants` CVA with base classes for the root track:
     - Layout: `peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full`
     - Border: `border-2 border-transparent`
     - Focus: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background`
     - Transition: `transition-colors`
     - Disabled: `disabled:cursor-not-allowed disabled:opacity-50`
     - States: `data-[state=checked]:bg-primary data-[state=unchecked]:bg-input`
   - `switchThumbStyles` plain string for the thumb:
     - `pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0`

3. **`switch.tsx`** — Functional component wrapping `SwitchPrimitive.Root` with `SwitchPrimitive.Thumb` inside. Root applies `data-slot="switch"`, `cn(switchVariants({ className }))`. Thumb applies `cn(switchThumbStyles)`.

4. **`switch.test.tsx`** — Vitest + Testing Library + vitest-axe tests:
   - Smoke render
   - Applies `data-slot="switch"`
   - Supports custom `className`
   - Click toggles between checked and unchecked
   - Keyboard: Space toggles state
   - Has `role="switch"` and correct `aria-checked` value
   - Disabled state: does not toggle
   - Controlled usage (`checked` + `onCheckedChange`)
   - Uncontrolled usage (`defaultChecked`)
   - With Label integration
   - Accessibility: `axe` assertions
   - Ref forwarding

5. **`switch.stories.tsx`** — CSF3 stories with `tags: ['autodocs']`:
   - Default (off)
   - Checked (on)
   - Disabled
   - Disabled Checked
   - With Label
   - Controlled

**Export to add to `packages/ui/src/index.ts`**:

```typescript
export { Switch, type SwitchProps } from './components/switch/switch.js';
export { switchVariants } from './components/switch/switch.styles.js';
```

---

### Task 3: Radio Group Component

**Deliverables**: Complete `packages/ui/src/components/radio-group/` directory with all 5 files, plus public API export. Install `@radix-ui/react-radio-group`.

**Files to create**:

1. **`radio-group.types.ts`** — Two types:
   - `RadioGroupProps` extending `React.ComponentProps<typeof RadioGroupPrimitive.Root>`
   - `RadioGroupItemProps` extending `React.ComponentProps<typeof RadioGroupPrimitive.Item>`

2. **`radio-group.styles.ts`** — Two style exports:
   - `radioGroupVariants` CVA with base classes: `grid gap-2`
   - `radioGroupItemVariants` CVA with base classes:
     - Layout: `aspect-square h-4 w-4 rounded-full`
     - Border: `border border-primary`
     - Focus: `focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background`
     - Disabled: `disabled:cursor-not-allowed disabled:opacity-50`
     - Checked: `data-[state=checked]:text-primary` (filled circle indicator rendered via `RadioGroupPrimitive.Indicator`)

3. **`radio-group.tsx`** — Two functional components:
   - `RadioGroup`: wraps `RadioGroupPrimitive.Root`, applies `data-slot="radio-group"`, `cn(radioGroupVariants({ className }))`.
   - `RadioGroupItem`: wraps `RadioGroupPrimitive.Item`, applies `data-slot="radio-group-item"`, `cn(radioGroupItemVariants({ className }))`. Renders `RadioGroupPrimitive.Indicator` containing an inline SVG filled circle icon.

4. **`radio-group.test.tsx`** — Vitest + Testing Library + vitest-axe tests:
   - Smoke render with multiple items
   - Applies `data-slot` on both RadioGroup and RadioGroupItem
   - Selecting one item deselects others (mutual exclusion)
   - Keyboard: arrow keys navigate between items
   - Disabled group: no items selectable
   - Disabled individual item: that item not selectable, others still work
   - Controlled usage (`value` + `onValueChange`)
   - Uncontrolled usage (`defaultValue`)
   - With Label per item
   - Accessibility: `axe` assertions, correct `role="radiogroup"` and `role="radio"`
   - Ref forwarding on both RadioGroup and RadioGroupItem

5. **`radio-group.stories.tsx`** — CSF3 stories with `tags: ['autodocs']`:
   - Default (no selection)
   - With Default Value
   - Disabled
   - With Labels
   - Horizontal Layout (using `className="flex"` override)
   - Controlled

**Export to add to `packages/ui/src/index.ts`**:

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

---

### Task 4: Toggle Component

**Deliverables**: Complete `packages/ui/src/components/toggle/` directory with all 5 files, plus public API export. Install `@radix-ui/react-toggle`.

**Files to create**:

1. **`toggle.types.ts`** — `ToggleProps` extending `React.ComponentProps<typeof TogglePrimitive.Root>` intersected with `VariantProps<typeof toggleVariants>`.

2. **`toggle.styles.ts`** — `toggleVariants` CVA definition with variants:
   - Base classes: `inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground`
   - `variant`:
     - `default`: (empty string — base classes handle default appearance)
     - `outline`: `border border-input bg-transparent hover:bg-accent hover:text-accent-foreground`
   - `size`:
     - `default`: `h-10 px-3`
     - `sm`: `h-9 px-2.5`
     - `lg`: `h-11 px-5`
   - `defaultVariants`: `{ variant: 'default', size: 'default' }`

3. **`toggle.tsx`** — Functional component wrapping `TogglePrimitive.Root`. Destructures `variant`, `size`, `className`. Applies `data-slot="toggle"`, `cn(toggleVariants({ variant, size, className }))`.

4. **`toggle.test.tsx`** — Vitest + Testing Library + vitest-axe tests:
   - Smoke render
   - Applies `data-slot="toggle"`
   - Renders default variant by default
   - Renders outline variant with border
   - Renders all three sizes (sm, default, lg)
   - Click toggles `data-state` between `off` and `on`
   - Has `aria-pressed` reflecting pressed state
   - Disabled state: does not toggle
   - Controlled usage (`pressed` + `onPressedChange`)
   - Uncontrolled usage (`defaultPressed`)
   - Supports custom `className`
   - Accessibility: `axe` assertions
   - Ref forwarding

5. **`toggle.stories.tsx`** — CSF3 stories with `tags: ['autodocs']`:
   - Default
   - Outline
   - Small
   - Large
   - Pressed
   - Disabled
   - With Icon (rendering a bold/italic style icon inside)
   - Controlled

**Export to add to `packages/ui/src/index.ts`**:

```typescript
export { Toggle, type ToggleProps } from './components/toggle/toggle.js';
export { toggleVariants } from './components/toggle/toggle.styles.js';
```

---

### Task 5: Toggle Group Component

**Deliverables**: Complete `packages/ui/src/components/toggle-group/` directory with all 5 files, plus public API export. Install `@radix-ui/react-toggle-group`.

**Dependencies**: Task 4 (Toggle) must be complete — ToggleGroupItem reuses `toggleVariants` for styling.

**Files to create**:

1. **`toggle-group.types.ts`** — Three exports:
   - `ToggleGroupContext` type: `{ variant: ToggleProps['variant']; size: ToggleProps['size'] }`
   - `ToggleGroupProps` extending `React.ComponentProps<typeof ToggleGroupPrimitive.Root>` with optional `variant` and `size` props (typed from `VariantProps<typeof toggleVariants>`)
   - `ToggleGroupItemProps` extending `React.ComponentProps<typeof ToggleGroupPrimitive.Item>` with optional `variant` and `size` props

2. **`toggle-group.styles.ts`** — `toggleGroupVariants` CVA with base classes only: `flex items-center justify-center gap-1`

3. **`toggle-group.tsx`** — Two functional components plus context:
   - `ToggleGroupContext`: React context created with `createContext` holding `{ variant, size }` defaults
   - `ToggleGroup`: wraps `ToggleGroupPrimitive.Root`, provides `ToggleGroupContext` with the group's `variant` and `size`. Applies `data-slot="toggle-group"`, `cn(toggleGroupVariants({ className }))`.
   - `ToggleGroupItem`: wraps `ToggleGroupPrimitive.Item`, reads `variant` and `size` from `ToggleGroupContext` (direct props override context). Applies `data-slot="toggle-group-item"`, `cn(toggleVariants({ variant: itemVariant, size: itemSize, className }))`. Reuses `toggleVariants` from `../toggle/toggle.styles.js`.

4. **`toggle-group.test.tsx`** — Vitest + Testing Library + vitest-axe tests:
   - Smoke render with multiple items
   - Applies `data-slot` on both ToggleGroup and ToggleGroupItem
   - `type="single"`: only one item active at a time, selecting one deselects previous
   - `type="multiple"`: multiple items can be active simultaneously
   - Context propagation: items inherit `variant` and `size` from group
   - Context override: item-level `variant`/`size` override group values
   - Disabled group: no items toggleable
   - Keyboard navigation
   - Controlled usage (`value` + `onValueChange`)
   - Uncontrolled usage (`defaultValue`)
   - Accessibility: `axe` assertions
   - Ref forwarding on both ToggleGroup and ToggleGroupItem

5. **`toggle-group.stories.tsx`** — CSF3 stories with `tags: ['autodocs']`:
   - Single Selection
   - Multiple Selection
   - Outline Variant
   - Small Size
   - Large Size
   - Disabled
   - With Icons
   - Default Value
   - Controlled

**Export to add to `packages/ui/src/index.ts`**:

```typescript
export {
  ToggleGroup,
  ToggleGroupItem,
  type ToggleGroupProps,
  type ToggleGroupItemProps,
} from './components/toggle-group/toggle-group.js';
export { toggleGroupVariants } from './components/toggle-group/toggle-group.styles.js';
```

---

### Task 6: Select Component

**Deliverables**: Complete `packages/ui/src/components/select/` directory with all 5 files, plus public API export. Install `@radix-ui/react-select`.

**Files to create**:

1. **`select.types.ts`** — Type exports:
   - `SelectProps` = `React.ComponentProps<typeof SelectPrimitive.Root>`
   - `SelectTriggerProps` = `React.ComponentProps<typeof SelectPrimitive.Trigger>`
   - `SelectContentProps` = `React.ComponentProps<typeof SelectPrimitive.Content>` with optional `position?: 'popper' | 'item-aligned'` (defaults to `'popper'`)
   - `SelectItemProps` = `React.ComponentProps<typeof SelectPrimitive.Item>`
   - `SelectGroupProps` = `React.ComponentProps<typeof SelectPrimitive.Group>`
   - `SelectLabelProps` = `React.ComponentProps<typeof SelectPrimitive.Label>`
   - `SelectSeparatorProps` = `React.ComponentProps<typeof SelectPrimitive.Separator>`
   - `SelectValueProps` = `React.ComponentProps<typeof SelectPrimitive.Value>`

2. **`select.styles.ts`** — Plain string style exports (no CVA variants — matches Dialog pattern):
   - `selectTriggerStyles`: `flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1`
   - `selectContentStyles`: `relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2` (plus popper-specific sizing classes applied conditionally)
   - `selectItemStyles`: `relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50`
   - `selectLabelStyles`: `py-1.5 pl-8 pr-2 text-sm font-semibold`
   - `selectSeparatorStyles`: `-mx-1 my-1 h-px bg-muted`
   - `selectScrollButtonStyles`: `flex cursor-default items-center justify-center py-1`

3. **`select.tsx`** — Multiple functional components following the compound component pattern (matching Dialog):
   - `Select`: re-export of `SelectPrimitive.Root`
   - `SelectGroup`: re-export of `SelectPrimitive.Group` with `data-slot="select-group"`
   - `SelectValue`: re-export of `SelectPrimitive.Value` with `data-slot="select-value"`
   - `SelectTrigger`: wraps `SelectPrimitive.Trigger`, applies `data-slot="select-trigger"` and `selectTriggerStyles`. Renders `SelectPrimitive.Icon` with a chevron-down SVG icon inside.
   - `SelectContent`: wraps `SelectPrimitive.Portal` + `SelectPrimitive.Content`. Applies `data-slot="select-content"` and `selectContentStyles`. Includes internal `SelectScrollUpButton` and `SelectScrollDownButton` (with chevron SVG icons). Wraps children in `SelectPrimitive.Viewport`. Handles `position="popper"` conditional styling for viewport sizing.
   - `SelectItem`: wraps `SelectPrimitive.Item`. Applies `data-slot="select-item"` and `selectItemStyles`. Renders `SelectPrimitive.ItemIndicator` with a checkmark SVG, plus `SelectPrimitive.ItemText` for the label.
   - `SelectLabel`: wraps `SelectPrimitive.Label` with `data-slot="select-label"` and `selectLabelStyles`.
   - `SelectSeparator`: wraps `SelectPrimitive.Separator` with `data-slot="select-separator"` and `selectSeparatorStyles`.

4. **`select.test.tsx`** — Vitest + Testing Library + vitest-axe tests:
   - Smoke render with trigger and items
   - Applies `data-slot` on all sub-components
   - Opens dropdown on trigger click
   - Keyboard: Space/Enter opens, arrow keys navigate, Enter selects, Escape closes
   - Selecting an item closes dropdown and updates displayed value
   - Option groups with labels render correctly
   - Separators render between groups
   - Disabled trigger: does not open
   - Disabled item: not selectable but visible
   - Placeholder text displays when no value selected
   - Controlled usage (`value` + `onValueChange`)
   - Uncontrolled usage (`defaultValue`)
   - Accessibility: `axe` assertions, correct `role="combobox"` on trigger
   - Ref forwarding on SelectTrigger

5. **`select.stories.tsx`** — CSF3 stories with `tags: ['autodocs']`:
   - Default
   - With Placeholder
   - With Default Value
   - With Groups (grouped options with labels and separators)
   - Disabled
   - Disabled Item
   - With Label (composing with Label component)
   - Scrollable (many items to demonstrate scroll behavior)
   - Controlled

**Export to add to `packages/ui/src/index.ts`**:

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
```

---

## Exit Criteria

1. `packages/ui/src/components/checkbox/` contains all 5 files following the component file pattern
2. `packages/ui/src/components/switch/` contains all 5 files following the component file pattern
3. `packages/ui/src/components/radio-group/` contains all 5 files following the component file pattern
4. `packages/ui/src/components/toggle/` contains all 5 files following the component file pattern
5. `packages/ui/src/components/toggle-group/` contains all 5 files following the component file pattern
6. `packages/ui/src/components/select/` contains all 5 files following the component file pattern
7. `pnpm test` passes — all tests green for all 6 components, including vitest-axe accessibility assertions
8. `pnpm typecheck` passes with no errors in the `@components/ui` package
9. Checkbox supports checked, unchecked, and indeterminate states with correct visual indicators
10. Switch toggles on click and keyboard (Space) with `role="switch"` and correct `aria-checked`
11. Radio Group enforces mutual exclusion and supports arrow key navigation between items
12. Toggle renders `default` and `outline` variants at `sm`, `default`, and `lg` sizes, with correct `aria-pressed`
13. Toggle Group enforces single or multiple selection based on `type` prop, and items inherit variant/size from group context
14. Select opens on click and keyboard (Space/Enter), supports option groups with labels and separators, displays selected value in trigger, and closes on selection or Escape
15. All 6 components use semantic tokens (`border-input`, `ring-ring`, `bg-primary`, `text-primary-foreground`, etc.)
16. All 6 components render correctly in Storybook with all stories visible under autodocs
17. All components and their sub-components are exported from `packages/ui/src/index.ts` (components, props types, and variant/style exports)

---

## Dependencies

1. **Phase 1 (Text Inputs) complete** — establishes the Milestone 2 implementation pattern for form controls and confirms the monorepo build pipeline handles the new component directories
2. **Milestone 1 complete** — Label component (needed for Checkbox, Switch, Radio Group story composition and testing), `cn()` utility, CVA, Tailwind v4 with OKLCH tokens, Vitest + vitest-axe, Storybook 8.5 must all be operational
3. **Button component** — exists as the canonical 5-file pattern reference with CVA variants
4. **Dialog component** — exists as the reference for compound component patterns (multiple sub-components, plain string styles, Radix primitive wrapping)
5. **Task 4 before Task 5** — Toggle must be complete before Toggle Group, because ToggleGroupItem reuses `toggleVariants` from the Toggle styles file

---

## Artifacts

| Artifact                                                           | Action | Description                                         |
| ------------------------------------------------------------------ | ------ | --------------------------------------------------- |
| `packages/ui/src/components/checkbox/checkbox.tsx`                 | Create | Checkbox component implementation                   |
| `packages/ui/src/components/checkbox/checkbox.styles.ts`           | Create | CVA base class definition                           |
| `packages/ui/src/components/checkbox/checkbox.types.ts`            | Create | CheckboxProps type definition                       |
| `packages/ui/src/components/checkbox/checkbox.test.tsx`            | Create | Vitest + vitest-axe test suite                      |
| `packages/ui/src/components/checkbox/checkbox.stories.tsx`         | Create | Storybook CSF3 stories with autodocs                |
| `packages/ui/src/components/switch/switch.tsx`                     | Create | Switch component implementation                     |
| `packages/ui/src/components/switch/switch.styles.ts`               | Create | CVA base + thumb style definitions                  |
| `packages/ui/src/components/switch/switch.types.ts`                | Create | SwitchProps type definition                         |
| `packages/ui/src/components/switch/switch.test.tsx`                | Create | Vitest + vitest-axe test suite                      |
| `packages/ui/src/components/switch/switch.stories.tsx`             | Create | Storybook CSF3 stories with autodocs                |
| `packages/ui/src/components/radio-group/radio-group.tsx`           | Create | RadioGroup + RadioGroupItem implementation          |
| `packages/ui/src/components/radio-group/radio-group.styles.ts`     | Create | CVA base class definitions for group and item       |
| `packages/ui/src/components/radio-group/radio-group.types.ts`      | Create | RadioGroupProps + RadioGroupItemProps types         |
| `packages/ui/src/components/radio-group/radio-group.test.tsx`      | Create | Vitest + vitest-axe test suite                      |
| `packages/ui/src/components/radio-group/radio-group.stories.tsx`   | Create | Storybook CSF3 stories with autodocs                |
| `packages/ui/src/components/toggle/toggle.tsx`                     | Create | Toggle component implementation                     |
| `packages/ui/src/components/toggle/toggle.styles.ts`               | Create | CVA variant definitions (variant + size)            |
| `packages/ui/src/components/toggle/toggle.types.ts`                | Create | ToggleProps type definition with VariantProps       |
| `packages/ui/src/components/toggle/toggle.test.tsx`                | Create | Vitest + vitest-axe test suite                      |
| `packages/ui/src/components/toggle/toggle.stories.tsx`             | Create | Storybook CSF3 stories with autodocs                |
| `packages/ui/src/components/toggle-group/toggle-group.tsx`         | Create | ToggleGroup + ToggleGroupItem + context             |
| `packages/ui/src/components/toggle-group/toggle-group.styles.ts`   | Create | CVA base class definition for group container       |
| `packages/ui/src/components/toggle-group/toggle-group.types.ts`    | Create | Props + context types                               |
| `packages/ui/src/components/toggle-group/toggle-group.test.tsx`    | Create | Vitest + vitest-axe test suite                      |
| `packages/ui/src/components/toggle-group/toggle-group.stories.tsx` | Create | Storybook CSF3 stories with autodocs                |
| `packages/ui/src/components/select/select.tsx`                     | Create | Select compound component implementation            |
| `packages/ui/src/components/select/select.styles.ts`               | Create | Plain string style exports for sub-components       |
| `packages/ui/src/components/select/select.types.ts`                | Create | Type definitions for all sub-components             |
| `packages/ui/src/components/select/select.test.tsx`                | Create | Vitest + vitest-axe test suite                      |
| `packages/ui/src/components/select/select.stories.tsx`             | Create | Storybook CSF3 stories with autodocs                |
| `packages/ui/src/index.ts`                                         | Modify | Add exports for all 6 components and sub-components |
| `packages/ui/package.json`                                         | Modify | Add 6 Radix dependencies                            |
