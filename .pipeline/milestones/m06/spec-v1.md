Now I have a complete picture. Let me produce the milestone specification.

# Milestone 6: Domain Patterns — Specification

## Goal

Deliver five custom reusable components — Stepper, Timeline, Code Block, Copy to Clipboard, and Connection Status — extracted from sibling project needs that have no shadcn/ui equivalent, completing the component library's coverage of all identified UI patterns across the five consumer applications (Task Manager, Chess, Orchestrator, Iteration Engine, Scheduler).

## Scope

### Included

- 5 custom components, each following the 5-file pattern (implementation, types, styles, tests, stories)
- CVA variant definitions for components with multiple visual states (Stepper orientation, Connection Status state)
- Vitest + Testing Library + vitest-axe test suites for all components
- Storybook CSF3 stories with autodocs for all components and their variants
- Public API exports from `packages/ui/src/index.ts`

### Out of Scope

- Syntax highlighting for Code Block (monospace `<pre>` + `<code>` only; syntax highlighting is a consumer concern)
- Rich text or markdown rendering within Timeline item content
- Stepper form integration (Stepper is a visual progress indicator, not a multi-step form wizard)
- New Radix UI primitives or third-party library dependencies (all 5 components are built from native HTML elements and existing internal utilities)

## Phases

### Phase 1: Process Visualization

Build two components for displaying sequential progress and event history.

**Components:**

1. **Stepper** — Custom compound component with `Stepper` (container) and `StepperItem` (individual step). Supports two orientations via `orientation` prop: `horizontal` (default) and `vertical`. Each `StepperItem` accepts a `status` prop with four states: `pending`, `active`, `completed`, `error`. Renders status-appropriate icons (circle for pending, filled circle for active, checkmark for completed, X for error), connecting lines between steps, a required `title`, and an optional `description`. Connecting lines reflect the status of the preceding step (completed lines are visually distinct from pending lines).

2. **Timeline** — Custom compound component with `Timeline` (container) and `TimelineItem` (individual event). Renders a vertical sequence of events, each with a status dot, a `title`, an optional `timestamp`, and an optional `content` body. Status dots are connected by a vertical line. The component accepts items in the order they are provided (consumer controls ordering). Each `TimelineItem` supports an optional `status` prop for dot color variations.

### Phase 2: Developer Utilities

Build three utility components for code display, clipboard interaction, and connectivity status.

**Components:**

3. **Code Block** — Custom component rendering a `<pre>` + `<code>` wrapper with monospace font, theme-aware background using semantic tokens (`bg-muted`), optional line numbers via `showLineNumbers` prop (default: `false`), and an integrated copy-to-clipboard button positioned in the top-right corner. Accepts `children` as the code string content and an optional `language` prop for labeling (display only, no syntax highlighting). The copy button uses the Clipboard API to write the code content and shows transient "Copied!" feedback.

4. **Copy to Clipboard** — Custom button component that writes a provided `text` prop value to the system clipboard using `navigator.clipboard.writeText()`. On successful copy, swaps its icon from a copy icon to a checkmark and displays "Copied!" feedback for 2 seconds, then resets to its default state. Built as a styled Button variant composition, supporting `asChild` for polymorphic rendering.

5. **Connection Status** — Custom component displaying a colored status dot alongside a text label. Accepts a `status` prop with three states: `connected` (green dot, "Connected" default label), `connecting` (yellow dot with pulse animation, "Connecting" default label), `disconnected` (red dot, "Disconnected" default label). The text label can be overridden via `children`. Uses CVA for status-based color variants mapped to OKLCH semantic tokens.

## Exit Criteria

1. All 5 components (Stepper, Timeline, Code Block, Copy to Clipboard, Connection Status) render correctly in Storybook with all variants and states documented via autodocs
2. `pnpm test` passes with zero failures, including vitest-axe accessibility assertions for every component
3. `pnpm typecheck` passes with no TypeScript errors across the entire monorepo
4. Stepper correctly renders horizontal and vertical orientations with all four status states (pending, active, completed, error) and connecting lines between steps
5. Timeline renders items in vertical sequence with connected status dots and a continuous vertical line
6. Code Block copies its content to the clipboard on copy button click and optionally displays line numbers
7. Copy to Clipboard shows transient "Copied!" checkmark feedback that resets to the default icon after 2 seconds
8. Connection Status displays the correct color (green/yellow/red) and optional pulse animation for each of its three states
9. All 5 components, their sub-components, prop types, and CVA variant functions are exported from `packages/ui/src/index.ts`

## Dependencies

### Prior Milestones (must be complete)

- **Milestone 1: Foundation** — Button (used as the base for Copy to Clipboard's click behavior and Code Block's copy button)
- **Milestone 2: Form Controls** — None directly required, but the 5-file pattern and testing conventions established across M1–M5 apply

### External Libraries

No new external dependencies required. All five components are custom implementations using:

- `class-variance-authority` — already installed (CVA variant definitions)
- `@components/utils` — already installed (`cn()` helper)
- `@radix-ui/react-slot` — already installed (`asChild` support for Copy to Clipboard)

### Browser APIs

- `navigator.clipboard.writeText()` — used by Code Block and Copy to Clipboard (requires secure context in production; tests should mock this API)

## Risks

1. **Clipboard API availability** — `navigator.clipboard.writeText()` requires a secure context (HTTPS or localhost). Tests must mock this API since JSDOM does not implement it. Consumer apps running on non-HTTPS origins will need fallback handling at the application level (out of scope for the component).
2. **Stepper layout complexity** — The horizontal orientation with connecting lines between variable-width steps requires careful flexbox layout to ensure lines stretch correctly. Vertical orientation is simpler but must handle variable-height content gracefully.
3. **Animation consistency** — The Connection Status pulse animation and Copy to Clipboard feedback transition must use Tailwind utility classes (e.g., `animate-pulse`) rather than custom CSS keyframes to stay consistent with the project's styling approach.