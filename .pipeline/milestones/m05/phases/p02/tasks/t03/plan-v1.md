I now have all the information needed to produce the detailed implementation plan. Here it is:

## 1. Deliverables

### Created (5 files)

| # | File | Purpose |
|---|------|---------|
| 1 | `packages/ui/src/components/date-picker/date-picker.types.ts` | TypeScript prop types for the DatePicker component |
| 2 | `packages/ui/src/components/date-picker/date-picker.styles.ts` | Named string constants for trigger styling |
| 3 | `packages/ui/src/components/date-picker/date-picker.tsx` | Composed component assembling Popover + Calendar + Button |
| 4 | `packages/ui/src/components/date-picker/date-picker.test.tsx` | Vitest + Testing Library + vitest-axe test suite |
| 5 | `packages/ui/src/components/date-picker/date-picker.stories.tsx` | Storybook CSF3 stories with autodocs |

### Modified (1 file)

| # | File | Change |
|---|------|--------|
| 1 | `packages/ui/src/index.ts` | Add exports for `DatePicker` and `DatePickerProps` |

## 2. Dependencies

### Prerequisites

- **Task t01** (completed): `react-day-picker` v9.x installed in `packages/ui/package.json`
- **Task t02** (completed): Calendar component implemented at `packages/ui/src/components/calendar/`
- **Milestone 1**: Popover (`Popover`, `PopoverTrigger`, `PopoverContent`) at `packages/ui/src/components/popover/`
- **Milestone 2**: Button (`Button` with `outline` variant) at `packages/ui/src/components/button/`
- **@components/hooks**: `useControllableState` hook (already a dependency in `packages/ui/package.json`)

### No new packages to install

All required dependencies are already available. No new `pnpm install` needed.

## 3. Implementation Details

### 3.1 `date-picker.types.ts`

**Purpose:** Define the public prop interface for the DatePicker component.

**Exports:** `DatePickerProps`

```typescript
export type DatePickerProps = {
  /** Selected date (controlled mode) */
  date?: Date;
  /** Initial date (uncontrolled mode) */
  defaultDate?: Date;
  /** Callback when date changes */
  onDateChange?: (date: Date | undefined) => void;
  /** Custom date formatting function */
  formatDate?: (date: Date) => string;
  /** Placeholder text when no date selected (default: "Pick a date") */
  placeholder?: string;
  /** Disable the date picker */
  disabled?: boolean;
  /** Additional CSS classes on the root element */
  className?: string;
  /** Ref forwarded to the trigger button */
  ref?: React.Ref<HTMLButtonElement>;
};
```

**Key decisions:**
- Does NOT extend `React.ComponentProps<'button'>` — DatePicker is a composed component, not a button wrapper. The root element is a Radix Popover root (`div`), and the trigger is a `Button`. Spreading arbitrary button props would be confusing.
- Does NOT use `asChild` — this is a composed pattern, not a primitive wrapper
- Does NOT use CVA `VariantProps` — no visual variants
- `ref` is typed as `React.Ref<HTMLButtonElement>` since it forwards to the trigger Button

### 3.2 `date-picker.styles.ts`

**Purpose:** Named string constants for DatePicker trigger styling.

**Exports:** `datePickerTriggerStyles`, `datePickerPlaceholderStyles`

```typescript
export const datePickerTriggerStyles =
  'w-[280px] justify-start text-left font-normal';

export const datePickerPlaceholderStyles = 'text-muted-foreground';
```

