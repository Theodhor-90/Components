I now have complete context to produce the plan. Here is the full specification:

## 1. Deliverables

| #   | File                                                             | Purpose                                                                             |
| --- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 1   | `packages/ui/src/components/scroll-area/scroll-area.types.ts`    | TypeScript types for ScrollArea and ScrollBar sub-components                        |
| 2   | `packages/ui/src/components/scroll-area/scroll-area.styles.ts`   | Static style strings for scroll area viewport, scrollbar track, and scrollbar thumb |
| 3   | `packages/ui/src/components/scroll-area/scroll-area.tsx`         | ScrollArea and ScrollBar implementation built on `@radix-ui/react-scroll-area`      |
| 4   | `packages/ui/src/components/scroll-area/scroll-area.test.tsx`    | Vitest + Testing Library + vitest-axe tests                                         |
| 5   | `packages/ui/src/components/scroll-area/scroll-area.stories.tsx` | Storybook CSF3 stories with `tags: ['autodocs']`                                    |
| 6   | `packages/ui/src/index.ts`                                       | Add exports for ScrollArea, ScrollBar, and their types                              |

## 2. Dependencies

- **`@radix-ui/react-scroll-area`** — already installed in `packages/ui/package.json` (`^1.2.10`, added in task t01)
- **No new packages required** — all dependencies are already present

## 3. Implementation Details

### 3.1 `scroll-area.types.ts`

**Purpose**: Define prop types for ScrollArea and ScrollBar.

**Exports**:

- `ScrollAreaProps` — extends `React.ComponentProps<typeof ScrollAreaPrimitive.Root>`
- `ScrollBarProps` — extends `React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>`

**Pattern**: Follows the exact same pattern as `tabs.types.ts` and `accordion.types.ts` — import Radix primitive types via `import type * as ScrollAreaPrimitive`, then export type aliases extending the Radix component props.

```typescript
import type * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

export type ScrollAreaProps = React.ComponentProps<typeof ScrollAreaPrimitive.Root>;
export type ScrollBarProps = React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>;
```

### 3.2 `scroll-area.styles.ts`

**Purpose**: Define static Tailwind class strings for all scroll area sub-elements. No CVA needed — ScrollArea has no configurable variants (orientation is handled programmatically in the component).

**Exports**:

- `scrollAreaStyles` — `'relative overflow-hidden'`
- `scrollAreaViewportStyles` — `'h-full w-full rounded-[inherit]'`
- `scrollBarStyles` — `'flex touch-none select-none transition-colors'`
- `scrollBarVerticalStyles` — `'h-full w-2.5 border-l border-l-transparent p-px'`
- `scrollBarHorizontalStyles` — `'h-2.5 flex-col border-t border-t-transparent p-px'`
- `scrollBarThumbStyles` — `'relative flex-1 rounded-full bg-border'`

**Design rationale**: Orientation-specific styles are split into separate constants (`scrollBarVerticalStyles`, `scrollBarHorizontalStyles`) rather than using CVA, because the orientation is determined at render time from the Radix `orientation` prop and applied via conditional selection in the component. This matches shadcn/ui's approach where orientation-specific classes are applied inline.

### 3.3 `scroll-area.tsx`

**Purpose**: Implement ScrollArea and ScrollBar sub-components wrapping `@radix-ui/react-scroll-area` primitives.

**Exports**:

- `ScrollArea` — function component
- `ScrollBar` — function component
- Re-exports all types from `scroll-area.types.js`

**Sub-component details**:

**`ScrollArea`**:

- Wraps `ScrollAreaPrimitive.Root` with `data-slot="scroll-area"`
- Renders `ScrollAreaPrimitive.Viewport` inside with `scrollAreaViewportStyles`
- Renders `children` inside the viewport
- Includes a default vertical `ScrollBar` after the viewport
- Includes `ScrollAreaPrimitive.Corner` after the scrollbar
- Accepts `className` and merges it onto the root via `cn(scrollAreaStyles, className)`
- Accepts `ref` via React 19 ref-as-prop

```typescript
export function ScrollArea({
  className,
  children,
  ref,
  ...props
}: ScrollAreaProps): React.JSX.Element {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn(scrollAreaStyles, className)}
      ref={ref}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport className={scrollAreaViewportStyles}>
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}
```

**`ScrollBar`**:

