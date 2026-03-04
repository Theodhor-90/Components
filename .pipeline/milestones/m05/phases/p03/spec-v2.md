Now I have all the context. Let me produce the revised specification.

# Phase 3: Combobox & Color Picker — Specification

## Goal

Deliver two composed input controls — a searchable select (Combobox) and a color selection control (Color Picker) — that combine Popover with specialized selection interfaces, completing Milestone 5's delivery of all higher-level composed input controls and enabling consumer apps to build searchable dropdown selects with create-option support and visual color pickers with hex input and preset palette grids.

## Design Decisions

### Combobox

1. **Composition over primitives.** Combobox is not a Radix primitive wrapper — it assembles `Popover` + `Command` (already delivered in M1 and M5/P1 respectively). This follows the shadcn-pattern approach documented in the master plan and mirrors how Date Picker composes Popover + Calendar + Button.

2. **Single and multi selection via `mode` prop.** The Combobox accepts `mode: "single" | "multiple"` (defaulting to `"single"`). In single mode, selecting an item closes the popover and sets the value. In multiple mode, selecting an item toggles it in the value array and the popover stays open so the user can continue selecting. This mirrors the Calendar component's `mode` prop pattern.

3. **Controlled and uncontrolled usage via `useControllableState`.** The Combobox exposes consumer-facing props `value`/`defaultValue`/`onValueChange`. Internally, these map to the `useControllableState` hook's `{ prop, defaultProp, onChange }` parameters: `value` → `prop`, `defaultValue` → `defaultProp`, `onValueChange` → `onChange`. Single mode uses `string | undefined` as the value type. Multiple mode uses `string[]`.

4. **Create-option support via `onCreateOption` callback.** When the user types a value that doesn't match any existing option and an `onCreateOption` callback is provided, a "Create {value}" item appears at the bottom of the list. Clicking it invokes the callback with the typed string, allowing the consumer to add it to their options list. If `onCreateOption` is not provided, no create option is shown.

5. **Options passed as data, not children.** Combobox accepts an `options` prop of type `Array<{ value: string; label: string; disabled?: boolean }>`. This allows the component to manage filtering, selection state, and the create-option feature without requiring consumers to manually compose `CommandItem` elements. This is the standard shadcn combobox pattern.

6. **Trigger displays selected value(s).** In single mode, the trigger button shows the selected option's label (or placeholder text). In multiple mode, when exactly one item is selected, the trigger shows that item's label; when more than one item is selected, the trigger shows plain text in the format `"{n} selected"` (e.g., `"3 selected"`) — this is plain text inside the Button, not a Badge component.

7. **`searchPlaceholder` and `emptyMessage` props.** `searchPlaceholder` is passed as the `placeholder` prop to the internal `CommandInput`. Defaults to `"Search..."`. `emptyMessage` is rendered as the content of the internal `CommandEmpty`. Defaults to `"No results found."`.

8. **Default placeholder.** When no value is selected and no `placeholder` prop is provided, the trigger button displays `"Select..."`.

### Color Picker

9. **Hardcoded Tailwind palette at shade 500.** The preset color grid uses the 22 Tailwind color families (slate, gray, zinc, neutral, stone, red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose) at shade 500. These are static hex values, not dynamic theme tokens, because the Color Picker is for selecting arbitrary colors, not theme-aware semantic colors.

10. **Hex input with `#` prefix.** The text input accepts a 6-character hex color string. The `#` prefix is shown as a visual label outside the input (not part of the input value) to prevent formatting confusion. The input validates against `/^[0-9a-fA-F]{0,6}$/` on each keystroke, rejecting invalid characters.

11. **Live preview swatch.** A colored square swatch next to the hex input updates in real time via inline `backgroundColor` style. This is the one exception to the "no inline styles" rule — dynamic user-selected colors cannot be expressed as Tailwind classes.

12. **Controlled and uncontrolled via `useControllableState`.** The Color Picker exposes consumer-facing props `value`/`defaultValue`/`onValueChange`. Internally, these map to the `useControllableState` hook's `{ prop, defaultProp, onChange }` parameters: `value` → `prop`, `defaultValue` → `defaultProp`, `onValueChange` → `onChange`. The value type is `string` (hex color including `#` prefix, e.g., `"#ef4444"`).

13. **Palette swatches are focusable buttons.** Each preset color swatch is rendered as a `<button>` element, making the palette grid navigable via Tab key. The currently-selected swatch shows a focus ring using the standard `ring-ring` token. No custom arrow-key grid navigation is implemented — Tab navigation provides baseline keyboard accessibility.

14. **Trigger displays a color swatch and hex value.** The trigger button shows a small colored square (via inline `backgroundColor`) and the hex value text. When no color is selected and no `placeholder` prop is provided, the trigger displays `"Pick a color"`.

### Shared

