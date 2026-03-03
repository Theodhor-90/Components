I now have all the context needed. Let me produce the complete phase specification document.

# Phase 2: Calendar & Date Pickers — Detailed Specification

## Goal

Deliver the calendar primitive and two date/time picker components — Calendar, Date Picker, and Time Picker — that compose existing Popover, Button, and Select components with the `react-day-picker` library, enabling consumer apps to implement single/range/multiple date selection, formatted date trigger displays, and hour/minute time input in a 24-hour format, all styled with the project's OKLCH semantic tokens and following the established 5-file component pattern.

## Design Decisions

### 1. Calendar Wraps react-day-picker with Custom Styling

The Calendar component wraps `react-day-picker` (v9.x) using its unstyled/classNames API to apply Tailwind utility classes mapped to OKLCH semantic tokens. We do **not** import react-day-picker's default CSS. Instead, the `.styles.ts` file defines class name strings for each react-day-picker element (`months`, `month`, `caption`, `nav`, `table`, `head_row`, `row`, `cell`, `day`, `day_selected`, `day_today`, `day_outside`, `day_disabled`, `day_range_middle`, `day_range_start`, `day_range_end`, etc.) using Tailwind classes and the project's semantic tokens.

**Rationale:** This ensures Calendar integrates seamlessly with the theme system (light/dark, OKLCH tokens) and avoids shipping third-party CSS that would conflict with the project's styling approach. shadcn/ui takes the same approach.

### 2. Calendar Exposes react-day-picker Props Transparently

`CalendarProps` extends `React.ComponentProps<typeof DayPicker>` from react-day-picker, adding only `className` override. The `mode` prop (`"single" | "range" | "multiple"`) and all selection-related props (`selected`, `onSelect`, `disabled`, `defaultMonth`, etc.) are passed through directly. Navigation chevron buttons use the existing `Button` component in `outline` variant at `icon` size via the `components` prop of DayPicker.

**Rationale:** Preserving react-day-picker's full API avoids creating a leaky abstraction. Consumer apps can leverage any react-day-picker feature without the Calendar component becoming a bottleneck.

### 3. Date Picker Is a Composed Pattern, Not a Primitive Wrapper

Date Picker is **not** a Radix primitive wrapper — it is a composed component that assembles `Popover`, `PopoverTrigger`, `PopoverContent`, `Button`, and `Calendar`. It manages its own open/close state and formats the selected date for display in the trigger button. It accepts `date` / `onDateChange` for controlled usage and manages internal state for uncontrolled usage. The trigger renders a `Button` in `outline` variant with a calendar icon and the formatted date (or placeholder text).

**Rationale:** This matches the shadcn/ui "Date Picker" pattern, which is documented as a composed example rather than a standalone primitive. Keeping it as a single component with clear props makes it easy for consumers to drop in a date picker without manually wiring Popover + Calendar.

### 4. Time Picker Composes Select for Hour/Minute Inputs

Time Picker uses two `Select` components (from Milestone 2) inside a `Popover` — one for hours (00–23) and one for minutes (00–59). The trigger displays the current time in `HH:mm` format or placeholder text. This avoids raw `<input type="number">` elements, which have inconsistent browser UX and accessibility, and leverages the already-tested Select component.

**Rationale:** Using Select provides consistent styling, keyboard navigation, and accessibility across browsers. The Popover wrapper keeps the time selection contained in a floating panel, consistent with Date Picker's UX pattern.

### 5. Date Formatting Uses Intl.DateTimeFormat

Date Picker formats dates using the native `Intl.DateTimeFormat` API rather than adding a date formatting library (e.g., date-fns). The default format is `PPP`-equivalent (e.g., "March 3, 2026") using `{ year: 'numeric', month: 'long', day: 'numeric' }`. Consumers can override formatting via a `formatDate` prop that accepts `(date: Date) => string`.

**Rationale:** Avoids adding `date-fns` as a dependency solely for display formatting. `Intl.DateTimeFormat` is natively available, locale-aware, and sufficient for the trigger button display. Consumers who need custom formatting can provide their own formatter.

### 6. No CVA Variants for Calendar or Date Picker

Calendar and Date Picker do not need CVA variant definitions with multiple visual variants (unlike Button's `variant`/`size`). Their styles are static class name strings defined in `.styles.ts`. The `.styles.ts` files export named string constants (similar to Popover's `popoverContentStyles`) rather than CVA functions. Time Picker follows the same approach.

