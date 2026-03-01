I have all the context needed from the codebase. Let me now produce the implementation plan.

## 1. Deliverables

| File                                                             | Action | Purpose                                                                                                                                         |
| ---------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/ui/src/components/collapsible/collapsible.types.ts`    | Create | TypeScript props types for `Collapsible`, `CollapsibleTrigger`, and `CollapsibleContent` extending Radix primitives                             |
| `packages/ui/src/components/collapsible/collapsible.styles.ts`   | Create | Const string exports for sub-component styles (trigger: empty, content: animate-in/out)                                                         |
| `packages/ui/src/components/collapsible/collapsible.tsx`         | Create | Implementation wrapping `@radix-ui/react-collapsible` with three named exports                                                                  |
| `packages/ui/src/components/collapsible/collapsible.test.tsx`    | Create | Vitest + Testing Library + vitest-axe tests covering smoke, interactions, controlled/uncontrolled, keyboard, data-slot, className merging, a11y |
| `packages/ui/src/components/collapsible/collapsible.stories.tsx` | Create | Storybook CSF3 stories with autodocs: Default, DefaultOpen, Controlled, WithMultipleItems, Animated                                             |
| `packages/ui/src/index.ts`                                       | Modify | Add exports for `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`, and all associated types                                             |

## 2. Dependencies

### Already installed (Task t00 completed)

- `@radix-ui/react-collapsible` — already added to `packages/ui/package.json` dependencies (version `^1.1.0`)
- `tailwindcss-animate` — already in dependencies (version `^1.0.7`), provides `animate-in`, `animate-out`, `slide-in-from-top-0`, `slide-out-to-top-0` utilities

### Pre-existing

- `@components/utils` — `cn()` helper (clsx + tailwind-merge)
- `class-variance-authority` — not directly used by Collapsible (const string pattern), but available
- Vitest + Testing Library + vitest-axe — test infrastructure
- Storybook 8.5 — documentation infrastructure

No new packages need to be installed.

## 3. Implementation Details

### 3.1 `collapsible.types.ts`

**Purpose**: Define TypeScript prop types for all three sub-components.

**Exports**:

- `CollapsibleProps` — `React.ComponentProps<typeof CollapsiblePrimitive.Root>`
- `CollapsibleTriggerProps` — `React.ComponentProps<typeof CollapsiblePrimitive.Trigger>`
- `CollapsibleContentProps` — `React.ComponentProps<typeof CollapsiblePrimitive.Content>`

**Pattern**: Follows `dialog.types.ts` exactly — `import type * as CollapsiblePrimitive` then derive component props using `React.ComponentProps<typeof ...>`. No CVA `VariantProps` intersection since Collapsible uses const string styles, not CVA.

```typescript
import type * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

export type CollapsibleProps = React.ComponentProps<typeof CollapsiblePrimitive.Root>;

export type CollapsibleTriggerProps = React.ComponentProps<typeof CollapsiblePrimitive.Trigger>;

export type CollapsibleContentProps = React.ComponentProps<typeof CollapsiblePrimitive.Content>;
```

### 3.2 `collapsible.styles.ts`

**Purpose**: Define const string style exports for each sub-component (same pattern as `dialog.styles.ts`).

**Exports**:

- `collapsibleTriggerStyles` — empty string `''` (trigger has no default styling; consumers provide their own button/text styling)
- `collapsibleContentStyles` — `'overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-top-0 data-[state=closed]:slide-out-to-top-0'`

The content styles use `tailwindcss-animate` built-in utilities triggered by Radix's `data-[state=open]` / `data-[state=closed]` attributes. `overflow-hidden` prevents content from visually leaking during animation.

```typescript
export const collapsibleTriggerStyles = '';

export const collapsibleContentStyles =
  'overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-top-0 data-[state=closed]:slide-out-to-top-0';
```

### 3.3 `collapsible.tsx`

**Purpose**: Implementation wrapping `@radix-ui/react-collapsible` with three named exports.

**Exports**:

- `Collapsible` — bare re-export of `CollapsiblePrimitive.Root` (same pattern as `Dialog = DialogPrimitive.Root`). No `data-slot` because Root is a logical provider that renders no visible DOM element.
- `CollapsibleTrigger` — function component wrapping `CollapsiblePrimitive.Trigger` with `data-slot="collapsible-trigger"`, `cn()` className merging using `collapsibleTriggerStyles`, and ref-as-prop.
- `CollapsibleContent` — function component wrapping `CollapsiblePrimitive.Content` with `data-slot="collapsible-content"`, `cn()` className merging using `collapsibleContentStyles`, and ref-as-prop.

**Pattern**: Follows the Dialog implementation. Each wrapper function destructures `{ className, ref, ...props }`, applies `data-slot`, merges styles via `cn(constStyles, className)`, passes `ref` and spread `...props`.

```typescript
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

