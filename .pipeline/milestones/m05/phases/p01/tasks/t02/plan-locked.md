I now have all the context I need. Let me produce the detailed implementation plan.

# Task 2: Dropdown Menu Component — Implementation Plan

## 1. Deliverables

| File | Purpose |
| --- | --- |
| `packages/ui/src/components/dropdown-menu/dropdown-menu.types.ts` | TypeScript prop types for all 14 sub-components, extending Radix dropdown-menu primitive props + CVA `VariantProps` where applicable |
| `packages/ui/src/components/dropdown-menu/dropdown-menu.styles.ts` | CVA variant definitions for `DropdownMenuItem` (variant + inset), `DropdownMenuLabel` (inset), and plain string style constants for Content, CheckboxItem, RadioItem, Separator, SubTrigger, Shortcut |
| `packages/ui/src/components/dropdown-menu/dropdown-menu.tsx` | Implementation wrapping `@radix-ui/react-dropdown-menu` — exports 14 named sub-components plus re-exports of all types |
| `packages/ui/src/components/dropdown-menu/dropdown-menu.test.tsx` | Vitest + Testing Library + vitest-axe test suite covering smoke render, interactions, variants, keyboard, data-slots, and accessibility |
| `packages/ui/src/components/dropdown-menu/dropdown-menu.stories.tsx` | Storybook CSF3 stories with autodocs: Default, WithCheckboxItems, WithRadioGroup, WithSubMenu, WithShortcuts, WithInsetItems, Destructive |
| `packages/ui/src/index.ts` (modified) | Add exports for all Dropdown Menu sub-components, types, and CVA variant functions |

## 2. Dependencies

### Already Installed (by t01)

- `@radix-ui/react-dropdown-menu` — `^2.1.11` in `packages/ui/package.json`

### Already Available

- `class-variance-authority` — CVA for variant management
- `@components/utils` — `cn()` helper via `../../lib/utils.js`
- `@radix-ui/react-slot` — for `asChild` (used transitively by Radix)
- Vitest + `@testing-library/react` + `@testing-library/user-event` + `vitest-axe`
- Storybook 8.5 with `@storybook/react-vite`

### No New Installs Required

## 3. Implementation Details

### 3.1 `dropdown-menu.types.ts`

**Purpose:** Define prop types for all sub-components.

**Exports (all `export type`):**

```typescript
import type * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import type { VariantProps } from 'class-variance-authority';
import type { dropdownMenuItemVariants, dropdownMenuLabelVariants } from './dropdown-menu.styles.js';

export type DropdownMenuProps = React.ComponentProps<typeof DropdownMenuPrimitive.Root>;
export type DropdownMenuTriggerProps = React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>;
export type DropdownMenuPortalProps = React.ComponentProps<typeof DropdownMenuPrimitive.Portal>;
export type DropdownMenuContentProps = React.ComponentProps<typeof DropdownMenuPrimitive.Content>;
export type DropdownMenuGroupProps = React.ComponentProps<typeof DropdownMenuPrimitive.Group>;
export type DropdownMenuItemProps = React.ComponentProps<typeof DropdownMenuPrimitive.Item> &
  VariantProps<typeof dropdownMenuItemVariants>;
export type DropdownMenuCheckboxItemProps = React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>;
export type DropdownMenuRadioItemProps = React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>;
export type DropdownMenuRadioGroupProps = React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>;
export type DropdownMenuLabelProps = React.ComponentProps<typeof DropdownMenuPrimitive.Label> &
  VariantProps<typeof dropdownMenuLabelVariants>;
export type DropdownMenuSeparatorProps = React.ComponentProps<typeof DropdownMenuPrimitive.Separator>;
export type DropdownMenuSubProps = React.ComponentProps<typeof DropdownMenuPrimitive.Sub>;
export type DropdownMenuSubTriggerProps = React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
};
export type DropdownMenuSubContentProps = React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>;
export type DropdownMenuShortcutProps = React.ComponentProps<'span'>;
```

