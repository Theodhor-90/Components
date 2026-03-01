Now I have all the context I need. Here is the complete implementation plan:

# Task 3: Popover — Implementation Plan

## 1. Deliverables

| #   | File                                                     | Action | Purpose                                                                         |
| --- | -------------------------------------------------------- | ------ | ------------------------------------------------------------------------------- |
| 1   | `packages/ui/package.json`                               | Modify | Add `@radix-ui/react-popover` to `dependencies`                                 |
| 2   | `packages/ui/src/components/popover/popover.types.ts`    | Create | TypeScript prop types for all 3 Popover sub-components                          |
| 3   | `packages/ui/src/components/popover/popover.styles.ts`   | Create | Style constant for `PopoverContent`                                             |
| 4   | `packages/ui/src/components/popover/popover.tsx`         | Create | Implementation of 3 named exports wrapping `@radix-ui/react-popover` primitives |
| 5   | `packages/ui/src/components/popover/popover.test.tsx`    | Create | Vitest + Testing Library + vitest-axe tests                                     |
| 6   | `packages/ui/src/components/popover/popover.stories.tsx` | Create | Storybook CSF3 stories with autodocs                                            |
| 7   | `packages/ui/src/index.ts`                               | Modify | Add exports for all Popover sub-components and types                            |

## 2. Dependencies

### Pre-existing (already installed)

- `@radix-ui/react-slot` — Slot/asChild composition pattern
- `class-variance-authority` — available but not needed (Popover has no variants)
- `@components/utils` — `cn()` helper (clsx + tailwind-merge)
- `tailwindcss-animate` — animation utility classes (installed in t00)
- `@testing-library/react`, `@testing-library/user-event`, `vitest`, `vitest-axe` — test infrastructure
- `@storybook/react-vite` — Storybook CSF3

### To be installed

- **`@radix-ui/react-popover`** — Radix popover primitive providing trigger/content/portal with built-in positioning engine. Install with `pnpm --filter @components/ui add @radix-ui/react-popover`.

## 3. Implementation Details

### 3.1 `popover.types.ts`

**Purpose:** Define TypeScript prop types for all 3 Popover sub-components.

**Exports:**

- `PopoverProps` — `React.ComponentProps<typeof PopoverPrimitive.Root>`
- `PopoverTriggerProps` — `React.ComponentProps<typeof PopoverPrimitive.Trigger>`
- `PopoverContentProps` — `React.ComponentProps<typeof PopoverPrimitive.Content>`

**Pattern:** Follows the exact pattern of `dialog.types.ts` — uses `import type * as PopoverPrimitive from '@radix-ui/react-popover'` and defines each type as a `React.ComponentProps` alias.

```typescript
import type * as PopoverPrimitive from '@radix-ui/react-popover';

export type PopoverProps = React.ComponentProps<typeof PopoverPrimitive.Root>;

export type PopoverTriggerProps = React.ComponentProps<typeof PopoverPrimitive.Trigger>;

export type PopoverContentProps = React.ComponentProps<typeof PopoverPrimitive.Content>;
```

### 3.2 `popover.styles.ts`

**Purpose:** Export a single style constant string for `PopoverContent`. No CVA variants — Popover has no variant prop.

**Exports:**

- `popoverContentStyles` — Tailwind class string

**Value:**

```typescript
export const popoverContentStyles =
  'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2';
```

**Key styling details:**

- `z-50` — Same z-index as Dialog overlay/content
- `w-72` — Default 18rem width
- `rounded-md` — Uses `--radius-md` (semantic radius token)
- `border` — Uses `--border` token
- `bg-popover text-popover-foreground` — Semantic popover surface tokens
- `p-4` — 1rem padding
- `shadow-md outline-none` — Shadow for depth, remove default outline
- `data-[state=open/closed]:animate-in/animate-out` — Enter/exit animations via tailwindcss-animate
- `data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0` — Fade animation
- `data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95` — Subtle zoom animation
- `data-[side=*]:slide-in-from-*-2` — Side-specific slide animations matching Radix's `data-side` attribute

### 3.3 `popover.tsx`

**Purpose:** Three named exports wrapping `@radix-ui/react-popover` primitives.

**Imports:**

```typescript
import * as PopoverPrimitive from '@radix-ui/react-popover';

import { cn } from '../../lib/utils.js';
import { popoverContentStyles } from './popover.styles.js';
import type { PopoverContentProps, PopoverTriggerProps } from './popover.types.js';
```

