Now I have all the context needed. Let me produce the implementation plan.

# Task 2: Combobox — Multi-Select and Create-Option

## 1. Deliverables

| # | File | Action | Purpose |
|---|------|--------|---------|
| 1 | `packages/ui/src/components/combobox/combobox.types.ts` | Modify | Add `mode` prop (`"single" \| "multiple"`), `onCreateOption` callback, and update value/onValueChange types to support `string \| string[]` |
| 2 | `packages/ui/src/components/combobox/combobox.tsx` | Modify | Implement multi-select toggle behavior, create-option rendering, and mode-aware trigger display |
| 3 | `packages/ui/src/components/combobox/combobox.test.tsx` | Modify | Add tests for multi-select and create-option behaviors |
| 4 | `packages/ui/src/components/combobox/combobox.stories.tsx` | Modify | Add MultiSelect, MultiSelectWithDefaults, WithCreateOption, MultiSelectWithCreateOption stories |

## 2. Dependencies

No new external dependencies required. All needed packages are already installed:

- `cmdk` ^1.1.1 — already installed for Command
- `@radix-ui/react-popover` — already installed for Popover
- `@components/hooks` — already installed, provides `useControllableState`

The only prerequisite is Task 1 (Combobox — Single-Select Mode), which is already complete.

## 3. Implementation Details

### 3.1 `combobox.types.ts` — Type Updates

**Current state:** `ComboboxProps` has `value?: string`, `defaultValue?: string`, `onValueChange?: (value: string) => void`.

**Changes:**

Add `mode` prop and `onCreateOption` callback. The value types must accommodate both single (`string`) and multiple (`string[]`) modes. Use a discriminated union to provide type-safe value handling:

```typescript
export type ComboboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type ComboboxBaseProps = {
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
  onCreateOption?: (value: string) => void;
};

type ComboboxSingleProps = ComboboxBaseProps & {
  mode?: 'single';
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

type ComboboxMultipleProps = ComboboxBaseProps & {
  mode: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

export type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps;
```

**Exports:** `ComboboxOption`, `ComboboxProps` (unchanged export names).

### 3.2 `combobox.tsx` — Multi-Select and Create-Option Logic

**Key changes to the implementation:**

1. **Mode-aware state management:** Internally, always work with `string[]` for the value. For single mode, convert the incoming `string | undefined` to a single-element array and back. Use `useControllableState<string[]>` internally.

2. **Selection behavior by mode:**
   - `mode="single"` (default): Selecting an item sets the value to that single item and closes the popover (current behavior, preserved).
   - `mode="multiple"`: Selecting an item toggles it in the value array. The popover stays open. Each selected item shows a check icon.

3. **Trigger display by mode:**
   - Single mode: Show the selected option's label, or placeholder (current behavior).
   - Multiple mode with 0 items: Show placeholder.
   - Multiple mode with exactly 1 item: Show that item's label.
   - Multiple mode with >1 items: Show plain text `"{n} selected"`.

4. **Create-option behavior:**
   - Track the current search input value via a `searchValue` state (`useState<string>('')`).
   - Pass `searchValue` and `onValueChange` to `CommandInput` to make it controlled.
   - After the existing `CommandGroup`, conditionally render a second `CommandGroup` containing a single `CommandItem` with text `"Create {searchValue}"` when:
     - `onCreateOption` is provided AND
     - `searchValue.trim()` is non-empty AND
     - No option's label matches `searchValue` (case-insensitive via `toLowerCase()`)
   - When the create item is selected: call `onCreateOption(searchValue.trim())` and clear the search input.

