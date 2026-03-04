Now I have all the context needed. Let me produce the revised plan.

# Task 2: Timeline Component — Implementation Plan

## 1. Deliverables

| # | File | Purpose |
|---|------|---------|
| 1 | `packages/ui/src/components/timeline/timeline.types.ts` | Public and internal prop types for `Timeline` and `TimelineItem` |
| 2 | `packages/ui/src/components/timeline/timeline.styles.ts` | CVA variant definitions for dot colors, plain string constants for layout |
| 3 | `packages/ui/src/components/timeline/timeline.tsx` | `Timeline` container and `TimelineItem` sub-component implementation |
| 4 | `packages/ui/src/components/timeline/timeline.test.tsx` | Vitest + Testing Library + vitest-axe test suite |
| 5 | `packages/ui/src/components/timeline/timeline.stories.tsx` | Storybook CSF3 stories with autodocs |

## 2. Dependencies

### Prior Tasks

- **Task t01 (Stepper)**: Completed. The Stepper component established the `Children.toArray()` + `cloneElement()` + `isLast` internal prop pattern that Timeline will mirror exactly. No code dependency at runtime, but follows the same architectural pattern.

### Internal Packages (already installed)

- `class-variance-authority` — CVA variant definitions for dot colors
- `@components/utils` — `cn()` helper (clsx + tailwind-merge)

### External Libraries

- None — Timeline is a custom implementation using only native HTML `<div>` elements and existing internal utilities.

### New Installations

- None required.

## 3. Implementation Details

### 3.1 `timeline.types.ts`

**Purpose**: Define public and internal TypeScript types for both components.

**Exports**:

- `TimelineProps` — Extends `React.ComponentProps<'div'>`. No additional props beyond what `<div>` provides (children, className, ref, etc.).

- `TimelineItemProps` — Extends `React.ComponentProps<'div'>` with:
  - `title: string` (required) — The event/step title text
  - `timestamp?: string` (optional) — A display string for the event time (e.g., `"2024-01-15"`, `"3 hours ago"`)
  - `status?: 'default' | 'error' | 'warning'` (optional, defaults to `'default'`) — Controls the dot color variant
  - `children` — inherited from `React.ComponentProps<'div'>`, used for optional content body

  **Note on VariantProps**: The AGENTS.md component creation guide specifies `Props extend React.ComponentProps<'element'> & VariantProps<typeof variants>`. However, `timelineItemDotVariants` applies to a sub-element (the dot `<div>`), not to the root `<div>` of `TimelineItem`. Integrating `VariantProps<typeof timelineItemDotVariants>` would incorrectly imply the variant applies to the root element's styling. The Stepper component (t01) follows the same pattern — `StepperItemProps` manually defines `status` without `VariantProps` because `stepperItemVariants` applies to the icon container, not the root. The `status` prop is manually typed as `'default' | 'error' | 'warning'` to match the CVA variant keys, keeping the type source-of-truth explicit in the types file.

- `TimelineItemInternalProps` — Extends `TimelineItemProps` with:
  - `isLast?: boolean` — Injected by the `Timeline` container to suppress the connecting line on the final item
  - Annotated with `@internal` JSDoc, not exported from `index.ts`

**Pattern reference**: Mirrors `stepper.types.ts` structure exactly — `StepperItemInternalProps` pattern with `@internal` JSDoc annotation.

### 3.2 `timeline.styles.ts`

**Purpose**: CVA variant definitions for the status dot and plain string constants for layout elements.

**Exports**:

- `timelineItemDotVariants` — CVA definition:
  ```typescript
  import { cva } from 'class-variance-authority';

  export const timelineItemDotVariants = cva(
    'mt-1.5 h-3 w-3 shrink-0 rounded-full',
    {
      variants: {
        status: {
          default: 'bg-primary',
          error: 'bg-destructive',
          warning: 'bg-accent',
        },
      },
      defaultVariants: {
        status: 'default',
      },
    },
  );
  ```
  The base classes set a fixed 12px (`h-3 w-3`) circle with `rounded-full`, `shrink-0` to prevent flex shrinking, and `mt-1.5` to vertically align the dot with the first line of title text. Three status variants map to three visually distinct semantic colors.

- `timelineContainerStyles` — `'flex flex-col'` — Vertical layout for the timeline container.

- `timelineItemStyles` — `'flex gap-3'` — Horizontal layout for each item (dot column + content column).

- `timelineItemDotColumnStyles` — `'flex flex-col items-center'` — Wraps the dot and the connecting line in a vertical column.

