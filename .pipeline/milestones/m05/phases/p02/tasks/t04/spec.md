# Task: Time Picker Component

## Objective

Create the Time Picker component — a custom composed component using Popover, Button, and two Select instances for hour and minute input in 24-hour HH:mm format.

## Deliverables

Create 5 files under `packages/ui/src/components/time-picker/`:

### 1. `time-picker.tsx`
- Composed component using `Popover`, `PopoverTrigger`, `PopoverContent`, `Button`, and two `Select` instances
- Export: `TimePicker`
- Trigger is a `Button` (variant `outline`) displaying:
  - An inline SVG clock icon: `<circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />` (24x24 viewBox, stroke-based, `fill="none"`, `stroke="currentColor"`, `strokeWidth="2"`, `strokeLinecap="round"`, `strokeLinejoin="round"`, `aria-hidden="true"`)
  - Current time in `HH:mm` format, or placeholder text (default: "Pick a time") with `text-muted-foreground`
- Popover content contains two `Select` components side by side:
  - **Hour Select**: options 00–23
  - **Minute Select**: options 00–59
- Selecting hour and minute updates the trigger display
- **Controlled usage**: `value` (string in `"HH:mm"` format) / `onChange` props
- **Uncontrolled usage**: `defaultValue` prop with internal state
- Includes `data-slot="time-picker"` on root element
- Accepts `ref` on the trigger button (React 19)

### 2. `time-picker.styles.ts`
Named string constants:
- `timePickerTriggerStyles` — button width and text styling, `text-muted-foreground` when no time selected
- `timePickerContentStyles` — Popover content layout: flex row with gap for the two Select inputs
- `timePickerSeparatorStyles` — the `:` separator between hour and minute selects

### 3. `time-picker.types.ts`
`TimePickerProps` with:
- `value?: string` (HH:mm format)
- `defaultValue?: string`
- `onChange?: (value: string) => void`
- `disabled?: boolean`
- `placeholder?: string`
- `className?: string`
- `ref?: React.Ref<HTMLButtonElement>`

### 4. `time-picker.test.tsx`
Tests covering:
- Smoke render
- Renders placeholder when no time
- Renders formatted time when value is provided
- Opens popover on trigger click
- Selecting hour and minute updates trigger text
- Controlled mode (`value` + `onChange`)
- Uncontrolled mode (`defaultValue`)
- Disabled state prevents opening
- Hour options range from 00 to 23
- Minute options range from 00 to 59
- `data-slot` presence
- vitest-axe accessibility

### 5. `time-picker.stories.tsx`
CSF3 stories with `tags: ['autodocs']`:
- Default (uncontrolled)
- Controlled
- WithDefaultValue
- Disabled
- WithPlaceholder

### Index Export
- Export `TimePicker` and `TimePickerProps` from `packages/ui/src/index.ts`

## Key Constraints

- No CVA variants — styles are static string constants
- Uses Select components from Milestone 2 (not raw `<input type="number">`)
- All icons are inline SVGs — no icon library
- Must compose existing Popover, Button, and Select components

## Dependencies

- **Task t01** must be complete (dependency installation)
- Milestone 1 components: Popover, PopoverTrigger, PopoverContent, Button
- Milestone 2 components: Select, SelectTrigger, SelectContent, SelectItem, SelectValue
- `cn()` helper

## Verification Criteria

1. All 5 files exist under `packages/ui/src/components/time-picker/`
2. `TimePicker` and `TimePickerProps` are exported from `packages/ui/src/index.ts`
3. `pnpm test` passes for time-picker tests including vitest-axe
4. `pnpm typecheck` passes with no errors
5. Time Picker renders in Storybook with all stories visible
6. Hour Select has 24 options (00–23), Minute Select has 60 options (00–59)
7. `data-slot="time-picker"` is present on root element
8. No new dependencies introduced (uses existing Popover, Button, Select)