- Wraps `ScrollAreaPrimitive.ScrollAreaScrollbar` with `data-slot="scroll-bar"`
- Destructures `orientation` prop (defaults to `"vertical"`)
- Applies orientation-specific styles conditionally: if `orientation === 'vertical'` use `scrollBarVerticalStyles`, else `scrollBarHorizontalStyles`
- Renders `ScrollAreaPrimitive.ScrollAreaThumb` inside with `scrollBarThumbStyles`
- Accepts `className` and merges via `cn()`

```typescript
export function ScrollBar({
  className,
  orientation = 'vertical',
  ref,
  ...props
}: ScrollBarProps): React.JSX.Element {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-bar"
      orientation={orientation}
      className={cn(
        scrollBarStyles,
        orientation === 'vertical' ? scrollBarVerticalStyles : scrollBarHorizontalStyles,
        className,
      )}
      ref={ref}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className={scrollBarThumbStyles} />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}
```

### 3.4 `scroll-area.test.tsx`

**Purpose**: Test ScrollArea and ScrollBar rendering, data-slot attributes, className merging, and accessibility.

**Test helper**: A `TestScrollArea` wrapper component that renders a ScrollArea with overflowing content (a list of items) and accepts optional props for `className`, `type`, and whether to include a horizontal scrollbar.

**Tests** (see §5 for full specification).

### 3.5 `scroll-area.stories.tsx`

**Purpose**: Storybook documentation with CSF3 format.

**Meta**:

```typescript
const meta: Meta<typeof ScrollArea> = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
};
```

**Stories**:

1. **Vertical** — A fixed-height `div` (e.g., `h-72 w-48`) containing a ScrollArea with a tall list of items (e.g., 50 tags/items)
2. **Horizontal** — A fixed-width container with a ScrollArea containing a wide horizontal layout. Includes `<ScrollBar orientation="horizontal" />` as a child of ScrollArea alongside the content
3. **BothDirections** — A container with both vertical and horizontal overflow, showing both scrollbars. Renders the content plus `<ScrollBar orientation="horizontal" />` inside the ScrollArea
4. **WithTags** — A horizontal tag list using Badge-like styled spans, showcasing horizontal scrolling of inline items
5. **CustomHeight** — A ScrollArea with an explicitly set `h-[200px]` height containing enough content to overflow

### 3.6 `packages/ui/src/index.ts`

**Additions** (appended after the existing Accordion exports):

```typescript
export {
  ScrollArea,
  ScrollBar,
  type ScrollAreaProps,
  type ScrollBarProps,
} from './components/scroll-area/scroll-area.js';
```

**Note**: No CVA variant export needed since ScrollArea uses static style strings, not CVA.

## 4. API Contracts

### ScrollArea

```tsx
<ScrollArea className="h-72 w-48 rounded-md border">{/* tall content */}</ScrollArea>
```

**Props**: Extends `React.ComponentProps<typeof ScrollAreaPrimitive.Root>`. Key props inherited from Radix:

- `type?: 'auto' | 'always' | 'scroll' | 'hover'` — Controls scrollbar visibility behavior. Defaults to `'hover'`.
- `scrollHideDelay?: number` — Delay in ms before scrollbars hide after user stops scrolling.
- `dir?: 'ltr' | 'rtl'` — Reading direction.
- `className?: string` — Merged with base styles.
- `ref?: React.Ref<HTMLDivElement>` — Forwarded to root element.
- `children: React.ReactNode` — Content to render inside the scrollable viewport.

### ScrollBar

```tsx
<ScrollBar orientation="horizontal" />
```

**Props**: Extends `React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>`. Key props:

- `orientation?: 'vertical' | 'horizontal'` — Defaults to `'vertical'`.
- `className?: string` — Merged with base + orientation styles.
- `ref?: React.Ref<HTMLDivElement>` — Forwarded to scrollbar element.

### Usage with horizontal scrollbar

```tsx
<ScrollArea className="w-96 whitespace-nowrap rounded-md border">
  <div className="flex w-max space-x-4 p-4">
    {items.map((item) => (
      <div key={item}>{item}</div>
    ))}
  </div>
  <ScrollBar orientation="horizontal" />
</ScrollArea>
```

**Important**: When using `<ScrollBar orientation="horizontal" />` as a child of `ScrollArea`, it is rendered _in addition to_ the default vertical scrollbar that `ScrollArea` always includes internally. The Radix primitive handles deduplication — the child `ScrollBar` is rendered via `ScrollAreaPrimitive.ScrollAreaScrollbar` inside the `ScrollAreaPrimitive.Root` context, and Radix manages the scroll relationship.

## 5. Test Plan

