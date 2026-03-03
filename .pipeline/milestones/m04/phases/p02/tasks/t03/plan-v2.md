Now I have all the context needed. Let me produce the revised plan addressing both feedback issues.

# Task: Tooltip Component — Implementation Plan

## 1. Deliverables

| #   | File                                                     | Action | Purpose                                                                                         |
| --- | -------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------- |
| 1   | `packages/ui/src/components/tooltip/tooltip.types.ts`    | Create | Props types for TooltipProvider, Tooltip, TooltipTrigger, and TooltipContent                    |
| 2   | `packages/ui/src/components/tooltip/tooltip.styles.ts`   | Create | Static string constant `tooltipContentStyles` for TooltipContent styling                        |
| 3   | `packages/ui/src/components/tooltip/tooltip.tsx`         | Create | Implementation: re-exports for Provider/Root, function wrappers for Trigger/Content             |
| 4   | `packages/ui/src/components/tooltip/tooltip.test.tsx`    | Create | Vitest + Testing Library + vitest-axe test suite                                                |
| 5   | `packages/ui/src/components/tooltip/tooltip.stories.tsx` | Create | Storybook CSF3 stories with `tags: ['autodocs']`                                                |
| 6   | `packages/ui/src/index.ts`                               | Modify | Add Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, and their types to public exports |
| 7   | `packages/ui/package.json`                               | Modify | Add `@radix-ui/react-tooltip` dependency                                                        |

## 2. Dependencies

### New Dependency to Install

- `@radix-ui/react-tooltip` — Radix Tooltip primitive (add to `packages/ui/package.json` under `dependencies`). The exact version will be resolved by `pnpm --filter @components/ui add @radix-ui/react-tooltip` at install time — no hardcoded version.

### Existing Dependencies Used

- `@radix-ui/react-slot` — already installed (for potential `asChild` on trigger, inherited from Radix)
- `class-variance-authority` — already installed (not used directly since no CVA variants, but available)
- `@components/utils` — already installed (`cn()` helper for className merging)

### Prior Task Dependencies

- Tasks t01 (Avatar) and t02 (Avatar Group) are complete — no dependency on them. Tooltip is an independent component.
- Phase 1 (Tables & Pagination) is complete.

## 3. Implementation Details

### 3.1 `tooltip.types.ts`

**Purpose**: Define prop types for all four Tooltip sub-components.

**Exports**:

- `TooltipProviderProps` — extends `React.ComponentProps<typeof TooltipPrimitive.Provider>`
- `TooltipProps` — extends `React.ComponentProps<typeof TooltipPrimitive.Root>`
- `TooltipTriggerProps` — extends `React.ComponentProps<typeof TooltipPrimitive.Trigger>`
- `TooltipContentProps` — extends `React.ComponentProps<typeof TooltipPrimitive.Content>`

**Pattern**: Follows the exact same `import type * as` pattern used by `popover.types.ts` and `collapsible.types.ts`. No additional custom props are needed — Radix's built-in props cover `delayDuration`, `sideOffset`, `side`, `align`, etc.

**Note on `asChild`**: The task spec mentions `{ asChild?: boolean }` on TooltipContent. However, `asChild` is already part of `React.ComponentProps<typeof TooltipPrimitive.Content>` inherited from Radix. Adding it explicitly would create a type overlap. Following the Popover pattern (`popover.types.ts`), we do **not** add `asChild` explicitly — it is inherited. See Design Deviations (Section 8).

```typescript
import type * as TooltipPrimitive from '@radix-ui/react-tooltip';

export type TooltipProviderProps = React.ComponentProps<typeof TooltipPrimitive.Provider>;

export type TooltipProps = React.ComponentProps<typeof TooltipPrimitive.Root>;

export type TooltipTriggerProps = React.ComponentProps<typeof TooltipPrimitive.Trigger>;

export type TooltipContentProps = React.ComponentProps<typeof TooltipPrimitive.Content>;
```

### 3.2 `tooltip.styles.ts`

**Purpose**: Static string constant for TooltipContent classes. No CVA — single visual treatment.

**Export**: `tooltipContentStyles`

