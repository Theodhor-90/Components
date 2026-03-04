# Phase 2: Developer Utilities

## Goal

Build three custom utility components — Code Block, Copy to Clipboard, and Connection Status — for code display, clipboard interaction, and connectivity status indication. These are custom components with no shadcn/ui equivalent, completing Milestone 6 and the full component library's coverage of all identified UI patterns across the five consumer applications.

## Deliverables

### 1. Code Block

- **Type**: Custom component rendering `<pre>` + `<code>` wrapper
- **Features**:
  - Monospace font with theme-aware background (`bg-muted` semantic token)
  - Optional line numbers via `showLineNumbers` prop (default: `false`)
  - Integrated copy-to-clipboard button in the top-right corner using `navigator.clipboard.writeText()`
  - Transient "Copied!" feedback on the copy button
  - Optional `language` prop for display labeling only (no syntax highlighting — that is a consumer concern)
  - Accepts `children` as the code string content
- **Files**: `code-block.tsx`, `code-block.types.ts`, `code-block.styles.ts`, `code-block.test.tsx`, `code-block.stories.tsx`

### 2. Copy to Clipboard

- **Type**: Custom button component
- **Features**:
  - Writes provided `text` prop value to system clipboard via `navigator.clipboard.writeText()`
  - On success: swaps icon from copy icon to checkmark, shows "Copied!" feedback for 2 seconds, then resets
  - Built as a styled Button variant composition
  - Supports `asChild` for polymorphic rendering via `@radix-ui/react-slot`
- **Files**: `copy-to-clipboard.tsx`, `copy-to-clipboard.types.ts`, `copy-to-clipboard.styles.ts`, `copy-to-clipboard.test.tsx`, `copy-to-clipboard.stories.tsx`

### 3. Connection Status

- **Type**: Custom component with colored status dot + text label
- **Status states**: `connected` (green dot, "Connected" default label), `connecting` (yellow dot with pulse animation, "Connecting" default label), `disconnected` (red dot, "Disconnected" default label)
- **Customization**: Text label overridable via `children` prop
- **Styling**: CVA variants for status-based color mapping to OKLCH semantic tokens; pulse animation via Tailwind `animate-pulse` utility
- **Files**: `connection-status.tsx`, `connection-status.types.ts`, `connection-status.styles.ts`, `connection-status.test.tsx`, `connection-status.stories.tsx`

### Shared deliverables

- Vitest + Testing Library + vitest-axe test suites for all three components
- Storybook CSF3 stories with `tags: ['autodocs']` covering all variants and states
- Public API exports added to `packages/ui/src/index.ts` (components, props types, CVA variant functions)

## Technical Decisions & Constraints

- No new external dependencies — built from native HTML elements, CVA, `cn()` helper, and `@radix-ui/react-slot`
- **Clipboard API**: `navigator.clipboard.writeText()` requires secure context (HTTPS or localhost). Tests must mock this API since JSDOM does not implement it. Non-HTTPS fallback handling is out of scope (consumer responsibility).
- All animations must use Tailwind utility classes (`animate-pulse`, etc.) rather than custom CSS keyframes for consistency
- Copy to Clipboard feedback transition (icon swap + text change) uses React state with `setTimeout` for the 2-second reset
- React 19 conventions: `ref` as prop (no `forwardRef`), `data-slot` on root elements, named exports only
- No syntax highlighting in Code Block — monospace `<pre>` + `<code>` only

## Dependencies

- **Prior milestones**: Milestone 1 (Button component — used as the base for Copy to Clipboard and Code Block's copy button)
- **Prior phases**: Phase 1 (Process Visualization) — must be complete before starting Phase 2 per milestone phase ordering
- **Internal packages**: `@components/utils` (`cn()` helper), `class-variance-authority` (CVA), `@radix-ui/react-slot`