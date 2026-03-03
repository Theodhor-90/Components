I now have all the context needed. Let me produce the complete implementation plan.

# Task: Empty State — Tests & Stories

**Milestone**: M04 — Data Display
**Phase**: P03 — States & Search
**Task**: T02
**Status**: Planning

---

## 1. Deliverables

| # | File | Action | Purpose |
|---|------|--------|---------|
| 1 | `packages/ui/src/components/empty-state/empty-state.test.tsx` | Create | Vitest + Testing Library + vitest-axe test suite |
| 2 | `packages/ui/src/components/empty-state/empty-state.stories.tsx` | Create | Storybook CSF3 stories with autodocs |

---

## 2. Dependencies

### Prerequisites

- **Task t01** (Empty State — Implementation) is complete. The following files exist and are ready:
  - `packages/ui/src/components/empty-state/empty-state.types.ts`
  - `packages/ui/src/components/empty-state/empty-state.styles.ts`
  - `packages/ui/src/components/empty-state/empty-state.tsx`
- **Button component** from Milestone 1 is available (used in story examples)
- EmptyState and its styles are already exported from `packages/ui/src/index.ts`

### Packages (already installed)

- `vitest` — test runner
- `@testing-library/react` — render/screen utilities
- `@testing-library/user-event` — user interaction simulation
- `vitest-axe` — accessibility assertions
- `@storybook/react-vite` — Storybook types for Meta/StoryObj

### New npm Dependencies

None — all required packages are already installed.

---

## 3. Implementation Details

### Deliverable 1: `empty-state.test.tsx`

**Purpose**: Comprehensive test suite validating the EmptyState component's rendering behavior, conditional slot rendering, prop forwarding, and accessibility.

**Imports**:
```ts
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { EmptyState } from './empty-state.js';
```

**Test structure**: Single `describe('EmptyState', () => { ... })` block containing 8 test cases.

**Test cases**:

1. **Smoke render** — Renders with only the required `title` prop. Asserts a `heading` with text matching the title is in the document.

2. **data-slot attribute** — Renders the component and asserts the root element has `data-slot="empty-state"` via `container.querySelector('[data-slot="empty-state"]')`.

3. **Icon rendering (present)** — Passes `icon={<svg data-testid="test-icon" />}` and asserts `screen.getByTestId('test-icon')` is in the document. Also asserts the icon wrapper `[data-slot="empty-state-icon"]` exists.

4. **Icon rendering (absent)** — Renders without `icon` prop and asserts `container.querySelector('[data-slot="empty-state-icon"]')` is `null`.

5. **Description rendering (present/absent)** — Passes `description="Some text"` and asserts the text is rendered in a `<p>` element. In a separate assertion, renders without `description` and asserts `container.querySelector('[data-slot="empty-state-description"]')` is `null`.

6. **Action rendering (present/absent)** — Passes `action={<button>Click</button>}` and asserts `screen.getByRole('button', { name: 'Click' })` is in the document and `[data-slot="empty-state-action"]` exists. In a separate assertion, renders without `action` and asserts `container.querySelector('[data-slot="empty-state-action"]')` is `null`.

7. **className merging** — Renders with `className="custom-class"` and asserts the root element has both `"custom-class"` and the base styles (e.g., `"flex"`, `"flex-col"`).

8. **Ref forwarding** — Creates a ref via `createRef<HTMLDivElement>()`, passes it to EmptyState, and asserts `ref.current` is an `HTMLDivElement` with `data-slot="empty-state"`.

9. **Accessibility** — Renders a fully-populated EmptyState (all props: icon, title, description, action) and asserts `expect(results).toHaveNoViolations()` where `results = await axe(container)`.

### Deliverable 2: `empty-state.stories.tsx`

**Purpose**: Storybook CSF3 stories showcasing all Empty State configurations with autodocs.

**Imports**:
```ts
import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from './empty-state.js';
import { Button } from '../button/button.js';
```

**Meta configuration**:
```ts
const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;
```

**Stories**:

1. **Default** — Title only (`title: "No items found"`). Uses `args`.

2. **WithIcon** — Title + inline SVG icon. Uses `render` function to pass an SVG element as the `icon` prop. The SVG should be a simple inbox/mailbox icon (a `<svg>` with `xmlns`, `viewBox`, `fill="none"`, `stroke="currentColor"` and simple path elements).

