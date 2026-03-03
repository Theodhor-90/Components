Good — accordion, tabs, and other M3/M4 dependencies are already in place. Now I have everything needed to write the specification.

# Milestone 5: Menus & Composed Inputs — Specification

## Goal

Deliver action menus (dropdown, context, command palette) and higher-level composed input controls (calendar, date picker, time picker, combobox, color picker) that build on the Popover, Button, and Input primitives established in prior milestones, enabling consumer apps to implement dropdown menus with nested sub-menus, searchable selects with create-option support, and date/time/color selection workflows.

## Scope

### Included

- **10 components** across 3 phases:
  - Dropdown Menu (shadcn port, `@radix-ui/react-dropdown-menu`)
  - Context Menu (shadcn port, `@radix-ui/react-context-menu`)
  - Command (shadcn port, `cmdk` library)
  - Calendar (shadcn port, `react-day-picker`)
  - Date Picker (shadcn-pattern, composes Popover + Calendar + Button)
  - Time Picker (custom, Popover with hour/minute select inputs)
  - Combobox (shadcn-pattern, composes Popover + Command)
  - Color Picker (custom, Popover with color palette grid + hex input)
- Full 5-file pattern for each component (`*.tsx`, `*.styles.ts`, `*.types.ts`, `*.test.tsx`, `*.stories.tsx`)
- Vitest + vitest-axe accessibility tests for every component
- Storybook CSF3 stories with autodocs for every component
- Public API exports from `packages/ui/src/index.ts`
- New npm dependencies: `@radix-ui/react-dropdown-menu`, `@radix-ui/react-context-menu`, `cmdk`, `react-day-picker`

### Out of Scope

