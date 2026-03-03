Now I have everything I need. The previous plan (plan-v1.md) was literally just an error message "Error: Reached max turns (25)" — so I need to write a complete implementation plan from scratch, following the task spec closely.

# Task Plan: Calendar Component (v2)

## 1. Overview

Create the Calendar component — a shadcn port wrapping `react-day-picker` (v9.x) with custom Tailwind/OKLCH styling. The Calendar supports three selection modes (`single`, `range`, `multiple`) via the `mode` prop and follows the project's 5-file component pattern.

**Predecessor**: Task t01 (completed) installed `react-day-picker` v9.x into `packages/ui/package.json` and updated `pnpm-lock.yaml`.

## 2. File Inventory

### Created (5 files)

| # | File | Purpose |
|---|------|---------|
| 1 | `packages/ui/src/components/calendar/calendar.types.ts` | TypeScript prop types extending `React.ComponentProps<typeof DayPicker>` |
| 2 | `packages/ui/src/components/calendar/calendar.styles.ts` | Named string constants for each DayPicker v9 `classNames` key |
| 3 | `packages/ui/src/components/calendar/calendar.tsx` | Implementation wrapping react-day-picker's `DayPicker` with custom styling |
| 4 | `packages/ui/src/components/calendar/calendar.test.tsx` | Vitest + Testing Library + vitest-axe test suite |
| 5 | `packages/ui/src/components/calendar/calendar.stories.tsx` | Storybook CSF3 stories with autodocs |

### Modified (1 file)

| # | File | Change |
|---|------|--------|
| 1 | `packages/ui/src/index.ts` | Add exports for `Calendar` and `CalendarProps` |

## 3. Implementation Details

### 3.1 `calendar.types.ts`

```typescript
import type { DayPicker } from 'react-day-picker';

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  className?: string;
};
```

- Extends `React.ComponentProps<typeof DayPicker>` to preserve the full react-day-picker API surface
- The `className` override allows consumers to apply additional Tailwind classes to the root element
- No `asChild` prop — Calendar wraps a third-party library, not a native HTML element
- No CVA `VariantProps` — Calendar has no visual variants (single presentation)

### 3.2 `calendar.styles.ts`

Exports named string constants (not CVA functions) for each DayPicker v9 `classNames` key. This follows the same pattern used by `popover.styles.ts` and `dialog.styles.ts` for components without visual variants.

**Exported constants:**

| Constant | DayPicker v9 Key | Tailwind Classes (summary) |
|----------|-----------------|---------------------------|
| `calendarRootStyles` | `root` | `p-3` — root container padding |
| `calendarMonthsStyles` | `months` | `flex flex-col gap-4 sm:flex-row` — multi-month layout |
| `calendarMonthStyles` | `month` | `flex flex-col gap-4` — single month spacing |
| `calendarMonthCaptionStyles` | `month_caption` | `flex items-center justify-center pt-1 relative` — caption row layout |
| `calendarCaptionLabelStyles` | `caption_label` | `text-sm font-medium` — month/year text |
| `calendarNavStyles` | `nav` | `flex items-center gap-1` — navigation button container |
| `calendarButtonPreviousStyles` | `button_previous` | `absolute left-1` + outline/icon Button sizing (`inline-flex items-center justify-center rounded-md border border-input bg-background h-7 w-7 hover:bg-accent hover:text-accent-foreground`) — left nav button |
| `calendarButtonNextStyles` | `button_next` | `absolute right-1` + same outline/icon Button sizing — right nav button |
| `calendarMonthGridStyles` | `month_grid` | `w-full border-collapse space-y-1` — table element |
| `calendarWeekdaysStyles` | `weekdays` | (empty or flex row) — header row of day-of-week labels |
| `calendarWeekdayStyles` | `weekday` | `text-muted-foreground text-xs font-normal w-9 rounded-md` — individual weekday label |
| `calendarWeekStyles` | `week` | `flex w-full mt-2` — row of day cells |
| `calendarDayStyles` | `day` | `relative p-0 text-center text-sm h-9 w-9` — cell container |
| `calendarDayButtonStyles` | `day_button` | `inline-flex items-center justify-center h-9 w-9 rounded-md font-normal hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring` — clickable day |
| `calendarSelectedStyles` | `selected` | `bg-primary text-primary-foreground hover:bg-primary/90` — selected state |
| `calendarTodayStyles` | `today` | `bg-accent text-accent-foreground` — today highlight |
| `calendarOutsideStyles` | `outside` | `text-muted-foreground opacity-50` — dates outside current month |
| `calendarDisabledStyles` | `disabled` | `text-muted-foreground opacity-50 pointer-events-none` — non-selectable dates |
| `calendarRangeStartStyles` | `range_start` | `rounded-l-md` — left-rounded range start |
| `calendarRangeEndStyles` | `range_end` | `rounded-r-md` — right-rounded range end |
| `calendarRangeMiddleStyles` | `range_middle` | `bg-accent text-accent-foreground rounded-none` — inner range dates |
| `calendarHiddenStyles` | `hidden` | `invisible` — hidden days |

