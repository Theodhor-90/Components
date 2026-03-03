Now I have all the context I need. Let me produce the implementation plan.

# Task 3: Context Menu Component — Implementation Plan

## 1. Deliverables

| File | Purpose |
| --- | --- |
| `packages/ui/src/components/context-menu/context-menu.types.ts` | TypeScript prop types for all 14 sub-components, extending Radix context-menu primitive props + CVA `VariantProps` where applicable |
| `packages/ui/src/components/context-menu/context-menu.styles.ts` | CVA variant definitions for `ContextMenuItem` (variant + inset), `ContextMenuLabel` (inset), and plain string style constants for Content, CheckboxItem, RadioItem, Separator, SubTrigger, SubContent, Shortcut |
| `packages/ui/src/components/context-menu/context-menu.tsx` | Implementation wrapping `@radix-ui/react-context-menu` — exports 14 named sub-components plus re-exports of all types |
| `packages/ui/src/components/context-menu/context-menu.test.tsx` | Vitest + Testing Library + vitest-axe test suite covering smoke render, right-click opening, interactions, variants, keyboard, data-slots, and accessibility |
| `packages/ui/src/components/context-menu/context-menu.stories.tsx` | Storybook CSF3 stories with autodocs: Default, WithCheckboxItems, WithRadioGroup, WithSubMenu, WithShortcuts, WithInsetItems |
| `packages/ui/src/index.ts` (modified) | Add exports for all Context Menu sub-components, types, and CVA variant functions |

## 2. Dependencies

### Already Installed

- `@radix-ui/react-context-menu` — ^2.2.16, installed in task t01 (confirmed in `packages/ui/package.json`)
- `class-variance-authority` — ^0.7.1
- `@components/utils` — `cn()` helper

### Prior Milestones

- None directly required for Context Menu itself (no Dialog/Popover composition)

### Sibling Task Dependency

- **Task t02** (Dropdown Menu) — Use as the direct reference for consistent visual styling, API patterns, SVG icons, and test structure. Context Menu mirrors Dropdown Menu in every respect except the trigger mechanism (right-click vs. button click).

## 3. Implementation Details

### 3.1 `context-menu.types.ts`

**Purpose**: Define prop types for all 14 sub-components by extending Radix context-menu primitive component props.

**Exports** (all `export type`):
- `ContextMenuProps` — `React.ComponentProps<typeof ContextMenuPrimitive.Root>`
- `ContextMenuTriggerProps` — `React.ComponentProps<typeof ContextMenuPrimitive.Trigger>`
- `ContextMenuPortalProps` — `React.ComponentProps<typeof ContextMenuPrimitive.Portal>`
- `ContextMenuContentProps` — `React.ComponentProps<typeof ContextMenuPrimitive.Content>`
- `ContextMenuGroupProps` — `React.ComponentProps<typeof ContextMenuPrimitive.Group>`
- `ContextMenuItemProps` — `React.ComponentProps<typeof ContextMenuPrimitive.Item> & VariantProps<typeof contextMenuItemVariants>`
- `ContextMenuCheckboxItemProps` — `React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>`
- `ContextMenuRadioItemProps` — `React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>`
- `ContextMenuRadioGroupProps` — `React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>`
- `ContextMenuLabelProps` — `React.ComponentProps<typeof ContextMenuPrimitive.Label> & VariantProps<typeof contextMenuLabelVariants>`
- `ContextMenuSeparatorProps` — `React.ComponentProps<typeof ContextMenuPrimitive.Separator>`
- `ContextMenuSubProps` — `React.ComponentProps<typeof ContextMenuPrimitive.Sub>`
- `ContextMenuSubTriggerProps` — `React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & { inset?: boolean }`
- `ContextMenuSubContentProps` — `React.ComponentProps<typeof ContextMenuPrimitive.SubContent>`
- `ContextMenuShortcutProps` — `React.ComponentProps<'span'>`

**Pattern**: Mirrors `dropdown-menu.types.ts` exactly, substituting `ContextMenuPrimitive` for `DropdownMenuPrimitive` and `contextMenu*` style imports for `dropdownMenu*` style imports.

### 3.2 `context-menu.styles.ts`

**Purpose**: Define CVA variants and static style strings for all styled sub-components. Visually identical to Dropdown Menu styles.

