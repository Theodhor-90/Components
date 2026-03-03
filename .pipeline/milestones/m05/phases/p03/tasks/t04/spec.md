## Objective

Run full monorepo verification to confirm both new components (Combobox, Color Picker) integrate correctly with the existing codebase and cause no regressions.

## Deliverables

- Run `pnpm typecheck` across the monorepo — fix any TypeScript errors in new or existing files
- Run `pnpm test` across the monorepo — ensure all tests pass (including all existing component tests from M1–M5/P2, not just new ones)
- Run `pnpm lint` — fix any linting issues in new files
- Verify Storybook renders both Combobox and Color Picker with all stories and autodocs
- Verify all exports exist in `packages/ui/src/index.ts`: `Combobox`, `ComboboxProps`, `ComboboxOption`, `ColorPicker`, `ColorPickerProps`
- Confirm no regressions in existing component tests

## Key Details

- This is a verification-only task — no new component code should be written
- Any failures found here should be fixed in the relevant component files
- Storybook verification requires running `pnpm storybook` and confirming both components appear with all documented stories
- The full export list for this phase is: `Combobox`, `ComboboxProps`, `ComboboxOption`, `ColorPicker`, `ColorPickerProps`

## Dependencies

- **Task 1** (Combobox single-select) must be complete
- **Task 2** (Combobox multi-select and create-option) must be complete
- **Task 3** (Color Picker) must be complete

## Verification Criteria

1. `pnpm typecheck` exits with code 0 — no TypeScript errors across the entire monorepo
2. `pnpm test` exits with code 0 — all tests pass with zero failures
3. `pnpm lint` exits with code 0 — no linting errors
4. Storybook renders all Combobox stories: Default, WithDefaultValue, Controlled, Disabled, ManyOptions, MultiSelect, MultiSelectWithDefaults, WithCreateOption, MultiSelectWithCreateOption
5. Storybook renders all Color Picker stories: Default, WithDefaultValue, Controlled, Disabled
6. `packages/ui/src/index.ts` exports: `Combobox`, `ComboboxProps`, `ComboboxOption`, `ColorPicker`, `ColorPickerProps`
7. No regressions in any existing component tests from prior milestones/phases