No `focused` key is exported — focus styling is handled via the `day_button` `focus-visible` utilities.

### 3.3 `calendar.tsx`

```
Import: DayPicker from 'react-day-picker'
Import: cn from '../../lib/utils.js'
Import: all style constants from './calendar.styles.js'
Import type: CalendarProps from './calendar.types.js'
Re-export type: CalendarProps from './calendar.types.js'
```

**Component structure:**

```typescript
export function Calendar({ className, classNames, components, ...props }: CalendarProps) {
  return (
    <DayPicker
      data-slot="calendar"
      className={cn(calendarRootStyles, className)}
      classNames={{
        months: calendarMonthsStyles,
        month: calendarMonthStyles,
        month_caption: calendarMonthCaptionStyles,
        caption_label: calendarCaptionLabelStyles,
        nav: calendarNavStyles,
        button_previous: calendarButtonPreviousStyles,
        button_next: calendarButtonNextStyles,
        month_grid: calendarMonthGridStyles,
        weekdays: calendarWeekdaysStyles,
        weekday: calendarWeekdayStyles,
        week: calendarWeekStyles,
        day: calendarDayStyles,
        day_button: calendarDayButtonStyles,
        selected: calendarSelectedStyles,
        today: calendarTodayStyles,
        outside: calendarOutsideStyles,
        disabled: calendarDisabledStyles,
        range_start: calendarRangeStartStyles,
        range_end: calendarRangeEndStyles,
        range_middle: calendarRangeMiddleStyles,
        hidden: calendarHiddenStyles,
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {orientation === 'left' ? (
              <path d="m15 18-6-6 6-6" />
            ) : (
              <path d="m9 18 6-6-6-6" />
            )}
          </svg>
        ),
        ...components,
      }}
      {...props}
    />
  );
}
```

**Key decisions:**

1. **`data-slot="calendar"`** is applied to the root `DayPicker` element.
2. **`classNames` are spread with consumer overrides last** (`...classNames`) so consumers can override individual DayPicker element styles.
3. **`components` are spread with consumer overrides last** (`...components`) so consumers can override the Chevron or any other DayPicker sub-component.
4. **No `ref` destructuring** — `DayPicker` is not a native HTML element, and react-day-picker v9's `DayPicker` does not accept a `ref` prop. The `ref` will be included in the spread `...props` if present in `CalendarProps` via the `React.ComponentProps` extension.
5. **Chevron component** — Inline functional component matching the established SVG pattern from `pagination.tsx` and `breadcrumb.tsx`. Uses `orientation` prop from react-day-picker v9 to determine left/right arrow direction.
6. **No `showOutsideDays` default** — the task spec does not specify a default; consumers opt in via the standard react-day-picker `showOutsideDays` prop.
7. **All icons use inline SVGs** — consistent with existing components (pagination, breadcrumb, dropdown-menu, select, accordion, checkbox). No icon library dependency.

### 3.4 `calendar.test.tsx`

```
Import: render, screen from '@testing-library/react'
Import: userEvent from '@testing-library/user-event'
Import: axe from 'vitest-axe'
Import: describe, expect, it, vi from 'vitest'
Import: Calendar from './calendar.js'
```

**Test cases:**

| # | Test | Approach |
|---|------|----------|
| 1 | Smoke render | `render(<Calendar />)` — verify no crash |
| 2 | Renders current month by default | Check for the current month name text in document |
| 3 | `data-slot` attribute | `render(<Calendar />)` — query `[data-slot="calendar"]` |
| 4 | Navigation: next month | Click the next chevron button, verify month label changes |
| 5 | Navigation: previous month | Click the previous chevron button, verify month label changes |
| 6 | Single date selection | `render(<Calendar mode="single" onSelect={spy} />)` — click a day button, verify `onSelect` called |
| 7 | Range date selection | `render(<Calendar mode="range" onSelect={spy} />)` — click two day buttons, verify `onSelect` called with range |
| 8 | Multiple date selection | `render(<Calendar mode="multiple" onSelect={spy} />)` — click multiple days, verify `onSelect` called with array |
| 9 | Disabled dates | `render(<Calendar mode="single" disabled={[new Date()]} />)` — verify the disabled day button has `disabled` attribute or appropriate styling |
| 10 | Custom className | `render(<Calendar className="custom-class" />)` — verify root element has `custom-class` |
| 11 | Accessibility (vitest-axe) | `const { container } = render(<Calendar />)` — `expect(await axe(container)).toHaveNoViolations()` |

### 3.5 `calendar.stories.tsx`

```
Import: Meta, StoryObj from '@storybook/react-vite'
Import: Calendar from './calendar.js'
```

**Meta configuration:**
```typescript
const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Calendar>;
```

