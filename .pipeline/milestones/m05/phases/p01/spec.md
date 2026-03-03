## Phase 1: Menus

### Goal

Build the three menu/command components that provide action lists, contextual actions, and keyboard-driven command palettes. These components wrap Radix UI and cmdk primitives following the shadcn/ui port approach, delivering dropdown menus with nested sub-menus, right-click context menus, and a filterable command palette with dialog integration.

### Deliverables

1. **Dropdown Menu** — shadcn port wrapping `@radix-ui/react-dropdown-menu`. Sub-components: `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioItem`, `DropdownMenuRadioGroup`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`. Supports nested sub-menus, checkbox/radio selection, and keyboard navigation.

2. **Context Menu** — shadcn port wrapping `@radix-ui/react-context-menu`. Sub-components mirror Dropdown Menu: `ContextMenuTrigger`, `ContextMenuContent`, `ContextMenuItem`, `ContextMenuCheckboxItem`, `ContextMenuRadioItem`, `ContextMenuRadioGroup`, `ContextMenuLabel`, `ContextMenuSeparator`, `ContextMenuSub`, `ContextMenuSubTrigger`, `ContextMenuSubContent`. Opens on right-click with correct positioning relative to cursor.

3. **Command** — shadcn port wrapping `cmdk` library. Sub-components: `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem`, `CommandSeparator`, `CommandDialog` (composes Command inside a Dialog). Supports real-time filtering, keyboard navigation (arrow keys, Enter to select, Escape to close), grouped items, and empty-state messaging.

### Technical Decisions & Constraints

- Each component follows the 5-file pattern: `{name}.tsx`, `{name}.styles.ts`, `{name}.types.ts`, `{name}.test.tsx`, `{name}.stories.tsx`
- New dependencies to install: `@radix-ui/react-dropdown-menu`, `@radix-ui/react-context-menu`, `cmdk`
- All components must use OKLCH semantic tokens for styling, `cn()` for class merging, and `data-slot` attributes on each sub-component
- Command's `CommandDialog` sub-component composes the Dialog component from Milestone 1
- All components and their prop types and CVA variant functions must be exported from `packages/ui/src/index.ts`
- Tests must include vitest-axe accessibility assertions; stories must use CSF3 with `tags: ['autodocs']`

### Dependencies on Prior Phases

- **Milestone 1 (Foundation)** — Dialog (used by CommandDialog)
- No dependency on other phases within Milestone 5