**Exports**:
- `contextMenuContentStyles` (string) — `'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'`
- `contextMenuItemVariants` (CVA) — Base: `'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0'`. Variants: `variant: { default: '', destructive: 'text-destructive focus:bg-destructive/10 focus:text-destructive' }`, `inset: { true: 'pl-8', false: '' }`. Default variants: `{ variant: 'default', inset: false }`.
- `contextMenuCheckboxItemStyles` (string) — `'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'`
- `contextMenuRadioItemStyles` (string) — Same as checkbox item styles.
- `contextMenuLabelVariants` (CVA) — Base: `'px-2 py-1.5 text-sm font-semibold'`. Variants: `inset: { true: 'pl-8', false: '' }`. Default: `{ inset: false }`.
- `contextMenuSeparatorStyles` (string) — `'-mx-1 my-1 h-px bg-muted'`
- `contextMenuSubTriggerStyles` (string) — `'flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0'`
- `contextMenuSubContentStyles` (string) — `'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'`
- `contextMenuShortcutStyles` (string) — `'ml-auto text-xs tracking-widest opacity-60'`

### 3.3 `context-menu.tsx`

**Purpose**: Implement all sub-components wrapping `@radix-ui/react-context-menu`.

**Structure**: Mirrors `dropdown-menu.tsx` exactly in structure, with these substitutions:
- `import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'`
- All component names prefixed with `ContextMenu` instead of `DropdownMenu`
- All `data-slot` values prefixed with `context-menu-` instead of `dropdown-menu-`
- All style imports from `./context-menu.styles.js`
- All type imports from `./context-menu.types.js`

**Named Exports** (14 sub-components):
1. `ContextMenu` — Direct re-export of `ContextMenuPrimitive.Root`
2. `ContextMenuTrigger` — Wraps `ContextMenuPrimitive.Trigger` with `data-slot="context-menu-trigger"`, `cn(className)`
3. `ContextMenuPortal` — Direct re-export of `ContextMenuPrimitive.Portal`
4. `ContextMenuContent` — Wraps `ContextMenuPrimitive.Content` inside `ContextMenuPortal`, with `data-slot="context-menu-content"`, `sideOffset` default `4`, `cn(contextMenuContentStyles, className)` — **Note**: `alignOffset` defaults to `-4` for right-click positioning (matches shadcn/ui pattern)
5. `ContextMenuGroup` — Direct re-export of `ContextMenuPrimitive.Group`
6. `ContextMenuItem` — Wraps `ContextMenuPrimitive.Item` with `data-slot="context-menu-item"`, `cn(contextMenuItemVariants({ variant, inset, className }))`
7. `ContextMenuCheckboxItem` — Wraps `ContextMenuPrimitive.CheckboxItem` with `data-slot="context-menu-checkbox-item"`, renders checkmark SVG inside `ItemIndicator`
8. `ContextMenuRadioItem` — Wraps `ContextMenuPrimitive.RadioItem` with `data-slot="context-menu-radio-item"`, renders circle SVG inside `ItemIndicator`
9. `ContextMenuRadioGroup` — Direct re-export of `ContextMenuPrimitive.RadioGroup`
10. `ContextMenuLabel` — Wraps `ContextMenuPrimitive.Label` with `data-slot="context-menu-label"`, `cn(contextMenuLabelVariants({ inset, className }))`
11. `ContextMenuSeparator` — Wraps `ContextMenuPrimitive.Separator` with `data-slot="context-menu-separator"`, `cn(contextMenuSeparatorStyles, className)`
12. `ContextMenuSub` — Direct re-export of `ContextMenuPrimitive.Sub`
13. `ContextMenuSubTrigger` — Wraps `ContextMenuPrimitive.SubTrigger` with `data-slot="context-menu-sub-trigger"`, `inset` prop for `pl-8`, renders chevron-right SVG
14. `ContextMenuSubContent` — Wraps `ContextMenuPrimitive.SubContent` with `data-slot="context-menu-sub-content"`, `cn(contextMenuSubContentStyles, className)`

Additionally:
- `ContextMenuShortcut` — `<span>` component with `data-slot="context-menu-shortcut"` (not a Radix primitive, just a styled span — same as DropdownMenuShortcut)

**Type re-exports**: All 15 types re-exported with `export type { ... } from './context-menu.types.js'`.

**SVG icons**: Use the same checkmark, circle, and chevron-right SVGs as `dropdown-menu.tsx` (identical markup).

**Key differences from Dropdown Menu**:
- `ContextMenuContent`: Add `alignOffset={-4}` default (standard shadcn/ui context menu behavior for proper cursor-relative positioning)
- No other behavioral differences — Radix handles the right-click trigger mechanism internally via `ContextMenuPrimitive.Trigger`

### 3.4 `context-menu.test.tsx`