**Exports:**

1. **`Popover`** — Direct re-export of `PopoverPrimitive.Root`. Context provider only, no DOM output, no `data-slot`. Identical pattern to how `Dialog` is exported as `const Dialog = DialogPrimitive.Root`.

   ```typescript
   export const Popover = PopoverPrimitive.Root;
   ```

2. **`PopoverTrigger`** — Function component wrapping `PopoverPrimitive.Trigger`. Applies `data-slot="popover-trigger"`. Passes through `className` and `ref` directly (no `cn()` needed since no base styles). Supports `asChild` via Radix's built-in prop.

   ```typescript
   export function PopoverTrigger({ className, ref, ...props }: PopoverTriggerProps): React.JSX.Element {
     return (
       <PopoverPrimitive.Trigger
         data-slot="popover-trigger"
         className={className}
         ref={ref}
         {...props}
       />
     );
   }
   ```

3. **`PopoverContent`** — Function component wrapping `PopoverPrimitive.Content` inside a `PopoverPrimitive.Portal`. Applies `data-slot="popover-content"`. Destructures `align` (default `"center"`), `sideOffset` (default `4`), `className`, and `ref`. Uses `cn()` to merge base styles with consumer className.
   ```typescript
   export function PopoverContent({
     className,
     align = 'center',
     sideOffset = 4,
     ref,
     ...props
   }: PopoverContentProps): React.JSX.Element {
     return (
       <PopoverPrimitive.Portal>
         <PopoverPrimitive.Content
           data-slot="popover-content"
           align={align}
           sideOffset={sideOffset}
           className={cn(popoverContentStyles, className)}
           ref={ref}
           {...props}
         />
       </PopoverPrimitive.Portal>
     );
   }
   ```

**Type re-exports at the top of the file:**

```typescript
export type { PopoverContentProps, PopoverProps, PopoverTriggerProps } from './popover.types.js';
```

**Key differences from Dialog:**

- No `DialogOverlay` equivalent — Popover has no backdrop
- No focus trap — Popover is a lighter overlay
- `PopoverContent` renders inside `PopoverPrimitive.Portal` directly (no overlay wrapper)
- Default `align` and `sideOffset` props — Radix handles positioning internally
- No close button rendered inside content

### 3.4 `popover.test.tsx`

**Purpose:** Comprehensive tests for Popover component behavior, accessibility, and API.

**Test setup:** Use a `TestPopover` helper component (matching the pattern from `dialog.test.tsx`):

```typescript
function TestPopover({
  contentClassName,
  triggerClassName,
  align,
  sideOffset,
}: {
  contentClassName?: string;
  triggerClassName?: string;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}): React.JSX.Element {
  return (
    <Popover>
      <PopoverTrigger className={triggerClassName}>Open Popover</PopoverTrigger>
      <PopoverContent className={contentClassName} align={align} sideOffset={sideOffset}>
        <p>Popover content</p>
      </PopoverContent>
    </Popover>
  );
}
```

**Test specifications (10 tests):**

1. **`renders trigger button`** — Renders `TestPopover`, asserts `screen.getByRole('button', { name: 'Open Popover' })` is in document.

2. **`opens on trigger click`** — Sets up `userEvent`, clicks trigger, asserts `screen.getByText('Popover content')` is in document.

3. **`closes on outside click`** — Opens popover, clicks `document.body` (outside), asserts with `waitFor` that popover content is gone. Uses `pointerDownOutside` pattern — click on body.

4. **`closes on ESC`** — Opens popover, presses `{Escape}`, asserts with `waitFor` that popover content is gone.

5. **`data-slot on popover-trigger`** — Renders `TestPopover`, asserts `document.querySelector('[data-slot="popover-trigger"]')` is in document.

6. **`data-slot on popover-content`** — Opens popover, asserts `document.querySelector('[data-slot="popover-content"]')` is in document.

7. **`applies default sideOffset`** — Opens popover, queries `[data-slot="popover-content"]`, asserts `sideOffset` is passed to Radix. Since Radix applies `data-side` attribute, assert `document.querySelector('[data-slot="popover-content"]')` has a `data-side` attribute (confirming Radix positioning is active).