- `timelineItemContentStyles` — `'pb-6'` — Content area with bottom padding for spacing between items.

- `timelineItemTitleStyles` — `'text-sm font-medium'` — Title text styling, matches `stepperItemTitleStyles`.

- `timelineItemTimestampStyles` — `'text-xs text-muted-foreground'` — Timestamp text styling, muted and small.

- `timelineItemBodyStyles` — `'mt-2 text-sm text-muted-foreground'` — Content body styling for the optional `children` wrapper.

- `timelineItemConnectorStyles` — `'w-0.5 flex-1 bg-border'` — Vertical connecting line: 2px wide, stretches to fill remaining space, uses `bg-border` semantic token.

### 3.3 `timeline.tsx`

**Purpose**: Implementation of `Timeline` container and `TimelineItem` sub-component.

**Exports**:

- Re-exports `TimelineItemProps` and `TimelineProps` types from `timeline.types.js`
- `Timeline` function component
- `TimelineItem` function component

**`Timeline` component**:

```typescript
export function Timeline({ className, children, ref, ...props }: TimelineProps): React.JSX.Element {
  const childArray = Children.toArray(children);
  const lastIndex = childArray.length - 1;

  return (
    <div
      data-slot="timeline"
      className={cn(timelineContainerStyles, className)}
      ref={ref}
      {...props}
    >
      {childArray.map((child, index) =>
        isValidElement(child) && index === lastIndex
          ? cloneElement(child as React.ReactElement<TimelineItemInternalProps>, { isLast: true })
          : child,
      )}
    </div>
  );
}
```

Follows the same pattern as `Stepper`:
- Uses `Children.toArray()` to iterate children
- Injects `isLast: true` via `cloneElement()` on the final valid element child
- Sets `data-slot="timeline"` on root
- Merges `className` via `cn()`

**`TimelineItem` component**:

```typescript
export function TimelineItem({
  className,
  status = 'default',
  title,
  timestamp,
  isLast = false,
  children,
  ref,
  ...props
}: TimelineItemInternalProps): React.JSX.Element {
  return (
    <div
      data-slot="timeline-item"
      className={cn(timelineItemStyles, className)}
      ref={ref}
      {...props}
    >
      <div className={timelineItemDotColumnStyles}>
        <div className={cn(timelineItemDotVariants({ status }))} />
        {!isLast && <div className={timelineItemConnectorStyles} />}
      </div>
      <div className={timelineItemContentStyles}>
        <p className={timelineItemTitleStyles}>{title}</p>
        {timestamp && <p className={timelineItemTimestampStyles}>{timestamp}</p>}
        {children && <div className={timelineItemBodyStyles}>{children}</div>}
      </div>
    </div>
  );
}
```

Structure per item:
- Left column: status dot + connecting line (omitted for last item via `isLast`)
- Right column: title (always), timestamp (if provided), content body (if children provided)
- The dot column uses `flex flex-col items-center` to vertically center the dot over the line
- The connecting line uses `flex-1` to stretch and fill the gap between the current dot and the next item's dot
- The content body wrapper uses `timelineItemBodyStyles` from the styles file

**Imports**: `Children`, `cloneElement`, `isValidElement` from `react`; `cn` from `../../lib/utils.js`; all styles from `./timeline.styles.js`; types from `./timeline.types.js`.

### 3.4 `timeline.test.tsx`

**Purpose**: Comprehensive test suite covering all component behaviors.

**Imports**: `createRef` from `react`; `render`, `screen` from `@testing-library/react`; `axe` from `vitest-axe`; `describe`, `expect`, `it` from `vitest`; `Timeline`, `TimelineItem` from `./timeline.js`.

**Tests (15 total)**:

1. **`renders without crashing (smoke)`** — Render a `Timeline` with a single `TimelineItem`, assert it's in the document via `getByText` on the title.

2. **`renders multiple items in order`** — Render 3 `TimelineItem`s with titles "Event 1", "Event 2", "Event 3". Query all `[data-slot="timeline-item"]` elements and verify they appear in order by checking their text content.

3. **`renders title for each item`** — Render 2 items with different titles. Assert both titles are in the document via `getByText`.

4. **`renders timestamp when provided`** — Render an item with `timestamp="2024-01-15"`. Assert the timestamp text is in the document.

5. **`does not render timestamp when not provided`** — Render two `TimelineItem`s: one WITH `timestamp="2024-01-15"` and one WITHOUT. Query all elements with the `timelineItemTimestampStyles` class (`text-muted-foreground`) scoped to `<p>` elements within each item's content area. Assert that only one timestamp `<p>` exists across both items by querying `container.querySelectorAll('[data-slot="timeline-item"] p.text-xs')` and expecting a count of 1.

