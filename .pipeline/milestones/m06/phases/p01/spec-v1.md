Now I have a thorough understanding of the codebase. Let me produce the phase specification.

# Phase 1: Process Visualization — Specification

## Goal

Deliver two custom compound components — **Stepper** (with `StepperItem`) and **Timeline** (with `TimelineItem`) — that visualize sequential progress and event history, following the project's 5-file pattern, React 19 conventions, and all testing and documentation standards established across Milestones 1–5.

## Design Decisions

### Stepper

1. **Compound component via composition, not context.** Stepper does not manage child state — each `StepperItem` receives its own `status` prop directly from the consumer. This keeps the implementation simple, avoids unnecessary React context, and follows the same pattern used by Card (parent is a styled container, children are independent). The consumer is responsible for tracking which step is active.

2. **Orientation via CVA variants on the container.** The `Stepper` container uses a CVA variant for `orientation` (`horizontal` | `vertical`) that switches between `flex-row` and `flex-col` layout. `StepperItem` reads the orientation from a `data-orientation` attribute on the container or accepts it as a prop passed by the consumer. To keep context-free, **orientation is passed as a prop to both `Stepper` and each `StepperItem`** — this mirrors how Radix components like AccordionItem receive shared configuration.

3. **Connecting lines are part of `StepperItem`.** Each `StepperItem` (except the last) renders a connecting line after its icon. The line's visual treatment is driven by the item's own status: `completed` items show a solid primary-colored line; all other statuses show a muted/dashed line. This avoids a separate `StepperConnector` component and keeps the DOM structure flat within each item.

4. **Status icons are inline SVGs.** Rather than importing an icon library, status icons (circle, filled circle, checkmark, X) are small inline SVGs defined in the component file. This avoids adding a dependency and keeps the component self-contained. The icons are wrapped in a `<span>` with `aria-hidden="true"` since the status is conveyed through `aria-current="step"` on the active item and sr-only text.

5. **No `asChild` support.** Stepper and StepperItem render as semantic `<div>` and `<div>` respectively (with appropriate ARIA roles). Polymorphic rendering is not useful for this component — consumers compose by nesting content inside `StepperItem`, not by replacing the root element.

### Timeline

1. **Minimal API surface.** `Timeline` is a styled `<div>` container; `TimelineItem` accepts `title` (required), `timestamp` (optional string), `status` (optional, defaults to `'default'`), and `children` (optional content body). No complex sub-components — the item renders its own dot, line, title, timestamp, and content.

2. **Vertical-only layout.** The milestone spec defines Timeline as a "vertical sequence of events." Horizontal timeline is out of scope. This simplifies the implementation to a single-column layout with a continuous vertical line.

3. **Connecting line via CSS pseudo-element or border.** The continuous vertical line is rendered using a left-border or `::before` pseudo-element on each `TimelineItem` (except the last). This avoids extra DOM elements and is straightforward to style with Tailwind's `border-l` utilities.

4. **Status dot colors via CVA variants.** `TimelineItem` uses CVA with a `status` variant that maps to dot background colors using semantic tokens: `default` → `bg-primary`, `success` → `bg-primary` (green is not a semantic token, so we use destructive for error and primary for success/default), `error` → `bg-destructive`, `warning` → `bg-accent`. Since the project uses OKLCH semantic tokens and doesn't have explicit green/yellow status tokens, we map to the closest available semantics.

5. **Consumer controls ordering.** The component renders items in the order provided. No internal sorting by timestamp or any other field.

## Tasks

### Task 1: Stepper Component

**Deliverables:**

- `packages/ui/src/components/stepper/stepper.tsx` — `Stepper` container and `StepperItem` sub-component with horizontal/vertical orientation support and four status states (pending, active, completed, error). Connecting lines between items. `data-slot="stepper"` and `data-slot="stepper-item"` attributes. Re-exports types from types file.
- `packages/ui/src/components/stepper/stepper.types.ts` — `StepperProps` extending `React.ComponentProps<'div'>` with `orientation` variant prop. `StepperItemProps` extending `React.ComponentProps<'div'>` with required `status` prop (`'pending' | 'active' | 'completed' | 'error'`), required `title` (string), optional `description` (string), and `orientation` prop. CVA `VariantProps` integration for both.
- `packages/ui/src/components/stepper/stepper.styles.ts` — CVA definitions: `stepperVariants` (orientation: horizontal/vertical), `stepperItemVariants` (orientation × status combinations for icon and line coloring). Plain string exports for sub-element styles (title, description, connector line, icon container).
- `packages/ui/src/components/stepper/stepper.test.tsx` — Tests covering: smoke render (horizontal default), vertical orientation render, all four status states render correct icons, connecting lines render between items (not after last item), completed step shows distinct line style, title and description render, custom className merging, `data-slot` attributes, ref forwarding, `aria-current="step"` on active item, vitest-axe accessibility assertions for both orientations.
- `packages/ui/src/components/stepper/stepper.stories.tsx` — Stories: Horizontal (default), Vertical, AllStatuses (showing all four status states), WithDescriptions, ThreeStepProgress (realistic use case with steps 1–2 completed, step 3 active, step 4 pending), SingleStep, ErrorState.

### Task 2: Timeline Component

**Deliverables:**