**Details:**
- `datePickerTriggerStyles` — Applied to the Button trigger. Sets a fixed width, left-justifies the text, and uses normal font weight (overriding Button's default `font-medium`). These classes are merged with Button's `outline` variant classes via `cn()`.
- `datePickerPlaceholderStyles` — Applied conditionally to the trigger text span when no date is selected. Uses `text-muted-foreground` for a dimmed placeholder appearance.

### 3.3 `date-picker.tsx`

**Purpose:** The main DatePicker component that composes Popover, Button, and Calendar.

**Exports:** `DatePicker`, re-exports `DatePickerProps`

**Implementation:**

```typescript
import { useState } from 'react';
import { useControllableState } from '@components/hooks';

import { cn } from '../../lib/utils.js';
import { Button } from '../button/button.js';
import { Calendar } from '../calendar/calendar.js';
import { Popover, PopoverContent, PopoverTrigger } from '../popover/popover.js';
import { datePickerPlaceholderStyles, datePickerTriggerStyles } from './date-picker.styles.js';
import type { DatePickerProps } from './date-picker.types.js';

export type { DatePickerProps } from './date-picker.types.js';

const defaultFormatDate = (date: Date): string =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);

export function DatePicker({
  date: dateProp,
  defaultDate,
  onDateChange,
  formatDate = defaultFormatDate,
  placeholder = 'Pick a date',
  disabled,
  className,
  ref,
}: DatePickerProps): React.JSX.Element {
  const [open, setOpen] = useState(false);

  const [date, setDate] = useControllableState<Date | undefined>({
    prop: dateProp,
    defaultProp: defaultDate,
    onChange: onDateChange,
  });

  const handleSelect = (selected: Date | undefined) => {
    setDate(selected as Date | undefined);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          data-slot="date-picker"
          variant="outline"
          className={cn(datePickerTriggerStyles, className)}
          disabled={disabled}
          ref={ref}
        >
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
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
          </svg>
          {date ? (
            formatDate(date)
          ) : (
            <span className={datePickerPlaceholderStyles}>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
}
```

**Key behavior:**
1. **Controlled/uncontrolled:** Uses `useControllableState` from `@components/hooks` (same pattern as SearchInput). When `date` prop is provided, the component is controlled. Otherwise, it manages state internally via `defaultDate`.
2. **Popover open state:** Managed with `useState(false)`. Selecting a date calls `handleSelect` which updates the date and sets `open` to `false`.
3. **`data-slot="date-picker"`:** Placed on the trigger `Button` element. The spec says "on root element" — but since `Popover` (a Radix Root) is a context provider that renders no DOM node, the trigger Button is the logical root DOM element. This matches how `data-slot` is applied in other composed patterns.
4. **Trigger is `Button` with `variant="outline"`** using `asChild` on `PopoverTrigger` to avoid double-button nesting.
5. **Calendar icon:** Inline SVG at 16×16 display size with 24×24 viewBox, matching the Calendar component's chevron pattern.
6. **Default formatter:** `Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' })` produces e.g. "March 3, 2026".
7. **`ref`** forwards to the trigger Button element.
8. **Calendar `onSelect`:** In react-day-picker v9, `mode="single"` fires `onSelect` with `Date | undefined`. The `handleSelect` callback receives the selected date and closes the popover.

### 3.4 `date-picker.test.tsx`

**Purpose:** Comprehensive test suite for the DatePicker component.

**Test setup:** Uses `@testing-library/react`, `@testing-library/user-event`, `vitest`, `vitest-axe`. Tests run in jsdom environment per `vitest.config.ts`.

**Test inventory (11 tests):**

| # | Test name | What it verifies |
|---|-----------|-----------------|
| 1 | renders without crashing | Smoke test — DatePicker renders with trigger button |
| 2 | renders placeholder when no date | Trigger displays "Pick a date" with `text-muted-foreground` class |
| 3 | renders formatted date when date is provided | Controlled `date` prop shows formatted text in trigger |
| 4 | opens popover on trigger click | Clicking trigger renders Calendar inside popover |
| 5 | selecting a date closes popover and updates trigger text | Click a day → popover closes → trigger shows formatted date |
| 6 | controlled mode | `date` + `onDateChange` — external date is displayed, `onDateChange` fires on selection |
| 7 | uncontrolled mode | `defaultDate` — initial date is displayed, selecting a new date updates trigger |
| 8 | custom formatDate function | Custom formatter output appears in trigger |
| 9 | disabled state prevents opening | Disabled button is not clickable, popover does not open |
| 10 | data-slot presence | `data-slot="date-picker"` exists on trigger button |
| 11 | has no accessibility violations | `vitest-axe` passes with no violations |

**Implementation details:**

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { DatePicker } from './date-picker.js';
```

**Test 1 — smoke render:**
```typescript
it('renders without crashing', () => {
  render(<DatePicker />);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

**Test 2 — placeholder:**
```typescript
it('renders placeholder when no date', () => {
  render(<DatePicker />);
  expect(screen.getByText('Pick a date')).toBeInTheDocument();
  expect(screen.getByText('Pick a date')).toHaveClass('text-muted-foreground');
});
```

**Test 3 — formatted date:**
```typescript
it('renders formatted date when date is provided', () => {
  render(<DatePicker date={new Date(2025, 0, 15)} />);
  expect(screen.getByText('January 15, 2025')).toBeInTheDocument();
});
```

**Test 4 — opens popover:**
```typescript
it('opens popover on trigger click', async () => {
  const user = userEvent.setup();
  render(<DatePicker />);
  await user.click(screen.getByRole('button'));
  expect(document.querySelector('[data-slot="calendar"]')).toBeInTheDocument();
});
```

**Test 5 — select date closes popover:**
```typescript
it('selecting a date closes popover and updates trigger text', async () => {
  const user = userEvent.setup();
  render(<DatePicker defaultDate={undefined} />);
  await user.click(screen.getByRole('button'));
  // Click a specific day in the calendar
  const dayButtons = screen.getAllByRole('button').filter(
    (btn) => btn.closest('[data-slot="calendar"]') && !btn.getAttribute('aria-label')?.match(/previous|next/i)
  );
  // Click a day button that is a valid date in the current month
  const firstDay = screen.getByRole('button', { name: /1,/i });
  await user.click(firstDay);
  await waitFor(() => {
    expect(document.querySelector('[data-slot="calendar"]')).not.toBeInTheDocument();
  });
});
```

Note: The exact day selection approach needs to use react-day-picker v9's accessible day button names. In v9, day buttons have labels like `"January 15, 2025"`. The test should use a fixed `defaultMonth` to make the assertions deterministic. Revised approach:

```typescript
it('selecting a date closes popover and updates trigger text', async () => {
  const user = userEvent.setup();
  render(<DatePicker />);

  await user.click(screen.getByRole('button'));

  // Find and click a day in the calendar using the day label pattern
  const january2025 = new Date(2025, 0, 1);
  // We render with the default current month; use a known day label
  // For a deterministic test, we'll use a controlled approach
  const dayButton = screen.getByRole('button', { name: /January\D*15\D*2025/i });
  await user.click(dayButton);

  await waitFor(() => {
    expect(document.querySelector('[data-slot="calendar"]')).not.toBeInTheDocument();
  });
  expect(screen.getByText('January 15, 2025')).toBeInTheDocument();
});
```

Better approach — use a helper that opens the picker with a known month to make tests deterministic:

```typescript
const january2025 = new Date(2025, 0, 1);

// Helper component that wraps DatePicker with a known Calendar default month
// Since DatePicker does not expose defaultMonth, we test via controlled/uncontrolled patterns
```

**However**, DatePicker hardcodes `Calendar mode="single"` — it doesn't expose `defaultMonth`. The Calendar will default to the current month. For deterministic tests, the best approach is to pass a `date` prop (which sets `selected` on Calendar, and Calendar uses the selected date's month by default).

Revised test 5 implementation:

```typescript
it('selecting a date closes popover and updates trigger text', async () => {
  const user = userEvent.setup();
  const onDateChange = vi.fn();
  // Start with January 2025 date so calendar opens to January 2025
  render(<DatePicker date={new Date(2025, 0, 10)} onDateChange={onDateChange} />);

  await user.click(screen.getByRole('button'));

  // Click day 15 in the now-visible January 2025 calendar
  await user.click(screen.getByRole('button', { name: /January\D*15\D*2025/i }));

  expect(onDateChange).toHaveBeenCalled();
  await waitFor(() => {
    expect(document.querySelector('[data-slot="calendar"]')).not.toBeInTheDocument();
  });
});
```

**Test 6 — controlled mode:**
```typescript
it('supports controlled mode', async () => {
  const user = userEvent.setup();
  const onDateChange = vi.fn();
  render(<DatePicker date={new Date(2025, 0, 15)} onDateChange={onDateChange} />);

  expect(screen.getByText('January 15, 2025')).toBeInTheDocument();

  await user.click(screen.getByRole('button'));
  await user.click(screen.getByRole('button', { name: /January\D*20\D*2025/i }));

  expect(onDateChange).toHaveBeenCalled();
});
```

**Test 7 — uncontrolled mode:**
```typescript
it('supports uncontrolled mode', () => {
  render(<DatePicker defaultDate={new Date(2025, 5, 1)} />);
  expect(screen.getByText('June 1, 2025')).toBeInTheDocument();
});
```

**Test 8 — custom formatDate:**
```typescript
it('supports custom formatDate function', () => {
  const formatDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  render(<DatePicker date={new Date(2025, 0, 15)} formatDate={formatDate} />);
  expect(screen.getByText('2025-01-15')).toBeInTheDocument();
});
```

**Test 9 — disabled state:**
```typescript
it('disabled state prevents opening', async () => {
  const user = userEvent.setup();
  render(<DatePicker disabled />);

  const trigger = screen.getByRole('button');
  expect(trigger).toBeDisabled();

  await user.click(trigger);
  expect(document.querySelector('[data-slot="calendar"]')).not.toBeInTheDocument();
});
```

**Test 10 — data-slot:**
```typescript
it('has data-slot attribute', () => {
  render(<DatePicker />);
  expect(document.querySelector('[data-slot="date-picker"]')).toBeInTheDocument();
});
```

**Test 11 — accessibility:**
```typescript
it('has no accessibility violations', async () => {
  const { container } = render(<DatePicker />);
  expect(await axe(container)).toHaveNoViolations();
});
```

### 3.5 `date-picker.stories.tsx`

**Purpose:** Storybook CSF3 stories with autodocs for visual documentation.

**Exports:** `default` (meta), `Default`, `Controlled`, `WithDefaultDate`, `WithCustomFormat`, `Disabled`, `WithPlaceholder`

```typescript
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { DatePicker } from './date-picker.js';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DatePicker>;
```

**Stories:**

| Story | Implementation |
|-------|---------------|
| `Default` | `args: {}` — no props, renders with "Pick a date" placeholder |
| `Controlled` | `render` function using `useState<Date \| undefined>` — demonstrates two-way binding |
| `WithDefaultDate` | `args: { defaultDate: new Date(2025, 0, 15) }` — starts with January 15, 2025 |
| `WithCustomFormat` | `args: { date: new Date(2025, 0, 15), formatDate: (d) => d.toISOString().split('T')[0] }` — shows "2025-01-15" |
| `Disabled` | `args: { disabled: true }` — disabled trigger |
| `WithPlaceholder` | `args: { placeholder: 'Select date...' }` — custom placeholder text |

The `Controlled` story uses a render function:
```typescript
export const Controlled: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date(2025, 0, 15));
    return <DatePicker date={date} onDateChange={setDate} />;
  },
};
```

### 3.6 `packages/ui/src/index.ts` (modification)

Append the following line at the end of the file:

```typescript
export { DatePicker, type DatePickerProps } from './components/date-picker/date-picker.js';
```

No style exports needed — DatePicker has no CVA variants or consumer-facing style constants.

## 4. API Contracts

### `DatePicker` Component

**Input props:**

```typescript
{
  date?: Date;                              // Controlled selected date
  defaultDate?: Date;                       // Uncontrolled initial date
  onDateChange?: (date: Date | undefined) => void;  // Selection callback
  formatDate?: (date: Date) => string;     // Custom date formatter
  placeholder?: string;                     // Empty state text (default: "Pick a date")
  disabled?: boolean;                       // Disable the trigger
  className?: string;                       // Additional Tailwind classes on trigger
  ref?: React.Ref<HTMLButtonElement>;       // Forwarded to trigger button
}
```

**Usage examples:**

Uncontrolled:
```tsx
<DatePicker defaultDate={new Date(2025, 0, 15)} onDateChange={(d) => console.log(d)} />
```

Controlled:
```tsx
const [date, setDate] = useState<Date | undefined>();
<DatePicker date={date} onDateChange={setDate} />
```

Custom format:
```tsx
<DatePicker
  date={someDate}
  formatDate={(d) => `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`}
/>
```

**Output:** Renders a `<button>` trigger (via Button component) that opens a Popover containing a Calendar. The trigger displays either the formatted date or the placeholder text. Selecting a date closes the popover and calls `onDateChange`.

## 5. Test Plan

### Test Setup

- Framework: Vitest with jsdom environment
- Rendering: `@testing-library/react` (`render`, `screen`, `waitFor`)
- User interactions: `@testing-library/user-event` (`userEvent.setup()`)
- Accessibility: `vitest-axe` (`axe()`, `toHaveNoViolations()`)
- Mocking: `vi.fn()` for callback verification

### Test Specifications

| # | Test | Category | Setup | Action | Assertion |
|---|------|----------|-------|--------|-----------|
| 1 | Renders without crashing | Smoke | `render(<DatePicker />)` | None | `getByRole('button')` exists |
| 2 | Renders placeholder when no date | Rendering | `render(<DatePicker />)` | None | "Pick a date" text visible with `text-muted-foreground` class |
| 3 | Renders formatted date when date provided | Rendering | `render(<DatePicker date={new Date(2025, 0, 15)} />)` | None | "January 15, 2025" text visible |
| 4 | Opens popover on trigger click | Interaction | `render(<DatePicker />)` | Click trigger button | Calendar `data-slot="calendar"` appears in DOM |
| 5 | Selecting a date closes popover and updates trigger | Interaction | Render with `date={new Date(2025, 0, 10)}` | Click trigger → click day 15 | `onDateChange` called, calendar removed from DOM |
| 6 | Controlled mode | State | Render with `date` + `onDateChange` | Click trigger → click a day | `onDateChange` called with new Date; displayed date matches prop |
| 7 | Uncontrolled mode | State | Render with `defaultDate={new Date(2025, 5, 1)}` | None | "June 1, 2025" visible |
| 8 | Custom formatDate | Props | Render with custom `formatDate` and `date` | None | Custom format output visible |
| 9 | Disabled prevents opening | State | Render with `disabled` | Click trigger | Button is disabled; calendar not in DOM |
| 10 | data-slot presence | DOM | `render(<DatePicker />)` | None | `[data-slot="date-picker"]` in DOM |
| 11 | No a11y violations | Accessibility | `render(<DatePicker />)` | None | `axe(container)` has no violations |

### Notes on deterministic calendar interaction tests

Tests that interact with the Calendar (tests 4–6) require the calendar to open on a known month. Since DatePicker does not expose a `defaultMonth` prop, the approach is:
- For tests 5–6: Provide a `date` prop that places the calendar on January 2025, then click a specific day like "January 15, 2025" using the accessible name pattern `/January\D*15\D*2025/i` (matching react-day-picker v9's day button labels).
- For test 4: Just verify the calendar appears without clicking a specific day.

## 6. Implementation Order

1. **`date-picker.types.ts`** — Define `DatePickerProps` interface. No dependencies on other new files.

2. **`date-picker.styles.ts`** — Define `datePickerTriggerStyles` and `datePickerPlaceholderStyles` string constants. No dependencies on other new files.

3. **`date-picker.tsx`** — Implement the composed component. Depends on:
   - `date-picker.types.ts` (created in step 1)
   - `date-picker.styles.ts` (created in step 2)
   - Existing: `Button`, `Calendar`, `Popover`/`PopoverTrigger`/`PopoverContent`, `cn()`, `useControllableState`

4. **`date-picker.test.tsx`** — Write the test suite. Depends on:
   - `date-picker.tsx` (created in step 3)

5. **`date-picker.stories.tsx`** — Write Storybook stories. Depends on:
   - `date-picker.tsx` (created in step 3)

6. **`packages/ui/src/index.ts`** — Add export line. Depends on:
   - `date-picker.tsx` (created in step 3)

## 7. Verification Commands

```bash
# Run DatePicker tests only
pnpm --filter @components/ui test -- --run src/components/date-picker/date-picker.test.tsx

# Run all tests across the monorepo
pnpm test

# TypeScript type checking
pnpm typecheck

# Build all packages (validates exports compile)
pnpm build

# Lint check
pnpm lint
```

## 8. Design Deviations

### Deviation 1: `useControllableState` type parameter includes `undefined`

**Parent spec requires:** `onDateChange?: (date: Date | undefined) => void` — the callback accepts `Date | undefined`.

**Issue:** `useControllableState<T>` has `onChange?: (value: T) => void`. If we use `useControllableState<Date>`, the `onChange` callback would be typed as `(value: Date) => void`, which doesn't match the spec's `Date | undefined`. react-day-picker v9's `onSelect` in single mode fires with `Date | undefined`.

**Solution:** Use `useControllableState<Date | undefined>` so that `onChange` is typed as `(value: Date | undefined) => void`, matching the spec. The `handleSelect` callback receives `Date | undefined` from react-day-picker and passes it through to `setDate`.

### Deviation 2: `data-slot` placement on the Button trigger, not a wrapper div

**Parent spec requires:** `data-slot="date-picker"` on root element.

**Issue:** `Popover` (Radix `PopoverPrimitive.Root`) is a React context provider — it renders no DOM node. There is no "root DOM element" to place `data-slot` on without introducing a wrapper `<div>`, which would change the layout behavior and deviate from the composition pattern used by Popover's own tests.

**Solution:** Place `data-slot="date-picker"` on the `Button` trigger element, which is the first rendered DOM node. This is consistent with how the component is visually identified — the trigger IS the date picker control from the user's perspective. The popover content is ephemeral.