**Key patterns:**
- Follows the `import type * as Primitive` pattern from dialog and select
- `DropdownMenuItemProps` and `DropdownMenuLabelProps` extend with CVA `VariantProps` for `variant`/`inset`
- `DropdownMenuSubTriggerProps` adds `inset?: boolean` as a simple prop (not CVA since it has no variant axis)
- `DropdownMenuShortcutProps` extends `React.ComponentProps<'span'>` since it wraps a native `<span>`

### 3.2 `dropdown-menu.styles.ts`

**Purpose:** CVA variant definitions and plain style string constants.

**Exports:**

1. **`dropdownMenuContentStyles`** (plain string constant):
   ```
   z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md
   data-[state=open]:animate-in data-[state=closed]:animate-out
   data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
   data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
   data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
   data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2
   ```

2. **`dropdownMenuItemVariants`** (CVA):
   - Base: `relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0`
   - `variant`: `{ default: '' (no extra), destructive: 'text-destructive focus:bg-destructive/10 focus:text-destructive' }`
   - `inset`: `{ true: 'pl-8', false: '' }`
   - `defaultVariants`: `{ variant: 'default', inset: false }`

3. **`dropdownMenuCheckboxItemStyles`** (plain string constant):
   ```
   relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50
   ```

4. **`dropdownMenuRadioItemStyles`** (plain string constant):
   ```
   relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50
   ```

5. **`dropdownMenuLabelVariants`** (CVA):
   - Base: `px-2 py-1.5 text-sm font-semibold`
   - `inset`: `{ true: 'pl-8', false: '' }`
   - `defaultVariants`: `{ inset: false }`

6. **`dropdownMenuSeparatorStyles`** (plain string constant):
   ```
   -mx-1 my-1 h-px bg-muted
   ```

7. **`dropdownMenuSubTriggerStyles`** (plain string constant):
   ```
   flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0
   ```

8. **`dropdownMenuSubContentStyles`** (plain string constant):
   ```
   z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg
   data-[state=open]:animate-in data-[state=closed]:animate-out
   data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
   data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
   data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
   data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2
   ```

9. **`dropdownMenuShortcutStyles`** (plain string constant):
   ```
   ml-auto text-xs tracking-widest opacity-60
   ```

**Rationale for mixed CVA/string approach:** Only `DropdownMenuItem` and `DropdownMenuLabel` have variant axes. Other sub-components have a single fixed style, so plain string constants (matching the dialog, popover, and alert patterns) are more appropriate than single-variant CVA calls.

### 3.3 `dropdown-menu.tsx`

**Purpose:** Component implementations wrapping `@radix-ui/react-dropdown-menu`.

**Pattern:** Follows dialog.tsx exactly — `import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'`.

**Sub-components (14 named exports):**