**Purpose**: Comprehensive test suite matching the Dropdown Menu test structure but adapted for right-click trigger behavior.

**Test setup**: Include the same `beforeAll` polyfills as `dropdown-menu.test.tsx` for pointer capture, scroll into view.

**Helper components**:
- `TestContextMenu` — Basic context menu with trigger area, label, separator, and items (Edit, Copy, Delete with destructive variant). Accepts `onSelect`, `itemClassName`, `contentClassName` props.
- `TestContextMenuFull` — Full-featured context menu with inset label, inset item, shortcut, checkbox item, radio group, sub-menu, and destructive item. Accepts `onCheckedChange` and `onValueChange` props.

**Test specifications** (19 tests in `describe('ContextMenu')`):

1. **`renders trigger area`** — Render `TestContextMenu`, assert trigger element is in the document
2. **`opens on right-click`** — `user.pointer({ target: trigger, keys: '[MouseRight]' })` then assert `screen.getByRole('menu')` is present
3. **`item selection fires onSelect`** — Right-click to open, click "Edit" item, assert `onSelect` called once
4. **`closes after item selection`** — Right-click to open, click "Edit", assert menu is no longer in document
5. **`keyboard navigation with arrow keys`** — Right-click to open, use `ArrowDown` to navigate between items, assert focus moves correctly
6. **`keyboard Enter selects focused item`** — Right-click to open, arrow down to "Edit", press Enter, assert `onSelect` called
7. **`closes on Escape`** — Right-click to open, press Escape, assert menu is gone
8. **`checkbox item toggles checked state`** — Right-click to open full menu, click checkbox item, assert `onCheckedChange` called with `true`
9. **`radio item group exclusivity`** — Right-click to open full menu, click radio item "Dark", assert `onValueChange` called with `'dark'`
10. **`sub-menu renders on hover`** — Right-click to open, hover "More" sub-trigger, assert "Sub Item" appears
11. **`sub-menu renders with keyboard navigation`** — Right-click to open, arrow down to "More", press ArrowRight, assert "Sub Item" appears
12. **`inset variant adds padding`** — Render with `open` prop, assert inset item has `pl-8` class
13. **`destructive variant applies correct styles`** — Render with `open` prop, assert destructive item has `text-destructive` class
14. **`data-slot on trigger`** — Assert `[data-slot="context-menu-trigger"]` exists
15. **`data-slot on content`** — Right-click to open, assert `[data-slot="context-menu-content"]` exists
16. **`data-slot on item`** — Right-click to open, assert `[data-slot="context-menu-item"]` exists
17. **`data-slot on separator`** — Right-click to open, assert `[data-slot="context-menu-separator"]` exists
18. **`data-slot on label`** — Right-click to open, assert `[data-slot="context-menu-label"]` exists
19. **`has no accessibility violations`** — Right-click to open, run `axe(container)`, assert no violations

**Right-click simulation**: Use `await user.pointer({ target: triggerElement, keys: '[MouseRight]' })` from `@testing-library/user-event` to simulate the `contextmenu` event. If this does not trigger the Radix context menu (which may require a native `contextmenu` event), fall back to `fireEvent.contextMenu(triggerElement)` from `@testing-library/react` for the trigger, while keeping all other interactions on `userEvent`. Verify the correct approach by checking what `@radix-ui/react-context-menu` responds to in jsdom (it typically listens for the `contextmenu` DOM event).

### 3.5 `context-menu.stories.tsx`

**Purpose**: Storybook CSF3 stories with autodocs covering all features.

**Meta**:
```typescript
const meta: Meta<typeof ContextMenu> = {
  title: 'Components/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
};
```

**Stories** (6):

1. **`Default`** — Basic context menu with a right-click trigger area (styled div with dashed border and "Right-click here" text), containing items: Edit, Copy, Separator, Archive.

2. **`WithCheckboxItems`** — Stateful story using a render function wrapper. Trigger area with 3 checkbox items (Status Bar, Activity Bar, Panel) toggling local state. Same pattern as `WithCheckboxItemsDemo` in dropdown-menu stories.

3. **`WithRadioGroup`** — Stateful story with a radio group for panel position (Top, Bottom, Right). Same pattern as `WithRadioGroupDemo` in dropdown-menu stories.

4. **`WithSubMenu`** — Context menu with a sub-menu: main items (New Tab) + Sub (Share → Email, Messages, Copy Link).

5. **`WithShortcuts`** — Context menu items with `ContextMenuShortcut` children: Cut (⌘X), Copy (⌘C), Paste (⌘V).