8. **`merges custom className on content`** — Renders `TestPopover` with `contentClassName="custom-content-class"`, opens popover, asserts `document.querySelector('[data-slot="popover-content"]')` has class `custom-content-class`.

9. **`merges custom className on trigger`** — Renders `TestPopover` with `triggerClassName="custom-trigger-class"`, asserts trigger button has class `custom-trigger-class`.

10. **`has no accessibility violations`** — Renders `TestPopover` with popover open (using a controlled wrapper or opening via click), runs `axe(container)`, asserts `toHaveNoViolations()`.

### 3.5 `popover.stories.tsx`

**Purpose:** Storybook CSF3 stories demonstrating Popover usage patterns.

**Meta configuration:**

```typescript
const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;
```

**Stories (4 stories):**

1. **`Default`** — Simple popover with trigger button and text content. Uses `Button` component as trigger via `asChild`.

   ```tsx
   <Popover>
     <PopoverTrigger asChild>
       <Button>Open Popover</Button>
     </PopoverTrigger>
     <PopoverContent>
       <p className="text-sm">This is popover content.</p>
     </PopoverContent>
   </Popover>
   ```

2. **`WithForm`** — Popover containing input fields, demonstrating form usage within a popover. Includes labeled inputs inside the popover content area.

   ```tsx
   <Popover>
     <PopoverTrigger asChild>
       <Button>Set Dimensions</Button>
     </PopoverTrigger>
     <PopoverContent className="w-80">
       <div className="grid gap-4">
         <div className="space-y-2">
           <h4 className="font-medium leading-none">Dimensions</h4>
           <p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
         </div>
         <div className="grid gap-2">
           <div className="grid grid-cols-3 items-center gap-4">
             <label htmlFor="width" className="text-sm">
               Width
             </label>
             <input
               id="width"
               defaultValue="100%"
               className="col-span-2 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
             />
           </div>
           <div className="grid grid-cols-3 items-center gap-4">
             <label htmlFor="height" className="text-sm">
               Height
             </label>
             <input
               id="height"
               defaultValue="25px"
               className="col-span-2 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
             />
           </div>
         </div>
       </div>
     </PopoverContent>
   </Popover>
   ```

3. **`Positioning`** — Demonstrates `side` and `align` prop combinations. Renders four popovers in a grid showing `side="top"`, `side="right"`, `side="bottom"`, `side="left"`.

   ```tsx
   <div className="flex items-center justify-center gap-4 p-20">
     {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
       <Popover key={side}>
         <PopoverTrigger asChild>
           <Button variant="outline">{side}</Button>
         </PopoverTrigger>
         <PopoverContent side={side}>
           <p className="text-sm">Popover on {side}</p>
         </PopoverContent>
       </Popover>
     ))}
   </div>
   ```

4. **`AsChildTrigger`** — Custom trigger element using `asChild` to render a non-button element as the trigger.
   ```tsx
   <Popover>
     <PopoverTrigger asChild>
       <span className="cursor-pointer text-sm underline" role="button" tabIndex={0}>
         Click for info
       </span>
     </PopoverTrigger>
     <PopoverContent>
       <p className="text-sm">Custom trigger using asChild.</p>
     </PopoverContent>
   </Popover>
   ```

## 4. API Contracts

### PopoverProps (Root)

| Prop           | Type                      | Default     | Description                       |
| -------------- | ------------------------- | ----------- | --------------------------------- |
| `open`         | `boolean`                 | `undefined` | Controlled open state             |
| `defaultOpen`  | `boolean`                 | `false`     | Initial open state (uncontrolled) |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Called when open state changes    |
| `modal`        | `boolean`                 | `false`     | Whether popover is modal          |
| `children`     | `React.ReactNode`         | —           | Trigger + Content                 |

### PopoverTriggerProps

| Prop        | Type              | Default     | Description             |
| ----------- | ----------------- | ----------- | ----------------------- |
| `asChild`   | `boolean`         | `false`     | Render as child element |
| `className` | `string`          | `undefined` | Custom CSS classes      |
| `ref`       | `React.Ref`       | `undefined` | React 19 ref-as-prop    |
| `children`  | `React.ReactNode` | —           | Trigger content         |

### PopoverContentProps

