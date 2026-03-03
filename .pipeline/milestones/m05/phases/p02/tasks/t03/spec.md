# Task: Date Picker Component

## Objective

Create the Date Picker component — a composed pattern (not a Radix primitive wrapper) that assembles Popover, Button, and Calendar into a single drop-in date selection control. Follows the shadcn-pattern approach.

## Deliverables

Create 5 files under `packages/ui/src/components/date-picker/`:

### 1. `date-picker.tsx`
- Composed component using `Popover`, `PopoverTrigger`, `PopoverContent`, `Button`, and `Calendar`
- Export: `DatePicker`
- Trigger is a `Button` (variant `outline`) displaying:
  - An inline SVG calendar icon: `<path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />` (24x24 viewBox, stroke-based, `fill="none"`, `stroke="currentColor"`, `strokeWidth="2"`, `strokeLinecap="round"`, `strokeLinejoin="round"`, `aria-hidden="true"`)
  - Formatted date text, or placeholder text (default: "Pick a date") rendered with `text-muted-foreground` when no date selected
- Clicking trigger opens Popover containing Calendar in `single` mode
- Selecting a date closes the Popover and updates the display
- **Controlled usage**: `date` / `onDateChange` props
- **Uncontrolled usage**: `defaultDate` prop with internal state
- **Custom formatting**: `formatDate` prop `(date: Date) => string`, defaults to `Intl.DateTimeFormat` with `{ year: 'numeric', month: 'long', day: 'numeric' }` (e.g., "March 3, 2026")
- `placeholder` prop for empty state text
- Includes `data-slot="date-picker"` on root element
- Accepts `ref` on the trigger button (React 19)

### 2. `date-picker.styles.ts`
Named string constants:
- `datePickerTriggerStyles` — button width, text alignment, font styling; `text-muted-foreground` when no date, normal text when date selected

### 3. `date-picker.types.ts`
`DatePickerProps` with:
- `date?: Date`
- `defaultDate?: Date`
- `onDateChange?: (date: Date | undefined) => void`
- `formatDate?: (date: Date) => string`
- `placeholder?: string`
- `disabled?: boolean`
- `className?: string`
- `ref?: React.Ref<HTMLButtonElement>`

### 4. `date-picker.test.tsx`
Tests covering:
- Smoke render
- Renders placeholder when no date
- Renders formatted date when date is provided
- Opens popover on trigger click
- Selecting a date closes popover and updates trigger text
- Controlled mode (`date` + `onDateChange`)
- Uncontrolled mode (`defaultDate`)
- Custom `formatDate` function
- Disabled state prevents opening
- `data-slot` presence
- vitest-axe accessibility

### 5. `date-picker.stories.tsx`
CSF3 stories with `tags: ['autodocs']`:
- Default (uncontrolled)
- Controlled
- WithDefaultDate
- WithCustomFormat
- Disabled
- WithPlaceholder

### Index Export
- Export `DatePicker` and `DatePickerProps` from `packages/ui/src/index.ts`

## Key Constraints

- No CVA variants — styles are static string constants
- Date formatting uses `Intl.DateTimeFormat` (no date-fns dependency)
- All icons are inline SVGs — no icon library
- Must compose existing Popover, Button, and Calendar components

## Dependencies

- **Task t02** must be complete (Calendar component)
- Milestone 1 components: Popover, PopoverTrigger, PopoverContent
- Milestone 2 components: Button (outline variant)
- `cn()` helper

## Verification Criteria

1. All 5 files exist under `packages/ui/src/components/date-picker/`
2. `DatePicker` and `DatePickerProps` are exported from `packages/ui/src/index.ts`
3. `pnpm test` passes for date-picker tests including vitest-axe
4. `pnpm typecheck` passes with no errors
5. Date Picker renders in Storybook with all stories visible
6. Selecting a date updates the trigger text and closes the popover
7. `data-slot="date-picker"` is present on root element
8. No new dependencies introduced (uses existing Popover, Button, Calendar)