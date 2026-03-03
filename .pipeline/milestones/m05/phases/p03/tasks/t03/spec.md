## Objective

Create the Color Picker component — a custom Popover-based color selection control with preset palette grid, hex input, and live preview swatch.

## Deliverables

- Create `packages/ui/src/components/color-picker/` directory with all 5 standard component files
- **color-picker.types.ts** — `ColorPickerProps` type with: `value?: string`, `defaultValue?: string`, `onValueChange?: (value: string) => void`, `disabled?: boolean`, `placeholder?: string` (default: `"Pick a color"`), `className?: string`, `ref?: React.Ref<HTMLButtonElement>`. All color values are hex strings including `#` prefix (e.g., `"#ef4444"`).
- **color-picker.styles.ts** — Style constants (plain string constants, not CVA) for trigger button, popover content, palette grid, swatch button, hex input wrapper, preview swatch, active swatch ring
- **color-picker.tsx** — Color Picker composing `Popover` + `PopoverTrigger` + `PopoverContent` + `Button` (trigger) + `Input` (hex). Implementation details:
  - **Trigger**: Shows a small color swatch preview (inline `backgroundColor`) and hex value text. When no color selected, displays placeholder `"Pick a color"`. Include `data-slot="color-picker"` on root element.
  - **Palette grid**: 22 Tailwind color families (slate, gray, zinc, neutral, stone, red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose) at shade 500. Static hex values hardcoded — not dynamic theme tokens. Each swatch is a `<button>` element for Tab-key accessibility.
  - **Hex input**: Text input with `#` visual label prefix (outside input value). Validates against `/^[0-9a-fA-F]{0,6}$/` on each keystroke, rejecting invalid characters.
  - **Preview swatch**: Colored square next to hex input, updates in real time via inline `backgroundColor` style (exception to no-inline-styles rule for dynamic user-selected colors).
  - Uses `useControllableState` from `@components/hooks` with `{ prop: value, defaultProp: defaultValue, onChange: onValueChange }`.
  - Clicking a preset swatch sets the value. Typing in hex input updates value in real time.
- **color-picker.test.tsx** — Tests: smoke render, renders default placeholder "Pick a color" when no value, opens popover on trigger click, clicking preset swatch sets value, hex input updates value in real time, hex input rejects invalid characters, preview swatch reflects current value, trigger shows selected color swatch and hex text, controlled mode works, uncontrolled mode works, disabled state prevents opening, palette swatches are focusable buttons, vitest-axe accessibility check
- **color-picker.stories.tsx** — CSF3 format with `tags: ['autodocs']`. Stories: Default (with placeholder), WithDefaultValue, Controlled, Disabled
- Export `ColorPicker` and `ColorPickerProps` from `packages/ui/src/index.ts`

## Key Implementation Details

- Uses Popover (M1), Button (M2), Input (M2) — no new npm dependencies
- Uses `useControllableState` hook from `@components/hooks`
- Inline `backgroundColor` style is the one approved exception to the no-inline-styles rule
- All icons use inline SVGs (no icon library)
- Follow the 5-file component pattern; named exports only; React 19 ref-as-prop
- Palette hex values (22 Tailwind shade-500 colors): slate=#64748b, gray=#6b7280, zinc=#71717a, neutral=#737373, stone=#78716c, red=#ef4444, orange=#f97316, amber=#f59e0b, yellow=#eab308, lime=#84cc16, green=#22c55e, emerald=#10b981, teal=#14b8a6, cyan=#06b6d4, sky=#0ea5e9, blue=#3b82f6, indigo=#6366f1, violet=#8b5cf6, purple=#a855f7, fuchsia=#d946ef, pink=#ec4899, rose=#f43f5e

## Dependencies

- **Prior milestones**: Popover (M1), Button (M2), Input (M2)
- **Hooks**: `useControllableState` from `@components/hooks`
- **No dependency on Tasks 1–2** (Color Picker is independent of Combobox)
- **No new npm packages required**

## Verification Criteria

1. `packages/ui/src/components/color-picker/` directory exists with all 5 files
2. `pnpm typecheck` passes with no errors
3. All tests in `color-picker.test.tsx` pass including vitest-axe
4. Palette grid shows 22 color swatches, each clickable
5. Hex input validates characters and updates preview swatch in real time
6. Trigger shows color swatch and hex text for selected color
7. Controlled and uncontrolled modes both work
8. `ColorPicker` and `ColorPickerProps` exported from `packages/ui/src/index.ts`
9. Stories render correctly in Storybook with autodocs