- `packages/ui/src/components/timeline/timeline.tsx` — `Timeline` container and `TimelineItem` sub-component. Vertical layout with continuous connecting line between dots. `data-slot="timeline"` and `data-slot="timeline-item"` attributes. Re-exports types.
- `packages/ui/src/components/timeline/timeline.types.ts` — `TimelineProps` extending `React.ComponentProps<'div'>`. `TimelineItemProps` extending `React.ComponentProps<'div'>` with required `title` (string), optional `timestamp` (string), optional `status` (`'default' | 'success' | 'error' | 'warning'`), and `children` for content body.
- `packages/ui/src/components/timeline/timeline.styles.ts` — CVA definitions: `timelineItemDotVariants` (status → dot color mapping). Plain string exports for container, item layout, title, timestamp, content body, and connecting line styles.
- `packages/ui/src/components/timeline/timeline.test.tsx` — Tests covering: smoke render, multiple items render in order, title renders for each item, timestamp renders when provided, timestamp omitted when not provided, content body renders via children, status dot color variants, connecting line renders between items (not after last), custom className merging, `data-slot` attributes, ref forwarding, vitest-axe accessibility assertions.
- `packages/ui/src/components/timeline/timeline.stories.tsx` — Stories: Default (3–4 items), WithTimestamps, WithContent (items with rich content body), StatusVariants (showing all dot colors), SingleItem, ManyItems (8+ items to verify long list rendering), MixedStatuses (realistic deployment/event log).

### Task 3: Export Registration

**Deliverables:**

- Add Stepper exports to `packages/ui/src/index.ts`: `Stepper`, `StepperItem`, `type StepperProps`, `type StepperItemProps`, `stepperVariants`, `stepperItemVariants`.
- Add Timeline exports to `packages/ui/src/index.ts`: `Timeline`, `TimelineItem`, `type TimelineProps`, `type TimelineItemProps`, `timelineItemDotVariants`.
- Verify `pnpm typecheck` passes with no errors.
- Verify `pnpm test` passes with zero failures.
- Verify both components render in Storybook via `pnpm storybook`.

### Task 4: Integration Verification

**Deliverables:**

- Run full `pnpm typecheck` across the monorepo — zero errors.
- Run full `pnpm test` across the monorepo — zero failures, including all vitest-axe accessibility assertions.
- Verify Storybook renders both components with autodocs enabled, all stories load, and variant controls work interactively.
- Confirm both horizontal and vertical Stepper orientations display correctly with connecting lines aligned.
- Confirm Timeline connecting line is continuous between dots with no gaps.

## Exit Criteria

1. All 10 files (5 per component) exist under `packages/ui/src/components/stepper/` and `packages/ui/src/components/timeline/`
2. `Stepper` renders in both `horizontal` and `vertical` orientations with correct flexbox layout and connecting lines between items
3. `StepperItem` renders the correct status icon (circle, filled circle, checkmark, X) for each of the four status states (`pending`, `active`, `completed`, `error`)
4. Connecting lines between stepper items are visually distinct for completed vs. non-completed steps
5. Active `StepperItem` has `aria-current="step"` for accessibility
6. `Timeline` renders items in a vertical sequence with a continuous connecting line between status dots
7. `TimelineItem` renders title (always), timestamp (when provided), content body (when provided via children), and a colored status dot
8. `timelineItemDotVariants` correctly maps each status to a distinct dot color using semantic tokens
9. All components and types are exported from `packages/ui/src/index.ts`
10. `pnpm typecheck` passes with zero errors
11. `pnpm test` passes with zero failures, including vitest-axe accessibility assertions for both components
12. Both components render in Storybook with autodocs and all stories display correctly

## Dependencies

### Prior Milestones

- **Milestone 1–5 complete** — the 5-file component pattern, testing infrastructure (Vitest + Testing Library + vitest-axe), Storybook configuration, CVA setup, `cn()` utility, and public export conventions are all established and working.

### Internal Packages

- `@components/utils` — `cn()` helper (clsx + tailwind-merge)
- `class-variance-authority` — CVA variant definitions
- `@radix-ui/react-slot` — not required for this phase (no `asChild` support on Stepper/Timeline)

### External Libraries

- None — both components are custom implementations using native HTML elements and existing internal utilities.

### Prior Phases

- None — this is the first phase of Milestone 6.

## Artifacts

| Artifact | Type | Description |
|----------|------|-------------|
| `packages/ui/src/components/stepper/stepper.tsx` | New file | Stepper and StepperItem component implementations |
| `packages/ui/src/components/stepper/stepper.types.ts` | New file | TypeScript prop types for Stepper and StepperItem |
| `packages/ui/src/components/stepper/stepper.styles.ts` | New file | CVA variants and style constants |
| `packages/ui/src/components/stepper/stepper.test.tsx` | New file | Vitest test suite with accessibility assertions |
| `packages/ui/src/components/stepper/stepper.stories.tsx` | New file | Storybook CSF3 stories with autodocs |
| `packages/ui/src/components/timeline/timeline.tsx` | New file | Timeline and TimelineItem component implementations |
| `packages/ui/src/components/timeline/timeline.types.ts` | New file | TypeScript prop types for Timeline and TimelineItem |
| `packages/ui/src/components/timeline/timeline.styles.ts` | New file | CVA variants and style constants |
| `packages/ui/src/components/timeline/timeline.test.tsx` | New file | Vitest test suite with accessibility assertions |
| `packages/ui/src/components/timeline/timeline.stories.tsx` | New file | Storybook CSF3 stories with autodocs |
| `packages/ui/src/index.ts` | Modified | Add exports for both components, types, and variant functions |