Confirmed: Table and Pagination use static string constants in their styles files, and neither exports those constants from `index.ts` — only CVA `*Variants` functions are exported from index.ts. The feedback is correct: Avatar Group's static string constants should not be exported from index.ts.

Now I have all the information needed to produce the revised plan. Here it is:

# Task Plan: Avatar Group Component

## 1. Deliverables

| #   | File                                                               | Action | Purpose                                                                                    |
| --- | ------------------------------------------------------------------ | ------ | ------------------------------------------------------------------------------------------ |
| 1   | `packages/ui/src/components/avatar-group/avatar-group.types.ts`    | Create | Props type for AvatarGroup extending `React.ComponentProps<'div'>` with `{ max?: number }` |
| 2   | `packages/ui/src/components/avatar-group/avatar-group.styles.ts`   | Create | Static string constants for container and overflow indicator styles                        |
| 3   | `packages/ui/src/components/avatar-group/avatar-group.tsx`         | Create | Implementation of AvatarGroup with z-index stacking and +N overflow                        |
| 4   | `packages/ui/src/components/avatar-group/avatar-group.test.tsx`    | Create | Vitest + Testing Library + vitest-axe test suite                                           |
| 5   | `packages/ui/src/components/avatar-group/avatar-group.stories.tsx` | Create | Storybook CSF3 stories with `tags: ['autodocs']`                                           |
| 6   | `packages/ui/src/index.ts`                                         | Modify | Add AvatarGroup and AvatarGroupProps exports                                               |

## 2. Dependencies

### Prerequisites

- **Task t01 (Avatar)** — completed. Avatar, AvatarImage, AvatarFallback are implemented and exported from `packages/ui/src/index.ts`. The Avatar component and its sub-components are used in Avatar Group's stories and tests.

### Existing Dependencies Used

- `@components/utils` — `cn()` helper via `../../lib/utils.js`
- `react` — `React.Children.toArray` for child counting/slicing

### New Dependencies

None. Avatar Group is a pure layout component with no Radix or third-party dependency.

## 3. Implementation Details

### 3.1 `avatar-group.types.ts`

**Purpose**: Define the props type for AvatarGroup.

**Exports**:

- `AvatarGroupProps`

**Contract**:

```typescript
export type AvatarGroupProps = React.ComponentProps<'div'> & {
  max?: number;
};
```

- Extends `React.ComponentProps<'div'>` which includes `ref`, `className`, `children`, and all standard div attributes in React 19.
- `max` is optional. When `undefined`, all children are rendered. When a number, only the first `max` children are rendered and a `+N` overflow indicator is appended.
- No `size` prop — overflow indicator uses fixed `md` dimensions (h-10 w-10).
- No `asChild` prop — Avatar Group is a layout container, not a leaf element.

### 3.2 `avatar-group.styles.ts`

**Purpose**: Static string constants for the container and overflow indicator.

**Exports**:

- `avatarGroupStyles` — container styles
- `avatarGroupOverflowStyles` — overflow indicator styles

**Values**:

```typescript
export const avatarGroupStyles = 'flex items-center -space-x-3';

export const avatarGroupOverflowStyles =
  'relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium text-muted-foreground';
```

**Key decisions**:

- `-space-x-3` creates the overlapping effect via negative left margins on all children after the first. This is a Tailwind utility that applies `-margin-left: 0.75rem` to adjacent siblings.
- Overflow indicator dimensions hardcoded to `h-10 w-10` matching Avatar's default `md` size.
- Overflow indicator uses `border-2 border-background` to create a visual separator ring matching how avatars typically appear in stacked layouts.
- `relative` on overflow indicator enables z-index stacking consistent with the avatar wrappers.
- No CVA — single visual treatment, static constants only (matching Table/Pagination pattern).

### 3.3 `avatar-group.tsx`

**Purpose**: Implementation of the AvatarGroup component.

**Exports**:

- `AvatarGroup` (function component)
- `type AvatarGroupProps` (re-export from types)

**Key logic**:

```typescript
import { Children } from 'react';

import { cn } from '../../lib/utils.js';
import { avatarGroupOverflowStyles, avatarGroupStyles } from './avatar-group.styles.js';
import type { AvatarGroupProps } from './avatar-group.types.js';

export type { AvatarGroupProps } from './avatar-group.types.js';

export function AvatarGroup({
  className,
  children,
  max,
  ref,
  ...props
}: AvatarGroupProps): React.JSX.Element {
  const childArray = Children.toArray(children);
  const total = childArray.length;
  const visible = max !== undefined && max < total ? childArray.slice(0, max) : childArray;
  const overflowCount = max !== undefined && max < total ? total - max : 0;

  return (
    <div data-slot="avatar-group" className={cn(avatarGroupStyles, className)} ref={ref} {...props}>
      {visible.map((child, index) => (
        <div key={index} className="relative" style={{ zIndex: total - index }}>
          {child}
        </div>
      ))}
      {overflowCount > 0 && (
        <div className={avatarGroupOverflowStyles} style={{ zIndex: 0 }}>
          +{overflowCount}
        </div>
      )}
    </div>
  );
}
```

**Implementation notes**:

- `React.Children.toArray` normalizes children into a flat array, filtering out `null`/`undefined`/`boolean` values. This provides a reliable `length` for computing overflow.
- Each visible child is wrapped in a `<div className="relative">` with inline `style={{ zIndex: total - index }}`. First child gets highest z-index (`total`), last visible child gets z-index `1`. This creates right-to-left stacking where the first avatar is visually on top.
- Inline `style` for z-index is necessary because Tailwind z-index utilities are limited to preset values and dynamic values require arbitrary value syntax (`z-[N]`) which cannot be computed at runtime. Inline style is the correct approach here — this is a dynamic value, not a static styling decision.
- The overflow indicator gets `zIndex: 0`, placing it behind all avatars.
- The wrapper `<div>` uses `key={index}` since children are sliced from an array and their identity is positional. Using `index` as key is acceptable here because the list is not reordered — it's always the first N children.

### 3.4 `avatar-group.test.tsx`

**Purpose**: Test suite for AvatarGroup.

**Imports**: `render`, `screen` from `@testing-library/react`, `axe` from `vitest-axe`, `describe`/`expect`/`it` from `vitest`, `createRef` from `react`, `Avatar`/`AvatarFallback` from the sibling avatar component.

**Tests** (10 total):

1. **Smoke render** — Renders 3 Avatar children. Assert all 3 fallback texts are visible.
2. **Renders all avatars when no `max` prop** — Renders 5 Avatar children without `max`. Assert all 5 are in the document.
3. **Limits visible avatars to `max` and shows overflow** — Renders 5 Avatars with `max={3}`. Assert first 3 fallbacks are visible, last 2 are not, and `+2` text is in the document.
4. **Overflow indicator displays correct count** — Renders 10 Avatars with `max={4}`. Assert `+6` text is present.
5. **No overflow when `max` >= children count** — Renders 3 Avatars with `max={5}`. Assert all 3 visible, no `+N` text present.
6. **z-index ordering (first child has highest)** — Renders 3 Avatars. Query the wrapper divs inside the `data-slot="avatar-group"` container. Assert first wrapper's `style.zIndex` is `3`, second is `2`, third is `1`.
7. **`data-slot="avatar-group"` attribute** — Render and assert root element has `data-slot="avatar-group"`.
8. **className merging** — Render with `className="custom-class"`. Assert root has both `custom-class` and base styles (`flex`, `items-center`).
9. **ref forwarding** — Create a ref via `createRef<HTMLDivElement>()`, pass to AvatarGroup, assert `ref.current` is an `HTMLDivElement` with `data-slot="avatar-group"`.
10. **Accessibility** — Render a composed AvatarGroup and assert `axe(container)` has no violations.

**Helper pattern**: Each test renders `<Avatar><AvatarFallback>XX</AvatarFallback></Avatar>` children with unique initials (A1, A2, A3, etc.) to enable targeted queries via `screen.getByText()` / `screen.queryByText()`.

### 3.5 `avatar-group.stories.tsx`

**Purpose**: Storybook CSF3 stories for documentation and visual testing.

**Meta**:

```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Avatar, AvatarFallback, AvatarImage } from '../avatar/avatar.js';
import { AvatarGroup } from './avatar-group.js';

const meta: Meta<typeof AvatarGroup> = {
  title: 'Components/AvatarGroup',
  component: AvatarGroup,
  tags: ['autodocs'],
  argTypes: {
    max: {
      control: 'number',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;
```