**Rationale:** These components have a single visual presentation. Introducing CVA variants would add complexity with no consumer benefit. The `.styles.ts` file still centralizes all Tailwind classes, maintaining the 5-file pattern contract.

## Tasks

### Task 1: Install react-day-picker Dependency

**Deliverables:**

- Install `react-day-picker` (latest v9.x) as a dependency in `packages/ui/package.json`
- Run `pnpm install` to update the lockfile
- Verify the package resolves correctly with `pnpm ls react-day-picker` in the `packages/ui` directory

### Task 2: Calendar Component

**Deliverables:**

- `packages/ui/src/components/calendar/calendar.tsx` — Implementation wrapping `react-day-picker`'s `DayPicker` component. Exports: `Calendar`. Applies custom `classNames` to every DayPicker element using the styles from `.styles.ts`. Overrides the DayPicker `components` prop to use the existing `Button` component (variant `outline`, size `icon`) for navigation chevron buttons (using `ChevronLeft` and `ChevronRight` from `lucide-react`). Includes `data-slot="calendar"` on the root wrapper. Accepts `ref` as prop (React 19). Supports all three selection modes (`single`, `range`, `multiple`) via pass-through of `mode` prop.

- `packages/ui/src/components/calendar/calendar.styles.ts` — Named string constants for each DayPicker `classNames` key: `calendarStyles` (root container with padding), `calendarMonthsStyles` (month grid layout), `calendarMonthStyles`, `calendarCaptionStyles` (month/year header with flex layout), `calendarNavStyles` (navigation button positioning), `calendarNavButtonStyles` (chevron button sizing), `calendarTableStyles` (date grid), `calendarHeadRowStyles`, `calendarHeadCellStyles` (day-of-week labels with `text-muted-foreground`), `calendarRowStyles`, `calendarCellStyles` (individual date cell sizing), `calendarDayStyles` (base day button with hover/focus states using `bg-accent`), `calendarDaySelectedStyles` (`bg-primary text-primary-foreground`), `calendarDayTodayStyles` (`bg-accent text-accent-foreground`), `calendarDayOutsideStyles` (`text-muted-foreground` for dates outside current month), `calendarDayDisabledStyles` (`text-muted-foreground opacity-50`), `calendarDayRangeStartStyles`, `calendarDayRangeEndStyles` (rounded endpoints), `calendarDayRangeMiddleStyles` (`bg-accent` for range fill).

- `packages/ui/src/components/calendar/calendar.types.ts` — `CalendarProps` extending `React.ComponentProps<typeof DayPicker>` with optional `className` override.

- `packages/ui/src/components/calendar/calendar.test.tsx` — Tests covering: smoke render, renders current month by default, navigation to next/previous month via chevron buttons, single date selection (clicking a day fires `onSelect`), date range selection (two clicks define start and end), multiple date selection (clicking multiple days accumulates selection), disabled dates are not selectable, outside-month dates render with muted styling, today's date has distinct styling, `data-slot` presence, vitest-axe accessibility.

- `packages/ui/src/components/calendar/calendar.stories.tsx` — CSF3 stories with autodocs: Default (single mode), DateRange (range mode), MultipleDates (multiple mode), WithDisabledDates, WithDefaultMonth, CustomFormatting.

- Export `Calendar` and `CalendarProps` from `packages/ui/src/index.ts`.

### Task 3: Date Picker Component

**Deliverables:**

- `packages/ui/src/components/date-picker/date-picker.tsx` — Composed component using `Popover`, `PopoverTrigger`, `PopoverContent`, `Button`, and `Calendar`. Exports: `DatePicker`. The trigger is a `Button` (variant `outline`) displaying a `CalendarIcon` from `lucide-react` and the formatted date text (or "Pick a date" placeholder when no date is selected). Clicking the trigger opens the Popover containing a Calendar in `single` mode. Selecting a date closes the Popover and updates the display. Supports controlled usage via `date` / `onDateChange` props and uncontrolled usage with `defaultDate`. Accepts a `formatDate` prop `(date: Date) => string` for custom formatting (defaults to `Intl.DateTimeFormat` with `{ year: 'numeric', month: 'long', day: 'numeric' }`). Accepts a `placeholder` prop for the empty state text. Includes `data-slot="date-picker"` on the root element. Accepts `ref` on the trigger button.