15. **No icon library.** Consistent with the rest of the project, all icons (chevron, check, palette, X) use inline SVGs with `fill="none"`, `stroke="currentColor"`, `strokeWidth="2"`, `strokeLinecap="round"`, `strokeLinejoin="round"`, `aria-hidden="true"`.

16. **Static styles in `.styles.ts` files.** Following the pattern established by Date Picker, Time Picker, Calendar, and Command, both components use plain string constants in their `.styles.ts` files rather than CVA variant functions, since neither component has meaningful visual variants requiring CVA's `cva()` utility.

## Tasks

### Task 1: Combobox — Single-Select Mode

**Deliverables:**

- Create `packages/ui/src/components/combobox/` directory with all 5 files
- `combobox.types.ts` — `ComboboxOption` type with `value`, `label`, `disabled?` fields. `ComboboxProps` type with: `options: ComboboxOption[]`, `value?: string | string[]`, `defaultValue?: string | string[]`, `onValueChange?: (value: string | string[]) => void`, `placeholder?: string` (default: `"Select..."`), `searchPlaceholder?: string` (default: `"Search..."`), `emptyMessage?: string` (default: `"No results found."`), `disabled?: boolean`, `className?: string`, `ref?: React.Ref<HTMLButtonElement>`
- `combobox.styles.ts` — Style constants for trigger button, popover content, selected item check icon, and placeholder text
- `combobox.tsx` — Single-select Combobox composing `Popover` + `PopoverTrigger` + `PopoverContent` + `Command` + `CommandInput` + `CommandList` + `CommandEmpty` + `CommandGroup` + `CommandItem`. Uses `useControllableState` with `{ prop: value, defaultProp: defaultValue, onChange: onValueChange }` for value management. Selecting an item closes the popover. Trigger button shows selected option label or placeholder.
- `combobox.test.tsx` — Tests: smoke render, renders default placeholder "Select..." when no value, opens popover on trigger click, filters options as user types in CommandInput, selects an option and closes popover, displays selected option label in trigger, controlled mode works, uncontrolled mode works, disabled state prevents opening, custom placeholder renders, custom searchPlaceholder passed to CommandInput, custom emptyMessage shown when no matches, vitest-axe accessibility check
- `combobox.stories.tsx` — Stories: Default (with placeholder), WithDefaultValue, Controlled, Disabled, ManyOptions (50+ items to demonstrate scroll/filter), plus autodocs
- Export `Combobox`, `ComboboxProps`, and `ComboboxOption` from `packages/ui/src/index.ts`

### Task 2: Combobox — Multi-Select and Create-Option

**Deliverables:**

- Extend `ComboboxProps` with `mode: "single" | "multiple"` prop (default `"single"`), `onCreateOption?: (value: string) => void` callback
- When `mode="multiple"`: value type becomes `string[]`, selecting an item toggles it (popover stays open), trigger shows the single label when exactly one item is selected or plain text `"{n} selected"` when more than one is selected, each selected item shows a check icon
- When `onCreateOption` is provided and input text doesn't match any option: render a "Create {value}" `CommandItem` at the bottom of the list; clicking it calls `onCreateOption(inputValue)` and clears the input
- Update `combobox.test.tsx` — Additional tests: multi-select toggles items, multi-select trigger shows single label for one selection, multi-select trigger shows "{n} selected" for multiple selections, create-option appears for unmatched input, create-option callback fires, create-option hidden when all options match
- Update `combobox.stories.tsx` — Additional stories: MultiSelect, MultiSelectWithDefaults, WithCreateOption, MultiSelectWithCreateOption

### Task 3: Color Picker — Core Implementation

**Deliverables:**

- Create `packages/ui/src/components/color-picker/` directory with all 5 files
- `color-picker.types.ts` — `ColorPickerProps` type with `value?: string`, `defaultValue?: string`, `onValueChange?: (value: string) => void`, `disabled?: boolean`, `placeholder?: string` (default: `"Pick a color"`), `className?: string`, `ref?: React.Ref<HTMLButtonElement>`. All color values are hex strings including `#` prefix (e.g., `"#ef4444"`).
- `color-picker.styles.ts` — Style constants for trigger button, popover content, palette grid, swatch button, hex input wrapper, preview swatch, active swatch ring
- `color-picker.tsx` — Color Picker composing `Popover` + `PopoverTrigger` + `PopoverContent` + `Button` (trigger) + `Input` (hex). Trigger shows a small color swatch preview (inline `backgroundColor`) and hex value text (or placeholder `"Pick a color"`). Popover contains: (1) a grid of 22 preset color swatches, each rendered as a `<button>` element for Tab-key accessibility, (2) a hex input with `#` label prefix and `/^[0-9a-fA-F]{0,6}$/` validation, (3) a preview swatch showing the current color in real time via inline `backgroundColor`. Uses `useControllableState` with `{ prop: value, defaultProp: defaultValue, onChange: onValueChange }` for value management. Clicking a preset swatch sets the value. Typing in the hex input updates the value in real time.
- `color-picker.test.tsx` — Tests: smoke render, renders default placeholder "Pick a color" when no value, opens popover on trigger click, clicking preset swatch sets value, hex input updates value in real time, hex input rejects invalid characters, preview swatch reflects current value, trigger shows selected color swatch and hex text, controlled mode works, uncontrolled mode works, disabled state prevents opening, palette swatches are focusable buttons, vitest-axe accessibility check
- `color-picker.stories.tsx` — Stories: Default (with placeholder), WithDefaultValue, Controlled, Disabled, plus autodocs
- Export `ColorPicker`, `ColorPickerProps` from `packages/ui/src/index.ts`

