I now have comprehensive knowledge of the entire codebase. Let me produce the implementation plan.

## 1. Deliverables

| # | File | Action | Purpose |
|---|------|--------|---------|
| 1 | `packages/ui/src/components/combobox/combobox.types.ts` | Create | `ComboboxOption` type and `ComboboxProps` type definition |
| 2 | `packages/ui/src/components/combobox/combobox.styles.ts` | Create | Plain string style constants for trigger, popover, placeholder, and check icon |
| 3 | `packages/ui/src/components/combobox/combobox.tsx` | Create | Single-select Combobox composing Popover + Command |
| 4 | `packages/ui/src/components/combobox/combobox.test.tsx` | Create | Vitest + Testing Library + vitest-axe test suite |
| 5 | `packages/ui/src/components/combobox/combobox.stories.tsx` | Create | Storybook CSF3 stories with autodocs |
| 6 | `packages/ui/src/index.ts` | Modify | Add exports for `Combobox`, `ComboboxProps`, `ComboboxOption` |

## 2. Dependencies

### Prior Components (already delivered)

- **Popover** (M1) — `Popover`, `PopoverTrigger`, `PopoverContent` from `../popover/popover.js`
- **Command** (M5/P1) — `Command`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem` from `../command/command.js`
- **Button** (M2) — `Button` from `../button/button.js`

### Hooks

- `useControllableState` from `@components/hooks` — accepts `{ prop, defaultProp, onChange }`, returns `[value, setValue]`

### External Libraries

No new npm packages required. All needed packages are already installed in `packages/ui/package.json`:
- `cmdk` ^1.1.1 (used by Command)
- `@radix-ui/react-popover` ^1.1.15 (used by Popover)

## 3. Implementation Details

### 3.1 `combobox.types.ts`

**Purpose:** Define the `ComboboxOption` data type and `ComboboxProps` component props.

**Exports:**
- `ComboboxOption` — `{ value: string; label: string; disabled?: boolean }`
- `ComboboxProps` — Object type (not extending a native element, since the component is a composition)

**Interface:**

```typescript
export type ComboboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type ComboboxProps = {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
};
```

**Key decisions:**
- Task 1 is single-select only — value type is `string`, not `string | string[]`. The phase spec defines the union type to accommodate Task 2, but Task 1 only implements single-select. Adding the union type now would force unnecessary type narrowing logic and `as` casts throughout the component for a mode that doesn't exist yet. Task 2 will widen the type when it adds multi-select.
- Props are a plain object type, not extending `React.ComponentProps<'button'>`, because Combobox is a composed component (same pattern as `DatePickerProps` and `TimePickerProps`).
- `ref` targets `HTMLButtonElement` because the trigger is a `<Button>`.

### 3.2 `combobox.styles.ts`

**Purpose:** Plain string constants for Tailwind classes (not CVA — same pattern as DatePicker, TimePicker, Command).

**Exports:**

```typescript
export const comboboxTriggerStyles = 'w-[200px] justify-between text-left font-normal';
export const comboboxPlaceholderStyles = 'text-muted-foreground';
export const comboboxContentStyles = 'w-[--radix-popover-trigger-width] p-0';
export const comboboxCheckStyles = 'ml-auto h-4 w-4';
export const comboboxCheckHiddenStyles = 'ml-auto h-4 w-4 opacity-0';
```

**Key decisions:**
- `w-[--radix-popover-trigger-width]` makes the popover match the trigger width (shadcn combobox convention).
- Check icon visibility controlled via opacity rather than conditional rendering, so spacing remains consistent across all items.

### 3.3 `combobox.tsx`

**Purpose:** Single-select searchable dropdown composing Popover + Command.

**Exports:**
- `Combobox` — function component
- Re-exports `ComboboxProps` and `ComboboxOption` from types file

**Key logic:**

1. **State management:**
   - `const [open, setOpen] = useState(false)` — popover open state (local, always uncontrolled)
   - `const [value, setValue] = useControllableState<string | undefined>({ prop: valueProp, defaultProp: defaultValue, onChange: onValueChange })` — selected value

2. **Trigger rendering:**
   - Uses `Button` with `variant="outline"`, `role="combobox"`, `aria-expanded={open}`
   - `data-slot="combobox"` on the Button
   - Displays: selected option's label (found by matching `value` against `options`), or `<span className={comboboxPlaceholderStyles}>{placeholder ?? 'Select...'}</span>`
   - Chevron icon (up/down depending on `open`) rendered after the label text

3. **Popover content:**
   - `PopoverContent` with `className={comboboxContentStyles}` and `align="start"`
   - Contains `Command` with:
     - `CommandInput` with `placeholder={searchPlaceholder ?? 'Search...'}`
     - `CommandList` containing:
       - `CommandEmpty` with `{emptyMessage ?? 'No results found.'}`
       - `CommandGroup` mapping over `options` to render `CommandItem` elements

4. **CommandItem rendering:**
   - `value` prop set to `option.label` (cmdk filters by this value, using the label ensures user searches by visible text)
   - `disabled` prop from `option.disabled`
   - `onSelect` handler: calls `setValue(option.value)` and `setOpen(false)`
   - Children: option label text + check SVG icon (visible when `option.value === value`, hidden otherwise via opacity)

5. **Icons:**
   - Chevron down/up: inline SVG with `fill="none"`, `stroke="currentColor"`, `strokeWidth="2"`, `strokeLinecap="round"`, `strokeLinejoin="round"`, `aria-hidden="true"`
   - Check mark: same SVG convention, uses `opacity-0` class to hide when not selected

**Import pattern (following DatePicker/TimePicker):**

```typescript
import { useState } from 'react';
import { useControllableState } from '@components/hooks';
import { cn } from '../../lib/utils.js';
import { Button } from '../button/button.js';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../command/command.js';
import { Popover, PopoverContent, PopoverTrigger } from '../popover/popover.js';
import { comboboxCheckHiddenStyles, comboboxCheckStyles, comboboxContentStyles, comboboxPlaceholderStyles, comboboxTriggerStyles } from './combobox.styles.js';
import type { ComboboxProps } from './combobox.types.js';