6. **`WithInsetItems`** — Context menu with `inset` label and `inset` items: "My Account" label + Profile, Billing, Settings items.

**Trigger area pattern**: All stories use a styled `<div>` as the trigger since context menus don't have a button trigger:
```tsx
<ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
  Right-click here
</ContextMenuTrigger>
```

### 3.6 `index.ts` Modification

Append after the Dropdown Menu export block:

```typescript
export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuRadioGroup,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuPortal,
  ContextMenuShortcut,
  type ContextMenuProps,
  type ContextMenuTriggerProps,
  type ContextMenuContentProps,
  type ContextMenuItemProps,
  type ContextMenuCheckboxItemProps,
  type ContextMenuRadioItemProps,
  type ContextMenuRadioGroupProps,
  type ContextMenuGroupProps,
  type ContextMenuLabelProps,
  type ContextMenuSeparatorProps,
  type ContextMenuSubProps,
  type ContextMenuSubTriggerProps,
  type ContextMenuSubContentProps,
  type ContextMenuPortalProps,
  type ContextMenuShortcutProps,
} from './components/context-menu/context-menu.js';
export {
  contextMenuItemVariants,
  contextMenuLabelVariants,
} from './components/context-menu/context-menu.styles.js';
```

## 4. API Contracts

### ContextMenuItem

```tsx
// Default variant
<ContextMenuItem>Edit</ContextMenuItem>

// Destructive variant
<ContextMenuItem variant="destructive">Delete</ContextMenuItem>

// Inset (aligns with items that have icons)
<ContextMenuItem inset>Profile</ContextMenuItem>

// With shortcut
<ContextMenuItem>
  Copy
  <ContextMenuShortcut>⌘C</ContextMenuShortcut>
</ContextMenuItem>
```

### ContextMenuCheckboxItem

```tsx
<ContextMenuCheckboxItem checked={isChecked} onCheckedChange={setIsChecked}>
  Show Toolbar
</ContextMenuCheckboxItem>
```

### ContextMenuRadioGroup + ContextMenuRadioItem

```tsx
<ContextMenuRadioGroup value={value} onValueChange={setValue}>
  <ContextMenuRadioItem value="light">Light</ContextMenuRadioItem>
  <ContextMenuRadioItem value="dark">Dark</ContextMenuRadioItem>
</ContextMenuRadioGroup>
```

### ContextMenuLabel

```tsx
<ContextMenuLabel>Section Title</ContextMenuLabel>
<ContextMenuLabel inset>Indented Title</ContextMenuLabel>
```

### ContextMenuSub (nested sub-menu)

```tsx
<ContextMenuSub>
  <ContextMenuSubTrigger>Share</ContextMenuSubTrigger>
  <ContextMenuSubContent>
    <ContextMenuItem>Email</ContextMenuItem>
    <ContextMenuItem>Messages</ContextMenuItem>
  </ContextMenuSubContent>
</ContextMenuSub>
```

### Full composition

```tsx
<ContextMenu>
  <ContextMenuTrigger className="...">Right-click here</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuLabel>Options</ContextMenuLabel>
    <ContextMenuSeparator />
    <ContextMenuItem>Edit</ContextMenuItem>
    <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

### CVA Variant Exports

```typescript
import { contextMenuItemVariants, contextMenuLabelVariants } from '@components/ui';