6. **`renders content body via children`** — Render an item with `<p>Details here</p>` as children. Assert "Details here" is in the document.

7. **`renders default status dot`** — Render an item with no explicit status (defaults to `'default'`). Query the dot element via `container.querySelector('.bg-primary')`. Assert it exists.

8. **`renders error status dot`** — Render an item with `status="error"`. Assert `container.querySelector('.bg-destructive')` exists.

9. **`renders warning status dot`** — Render an item with `status="warning"`. Assert `container.querySelector('.bg-accent')` exists.

10. **`renders connecting line between items but not after last`** — Render 3 items. Query all connector elements by class `bg-border` via `container.querySelectorAll('.bg-border')`. Assert count is 2 (one for each non-last item).

11. **`merges custom className on Timeline`** — Render `Timeline` with `className="custom-timeline"`. Assert root has both the custom class and the base `flex-col` class.

12. **`merges custom className on TimelineItem`** — Render a `TimelineItem` with `className="custom-item"`. Assert the `[data-slot="timeline-item"]` element has `custom-item` class.

13. **`has data-slot attributes`** — Render a `Timeline` with 2 items. Assert `[data-slot="timeline"]` exists. Assert 2 `[data-slot="timeline-item"]` elements exist.

14. **`forwards ref to Timeline root element`** — Create a ref via `createRef<HTMLDivElement>()`, pass to `Timeline`. Assert `ref.current` is an `HTMLDivElement` instance.

15. **`forwards ref to TimelineItem element`** — Create a ref via `createRef<HTMLDivElement>()`, pass to `TimelineItem`. Assert `ref.current` is an `HTMLDivElement` instance. Render the item inside a `Timeline` to ensure the `cloneElement` pattern does not interfere with ref forwarding.

16. **`has no accessibility violations`** — Render a timeline with 3 items of mixed statuses. Run `axe(container)` and assert `toHaveNoViolations()`.

### 3.5 `timeline.stories.tsx`

**Purpose**: Storybook CSF3 stories with autodocs covering all variants and edge cases.

**Meta configuration**:
```typescript
const meta: Meta<typeof Timeline> = {
  title: 'Components/Timeline',
  component: Timeline,
  tags: ['autodocs'],
};
```

**Stories (7 total)**:

1. **`Default`** — 3–4 items with titles only, no timestamps, default status. Demonstrates the basic vertical layout.

2. **`WithTimestamps`** — 3 items with both title and timestamp props set. Shows timestamp rendering below titles.

3. **`WithContent`** — 3 items where each has children (content body) — e.g., paragraphs describing event details. Demonstrates the optional content slot.

4. **`StatusVariants`** — 3 items, one per status (`default`, `error`, `warning`), showcasing all three dot colors.

5. **`SingleItem`** — 1 item only. Verifies no connecting line renders and the component handles single-child gracefully.

6. **`ManyItems`** — 8+ items to verify long list rendering, scrolling behavior, and consistent spacing/alignment of connecting lines.

7. **`MixedStatuses`** — Realistic deployment/event log scenario: 5–6 items with mixed statuses, timestamps, and some with content bodies. E.g., "Deployment started" (default), "Tests passed" (default), "Build failed" (error), "Rollback initiated" (warning), "Service restored" (default).

## 4. API Contracts

### `Timeline` Props

```typescript
type TimelineProps = React.ComponentProps<'div'>
```

No additional props. Accepts standard div attributes (`className`, `ref`, `children`, `id`, etc.).

**Usage**:
```tsx
<Timeline className="my-4">
  <TimelineItem title="Event A" />
  <TimelineItem title="Event B" timestamp="2024-01-15" status="error">
    <p>Something went wrong</p>
  </TimelineItem>
</Timeline>
```

### `TimelineItem` Props

```typescript
type TimelineItemProps = React.ComponentProps<'div'> & {
  title: string;
  timestamp?: string;
  status?: 'default' | 'error' | 'warning';
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | (required) | Event title text |
| `timestamp` | `string` | `undefined` | Display string for event time |
| `status` | `'default' \| 'error' \| 'warning'` | `'default'` | Controls dot color |
| `children` | `ReactNode` | `undefined` | Optional content body below title/timestamp |

### CVA Variant Function

```typescript
timelineItemDotVariants({ status: 'default' })
// => 'mt-1.5 h-3 w-3 shrink-0 rounded-full bg-primary'

