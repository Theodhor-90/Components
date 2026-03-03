## Objective

Extend the Combobox component (created in Task 1) with multi-select mode and create-option support.

## Deliverables

- Extend `ComboboxProps` in `combobox.types.ts` with:
  - `mode: "single" | "multiple"` prop (default `"single"`)
  - `onCreateOption?: (value: string) => void` callback
- Update `combobox.tsx` with multi-select behavior:
  - When `mode="multiple"`: value type becomes `string[]`, selecting an item toggles it in the array (popover stays open), each selected item shows a check icon
  - Trigger display: when exactly one item is selected, show that item's label; when more than one item is selected, show plain text `"{n} selected"` (e.g., `"3 selected"`) — plain text, not a Badge component
- Update `combobox.tsx` with create-option behavior:
  - When `onCreateOption` is provided and input text doesn't match any option: render a "Create {value}" `CommandItem` at the bottom of the list
  - Clicking the create item calls `onCreateOption(inputValue)` and clears the input
  - If `onCreateOption` is not provided, no create option is shown
- Update `combobox.test.tsx` with additional tests:
  - Multi-select toggles items (adds and removes)
  - Multi-select trigger shows single label for one selection
  - Multi-select trigger shows "{n} selected" for multiple selections
  - Multi-select popover stays open after selection
  - Create-option appears for unmatched input
  - Create-option callback fires with typed value
  - Create-option hidden when all options match
  - Create-option not shown when onCreateOption is not provided
- Update `combobox.stories.tsx` with additional stories:
  - MultiSelect, MultiSelectWithDefaults, WithCreateOption, MultiSelectWithCreateOption

## Key Implementation Details

- Multi-select keeps popover open on selection (unlike single-select which closes)
- The `mode` prop defaults to `"single"` to maintain backward compatibility with Task 1
- Create-option is purely consumer-driven — the component calls `onCreateOption` but the consumer is responsible for adding the new option to the options array
- All icons use inline SVGs (no icon library)

## Dependencies

- **Task 1 (Combobox — Single-Select Mode)** must be complete — this task extends that implementation

## Verification Criteria

1. `pnpm typecheck` passes with no errors
2. All existing single-select tests still pass (no regressions)
3. All new multi-select and create-option tests pass including vitest-axe
4. Multi-select mode: popover stays open, items toggle, trigger shows count
5. Create-option: appears when no match and `onCreateOption` provided, fires callback
6. New stories render correctly in Storybook with autodocs
