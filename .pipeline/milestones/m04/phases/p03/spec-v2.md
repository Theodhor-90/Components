Good. Now I have all the context needed to produce the revised specification. The two issues are:

1. **Format issue**: Remove the preamble text on line 1
2. **Ambiguity issue**: Fix `SearchInputProps` to explicitly `Omit` conflicting properties from the base type before re-declaring them

# Phase 3: States & Search — Specification

**Milestone**: M04 — Data Display
**Phase**: P03
**Status**: Planning

---

## Goal

Deliver two custom components — Empty State and Search Input — that enable consumer apps to display meaningful placeholder content when data is absent and provide inline search-with-clear functionality in data-rich interfaces. Both components are custom (no shadcn equivalent) and follow the established 5-file pattern with full test and Storybook coverage.

---

## Design Decisions

### DD-1: Empty State uses render-prop slots, not compound components

Empty State is a simple layout component, not an interactive primitive. It accepts `icon`, `title`, `description`, and `action` props rather than exposing sub-components (EmptyStateTitle, etc.). This keeps the API surface minimal — consumers pass a `ReactNode` for the icon and action slots, a `string` for title and description. There is no need for Radix primitives or compound component patterns for a static layout.

### DD-2: Search Input renders its own `<input>` — does not compose Input

Search Input needs structural control over the container layout (relative positioning with absolutely-positioned icon and clear button). Composing the existing Input component would require injecting elements around it, fighting its encapsulation. Instead, Search Input renders its own native `<input>` and reuses `inputVariants` from `input.styles.ts` for visual consistency. This is explicitly called out in the milestone spec.

### DD-3: Search Input supports controlled and uncontrolled modes

Following the same pattern established by Input, Checkbox, and other form controls in Milestone 2, Search Input uses `useControllableState` (or a simple internal-state-with-override pattern). When `value` and `onChange` are provided, the component is controlled. Otherwise, it tracks input value internally. The `onClear` callback clears the value in both modes.

### DD-4: No CVA variants for Empty State

Empty State has no visual variants (no size, color, or style variants). Its styles are exported as static string constants from `empty-state.styles.ts`, following the same pattern as Progress. This avoids unnecessary CVA overhead for a single-variant component.

### DD-5: Search Input uses CVA for the container only

Search Input's `<input>` element reuses `inputVariants` from the Input component. The container `<div>` gets its own static styles. The icon and clear button use static style strings. No new CVA variant definition is needed in `search-input.styles.ts` — the file exports static string constants for the container, icon, and clear button.

### DD-6: No new npm dependencies

Both components are custom and use only native HTML elements. No Radix primitives or third-party libraries are required. The only cross-component dependency is the import of `inputVariants` from the Input component's styles file.

---

## Tasks

### Task 1: Empty State — Implementation

**Deliverables:**

Create `packages/ui/src/components/empty-state/` with the 5-file pattern:

- **`empty-state.types.ts`** — Define `EmptyStateProps` extending `React.ComponentProps<'div'>` with:
  - `icon?: React.ReactNode` — optional icon rendered above the title
  - `title: string` — required heading text
  - `description?: string` — optional body text
  - `action?: React.ReactNode` — optional CTA button or link

- **`empty-state.styles.ts`** — Export static style strings:
  - `emptyStateStyles` — flexbox container: `flex flex-col items-center justify-center text-center p-8`
  - `emptyStateIconStyles` — icon wrapper: `mb-4 text-muted-foreground [&>svg]:h-10 [&>svg]:w-10`
  - `emptyStateTitleStyles` — title: `text-lg font-semibold text-foreground`
  - `emptyStateDescriptionStyles` — description: `mt-1 text-sm text-muted-foreground max-w-sm`
  - `emptyStateActionStyles` — action wrapper: `mt-4`

- **`empty-state.tsx`** — Implementation:
  - Renders a `<div data-slot="empty-state">` with `cn(emptyStateStyles, className)`
  - Conditionally renders icon wrapped in `<div data-slot="empty-state-icon">`
  - Renders title in `<h3 data-slot="empty-state-title">`
  - Conditionally renders description in `<p data-slot="empty-state-description">`
  - Conditionally renders action wrapped in `<div data-slot="empty-state-action">`
  - Accepts `ref` prop (React 19 ref-as-prop)
  - Named export: `EmptyState`