5. **`cmdk` filtering consideration:** Since `cmdk`'s `Command` component does its own filtering, the create-option `CommandItem` needs a `value` that won't be filtered out by the search. Set its `value` to a unique string like `"__create__"` and use `filter` prop on `Command` to prevent filtering out the create item (return `1` for create item, otherwise defer to default).

   Actually, looking at the existing code, `CommandItem` uses `value={option.label}` for matching. The create-option item would use a value that contains the search text, so it will naturally appear. The simpler approach: set `value` of the create item to `searchValue` itself so it matches the search filter. But to avoid it matching an existing option label, use a prefix like `__create__{searchValue}`. However, `cmdk` filters by checking if the item value contains the search string — so `__create__{searchValue}` will contain the search text and remain visible. This works. Alternatively, a cleaner approach is to use `shouldFilter={false}` on the create `CommandGroup` — but `cmdk` does not support per-group filter control.

   **Chosen approach:** Use `Command`'s `filter` prop to customize filtering. Return `1` for items whose value starts with `__create__`, otherwise return the default behavior. Actually the simplest working approach: render the create-option `CommandItem` with a `forceMount` behavior by using `cmdk`'s `keywords` prop — set `keywords={[searchValue]}` so it always matches the current search. Wait, `CommandItem` supports `keywords` which are additional strings to match against. Set `keywords={[searchValue]}` and `value="__create__"`. This will match whenever the search equals anything (since the keyword is the search value itself). This is the cleanest approach.

   **Final decision:** Set the create item's `value` to `__create__` and `keywords={[searchValue]}` so `cmdk` filtering keeps it visible whenever there's text in the input.

6. **Search input controlled state:** Add `value={searchValue}` and `onValueChange={setSearchValue}` to `CommandInput` to track what the user has typed.

**Implementation pseudocode for the component function:**

```typescript
export function Combobox({
  options,
  mode = 'single',
  value: valueProp,
  defaultValue,
  onValueChange,
  onCreateOption,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  disabled,
  className,
  ref,
}: ComboboxProps): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Normalize to string[] internally
  const normalizedProp = mode === 'multiple'
    ? (valueProp as string[] | undefined)
    : valueProp !== undefined ? [valueProp as string] : undefined;

  const normalizedDefault = mode === 'multiple'
    ? (defaultValue as string[] | undefined)
    : defaultValue !== undefined ? [defaultValue as string] : undefined;

  const [selectedValues, setSelectedValues] = useControllableState<string[]>({
    prop: normalizedProp,
    defaultProp: normalizedDefault ?? [],
    onChange: (next) => {
      if (mode === 'multiple') {
        (onValueChange as ((v: string[]) => void) | undefined)?.(next);
      } else {
        (onValueChange as ((v: string) => void) | undefined)?.(next[0] ?? '');
      }
    },
  });

  const values = selectedValues ?? [];

  const handleSelect = (optionValue: string) => {
    if (mode === 'multiple') {
      const next = values.includes(optionValue)
        ? values.filter((v) => v !== optionValue)
        : [...values, optionValue];
      setSelectedValues(next);
      // Popover stays open
    } else {
      setSelectedValues([optionValue]);
      setOpen(false);
    }
  };

  // Trigger display
  const triggerContent = (() => {
    if (values.length === 0) {
      return <span className={comboboxPlaceholderStyles}>{placeholder ?? 'Select...'}</span>;
    }
    if (mode === 'multiple' && values.length > 1) {
      return `${values.length} selected`;
    }
    const option = options.find((o) => o.value === values[0]);
    return option?.label ?? values[0];
  })();

  // Create-option visibility
  const showCreateOption =
    onCreateOption !== undefined &&
    searchValue.trim() !== '' &&
    !options.some((o) => o.label.toLowerCase() === searchValue.trim().toLowerCase());

  // ... render
}
```

### 3.3 `combobox.test.tsx` — Additional Tests

Add a new `describe` block for multi-select and create-option. All new tests use the same `beforeAll` polyfills and `options` fixture already defined.

**New tests to add:**

1. **`multi-select toggles items (add and remove)`** — Render with `mode="multiple"`, click trigger, click Apple, verify Apple has check icon and is in selected state. Click Apple again, verify it's deselected.

2. **`multi-select trigger shows single label for one selection`** — Render with `mode="multiple"` and `defaultValue={['apple']}`, verify trigger shows "Apple".

3. **`multi-select trigger shows "{n} selected" for multiple selections`** — Render with `mode="multiple"` and `defaultValue={['apple', 'banana']}`, verify trigger shows "2 selected".

4. **`multi-select popover stays open after selection`** — Render with `mode="multiple"`, click trigger, click Apple, verify the command is still in the document.

5. **`create-option appears for unmatched input`** — Render with `onCreateOption`, open popover, type "Mango", verify "Create Mango" text appears.