- Data table integrations (column-level dropdown menus, sortable headers) — deferred to consumer apps
- Internationalization or locale-specific date formatting beyond what `react-day-picker` provides natively
- Date range picker as a standalone component (handled via Calendar's `mode="range"` prop)
- Autocomplete with server-side search / async loading — Combobox handles client-side filtering only
- Color picker with HSL/RGB sliders or eyedropper — limited to palette grid + hex input
- Changes to existing components from prior milestones

## Phases

### Phase 1: Menus

Build the three menu/command components that provide action lists, contextual actions, and keyboard-driven command palettes.

**Components:**

1. **Dropdown Menu** — shadcn port wrapping `@radix-ui/react-dropdown-menu`. Sub-components: `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioItem`, `DropdownMenuRadioGroup`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`, `DropdownMenuShortcut`. Supports nested sub-menus, inset items, checkbox/radio selection, and keyboard shortcut labels.

2. **Context Menu** — shadcn port wrapping `@radix-ui/react-context-menu`. Sub-components mirror Dropdown Menu: `ContextMenuTrigger`, `ContextMenuContent`, `ContextMenuItem`, `ContextMenuCheckboxItem`, `ContextMenuRadioItem`, `ContextMenuRadioGroup`, `ContextMenuLabel`, `ContextMenuSeparator`, `ContextMenuSub`, `ContextMenuSubTrigger`, `ContextMenuSubContent`, `ContextMenuShortcut`. Opens on right-click with correct positioning relative to cursor.

3. **Command** — shadcn port wrapping `cmdk` library. Sub-components: `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem`, `CommandSeparator`, `CommandDialog` (composes Command inside a Dialog). Supports real-time filtering, keyboard navigation (arrow keys, Enter to select, Escape to close), grouped items, and empty-state messaging.

**New dependencies:** `@radix-ui/react-dropdown-menu`, `@radix-ui/react-context-menu`, `cmdk`

### Phase 2: Calendar & Date Pickers

Build the calendar primitive and two date/time picker components that compose it with Popover for user-friendly temporal input.

**Components:**

4. **Calendar** — shadcn port wrapping `react-day-picker`. Supports three selection modes via `mode` prop: `single`, `range`, `multiple`. Theme-integrated styling using OKLCH semantic tokens. Navigation between months via chevron buttons. Accepts `selected`, `onSelect`, `disabled` (dates or date ranges), and standard `react-day-picker` props.

5. **Date Picker** — shadcn-pattern composing Popover + Calendar + Button. The trigger Button displays the formatted selected date (or placeholder text when empty). Clicking the trigger opens a Popover containing a Calendar in single-selection mode. Selecting a date closes the popover and updates the trigger display. Supports controlled and uncontrolled usage.

6. **Time Picker** — custom component. Popover containing hour and minute select inputs in HH:mm (24-hour) format. Hour select: 00–23. Minute select: 00–59 in configurable step increments (default 1, common: 5, 15). Supports keyboard navigation between hour and minute fields. Supports controlled and uncontrolled usage via `value` / `onChange` props.

**New dependencies:** `react-day-picker`

### Phase 3: Combobox & Color Picker

Build two composed input components that combine Popover with specialized selection interfaces.

**Components:**

7. **Combobox** — shadcn-pattern composing Popover + Command. Provides a searchable dropdown for single or multi selection. Props: `options` (array of `{ value, label }`), `value`/`onChange` for controlled usage, `multiple` flag for multi-select mode, `onCreateOption` callback for create-new support, `placeholder` for the input field. Selected items display as text (single) or inline badges (multi). Uses Command's built-in filtering for client-side search.

8. **Color Picker** — custom component. Popover containing: a grid of preset color swatches (configurable palette), a hex color text input with `#` prefix, and a live preview swatch showing the current color. Props: `value`/`onChange` (hex string), `presets` (array of hex colors with optional default palette), `disabled`. The preview swatch updates in real time as the hex input value changes.

**New dependencies:** None (Popover, Command, and Badge are already available).

## Exit Criteria

1. All 10 components (Dropdown Menu, Context Menu, Command, Calendar, Date Picker, Time Picker, Combobox, Color Picker) render correctly in Storybook with all variants and states documented via autodocs
2. `pnpm test` passes with zero failures, including vitest-axe accessibility assertions for every component
3. `pnpm typecheck` passes with no TypeScript errors across the entire monorepo
4. Dropdown Menu supports nested sub-menus that open on hover/keyboard, checkbox items that toggle state, and radio items with group exclusivity
5. Context Menu opens on right-click at the cursor position and supports the same item types as Dropdown Menu
6. Command filters items in real time as the user types, supports arrow-key navigation with Enter to select, and Escape closes CommandDialog
7. Calendar renders navigable month views and supports single-date, date-range, and multiple-date selection via the `mode` prop
8. Date Picker displays the formatted selected date in its trigger button and opens/closes the calendar popover on click
9. Combobox filters options as the user types and supports both single-value and multi-value selection modes
10. Color Picker updates the preview swatch in real time as the hex input value changes and allows selection from a preset palette grid
11. All 10 components and their sub-components, prop types, and CVA variant functions are exported from `packages/ui/src/index.ts`

## Dependencies

### Prior Milestones (must be complete)

- **Milestone 1: Foundation** — Popover (used by Date Picker, Time Picker, Combobox, Color Picker), Dialog (used by CommandDialog), Label, Badge (used by Combobox multi-select display)
- **Milestone 2: Form Controls** — Input (used by Color Picker hex input), Button (used by Date Picker trigger, Calendar navigation), Select (pattern reference for Time Picker selects)
- **Milestone 4: Data Display** — Tooltip (optional enhancement for menu items)

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
- `sonner` — installed in Milestone 1 (not directly needed but confirms dependency pattern)

## Risks

1. **`cmdk` API surface** — The `cmdk` library has undergone breaking changes between major versions. The implementation must target the version compatible with React 19 and verify that the filtering, keyboard navigation, and dialog composition APIs match the shadcn/ui reference implementation.

2. **`react-day-picker` v9 migration** — shadcn/ui's Calendar component targets `react-day-picker` v9, which has significant API differences from v8. The implementation must use v9 APIs (`mode` prop, `selected`/`onSelect` pattern) and verify React 19 compatibility.

3. **Composed component complexity** — Date Picker, Time Picker, Combobox, and Color Picker are composed from multiple primitives (Popover, Command, Calendar, Input, Button). Coordinating open/close state, focus management, and keyboard navigation across composed boundaries requires careful integration testing.

4. **Context Menu browser conflicts** — The right-click trigger for Context Menu may conflict with browser-native context menus or browser extensions. Testing must verify that `@radix-ui/react-context-menu` correctly prevents the default context menu within the trigger area.

5. **Color Picker hex validation** — The hex input must validate user input (3-digit and 6-digit hex, with or without `#` prefix) without blocking typing. Invalid intermediate states (e.g., typing `#F` mid-entry) must not cause errors or flash incorrect preview colors.

6. **Keyboard navigation across composed popover boundaries** — Components like Combobox and Date Picker must handle focus correctly when the popover opens (focus moves into popover content) and closes (focus returns to trigger). Incorrect focus management will cause accessibility failures in vitest-axe tests.
