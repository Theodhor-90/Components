## Objective

Create the Combobox component with single-select functionality, composing Popover + Command for a searchable dropdown select.

## Deliverables

- Create `packages/ui/src/components/combobox/` directory with all 5 standard component files
- **combobox.types.ts** — `ComboboxOption` type with `value`, `label`, `disabled?` fields. `ComboboxProps` type with: `options: ComboboxOption[]`, `value?: string | string[]`, `defaultValue?: string | string[]`, `onValueChange?: (value: string | string[]) => void`, `placeholder?: string` (default: `"Select..."`), `searchPlaceholder?: string` (default: `"Search..."`), `emptyMessage?: string` (default: `"No results found."`), `disabled?: boolean`, `className?: string`, `ref?: React.Ref<HTMLButtonElement>`
- **combobox.styles.ts** — Style constants (plain string constants, not CVA) for trigger button, popover content, selected item check icon, and placeholder text
- **combobox.tsx** — Single-select Combobox composing `Popover` + `PopoverTrigger` + `PopoverContent` + `Command` + `CommandInput` + `CommandList` + `CommandEmpty` + `CommandGroup` + `CommandItem`. Uses `useControllableState` from `@components/hooks` with `{ prop: value, defaultProp: defaultValue, onChange: onValueChange }` for value management. Selecting an item closes the popover. Trigger button shows selected option label or placeholder. Include `data-slot="combobox"` on root element.
- **combobox.test.tsx** — Tests: smoke render, renders default placeholder "Select..." when no value, opens popover on trigger click, filters options as user types in CommandInput, selects an option and closes popover, displays selected option label in trigger, controlled mode works, uncontrolled mode works, disabled state prevents opening, custom placeholder renders, custom searchPlaceholder passed to CommandInput, custom emptyMessage shown when no matches, vitest-axe accessibility check
- **combobox.stories.tsx** — CSF3 format with `tags: ['autodocs']`. Stories: Default (with placeholder), WithDefaultValue, Controlled, Disabled, ManyOptions (50+ items to demonstrate scroll/filter)
- Export `Combobox`, `ComboboxProps`, and `ComboboxOption` from `packages/ui/src/index.ts`

## Key Implementation Details

- Uses Popover (from M1) + Command (from M5/P1) composition — no new dependencies needed
- Uses `useControllableState` hook from `@components/hooks` — accepts `{ prop, defaultProp, onChange }` parameters
- All icons (chevron, check) use inline SVGs with `fill="none"`, `stroke="currentColor"`, `strokeWidth="2"`, `strokeLinecap="round"`, `strokeLinejoin="round"`, `aria-hidden="true"` — no icon library
- Follow the 5-file component pattern established by Button (reference implementation)
- Named exports only, no default exports
- React 19 ref-as-prop (no forwardRef)

## Dependencies

- **Prior milestones**: Popover (M1), Button (M2)
- **Prior phases**: Command with CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem (M5/P1)
- **Hooks**: `useControllableState` from `@components/hooks`
- **No new npm packages required**

## Verification Criteria

1. `packages/ui/src/components/combobox/` directory exists with all 5 files
2. `pnpm typecheck` passes with no errors
3. All tests in `combobox.test.tsx` pass including vitest-axe
4. Combobox filters options via Command's built-in filtering
5. Selecting an item closes the popover and shows the label in trigger
6. Controlled and uncontrolled modes both work
7. `Combobox`, `ComboboxProps`, `ComboboxOption` exported from `packages/ui/src/index.ts`
8. Stories render correctly in Storybook with autodocs