6. **`create-option callback fires with typed value`** — Render with `onCreateOption={mockFn}`, open popover, type "Mango", click "Create Mango", verify `mockFn` called with "Mango".

7. **`create-option hidden when options match`** — Render with `onCreateOption`, open popover, type "Apple", verify no "Create Apple" item appears.

8. **`create-option not shown when onCreateOption not provided`** — Render without `onCreateOption`, open popover, type "xyz", verify no "Create xyz" appears.

9. **`multi-select with create-option works together`** — Render with `mode="multiple"` and `onCreateOption`, verify create-option appears and fires callback.

10. **`accessibility check for multi-select`** — Render with `mode="multiple"`, run vitest-axe.

### 3.4 `combobox.stories.tsx` — Additional Stories

**New stories to add:**

1. **`MultiSelect`** — `mode="multiple"` with the standard 3-option list, no default value.

2. **`MultiSelectWithDefaults`** — `mode="multiple"` with `defaultValue={['apple', 'cherry']}`.

3. **`WithCreateOption`** — Single mode with `onCreateOption` callback (using `useState` to dynamically add the created option to the list).

4. **`MultiSelectWithCreateOption`** — `mode="multiple"` with `onCreateOption` callback.

Each story that uses `onCreateOption` needs a wrapper component with `useState` to manage the dynamic options list, since the component itself doesn't manage option creation — it delegates to the consumer.

## 4. API Contracts

### Updated `ComboboxProps` (discriminated union)

**Single mode (default):**
```typescript
{
  options: ComboboxOption[];
  mode?: 'single';
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onCreateOption?: (value: string) => void;
  placeholder?: string;       // Default: "Select..."
  searchPlaceholder?: string;  // Default: "Search..."
  emptyMessage?: string;       // Default: "No results found."
  disabled?: boolean;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
}
```

**Multiple mode:**
```typescript
{
  options: ComboboxOption[];
  mode: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  onCreateOption?: (value: string) => void;
  placeholder?: string;       // Default: "Select..."
  searchPlaceholder?: string;  // Default: "Search..."
  emptyMessage?: string;       // Default: "No results found."
  disabled?: boolean;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
}
```

### `ComboboxOption` (unchanged)
```typescript
{
  value: string;
  label: string;
  disabled?: boolean;
}
```

### Trigger display rules:

| Mode | Selected count | Display |
|------|---------------|---------|
| single | 0 | `placeholder` (default: "Select...") in muted style |
| single | 1 | Selected option's label |
| multiple | 0 | `placeholder` (default: "Select...") in muted style |
| multiple | 1 | Selected option's label |
| multiple | >1 | `"{n} selected"` as plain text |

### Create-option visibility rules:

| `onCreateOption` provided | Search text non-empty | No exact label match (case-insensitive) | Create item shown |
|---|---|---|---|
| No | — | — | No |
| Yes | No | — | No |
| Yes | Yes | No (match exists) | No |
| Yes | Yes | Yes (no match) | Yes — "Create {searchValue}" |

## 5. Test Plan

### Test Setup

Same as existing `combobox.test.tsx`:
- `@testing-library/react` for `render`, `screen`, `waitFor`
- `@testing-library/user-event` for `userEvent.setup()`
- `vitest-axe` for accessibility assertions
- `beforeAll` polyfills for `hasPointerCapture`, `setPointerCapture`, `releasePointerCapture`, `scrollIntoView`
- Same `options` fixture: `[{ value: 'apple', label: 'Apple' }, { value: 'banana', label: 'Banana' }, { value: 'cherry', label: 'Cherry' }]`

### Test Specifications

#### Multi-Select Tests (new `describe('Combobox multi-select')` block)

| # | Test Name | Setup | Actions | Assertions |
|---|-----------|-------|---------|------------|
| 1 | multi-select toggles items | `mode="multiple"` | Click trigger → click Apple → click Apple again | After first click: Apple has check icon. After second click: Apple check hidden. |
| 2 | multi-select trigger shows single label | `mode="multiple"`, `defaultValue={['apple']}` | — | Trigger text is "Apple" |
| 3 | multi-select trigger shows count | `mode="multiple"`, `defaultValue={['apple', 'banana']}` | — | Trigger text is "2 selected" |
| 4 | multi-select popover stays open | `mode="multiple"` | Click trigger → click Apple | `document.querySelector('[data-slot="command"]')` is still in document |
| 5 | multi-select onValueChange fires with array | `mode="multiple"`, `onValueChange={vi.fn()}` | Click trigger → click Apple | `onValueChange` called with `['apple']` |
| 6 | multi-select accessibility | `mode="multiple"` | — | `axe(container)` has no violations |