### Task 2: Empty State — Tests & Stories

**Deliverables:**

- **`empty-state.test.tsx`** — Test suite covering:
  - Smoke render with only required `title` prop
  - `data-slot="empty-state"` on root element
  - Renders icon when `icon` prop is provided, does not render icon wrapper when absent
  - Renders description when provided, does not render description when absent
  - Renders action when provided, does not render action wrapper when absent
  - Merges custom `className` onto root element
  - Forwards `ref` to root `<div>`
  - vitest-axe accessibility assertion on a fully-populated instance

- **`empty-state.stories.tsx`** — Storybook CSF3 with `tags: ['autodocs']`:
  - `Default` — title only
  - `WithIcon` — title + icon (e.g., an inbox SVG)
  - `WithDescription` — title + description
  - `WithAction` — title + description + Button CTA
  - `Complete` — all slots populated (icon + title + description + action)

### Task 3: Search Input — Implementation

**Deliverables:**

Create `packages/ui/src/components/search-input/` with the 5-file pattern:

- **`search-input.types.ts`** — Define `SearchInputProps` as:
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
  The base type explicitly omits `type` (always `"search"`), `value`, `defaultValue`, and `onChange` before re-declaring them with narrowed string-only types. This avoids TypeScript conflicting-property errors that would arise from the native input's `string | number | readonly string[]` union types.

- **`search-input.styles.ts`** — Export static style strings:
  - `searchInputContainerStyles` — relative container: `relative`
  - `searchInputIconStyles` — search icon: `pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`
  - `searchInputClearStyles` — clear button: `absolute right-1 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`
  - `searchInputFieldStyles` — additional input styles: `pl-9 pr-9` (padding for icon and clear button)

- **`search-input.tsx`** — Implementation:
  - Renders a `<div data-slot="search-input">` container with `cn(searchInputContainerStyles, className)`
  - Renders inline SVG magnifying glass icon with `searchInputIconStyles`
  - Renders `<input>` with `type="search"`, applying `cn(inputVariants(), searchInputFieldStyles)` for styling
  - Input accepts `ref` prop and spreads remaining HTML input props
  - Renders clear button (inline SVG X icon) with `searchInputClearStyles`, visible only when input has a value
  - On Enter keypress: calls `onSearch` with current value
  - On clear button click: clears the value, calls `onClear`, refocuses the input
  - Supports controlled mode (when `value` prop is provided) and uncontrolled mode (internal `useState`)
  - Named export: `SearchInput`

### Task 4: Search Input — Tests & Stories

**Deliverables:**

- **`search-input.test.tsx`** — Test suite covering:
  - Smoke render with no props
  - `data-slot="search-input"` on root element
  - Renders search icon (magnifying glass SVG)
  - Clear button hidden when input is empty, visible when input has value
  - Calls `onSearch` with current value when Enter is pressed
  - Calls `onClear` when clear button is clicked
  - Clears input value on clear button click
  - Refocuses input after clear button click
  - Controlled mode: `value` and `onChange` props control the input
  - Uncontrolled mode: typing updates internal state
  - Forwards `ref` to the `<input>` element
  - Merges custom `className` onto container
  - `placeholder` prop passes through to native input
  - vitest-axe accessibility assertion

- **`search-input.stories.tsx`** — Storybook CSF3 with `tags: ['autodocs']`:
  - `Default` — empty search input with placeholder
  - `WithValue` — pre-populated value showing clear button
  - `Controlled` — controlled usage with `value`/`onChange`
  - `WithSearchHandler` — demonstrates `onSearch` callback logging
  - `Disabled` — disabled state

### Task 5: Export Registration & Integration Verification

**Deliverables:**

- Add Empty State exports to `packages/ui/src/index.ts`:
  ```
  export { EmptyState, type EmptyStateProps } from './components/empty-state/empty-state.js';
  export { emptyStateStyles, emptyStateIconStyles, emptyStateTitleStyles, emptyStateDescriptionStyles, emptyStateActionStyles } from './components/empty-state/empty-state.styles.js';
  ```

