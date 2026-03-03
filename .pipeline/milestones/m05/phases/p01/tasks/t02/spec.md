# Task 2: Dropdown Menu Component

## Objective

Implement the Dropdown Menu component as a shadcn/ui port wrapping `@radix-ui/react-dropdown-menu`, following the 5-file component pattern. The component provides nested dropdown menus with checkbox items, radio items, sub-menus, keyboard navigation, and destructive item styling.

## Deliverables

### 5 Component Files

All files in `packages/ui/src/components/dropdown-menu/`:

1. **`dropdown-menu.tsx`** — Implementation wrapping `@radix-ui/react-dropdown-menu`. Named exports: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioItem`, `DropdownMenuRadioGroup`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`, `DropdownMenuPortal`, `DropdownMenuShortcut`. Each sub-component must:
   - Include a `data-slot` attribute (e.g., `data-slot="dropdown-menu-item"`)
   - Accept `ref` as a prop (React 19, no forwardRef)
   - Use `cn()` for class merging
   - Support `className` override

2. **`dropdown-menu.styles.ts`** — CVA definitions for:
   - `DropdownMenuContent`: positioning, background (`bg-popover`), border (`border-border`), shadow, open/close animation
   - `DropdownMenuItem`: base item styles + `variant: { default, destructive }` + `inset: { true, false }`. Destructive variant uses `text-destructive` with `focus:bg-destructive/10 focus:text-destructive`. Default `variant: "default"`
   - `DropdownMenuCheckboxItem`: item with check indicator
   - `DropdownMenuRadioItem`: item with radio dot indicator
   - `DropdownMenuLabel`: bold label + `inset: { true, false }`
   - `DropdownMenuSeparator`: horizontal rule
   - `DropdownMenuSubTrigger`: item with chevron indicator

3. **`dropdown-menu.types.ts`** — Props types for all sub-components extending the corresponding Radix primitive props + CVA `VariantProps` where applicable.

4. **`dropdown-menu.test.tsx`** — Tests covering:
   - Smoke render
   - Opening on trigger click
   - Item selection callback (`onSelect`)
   - Checkbox item toggle
   - Radio item group exclusivity
   - Sub-menu opening on hover/keyboard
   - Keyboard navigation (arrow keys, Enter, Escape)
   - `inset` variant rendering (adds left padding)
   - `destructive` variant rendering (correct text color)
   - `data-slot` presence on sub-components
   - vitest-axe accessibility assertions

5. **`dropdown-menu.stories.tsx`** — CSF3 stories with `tags: ['autodocs']`:
   - Default, WithCheckboxItems, WithRadioGroup, WithSubMenu, WithShortcuts, WithInsetItems, Destructive

### Index Export

- Add all sub-components, types, and variant functions to `packages/ui/src/index.ts`

## Design Decisions

- Destructive item styling uses a CVA `variant` prop (`"default" | "destructive"`), matching the pattern used by Button, Alert, and Badge
- Items support an `inset` boolean prop for left padding alignment with icon-bearing items, matching shadcn/ui API
- CVA styles are self-contained in the styles file (no shared styles module with Context Menu), preserving the 5-file pattern

## Dependencies

- **Task 1** (t01): `@radix-ui/react-dropdown-menu` must be installed
- **Prior milestones**: `cn()` utility, OKLCH semantic tokens in `globals.css`, Vitest + Testing Library + vitest-axe infrastructure, Storybook 8.5

## Verification

1. All tests in `dropdown-menu.test.tsx` pass via `pnpm test`
2. `pnpm typecheck` passes with no errors
3. Storybook renders all 7 stories correctly
4. All sub-components are accessible via `import { DropdownMenu, ... } from '@components/ui'`
5. vitest-axe reports no accessibility violations
