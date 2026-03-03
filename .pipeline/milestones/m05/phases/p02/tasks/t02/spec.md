# Task: Calendar Component

## Objective

Create the Calendar component — a shadcn port wrapping `react-day-picker` (v9.x) with custom Tailwind/OKLCH styling. The Calendar supports three selection modes (`single`, `range`, `multiple`) and uses the project's 5-file component pattern.

## Deliverables

Create 5 files under `packages/ui/src/components/calendar/`:

### 1. `calendar.tsx`
- Wraps `react-day-picker`'s `DayPicker` component
- Export: `Calendar`
- Applies custom `classNames` to every DayPicker v9 element using style constants from `.styles.ts`
- Overrides the `components` prop to provide a custom `Chevron` component — a functional component that receives `{ orientation }` and renders an inline SVG left or right chevron based on `orientation` (`"left"` or `"right"`)
  - Left chevron: `<path d="m15 18-6-6 6-6" />`
  - Right chevron: `<path d="m9 18 6-6-6-6" />`
  - SVG: `width="16" height="16"`, `fill="none"`, `stroke="currentColor"`, `strokeWidth="2"`, `strokeLinecap="round"`, `strokeLinejoin="round"`, `aria-hidden="true"`
- `button_previous` and `button_next` classNames style navigation buttons to match Button's `outline` variant at `icon` size
- Includes `data-slot="calendar"` on the root wrapper
- Accepts `ref` as prop (React 19 — no forwardRef)
- Supports all three selection modes via pass-through of `mode` prop

### 2. `calendar.styles.ts`
Named string constants for each DayPicker v9 `classNames` key:
- `calendarRootStyles` — root container with padding and space between months
- `calendarMonthsStyles` — months layout (flex with gap for multi-month)
- `calendarMonthStyles` — individual month wrapper with spacing
- `calendarMonthCaptionStyles` — month/year caption row, flex layout, centered text
- `calendarCaptionLabelStyles` — month/year text `text-sm font-medium`
- `calendarNavStyles` — navigation wrapper with flex and gap
- `calendarButtonPreviousStyles` — previous button styled as outline/icon Button
- `calendarButtonNextStyles` — next button styled as outline/icon Button
- `calendarMonthGridStyles` — date grid table with border-collapse
- `calendarWeekdaysStyles` — row of day-of-week headers
- `calendarWeekdayStyles` — day-of-week label: `text-muted-foreground`, `text-xs`, rounded, fixed width
- `calendarWeekStyles` — row of day cells
- `calendarDayStyles` — day cell with relative positioning and centering
- `calendarDayButtonStyles` — clickable day button with hover/focus using `bg-accent`, `text-accent-foreground`; fixed aspect ratio
- `calendarSelectedStyles` — selected: `bg-primary text-primary-foreground`, hover `bg-primary/90`
- `calendarTodayStyles` — today: `bg-accent text-accent-foreground`
- `calendarOutsideStyles` — outside month: `text-muted-foreground opacity-50`
- `calendarDisabledStyles` — disabled: `text-muted-foreground opacity-50`, pointer-events-none
- `calendarRangeStartStyles` — rounded start corners
- `calendarRangeEndStyles` — rounded end corners
- `calendarRangeMiddleStyles` — `bg-accent text-accent-foreground`, no rounded corners
- `calendarHiddenStyles` — `invisible`
- `calendarFocusedStyles` — ring styles using `ring-ring`

### 3. `calendar.types.ts`
- `CalendarProps` extending `React.ComponentProps<typeof DayPicker>` with optional `className` override

### 4. `calendar.test.tsx`
Tests covering:
- Smoke render
- Renders current month by default
- Navigation to next/previous month via chevron buttons
- Single date selection (clicking a day fires `onSelect`)
- Date range selection (two clicks define start and end)
- Multiple date selection (clicking multiple days accumulates selection)
- Disabled dates are not selectable
- Outside-month dates render with muted styling
- Today's date has distinct styling
- `data-slot` presence
- vitest-axe accessibility

### 5. `calendar.stories.tsx`
CSF3 stories with `tags: ['autodocs']`:
- Default (single mode)
- DateRange (range mode)
- MultipleDates (multiple mode)
- WithDisabledDates
- WithDefaultMonth

### Index Export
- Export `Calendar` and `CalendarProps` from `packages/ui/src/index.ts`

## Key Constraints

- Do NOT import react-day-picker's default CSS — all styling via `classNames` prop with OKLCH semantic tokens
- `CalendarProps` extends `React.ComponentProps<typeof DayPicker>` to preserve full react-day-picker API
- No CVA variants — styles are static string constants (not CVA functions)
- All icons are inline SVGs — no icon library
- Use react-day-picker v9 API (`classNames` keys: `month_caption`, `caption_label`, `button_previous`, `button_next`, `month_grid`, `weekdays`, `weekday`, `week`, `day`, `day_button`, `selected`, `today`, `outside`, `disabled`, `range_start`, `range_end`, `range_middle`, etc.)

## Dependencies

- **Task t01** must be complete (react-day-picker installed)
- Milestone 1 components: Button (outline/icon variant styling reference)
- `cn()` helper from `packages/ui/src/lib/utils.ts`
- OKLCH semantic tokens from `packages/ui/styles/globals.css`

## Verification Criteria

1. All 5 files exist under `packages/ui/src/components/calendar/`
2. `Calendar` and `CalendarProps` are exported from `packages/ui/src/index.ts`
3. `pnpm test` passes for calendar tests including vitest-axe
4. `pnpm typecheck` passes with no errors
5. Calendar renders in Storybook with all stories visible
6. No react-day-picker default CSS is imported
7. `data-slot="calendar"` is present on root element