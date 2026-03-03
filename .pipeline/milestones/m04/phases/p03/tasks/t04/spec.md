# Task: Search Input — Tests & Stories

## Objective

Create the test suite and Storybook stories for the Search Input component, completing its 5-file pattern.

## Files to Create

All files under `packages/ui/src/components/search-input/`:

### 1. `search-input.test.tsx`

Vitest + Testing Library + vitest-axe test suite covering:
- Smoke render with no props
- `data-slot="search-input"` present on root element
- Renders search icon (magnifying glass SVG)
- Clear button hidden when input is empty, visible when input has a value
- Calls `onSearch` with current value when Enter is pressed
- Calls `onClear` when clear button is clicked
- Clears input value on clear button click
- Refocuses input after clear button click
- Controlled mode: `value` and `onChange` props control the input
- Uncontrolled mode: typing updates internal state
- Forwards `ref` to the `<input>` element
- Merges custom `className` onto the container `<div>`
- `placeholder` prop passes through to native `<input>`
- vitest-axe accessibility assertion (`expect(container).toHaveNoViolations()`)

Use `@testing-library/user-event` for all interaction tests (not `fireEvent`). For the controlled mode test, verify that the component reflects the controlled `value` prop and calls `onChange` on user input.

### 2. `search-input.stories.tsx`

Storybook CSF3 format with `tags: ['autodocs']` in meta:
- `Default` — empty search input with placeholder text
- `WithValue` — pre-populated value showing the clear button visible
- `Controlled` — controlled usage with `value`/`onChange` state management
- `WithSearchHandler` — demonstrates `onSearch` callback (e.g., logging to actions panel)
- `Disabled` — disabled state

## Dependencies

- **Task t03** (Search Input — Implementation) must be complete
- Vitest + Testing Library + vitest-axe test infrastructure must be operational
- Storybook 8.5 with Tailwind v4 theme integration must be running

## Verification

- `packages/ui/src/components/search-input/` contains all 5 files
- `pnpm test` passes with all Search Input tests green (zero failures)
- vitest-axe reports no accessibility violations
- All 5 stories render correctly in Storybook with autodocs
- `pnpm typecheck` passes with no errors