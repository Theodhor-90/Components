Now I have all the context I need. Let me produce the implementation plan.

# Task 3: Connection Status — Implementation Plan

## 1. Deliverables

| # | File | Type | Purpose |
|---|------|------|---------|
| 1 | `packages/ui/src/components/connection-status/connection-status.types.ts` | New | `ConnectionStatusProps` type definition extending `React.ComponentProps<'div'>` with `VariantProps<typeof connectionStatusDotVariants>` and required `status` prop |
| 2 | `packages/ui/src/components/connection-status/connection-status.styles.ts` | New | Two CVA definitions: `connectionStatusVariants` for the container and `connectionStatusDotVariants` for the status dot with green/yellow/red color mapping and pulse animation |
| 3 | `packages/ui/src/components/connection-status/connection-status.tsx` | New | Component implementation rendering a `<div>` with status dot `<span>` and text label `<span>`, with `role="status"` and `aria-live="polite"` |
| 4 | `packages/ui/src/components/connection-status/connection-status.test.tsx` | New | Vitest + Testing Library + vitest-axe test suite |
| 5 | `packages/ui/src/components/connection-status/connection-status.stories.tsx` | New | Storybook CSF3 stories with autodocs |
| 6 | `packages/ui/src/index.ts` | Modified | Add `ConnectionStatus`, `type ConnectionStatusProps`, `connectionStatusVariants`, `connectionStatusDotVariants` exports |

## 2. Dependencies

### Prior Tasks (must be complete)
- **Task t01** (Copy to Clipboard) and **Task t02** (Code Block) — already completed; no runtime dependency from Connection Status on either, but they must be merged so `index.ts` is in the expected state.

### Internal Packages (already installed)
- `class-variance-authority` — CVA variant definitions
- `@components/utils` — `cn()` helper (clsx + tailwind-merge)

### External Libraries
None required. No new packages to install.

## 3. Implementation Details

### 3.1 `connection-status.types.ts`

**Purpose**: Define the props type for the Connection Status component.

**Exports**:
- `ConnectionStatusProps`

**Contract**:
```typescript
import type { VariantProps } from 'class-variance-authority';
import type { connectionStatusDotVariants } from './connection-status.styles.js';

export type ConnectionStatusProps = React.ComponentProps<'div'> &
  VariantProps<typeof connectionStatusDotVariants> & {
    status: 'connected' | 'connecting' | 'disconnected';
  };
```

**Notes**:
- Extends `React.ComponentProps<'div'>` which includes `ref` in React 19 (no `forwardRef` needed).
- `VariantProps<typeof connectionStatusDotVariants>` is included to satisfy the CVA integration pattern, though the `status` prop is already explicitly typed. Since `status` is explicitly declared as required, it overrides the optional `status?: ... | null | undefined` from `VariantProps`, making it required.
- `children` is inherited from `React.ComponentProps<'div'>` and is naturally optional — when omitted, the default label for the status is rendered.

### 3.2 `connection-status.styles.ts`

**Purpose**: Define CVA variants for the container and the status dot.

**Exports**:
- `connectionStatusVariants` — CVA for the root container
- `connectionStatusDotVariants` — CVA for the status dot

**Container CVA (`connectionStatusVariants`)**:
```typescript
import { cva } from 'class-variance-authority';

export const connectionStatusVariants = cva(
  'inline-flex items-center gap-2 text-sm',
  {
    variants: {
      status: {
        connected: '',
        connecting: '',
        disconnected: '',
      },
    },
    defaultVariants: {
      status: 'connected',
    },
  },
);
```

The container variant maps are empty strings because all status-based styling is on the dot, not the container. The variant is included for structural consistency and to enable future container-level styling per status if needed.

**Dot CVA (`connectionStatusDotVariants`)**:
```typescript
export const connectionStatusDotVariants = cva(
  'size-2 rounded-full shrink-0',
  {
    variants: {
      status: {
        connected: 'bg-green-500 dark:bg-green-400',
        connecting: 'bg-yellow-500 dark:bg-yellow-400 animate-pulse',
        disconnected: 'bg-red-500 dark:bg-red-400',
      },
    },
    defaultVariants: {
      status: 'connected',
    },
  },
);
```

**Key logic**:
- Uses fixed Tailwind color utilities (`bg-green-500`, etc.) rather than semantic tokens because the semantic palette has no green/yellow/red mapping suitable for traffic-light indication (DD-5 from phase spec).
- `animate-pulse` is a built-in Tailwind utility — no custom keyframes needed.
- Dark mode adjustments use `dark:bg-green-400` etc. for proper contrast on dark backgrounds.

### 3.3 `connection-status.tsx`

**Purpose**: Main component implementation.

**Exports**:
- `ConnectionStatus` (named function export)
- `type ConnectionStatusProps` (re-exported from types file)

**Key logic**:

```typescript
import { cn } from '../../lib/utils.js';
import {
  connectionStatusDotVariants,
  connectionStatusVariants,
} from './connection-status.styles.js';
import type { ConnectionStatusProps } from './connection-status.types.js';

export type { ConnectionStatusProps } from './connection-status.types.js';

const defaultLabels: Record<ConnectionStatusProps['status'], string> = {
  connected: 'Connected',
  connecting: 'Connecting',
  disconnected: 'Disconnected',
};

export function ConnectionStatus({
  className,
  status,
  children,
  ref,
  ...props
}: ConnectionStatusProps) {
  return (
    <div
      data-slot="connection-status"
      role="status"
      aria-live="polite"
      className={cn(connectionStatusVariants({ status, className }))}
      ref={ref}
      {...props}
    >
      <span
        data-slot="connection-status-dot"
        className={cn(connectionStatusDotVariants({ status }))}
      />
      <span>{children ?? defaultLabels[status]}</span>
    </div>
  );
}
```

**Key implementation details**:
- `role="status"` makes the element a live region for screen readers.
- `aria-live="polite"` ensures changes are announced after the current speech queue.
- Default labels are looked up from a `Record` keyed by the `status` value.
- `children` overrides the default label when provided.
- `data-slot="connection-status"` on the root and `data-slot="connection-status-dot"` on the dot span.
- `className` merging is done via `cn()` and passed to the container CVA.
- No `asChild` support — Connection Status is not a leaf component that benefits from polymorphic rendering (it's a compound structure with a dot + label).

### 3.4 `connection-status.test.tsx`

**Purpose**: Comprehensive test suite.

**Test setup**:
- Import `{ render, screen }` from `@testing-library/react`
- Import `{ createRef }` from `react`
- Import `{ axe }` from `vitest-axe`
- Import `{ describe, expect, it }` from `vitest`

**Tests (11 total)**:

1. **Smoke render** — Renders without crashing; root element is in the document.
2. **`data-slot` on root** — Root has `data-slot="connection-status"`.
3. **`data-slot` on dot** — Dot span has `data-slot="connection-status-dot"`.
4. **Ref forwarding** — `createRef<HTMLDivElement>()` attached to root; `ref.current` is `HTMLDivElement`.
5. **className merging** — Custom class present alongside base `inline-flex` class.
6. **Default label: connected** — Renders text "Connected" when `status="connected"` and no children.
7. **Default label: connecting** — Renders text "Connecting" when `status="connecting"` and no children.
8. **Default label: disconnected** — Renders text "Disconnected" when `status="disconnected"` and no children.
9. **Custom label** — When `children="Online"` is provided, renders "Online" instead of the default label.
10. **Correct dot color classes** — For each status, assert the dot element has the correct `bg-*` class (`bg-green-500`, `bg-yellow-500`, `bg-red-500`).
11. **`animate-pulse` only on connecting** — Dot has `animate-pulse` class when `status="connecting"` and does NOT have it for `connected` or `disconnected`.
12. **ARIA attributes** — Root has `role="status"` and `aria-live="polite"`.
13. **Accessibility (vitest-axe)** — `axe(container)` reports no violations for each status.

**Pattern for querying the dot element**: Use `container.querySelector('[data-slot="connection-status-dot"]')`.

### 3.5 `connection-status.stories.tsx`

**Purpose**: Storybook documentation with CSF3 format.

**Meta**:
```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConnectionStatus } from './connection-status.js';

const meta: Meta<typeof ConnectionStatus> = {
  title: 'Components/ConnectionStatus',
  component: ConnectionStatus,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['connected', 'connecting', 'disconnected'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ConnectionStatus>;
```

**Stories (5)**:

1. **Connected** — `args: { status: 'connected' }`
2. **Connecting** — `args: { status: 'connecting' }`
3. **Disconnected** — `args: { status: 'disconnected' }`
4. **CustomLabel** — `args: { status: 'connected', children: 'Online' }`
5. **AllStates** — Render function showing all three states vertically stacked:
   ```typescript
   export const AllStates: Story = {
     render: () => (
       <div className="flex flex-col gap-4">
         <ConnectionStatus status="connected" />
         <ConnectionStatus status="connecting" />
         <ConnectionStatus status="disconnected" />
       </div>
     ),
   };
   ```

### 3.6 `packages/ui/src/index.ts` (modification)

**Purpose**: Add public API exports for Connection Status.

**Lines to add** (after the existing CodeBlock export on line 466):
```typescript
export {
  ConnectionStatus,
  type ConnectionStatusProps,
} from './components/connection-status/connection-status.js';
export {
  connectionStatusVariants,
  connectionStatusDotVariants,
} from './components/connection-status/connection-status.styles.js';
```

## 4. API Contracts

### Component Props

```typescript
type ConnectionStatusProps = React.ComponentProps<'div'> & {
  /** The current connection status. Determines dot color and default label. */
  status: 'connected' | 'connecting' | 'disconnected';
  /** Optional custom label. When omitted, shows "Connected", "Connecting", or "Disconnected". */
  children?: React.ReactNode;
};
```

### Usage Examples

**Default labels:**
```tsx
<ConnectionStatus status="connected" />     // green dot + "Connected"
<ConnectionStatus status="connecting" />     // yellow pulsing dot + "Connecting"
<ConnectionStatus status="disconnected" />   // red dot + "Disconnected"
```

**Custom label:**
```tsx
<ConnectionStatus status="connected">Online</ConnectionStatus>   // green dot + "Online"
```

**With additional HTML props:**
```tsx
<ConnectionStatus
  status="disconnected"
  className="mt-4"
  data-testid="ws-status"
>
  Server unreachable
</ConnectionStatus>
```

### CVA Exports

Consumers can use the exported variant functions to compose custom elements:

```tsx
import { connectionStatusDotVariants } from '@components/ui';
// Returns: "size-2 rounded-full shrink-0 bg-green-500 dark:bg-green-400"
connectionStatusDotVariants({ status: 'connected' });
```

## 5. Test Plan

### Test Setup

- **Framework**: Vitest + `@testing-library/react` + `vitest-axe`
- **File**: `packages/ui/src/components/connection-status/connection-status.test.tsx`
- **No mocks needed**: Connection Status has no browser API dependencies (unlike Copy to Clipboard)

### Per-Test Specification

| # | Test Name | Type | Description | Assertion |
|---|-----------|------|-------------|-----------|
| 1 | renders without crashing | Smoke | Render `<ConnectionStatus status="connected" />` | Root element exists in DOM |
| 2 | has data-slot attribute on root | Attribute | Render and query root element | `data-slot` equals `"connection-status"` |
| 3 | has data-slot attribute on dot | Attribute | Query dot span via `[data-slot="connection-status-dot"]` | Element exists and has correct `data-slot` |
| 4 | forwards ref | Ref | Attach `createRef<HTMLDivElement>()` via `ref` prop | `ref.current instanceof HTMLDivElement` |
| 5 | merges custom className | Style | Pass `className="custom-class"` | Element has both `custom-class` and `inline-flex` |
| 6 | renders default label for connected | Label | Render with `status="connected"` and no children | Text "Connected" is present |
| 7 | renders default label for connecting | Label | Render with `status="connecting"` and no children | Text "Connecting" is present |
| 8 | renders default label for disconnected | Label | Render with `status="disconnected"` and no children | Text "Disconnected" is present |
| 9 | renders custom label when children provided | Label | Render with `children="Online"` | Text "Online" is present; default label is not |
| 10 | applies correct color class for each status | Style | Render each status and query dot element | `bg-green-500` / `bg-yellow-500` / `bg-red-500` present on dot |
| 11 | applies animate-pulse only for connecting | Style | Render each status | Dot has `animate-pulse` only when `status="connecting"` |
| 12 | has role="status" and aria-live="polite" | A11y | Query root element | Both attributes present |
| 13 | has no accessibility violations | A11y/axe | Run `axe(container)` | `toHaveNoViolations()` |

## 6. Implementation Order

1. **`connection-status.styles.ts`** — Define `connectionStatusVariants` and `connectionStatusDotVariants` CVA exports. This is done first because the types file imports from it.
2. **`connection-status.types.ts`** — Define `ConnectionStatusProps` type with `VariantProps<typeof connectionStatusDotVariants>` integration. Depends on styles file for the CVA `typeof`.
3. **`connection-status.tsx`** — Implement the component. Depends on both styles and types files.
4. **`connection-status.test.tsx`** — Write the test suite. Depends on the component implementation.
5. **`connection-status.stories.tsx`** — Write the Storybook stories. Depends on the component implementation.
6. **`packages/ui/src/index.ts`** — Add exports for `ConnectionStatus`, `ConnectionStatusProps`, `connectionStatusVariants`, and `connectionStatusDotVariants`.

## 7. Verification Commands

```bash
# Run Connection Status tests only
pnpm --filter @components/ui test -- --run connection-status

# Run full test suite
pnpm test

# TypeScript type checking across the monorepo
pnpm typecheck

# Lint check
pnpm lint

# Verify Storybook builds without errors
pnpm --filter @components/docs build
```

## 8. Design Deviations

**Deviation 1: `VariantProps` integration on `connectionStatusDotVariants` instead of `connectionStatusVariants`**

- **Parent spec requires**: `ConnectionStatusProps` extending `VariantProps<typeof connectionStatusVariants>`.
- **Why problematic**: `connectionStatusVariants` has empty string values for all status variants — its `VariantProps` would yield `{ status?: 'connected' | 'connecting' | 'disconnected' | null | undefined }`, which is correct structurally but semantically misleading since the container variants do nothing. Using `connectionStatusDotVariants` is equivalent in type shape but more accurately reflects which CVA definition carries meaningful variant logic.
- **Alternative chosen**: Use `VariantProps<typeof connectionStatusDotVariants>` in the type definition. Both CVA definitions share the same `status` variant keys, so the resulting type is identical. The explicit `status: 'connected' | 'connecting' | 'disconnected'` declaration in the type intersection overrides the optionality from `VariantProps` regardless.

No other deviations needed. All other aspects follow the task spec, phase spec, and project conventions exactly.