**Stories** (5):

1. **Default** — 3 Avatars with fallback initials, no `max`.
2. **MaxOverflow** — 6 Avatars with `max={3}`, showing +3 overflow indicator.
3. **AllVisible** — 4 Avatars with no `max` prop, all visible.
4. **SingleAvatar** — 1 Avatar, edge case demonstrating no overlap.
5. **ManyAvatars** — 10 Avatars with `max={5}`, showing +5 overflow indicator.

Each story renders `<Avatar>` children with a mix of `AvatarImage` (using placeholder URLs) and `AvatarFallback` initials.

### 3.6 `index.ts` Modification

Append to the end of `packages/ui/src/index.ts`:

```typescript
export { AvatarGroup, type AvatarGroupProps } from './components/avatar-group/avatar-group.js';
```

This exports only the component and its type. The static string constants (`avatarGroupStyles`, `avatarGroupOverflowStyles`) are **not** exported from `index.ts`, matching the established codebase convention: only CVA `*Variants` functions are exported from the public API, never static string style constants. Table, Pagination, and all other components that use static strings follow this same pattern — their style constants are internal implementation details, not public API. Consumers who need to customize Avatar Group's appearance use `className` merging via `cn()`, not direct style constant imports.

## 4. API Contracts

### AvatarGroup Props

```typescript
type AvatarGroupProps = React.ComponentProps<'div'> & {
  max?: number; // Maximum visible avatars. When exceeded, a +N indicator is shown.
};
```

### Usage Example

```tsx
import { Avatar, AvatarFallback, AvatarImage, AvatarGroup } from '@components/ui';

// Basic — all avatars visible
<AvatarGroup>
  <Avatar><AvatarImage src="/alice.jpg" alt="Alice" /><AvatarFallback>AL</AvatarFallback></Avatar>
  <Avatar><AvatarImage src="/bob.jpg" alt="Bob" /><AvatarFallback>BO</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>CD</AvatarFallback></Avatar>
</AvatarGroup>

// With overflow — shows first 3 + "+2" indicator
<AvatarGroup max={3}>
  <Avatar><AvatarFallback>A1</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>A2</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>A3</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>A4</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>A5</AvatarFallback></Avatar>
</AvatarGroup>
```

### Rendered HTML Structure

```html
<div data-slot="avatar-group" class="flex items-center -space-x-3">
  <div class="relative" style="z-index: 5"><!-- Avatar 1 --></div>
  <div class="relative" style="z-index: 4"><!-- Avatar 2 --></div>
  <div class="relative" style="z-index: 3"><!-- Avatar 3 --></div>
  <div class="relative flex h-10 w-10 ..." style="z-index: 0">+2</div>
</div>
```

## 5. Test Plan

### Test Setup

- **Framework**: Vitest + `@testing-library/react` + `vitest-axe`
- **Imports**: `render`, `screen` from `@testing-library/react`; `axe` from `vitest-axe`; `describe`, `expect`, `it` from `vitest`; `createRef` from `react`
- **Avatar dependency**: Tests import `Avatar` and `AvatarFallback` from `../avatar/avatar.js` to render real Avatar children

### Per-Test Specification

