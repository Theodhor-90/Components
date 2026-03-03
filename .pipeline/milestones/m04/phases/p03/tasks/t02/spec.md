# Task: Empty State — Tests & Stories

## Objective

Create the test suite and Storybook stories for the Empty State component, completing its 5-file pattern.

## Files to Create

All files under `packages/ui/src/components/empty-state/`:

### 1. `empty-state.test.tsx`

Vitest + Testing Library + vitest-axe test suite covering:
- Smoke render with only the required `title` prop
- `data-slot="empty-state"` present on the root element
- Renders icon when `icon` prop is provided; does NOT render icon wrapper when absent
- Renders description when provided; does NOT render description `<p>` when absent
- Renders action when provided; does NOT render action wrapper when absent
- Merges custom `className` onto the root element
- Forwards `ref` to the root `<div>` element
- vitest-axe accessibility assertion (`expect(container).toHaveNoViolations()`) on a fully-populated instance (all props provided)

Use `@testing-library/user-event` for any interaction tests (not `fireEvent`).

### 2. `empty-state.stories.tsx`

Storybook CSF3 format with `tags: ['autodocs']` in meta:
- `Default` — title only (minimum required props)
- `WithIcon` — title + icon (e.g., an inbox SVG icon)
- `WithDescription` — title + description text
- `WithAction` — title + description + Button CTA
- `Complete` — all slots populated (icon + title + description + action)

Import Button from the library for action slot examples.

## Dependencies

- **Task t01** (Empty State — Implementation) must be complete
- Button component from M01 for story examples
- Vitest + Testing Library + vitest-axe test infrastructure must be operational
- Storybook 8.5 with Tailwind v4 theme integration must be running

## Verification

- `packages/ui/src/components/empty-state/` contains all 5 files
- `pnpm test` passes with all Empty State tests green (zero failures)
- vitest-axe reports no accessibility violations
- All 5 stories render correctly in Storybook with autodocs
- `pnpm typecheck` passes with no errors