**Stories:**

| # | Story Name | Configuration |
|---|------------|---------------|
| 1 | `Default` | `args: { mode: 'single' }` — basic single-date calendar |
| 2 | `DateRange` | `args: { mode: 'range' }` — range selection mode |
| 3 | `MultipleDates` | `args: { mode: 'multiple' }` — multiple selection mode |
| 4 | `WithDisabledDates` | `render` function passing `disabled` prop with specific dates |
| 5 | `WithDefaultMonth` | `args: { defaultMonth: new Date(2025, 0, 1) }` — starts at a specific month |

### 3.6 `packages/ui/src/index.ts` Modification

Append the following exports:

```typescript
export { Calendar, type CalendarProps } from './components/calendar/calendar.js';
```

No styles export needed since Calendar uses string constants that are internal implementation details (not CVA variant functions that consumers would compose with).

## 4. Implementation Order

1. **`calendar.types.ts`** — Define props first so the implementation file can import them
2. **`calendar.styles.ts`** — Define all style constants so the implementation file can reference them
3. **`calendar.tsx`** — Implement the component using types and styles
4. **`calendar.test.tsx`** — Write tests against the implementation
5. **`calendar.stories.tsx`** — Write stories for visual documentation
6. **`packages/ui/src/index.ts`** — Add public API exports

## 5. Verification

After implementation, run these commands to verify:

| # | Command | Expected Result |
|---|---------|-----------------|
| 1 | `pnpm typecheck` | Zero TypeScript errors across the monorepo |
| 2 | `pnpm test --filter @components/ui` | All calendar tests pass including vitest-axe |
| 3 | `pnpm build` | Successful build with calendar included in output |

## 6. Exit Criteria

1. All 5 files exist under `packages/ui/src/components/calendar/`
2. `Calendar` and `CalendarProps` are exported from `packages/ui/src/index.ts`
3. `pnpm test` passes for calendar tests including vitest-axe accessibility assertions
4. `pnpm typecheck` passes with no errors
5. Calendar renders in Storybook with all 5 stories visible via autodocs
6. No react-day-picker default CSS is imported — all styling via `classNames` prop with OKLCH semantic tokens
7. `data-slot="calendar"` is present on root element
8. Calendar supports `single`, `range`, and `multiple` selection modes via the `mode` prop
9. Navigation chevrons use inline SVGs matching the established project pattern (no icon library)
10. All classNames use the react-day-picker v9 API keys (`month_caption`, `caption_label`, `button_previous`, `button_next`, `month_grid`, `day_button`, etc.)

## 7. Dependencies

### Required (must exist before this task starts)

- **Task t01** (completed): `react-day-picker` v9.x installed in `packages/ui/package.json`
- **Milestone 1**: Button component (styling reference for outline/icon variant dimensions)
- `packages/ui/src/lib/utils.ts`: `cn()` helper
- `packages/ui/styles/globals.css`: OKLCH semantic tokens (light/dark)
- Vitest + Testing Library + vitest-axe test infrastructure
- Storybook 8.5 with CSF3 and autodocs support

### Not required

- No new npm packages need to be installed (react-day-picker was installed in t01)
- No Radix UI primitives needed (Calendar wraps react-day-picker directly)

## 8. Design Deviations

### Deviation 1: No CVA in `.styles.ts`

**Spec says**: AGENTS.md Component Creation Guide shows `cva()` as the pattern for `.styles.ts` files.

**Plan does**: Exports named string constants instead of CVA functions.

**Justification**: Calendar has a single visual presentation with no variant/size axes. CVA adds unnecessary complexity when there are no variants to manage. This approach is already established in the codebase — `popover.styles.ts` and `dialog.styles.ts` use the same string constant pattern for components without variants. The phase spec (section "Design Decision 7") explicitly states: "Calendar and Date Picker do not need CVA variant definitions... The `.styles.ts` files export named string constants."

### Deviation 2: No `asChild` prop

**Spec says**: AGENTS.md checklist includes `asChild` as a standard prop pattern.

**Plan does**: Calendar does not support `asChild`.

**Justification**: Calendar wraps `react-day-picker`'s `DayPicker` component, not a native HTML element. The `asChild` + Radix `Slot` pattern is designed for polymorphic rendering of leaf elements (e.g., rendering a Button as an `<a>` tag). It is not applicable to a complex third-party calendar widget. This is consistent with how other wrapper components in the codebase handle non-native primitives.

### Deviation 3: No variant function exported from `index.ts`

**Spec says**: The export pattern in MASTER_PLAN shows exporting CVA variant functions (e.g., `buttonVariants`).

**Plan does**: Only exports `Calendar` and `CalendarProps` — no style constants.

**Justification**: Since there are no CVA variant functions (see Deviation 1), there are no variant exports for consumers to compose. The internal string constants are implementation details, not part of the public API. This matches how other non-CVA components handle their exports.