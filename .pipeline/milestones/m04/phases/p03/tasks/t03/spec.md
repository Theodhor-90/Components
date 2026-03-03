# Task: Search Input — Implementation

## Objective

Create the Search Input component following the established 5-file pattern (implementation, styles, and types files only — tests and stories are a separate task). Search Input is a custom component that renders its own `<input>` element with a search icon prefix and clear button suffix.

## Files to Create

All files under `packages/ui/src/components/search-input/`:

### 1. `search-input.types.ts`

Define `SearchInputProps` as:
```ts
type SearchInputProps = Omit<
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

The base type explicitly omits `type` (always `"search"`), `value`, `defaultValue`, and `onChange` before re-declaring them with narrowed string-only types. This avoids TypeScript conflicting-property errors from the native input's `string | number | readonly string[]` union types.

### 2. `search-input.styles.ts`

Export static style strings (no new CVA definitions — reuses `inputVariants` from Input component):
- `searchInputContainerStyles` — relative container: `relative`
- `searchInputIconStyles` — search icon: `pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`
- `searchInputClearStyles` — clear button: `absolute right-1 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`
- `searchInputFieldStyles` — additional input padding: `pl-9 pr-9`

### 3. `search-input.tsx`

Implementation requirements:
- Render a `<div data-slot="search-input">` container with `cn(searchInputContainerStyles, className)`
- Render inline SVG magnifying glass icon with `searchInputIconStyles`
- Render `<input>` with `type="search"`, applying `cn(inputVariants(), searchInputFieldStyles)` for styling
- Import `inputVariants` from `../input/input.styles.ts` (cross-component dependency)
- Input accepts `ref` prop and spreads remaining HTML input props
- Use `useControllableState` from `@components/hooks` with `{ prop: value, defaultProp: defaultValue, onChange: onChangeHandler }` where `onChangeHandler` extracts the string value from the change event
- Render clear button (`<button type="button">` with inline SVG X icon) with `searchInputClearStyles`, visible only when input has a value (non-empty string)
- On Enter keypress: call `onSearch` with current value
- On clear button click: call `setValue('')` to clear, call `onClear`, refocus the input via a ref
- Named export only: `SearchInput`

## Key Constraints

- Does NOT compose the existing Input component — renders its own `<input>` element
- Reuses `inputVariants` from `packages/ui/src/components/input/input.styles.ts` for visual consistency
- Uses `useControllableState` from `@components/hooks` for controlled/uncontrolled support
- Icons are inline SVGs (magnifying glass for search, X for clear) — no icon library dependency
- No new npm dependencies required

## Dependencies

- No prior tasks in this phase are required (can be done in parallel with t01/t02)
- Depends on M02 (Form Controls) for Input component's `inputVariants` export
- Depends on `@components/hooks` for `useControllableState` (already a workspace dependency)

## Verification

- `packages/ui/src/components/search-input/` contains `search-input.types.ts`, `search-input.styles.ts`, and `search-input.tsx`
- Component renders a search icon on the left and a clear button on the right
- Clear button is hidden when input is empty, visible when input has a value
- `onSearch` fires with current value on Enter keypress
- `onClear` fires on clear button click, clears the value, and refocuses the input
- Supports both controlled (`value`/`onChange`) and uncontrolled usage
- `data-slot="search-input"` is present on the root element
- `pnpm typecheck` passes with no errors related to the new files