// Can be used for custom composition:
const classes = contextMenuItemVariants({ variant: 'destructive', inset: true });
```

## 5. Test Plan

### Test Setup

- **Framework**: Vitest + @testing-library/react + @testing-library/user-event + vitest-axe
- **Import style**: `import { describe, expect, it, vi, beforeAll } from 'vitest'`
- **Polyfills** (in `beforeAll`): `Element.prototype.hasPointerCapture`, `Element.prototype.setPointerCapture`, `Element.prototype.releasePointerCapture`, `Element.prototype.scrollIntoView` — same as dropdown-menu tests
- **Right-click simulation**: Use `fireEvent.contextMenu(triggerElement)` since Radix context-menu listens for the native `contextmenu` event, which `userEvent.pointer` may not reliably trigger in jsdom. After opening, use `userEvent` for all subsequent interactions.

### Test Matrix

| # | Test Name | Category | Setup | Assertion |
| --- | --- | --- | --- | --- |
| 1 | renders trigger area | Smoke | Render `TestContextMenu` | Trigger text "Right-click here" is in document |
| 2 | opens on right-click | Interaction | `fireEvent.contextMenu` on trigger | `screen.getByRole('menu')` present |
| 3 | item selection fires onSelect | Interaction | Open → click "Edit" | `onSelect` called once |
| 4 | closes after item selection | Interaction | Open → click "Edit" → waitFor | Menu no longer in document |
| 5 | keyboard navigation with arrow keys | Keyboard | Open → ArrowDown repeatedly | Focus moves between items |
| 6 | keyboard Enter selects focused item | Keyboard | Open → ArrowDown to "Edit" → Enter | `onSelect` called once |
| 7 | closes on Escape | Keyboard | Open → Escape | Menu gone |
| 8 | checkbox item toggles | Interaction | Open full menu → click checkbox | `onCheckedChange(true)` called |
| 9 | radio group exclusivity | Interaction | Open full menu → click "Dark" radio | `onValueChange('dark')` called |
| 10 | sub-menu on hover | Interaction | Open → hover "More" → findByRole | "Sub Item" present |
| 11 | sub-menu with keyboard | Keyboard | Open → ArrowDown to "More" → ArrowRight | "Sub Item" present |
| 12 | inset variant adds padding | Variant | Render open menu with `inset` item | Item has `pl-8` class |
| 13 | destructive variant styles | Variant | Render open menu with destructive item | Item has `text-destructive` class |
| 14 | data-slot on trigger | Data-slot | Render | `[data-slot="context-menu-trigger"]` present |
| 15 | data-slot on content | Data-slot | Open | `[data-slot="context-menu-content"]` present |
| 16 | data-slot on item | Data-slot | Open | `[data-slot="context-menu-item"]` present |
| 17 | data-slot on separator | Data-slot | Open | `[data-slot="context-menu-separator"]` present |
| 18 | data-slot on label | Data-slot | Open | `[data-slot="context-menu-label"]` present |
| 19 | has no a11y violations | Accessibility | Open → `axe(container)` | No violations |

### Opening the menu in tests

For tests that need the menu open, a helper `openContextMenu` function should be defined:
```typescript
async function openContextMenu(): Promise<void> {
  const trigger = screen.getByText('Right-click here');
  fireEvent.contextMenu(trigger);
  await screen.findByRole('menu');
}
```

For variant tests (inset, destructive) that need the menu rendered open without interaction, consider using the Radix `open` prop pattern — but note that `@radix-ui/react-context-menu` does not support a direct `open` prop on the Root. Instead, use `fireEvent.contextMenu` to open the menu in those tests as well.

## 6. Implementation Order

1. **`context-menu.styles.ts`** — Create CVA variant definitions and style constants. No dependencies on other new files.

2. **`context-menu.types.ts`** — Create all prop type definitions. Imports `contextMenuItemVariants` and `contextMenuLabelVariants` from styles file.

3. **`context-menu.tsx`** — Implement all 14 sub-components + ContextMenuShortcut. Imports from both styles and types files.

4. **`context-menu.test.tsx`** — Write full test suite. Imports from implementation file and types file.

5. **`context-menu.stories.tsx`** — Write all 6 Storybook stories. Imports from implementation file.

6. **`packages/ui/src/index.ts`** — Add export block for all Context Menu sub-components, types, and CVA variant functions.

## 7. Verification Commands

```bash
# Run context-menu tests only
pnpm --filter @components/ui test -- --testPathPattern="context-menu"

# Type-check the entire monorepo
pnpm typecheck

# Run all tests across the monorepo
pnpm test

# Build the ui package to verify exports compile
pnpm --filter @components/ui build

# Verify the context-menu exports are accessible
node -e "import('@components/ui').then(m => console.log(Object.keys(m).filter(k => k.includes('ContextMenu')).join('\n')))"
```

## 8. Design Deviations

### ContextMenuContent `alignOffset` default

- **Parent spec requires**: No specific mention of `alignOffset` — just says "Same implementation approach as Dropdown Menu but using the context-menu Radix primitive"
- **Why deviation is needed**: The shadcn/ui reference implementation for context menu uses `alignOffset={-4}` on `ContextMenuContent` to ensure the menu appears properly positioned relative to the right-click cursor position. Without this, the menu may appear offset from where the user right-clicked. Dropdown Menu uses only `sideOffset={4}` because it positions relative to a trigger button, but context menus position relative to cursor coordinates.
- **Alternative chosen**: Add `alignOffset = -4` as a destructured default prop on `ContextMenuContent`, in addition to `sideOffset = 4`. This matches the shadcn/ui context-menu reference and provides correct cursor-relative positioning out of the box while remaining overridable by consumers.