I now have all the context needed. Let me produce the implementation plan.

## 1. Deliverables

| #   | File                                                           | Action | Purpose                                                                              |
| --- | -------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------ |
| 1   | `packages/ui/src/components/hover-card/hover-card.types.ts`    | Create | Props types for HoverCard, HoverCardTrigger, and HoverCardContent                    |
| 2   | `packages/ui/src/components/hover-card/hover-card.styles.ts`   | Create | Static string constant `hoverCardContentStyles` for HoverCardContent styling         |
| 3   | `packages/ui/src/components/hover-card/hover-card.tsx`         | Create | Implementation: re-export for Root, function wrappers for Trigger and Content        |
| 4   | `packages/ui/src/components/hover-card/hover-card.test.tsx`    | Create | Vitest + Testing Library + vitest-axe test suite                                     |
| 5   | `packages/ui/src/components/hover-card/hover-card.stories.tsx` | Create | Storybook CSF3 stories with `tags: ['autodocs']`                                     |
| 6   | `packages/ui/src/index.ts`                                     | Modify | Add HoverCard, HoverCardTrigger, HoverCardContent, and their types to public exports |
| 7   | `packages/ui/package.json`                                     | Modify | Add `@radix-ui/react-hover-card` dependency                                          |

## 2. Dependencies

### New Dependencies

- `@radix-ui/react-hover-card` — Radix Hover Card primitive. Install in `packages/ui/package.json` under `dependencies`.

### Existing Dependencies Used

