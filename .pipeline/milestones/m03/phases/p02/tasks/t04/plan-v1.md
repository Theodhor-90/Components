I now have all the context I need. Let me produce the complete implementation plan.

# Task 4: Resizable Component — Implementation Plan

## 1. Deliverables

### Files to Create

| File                                                         | Purpose                                                                   |
| ------------------------------------------------------------ | ------------------------------------------------------------------------- |
| `packages/ui/src/components/resizable/resizable.types.ts`    | Props types for ResizablePanelGroup, ResizablePanel, and ResizableHandle  |
| `packages/ui/src/components/resizable/resizable.styles.ts`   | Static style constants for panel group and handle + grip indicator styles |
| `packages/ui/src/components/resizable/resizable.tsx`         | Implementation of 3 sub-components wrapping `react-resizable-panels`      |
| `packages/ui/src/components/resizable/resizable.test.tsx`    | Vitest + Testing Library + vitest-axe tests                               |
| `packages/ui/src/components/resizable/resizable.stories.tsx` | Storybook CSF3 stories with `tags: ['autodocs']`                          |

### Files to Modify

| File                       | Change                                   |
| -------------------------- | ---------------------------------------- |
| `packages/ui/src/index.ts` | Add exports for 3 sub-components + types |

## 2. Dependencies

- **`react-resizable-panels` ^2.1.7** — already installed in `packages/ui/package.json` by task t01. No additional packages required.
- **`@components/utils`** — already available; provides the `cn()` helper.
- **Sibling tasks t02 and t03** — no dependency on them. This task only depends on t01 (dependency installation).

## 3. Implementation Details

### 3.1 `resizable.types.ts`

**Purpose:** Define TypeScript prop types for the three sub-components.

**Exports:**

- `ResizablePanelGroupProps` — the library's `PanelGroupProps` type (re-exported as-is). The library's `PanelGroupProps` already extends `HTMLAttributes` and includes `className?: string` and `direction: Direction`.
- `ResizablePanelProps` — the library's `PanelProps` type (re-exported as-is). Already includes `className?: string`, `defaultSize?: number`, `minSize?: number`, `maxSize?: number`, etc.
- `ResizableHandleProps` — the library's `PanelResizeHandleProps` intersected with `{ withHandle?: boolean }`. The library type already includes `className?: string`.

**Pattern:** Follow the same approach as `scroll-area.types.ts`, which re-exports Radix primitive types directly using `React.ComponentProps<typeof Primitive>`. However, since `react-resizable-panels` exports its prop types directly as named types (not as component types), we import and re-export the named types directly.

```typescript
import type { PanelGroupProps, PanelProps, PanelResizeHandleProps } from 'react-resizable-panels';

export type ResizablePanelGroupProps = PanelGroupProps;
export type ResizablePanelProps = PanelProps;
export type ResizableHandleProps = PanelResizeHandleProps & {
  withHandle?: boolean;
};
```

### 3.2 `resizable.styles.ts`

**Purpose:** Static style constants for themed wrapper styling.

**Exports:**

- `resizablePanelGroupStyles` — `'flex h-full w-full data-[panel-group-direction=vertical]:flex-col'`
- `resizableHandleStyles` — `'relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90'`
- `resizableHandleGripStyles` — `'z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border'`

**Note:** No CVA variant is needed. The handle orientation styling is handled entirely through `data-panel-group-direction` attribute selectors (which `react-resizable-panels` sets automatically on the DOM). This follows the shadcn/ui pattern exactly. The `[&[data-panel-group-direction=vertical]>div]:rotate-90` selector rotates the grip indicator 90 degrees in vertical orientation, avoiding the need for a CVA variant.

### 3.3 `resizable.tsx`

**Purpose:** Implementation of the three sub-components.

**Exports:**

- `ResizablePanelGroup` — Wraps `PanelGroup` from `react-resizable-panels`. Adds `data-slot="resizable-panel-group"` and merges `className` with `resizablePanelGroupStyles` via `cn()`. Passes `direction` and all other props through.
- `ResizablePanel` — Wraps `Panel` from `react-resizable-panels`. Adds `data-slot="resizable-panel"`. Passes all props through. Minimal wrapper — the library handles everything.
- `ResizableHandle` — Wraps `PanelResizeHandle` from `react-resizable-panels`. Adds `data-slot="resizable-handle"` and merges `className` with `resizableHandleStyles` via `cn()`. Destructures `withHandle` from props. When `withHandle` is true, renders a child `<div>` with the grip indicator: a six-dot pattern using inline SVG (6 circles arranged in 2 columns × 3 rows). The grip div uses `resizableHandleGripStyles`.

**Key implementation details:**