1. **`DropdownMenu`** — Direct re-export of `DropdownMenuPrimitive.Root`
2. **`DropdownMenuTrigger`** — Wraps `DropdownMenuPrimitive.Trigger` with `data-slot="dropdown-menu-trigger"`, passes `className` and `ref`
3. **`DropdownMenuPortal`** — Direct re-export of `DropdownMenuPrimitive.Portal`
4. **`DropdownMenuContent`** — Wraps `DropdownMenuPrimitive.Content` inside `DropdownMenuPrimitive.Portal`. Sets `data-slot="dropdown-menu-content"`, `sideOffset={4}` default, merges `dropdownMenuContentStyles` with `className` via `cn()`
5. **`DropdownMenuGroup`** — Direct re-export of `DropdownMenuPrimitive.Group`
6. **`DropdownMenuItem`** — Wraps `DropdownMenuPrimitive.Item` with `data-slot="dropdown-menu-item"`. Destructures `variant`, `inset`, `className` from props. Passes `cn(dropdownMenuItemVariants({ variant, inset, className }))` as className
7. **`DropdownMenuCheckboxItem`** — Wraps `DropdownMenuPrimitive.CheckboxItem` with `data-slot="dropdown-menu-checkbox-item"`. Renders a `<span>` indicator container (absolute left-2) wrapping `DropdownMenuPrimitive.ItemIndicator` with an inline SVG checkmark icon. Children rendered after indicator
8. **`DropdownMenuRadioItem`** — Wraps `DropdownMenuPrimitive.RadioItem` with `data-slot="dropdown-menu-radio-item"`. Same indicator pattern but with a filled circle SVG icon
9. **`DropdownMenuRadioGroup`** — Direct re-export of `DropdownMenuPrimitive.RadioGroup`
10. **`DropdownMenuLabel`** — Wraps `DropdownMenuPrimitive.Label` with `data-slot="dropdown-menu-label"`. Destructures `inset`, `className`. Passes `cn(dropdownMenuLabelVariants({ inset, className }))`
11. **`DropdownMenuSeparator`** — Wraps `DropdownMenuPrimitive.Separator` with `data-slot="dropdown-menu-separator"`. Merges `dropdownMenuSeparatorStyles` with `className`
12. **`DropdownMenuSub`** — Direct re-export of `DropdownMenuPrimitive.Sub`
13. **`DropdownMenuSubTrigger`** — Wraps `DropdownMenuPrimitive.SubTrigger` with `data-slot="dropdown-menu-sub-trigger"`. Destructures `inset`, `className`, `children`. Merges `dropdownMenuSubTriggerStyles` + conditional `'pl-8'` for inset. Appends an inline SVG chevron-right icon after `children`
14. **`DropdownMenuSubContent`** — Wraps `DropdownMenuPrimitive.SubContent` with `data-slot="dropdown-menu-sub-content"`. Merges `dropdownMenuSubContentStyles` with `className`
15. **`DropdownMenuShortcut`** — Simple `<span>` with `data-slot="dropdown-menu-shortcut"`. Merges `dropdownMenuShortcutStyles` with `className`. This is a purely presentational component (not a Radix primitive)

**SVG icons:** All SVG icons are inline (no icon library dependency), rendered as `<svg>` elements with `xmlns`, `width="15"`, `height="15"`, `viewBox="0 0 15 15"`, `fill="none"`, consistent with the select and dialog component patterns in the codebase.

- **Checkmark** (for CheckboxItem indicator): Same path as used in select item
- **Circle** (for RadioItem indicator): Small filled circle (`<circle cx="7.5" cy="7.5" r="3.5" fill="currentColor" />`)
- **Chevron right** (for SubTrigger): Right-pointing chevron path

**Type re-exports:** All types from `.types.js` are re-exported as `export type { ... }`.

### 3.4 `dropdown-menu.test.tsx`

**Purpose:** Comprehensive test suite for the Dropdown Menu component.

**Test helper `beforeAll`:**
- Stub `Element.prototype.hasPointerCapture`, `setPointerCapture`, `releasePointerCapture` if missing (matching select.test.tsx pattern, though also covered by test-setup.ts)

**Test helper `TestDropdownMenu`:**
- Renders a `DropdownMenu` with a `DropdownMenuTrigger` button labeled "Actions", a `DropdownMenuContent` with a few `DropdownMenuItem` entries, configurable via props

**Test helper `TestDropdownMenuFull`:**
- Full-featured dropdown with checkbox items, radio group, sub-menu, shortcuts, inset items, and destructive item — used by specific test scenarios

**Test cases (described by `describe`/`it` blocks):**

1. **`renders trigger button`** — Smoke render, confirm button with name "Actions" is in the document
2. **`opens on trigger click`** — Click trigger, assert menu role is present
3. **`item selection fires onSelect`** — Click trigger, click a menu item, assert `onSelect` callback was called
4. **`closes after item selection`** — Click trigger, click item, waitFor menu to disappear
5. **`keyboard navigation with arrow keys`** — Click trigger, press ArrowDown, verify focus moves between items
6. **`closes on Escape`** — Click trigger, press Escape, waitFor menu to disappear
7. **`checkbox item toggles checked state`** — Render with `DropdownMenuCheckboxItem`, click to toggle, verify `onCheckedChange` called
8. **`radio item group exclusivity`** — Render with `DropdownMenuRadioGroup` + `DropdownMenuRadioItem`, select one, verify `onValueChange` called
9. **`sub-menu renders on hover/focus`** — Render with `DropdownMenuSub` + `DropdownMenuSubTrigger` + `DropdownMenuSubContent`, hover sub-trigger or use keyboard, verify sub-content appears
10. **`inset variant adds padding`** — Render `DropdownMenuItem` with `inset` prop, check for `pl-8` class
11. **`destructive variant applies correct styles`** — Render `DropdownMenuItem` with `variant="destructive"`, check for `text-destructive` class
12. **`data-slot attributes present`** — Verify `data-slot` on trigger, content, item, separator, label (after opening)
13. **`merges custom className`** — Pass custom className to `DropdownMenuContent`, verify it's applied
14. **`has no accessibility violations`** — Render open dropdown, run `axe()`, assert `toHaveNoViolations()`

