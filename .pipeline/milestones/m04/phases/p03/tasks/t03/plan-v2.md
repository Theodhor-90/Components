Good. Now I have all the context I need. The feedback has a single issue: the `onKeyDown` prop spread ordering is broken. In the plan's code, `{...props}` comes after `onKeyDown={handleKeyDown}`, which means a consumer-provided `onKeyDown` in `...props` would override the internal handler, silently breaking `onSearch`. The fix is to destructure `onKeyDown` from props and call it inside `handleKeyDown`.

Let me produce the revised plan:

# Task Plan: Search Input — Implementation

**Milestone**: M04 — Data Display
**Phase**: P03 — States & Search
**Task**: T03

---

## 1. Deliverables

| # | File | Action | Purpose |
|---|------|--------|---------|
| 1 | `packages/ui/src/components/search-input/search-input.types.ts` | Create | Props type definition for SearchInput |
| 2 | `packages/ui/src/components/search-input/search-input.styles.ts` | Create | Static style string exports (no CVA) |
| 3 | `packages/ui/src/components/search-input/search-input.tsx` | Create | SearchInput component implementation |
| 4 | `packages/ui/src/index.ts` | Modify | Add SearchInput and style exports |

---

## 2. Dependencies

### Prior Tasks (must be complete)
- **t01** (EmptyState implementation) — already complete; exports added to `index.ts`
- **t02** (EmptyState tests & stories) — already complete

### Cross-Component Import
- `inputVariants` from `packages/ui/src/components/input/input.styles.ts` — reused for visual consistency on the `<input>` element

### Cross-Package Import
- `useControllableState` from `@components/hooks` — already a workspace dependency of `@components/ui` (listed in `package.json` as `"@components/hooks": "workspace:^"`)
- `cn` from `../../lib/utils.js` — standard utility

### New npm Dependencies
- **None** — all required packages are already installed

---

## 3. Implementation Details

### 3.1 `search-input.types.ts`

**Purpose**: Define the `SearchInputProps` type.

**Exports**: `SearchInputProps` (type)

**Contract**:
```ts
export type SearchInputProps = Omit<
  React.ComponentProps<'input'>,
  'type' | 'value' | 'defaultValue' | 'onChange'
> & {
  onSearch?: (value: string) => void;
  onClear?: () => void;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  defaultValue?: string;
};
```

**Key decisions**:
- Omits `type` from the native input props because it is always `"search"` internally — consumers cannot override it
- Omits `value`, `defaultValue`, and `onChange` from the native type to re-declare them with narrowed string-only types. The native `React.ComponentProps<'input'>` types these as `string | number | readonly string[]`, which would conflict with our string-only `useControllableState<string>` usage
- `onSearch` receives the current string value when Enter is pressed
- `onClear` fires when the clear button is clicked (value clearing is handled internally)
- `ref` is inherited from `React.ComponentProps<'input'>` (React 19 ref-as-prop)

### 3.2 `search-input.styles.ts`

**Purpose**: Export static style string constants. No CVA definitions — the input field reuses `inputVariants` from the Input component.

**Exports**: `searchInputContainerStyles`, `searchInputIconStyles`, `searchInputClearStyles`, `searchInputFieldStyles`

**Values**:
- `searchInputContainerStyles` = `'relative'` — relative positioning context for absolutely-positioned icon and clear button
- `searchInputIconStyles` = `'pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground'` — non-interactive magnifying glass icon, vertically centered on the left
- `searchInputClearStyles` = `'absolute right-1 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'` — interactive clear button, vertically centered on the right, with focus ring
- `searchInputFieldStyles` = `'pl-9 pr-9'` — left/right padding to accommodate the icon and clear button

### 3.3 `search-input.tsx`

**Purpose**: SearchInput component implementation.

**Exports**: `SearchInput` (function component), re-export `SearchInputProps` (type)

**Imports**:
- `useControllableState` from `@components/hooks`
- `cn` from `../../lib/utils.js`
- `inputVariants` from `../input/input.styles.js`
- All style constants from `./search-input.styles.js`
- `SearchInputProps` type from `./search-input.types.js`
- `useRef` from `react`

**Implementation logic**:

```tsx
import { useRef } from 'react';
import { useControllableState } from '@components/hooks';

import { cn } from '../../lib/utils.js';
import { inputVariants } from '../input/input.styles.js';
import {
  searchInputClearStyles,
  searchInputContainerStyles,
  searchInputFieldStyles,
  searchInputIconStyles,
} from './search-input.styles.js';
import type { SearchInputProps } from './search-input.types.js';

export type { SearchInputProps } from './search-input.types.js';

export function SearchInput({
  className,
  value: valueProp,
  defaultValue,
  onChange,
  onSearch,
  onClear,
  onKeyDown,
  disabled,
  ref,
  ...props
}: SearchInputProps): React.JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useControllableState<string>({
    prop: valueProp,
    defaultProp: defaultValue ?? '',
    onChange: undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch?.(value ?? '');
    }
    onKeyDown?.(e);
  };

  const handleClear = () => {
    setValue('');
    onClear?.();
    // Refocus the input after clearing
    const input = inputRef.current ?? (ref && 'current' in ref ? ref.current : null);
    input?.focus();
  };

  // Merge refs: we need inputRef for internal focus management, and the consumer's ref
  const setRef = (node: HTMLInputElement | null) => {
    (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
    }
  };

  return (
    <div data-slot="search-input" className={cn(searchInputContainerStyles, className)}>
      {/* Magnifying glass search icon (inline SVG) */}
      <svg
        className={searchInputIconStyles}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>

      <input
        ref={setRef}
        data-slot="search-input-field"
        type="search"
        className={cn(inputVariants(), searchInputFieldStyles)}
        value={value ?? ''}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        {...props}
      />

      {/* Clear button — only visible when input has a non-empty value */}
      {value && value.length > 0 && (
        <button
          type="button"
          className={searchInputClearStyles}
          onClick={handleClear}
          disabled={disabled}
          aria-label="Clear search"
        >
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
```

**Key behaviors**:
1. **Controlled/uncontrolled**: Uses `useControllableState<string>` with `prop: valueProp`, `defaultProp: defaultValue ?? ''`. When `value` prop is provided, component is controlled; otherwise tracks state internally.
2. **onChange**: The native `onChange` event handler is called in addition to `setValue` so consumers get the standard React change event.
3. **onSearch**: Fires on Enter keypress with the current string value. The consumer-provided `onKeyDown` is called afterward so both handlers execute.
4. **onKeyDown passthrough**: `onKeyDown` is explicitly destructured from props alongside the other event handlers. The internal `handleKeyDown` calls `onSearch` on Enter, then delegates to the consumer's `onKeyDown` handler. Since `onKeyDown` is destructured out of `...props`, there is no duplicate prop on the `<input>` element — only the explicit `onKeyDown={handleKeyDown}` is applied.
5. **onClear**: Fires when clear button is clicked. Internally sets value to `''` and refocuses the input.
6. **Ref merging**: A `setRef` callback merges the internal `inputRef` (used for `focus()`) with the consumer's `ref` prop.
7. **Clear button visibility**: Rendered only when `value` is a non-empty string.
8. **Disabled state**: Both the `<input>` and clear `<button>` receive the `disabled` prop.
9. **Icons**: Inline SVGs using Lucide-style paths (magnifying glass for search, X for clear). Both have `aria-hidden="true"`.
10. **Clear button**: Has `aria-label="Clear search"` for accessibility.
11. **`data-slot`**: Root `<div>` gets `data-slot="search-input"`, `<input>` gets `data-slot="search-input-field"`.

### 3.4 `packages/ui/src/index.ts` (Modify)

**Purpose**: Add SearchInput exports following the established pattern.

**Lines to add** (after the existing EmptyState style exports):
```ts
export { SearchInput, type SearchInputProps } from './components/search-input/search-input.js';
export {
  searchInputContainerStyles,
  searchInputIconStyles,
  searchInputClearStyles,
  searchInputFieldStyles,
} from './components/search-input/search-input.styles.js';
```

---

## 4. API Contracts

### SearchInput Props

**Input**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Controlled input value |
| `defaultValue` | `string` | `''` | Initial value for uncontrolled usage |
| `onChange` | `React.ChangeEventHandler<HTMLInputElement>` | — | Standard change handler |
| `onSearch` | `(value: string) => void` | — | Called when Enter is pressed |
| `onClear` | `() => void` | — | Called when clear button is clicked |
| `onKeyDown` | `React.KeyboardEventHandler<HTMLInputElement>` | — | Keyboard event handler (called after internal Enter handling) |
| `disabled` | `boolean` | `false` | Disables input and clear button |
| `placeholder` | `string` | — | Placeholder text |
| `className` | `string` | — | Merged onto root container `<div>` |
| `ref` | `React.Ref<HTMLInputElement>` | — | Forwarded to the `<input>` element |
| `...rest` | `React.ComponentProps<'input'>` | — | All remaining native input props (excluding `type`, `onKeyDown`) |