### Test Setup

- Uses `vitest` with `@testing-library/react`, `@testing-library/user-event`, and `vitest-axe`
- Imports from `./scroll-area.js` (the local module, matching sibling task patterns)
- Test helper renders a fixed-height ScrollArea with a list of 50 items to guarantee overflow

### Test Helper

```typescript
function TestScrollArea({
  className,
  type,
  horizontal,
}: {
  className?: string;
  type?: 'auto' | 'always' | 'scroll' | 'hover';
  horizontal?: boolean;
}): React.JSX.Element {
  return (
    <ScrollArea className={cn('h-72 w-48', className)} type={type}>
      <div className="p-4">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="text-sm">
            Item {i + 1}
          </div>
        ))}
      </div>
      {horizontal && <ScrollBar orientation="horizontal" />}
    </ScrollArea>
  );
}
```

### Test Specifications

| #   | Test Name                                 | Description                                                                                                                                      |
| --- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `renders without crashing`                | Render `TestScrollArea`, assert the scroll area root element is in the document via `data-slot="scroll-area"`                                    |
| 2   | `renders children content`                | Render `TestScrollArea`, assert `Item 1` and `Item 50` text are present in the document                                                          |
| 3   | `renders vertical scrollbar by default`   | Render `TestScrollArea` with `type="always"`, assert `data-slot="scroll-bar"` element is present and has `data-orientation="vertical"` attribute |
| 4   | `renders horizontal scrollbar when added` | Render `TestScrollArea` with `horizontal={true}` and `type="always"`, assert a scrollbar element with `data-orientation="horizontal"` is present |
| 5   | `data-slot on scroll-area`                | Render `TestScrollArea`, assert `document.querySelector('[data-slot="scroll-area"]')` is in the document                                         |
| 6   | `data-slot on scroll-bar`                 | Render `TestScrollArea` with `type="always"`, assert `document.querySelector('[data-slot="scroll-bar"]')` is in the document                     |
| 7   | `merges custom className on ScrollArea`   | Render `TestScrollArea` with `className="custom-scroll-class"`, assert the `data-slot="scroll-area"` element has class `custom-scroll-class`     |
| 8   | `has no accessibility violations`         | Render `TestScrollArea`, run `axe(container)`, assert `toHaveNoViolations()`                                                                     |

**Note on scrollbar visibility in tests**: In jsdom, Radix Scroll Area may not render scrollbars at all in `type="hover"` (default) mode since there is no real scrolling. Tests that need to assert scrollbar presence should use `type="always"` to force scrollbar rendering regardless of overflow state. This matches the shadcn/ui testing approach.

## 6. Implementation Order

1. **`scroll-area.types.ts`** — Create types first, as both styles and component depend on them for imports
2. **`scroll-area.styles.ts`** — Create style constants (no dependencies on types, but logically next)
3. **`scroll-area.tsx`** — Implement ScrollArea and ScrollBar components, importing styles and types
4. **`scroll-area.test.tsx`** — Write tests, run to verify implementation
5. **`scroll-area.stories.tsx`** — Write Storybook stories
6. **`packages/ui/src/index.ts`** — Add ScrollArea and ScrollBar exports

## 7. Verification Commands

```bash
# Run Scroll Area tests only
pnpm --filter @components/ui test -- scroll-area

# Run all tests across the monorepo
pnpm test

# TypeScript type checking
pnpm typecheck

# Build all packages
pnpm build

# Verify exports are present in index.ts (quick grep)
grep -n "ScrollArea\|ScrollBar" packages/ui/src/index.ts
```

## 8. Design Deviations

**Deviation 1: No CVA for ScrollBar orientation**

- **Parent spec says**: `scrollBarStyles` as a single style string with "orientation-specific sizing: vertical gets `h-full w-2.5 border-l border-l-transparent p-px`, horizontal gets `h-2.5 flex-col border-t border-t-transparent p-px`"
- **Why problematic**: The spec implies a single `scrollBarStyles` string containing both orientation-specific sets of classes. This is not possible in a single static string — the orientation must be selected at render time. CVA would be overkill for a binary choice with no default variants.
- **Alternative chosen**: Split into three constants: `scrollBarStyles` (shared base), `scrollBarVerticalStyles`, and `scrollBarHorizontalStyles`. The component conditionally selects the orientation-specific constant using a ternary on the `orientation` prop. This is simpler than CVA, matches how shadcn/ui implements it, and avoids unnecessary abstraction for a two-option switch.