**Classes**: Matches the animation pattern established by `popoverContentStyles` in `popover.styles.ts`, but uses tooltip-specific sizing (no fixed width like Popover's `w-72`). Uses `data-[state=open]` and `data-[state=closed]` data-attribute selectors for entry/exit animations.

```typescript
export const tooltipContentStyles =
  'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2';
```

**Key differences from Popover styles**:

- No `w-72` — tooltips have dynamic width
- No `p-4` — uses `px-3 py-1.5` for compact tooltip sizing
- No `outline-none` — not needed for non-focusable content
- Otherwise identical animation classes

### 3.3 `tooltip.tsx`

**Purpose**: Implementation of all four Tooltip sub-components.

**Exports**:

- `TooltipProvider` — direct re-export of `TooltipPrimitive.Provider` (as `const` assignment, matching Popover root pattern)
- `Tooltip` — direct re-export of `TooltipPrimitive.Root` (as `const` assignment)
- `TooltipTrigger` — function component wrapper with `data-slot="tooltip-trigger"` (matching the PopoverTrigger pattern in `popover.tsx` lines 11–24)
- `TooltipContent` — styled wrapper function component

**Key Logic**:

- `TooltipProvider` and `Tooltip` are assigned via `export const X = TooltipPrimitive.Y` — they are pure Radix re-exports. These are context providers/root containers, not rendered elements, so they do not need `data-slot`.
- `TooltipTrigger` is a function component that wraps `TooltipPrimitive.Trigger` with `data-slot="tooltip-trigger"`, accepting `className` and `ref` props. This follows the established pattern where all rendered components include `data-slot`, as required by the root-level AGENTS.md ("Include `data-slot` attribute on the root element of every component").
- `TooltipContent` is a function component that renders `TooltipPrimitive.Portal` > `TooltipPrimitive.Content` with:
  - `data-slot="tooltip-content"`
  - `sideOffset={4}` as default prop (overridable by consumer)
  - Styles merged via `cn(tooltipContentStyles, className)`
  - Destructures `className`, `sideOffset`, `ref`, and spreads `...props`

```typescript
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '../../lib/utils.js';
import { tooltipContentStyles } from './tooltip.styles.js';
import type { TooltipContentProps, TooltipTriggerProps } from './tooltip.types.js';

export type {
  TooltipContentProps,
  TooltipProps,
  TooltipProviderProps,
  TooltipTriggerProps,
} from './tooltip.types.js';

export const TooltipProvider = TooltipPrimitive.Provider;

export const Tooltip = TooltipPrimitive.Root;

export function TooltipTrigger({
  className,
  ref,
  ...props
}: TooltipTriggerProps): React.JSX.Element {
  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      className={className}
      ref={ref}
      {...props}
    />
  );
}

export function TooltipContent({
  className,
  sideOffset = 4,
  ref,
  ...props
}: TooltipContentProps): React.JSX.Element {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(tooltipContentStyles, className)}
        ref={ref}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
}
```

### 3.4 `tooltip.test.tsx`

**Purpose**: Comprehensive test suite covering smoke render, visibility, hover interaction, data-slot, className merging, ref forwarding, and accessibility.

**Test Setup**:

- All tests must wrap components in `TooltipProvider` (Radix requires this context)
- Hover-based tests use `userEvent.hover()` and `waitFor()` to account for Radix's default open delay
- May need `vi.useFakeTimers()` to control open delay for reliable tests, or use `delayDuration={0}` on `TooltipProvider` for tests
- Use `document.querySelector` to find portalled content (since TooltipContent renders in a portal outside the component tree)
- A11y test uses `axe(document.body)` since content is portalled (matching Popover test pattern)

**Helper Component**:

```typescript
function TestTooltip({
  contentClassName,
  sideOffset,
  delayDuration = 0,
}: {
  contentClassName?: string;
  sideOffset?: number;
  delayDuration?: number;
}): React.JSX.Element {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent className={contentClassName} sideOffset={sideOffset}>
          Tooltip text
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
```

**Tests**:

1. **Renders trigger** — verify trigger button is in the document
2. **Content hidden by default** — verify tooltip text is not visible initially
3. **Shows on hover** — `userEvent.hover()` on trigger, `waitFor` tooltip text to appear
4. **Hides on pointer leave** — hover then unhover, verify content disappears
5. **`data-slot="tooltip-trigger"`** — verify trigger element has `data-slot="tooltip-trigger"` attribute
6. **`data-slot="tooltip-content"`** — after hover, verify content element has correct data-slot
7. **className merging on content** — pass custom className, verify it's applied alongside base styles
8. **Default `sideOffset`** — after hover, verify content has `data-side` attribute (proves positioning is active)
9. **Ref forwarding on TooltipContent** — use `createRef` and verify ref.current is an HTMLDivElement
10. **Accessibility** — hover to open, then `axe(document.body)` has no violations

### 3.5 `tooltip.stories.tsx`

**Purpose**: CSF3 stories demonstrating all Tooltip usage patterns.

**Meta Config**:

```typescript
const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
};
```

**Stories**:

1. **Default** — tooltip on a Button trigger, basic text content. Wraps in `TooltipProvider`.
2. **CustomDelay** — tooltip with `delayDuration={500}` on `TooltipProvider` demonstrating configurable delay.
3. **Positions** — four tooltips positioned on top/right/bottom/left using `side` prop on `TooltipContent`. Arranged in a centered layout with padding.
4. **RichContent** — tooltip with formatted JSX content (bold text, line break, etc.) instead of plain string.
5. **OnFocus** — tooltip on a focusable element (button), demonstrating that tooltip opens on keyboard focus. Uses `asChild` on `TooltipTrigger` with a Button.

All stories wrap content in `TooltipProvider` (required by Radix).

### 3.6 `index.ts` Modification

**Action**: Append Tooltip exports after the existing AvatarGroup export line.

```typescript
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  type TooltipProps,
  type TooltipTriggerProps,
  type TooltipContentProps,
  type TooltipProviderProps,
} from './components/tooltip/tooltip.js';
```

No styles export needed since there are no CVA variants — only a static string constant used internally.

### 3.7 `package.json` Modification

**Action**: Add `@radix-ui/react-tooltip` to the `dependencies` object using `pnpm --filter @components/ui add @radix-ui/react-tooltip`. The install command will resolve the latest compatible version automatically — no hardcoded version is specified here to avoid inconsistency with the resolved version.

## 4. API Contracts

### Component API

```tsx
// Provider — wraps any tree that contains Tooltips
<TooltipProvider delayDuration={700}>
  {/* children */}
</TooltipProvider>

// Basic usage
<Tooltip>
  <TooltipTrigger>Hover me</TooltipTrigger>
  <TooltipContent>
    Tooltip text
  </TooltipContent>
</Tooltip>

// With asChild trigger (render as Button)
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="outline">Hover me</Button>
  </TooltipTrigger>
  <TooltipContent side="right" sideOffset={8}>
    <p>Custom tooltip content</p>
  </TooltipContent>
</Tooltip>
```

### Props Summary

| Component         | Key Props                                                       | Defaults                            |
| ----------------- | --------------------------------------------------------------- | ----------------------------------- |
| `TooltipProvider` | `delayDuration`, `skipDelayDuration`, `disableHoverableContent` | `delayDuration=700` (Radix default) |
| `Tooltip`         | `open`, `defaultOpen`, `onOpenChange`, `delayDuration`          | `defaultOpen=false`                 |
| `TooltipTrigger`  | `asChild`, all native button props                              | `asChild=false`                     |
| `TooltipContent`  | `side`, `sideOffset`, `align`, `alignOffset`, `className`       | `sideOffset=4`                      |

### Exports from `index.ts`

| Export                 | Type      |
| ---------------------- | --------- |
| `TooltipProvider`      | Component |
| `Tooltip`              | Component |
| `TooltipTrigger`       | Component |
| `TooltipContent`       | Component |
| `TooltipProviderProps` | Type      |
| `TooltipProps`         | Type      |
| `TooltipTriggerProps`  | Type      |
| `TooltipContentProps`  | Type      |

## 5. Test Plan

### Test Setup

- **Framework**: Vitest + @testing-library/react + @testing-library/user-event + vitest-axe
- **Import pattern**: `import { describe, expect, it } from 'vitest'` (no `vi` import needed unless fake timers are used)
- **Helper**: `TestTooltip` wrapper component with `delayDuration={0}` on `TooltipProvider` to eliminate timing issues in tests
- **Portal handling**: Use `document.querySelector('[data-slot="tooltip-content"]')` for portalled content assertions

### Test Specifications

| #   | Test Name                        | Category    | Description                                                                                                   |
| --- | -------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------- |
| 1   | renders trigger                  | Smoke       | Render `TestTooltip`, verify trigger button is in the document via `getByRole('button')`                      |
| 2   | content hidden by default        | Visibility  | Render `TestTooltip`, verify tooltip text is not visible via `queryByText` returning null                     |
| 3   | shows on hover                   | Interaction | `userEvent.hover()` on trigger, `waitFor` tooltip text to appear in the document                              |
| 4   | hides on pointer leave           | Interaction | Hover trigger, verify content appears, then `userEvent.unhover()`, verify content disappears via `waitFor`    |
| 5   | `data-slot` on trigger           | Attribute   | Verify trigger element has `data-slot="tooltip-trigger"` attribute                                            |
| 6   | `data-slot` on content           | Attribute   | Hover to open, verify `document.querySelector('[data-slot="tooltip-content"]')` is in the document            |
| 7   | className merging on content     | Styling     | Pass `contentClassName="custom-class"`, hover to open, verify element has both `custom-class` and base styles |
| 8   | default sideOffset is active     | Positioning | Hover to open, verify content element has `data-side` attribute (Radix adds this for positioned content)      |
| 9   | ref forwarding on TooltipContent | Ref         | Pass a `createRef` to TooltipContent (requires separate test component), verify `ref.current` is an element   |
| 10  | no accessibility violations      | A11y        | Hover to open, `axe(document.body)` has no violations                                                         |

## 6. Implementation Order

1. **Install dependency** — Add `@radix-ui/react-tooltip` to `packages/ui/package.json` via `pnpm --filter @components/ui add @radix-ui/react-tooltip`
2. **Create `tooltip.types.ts`** — Define all four prop types
3. **Create `tooltip.styles.ts`** — Define `tooltipContentStyles` static string constant
4. **Create `tooltip.tsx`** — Implement re-exports for Provider/Root, function component wrappers for Trigger/Content
5. **Update `packages/ui/src/index.ts`** — Add all Tooltip exports
6. **Run `pnpm typecheck`** — Verify no TypeScript errors before writing tests
7. **Create `tooltip.test.tsx`** — Write all tests (including `data-slot` test for trigger)
8. **Run `pnpm test`** — Verify all tests pass including vitest-axe
9. **Create `tooltip.stories.tsx`** — Write all Storybook stories
10. **Final verification** — Run `pnpm typecheck && pnpm test` to confirm everything passes

## 7. Verification Commands

```bash
# Install the new dependency (resolves latest compatible version automatically)
pnpm --filter @components/ui add @radix-ui/react-tooltip

# Type check the entire project
pnpm typecheck

# Run all tests
pnpm test

# Run only tooltip tests
pnpm --filter @components/ui test -- tooltip

# Build the package to verify dist output
pnpm build

# Launch Storybook to visually verify stories (interactive)
pnpm storybook
```

## 8. Design Deviations

### Deviation 1: No explicit `asChild` on `TooltipContentProps`

- **Parent spec requires**: `TooltipContent` props type extends `React.ComponentProps<typeof TooltipPrimitive.Content>` with `{ asChild?: boolean }`.
- **Why problematic**: `asChild` is already included in `React.ComponentProps<typeof TooltipPrimitive.Content>` because Radix's Content component inherits from a base that includes the `asChild` prop. Adding it explicitly as an intersection type (`& { asChild?: boolean }`) creates a redundant type overlap. More importantly, no other component in this codebase (Popover, Collapsible, Dialog, etc.) adds `asChild` explicitly to Content-type props — they all rely on the inherited Radix types.
- **Alternative chosen**: `TooltipContentProps` simply extends `React.ComponentProps<typeof TooltipPrimitive.Content>` without additional intersection, matching the `PopoverContentProps` pattern exactly. Consumers can still use `asChild` since it's part of the Radix type.

### Deviation 2: Animation class selectors use `data-[state=open]` prefix

- **Parent spec requires**: Animation classes including bare `animate-in fade-in-0 zoom-in-95` (without `data-[state=open]` prefix).
- **Why problematic**: Bare `animate-in` would apply entry animation unconditionally, including on initial mount when the tooltip isn't visible. The Popover component (the established pattern in this codebase — see `popover.styles.ts`) uses `data-[state=open]:animate-in` and `data-[state=closed]:animate-out` to scope animations to Radix's state data attributes. Without these selectors, animations would fire incorrectly.
- **Alternative chosen**: Use `data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95` and `data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95`, matching the exact pattern from `popover.styles.ts`. This ensures animations only run when Radix signals the open/close state transitions.
