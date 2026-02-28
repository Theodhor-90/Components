# Milestone 6: Domain Patterns

## Goal

Deliver reusable patterns extracted from sibling project needs that don't exist in shadcn/ui. After this milestone, the component library covers all identified UI patterns across the five consumer applications.

## Phases

### Phase 1: Process Visualization

Stepper with StepperItem (custom, vertical or horizontal step progress with pending/active/completed/error status icons, connecting lines, and optional description per step), Timeline with TimelineItem (custom, vertical sequence of events with timestamp, status dot, title, and optional content body).

### Phase 2: Developer Utilities

Code Block (custom, `<pre>` + `<code>` wrapper with monospace font, optional line numbers, copy-to-clipboard button, and theme-aware background), Copy to Clipboard (custom, button that writes text to clipboard and shows "Copied!" feedback for 2 seconds with checkmark icon swap), Connection Status (custom, colored status dot + text label with connected/connecting/disconnected states; green/yellow/red color coding).

## Exit Criteria

1. All 5 components render correctly in Storybook with all variants documented
2. `pnpm test` passes with vitest-axe accessibility assertions for every component
3. `pnpm typecheck` passes with no errors
4. Stepper correctly renders horizontal and vertical orientations with all status states
5. Timeline renders items in chronological order with connected status dots
6. Code Block copies content to clipboard on button click
7. Copy to Clipboard shows transient "Copied!" feedback that resets after timeout
8. Connection Status displays correct color for each state
9. All components are exported from `packages/ui/src/index.ts`
