Now I have all the context I need. Let me produce the detailed implementation plan.

## 1. Deliverables

### Created (5 files)

| # | File | Purpose |
|---|------|---------|
| 1 | `packages/ui/src/components/time-picker/time-picker.types.ts` | TypeScript prop types for the TimePicker component |
| 2 | `packages/ui/src/components/time-picker/time-picker.styles.ts` | Named string constants for trigger, content, and separator styling |
| 3 | `packages/ui/src/components/time-picker/time-picker.tsx` | Composed component assembling Popover + Button + two Selects |
| 4 | `packages/ui/src/components/time-picker/time-picker.test.tsx` | Vitest + Testing Library + vitest-axe test suite |
| 5 | `packages/ui/src/components/time-picker/time-picker.stories.tsx` | Storybook CSF3 stories with autodocs |

### Modified (1 file)

| # | File | Change |
|---|------|--------|
| 1 | `packages/ui/src/index.ts` | Add exports for `TimePicker` and `TimePickerProps` |

## 2. Dependencies

### Prerequisites (must be complete)

- **Task t01** — `react-day-picker` installed (already done; this task doesn't use it directly but t01 was a prerequisite for the phase)
- **Task t02** — Calendar component (sibling, complete)
- **Task t03** — Date Picker component (sibling, complete; provides the pattern this task follows)

### Packages Required

No new packages need to be installed. All composed dependencies are already available:

| Package | Already Installed | Used By |
|---------|-------------------|---------|
| `@radix-ui/react-popover` | Yes (Milestone 1) | Popover, PopoverTrigger, PopoverContent |
| `@radix-ui/react-select` | Yes (Milestone 2) | Select, SelectTrigger, SelectContent, SelectItem, SelectValue |
| `@components/hooks` | Yes (workspace) | `useControllableState` hook |

### Internal Dependencies

- `Popover`, `PopoverTrigger`, `PopoverContent` from `../popover/popover.js`
- `Button` from `../button/button.js`
- `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectValue` from `../select/select.js`
- `useControllableState` from `@components/hooks`
- `cn` from `../../lib/utils.js`

## 3. Implementation Details

### 3.1 `time-picker.types.ts`

**Purpose:** Define the public prop interface for the TimePicker component.

**Exports:** `TimePickerProps`

```typescript
export type TimePickerProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
};
```

**Key decisions:**
- `value` and `defaultValue` are strings in `"HH:mm"` 24-hour format (e.g., `"09:30"`, `"14:00"`)
- `onChange` receives the full `"HH:mm"` string, not separate hour/minute values
- `ref` targets the trigger `<button>` element (same pattern as DatePicker)
- No `asChild` — this is a composed component, not a primitive wrapper
- No CVA `VariantProps` — single visual presentation

### 3.2 `time-picker.styles.ts`

**Purpose:** Centralize all Tailwind class strings for the TimePicker.

**Exports:** `timePickerTriggerStyles`, `timePickerPlaceholderStyles`, `timePickerContentStyles`, `timePickerSeparatorStyles`

```typescript
export const timePickerTriggerStyles = 'w-[160px] justify-start text-left font-normal';

export const timePickerPlaceholderStyles = 'text-muted-foreground';

export const timePickerContentStyles = 'flex items-center gap-2 p-3';

export const timePickerSeparatorStyles = 'text-sm font-medium text-muted-foreground';
```

**Key decisions:**
- `timePickerTriggerStyles` — width of `160px` (narrower than DatePicker's `280px` since time text is shorter), `justify-start text-left` to left-align icon + text, `font-normal` to match DatePicker trigger convention
- `timePickerPlaceholderStyles` — uses `text-muted-foreground` for placeholder text, exactly matching the DatePicker pattern (`datePickerPlaceholderStyles`)
- `timePickerContentStyles` — flex row layout with `gap-2` between hour select, separator, and minute select; `p-3` for padding inside the popover content
- `timePickerSeparatorStyles` — styles the `:` colon between hour and minute selects with `text-sm font-medium text-muted-foreground`

### 3.3 `time-picker.tsx`

**Purpose:** Composed TimePicker component assembling Popover + Button trigger + two Select components for hour/minute.

**Exports:** `TimePicker`, `type TimePickerProps` (re-exported from types)

**Implementation structure:**

```typescript
import { useState } from 'react';
import { useControllableState } from '@components/hooks';

import { cn } from '../../lib/utils.js';
import { Button } from '../button/button.js';
import { Popover, PopoverContent, PopoverTrigger } from '../popover/popover.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select/select.js';
import {
  timePickerContentStyles,
  timePickerPlaceholderStyles,
  timePickerSeparatorStyles,
  timePickerTriggerStyles,
} from './time-picker.styles.js';
import type { TimePickerProps } from './time-picker.types.js';

export type { TimePickerProps } from './time-picker.types.js';
```

**Key logic:**

1. **State management** — Uses `useControllableState<string | undefined>` with `prop: value`, `defaultProp: defaultValue`, `onChange`. This follows the exact same pattern as DatePicker's use of `useControllableState`.

2. **Parsing** — Derive `hour` and `minute` from the controlled/uncontrolled `timeValue`:
   ```typescript
   const hour = timeValue ? timeValue.split(':')[0] : undefined;
   const minute = timeValue ? timeValue.split(':')[1] : undefined;
   ```

3. **Hour/minute change handlers** — When either Select changes, combine the new value with the current other value and call `setTimeValue`:
   ```typescript
   const handleHourChange = (h: string) => {
     const m = minute ?? '00';
     setTimeValue(`${h}:${m}`);
   };

   const handleMinuteChange = (m: string) => {
     const h = hour ?? '00';
     setTimeValue(`${h}:${m}`);
   };
   ```
   When the first selection is made (e.g., hour selected but no minute yet), default the other field to `"00"` to produce a valid `HH:mm` string.

4. **Trigger rendering** — Button with `variant="outline"`, containing:
   - Inline SVG clock icon (circle + hands): `<circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />` with `width="16" height="16"` viewBox `"0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `strokeWidth="2"`, `strokeLinecap="round"`, `strokeLinejoin="round"`, `aria-hidden="true"`
   - Either the time value text or placeholder span with `timePickerPlaceholderStyles`

5. **Popover content** — Flex row containing:
   - Hour `Select` with `value={hour}` / `onValueChange={handleHourChange}`, containing 24 `SelectItem` components with values `"00"` through `"23"` and matching text labels
   - Separator `<span>` with `:` text styled by `timePickerSeparatorStyles`
   - Minute `Select` with `value={minute}` / `onValueChange={handleMinuteChange}`, containing 60 `SelectItem` components with values `"00"` through `"59"` and matching text labels

6. **Hour/minute option generation** — Use `Array.from` to generate padded two-digit strings:
   ```typescript
   const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
   const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
   ```
   These are defined as module-level constants outside the component to avoid re-creation on each render.

7. **Root attributes** — `data-slot="time-picker"` on the Popover root wrapper, `ref` on the trigger Button.

8. **Popover open/close** — Unlike DatePicker (which closes on selection), TimePicker stays open since the user needs to select both hour and minute. The popover uses default open/close behavior (click outside or Escape to close).

**Complete JSX structure:**
```jsx
<Popover>
  <PopoverTrigger asChild>
    <Button
      data-slot="time-picker"
      variant="outline"
      className={cn(timePickerTriggerStyles, className)}
      disabled={disabled}
      ref={ref}
    >
      <svg ...clock icon... />
      {timeValue ? (
        timeValue
      ) : (
        <span className={timePickerPlaceholderStyles}>
          {placeholder ?? 'Pick a time'}
        </span>
      )}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0">
    <div className={timePickerContentStyles}>
      <Select value={hour} onValueChange={handleHourChange}>
        <SelectTrigger className="w-[70px]">
          <SelectValue placeholder="HH" />
        </SelectTrigger>
        <SelectContent>
          {hours.map((h) => (
            <SelectItem key={h} value={h}>{h}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className={timePickerSeparatorStyles}>:</span>
      <Select value={minute} onValueChange={handleMinuteChange}>
        <SelectTrigger className="w-[70px]">
          <SelectValue placeholder="MM" />
        </SelectTrigger>
        <SelectContent>
          {minutes.map((m) => (
            <SelectItem key={m} value={m}>{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </PopoverContent>
</Popover>
```

### 3.4 `time-picker.test.tsx`

**Purpose:** Comprehensive test suite covering smoke, state management, interactions, and accessibility.

**Test setup:**
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { TimePicker } from './time-picker.js';
```

**Tests (12 total):**

1. **`renders without crashing`** — Render `<TimePicker />`, assert the trigger button is in the document.

2. **`renders placeholder when no time`** — Render `<TimePicker />`, assert `screen.getByText('Pick a time')` exists and has class `text-muted-foreground`.

3. **`renders custom placeholder`** — Render `<TimePicker placeholder="Select time..." />`, assert `screen.getByText('Select time...')` exists.

4. **`renders formatted time when value is provided`** — Render `<TimePicker value="14:30" />`, assert `screen.getByText('14:30')` is in the document.

5. **`opens popover on trigger click`** — Click the trigger button, assert that select triggers for hour and minute appear (look for elements with `data-slot="select-trigger"`).

6. **`supports controlled mode`** — Render with `value="09:15"` and `onChange` spy. Assert trigger shows `"09:15"`. Open popover, change hour select, assert `onChange` was called with the new time string.

7. **`supports uncontrolled mode with defaultValue`** — Render `<TimePicker defaultValue="08:00" />`, assert trigger shows `"08:00"`.

8. **`disabled state prevents opening`** — Render `<TimePicker disabled />`, assert trigger button is disabled. Click it, assert no popover content appears.

9. **`hour select has 24 options`** — Open the popover, open the hour select, count the options. Assert 24 items exist (values "00" through "23").

10. **`minute select has 60 options`** — Open the popover, open the minute select, count the options. Assert 60 items exist (values "00" through "59").

11. **`has data-slot attribute`** — Render `<TimePicker />`, assert `document.querySelector('[data-slot="time-picker"]')` is in the document.

12. **`has no accessibility violations`** — Render `<TimePicker />`, run `axe(container)`, assert `toHaveNoViolations()`.

**Testing note on Radix Select:** Radix Select renders options in a portal. Tests that need to count options or interact with the select dropdown must account for the portal rendering. The test will click on the `SelectTrigger` to open the dropdown, then query for `SelectItem` elements by their `data-slot="select-item"` attribute or by role `option`.

### 3.5 `time-picker.stories.tsx`

**Purpose:** Storybook documentation covering all usage patterns.

**Meta configuration:**
```typescript
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { TimePicker } from './time-picker.js';

const meta: Meta<typeof TimePicker> = {
  title: 'Components/TimePicker',
  component: TimePicker,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TimePicker>;
```

**Stories (5):**

1. **`Default`** — Empty TimePicker, no args. Shows "Pick a time" placeholder.

2. **`Controlled`** — Render function with `useState<string | undefined>('14:30')`. Wires `value` and `onChange` to demonstrate controlled usage.

3. **`WithDefaultValue`** — Args: `{ defaultValue: '09:00' }`. Shows uncontrolled usage with pre-selected time.

4. **`Disabled`** — Args: `{ disabled: true }`. Shows the disabled trigger state.

5. **`WithPlaceholder`** — Args: `{ placeholder: 'Select time...' }`. Shows custom placeholder text.

### 3.6 `index.ts` modification

**Change:** Append the following export line at the end of `packages/ui/src/index.ts`:

```typescript
export { TimePicker, type TimePickerProps } from './components/time-picker/time-picker.js';
```

No style exports are needed since the styles are plain string constants (not CVA variant functions), and they are internal to the component — not part of the public API. This matches the pattern used for DatePicker (which also has no style export in `index.ts`).

## 4. API Contracts

### TimePicker Props

```typescript
type TimePickerProps = {
  /** Controlled time value in "HH:mm" format (e.g., "14:30") */
  value?: string;
  /** Default time for uncontrolled usage in "HH:mm" format */
  defaultValue?: string;
  /** Called when time changes; receives "HH:mm" string */
  onChange?: (value: string) => void;
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Placeholder text shown when no time is selected (default: "Pick a time") */
  placeholder?: string;
  /** Additional CSS classes for the trigger button */
  className?: string;
  /** Ref forwarded to the trigger button element */
  ref?: React.Ref<HTMLButtonElement>;
};
```

### Usage Examples

**Uncontrolled:**
```tsx
<TimePicker defaultValue="09:00" />
```

**Controlled:**
```tsx
const [time, setTime] = useState<string | undefined>('14:30');
<TimePicker value={time} onChange={setTime} />
```

**With custom placeholder:**
```tsx
<TimePicker placeholder="Select time..." />
```

**Disabled:**
```tsx
<TimePicker disabled />
```

### Exported from `@components/ui`

```typescript
import { TimePicker, type TimePickerProps } from '@components/ui';
```

## 5. Test Plan

### Test Setup

- **Framework:** Vitest + @testing-library/react + @testing-library/user-event + vitest-axe
- **Environment:** jsdom (configured in `packages/ui/vitest.config.ts`)
- **Import path:** `./time-picker.js` (ESM with `.js` extension, matching project convention)

### Test Specifications

| # | Test Name | Category | Description | Assertions |
|---|-----------|----------|-------------|------------|
| 1 | renders without crashing | Smoke | Render `<TimePicker />` | Trigger button exists in DOM |
| 2 | renders placeholder when no time | Display | Default placeholder text | `'Pick a time'` text present, has `text-muted-foreground` class |
| 3 | renders custom placeholder | Display | Custom placeholder prop | Custom text present |
| 4 | renders formatted time when value is provided | Display | Controlled value display | `'14:30'` text in trigger |
| 5 | opens popover on trigger click | Interaction | Click trigger opens popover | Select triggers appear in DOM |
| 6 | supports controlled mode | State | value + onChange props | onChange called with `"HH:mm"` string; trigger text unchanged (controlled) |
| 7 | supports uncontrolled mode with defaultValue | State | defaultValue prop | Trigger shows default time |
| 8 | disabled state prevents opening | State | disabled prop | Button disabled, no popover on click |
| 9 | hour select has 24 options | Content | Hour options count | 24 option items (00–23) |
| 10 | minute select has 60 options | Content | Minute options count | 60 option items (00–59) |
| 11 | has data-slot attribute | DOM | data-slot presence | `[data-slot="time-picker"]` in DOM |
| 12 | has no accessibility violations | a11y | vitest-axe scan | `toHaveNoViolations()` |

### Testing Considerations

- **Radix Select interaction:** Radix Select uses portals. To test option counts, click the `SelectTrigger` to open it, then query by `role="option"` within the document.
- **Popover interaction:** Click the trigger button to open the popover. Verify select triggers appear, then interact with them.
- **Controlled vs uncontrolled:** Controlled mode test passes `value` + `onChange`; changing a select should fire `onChange` but not visually update the trigger (since it's controlled). Uncontrolled mode test passes `defaultValue`; the trigger should display the default time.

## 6. Implementation Order

| Step | File | Rationale |
|------|------|-----------|
| 1 | `time-picker.types.ts` | Define props interface first — all other files depend on it |
| 2 | `time-picker.styles.ts` | Define style constants — implementation file imports these |
| 3 | `time-picker.tsx` | Core implementation composing Popover + Button + Select |
| 4 | `time-picker.test.tsx` | Test suite validating all behavior |
| 5 | `time-picker.stories.tsx` | Storybook stories for documentation |
| 6 | `packages/ui/src/index.ts` | Add public API exports |
| 7 | Verification | Run typecheck, tests, and lint |

## 7. Verification Commands

```bash
# Type-check the entire monorepo
pnpm typecheck

# Run all tests (includes time-picker tests)
pnpm test

# Run only time-picker tests
pnpm --filter @components/ui test -- --testPathPattern="time-picker"

# Lint the UI package
pnpm --filter @components/ui lint

# Build the UI package to verify exports
pnpm build
```

## 8. Design Deviations

### 1. Popover does not auto-close on selection

**Parent spec says:** "Selecting hour and minute updates the trigger display" (implies both must be selected before the interaction is complete).

**Issue:** Unlike DatePicker (which auto-closes on single date selection), TimePicker requires two sequential selections (hour + minute). Auto-closing after the first selection (hour) would prevent the user from selecting the minute.

**Alternative chosen:** The popover remains open after hour or minute selection. The user closes it by clicking outside, pressing Escape, or clicking the trigger again. This matches the natural UX flow of selecting two related values in sequence. When the first select is changed (e.g., hour) and the other select has no value yet, the missing component defaults to `"00"` to produce a valid `"HH:mm"` string.

### 2. Placeholder styles extracted to separate constant

**Parent spec says:** `timePickerTriggerStyles` should include "text-muted-foreground when no time selected."

**Issue:** Applying `text-muted-foreground` to the entire trigger button would affect the clock icon color even when a time IS selected. The DatePicker solves this by having a separate `datePickerPlaceholderStyles` constant that wraps only the placeholder text in a `<span>`.

**Alternative chosen:** Following the exact DatePicker pattern, extract `timePickerPlaceholderStyles` as a separate constant (`'text-muted-foreground'`) applied to a `<span>` wrapping only the placeholder text. This keeps the icon and selected-time text at the default foreground color. The `timePickerTriggerStyles` constant handles only layout concerns (width, alignment, font weight).