### 3.5 `dropdown-menu.stories.tsx`

**Purpose:** Storybook CSF3 stories demonstrating all features.

**Meta:**
```typescript
const meta: Meta<typeof DropdownMenu> = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
};
```

**Stories:**

1. **`Default`** — Basic dropdown with 3 menu items and a separator. Trigger uses `<Button variant="outline">` via asChild
2. **`WithCheckboxItems`** — Dropdown with 3 checkbox items showing toggled/untoggled state. Uses `useState` for checked state management
3. **`WithRadioGroup`** — Dropdown with a radio group of 3 options. Uses `useState` for selected value
4. **`WithSubMenu`** — Dropdown that includes a `DropdownMenuSub` with nested sub-menu items
5. **`WithShortcuts`** — Dropdown items with `DropdownMenuShortcut` showing keyboard shortcut labels (e.g., "⌘C", "⌘V")
6. **`WithInsetItems`** — Dropdown with `inset` label and `inset` items to demonstrate alignment
7. **`Destructive`** — Dropdown with a destructive menu item (e.g., "Delete") using `variant="destructive"`

### 3.6 `packages/ui/src/index.ts` (modification)

**Add the following export block** after the existing SearchInput exports:

```typescript
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuShortcut,
  type DropdownMenuProps,
  type DropdownMenuTriggerProps,
  type DropdownMenuContentProps,
  type DropdownMenuItemProps,
  type DropdownMenuCheckboxItemProps,
  type DropdownMenuRadioItemProps,
  type DropdownMenuRadioGroupProps,
  type DropdownMenuGroupProps,
  type DropdownMenuLabelProps,
  type DropdownMenuSeparatorProps,
  type DropdownMenuSubProps,
  type DropdownMenuSubTriggerProps,
  type DropdownMenuSubContentProps,
  type DropdownMenuPortalProps,
  type DropdownMenuShortcutProps,
} from './components/dropdown-menu/dropdown-menu.js';
export {
  dropdownMenuItemVariants,
  dropdownMenuLabelVariants,
} from './components/dropdown-menu/dropdown-menu.styles.js';
```

## 4. API Contracts

### Consumer Usage — Basic Dropdown

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@components/ui';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Actions</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onSelect={() => console.log('edit')}>Edit</DropdownMenuItem>
    <DropdownMenuItem onSelect={() => console.log('copy')}>Copy</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive" onSelect={() => console.log('delete')}>
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Consumer Usage — Checkbox Items

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@components/ui';

const [showToolbar, setShowToolbar] = useState(true);

<DropdownMenu>
  <DropdownMenuTrigger>View</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuCheckboxItem checked={showToolbar} onCheckedChange={setShowToolbar}>
      Show Toolbar
    </DropdownMenuCheckboxItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Consumer Usage — Radio Group

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
} from '@components/ui';

const [theme, setTheme] = useState('system');

<DropdownMenu>
  <DropdownMenuTrigger>Theme</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Appearance</DropdownMenuLabel>
    <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
      <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
  </DropdownMenuContent>
</DropdownMenu>
```

### CVA Variant Props

**`DropdownMenuItem`:**
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'destructive'` | `'default'` | Visual style — destructive uses `text-destructive` |
| `inset` | `boolean` | `false` | Adds `pl-8` left padding for icon alignment |