### Task 4: Integration Testing and Final Verification

**Deliverables:**

- Run `pnpm typecheck` across the monorepo — fix any TypeScript errors
- Run `pnpm test` across the monorepo — ensure all tests pass (including all existing component tests)
- Run `pnpm lint` — fix any linting issues in new files
- Verify Storybook renders both components with all stories and autodocs
- Verify all exports exist in `packages/ui/src/index.ts`: `Combobox`, `ComboboxProps`, `ComboboxOption`, `ColorPicker`, `ColorPickerProps`
- Confirm no regressions in existing component tests

## Exit Criteria

1. `packages/ui/src/components/combobox/` exists with all 5 files following the standard component pattern
2. `packages/ui/src/components/color-picker/` exists with all 5 files following the standard component pattern
3. Combobox filters options in real time as the user types, powered by Command's built-in filtering
4. Combobox supports single-value selection (popover closes on select) and multi-value selection (popover stays open, items toggle)
5. Combobox shows a "Create {value}" option when `onCreateOption` is provided and no options match the input
6. Color Picker displays a grid of 22 Tailwind shade-500 preset swatches and allows selection by click
7. Color Picker hex input validates characters and updates the preview swatch in real time
8. Color Picker trigger button shows a color swatch and hex value for the selected color
9. Color Picker palette swatches are rendered as focusable `<button>` elements for keyboard accessibility
10. `pnpm typecheck` passes with no TypeScript errors across the entire monorepo
11. `pnpm test` passes with zero failures, including vitest-axe accessibility assertions for both components
12. `pnpm lint` passes with no errors in new files
13. Both components render correctly in Storybook with all stories and autodocs tags
14. `Combobox`, `ComboboxProps`, `ComboboxOption`, `ColorPicker`, and `ColorPickerProps` are all exported from `packages/ui/src/index.ts`

## Dependencies

### Prior Milestones (must be complete)

- **Milestone 1 (Foundation)** — Popover with `PopoverTrigger`, `PopoverContent` (composed by both Combobox and Color Picker)
- **Milestone 2 (Form Controls)** — Button (used as trigger for both components), Input (used for Color Picker hex input)

### Prior Phases in Milestone 5 (must be complete)

- **Phase 1 (Menus)** — Command with `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem` (composed by Combobox for filtering and keyboard navigation)

### Shared Hooks

- `useControllableState` from `@components/hooks` — accepts `{ prop, defaultProp, onChange }` parameters (used by both components for controlled/uncontrolled state management)

### External Libraries

No new dependencies required. All needed packages are already installed:

- `cmdk` ^1.1.1 — already installed for Command (Phase 1)
- `@radix-ui/react-popover` — already installed for Popover (Milestone 1)

## Artifacts

| Artifact                                                           | Type     | Description                                                                            |
| ------------------------------------------------------------------ | -------- | -------------------------------------------------------------------------------------- |
| `packages/ui/src/components/combobox/combobox.tsx`                 | New file | Combobox implementation composing Popover + Command                                    |
| `packages/ui/src/components/combobox/combobox.types.ts`            | New file | `ComboboxProps` and `ComboboxOption` type definitions                                  |
| `packages/ui/src/components/combobox/combobox.styles.ts`           | New file | Style constants for Combobox sub-elements                                              |
| `packages/ui/src/components/combobox/combobox.test.tsx`            | New file | Vitest + Testing Library + vitest-axe tests                                            |
| `packages/ui/src/components/combobox/combobox.stories.tsx`         | New file | Storybook CSF3 stories with autodocs                                                   |
| `packages/ui/src/components/color-picker/color-picker.tsx`         | New file | Color Picker implementation composing Popover + Input + Button                         |
| `packages/ui/src/components/color-picker/color-picker.types.ts`    | New file | `ColorPickerProps` type definition                                                     |
| `packages/ui/src/components/color-picker/color-picker.styles.ts`   | New file | Style constants for Color Picker sub-elements                                          |
| `packages/ui/src/components/color-picker/color-picker.test.tsx`    | New file | Vitest + Testing Library + vitest-axe tests                                            |
| `packages/ui/src/components/color-picker/color-picker.stories.tsx` | New file | Storybook CSF3 stories with autodocs                                                   |
| `packages/ui/src/index.ts`                                         | Modified | Add exports for Combobox, ComboboxProps, ComboboxOption, ColorPicker, ColorPickerProps |