| Prop         | Type                                     | Default     | Description                              |
| ------------ | ---------------------------------------- | ----------- | ---------------------------------------- |
| `side`       | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'`  | Side relative to trigger (Radix default) |
| `align`      | `'start' \| 'center' \| 'end'`           | `'center'`  | Alignment along the side                 |
| `sideOffset` | `number`                                 | `4`         | Distance from trigger in pixels          |
| `className`  | `string`                                 | `undefined` | Custom CSS classes (merged with base)    |
| `ref`        | `React.Ref`                              | `undefined` | React 19 ref-as-prop                     |
| `children`   | `React.ReactNode`                        | —           | Popover body content                     |

### Public API Example

```tsx
import { Popover, PopoverTrigger, PopoverContent } from '@components/ui';

<Popover>
  <PopoverTrigger>Settings</PopoverTrigger>
  <PopoverContent side="right" align="start" sideOffset={8}>
    <p>Popover content goes here.</p>
  </PopoverContent>
</Popover>;
```

## 5. Test Plan

### Test Setup

- **Framework:** Vitest + `@testing-library/react` + `@testing-library/user-event` + `vitest-axe`
- **Import pattern:** Import components from `./popover.js` (relative, matching Dialog/AlertDialog test pattern)
- **Helper component:** `TestPopover` accepting optional `contentClassName`, `triggerClassName`, `align`, `sideOffset` props
- **User event:** Always use `userEvent.setup()` for interaction tests (never `fireEvent`)

### Test Specifications

| #   | Test Name                            | Category      | Description                                                                                                   |
| --- | ------------------------------------ | ------------- | ------------------------------------------------------------------------------------------------------------- |
| 1   | `renders trigger button`             | Smoke         | Renders TestPopover, asserts trigger button is in document via `getByRole('button')`                          |
| 2   | `opens on trigger click`             | Interaction   | Clicks trigger, asserts popover content text appears in document                                              |
| 3   | `closes on outside click`            | Interaction   | Opens popover, clicks document.body, asserts with `waitFor` that content is removed                           |
| 4   | `closes on ESC`                      | Interaction   | Opens popover, presses Escape, asserts with `waitFor` that content is removed                                 |
| 5   | `data-slot on popover-trigger`       | Data Slot     | Asserts `[data-slot="popover-trigger"]` exists in document                                                    |
| 6   | `data-slot on popover-content`       | Data Slot     | Opens popover, asserts `[data-slot="popover-content"]` exists in document                                     |
| 7   | `applies default sideOffset`         | Props         | Opens popover, asserts `[data-slot="popover-content"]` has a `data-side` attribute (Radix positioning active) |
| 8   | `merges custom className on content` | ClassName     | Renders with `contentClassName="custom-class"`, opens, asserts content element has `custom-class`             |
| 9   | `merges custom className on trigger` | ClassName     | Renders with `triggerClassName="custom-class"`, asserts trigger button has `custom-class`                     |
| 10  | `has no accessibility violations`    | Accessibility | Opens popover, runs `axe(container)`, asserts `toHaveNoViolations()`                                          |

## 6. Implementation Order

1. **Install dependency** — `pnpm --filter @components/ui add @radix-ui/react-popover`
2. **Create `popover.types.ts`** — Define the 3 prop types. This file has no dependencies on other popover files.
3. **Create `popover.styles.ts`** — Define the `popoverContentStyles` constant. No dependencies on other popover files.
4. **Create `popover.tsx`** — Implement the 3 exports (`Popover`, `PopoverTrigger`, `PopoverContent`). Imports from `popover.types.ts` and `popover.styles.ts`.
5. **Create `popover.test.tsx`** — Write all 10 tests. Imports from `popover.tsx`.
6. **Create `popover.stories.tsx`** — Write all 4 stories. Imports from `popover.tsx` and `../button/button.js`.
7. **Modify `packages/ui/src/index.ts`** — Add exports for `Popover`, `PopoverTrigger`, `PopoverContent`, and types `PopoverProps`, `PopoverTriggerProps`, `PopoverContentProps`.

## 7. Verification Commands

```bash
# 1. Install dependency
pnpm --filter @components/ui add @radix-ui/react-popover

# 2. TypeScript type checking (entire monorepo)
pnpm typecheck

# 3. Run popover tests only
pnpm --filter @components/ui test -- popover

# 4. Run all tests across packages
pnpm test

# 5. Lint check
pnpm lint

# 6. Build the UI package (validates module resolution)
pnpm --filter @components/ui build
```

## 8. Design Deviations

None.