**`DropdownMenuLabel`:**
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `inset` | `boolean` | `false` | Adds `pl-8` left padding for alignment with inset items |

**`DropdownMenuSubTrigger`:**
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `inset` | `boolean` | `false` | Adds `pl-8` left padding for alignment |

**`DropdownMenuContent`:**
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `sideOffset` | `number` | `4` | Pixel offset from the trigger |
| `align` | `'start' \| 'center' \| 'end'` | (Radix default) | Horizontal alignment relative to trigger |

## 5. Test Plan

### Test Setup

- **Environment:** jsdom (configured in `vitest.config.ts`)
- **Global setup:** `test-setup.ts` handles `@testing-library/jest-dom/vitest`, `vitest-axe/matchers`, `ResizeObserver` stub, and pointer capture stubs
- **User events:** `@testing-library/user-event` via `userEvent.setup()` for all interaction tests

### Test Helpers

**`TestDropdownMenu` component:**
```typescript
function TestDropdownMenu({
  onSelect,
  itemClassName,
  contentClassName,
}: {
  onSelect?: () => void;
  itemClassName?: string;
  contentClassName?: string;
}): React.JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
      <DropdownMenuContent className={contentClassName}>
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className={itemClassName} onSelect={onSelect}>Edit</DropdownMenuItem>
        <DropdownMenuItem>Copy</DropdownMenuItem>
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### Per-Test Specification

| # | Test Name | Setup | Action | Assertion |
| --- | --- | --- | --- | --- |
| 1 | renders trigger button | `render(<TestDropdownMenu />)` | None | `screen.getByRole('button', { name: 'Actions' })` is in document |
| 2 | opens on trigger click | `render(<TestDropdownMenu />)` | `user.click(trigger)` | `screen.getByRole('menu')` is in document |
| 3 | item onSelect fires | `render(<TestDropdownMenu onSelect={vi.fn()} />)` | Click trigger, click "Edit" menuitem | `onSelect` called once |
| 4 | closes after item selection | `render(<TestDropdownMenu />)` | Click trigger, click "Edit" | `waitFor(() => queryByRole('menu') not in document)` |
| 5 | keyboard arrow navigation | `render(<TestDropdownMenu />)` | Click trigger, press `ArrowDown` | Focus moves to next menuitem |
| 6 | closes on Escape | `render(<TestDropdownMenu />)` | Click trigger, press `Escape` | `waitFor(() => queryByRole('menu') not in document)` |
| 7 | checkbox item toggles | Render with `DropdownMenuCheckboxItem` | Click trigger, click checkbox item | `onCheckedChange` called with toggled value |
| 8 | radio group exclusivity | Render with `DropdownMenuRadioGroup` + items | Click trigger, select radio item | `onValueChange` called with selected value |
| 9 | sub-menu opens | Render with `DropdownMenuSub` | Click trigger, hover/focus sub-trigger | Sub-content appears in document |
| 10 | inset variant adds pl-8 | `render(<DropdownMenu open><DropdownMenuContent><DropdownMenuItem inset>Item</DropdownMenuItem></DropdownMenuContent></DropdownMenu>)` | None | Item element has class `pl-8` |
| 11 | destructive variant styling | `render(...)` with `variant="destructive"` | None | Item element has class `text-destructive` |
| 12 | data-slot on trigger | `render(<TestDropdownMenu />)` | None | `querySelector('[data-slot="dropdown-menu-trigger"]')` is in document |
| 13 | data-slot on content | `render(<TestDropdownMenu />)` | Click trigger | `querySelector('[data-slot="dropdown-menu-content"]')` is in document |
| 14 | data-slot on item | `render(<TestDropdownMenu />)` | Click trigger | `querySelector('[data-slot="dropdown-menu-item"]')` is in document |
| 15 | data-slot on separator | `render(<TestDropdownMenu />)` | Click trigger | `querySelector('[data-slot="dropdown-menu-separator"]')` is in document |
| 16 | data-slot on label | `render(<TestDropdownMenu />)` | Click trigger | `querySelector('[data-slot="dropdown-menu-label"]')` is in document |
| 17 | merges custom className on content | `render(<TestDropdownMenu contentClassName="custom-class" />)` | Click trigger | Content element has class `custom-class` |
| 18 | has no accessibility violations | `render(<TestDropdownMenu />)`, click to open | `axe(container)` | `toHaveNoViolations()` |

## 6. Implementation Order

1. **Create `dropdown-menu.styles.ts`** — Define all CVA variants and style constants first. These have no dependencies on other component files.

2. **Create `dropdown-menu.types.ts`** — Define all prop types. Depends on styles file for CVA `VariantProps` references.

3. **Create `dropdown-menu.tsx`** — Implement all 14 sub-components. Depends on types and styles files. Import Radix primitives, `cn()`, styles, and types. Re-export all types.

4. **Update `packages/ui/src/index.ts`** — Add all exports for the new component. Required before tests can verify import paths.

5. **Create `dropdown-menu.test.tsx`** — Write the complete test suite. Depends on the implementation being complete.

6. **Create `dropdown-menu.stories.tsx`** — Write all 7 Storybook stories. Depends on the implementation being complete.

7. **Run verification commands** — Ensure typecheck, tests, and build all pass.

## 7. Verification Commands

```bash
# Run typecheck across the monorepo
pnpm typecheck