export type { ComboboxOption, ComboboxProps } from './combobox.types.js';
```

### 3.4 `combobox.test.tsx`

**Purpose:** Comprehensive tests following the DatePicker/TimePicker test patterns.

**Test setup:**
- Import `render`, `screen`, `waitFor` from `@testing-library/react`
- Import `userEvent` from `@testing-library/user-event`
- Import `axe` from `vitest-axe`
- Import `describe`, `expect`, `it`, `vi` from `vitest`
- Define a standard `options` array: `[{ value: 'apple', label: 'Apple' }, { value: 'banana', label: 'Banana' }, { value: 'cherry', label: 'Cherry' }]`

**Test cases (13 tests):**

1. **Smoke render** — renders without crashing, trigger button is in the document
2. **Default placeholder** — renders "Select..." when no value, text has `text-muted-foreground` class
3. **Opens popover on trigger click** — click trigger button, verify `data-slot="command"` appears in document
4. **Filters options as user types** — open popover, type in CommandInput, verify non-matching options are hidden (cmdk hides non-matching items by setting `data-hidden` or removing them from DOM)
5. **Selects an option and closes popover** — click trigger, click an option, verify popover closes (command element no longer in DOM) and trigger shows selected label
6. **Displays selected option label in trigger** — render with `defaultValue="banana"`, verify trigger shows "Banana"
7. **Controlled mode** — render with `value="apple"` and `onValueChange` mock, select different option, verify callback fires with new value and trigger still shows "Apple" (controlled)
8. **Uncontrolled mode** — render with `defaultValue="cherry"`, verify trigger shows "Cherry"
9. **Disabled state** — render with `disabled`, verify trigger is disabled, click doesn't open popover
10. **Custom placeholder** — render with `placeholder="Choose fruit..."`, verify text appears
11. **Custom searchPlaceholder** — open popover, verify CommandInput has correct placeholder attribute
12. **Custom emptyMessage** — open popover, type non-matching text, verify custom empty message appears
13. **Accessibility** — `expect(await axe(container)).toHaveNoViolations()`

### 3.5 `combobox.stories.tsx`

**Purpose:** CSF3 Storybook stories with autodocs.

**Exports:**

```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';
```

- `meta` — `Meta<typeof Combobox>` with `title: 'Components/Combobox'`, `component: Combobox`, `tags: ['autodocs']`
- `default export` — `meta` (this is the one exception to the "no default exports" rule — Storybook requires it)
- `Default` — renders with standard 3-option array and no value
- `WithDefaultValue` — `args: { defaultValue: 'banana', options: [...] }`
- `Controlled` — uses `render` function with `useState` to demonstrate controlled usage
- `Disabled` — `args: { disabled: true, options: [...] }`
- `ManyOptions` — 50+ options (generated array like `Array.from({ length: 50 }, (_, i) => ({ value: \`option-${i}\`, label: \`Option ${i}\` }))`) to demonstrate scroll and filter behavior

## 4. API Contracts

### Component Props

```typescript
<Combobox
  options={[
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry', disabled: true },
  ]}
  value="apple"                          // optional, controlled value
  defaultValue="banana"                  // optional, uncontrolled initial value
  onValueChange={(value) => void}        // optional, called with selected option's `value` string
  placeholder="Select..."               // optional, default: "Select..."
  searchPlaceholder="Search..."          // optional, default: "Search..."
  emptyMessage="No results found."       // optional, default: "No results found."
  disabled={false}                       // optional, disables trigger button
  className="custom-class"              // optional, merged with trigger styles
  ref={buttonRef}                        // optional, forwarded to trigger Button
/>
```

### Exports from `packages/ui/src/index.ts`

```typescript
export { Combobox, type ComboboxProps, type ComboboxOption } from './components/combobox/combobox.js';
```

## 5. Test Plan

### Test Setup

- **Test runner:** Vitest (via `pnpm test`)
- **DOM environment:** jsdom (configured in vitest config)
- **Rendering:** `@testing-library/react` `render` + `screen`
- **Interactions:** `@testing-library/user-event` `userEvent.setup()`
- **Accessibility:** `vitest-axe` `axe()` function
- **Standard test options array:** `[{ value: 'apple', label: 'Apple' }, { value: 'banana', label: 'Banana' }, { value: 'cherry', label: 'Cherry' }]`

### Test Specifications

| # | Test Name | Setup | Action | Assertion |
|---|-----------|-------|--------|-----------|
| 1 | renders without crashing | `render(<Combobox options={options} />)` | — | `screen.getByRole('button')` is in document |
| 2 | renders default placeholder when no value | `render(<Combobox options={options} />)` | — | `screen.getByText('Select...')` in document and has class `text-muted-foreground` |
| 3 | opens popover on trigger click | `render(<Combobox options={options} />)` | `user.click(trigger)` | `document.querySelector('[data-slot="command"]')` is in document |
| 4 | filters options as user types | `render(<Combobox options={options} />)` | Click trigger, type "app" in input | "Apple" visible, "Banana" and "Cherry" not visible (query `CommandItem` text) |
| 5 | selects option and closes popover | `render(<Combobox options={options} />)` | Click trigger, click "Banana" item | Popover closes (command not in DOM), trigger shows "Banana" |
| 6 | displays selected option label in trigger | `render(<Combobox options={options} defaultValue="banana" />)` | — | Trigger shows "Banana" text |
| 7 | controlled mode works | `render(<Combobox options={options} value="apple" onValueChange={fn} />)` | Open, select "Banana" | `fn` called with `"banana"`, trigger still shows "Apple" |
| 8 | uncontrolled mode works | `render(<Combobox options={options} defaultValue="cherry" />)` | — | Trigger shows "Cherry" |
| 9 | disabled state prevents opening | `render(<Combobox options={options} disabled />)` | `user.click(trigger)` | Trigger is disabled, command not in document |
| 10 | custom placeholder renders | `render(<Combobox options={options} placeholder="Choose..." />)` | — | "Choose..." in document |
| 11 | custom searchPlaceholder passed to input | `render(<Combobox options={options} searchPlaceholder="Find..." />)` | Click trigger | Input has `placeholder="Find..."` |
| 12 | custom emptyMessage shown when no matches | `render(<Combobox options={options} emptyMessage="Nothing here" />)` | Open, type "xyz" | "Nothing here" in document |
| 13 | has no accessibility violations | `render(<Combobox options={options} />)` | — | `expect(await axe(container)).toHaveNoViolations()` |

## 6. Implementation Order

1. **`combobox.types.ts`** — Define `ComboboxOption` and `ComboboxProps` types. No dependencies on other new files.

2. **`combobox.styles.ts`** — Define style string constants. No dependencies on other new files.

3. **`combobox.tsx`** — Implement the Combobox component. Depends on types and styles files, plus existing Popover, Command, and Button components.

4. **`combobox.test.tsx`** — Write all 13 tests. Depends on the component implementation.

5. **`combobox.stories.tsx`** — Write Storybook stories. Depends on the component implementation.

6. **`packages/ui/src/index.ts`** — Add export line for Combobox, ComboboxProps, ComboboxOption.

7. **Verification** — Run `pnpm typecheck`, `pnpm test`, and `pnpm lint` to validate.

## 7. Verification Commands

```bash
# Type check the entire monorepo
pnpm typecheck

# Run all tests (includes combobox.test.tsx)
pnpm test

# Run only combobox tests for faster iteration
pnpm --filter @components/ui test -- --testPathPattern=combobox

# Lint new files
pnpm lint

# Verify Storybook builds (optional, for visual confirmation)
pnpm storybook
```

## 8. Design Deviations

### Deviation 1: Single-select-only type signature for Task 1

**Parent spec requires:** `ComboboxProps` with `value?: string | string[]`, `defaultValue?: string | string[]`, `onValueChange?: (value: string | string[]) => void` — a union type that accommodates both single and multi-select modes.

**Why this is problematic:** Task 1 only implements single-select. Using union types forces every consumer of the value (the trigger display logic, the selection handler, the `useControllableState` generic parameter) to narrow the type with runtime checks or `as` casts for a `string[]` branch that cannot occur. This introduces dead code paths, misleading type signatures, and unnecessary complexity.

**Alternative chosen:** Task 1 defines `value?: string`, `defaultValue?: string`, `onValueChange?: (value: string) => void`. Task 2 will widen these to union types when it adds the `mode` prop and multi-select logic. This follows the "implement only what the task requires" guideline and avoids premature abstraction. The widening is a non-breaking change since `string` is a subtype of `string | string[]`.

### Deviation 2: `CommandItem` value prop set to option label, not option value

**Parent spec implies:** `CommandItem` `value` prop maps directly to `option.value`.

**Why this is problematic:** The `cmdk` library's built-in filtering works by matching the user's search input against each `CommandItem`'s `value` prop. If `value` is set to an internal identifier (e.g., `"opt-123"`), typing "Apple" in the search input won't match it. The shadcn combobox pattern sets the `CommandItem` `value` to the human-readable label so filtering works by visible text.

**Alternative chosen:** Set `CommandItem value={option.label}` for filtering, and use `onSelect` to map back to `option.value` via lookup. The `onSelect` callback receives the `cmdk`-normalized string (lowercased), so we find the matching option by comparing `option.label.toLowerCase()` against the received value. This matches the standard shadcn combobox implementation.