- Add Search Input exports to `packages/ui/src/index.ts`:
  ```
  export { SearchInput, type SearchInputProps } from './components/search-input/search-input.js';
  export { searchInputContainerStyles, searchInputIconStyles, searchInputClearStyles, searchInputFieldStyles } from './components/search-input/search-input.styles.js';
  ```

- Verify `pnpm typecheck` passes with no errors
- Verify `pnpm test` passes with all new tests green
- Verify both components render correctly in Storybook (`pnpm storybook`)

---

## Exit Criteria

1. `packages/ui/src/components/empty-state/` contains all 5 files following the established pattern
2. `packages/ui/src/components/search-input/` contains all 5 files following the established pattern
3. Empty State renders a centered layout with conditional icon, title, description, and action slots
4. Empty State renders only the title when optional props are omitted (no empty wrappers)
5. Search Input renders an inline SVG search icon on the left and a clear button on the right
6. Search Input fires `onSearch` with the current value when Enter is pressed
7. Search Input fires `onClear` on clear button click, clears the input value, and refocuses the input
8. Search Input supports both controlled (`value`/`onChange`) and uncontrolled usage
9. Search Input visually matches the Input component by reusing `inputVariants` from `input.styles.ts`
10. `pnpm typecheck` passes with no TypeScript errors
11. `pnpm test` passes with zero failures, including vitest-axe accessibility assertions for both components
12. Both components render correctly in Storybook with all stories documented via autodocs
13. Both components and their types are exported from `packages/ui/src/index.ts`
14. Style constants are separately exported from `packages/ui/src/index.ts`

---

## Dependencies

### Prior Phases (must be complete)

- **M04/P01 — Tables & Pagination**: Establishes the milestone 4 component pattern
- **M04/P02 — Identity & Hints**: Provides Avatar, Avatar Group, Tooltip, Hover Card, and Progress; confirms the custom component pattern (Avatar Group) used as reference for Empty State and Search Input

### Prior Milestones (must be complete)

- **Milestone 1 (Foundation)**: Provides Button (referenced in Empty State action stories), the 5-file pattern, and `cn()` utility
- **Milestone 2 (Form Controls)**: Provides Input and `inputVariants` from `input.styles.ts` (imported by Search Input for visual consistency), and the controlled/uncontrolled state pattern
- **Milestone 3 (Layout & Navigation)**: Must be complete as the preceding milestone in the master plan

### Infrastructure

- Monorepo build pipeline (`pnpm`, Turborepo, `tsc --build`) operational
- Storybook 8.5 running with Tailwind v4 theme integration
- Vitest + Testing Library + vitest-axe test infrastructure operational

### Cross-Component Import

- Search Input imports `inputVariants` from `packages/ui/src/components/input/input.styles.ts` — this is the only cross-component dependency in this phase

### New npm Dependencies

- None — both components are custom and use only native HTML elements

---

## Artifacts

| Artifact | Action | Description |
|---|---|---|
| `packages/ui/src/components/empty-state/empty-state.types.ts` | Create | EmptyState props type definition |
| `packages/ui/src/components/empty-state/empty-state.styles.ts` | Create | Static style string exports |
| `packages/ui/src/components/empty-state/empty-state.tsx` | Create | EmptyState component implementation |
| `packages/ui/src/components/empty-state/empty-state.test.tsx` | Create | Vitest + vitest-axe test suite |
| `packages/ui/src/components/empty-state/empty-state.stories.tsx` | Create | Storybook CSF3 stories with autodocs |
| `packages/ui/src/components/search-input/search-input.types.ts` | Create | SearchInput props type definition |
| `packages/ui/src/components/search-input/search-input.styles.ts` | Create | Static style string exports |
| `packages/ui/src/components/search-input/search-input.tsx` | Create | SearchInput component implementation |
| `packages/ui/src/components/search-input/search-input.test.tsx` | Create | Vitest + vitest-axe test suite |
| `packages/ui/src/components/search-input/search-input.stories.tsx` | Create | Storybook CSF3 stories with autodocs |
| `packages/ui/src/index.ts` | Modify | Add exports for both components, types, and styles |