#### Create-Option Tests (new `describe('Combobox create-option')` block)

| # | Test Name | Setup | Actions | Assertions |
|---|-----------|-------|---------|------------|
| 7 | create-option appears for unmatched input | `onCreateOption={vi.fn()}` | Click trigger → type "Mango" | Text "Create Mango" is visible |
| 8 | create-option callback fires | `onCreateOption={vi.fn()}` | Click trigger → type "Mango" → click "Create Mango" | `onCreateOption` called with "Mango" |
| 9 | create-option hidden when options match | `onCreateOption={vi.fn()}` | Click trigger → type "Apple" | No "Create Apple" text in document |
| 10 | create-option not shown without callback | No `onCreateOption` | Click trigger → type "xyz" | No "Create xyz" text in document |
| 11 | create-option clears search after creation | `onCreateOption={vi.fn()}` | Click trigger → type "Mango" → click "Create Mango" | Search input value is empty |

#### Backward Compatibility (existing tests remain unchanged)

All 12 existing tests in the `describe('Combobox')` block must continue to pass without modification, verifying that the `mode` prop defaults to `"single"` and preserves all existing behavior.

## 6. Implementation Order

1. **Update `combobox.types.ts`** — Add `mode`, `onCreateOption` props. Restructure as discriminated union (`ComboboxSingleProps | ComboboxMultipleProps`). Export remains `ComboboxProps`.

2. **Update `combobox.tsx`** — Implement the mode-aware state management, selection toggle logic, trigger display logic, search input tracking, and create-option rendering. Ensure single-mode behavior is identical to the current implementation (backward compatibility).

3. **Update `combobox.test.tsx`** — Add two new `describe` blocks: `'Combobox multi-select'` and `'Combobox create-option'`. Run all tests to verify no regressions.

4. **Update `combobox.stories.tsx`** — Add `MultiSelect`, `MultiSelectWithDefaults`, `WithCreateOption`, and `MultiSelectWithCreateOption` stories with wrapper components for state management.

5. **Verify** — Run `pnpm typecheck`, `pnpm test`, `pnpm lint`.

## 7. Verification Commands

```bash
# Type checking (from monorepo root)
pnpm typecheck

# Run all tests
pnpm test

# Run only combobox tests
pnpm --filter @components/ui test -- combobox

# Linting
pnpm lint

# Verify Storybook renders (manual, starts dev server)
pnpm storybook
```

## 8. Design Deviations

### Deviation 1: Discriminated union types instead of simple union for value prop

**Parent spec requires:** A single `ComboboxProps` type with `value?: string | string[]` and `onValueChange?: (value: string | string[]) => void`.

**Why that's problematic:** With a simple union, TypeScript cannot narrow the value type based on the `mode` prop. A consumer using `mode="single"` would still receive `string | string[]` in their `onValueChange` callback, requiring manual type narrowing. This creates a poor developer experience and error-prone API.

**Alternative chosen:** A discriminated union where `mode?: 'single'` pairs with `value?: string` / `onValueChange?: (value: string) => void`, and `mode: 'multiple'` pairs with `value?: string[]` / `onValueChange?: (value: string[]) => void`. This provides full type safety: in single mode, `onValueChange` receives `string`; in multiple mode, it receives `string[]`. The exported type is still `ComboboxProps` (the union), so the public API name is unchanged.

### Deviation 2: Internal normalization to `string[]` instead of overloaded `useControllableState`

**Parent spec implies:** Separate code paths for single vs. multiple mode state management.

**Why that's problematic:** Duplicating the state management logic creates unnecessary complexity and potential for bugs. The selection toggle logic (add/remove from array) is fundamentally the same operation regardless of mode.

**Alternative chosen:** Internally normalize all values to `string[]`. Single mode wraps the single value in a one-element array on input and unwraps it on output. This keeps the internal logic clean and unified while preserving the type-safe external API from Deviation 1.