import { cn } from '../../lib/utils.js';
import { collapsibleContentStyles, collapsibleTriggerStyles } from './collapsible.styles.js';
import type { CollapsibleContentProps, CollapsibleTriggerProps } from './collapsible.types.js';

export type {
  CollapsibleContentProps,
  CollapsibleProps,
  CollapsibleTriggerProps,
} from './collapsible.types.js';

export const Collapsible = CollapsiblePrimitive.Root;

export function CollapsibleTrigger({
  className,
  ref,
  ...props
}: CollapsibleTriggerProps): React.JSX.Element {
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapsible-trigger"
      className={cn(collapsibleTriggerStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function CollapsibleContent({
  className,
  ref,
  ...props
}: CollapsibleContentProps): React.JSX.Element {
  return (
    <CollapsiblePrimitive.Content
      data-slot="collapsible-content"
      className={cn(collapsibleContentStyles, className)}
      ref={ref}
      {...props}
    />
  );
}
```

### 3.4 `collapsible.test.tsx`

**Purpose**: Comprehensive test suite covering all specified test categories.

**Test helper**: A `TestCollapsible` helper component (similar to Dialog's `TestDialog`) renders a complete Collapsible with trigger and content, accepting optional `open`, `defaultOpen`, `onOpenChange`, and `classNames` props.

**Tests** (8 test cases):

1. **Smoke render (collapsed by default)** — renders trigger, content is not visible
2. **Toggles content on trigger click** — click trigger → content appears, click again → content disappears
3. **`defaultOpen` renders content visible initially** — content is in the DOM and visible when `defaultOpen={true}`
4. **Controlled mode** — `open={true}` shows content, trigger click fires `onOpenChange(false)`
5. **Keyboard activation (Enter/Space)** — focus trigger, press Enter → content appears; press Space → content disappears
6. **`data-slot` attributes** — `collapsible-trigger` on trigger, `collapsible-content` on content
7. **Custom className merging** — custom classes are applied alongside default styles on trigger and content
8. **Accessibility (vitest-axe)** — no a11y violations on the expanded collapsible

**Imports**: `render`, `screen` from `@testing-library/react`; `userEvent` from `@testing-library/user-event`; `axe` from `vitest-axe`; `describe`, `expect`, `it`, `vi` from `vitest`.

### 3.5 `collapsible.stories.tsx`

**Purpose**: Storybook documentation with interactive examples.

**Meta**: `title: 'Components/Collapsible'`, `component: Collapsible`, `tags: ['autodocs']`.

**Stories**:

1. **Default** — Collapsed initially. Shows a trigger button ("Toggle") and hidden content paragraph.
2. **DefaultOpen** — Pre-expanded via `defaultOpen={true}`. Content is visible on load.
3. **Controlled** — Uses `useState` hook to control `open` state externally, with an additional "Toggle externally" button outside the Collapsible.
4. **WithMultipleItems** — A list of items inside CollapsibleContent, showing the expand pattern (e.g., a header with "Show more" that reveals additional list items).
5. **Animated** — Same as Default but with a note in the description that animation is applied by default via the content styles.

**Imports**: `useState` from `react`; `Meta`, `StoryObj` from `@storybook/react-vite`; `Button` from `../button/button.js`; `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent` from `./collapsible.js`.

### 3.6 `index.ts` modification

**Purpose**: Export all Collapsible components and types from the public API.

**Addition** (appended after the last existing export):

```typescript
export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  type CollapsibleProps,
  type CollapsibleTriggerProps,
  type CollapsibleContentProps,
} from './components/collapsible/collapsible.js';
```

Style const strings (`collapsibleTriggerStyles`, `collapsibleContentStyles`) are NOT exported — they are internal implementation details, consistent with how Dialog's style strings are not exported.

## 4. API Contracts

### Component API

```typescript
// Collapsible (Root) — bare Radix re-export
<Collapsible
  open?: boolean              // Controlled open state
  defaultOpen?: boolean       // Uncontrolled initial state (default: false)
  onOpenChange?: (open: boolean) => void  // Called when state changes
  disabled?: boolean          // Disable open/close toggling
>
  {children}
</Collapsible>

// CollapsibleTrigger
<CollapsibleTrigger
  className?: string          // Merged with (empty) default styles
  ref?: React.Ref<HTMLButtonElement>
  asChild?: boolean           // Render as child element (Radix built-in)
  // ...all button HTML attributes
>
  {children}
</CollapsibleTrigger>

// CollapsibleContent
<CollapsibleContent
  className?: string          // Merged with animation styles
  ref?: React.Ref<HTMLDivElement>
  forceMount?: true           // Keep in DOM even when closed (Radix built-in)
  asChild?: boolean           // Render as child element (Radix built-in)
  // ...all div HTML attributes
>
  {children}
</CollapsibleContent>
```

### Usage Example

```tsx
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@components/ui';

function Example() {
  return (
    <Collapsible>
      <CollapsibleTrigger>Toggle</CollapsibleTrigger>
      <CollapsibleContent>
        <p>This content can be collapsed.</p>
      </CollapsibleContent>
    </Collapsible>
  );
}
```

### Controlled Usage Example

```tsx
import { useState } from 'react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@components/ui';

function ControlledExample() {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger>{open ? 'Collapse' : 'Expand'}</CollapsibleTrigger>
      <CollapsibleContent>
        <p>Controlled collapsible content.</p>
      </CollapsibleContent>
    </Collapsible>
  );
}
```

## 5. Test Plan

### Test Setup

- **Framework**: Vitest + jsdom
- **Rendering**: `@testing-library/react` (`render`, `screen`, `waitFor`)
- **Interactions**: `@testing-library/user-event` (`userEvent.setup()`)
- **Accessibility**: `vitest-axe` (`axe` function + `toHaveNoViolations` matcher)
- **Mocking**: `vi.fn()` for `onOpenChange` callback verification
- **Imports from Vitest**: `describe`, `expect`, `it`, `vi`

### Helper Component

```typescript
function TestCollapsible({
  open,
  defaultOpen,
  onOpenChange,
  triggerClassName,
  contentClassName,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerClassName?: string;
  contentClassName?: string;
}): React.JSX.Element {
  return (
    <Collapsible open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger className={triggerClassName}>Toggle</CollapsibleTrigger>
      <CollapsibleContent className={contentClassName}>
        <p>Collapsible content</p>
      </CollapsibleContent>
    </Collapsible>
  );
}
```

### Per-Test Specification

| #   | Test Name                                     | Setup                                                                                                         | Action                                 | Assertion                                                                                                                                                           |
| --- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | renders trigger (collapsed by default)        | `render(<TestCollapsible />)`                                                                                 | None                                   | `screen.getByRole('button', { name: 'Toggle' })` is in document; `screen.queryByText('Collapsible content')` is not visible (hidden by Radix `data-state="closed"`) |
| 2   | toggles content visibility on trigger click   | `render(<TestCollapsible />)`                                                                                 | Click trigger twice                    | After first click: `screen.getByText('Collapsible content')` is visible. After second click: content is hidden again                                                |
| 3   | defaultOpen renders content visible initially | `render(<TestCollapsible defaultOpen />)`                                                                     | None                                   | `screen.getByText('Collapsible content')` is in document and visible                                                                                                |
| 4   | controlled mode (open/onOpenChange)           | `render(<TestCollapsible open onOpenChange={vi.fn()} />)`                                                     | Click trigger                          | Content is visible. `onOpenChange` was called with `false`                                                                                                          |
| 5   | keyboard activation (Enter/Space)             | `render(<TestCollapsible />)`                                                                                 | Focus trigger, press Enter, then Space | After Enter: content is visible. After Space: content is hidden                                                                                                     |
| 6   | data-slot on trigger and content              | `render(<TestCollapsible defaultOpen />)`                                                                     | None                                   | `document.querySelector('[data-slot="collapsible-trigger"]')` is in document; `document.querySelector('[data-slot="collapsible-content"]')` is in document          |
| 7   | custom className merging                      | `render(<TestCollapsible defaultOpen triggerClassName="custom-trigger" contentClassName="custom-content" />)` | None                                   | Trigger has class `custom-trigger`; Content has class `custom-content` and also has `overflow-hidden` from default styles                                           |
| 8   | no accessibility violations                   | `render(<TestCollapsible defaultOpen />)`                                                                     | `await axe(container)`                 | `expect(results).toHaveNoViolations()`                                                                                                                              |

## 6. Implementation Order

1. **`collapsible.types.ts`** — Define all three prop types. No dependencies on other Collapsible files.
2. **`collapsible.styles.ts`** — Define const string style exports. No dependencies on other Collapsible files.
3. **`collapsible.tsx`** — Implement the three component exports. Depends on types and styles files.
4. **`collapsible.test.tsx`** — Write all 8 tests. Depends on the implementation file.
5. **`collapsible.stories.tsx`** — Write all 5 stories. Depends on the implementation file and Button component.
6. **`packages/ui/src/index.ts`** — Add Collapsible exports. Depends on the implementation file.

## 7. Verification Commands

```bash
# Run Collapsible tests only
pnpm --filter @components/ui test -- collapsible

# Run all tests in the ui package
pnpm --filter @components/ui test

# TypeScript type checking across the monorepo
pnpm typecheck

# Verify the build succeeds
pnpm --filter @components/ui build

# Launch Storybook to visually verify (manual)
pnpm storybook
```

## 8. Design Deviations

None.

The task spec and phase spec prescribe a technically sound approach that is fully consistent with the existing codebase patterns established by Dialog (bare re-export for Root, const string styles, compound component pattern, data-slot on rendered sub-components only). No deviations are needed.
