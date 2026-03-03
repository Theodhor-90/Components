## Goal

Implement components for empty/placeholder states and inline search filtering — enabling consumer apps to display meaningful empty states with calls-to-action and provide search-with-clear functionality in data-rich interfaces.

## Deliverables

- **Empty State** — custom component with a centered flexbox layout containing:
  - An optional icon slot (rendered above the title via a `ReactNode` prop)
  - A required title
  - An optional description (using `text-muted-foreground`)
  - An optional CTA button slot (also a `ReactNode` prop)
  - Centers content both horizontally and vertically within its container.
- **Search Input** — custom standalone component that renders its own `<input>` element (does **not** compose the existing Input component). Renders a relative-positioned container `<div>` with:
  - An absolutely-positioned search icon (inline SVG, magnifying glass) on the left
  - A native `<input>` element with left padding to accommodate the icon, styled to match Input's visual appearance by reusing `inputVariants` from `input.styles.ts`
  - An absolutely-positioned clear button (inline SVG, X icon) on the right, visible only when the input has a value
  - Fires `onSearch` when the user presses Enter
  - Fires `onClear` when the clear button is clicked (which also clears the input value and refocuses the `<input>`)
  - Supports both controlled (`value`/`onChange`) and uncontrolled usage via internal state.
- Full Vitest + vitest-axe test suites and Storybook CSF3 stories with autodocs for both components.
- Both components exported from `packages/ui/src/index.ts`.

## Technical Constraints

- Both components follow the 5-file pattern: `{name}.tsx`, `{name}.styles.ts`, `{name}.types.ts`, `{name}.test.tsx`, `{name}.stories.tsx`.
- Search Input reuses `inputVariants` from the existing Input component's `input.styles.ts` for visual consistency but does NOT compose the Input component itself.
- Search Input must support both controlled and uncontrolled modes — when `value` and `onChange` are provided, the component is controlled; otherwise it manages state internally.
- React 19 ref-as-prop — no `forwardRef`. Named exports only. `import type` for type-only imports.
- Use OKLCH semantic tokens for all styling.
- No new npm dependencies required for this phase.

## Dependencies

- **Phase 1 (Tables & Pagination)** and **Phase 2 (Identity & Hints)** of this milestone must be complete.
- **Milestone 1 (Foundation)** — provides the established 5-file component pattern and Button (used by Empty State CTA).
- **Milestone 2 (Form Controls)** — provides Input whose `inputVariants` CVA styles are reused by Search Input, and the established pattern for controlled/uncontrolled component state.
- **Milestone 3 (Layout & Navigation)** — must be complete as the preceding milestone.
- Existing dependencies: `@radix-ui/react-slot` (for `asChild` if needed), `class-variance-authority`, `@components/utils` (`cn()` helper).