**Output (rendered DOM)**:
```html
<div data-slot="search-input" class="relative {className}">
  <svg class="pointer-events-none absolute ..." aria-hidden="true"><!-- magnifying glass --></svg>
  <input data-slot="search-input-field" type="search" class="flex h-10 w-full ... pl-9 pr-9" />
  <!-- Clear button, only when value is non-empty: -->
  <button type="button" class="absolute right-1 ..." aria-label="Clear search">
    <svg class="h-4 w-4" aria-hidden="true"><!-- X icon --></svg>
  </button>
</div>
```

---

## 5. Test Plan

Tests and stories are **not** part of this task (they are task t04 per the phase spec). However, for completeness, the component should be verifiable by the following manual checks and will be formally tested in t04:

| Check | Method |
|-------|--------|
| Component renders without errors | `pnpm typecheck` passes |
| Exports are accessible | Import from `@components/ui` succeeds |
| Visual appearance matches Input | Storybook visual inspection (t04) |

---

## 6. Implementation Order

1. **Create `search-input.types.ts`** — Define `SearchInputProps` type. No dependencies on other new files.
2. **Create `search-input.styles.ts`** — Define static style string exports. No dependencies on other new files.
3. **Create `search-input.tsx`** — Implement the component. Imports from the types and styles files created in steps 1–2, plus `inputVariants` from the Input component and `useControllableState` from `@components/hooks`.
4. **Modify `packages/ui/src/index.ts`** — Add `SearchInput`, `SearchInputProps`, and all style constant exports.

---

## 7. Verification Commands

```bash
# Type-check the entire ui package (confirms no TypeScript errors)
pnpm --filter @components/ui typecheck

# Type-check the full monorepo
pnpm typecheck

# Run all tests (confirms no regressions from new exports)
pnpm test

# Build the ui package (confirms the new files compile to ESM output)
pnpm --filter @components/ui build
```

---

## 8. Design Deviations

### Deviation 1: Ref merging via callback ref instead of a single forwarded ref

**Parent spec requires**: "Input accepts `ref` prop and spreads remaining HTML input props" — implying a straightforward ref-as-prop passthrough.

**Why that's insufficient**: The component needs internal access to the `<input>` element for `focus()` after clearing. With React 19 ref-as-prop, the consumer's `ref` is the only ref on the element. If we only forward the consumer's ref, we have no internal handle for programmatic focus. If we only use an internal ref, the consumer loses ref access.

**Alternative chosen**: A `setRef` callback ref function that writes to both `inputRef` (internal `useRef` for focus management) and the consumer's `ref` (forwarded for external access). This is a standard React pattern for merging refs and preserves full consumer ref functionality while enabling internal `focus()` calls.

### Deviation 2: `onKeyDown` destructured and delegated inside `handleKeyDown`

**Parent spec requires**: "On Enter keypress: call `onSearch` with current value" — no mention of preserving a consumer-provided `onKeyDown`.

**Why simple spread is problematic**: If `onKeyDown` is left in the `...props` spread, JSX last-prop-wins semantics would determine which handler runs. If `{...props}` is spread after the explicit `onKeyDown={handleKeyDown}`, the consumer's `onKeyDown` from the spread would override the internal handler, silently breaking `onSearch`. If `{...props}` is spread before, the internal handler would override the consumer's `onKeyDown`, silently breaking consumer keyboard event handling. Either ordering creates a silent override bug.

**Alternative chosen**: `onKeyDown` is explicitly destructured from the component props (alongside `onChange`, `onSearch`, `onClear`, etc.), removing it from the `...props` spread. The internal `handleKeyDown` function calls `onSearch` on Enter, then delegates to the consumer's `onKeyDown?.(e)`. This ensures both handlers always execute: the component's Enter-key logic and any consumer keyboard event handling. Since `onKeyDown` is no longer in `...props`, there is only one `onKeyDown` prop on the `<input>` element — the explicit `onKeyDown={handleKeyDown}`.