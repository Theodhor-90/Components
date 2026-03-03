Now I have all the context. Let me produce the implementation plan.

## 1. Deliverables

| # | File | Action | Purpose |
|---|------|--------|---------|
| 1 | `packages/ui/src/components/empty-state/empty-state.types.ts` | Create | Props type definition for EmptyState |
| 2 | `packages/ui/src/components/empty-state/empty-state.styles.ts` | Create | Static style string exports (no CVA) |
| 3 | `packages/ui/src/components/empty-state/empty-state.tsx` | Create | EmptyState component implementation |
| 4 | `packages/ui/src/index.ts` | Modify | Add EmptyState and style exports |

## 2. Dependencies

### Prerequisites
- Milestone 1 (Foundation) complete — provides `cn()` utility and the 5-file pattern
- No new npm dependencies required — this is a pure HTML + Tailwind component

### Existing Dependencies Used
- `@components/utils` via `../../lib/utils.js` — `cn()` helper for className merging

## 3. Implementation Details

### 3.1 `empty-state.types.ts`

**Purpose**: Define the `EmptyStateProps` type.

**Exports**:
- `EmptyStateProps` — type extending `React.ComponentProps<'div'>` with four additional props

**Interface**:
```ts
export type EmptyStateProps = React.ComponentProps<'div'> & {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
};
```

**Notes**:
- Extends `React.ComponentProps<'div'>` which includes `ref`, `className`, `children`, etc. in React 19
- `icon` and `action` are `ReactNode` slots — consumers pass JSX (e.g., an SVG element or a `<Button>`)
- `title` is a required `string`, not a `ReactNode`, keeping the API simple
- `description` is an optional `string`
- `children` from the base `div` props is not used by the component — the layout is slot-driven via the four named props

### 3.2 `empty-state.styles.ts`

**Purpose**: Export static style string constants. No CVA — this component has no variants.

**Exports**:
- `emptyStateStyles` — `'flex flex-col items-center justify-center text-center p-8'`
- `emptyStateIconStyles` — `'mb-4 text-muted-foreground [&>svg]:h-10 [&>svg]:w-10'`
- `emptyStateTitleStyles` — `'text-lg font-semibold text-foreground'`
- `emptyStateDescriptionStyles` — `'mt-1 text-sm text-muted-foreground max-w-sm'`
- `emptyStateActionStyles` — `'mt-4'`

**Notes**:
- Each style string corresponds to a sub-element of the component
- The `[&>svg]:h-10 [&>svg]:w-10` selector on the icon wrapper sizes any direct SVG child to 40×40px
- Follows the same pattern as `avatar-group.styles.ts` which exports plain string constants

### 3.3 `empty-state.tsx`

**Purpose**: The EmptyState component implementation.

**Exports**:
- `EmptyState` — named function component
- `EmptyStateProps` — re-exported type (via `export type`)

**Key Logic**:
1. Destructure `{ className, icon, title, description, action, ref, ...props }` from `EmptyStateProps`
2. Render root `<div data-slot="empty-state" className={cn(emptyStateStyles, className)} ref={ref} {...props}>`
3. Conditionally render icon: `{icon && <div data-slot="empty-state-icon" className={emptyStateIconStyles}>{icon}</div>}`
4. Always render title: `<h3 data-slot="empty-state-title" className={emptyStateTitleStyles}>{title}</h3>`
5. Conditionally render description: `{description && <p data-slot="empty-state-description" className={emptyStateDescriptionStyles}>{description}</p>}`
6. Conditionally render action: `{action && <div data-slot="empty-state-action" className={emptyStateActionStyles}>{action}</div>}`

**Implementation notes**:
- No `asChild`/`Slot` pattern — this is a layout component, not a polymorphic leaf
- No `forwardRef` — uses React 19 ref-as-prop
- Empty wrappers are NOT rendered when optional props are omitted (uses `&&` short-circuit)
- Return type is `React.JSX.Element` (matching the Button pattern)

### 3.4 `packages/ui/src/index.ts` modifications

**Append** after the Progress exports (line 341):

```ts
export { EmptyState, type EmptyStateProps } from './components/empty-state/empty-state.js';
export {
  emptyStateStyles,
  emptyStateIconStyles,
  emptyStateTitleStyles,
  emptyStateDescriptionStyles,
  emptyStateActionStyles,
} from './components/empty-state/empty-state.styles.js';
```