# Run all tests (includes new dropdown-menu tests)
pnpm test

# Run only the dropdown-menu test file
pnpm --filter @components/ui test -- src/components/dropdown-menu/dropdown-menu.test.tsx

# Build all packages to verify ESM output
pnpm build

# Verify the new exports are accessible
node -e "import('@components/ui').then(m => { const keys = ['DropdownMenu','DropdownMenuTrigger','DropdownMenuContent','DropdownMenuItem','DropdownMenuCheckboxItem','DropdownMenuRadioItem','DropdownMenuRadioGroup','DropdownMenuLabel','DropdownMenuSeparator','DropdownMenuSub','DropdownMenuSubTrigger','DropdownMenuSubContent','DropdownMenuPortal','DropdownMenuShortcut','dropdownMenuItemVariants','dropdownMenuLabelVariants']; const missing = keys.filter(k => !(k in m)); if (missing.length) { console.error('Missing exports:', missing); process.exit(1); } console.log('All exports verified'); })"

# Lint the new files
pnpm lint
```

## 8. Design Deviations

### Deviation 1: Mixed CVA and plain string constants in styles file

**Parent spec requires:** CVA definitions for all sub-components (Content, Item, CheckboxItem, RadioItem, Label, Separator, SubTrigger).

**Why this is problematic:** Most sub-components (Content, CheckboxItem, RadioItem, Separator, SubTrigger, SubContent, Shortcut) have no variant axes — they have a single fixed style string. Wrapping single-style strings in `cva()` calls adds runtime overhead and API complexity for no benefit. The existing codebase already uses plain string constants for single-style sub-components (see `dialog.styles.ts` with `dialogOverlayStyles`, `dialogContentStyles`, etc. and `alert.styles.ts` with `alertTitleStyles`, `alertDescriptionStyles`).

**Alternative chosen:** Use CVA only for `DropdownMenuItem` (which has `variant` and `inset` axes) and `DropdownMenuLabel` (which has `inset` axis). All other sub-components use plain exported string constants, following the established patterns in `dialog.styles.ts` and `alert.styles.ts`. This keeps the styles file consistent with the rest of the codebase.

### Deviation 2: `DropdownMenuGroup` as direct re-export

**Parent spec requires:** `DropdownMenuGroup` is not explicitly listed in the deliverables sub-component list (the task spec lists 14 sub-components but doesn't include Group).

**Why deviation is needed:** The shadcn/ui Dropdown Menu exports `DropdownMenuGroup` as a direct re-export of the Radix primitive. It is needed for grouping related items (e.g., grouping items that share a label). Omitting it would make the component incomplete relative to the shadcn reference and limit the API.

**Alternative chosen:** Include `DropdownMenuGroup` as a direct re-export of `DropdownMenuPrimitive.Group`, matching the shadcn/ui reference. The types file includes `DropdownMenuGroupProps` and `index.ts` exports it.