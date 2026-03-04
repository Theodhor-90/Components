## Objective

Build the Timeline custom compound component following the project's 5-file pattern. Timeline displays a vertical sequence of events with status dots, connecting lines, titles, timestamps, and optional content bodies.

## Files to Create

| File | Purpose |
|------|--------|
| `packages/ui/src/components/timeline/timeline.tsx` | Component implementation |
| `packages/ui/src/components/timeline/timeline.types.ts` | Type definitions |
| `packages/ui/src/components/timeline/timeline.styles.ts` | CVA variant definitions |
| `packages/ui/src/components/timeline/timeline.test.tsx` | Test suite |
| `packages/ui/src/components/timeline/timeline.stories.tsx` | Storybook stories |

## Implementation Details

### Architecture
- **Minimal API surface.** `Timeline` is a styled `<div>` container; `TimelineItem` accepts `title` (required), `timestamp` (optional string), `status` (optional, defaults to `'default'`), and `children` (optional content body).
- **Vertical-only layout.** No horizontal orientation — single-column layout with a continuous vertical line.
- **Last-item detection via `Children.toArray()` + `cloneElement()`.** Same pattern as Stepper: the `Timeline` container injects `isLast` on the final child. `isLast` is internal-only (annotated `@internal`).
- **Connecting line via `border-l-2 border-border`** on a wrapper `<div>` around each item's content area (omitted on last item). Uses standard Tailwind utilities with no custom CSS or pseudo-elements.
- **Consumer controls ordering.** Items render in the order provided — no internal sorting.

### Types (`timeline.types.ts`)
- `TimelineProps` — extends `React.ComponentProps<'div'>`
- `TimelineItemProps` — extends `React.ComponentProps<'div'>` with required `title` (string), optional `timestamp` (string), optional `status` (`'default' | 'error' | 'warning'`, defaults to `'default'`), and `children` for content body
- `TimelineItemInternalProps` — extends `TimelineItemProps` with `isLast` (boolean), annotated `@internal`

### Styles (`timeline.styles.ts`)
- `timelineItemDotVariants` — CVA with three statuses mapped to distinct dot colors:
  - `default` → `bg-primary`
  - `error` → `bg-destructive`
  - `warning` → `bg-accent`
- Plain string exports for container, item layout, title, timestamp, content body, and connecting line styles

### Component (`timeline.tsx`)
- `Timeline` — container that injects `isLast` into the final child via `cloneElement()`
- `TimelineItem` — renders status dot, title, optional timestamp, optional content body (children), and connecting line (via `border-l-2 border-border`, omitted on last item)
- `data-slot="timeline"` on root, `data-slot="timeline-item"` on items

### Tests (`timeline.test.tsx`)
- Smoke render
- Multiple items render in order
- Title renders for each item
- Timestamp renders when provided
- Timestamp omitted when not provided
- Content body renders via children
- All three status dot color variants (default, error, warning)
- Connecting line renders between items (not after last)
- Custom className merging
- `data-slot` attributes present
- Ref forwarding
- vitest-axe accessibility assertions

### Stories (`timeline.stories.tsx`)
- CSF3 format with `tags: ['autodocs']`
- Stories: Default (3–4 items), WithTimestamps, WithContent (items with rich content body), StatusVariants (showing all three dot colors), SingleItem, ManyItems (8+ items for long list rendering), MixedStatuses (realistic deployment/event log)

## Dependencies
- No prior tasks within this phase (can be implemented in parallel with Task 1)
- Uses `cn()` from `@components/utils`, `class-variance-authority` for CVA — both already installed
- No new external dependencies

## Verification Criteria
1. All 5 files exist under `packages/ui/src/components/timeline/`
2. Timeline renders items in a vertical sequence with a continuous connecting line between status dots
3. TimelineItem renders title (always), timestamp (when provided), content body (when provided via children), and a colored status dot
4. `timelineItemDotVariants` maps three statuses to three visually distinct colors: `default` → `bg-primary`, `error` → `bg-destructive`, `warning` → `bg-accent`
5. Connecting line appears between items but not after the last item
6. Items render in the order provided by the consumer
7. `isLast` is never part of the public API
8. `data-slot` attributes are present on all elements
9. All tests pass including vitest-axe accessibility assertions