## 4. API Contracts

### EmptyState

**Input (props)**:
```ts
{
  // Required
  title: string;

  // Optional slots
  icon?: React.ReactNode;
  description?: string;
  action?: React.ReactNode;

  // Inherited from React.ComponentProps<'div'>
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  // ... all other div props
}
```

**Output (rendered DOM)**:

With all props provided:
```html
<div data-slot="empty-state" class="flex flex-col items-center justify-center text-center p-8">
  <div data-slot="empty-state-icon" class="mb-4 text-muted-foreground [&>svg]:h-10 [&>svg]:w-10">
    <!-- icon ReactNode -->
  </div>
  <h3 data-slot="empty-state-title" class="text-lg font-semibold text-foreground">
    No results found
  </h3>
  <p data-slot="empty-state-description" class="mt-1 text-sm text-muted-foreground max-w-sm">
    Try adjusting your search criteria.
  </p>
  <div data-slot="empty-state-action" class="mt-4">
    <!-- action ReactNode -->
  </div>
</div>
```

With only `title`:
```html
<div data-slot="empty-state" class="flex flex-col items-center justify-center text-center p-8">
  <h3 data-slot="empty-state-title" class="text-lg font-semibold text-foreground">
    No results found
  </h3>
</div>
```

**Usage examples**:
```tsx
// Minimal
<EmptyState title="No items" />

// Full
<EmptyState
  icon={<InboxIcon />}
  title="No messages"
  description="Your inbox is empty. New messages will appear here."
  action={<Button>Compose</Button>}
/>
```

## 5. Test Plan

Tests are NOT part of this task (Task 1 is implementation only; Task 2 covers tests and stories). However, for completeness, the following should be verifiable via `pnpm typecheck`:

1. **Type correctness**: `EmptyStateProps` extends `React.ComponentProps<'div'>` and adds `icon`, `title`, `description`, `action`
2. **Export correctness**: `EmptyState` and `EmptyStateProps` are importable from `@components/ui`
3. **Style exports**: All 5 style constants are importable from `@components/ui`

**Manual verification** (visual):
- Component renders a centered layout in Storybook/playground
- Only the title renders when optional props are omitted
- Icon wrapper, description, and action do not render as empty elements when their props are absent

## 6. Implementation Order

1. **Create `empty-state.types.ts`** — types have no internal dependencies; define props interface first
2. **Create `empty-state.styles.ts`** — static style strings with no dependencies
3. **Create `empty-state.tsx`** — imports from both the types and styles files, plus `cn()` from `../../lib/utils.js`
4. **Modify `packages/ui/src/index.ts`** — add export lines for the component, type, and style constants

## 7. Verification Commands

```bash
# Type check the entire UI package (must pass with zero errors)
pnpm typecheck

# Verify the new files exist
ls packages/ui/src/components/empty-state/

# Quick smoke: ensure the module can be resolved by TypeScript
# (typecheck covers this, but explicitly confirms exports)
pnpm --filter @components/ui exec tsc --noEmit
```

## 8. Design Deviations

**Deviation 1: No `asChild` prop**

- **Parent spec (AGENTS.md component checklist)**: States components should include `Slot/asChild` in the implementation
- **Why problematic**: Empty State is a multi-element layout component with semantic structure (`<h3>`, `<p>`, nested wrapper `<div>`s). `asChild` replaces the root element with a consumer-provided child, which would destroy the internal layout structure. There is no meaningful use case for rendering the Empty State's internal layout inside a consumer-provided element.
- **Alternative chosen**: Omit `asChild` entirely. The root `<div>` accepts all standard div props via `React.ComponentProps<'div'>`, so consumers can still customize it fully. This matches the Avatar Group precedent — another custom component that omits `asChild`.

**Deviation 2: No CVA variants**

- **Parent spec (AGENTS.md component checklist)**: States styles file should contain "CVA variants with defaultVariants"
- **Why problematic**: Empty State has no visual variants (no size, color, or style variants). Wrapping static strings in CVA with an empty `variants` object adds unnecessary runtime overhead and type complexity for zero benefit.
- **Alternative chosen**: Export plain string constants from `empty-state.styles.ts`, matching the pattern established by `avatar-group.styles.ts` and `progress.styles.ts`. The phase spec (DD-4) explicitly prescribes this approach.