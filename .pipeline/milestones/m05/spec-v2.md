Now let me carefully address every feedback issue and produce the revised specification.

# Milestone 5: Menus & Composed Inputs — Specification

## Goal

Deliver action menus (dropdown, context, command palette) and higher-level composed input controls (calendar, date picker, time picker, combobox, color picker) that build on the Popover, Command, and Calendar primitives established in prior milestones, enabling consumer apps to implement dropdown menus with nested sub-menus, searchable selects with create-option support, and date/time/color selection workflows.

## Phases

### Phase 1: Menus

Build the three menu/command components that provide action lists, contextual actions, and keyboard-driven command palettes.

**Components:**

1. **Dropdown Menu** — shadcn port wrapping `@radix-ui/react-dropdown-menu`. Sub-components: `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioItem`, `DropdownMenuRadioGroup`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`. Supports nested sub-menus, checkbox/radio selection, and keyboard navigation.

2. **Context Menu** — shadcn port wrapping `@radix-ui/react-context-menu`. Sub-components mirror Dropdown Menu: `ContextMenuTrigger`, `ContextMenuContent`, `ContextMenuItem`, `ContextMenuCheckboxItem`, `ContextMenuRadioItem`, `ContextMenuRadioGroup`, `ContextMenuLabel`, `ContextMenuSeparator`, `ContextMenuSub`, `ContextMenuSubTrigger`, `ContextMenuSubContent`. Opens on right-click with correct positioning relative to cursor.

3. **Command** — shadcn port wrapping `cmdk` library. Sub-components: `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem`, `CommandSeparator`, `CommandDialog` (composes Command inside a Dialog). Supports real-time filtering, keyboard navigation (arrow keys, Enter to select, Escape to close), grouped items, and empty-state messaging.

**New dependencies:** `@radix-ui/react-dropdown-menu`, `@radix-ui/react-context-menu`, `cmdk`

### Phase 2: Calendar & Date Pickers

Build the calendar primitive and two date/time picker components that compose it with Popover for user-friendly temporal input.

**Components:**

4. **Calendar** — shadcn port wrapping `react-day-picker`. Supports three selection modes via `mode` prop: `single`, `range`, `multiple`. Theme-integrated styling using OKLCH semantic tokens. Navigation between months via chevron buttons. Accepts `selected`, `onSelect`, `disabled` (dates or date ranges), and standard `react-day-picker` props.

5. **Date Picker** — shadcn-pattern composing Popover + Calendar + Button. The trigger Button displays the formatted selected date (or placeholder text when empty). Clicking the trigger opens a Popover containing a Calendar in single-selection mode. Selecting a date closes the popover and updates the trigger display. Supports controlled and uncontrolled usage.

6. **Time Picker** — custom component. Popover containing hour and minute select inputs in HH:mm (24-hour) format. Hour select: 00–23. Minute select: 00–59. Time Picker composes the Select component from Milestone 2 for both hour and minute inputs. Supports keyboard navigation between hour and minute fields. Supports controlled and uncontrolled usage via `value` / `onChange` props.

**New dependencies:** `react-day-picker`

### Phase 3: Combobox & Color Picker

Build two composed input components that combine Popover with specialized selection interfaces.

**Components:**

7. **Combobox** — shadcn-pattern composing Popover + Command for searchable single/multi select with create-option support. Uses Command's built-in filtering for client-side search.

8. **Color Picker** — custom component. Popover containing a color palette grid, a hex color text input with `#` prefix, and a live preview swatch showing the current color. The preview swatch updates in real time as the hex input value changes.

**New dependencies:** None (Popover and Command are already available).

## Exit Criteria

1. All 8 components (Dropdown Menu, Context Menu, Command, Calendar, Date Picker, Time Picker, Combobox, Color Picker) render correctly in Storybook with all variants and states documented via autodocs
2. `pnpm test` passes with zero failures, including vitest-axe accessibility assertions for every component
3. `pnpm typecheck` passes with no TypeScript errors across the entire monorepo
4. Dropdown Menu supports nested sub-menus that open on hover/keyboard, checkbox items that toggle state, and radio items with group exclusivity
5. Context Menu opens on right-click at the cursor position and supports the same item types as Dropdown Menu
6. Command filters items in real time as the user types, supports arrow-key navigation with Enter to select, and Escape closes CommandDialog
7. Calendar renders navigable month views and supports single-date, date-range, and multiple-date selection via the `mode` prop
8. Date Picker displays the formatted selected date in its trigger button and opens/closes the calendar popover on click
9. Combobox filters options as the user types and supports both single-value and multi-value selection modes
10. Color Picker updates the preview swatch in real time as the hex input value changes and allows selection from a palette grid
11. All 8 components and their sub-components, prop types, and CVA variant functions are exported from `packages/ui/src/index.ts`

## Dependencies

### Prior Milestones (must be complete)

- **Milestone 1: Foundation** — Popover (used by Date Picker, Time Picker, Combobox, Color Picker), Dialog (used by CommandDialog), Label, Badge (used by Combobox multi-select display)
- **Milestone 2: Form Controls** — Input (used by Color Picker hex input), Button (used by Date Picker trigger, Calendar navigation), Select (composed by Time Picker for hour and minute inputs)

### External Libraries (to be installed)

| Package                         | Version | Used By               |
| ------------------------------- | ------- | --------------------- |
| `@radix-ui/react-dropdown-menu` | latest  | Dropdown Menu         |
| `@radix-ui/react-context-menu`  | latest  | Context Menu          |
| `cmdk`                          | latest  | Command, Combobox     |
| `react-day-picker`              | latest  | Calendar, Date Picker |

### Already Available

- `@radix-ui/react-popover` — installed in Milestone 1
- `@radix-ui/react-dialog` — installed in Milestone 1
- `class-variance-authority`, `tailwind-merge`, `clsx` — installed in project setup