timelineItemDotVariants({ status: 'error' })
// => 'mt-1.5 h-3 w-3 shrink-0 rounded-full bg-destructive'

timelineItemDotVariants({ status: 'warning' })
// => 'mt-1.5 h-3 w-3 shrink-0 rounded-full bg-accent'
```

## 5. Test Plan

### Test Setup

- **Framework**: Vitest (configured in project root)
- **Rendering**: `@testing-library/react` (`render`, `screen`)
- **Accessibility**: `vitest-axe` (`axe` function + `toHaveNoViolations` matcher)
- **Imports**: `createRef` from `react`, `describe`/`expect`/`it` from `vitest`
- **No mocking needed**: Timeline has no browser API dependencies, no async behavior, and no context providers

### Per-Test Specification

| # | Test Name | What It Verifies | Assertion Strategy |
|---|-----------|------------------|--------------------|
| 1 | renders without crashing | Smoke test — component mounts | `screen.getByText(title)` is in document |
| 2 | renders multiple items in order | DOM order matches child order | Query all `[data-slot="timeline-item"]`, check `textContent` order |
| 3 | renders title for each item | Title text is rendered | `screen.getByText()` for each title |
| 4 | renders timestamp when provided | Timestamp text appears | `screen.getByText(timestamp)` |
| 5 | does not render timestamp when not provided | No timestamp element on item without prop | Render two items (one with timestamp, one without); `container.querySelectorAll('[data-slot="timeline-item"] p.text-xs')` returns count 1 |
| 6 | renders content body via children | Children slot renders | `screen.getByText(childText)` |
| 7 | renders default status dot | `bg-primary` class on dot | `container.querySelector('.bg-primary')` is not null |
| 8 | renders error status dot | `bg-destructive` class on dot | `container.querySelector('.bg-destructive')` is not null |
| 9 | renders warning status dot | `bg-accent` class on dot | `container.querySelector('.bg-accent')` is not null |
| 10 | connecting line between items not after last | Correct number of connectors | Query `.bg-border` elements, expect count = items - 1 |
| 11 | merges custom className on Timeline | `cn()` merges correctly on root | Root has both custom and `flex-col` classes |
| 12 | merges custom className on TimelineItem | `cn()` merges correctly on item | Item `[data-slot="timeline-item"]` has custom class |
| 13 | has data-slot attributes | `data-slot` present | `querySelector('[data-slot="timeline"]')` and `querySelectorAll('[data-slot="timeline-item"]')` |
| 14 | forwards ref to Timeline root | Ref receives DOM node on Timeline | `ref.current instanceof HTMLDivElement` |
| 15 | forwards ref to TimelineItem | Ref receives DOM node on TimelineItem | Render inside `Timeline`, `ref.current instanceof HTMLDivElement` |
| 16 | has no accessibility violations | axe-core passes | `expect(await axe(container)).toHaveNoViolations()` |

## 6. Implementation Order

1. **`timeline.types.ts`** — Define all types first (`TimelineProps`, `TimelineItemProps`, `TimelineItemInternalProps`). Other files import from this.

2. **`timeline.styles.ts`** — Define `timelineItemDotVariants` CVA and all plain string style constants including `timelineItemBodyStyles`. The component file imports from this.

3. **`timeline.tsx`** — Implement `Timeline` and `TimelineItem` components, importing types and styles. Re-export public types.

4. **`timeline.test.tsx`** — Write all 16 tests. Run `pnpm --filter @components/ui test -- --testPathPattern=timeline` to verify.

5. **`timeline.stories.tsx`** — Write all 7 stories with CSF3 format and autodocs tag.

## 7. Verification Commands

```bash
# Run Timeline tests only
pnpm --filter @components/ui test -- --testPathPattern=timeline

# TypeScript type checking
pnpm typecheck

# Lint
pnpm lint

# Launch Storybook to verify stories render
pnpm storybook
```

Note: Full monorepo test suite (`pnpm test`) and export registration in `packages/ui/src/index.ts` are handled by the phase's dedicated Task 3 (Export Registration).

## 8. Design Deviations

None. All implementation decisions align with the phase spec and project conventions:

- The `status` prop on `TimelineItemProps` is manually typed rather than using `VariantProps<typeof timelineItemDotVariants>` because the CVA variant applies to a sub-element (the dot `<div>`), not to the `TimelineItem` root `<div>`. Integrating `VariantProps` on the root props type would be misleading. This matches the established Stepper pattern where `StepperItemProps` manually types `status` for the same reason — `stepperItemVariants` applies to the icon container, not the root element.