```typescript
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import { cn } from '../../lib/utils.js';
import {
  resizableHandleGripStyles,
  resizableHandleStyles,
  resizablePanelGroupStyles,
} from './resizable.styles.js';
import type {
  ResizableHandleProps,
  ResizablePanelGroupProps,
  ResizablePanelProps,
} from './resizable.types.js';

// Re-export types
export type {
  ResizableHandleProps,
  ResizablePanelGroupProps,
  ResizablePanelProps,
} from './resizable.types.js';

export function ResizablePanelGroup({
  className,
  ...props
}: ResizablePanelGroupProps) {
  return (
    <PanelGroup
      data-slot="resizable-panel-group"
      className={cn(resizablePanelGroupStyles, className)}
      {...props}
    />
  );
}

export function ResizablePanel({ ...props }: ResizablePanelProps) {
  return <Panel data-slot="resizable-panel" {...props} />;
}

export function ResizableHandle({
  withHandle,
  className,
  ...props
}: ResizableHandleProps) {
  return (
    <PanelResizeHandle
      data-slot="resizable-handle"
      className={cn(resizableHandleStyles, className)}
      {...props}
    >
      {withHandle && (
        <div className={resizableHandleGripStyles}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="12" r="1" />
            <circle cx="9" cy="5" r="1" />
            <circle cx="9" cy="19" r="1" />
            <circle cx="15" cy="12" r="1" />
            <circle cx="15" cy="5" r="1" />
            <circle cx="15" cy="19" r="1" />
          </svg>
        </div>
      )}
    </PanelResizeHandle>
  );
}
```

**Note on `ref` and `data-slot`:** The `react-resizable-panels` components do not accept `ref` as a standard prop — they use `React.useImperativeHandle` with their own imperative handle types (`ImperativePanelHandle`, `ImperativePanelGroupHandle`). We do NOT destructure `ref` from props. The `data-slot` attribute is passed as a regular HTML `data-*` attribute which the library components forward to the DOM since they extend `HTMLAttributes`.

### 3.4 `resizable.test.tsx`

**Purpose:** Tests for all three sub-components.

**Test helper:** A `TestResizable` helper function that renders a `ResizablePanelGroup` with two `ResizablePanel` components and a `ResizableHandle` between them, similar to `TestScrollArea` pattern in `scroll-area.test.tsx`.

**Tests:**

1. **Smoke render** — Renders panel group with two panels and a handle; all three sub-components mount without error
2. **Handle renders between panels** — Verifies the handle element exists between panels
3. **`withHandle` renders grip indicator** — When `withHandle` is true, verifies the SVG grip icon is rendered inside the handle
4. **`withHandle` false hides grip** — When `withHandle` is omitted/false, verifies no SVG inside handle
5. **Horizontal direction** — Verifies `data-panel-group-direction="horizontal"` is set on the group
6. **Vertical direction** — Verifies `data-panel-group-direction="vertical"` is set on the group
7. **`data-slot` attributes** — Verifies `data-slot="resizable-panel-group"`, `data-slot="resizable-panel"`, `data-slot="resizable-handle"` on respective elements
8. **className merging on PanelGroup** — Custom class is merged with base styles
9. **className merging on Handle** — Custom class is merged with handle styles
10. **Accessibility** — `axe(container)` returns no violations

### 3.5 `resizable.stories.tsx`

**Purpose:** Storybook stories demonstrating all usage patterns.

**Stories:**

1. **Horizontal** — Two panels side by side with `direction="horizontal"`, default sizes 50/50
2. **Vertical** — Two panels stacked with `direction="vertical"`, default sizes 50/50
3. **WithHandle** — Two panels with `<ResizableHandle withHandle />` showing the grip indicator
4. **ThreePanels** — Three panels with two handles, demonstrating multiple splits
5. **NestedGroups** — Outer horizontal group with one panel containing an inner vertical group

All stories use `tags: ['autodocs']` in meta. Each story renders visible content inside panels (colored backgrounds or text) so the panels are clearly distinguishable.

### 3.6 `index.ts` modifications

Add the following export block after the existing Sidebar exports:

```typescript
export {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  type ResizablePanelGroupProps,
  type ResizablePanelProps,
  type ResizableHandleProps,
} from './components/resizable/resizable.js';
```

No CVA variant function is exported since this component uses static styles only (no CVA `cva()` call).

## 4. API Contracts

### ResizablePanelGroup

```tsx
<ResizablePanelGroup direction="horizontal" className="min-h-[200px] max-w-md">
  <ResizablePanel defaultSize={50}>
    <div>Panel One</div>
  </ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={50}>
    <div>Panel Two</div>
  </ResizablePanel>
</ResizablePanelGroup>
```

**Props:** All of `PanelGroupProps` from `react-resizable-panels` — most notably:

- `direction: "horizontal" | "vertical"` (required)
- `className?: string`
- `autoSaveId?: string | null`
- `onLayout?: (layout: number[]) => void`

### ResizablePanel

**Props:** All of `PanelProps` from `react-resizable-panels` — most notably:

- `defaultSize?: number` (percentage)
- `minSize?: number`
- `maxSize?: number`
- `collapsible?: boolean`
- `className?: string`

### ResizableHandle

**Props:** All of `PanelResizeHandleProps` from `react-resizable-panels` plus:

- `withHandle?: boolean` — when true, renders the six-dot grip indicator
- `className?: string`
- `disabled?: boolean`

## 5. Test Plan

### Test Setup

- **Framework:** Vitest + @testing-library/react + vitest-axe
- **Imports:** `render`, `screen` from `@testing-library/react`; `axe` from `vitest-axe`; `describe`, `expect`, `it` from `vitest`
- **Helper:** `TestResizable` component that renders a standard two-panel layout

### Test Specifications

| #   | Test Name                                        | What it Verifies                                                                                               |
| --- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| 1   | renders panel group with two panels and a handle | All three sub-components mount; panel content visible via `screen.getByText`                                   |
| 2   | handle renders between panels                    | `document.querySelector('[data-slot="resizable-handle"]')` is present                                          |
| 3   | withHandle renders grip indicator SVG            | When `withHandle` is true, handle element contains an `<svg>` child                                            |
| 4   | withHandle false hides grip                      | When `withHandle` is omitted, handle element does NOT contain an `<svg>` child                                 |
| 5   | horizontal direction attribute                   | `data-panel-group-direction="horizontal"` on the group element                                                 |
| 6   | vertical direction attribute                     | `data-panel-group-direction="vertical"` on the group element                                                   |
| 7   | data-slot attributes on all sub-components       | `data-slot="resizable-panel-group"`, `data-slot="resizable-panel"`, `data-slot="resizable-handle"` all present |
| 8   | className merging on ResizablePanelGroup         | Custom class merged with `flex` base class                                                                     |
| 9   | className merging on ResizableHandle             | Custom class merged with `bg-border` base class                                                                |
| 10  | no accessibility violations                      | `axe(container)` passes with `toHaveNoViolations()`                                                            |

## 6. Implementation Order

1. **`resizable.types.ts`** — Define the three prop types. No dependencies on other files.
2. **`resizable.styles.ts`** — Define static style constants. No dependencies on types.
3. **`resizable.tsx`** — Implement the three sub-components. Depends on types and styles.
4. **`resizable.test.tsx`** — Write all tests. Depends on the implementation.
5. **`resizable.stories.tsx`** — Write all stories. Depends on the implementation.
6. **`packages/ui/src/index.ts`** — Add export block for Resizable components and types.

## 7. Verification Commands

```bash
# Run only resizable tests
pnpm --filter @components/ui test -- --run resizable

# TypeScript type checking
pnpm typecheck

# Full test suite to verify no regressions
pnpm test

# Lint check
pnpm lint

# Storybook (visual verification)
pnpm storybook
```

## 8. Design Deviations

**Deviation 1: No CVA variant for handle orientation**

- **Parent spec requires:** "CVA variant for handle orientation (horizontal/vertical grip positioning)" per both the phase spec (task 4 deliverables table) and the task spec.
- **Why this is unnecessary:** The `react-resizable-panels` library automatically sets a `data-panel-group-direction` attribute on the DOM. The shadcn/ui reference implementation uses this data attribute in CSS selectors (`data-[panel-group-direction=vertical]:...`) to style orientation differences — both for the handle bar itself and for rotating the grip indicator (`[&[data-panel-group-direction=vertical]>div]:rotate-90`). A CVA variant would require the consumer to manually pass an `orientation` prop that duplicates the `direction` already passed to `ResizablePanelGroup`, creating a redundant API surface and a risk of mismatches. Using data attribute selectors is both simpler and more correct.
- **Alternative chosen:** Static style constants with Tailwind `data-[...]` attribute selectors that respond automatically to the library's own data attributes. No consumer-facing orientation prop on the handle.

**Deviation 2: No `ref` destructuring in component signatures**

- **Parent spec (AGENTS.md pattern):** Shows `ref` being destructured from props and passed explicitly.
- **Why this is problematic:** The `react-resizable-panels` components (`PanelGroup`, `Panel`, `PanelResizeHandle`) use their own imperative handle ref system (`ImperativePanelGroupHandle`, `ImperativePanelHandle`) via `useImperativeHandle`. Their prop types do not include a standard `ref` prop in the type signature. Destructuring `ref` would cause a TypeScript error. The library handles refs internally.
- **Alternative chosen:** Spread all props through to the library components without explicit `ref` destructuring. Consumers who need imperative handles should use the library's documented ref pattern directly.