- `packages/ui/src/components/date-picker/date-picker.styles.ts` — Named string constants: `datePickerTriggerStyles` (button width, text alignment, font styling — `text-muted-foreground` when no date selected, normal text when date is selected).

- `packages/ui/src/components/date-picker/date-picker.types.ts` — `DatePickerProps` with: `date?: Date`, `defaultDate?: Date`, `onDateChange?: (date: Date | undefined) => void`, `formatDate?: (date: Date) => string`, `placeholder?: string`, `disabled?: boolean`, `className?: string`, `ref?: React.Ref<HTMLButtonElement>`.

- `packages/ui/src/components/date-picker/date-picker.test.tsx` — Tests covering: smoke render, renders placeholder when no date, renders formatted date when date is provided, opens popover on trigger click, selecting a date closes popover and updates trigger text, controlled mode (`date` + `onDateChange`), uncontrolled mode (`defaultDate`), custom `formatDate` function, disabled state prevents opening, `data-slot` presence, vitest-axe accessibility.

- `packages/ui/src/components/date-picker/date-picker.stories.tsx` — CSF3 stories with autodocs: Default (uncontrolled), Controlled, WithDefaultDate, WithCustomFormat, Disabled, WithPlaceholder.

- Export `DatePicker` and `DatePickerProps` from `packages/ui/src/index.ts`.

### Task 4: Time Picker Component

**Deliverables:**

- `packages/ui/src/components/time-picker/time-picker.tsx` — Composed component using `Popover`, `PopoverTrigger`, `PopoverContent`, `Button`, and two `Select` instances. Exports: `TimePicker`. The trigger is a `Button` (variant `outline`) displaying a `Clock` icon from `lucide-react` and the current time in `HH:mm` format (or "Pick a time" placeholder). The Popover content contains two `Select` components side by side: one for hours (options 00–23) and one for minutes (options 00–59). Selecting both hour and minute updates the trigger display. Supports controlled usage via `value` (string in `"HH:mm"` format) / `onChange` props and uncontrolled usage with `defaultValue`. Includes `data-slot="time-picker"` on the root element. Accepts `ref` on the trigger button.

- `packages/ui/src/components/time-picker/time-picker.styles.ts` — Named string constants: `timePickerTriggerStyles` (button width and text styling, `text-muted-foreground` when no time selected), `timePickerContentStyles` (Popover content layout — flex row with gap for the two Select inputs), `timePickerSeparatorStyles` (the `:` separator between hour and minute selects).

- `packages/ui/src/components/time-picker/time-picker.types.ts` — `TimePickerProps` with: `value?: string` (HH:mm format), `defaultValue?: string`, `onChange?: (value: string) => void`, `disabled?: boolean`, `placeholder?: string`, `className?: string`, `ref?: React.Ref<HTMLButtonElement>`.

- `packages/ui/src/components/time-picker/time-picker.test.tsx` — Tests covering: smoke render, renders placeholder when no time, renders formatted time when value is provided, opens popover on trigger click, selecting hour and minute updates trigger text, controlled mode (`value` + `onChange`), uncontrolled mode (`defaultValue`), disabled state prevents opening, hour options range from 00 to 23, minute options range from 00 to 59, `data-slot` presence, vitest-axe accessibility.

- `packages/ui/src/components/time-picker/time-picker.stories.tsx` — CSF3 stories with autodocs: Default (uncontrolled), Controlled, WithDefaultValue, Disabled, WithPlaceholder.

- Export `TimePicker` and `TimePickerProps` from `packages/ui/src/index.ts`.

### Task 5: Integration Verification

**Deliverables:**

- Run `pnpm typecheck` across the monorepo — zero errors
- Run `pnpm test` across the monorepo — all tests pass including new Calendar, Date Picker, and Time Picker tests
- Run `pnpm build` — successful build with all new components included in output
- Verify all new exports are accessible from `@components/ui` by checking the built output
- Verify Storybook renders all new stories with `pnpm storybook` (manual check or build)

## Exit Criteria