- `@radix-ui/react-slot` — already installed (used indirectly via Radix HoverCard Trigger's `asChild` support)
- `@components/utils` — `cn()` helper for className merging
- `class-variance-authority` — not needed (no CVA variants for this component)

### Sibling Task Dependencies

- Task t01 (Avatar) — completed. Avatar is used in HoverCard stories (WithAvatar story).
- Task t03 (Tooltip) — completed. Tooltip establishes the overlay component pattern this task follows.
- No blocking dependency on t02 (AvatarGroup) or t05 (Progress).

## 3. Implementation Details

### 3.1 `hover-card.types.ts`

**Purpose**: Define TypeScript prop types for all three HoverCard sub-components.

**Exports**:

- `HoverCardProps` — extends `React.ComponentProps<typeof HoverCardPrimitive.Root>`
- `HoverCardTriggerProps` — extends `React.ComponentProps<typeof HoverCardPrimitive.Trigger>`
- `HoverCardContentProps` — extends `React.ComponentProps<typeof HoverCardPrimitive.Content>`

**Pattern**: Follows the exact same pattern as `popover.types.ts` and `tooltip.types.ts` — uses `import type * as HoverCardPrimitive from '@radix-ui/react-hover-card'` and derives prop types from Radix primitive component types. No additional custom props are needed beyond what Radix provides.

**Implementation**:

```typescript
import type * as HoverCardPrimitive from '@radix-ui/react-hover-card';

export type HoverCardProps = React.ComponentProps<typeof HoverCardPrimitive.Root>;

export type HoverCardTriggerProps = React.ComponentProps<typeof HoverCardPrimitive.Trigger>;

export type HoverCardContentProps = React.ComponentProps<typeof HoverCardPrimitive.Content>;
```

### 3.2 `hover-card.styles.ts`

**Purpose**: Define the static style string for HoverCardContent.

**Exports**:

- `hoverCardContentStyles` — static string constant

**Key Details**:

- Uses `w-64` (256px) instead of Popover's `w-72` (288px) — slightly narrower since hover cards show preview content, not interactive forms
- Uses the same animation classes as Popover and Tooltip (`data-[state=open]:animate-in`, `data-[state=closed]:animate-out`, etc.) for consistent enter/exit animations
- Uses `bg-popover text-popover-foreground` semantic tokens matching the overlay visual language
- Includes `outline-none` to prevent focus outline on the content container (matches Popover pattern)

**Implementation**:

```typescript
export const hoverCardContentStyles =
  'z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2';
```

### 3.3 `hover-card.tsx`

**Purpose**: Implement the three HoverCard exports following the Popover/Tooltip overlay pattern.

**Exports**:

- `HoverCard` — re-export of `HoverCardPrimitive.Root` (assigned to `const`, same as Popover and Tooltip)
- `HoverCardTrigger` — function component wrapping `HoverCardPrimitive.Trigger` with `data-slot="hover-card-trigger"` and className pass-through
- `HoverCardContent` — function component wrapping `HoverCardPrimitive.Portal` > `HoverCardPrimitive.Content` with `data-slot="hover-card-content"`, `align="center"` default, `sideOffset={4}` default, and styles merged via `cn()`

**Type re-exports**: Re-exports all three prop types from the types file (following the established pattern where `.tsx` files re-export types).

**Pattern**: Mirrors `popover.tsx` exactly — HoverCard is structurally identical to Popover but triggered by hover instead of click (Radix handles this behavioral difference internally).

**Implementation**:

```typescript
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';

import { cn } from '../../lib/utils.js';
import { hoverCardContentStyles } from './hover-card.styles.js';
import type { HoverCardContentProps, HoverCardTriggerProps } from './hover-card.types.js';

export type {
  HoverCardContentProps,
  HoverCardProps,
  HoverCardTriggerProps,
} from './hover-card.types.js';

export const HoverCard = HoverCardPrimitive.Root;

export function HoverCardTrigger({
  className,
  ref,
  ...props
}: HoverCardTriggerProps): React.JSX.Element {
  return (
    <HoverCardPrimitive.Trigger
      data-slot="hover-card-trigger"
      className={className}
      ref={ref}
      {...props}
    />
  );
}

export function HoverCardContent({
  className,
  align = 'center',
  sideOffset = 4,
  ref,
  ...props
}: HoverCardContentProps): React.JSX.Element {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(hoverCardContentStyles, className)}
        ref={ref}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}
```

### 3.4 `hover-card.test.tsx`

**Purpose**: Comprehensive test suite covering smoke rendering, hover interaction, dismissal, data-slot attributes, className merging, default prop values, ref forwarding, and accessibility.

**Test Helper**: A `TestHoverCard` wrapper component (same pattern as `TestPopover` and `TestTooltip`) that accepts optional `contentClassName`, `triggerClassName`, `align`, `sideOffset`, and `openDelay` props.

**Hover Behavior Note**: `@radix-ui/react-hover-card` uses `pointerenter`/`pointerleave` events. Tests use `userEvent.hover()` / `userEvent.unhover()` with `waitFor` to handle the asynchronous open delay (Radix HoverCard has a default 700ms open delay). The test helper sets `openDelay={0}` by default to make tests deterministic without fake timers.

**Tests**:

1. **`renders trigger`** — Renders `TestHoverCard`, asserts the trigger link is in the document.
2. **`content is hidden by default`** — Asserts hover card content text is not in the document before interaction.
3. **`shows on hover`** — Uses `userEvent.hover()` on the trigger, then `waitFor` to assert content appears.
4. **`hides on pointer leave`** — Hovers to open, then `userEvent.unhover()`, asserts content disappears via `waitFor`.
5. **`has data-slot on trigger`** — Asserts `data-slot="hover-card-trigger"` on the trigger element.
6. **`has data-slot on content`** — Hovers to open, asserts `data-slot="hover-card-content"` on the content element.
7. **`merges custom className on content`** — Passes `contentClassName="custom-class"`, hovers to open, asserts both the custom class and base styles (e.g., `rounded-md`) are present.
8. **`merges custom className on trigger`** — Passes `triggerClassName="custom-trigger"`, asserts it's applied on the trigger.
9. **`renders rich content`** — Hovers to open, asserts rich HTML content (heading, paragraph) renders inside the hover card.
10. **`forwards ref to HoverCardContent`** — Uses `createRef<HTMLDivElement>()`, renders with `defaultOpen`, asserts `ref.current` is an `HTMLDivElement` with `data-slot="hover-card-content"`.
11. **`has no accessibility violations`** — Hovers to open, runs `axe(document.body)`, asserts no violations.

### 3.5 `hover-card.stories.tsx`

**Purpose**: Storybook CSF3 stories demonstrating all HoverCard usage patterns.

**Meta Configuration**:

```typescript
const meta: Meta<typeof HoverCard> = {
  title: 'Components/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
};
```

**Stories**:

1. **`Default`** — HoverCard triggered by hovering an anchor link (`<a>`). Content shows a user profile preview with name, handle, and bio text. The trigger uses `asChild` with an `<a>` element (the canonical hover card use case per shadcn/ui).

2. **`WithAvatar`** — HoverCard content includes an `Avatar` component (from sibling task t01) alongside user name, handle, and description text in a structured layout. Demonstrates rich content composition.

3. **`LinkTrigger`** — HoverCard on a styled `<a>` element using `asChild` on HoverCardTrigger, demonstrating polymorphic trigger rendering.

4. **`CustomAlign`** — HoverCard with `align="start"` on HoverCardContent, demonstrating alignment override.

### 3.6 `packages/ui/src/index.ts` (Modify)

**Purpose**: Add HoverCard exports to the public API.

**Additions** (appended after the existing Tooltip exports at line 330):

```typescript
export {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  type HoverCardProps,
  type HoverCardTriggerProps,
  type HoverCardContentProps,
} from './components/hover-card/hover-card.js';
```

### 3.7 `packages/ui/package.json` (Modify)

**Purpose**: Add the `@radix-ui/react-hover-card` Radix dependency.

**Addition**: Add `"@radix-ui/react-hover-card": "^1.1.11"` to the `dependencies` object (alphabetically after `@radix-ui/react-dialog`).

## 4. API Contracts

### HoverCard (Root)

Re-export of `@radix-ui/react-hover-card` Root. Accepts all Radix HoverCard Root props:

| Prop           | Type                      | Default | Description                           |
| -------------- | ------------------------- | ------- | ------------------------------------- |
| `defaultOpen`  | `boolean`                 | `false` | Uncontrolled initial open state       |
| `open`         | `boolean`                 | —       | Controlled open state                 |
| `onOpenChange` | `(open: boolean) => void` | —       | Callback when open state changes      |
| `openDelay`    | `number`                  | `700`   | Delay in ms before opening on hover   |
| `closeDelay`   | `number`                  | `300`   | Delay in ms before closing on unhover |

### HoverCardTrigger

| Prop        | Type                                                      | Default | Description                                      |
| ----------- | --------------------------------------------------------- | ------- | ------------------------------------------------ |
| `asChild`   | `boolean`                                                 | `false` | Render as child element instead of default `<a>` |
| `className` | `string`                                                  | —       | Additional CSS classes                           |
| `ref`       | `React.Ref<HTMLAnchorElement>`                            | —       | Ref to the trigger element                       |
| `...props`  | `React.ComponentProps<typeof HoverCardPrimitive.Trigger>` | —       | All other Radix trigger props                    |

**Output**: Renders `<a data-slot="hover-card-trigger" ...>` (or child element if `asChild`).

### HoverCardContent

| Prop         | Type                                                      | Default    | Description                                      |
| ------------ | --------------------------------------------------------- | ---------- | ------------------------------------------------ |
| `align`      | `'start' \| 'center' \| 'end'`                            | `'center'` | Alignment relative to trigger                    |
| `sideOffset` | `number`                                                  | `4`        | Offset from the trigger edge in px               |
| `className`  | `string`                                                  | —          | Additional CSS classes (merged with base styles) |
| `ref`        | `React.Ref<HTMLDivElement>`                               | —          | Ref to the content element                       |
| `...props`   | `React.ComponentProps<typeof HoverCardPrimitive.Content>` | —          | All other Radix content props                    |

**Output**: Renders inside a portal: `<div data-slot="hover-card-content" ...>`.

## 5. Test Plan

### Test Setup

- **Framework**: Vitest + @testing-library/react + @testing-library/user-event + vitest-axe
- **Import pattern**: Import from `./hover-card.js` (same-directory relative import with `.js` extension)
- **Test helper**: `TestHoverCard` component wrapping `HoverCard` > `HoverCardTrigger` > `HoverCardContent` with configurable props. Uses `openDelay={0}` by default on the `HoverCard` root to eliminate timing issues in tests.

### Test Specifications

| #   | Test Name                          | Setup                                                         | Action                                                          | Assertion                                                               |
| --- | ---------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 1   | renders trigger                    | `render(<TestHoverCard />)`                                   | None                                                            | `screen.getByText('Hover me')` is in the document                       |
| 2   | content is hidden by default       | `render(<TestHoverCard />)`                                   | None                                                            | `screen.queryByText('Hover card content')` is `null`                    |
| 3   | shows on hover                     | `render(<TestHoverCard />)`                                   | `user.hover(trigger)`                                           | `waitFor(() => screen.getByText('Hover card content'))`                 |
| 4   | hides on pointer leave             | `render(<TestHoverCard />)`                                   | `user.hover(trigger)` → wait for open → `user.unhover(trigger)` | `waitFor(() => expect(queryByText).not.toBeInTheDocument())`            |
| 5   | has data-slot on trigger           | `render(<TestHoverCard />)`                                   | None                                                            | `querySelector('[data-slot="hover-card-trigger"]')` exists              |
| 6   | has data-slot on content           | `render(<TestHoverCard />)`                                   | `user.hover(trigger)`                                           | `querySelector('[data-slot="hover-card-content"]')` exists              |
| 7   | merges custom className on content | `render(<TestHoverCard contentClassName="custom-class" />)`   | `user.hover(trigger)`                                           | Content element has both `custom-class` and `rounded-md`                |
| 8   | merges custom className on trigger | `render(<TestHoverCard triggerClassName="custom-trigger" />)` | None                                                            | Trigger element has `custom-trigger` class                              |
| 9   | renders rich content               | `render(HoverCard with heading + paragraph)`                  | `user.hover(trigger)`                                           | Heading and paragraph text are in the document                          |
| 10  | forwards ref to HoverCardContent   | `render(HoverCard with defaultOpen and ref)`                  | None (default open)                                             | `ref.current` is `HTMLDivElement` with `data-slot="hover-card-content"` |
| 11  | has no accessibility violations    | `render(<TestHoverCard />)`                                   | `user.hover(trigger)` → wait for open                           | `axe(document.body)` has no violations                                  |

## 6. Implementation Order

1. **Install dependency** — Add `@radix-ui/react-hover-card` to `packages/ui/package.json` and run `pnpm install`.

2. **Create `hover-card.types.ts`** — Define the three prop types. No dependencies on other files in this component.

3. **Create `hover-card.styles.ts`** — Define the `hoverCardContentStyles` constant. No dependencies on other files.

4. **Create `hover-card.tsx`** — Implement the three exports. Depends on types and styles files.

5. **Create `hover-card.test.tsx`** — Write the full test suite. Depends on the implementation file.

6. **Create `hover-card.stories.tsx`** — Write Storybook stories. Depends on the implementation file and Avatar (sibling task t01, already completed).

7. **Modify `packages/ui/src/index.ts`** — Add HoverCard exports to the public API.

8. **Verify** — Run `pnpm typecheck`, `pnpm test`, and confirm Storybook renders correctly.

## 7. Verification Commands

```bash
# Install the new dependency
pnpm --filter @components/ui add @radix-ui/react-hover-card

# Type checking — must pass with zero errors
pnpm typecheck

# Run only hover-card tests
pnpm --filter @components/ui test -- hover-card

# Run the full test suite — must pass with zero failures
pnpm test

# Build the package — must succeed
pnpm build

# Launch Storybook to visually verify (manual check)
pnpm storybook
```

## 8. Design Deviations

**Deviation 1: HoverCardTrigger does not add `asChild` to its own type**

The task spec states HoverCardTrigger extends `React.ComponentProps<typeof HoverCardPrimitive.Trigger>` with `{ asChild?: boolean }`. However, `asChild` is already part of the Radix `HoverCardPrimitive.Trigger` component props — it is built into the Radix primitive. Adding it as an explicit intersection type would create a redundant type overlap. The completed sibling tasks (Tooltip t03, Popover from m01) do not add `asChild` to their trigger types for the same reason. The implementation omits the explicit `{ asChild?: boolean }` from the type definition while still fully supporting `asChild` at runtime (it's passed through via `...props`).

**Deviation 2: Animation class format uses `data-[state=open]` prefix**

The task spec lists animation classes as `animate-in fade-in-0 zoom-in-95` without a `data-[state=open]:` prefix. The actual codebase convention (seen in both `popover.styles.ts` and `tooltip.styles.ts`) uses `data-[state=open]:animate-in data-[state=open]:fade-in-0` etc. to scope animations to the open state. The implementation follows the codebase convention to ensure animations only play on state transitions, not on initial mount. This is consistent with all existing overlay components in the library.
