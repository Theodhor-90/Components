I now have all the information I need. Let me produce the implementation plan.

# Task 4: Search Input — Tests & Stories

**Milestone**: M04 — Data Display
**Phase**: P03 — States & Search
**Task**: T04

---

## 1. Deliverables

| # | File | Action | Purpose |
|---|------|--------|---------|
| 1 | `packages/ui/src/components/search-input/search-input.test.tsx` | Create | Vitest + Testing Library + vitest-axe test suite for SearchInput |
| 2 | `packages/ui/src/components/search-input/search-input.stories.tsx` | Create | Storybook CSF3 stories with autodocs for SearchInput |

---

## 2. Dependencies

### Prerequisites

- **Task t03** (Search Input — Implementation) is complete. The following files exist and are functional:
  - `packages/ui/src/components/search-input/search-input.types.ts`
  - `packages/ui/src/components/search-input/search-input.styles.ts`
  - `packages/ui/src/components/search-input/search-input.tsx`
- SearchInput and its types are already exported from `packages/ui/src/index.ts` (line 350–356)

### Packages (already installed)

- `vitest` — test runner
- `@testing-library/react` — render, screen
- `@testing-library/user-event` — user interaction simulation
- `vitest-axe` — accessibility assertions
- `@storybook/react-vite` — Storybook Meta/StoryObj types

### No new npm dependencies required.

---

## 3. Implementation Details

### Deliverable 1: `search-input.test.tsx`

**Purpose**: Comprehensive test suite validating SearchInput's rendering, interactions, controlled/uncontrolled behavior, and accessibility.

**Imports**:
```ts
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { SearchInput } from './search-input.js';
```

**Test suite structure** (`describe('SearchInput', () => { ... })`):

1. **Smoke render** — Renders without crashing with no props. Verifies a `searchbox` role input is in the document. Note: `<input type="search">` has the implicit `searchbox` role, so use `screen.getByRole('searchbox')`.

2. **data-slot on root** — Renders the component, queries `[data-slot="search-input"]` on the container and asserts it exists.

3. **Renders search icon** — The magnifying glass SVG is rendered with `aria-hidden="true"`. Query `container.querySelector('svg[aria-hidden="true"]')` and assert it exists. The first `<svg>` in the container is the search icon.

4. **Clear button hidden when empty** — Render with no value. Assert `screen.queryByRole('button', { name: 'Clear search' })` returns `null`.

5. **Clear button visible when input has value** — Render with `defaultValue="hello"`. Assert `screen.getByRole('button', { name: 'Clear search' })` is in the document.

6. **Calls onSearch with current value on Enter** — Setup `userEvent`, render with `onSearch` spy and `placeholder` for an accessible label. Type "test query" into the searchbox, then press Enter via `user.keyboard('{Enter}')`. Assert `onSearch` was called with `'test query'`.

7. **Calls onClear when clear button is clicked** — Render with `defaultValue="hello"` and `onClear` spy. Click the clear button via `user.click(screen.getByRole('button', { name: 'Clear search' }))`. Assert `onClear` was called once.

8. **Clears input value on clear button click** — Render with `defaultValue="hello"`. Click the clear button. Assert the searchbox value is `''`.

9. **Refocuses input after clear button click** — Render with `defaultValue="hello"`. Click the clear button. Assert `screen.getByRole('searchbox')` has focus via `expect(screen.getByRole('searchbox')).toHaveFocus()`.

10. **Controlled mode** — Render with `value="controlled"` and `onChange` spy. Assert the input displays `"controlled"`. Type a character. Assert `onChange` was called. The value remains `"controlled"` because the parent hasn't updated it (controlled behavior).

11. **Uncontrolled mode** — Render with no `value` prop. Type "hello" into the searchbox. Assert the searchbox has value `"hello"`.

12. **Forwards ref to the input element** — Create a ref via `createRef<HTMLInputElement>()`. Render `<SearchInput ref={ref} aria-label="Ref test" />`. Assert `ref.current` is an `HTMLInputElement` and has `type` attribute `"search"`.

13. **Merges custom className onto container** — Render with `className="custom-class"`. Query `[data-slot="search-input"]` and assert it has class `"custom-class"`.

14. **Placeholder passes through** — Render with `placeholder="Search..."`. Assert `screen.getByPlaceholderText('Search...')` is in the document.

15. **Accessibility — no violations** — Render with `aria-label="Search"`. Run `axe(container)` and assert `toHaveNoViolations()`.

**Key patterns** (matching existing test conventions from sibling tasks):
- Use `createRef` from React (not `React.createRef`)
- Use `userEvent.setup()` before each interaction test
- Use `vi.fn()` for spy functions
- Use `aria-label` on the SearchInput to ensure axe doesn't flag missing labels
- All interaction tests use `@testing-library/user-event` (never `fireEvent`)

### Deliverable 2: `search-input.stories.tsx`

**Purpose**: Interactive Storybook documentation covering all states and usage patterns.

**Imports**:
```ts
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { SearchInput } from './search-input.js';
```

**Meta configuration**:
```ts
const meta: Meta<typeof SearchInput> = {
  title: 'Components/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;
```

**Stories**:

1. **`Default`** — Empty search input with placeholder:
   ```ts
   export const Default: Story = {
     args: { placeholder: 'Search...', 'aria-label': 'Search' },
   };
   ```

2. **`WithValue`** — Pre-populated value showing clear button:
   ```ts
   export const WithValue: Story = {
     args: { defaultValue: 'React components', 'aria-label': 'Search' },
   };
   ```