1. All 3 components (Calendar, Date Picker, Time Picker) render correctly in Storybook with all variants and states documented via autodocs
2. `pnpm test` passes with zero failures, including vitest-axe accessibility assertions for all 3 components
3. `pnpm typecheck` passes with no TypeScript errors across the monorepo
4. Calendar renders navigable month views with chevron buttons and supports single-date, date-range, and multiple-date selection via the `mode` prop
5. Calendar styling uses OKLCH semantic tokens (`bg-primary`, `text-primary-foreground`, `bg-accent`, `text-muted-foreground`, etc.) with no react-day-picker default CSS imported
6. Date Picker displays the formatted selected date in its trigger button and opens/closes the Calendar Popover on click
7. Date Picker supports both controlled (`date` + `onDateChange`) and uncontrolled (`defaultDate`) usage
8. Time Picker renders two Select inputs for hour (00–23) and minute (00–59) inside a Popover
9. Time Picker supports both controlled (`value` + `onChange`) and uncontrolled (`defaultValue`) usage
10. All 3 components include `data-slot` attributes following the established naming convention
11. All components, prop types, and style exports are exported from `packages/ui/src/index.ts`

## Dependencies

### Prior Milestones (must be complete)

- **Milestone 1: Foundation** — Popover (composed by Date Picker and Time Picker), Button (used as Date Picker trigger, Calendar navigation chevrons, Time Picker trigger)
- **Milestone 2: Form Controls** — Select with SelectTrigger, SelectContent, SelectItem, SelectValue (composed by Time Picker for hour and minute inputs)
- **Milestone 5, Phase 1: Menus** — No direct dependency, but must be complete as it is the preceding phase in the milestone

### Infrastructure (must exist)

- `packages/ui/src/lib/utils.ts` — `cn()` helper
- `packages/ui/styles/globals.css` — OKLCH semantic tokens (light/dark)
- `lucide-react` — Icon library (for `ChevronLeft`, `ChevronRight`, `CalendarIcon`, `Clock` icons)
- Vitest + Testing Library + vitest-axe test infrastructure
- Storybook 8.5 with CSF3 and autodocs support

### External Libraries (to be installed in Task 1)

| Package           | Version | Used By               |
| ----------------- | ------- | --------------------- |
| `react-day-picker` | latest (v9.x) | Calendar, Date Picker |

### Already Available

- `@radix-ui/react-popover` — installed in Milestone 1
- `@radix-ui/react-select` — installed in Milestone 2
- `lucide-react` — installed in project setup
- `class-variance-authority`, `tailwind-merge`, `clsx` — installed in project setup

## Artifacts

### Created

| Artifact                                                         | Description                                         |
| ---------------------------------------------------------------- | --------------------------------------------------- |
| `packages/ui/src/components/calendar/calendar.tsx`               | Calendar implementation wrapping react-day-picker    |
| `packages/ui/src/components/calendar/calendar.styles.ts`         | Tailwind class name constants for DayPicker elements |
| `packages/ui/src/components/calendar/calendar.types.ts`          | TypeScript prop types                               |
| `packages/ui/src/components/calendar/calendar.test.tsx`          | Test suite                                          |
| `packages/ui/src/components/calendar/calendar.stories.tsx`       | Storybook stories                                   |
| `packages/ui/src/components/date-picker/date-picker.tsx`         | Date Picker composing Popover + Calendar + Button   |
| `packages/ui/src/components/date-picker/date-picker.styles.ts`   | Trigger and content style constants                  |
| `packages/ui/src/components/date-picker/date-picker.types.ts`    | TypeScript prop types                               |
| `packages/ui/src/components/date-picker/date-picker.test.tsx`    | Test suite                                          |
| `packages/ui/src/components/date-picker/date-picker.stories.tsx` | Storybook stories                                   |
| `packages/ui/src/components/time-picker/time-picker.tsx`         | Time Picker composing Popover + Select + Button     |
| `packages/ui/src/components/time-picker/time-picker.styles.ts`   | Trigger, content, and separator style constants      |
| `packages/ui/src/components/time-picker/time-picker.types.ts`    | TypeScript prop types                               |
| `packages/ui/src/components/time-picker/time-picker.test.tsx`    | Test suite                                          |
| `packages/ui/src/components/time-picker/time-picker.stories.tsx` | Storybook stories                                   |

### Modified

| Artifact                   | Change                                                                        |
| -------------------------- | ----------------------------------------------------------------------------- |
| `packages/ui/package.json` | Add `react-day-picker` to dependencies                                        |
| `packages/ui/src/index.ts` | Add exports for Calendar, DatePicker, TimePicker and their prop types          |
| `pnpm-lock.yaml`           | Updated with new dependency resolution                                        |