| #   | Test Name                                        | Setup                                                                            | Assertion                                                                                                                                      |
| --- | ------------------------------------------------ | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | renders multiple avatars                         | Render AvatarGroup with 3 `<Avatar><AvatarFallback>` children ("A1", "A2", "A3") | `screen.getByText('A1')`, `getByText('A2')`, `getByText('A3')` all `toBeInTheDocument()`                                                       |
| 2   | renders all avatars when no max prop             | Render 5 Avatars without `max`                                                   | All 5 fallback texts visible, no `+N` text present (`queryByText(/^\+\d+$/)` returns null)                                                     |
| 3   | limits visible avatars to max and shows overflow | Render 5 Avatars with `max={3}`                                                  | `getByText('A1')`, `getByText('A2')`, `getByText('A3')` visible; `queryByText('A4')` null; `queryByText('A5')` null; `getByText('+2')` present |
| 4   | overflow indicator displays correct count        | Render 10 Avatars with `max={4}`                                                 | `getByText('+6')` present                                                                                                                      |
| 5   | no overflow when max >= children count           | Render 3 Avatars with `max={5}`                                                  | All 3 visible, `queryByText(/^\+\d+$/)` null                                                                                                   |
| 6   | first child has highest z-index                  | Render 3 Avatars                                                                 | Query all direct children of `[data-slot="avatar-group"]`. First child's `style.zIndex` is `'3'`, second is `'2'`, third is `'1'`              |
| 7   | has data-slot="avatar-group"                     | Render AvatarGroup                                                               | `container.querySelector('[data-slot="avatar-group"]')` is in the document                                                                     |
| 8   | merges custom className                          | Render with `className="custom-class"`                                           | Root element has both `custom-class` and `flex` and `items-center` classes                                                                     |
| 9   | forwards ref                                     | Render with `ref={createRef<HTMLDivElement>()}`                                  | `ref.current` is `HTMLDivElement`, has `data-slot="avatar-group"`                                                                              |
| 10  | has no accessibility violations                  | Render composed AvatarGroup with 3 Avatars                                       | `await axe(container)` has no violations                                                                                                       |

## 6. Implementation Order

1. **`avatar-group.types.ts`** — Define `AvatarGroupProps` type. No dependencies.
2. **`avatar-group.styles.ts`** — Define `avatarGroupStyles` and `avatarGroupOverflowStyles` constants. No dependencies.
3. **`avatar-group.tsx`** — Implement `AvatarGroup` component. Depends on types and styles files.
4. **`avatar-group.test.tsx`** — Write test suite. Depends on the implementation and the Avatar component from t01.
5. **`avatar-group.stories.tsx`** — Write Storybook stories. Depends on the implementation and the Avatar component from t01.
6. **`packages/ui/src/index.ts`** — Add AvatarGroup and AvatarGroupProps exports. Depends on implementation file.

## 7. Verification Commands

```bash
# Run Avatar Group tests only
pnpm --filter @components/ui test -- --run src/components/avatar-group/avatar-group.test.tsx

# Run all tests to verify no regressions
pnpm test

# TypeScript type checking
pnpm typecheck

# ESLint
pnpm lint

# Build the package to verify exports compile
pnpm build
```

## 8. Design Deviations

### Inline `style` for z-index instead of Tailwind classes

- **Convention**: Root AGENTS.md states "Never use inline styles instead of Tailwind classes."
- **Deviation**: Each avatar wrapper uses inline `style={{ zIndex: total - index }}` for dynamic z-index values.
- **Technical justification**: Z-index values are dynamically computed from the child count at render time. Tailwind's z-index utilities (`z-10`, `z-20`, etc.) use preset values, and arbitrary value syntax (`z-[N]`) cannot accept runtime-computed values in JSX — Tailwind classes are resolved at build time, not runtime. Inline style is the only viable approach for dynamic z-index values. This is consistent with how Radix UI components handle dynamic positioning. The static overlap styling (`-space-x-3`) correctly uses Tailwind utilities; only the dynamic z-index values require inline style.
- **Scope**: Limited to the z-index property on avatar wrapper divs and the overflow indicator. All other styling uses Tailwind classes.

### No style constant exports from `index.ts`

- **Task spec states**: "Export AvatarGroup, its type, and style constants from `packages/ui/src/index.ts`."
- **Deviation**: Only `AvatarGroup` and `type AvatarGroupProps` are exported from `index.ts`. The static string constants (`avatarGroupStyles`, `avatarGroupOverflowStyles`) are not exported.
- **Technical justification**: The established codebase convention — verified across every component in `index.ts` (Table, Pagination, Card, Skeleton, and all others) — only exports CVA `*Variants` functions from the public API, never static string style constants. The MASTER_PLAN.md section 3.5 explicitly confirms this: "CVA variant functions (e.g., `buttonVariants`) are also exported so consumers can compose variants." Static string constants are internal implementation details. Table and Pagination both use static string constants in their `.styles.ts` files but do not export them from `index.ts`. Avatar Group follows the same pattern. Consumers who need to customize appearance use `className` merging via `cn()`, which is the standard customization mechanism for all components.