3. **WithDescription** — Title + description text. Uses `args` with `title` and `description` props.

4. **WithAction** — Title + description + Button CTA. Uses `render` function to pass `action={<Button>Create item</Button>}`.

5. **Complete** — All slots: icon SVG + title + description + Button CTA. Uses `render` function to populate all four props.

---

## 4. API Contracts

N/A — This task creates tests and stories for an existing component. No new API surface is introduced.

---

## 5. Test Plan

### Test Setup

- Test runner: Vitest (run via `pnpm test` or `pnpm --filter @components/ui test`)
- DOM environment: jsdom (configured in the existing Vitest config)
- Accessibility: vitest-axe with `toHaveNoViolations` matcher

### Per-Test Specification

| # | Test Name | Setup | Action | Assertion |
|---|-----------|-------|--------|-----------|
| 1 | renders with only required title prop | `render(<EmptyState title="Empty" />)` | — | `screen.getByRole('heading', { name: 'Empty' })` is in document |
| 2 | has data-slot="empty-state" on root | `render(<EmptyState title="T" />)` | — | `container.querySelector('[data-slot="empty-state"]')` is in document |
| 3 | renders icon when icon prop is provided | `render(<EmptyState title="T" icon={<svg data-testid="test-icon" />} />)` | — | `screen.getByTestId('test-icon')` is in document; `[data-slot="empty-state-icon"]` exists |
| 4 | does not render icon wrapper when icon is absent | `render(<EmptyState title="T" />)` | — | `container.querySelector('[data-slot="empty-state-icon"]')` is `null` |
| 5 | renders description when provided | `render(<EmptyState title="T" description="D" />)` | — | `screen.getByText('D')` is in document; `[data-slot="empty-state-description"]` exists |
| 6 | does not render description when absent | `render(<EmptyState title="T" />)` | — | `container.querySelector('[data-slot="empty-state-description"]')` is `null` |
| 7 | renders action when provided | `render(<EmptyState title="T" action={<button>Go</button>} />)` | — | `screen.getByRole('button', { name: 'Go' })` is in document; `[data-slot="empty-state-action"]` exists |
| 8 | does not render action wrapper when absent | `render(<EmptyState title="T" />)` | — | `container.querySelector('[data-slot="empty-state-action"]')` is `null` |
| 9 | merges custom className onto root | `render(<EmptyState title="T" className="custom-class" />)` | — | Root has both `"custom-class"` and `"flex"` classes |
| 10 | forwards ref to root div | `render(<EmptyState title="T" ref={ref} />)` | — | `ref.current` is `HTMLDivElement` with `data-slot="empty-state"` |
| 11 | has no accessibility violations | `render(<EmptyState title="T" description="D" icon={<svg />} action={<button>CTA</button>} />)` | `await axe(container)` | `results` has no violations |

---

## 6. Implementation Order

1. **Create `empty-state.test.tsx`** — Write all 11 test cases following the patterns established in `avatar-group.test.tsx` and `progress.test.tsx`. Use `createRef` from React for the ref test. Use `vitest-axe`'s `axe` function and `toHaveNoViolations` matcher for the accessibility test. Import `EmptyState` from `./empty-state.js`.

2. **Run tests to verify they pass** — Execute `pnpm --filter @components/ui test -- --run empty-state` to confirm all tests pass against the existing implementation from task t01.

3. **Create `empty-state.stories.tsx`** — Write all 5 stories in CSF3 format. Import `Button` from `../button/button.js` for the action slot examples. Use inline SVG for the icon prop in `WithIcon` and `Complete` stories.

4. **Run typecheck** — Execute `pnpm typecheck` to confirm no TypeScript errors.

---

## 7. Verification Commands

```bash
# Run only EmptyState tests
pnpm --filter @components/ui test -- --run empty-state

# Run full test suite to ensure no regressions
pnpm test

# TypeScript type checking
pnpm typecheck

# Verify all 5 files exist in the empty-state directory
ls packages/ui/src/components/empty-state/

# Launch Storybook to visually verify stories (manual step)
pnpm storybook
```

---

## 8. Design Deviations

None.