3. **`Controlled`** — Controlled usage with `value`/`onChange` using `useState` in a render function:
   ```ts
   export const Controlled: Story = {
     render: () => {
       const [value, setValue] = useState('');
       return (
         <SearchInput
           value={value}
           onChange={(e) => setValue(e.target.value)}
           placeholder="Type to search..."
           aria-label="Controlled search"
         />
       );
     },
   };
   ```

4. **`WithSearchHandler`** — Demonstrates `onSearch` callback via Storybook actions:
   ```ts
   export const WithSearchHandler: Story = {
     args: {
       placeholder: 'Press Enter to search...',
       onSearch: (value: string) => console.log('Searched:', value),
       'aria-label': 'Search with handler',
     },
   };
   ```
   Note: Use `action('onSearch')` from `@storybook/addon-actions` if available, or use `console.log` for simplicity following the existing pattern in the codebase.

5. **`Disabled`** — Disabled state:
   ```ts
   export const Disabled: Story = {
     args: { disabled: true, defaultValue: 'Cannot search', 'aria-label': 'Disabled search' },
   };
   ```

---

## 4. API Contracts

N/A — this task creates tests and stories for the existing SearchInput component. The component API is already defined in `search-input.types.ts`:

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

---

## 5. Test Plan

### Test Setup

- **Runner**: Vitest (via `pnpm test`)
- **Environment**: jsdom (configured in vitest config)
- **Libraries**: `@testing-library/react`, `@testing-library/user-event`, `vitest-axe`
- **Location**: `packages/ui/src/components/search-input/search-input.test.tsx`

### Per-Test Specification

| # | Test Name | Category | Setup | Action | Assertion |
|---|-----------|----------|-------|--------|-----------|
| 1 | renders without crashing | Smoke | `render(<SearchInput aria-label="Search" />)` | — | `screen.getByRole('searchbox')` is in document |
| 2 | has data-slot on root | Smoke | `render(<SearchInput aria-label="Search" />)` | — | `container.querySelector('[data-slot="search-input"]')` is not null |
| 3 | renders search icon | Rendering | `render(<SearchInput aria-label="Search" />)` | — | `container.querySelector('svg[aria-hidden="true"]')` is not null |
| 4 | clear button hidden when empty | Rendering | `render(<SearchInput aria-label="Search" />)` | — | `screen.queryByRole('button', { name: 'Clear search' })` is null |
| 5 | clear button visible when has value | Rendering | `render(<SearchInput defaultValue="hello" aria-label="Search" />)` | — | `screen.getByRole('button', { name: 'Clear search' })` is in document |
| 6 | calls onSearch on Enter | Interaction | `userEvent.setup()`, render with `onSearch` spy | Type "test", press Enter | `onSearch` called with `'test'` |
| 7 | calls onClear on clear click | Interaction | `userEvent.setup()`, render with `defaultValue="hello"`, `onClear` spy | Click clear button | `onClear` called once |
| 8 | clears input on clear click | Interaction | `userEvent.setup()`, render with `defaultValue="hello"` | Click clear button | searchbox value is `''` |
| 9 | refocuses input after clear | Interaction | `userEvent.setup()`, render with `defaultValue="hello"` | Click clear button | searchbox has focus |
| 10 | controlled mode | State | Render with `value="controlled"`, `onChange` spy | Type "a" | `onChange` called; value stays `"controlled"` |
| 11 | uncontrolled mode | State | Render without `value` | Type "hello" | searchbox value is `"hello"` |
| 12 | forwards ref | Ref | `createRef<HTMLInputElement>()`, render with ref | — | `ref.current` is HTMLInputElement with type="search" |
| 13 | merges className | Styling | Render with `className="custom-class"` | — | Root element has class `"custom-class"` |
| 14 | placeholder passes through | Props | Render with `placeholder="Search..."` | — | `getByPlaceholderText('Search...')` is in document |
| 15 | no a11y violations | Accessibility | Render with `aria-label="Search"` | `axe(container)` | `toHaveNoViolations()` |

---

## 6. Implementation Order

1. **Create `search-input.test.tsx`** — Write all 15 tests following the specification above. Ensure tests pass against the existing `search-input.tsx` implementation.

2. **Create `search-input.stories.tsx`** — Write all 5 stories following the specification above.

3. **Run `pnpm test` in `packages/ui/`** — Verify all SearchInput tests pass (and no existing tests regress).

4. **Run `pnpm typecheck`** — Verify no TypeScript errors in the new files.

5. **Verify Storybook renders** — Confirm all 5 stories render in Storybook (this is a visual verification step).

---

## 7. Verification Commands

```bash
# Run all tests in the ui package (includes the new search-input tests)
pnpm --filter @components/ui test

# Run only the search-input test file
pnpm --filter @components/ui test src/components/search-input/search-input.test.tsx

# TypeScript type checking across the entire monorepo
pnpm typecheck

# TypeScript type checking for just the ui package
pnpm --filter @components/ui typecheck

# Lint the ui package
pnpm --filter @components/ui lint

# Launch Storybook to visually verify stories (interactive)
pnpm storybook
```

---

## 8. Design Deviations

**Deviation 1: Using `searchbox` role instead of `textbox` for querying the input**

- **Parent spec requires**: The task spec lists "Smoke render with no props" and refers to the native `<input>` element.
- **Why the prescribed approach needs adjustment**: The SearchInput component renders `<input type="search">`, which has the implicit ARIA role `searchbox` (not `textbox`). Using `getByRole('textbox')` would fail to find the element.
- **Alternative chosen**: All tests query with `screen.getByRole('searchbox')`. This correctly matches `<input type="search">` and follows Testing Library best practices of using semantic role queries.

**No other deviations are needed.**