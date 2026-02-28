# Milestone 5: Menus & Composed Inputs

## Goal

Deliver action menus and higher-level composed input controls that build on Popover, Command, and Calendar primitives. After this milestone, consumer apps can build dropdown menus, searchable selects, and date/time/color pickers.

## Phases

### Phase 1: Menus

Dropdown Menu with DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuRadioGroup, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent (shadcn port wrapping `@radix-ui/react-dropdown-menu`), Context Menu with matching sub-components (shadcn port wrapping `@radix-ui/react-context-menu`), Command with CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator, CommandDialog (shadcn port wrapping `cmdk` library).

### Phase 2: Calendar & Date Pickers

Calendar (shadcn port wrapping `react-day-picker` with single/range/multiple selection modes, theme-integrated styling), Date Picker (shadcn-pattern composing Popover + Calendar + Button trigger with formatted date display), Time Picker (custom, Popover with hour/minute select inputs in HH:mm format, keyboard navigation).

### Phase 3: Combobox & Color Picker

Combobox (shadcn-pattern composing Popover + Command for searchable single/multi select with create option support), Color Picker (custom, Popover with color palette grid + hex input + preview swatch).

## Exit Criteria

1. All 10 components render correctly in Storybook with all variants documented
2. `pnpm test` passes with vitest-axe accessibility assertions for every component
3. `pnpm typecheck` passes with no errors
4. Dropdown Menu supports nested sub-menus, checkbox items, and radio items
5. Context Menu opens on right-click with correct positioning
6. Command supports keyboard navigation (arrow keys, Enter, Escape) and filtering
7. Calendar supports single date, date range, and multiple date selection
8. Date Picker displays selected date in trigger and opens calendar popover
9. Combobox filters options as user types and supports both single and multi selection
10. Color Picker updates preview swatch in real time as hex value changes
11. All components are exported from `packages/ui/src/index.ts`
