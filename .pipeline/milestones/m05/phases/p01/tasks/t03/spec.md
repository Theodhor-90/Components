# Task 3: Context Menu Component

## Objective

Implement the Context Menu component as a shadcn/ui port wrapping `@radix-ui/react-context-menu`, following the 5-file component pattern. The component provides right-click context menus with the same feature set as Dropdown Menu (checkbox items, radio items, sub-menus, keyboard navigation, destructive styling).

## Deliverables

### 5 Component Files

All files in `packages/ui/src/components/context-menu/`:

1. **`context-menu.tsx`** — Implementation wrapping `@radix-ui/react-context-menu`. Named exports: `ContextMenu`, `ContextMenuTrigger`, `ContextMenuContent`, `ContextMenuItem`, `ContextMenuCheckboxItem`, `ContextMenuRadioItem`, `ContextMenuRadioGroup`, `ContextMenuLabel`, `ContextMenuSeparator`, `ContextMenuSub`, `ContextMenuSubTrigger`, `ContextMenuSubContent`, `ContextMenuPortal`, `ContextMenuShortcut`. Same implementation approach as Dropdown Menu but using the context-menu Radix primitive (right-click trigger). Each sub-component must:
   - Include a `data-slot` attribute (e.g., `data-slot="context-menu-item"`)
   - Accept `ref` as a prop (React 19, no forwardRef)
   - Use `cn()` for class merging
   - Support `className` override

2. **`context-menu.styles.ts`** — CVA definitions mirroring Dropdown Menu's visual styles:
   - Same structure: content, item (with `variant: { default, destructive }` and `inset: { true, false }`), checkbox item, radio item, label (with `inset`), separator, sub-trigger
   - Same Tailwind utility classes and semantic tokens for visual consistency

3. **`context-menu.types.ts`** — Props types extending Radix context-menu primitive props + CVA `VariantProps` where applicable.

4. **`context-menu.test.tsx`** — Tests covering:
   - Smoke render
   - Opening on right-click (`contextmenu` event)
   - Item selection callback
   - Checkbox/radio item behavior
   - Sub-menu support
   - Keyboard navigation
   - Destructive variant rendering
   - `data-slot` presence on sub-components
   - vitest-axe accessibility assertions

5. **`context-menu.stories.tsx`** — CSF3 stories with `tags: ['autodocs']`:
   - Default, WithCheckboxItems, WithRadioGroup, WithSubMenu, WithShortcuts, WithInsetItems

### Index Export

- Add all sub-components, types, and variant functions to `packages/ui/src/index.ts`

## Design Decisions

- Visually identical to Dropdown Menu but triggered by right-click instead of button click
- CVA styles are independently defined (not shared with Dropdown Menu) to preserve the 5-file pattern
- Supports the same `variant` (default/destructive) and `inset` props on menu items

## Dependencies

- **Task 1** (t01): `@radix-ui/react-context-menu` must be installed
- **Task 2** (t02): Use Dropdown Menu as the reference for consistent visual styling and API patterns
- **Prior milestones**: `cn()` utility, OKLCH semantic tokens, test infrastructure, Storybook

## Verification

1. All tests in `context-menu.test.tsx` pass via `pnpm test`
2. `pnpm typecheck` passes with no errors
3. Storybook renders all 6 stories correctly
4. Context menu opens on right-click (not left-click)
5. All sub-components are accessible via `import { ContextMenu, ... } from '@components/ui'`
6. vitest-axe reports no accessibility violations
