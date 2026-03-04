# Phase 1: Process Visualization

## Goal

Build two custom compound components — Stepper and Timeline — for displaying sequential progress and event history. These are custom components with no shadcn/ui equivalent, following the project's 5-file pattern (implementation, types, styles, tests, stories) and all conventions established in Milestones 1–5.

## Deliverables

### 1. Stepper

- **Type**: Custom compound component (`Stepper` container + `StepperItem` sub-component)
- **Orientation**: Supports `horizontal` (default) and `vertical` via `orientation` prop, managed through CVA variants
- **Status states**: Each `StepperItem` accepts a `status` prop with four values: `pending`, `active`, `completed`, `error`
- **Visual elements**:
  - Status-appropriate icons: circle (pending), filled circle (active), checkmark (completed), X (error)
  - Connecting lines between steps that reflect the preceding step's status (completed lines visually distinct from pending)
  - Required `title` and optional `description` per step
- **Files**: `stepper.tsx`, `stepper.types.ts`, `stepper.styles.ts`, `stepper.test.tsx`, `stepper.stories.tsx`

### 2. Timeline

- **Type**: Custom compound component (`Timeline` container + `TimelineItem` sub-component)
- **Layout**: Vertical sequence of events connected by a continuous vertical line
- **Per-item elements**: Status dot, `title` (required), optional `timestamp`, optional `content` body
- **Status**: Optional `status` prop on `TimelineItem` for dot color variations
- **Ordering**: Consumer controls item ordering (component renders in provided order)
- **Files**: `timeline.tsx`, `timeline.types.ts`, `timeline.styles.ts`, `timeline.test.tsx`, `timeline.stories.tsx`

### Shared deliverables

- Vitest + Testing Library + vitest-axe test suites for both components
- Storybook CSF3 stories with `tags: ['autodocs']` covering all variants and orientations
- Public API exports added to `packages/ui/src/index.ts` (components, props types, CVA variant functions)

## Technical Decisions & Constraints

- No new external dependencies — built from native HTML elements, CVA, `cn()` helper, and `@radix-ui/react-slot`
- All styling via Tailwind utility classes mapped to OKLCH semantic tokens (no inline styles, no CSS modules)
- Stepper horizontal layout requires careful flexbox to ensure connecting lines stretch between variable-width steps
- Stepper vertical layout must handle variable-height content gracefully
- React 19 conventions: `ref` as prop (no `forwardRef`), `data-slot` on root elements, named exports only
- `asChild` + Radix `Slot` for polymorphic rendering where appropriate

## Dependencies

- **Prior milestones**: Milestone 1 (Button component, foundational patterns), Milestones 1–5 (5-file pattern and testing conventions)
- **Prior phases**: None — this is the first phase of Milestone 6
- **Internal packages**: `@components/utils` (`cn()` helper), `class-variance-authority` (CVA), `@radix-ui/react-slot`