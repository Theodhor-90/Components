Good — `@components/hooks` is not a dependency of `@components/ui`. I'll implement the controllable state logic inline rather than adding a new dependency. Now I have all the context needed to write the revised plan.

# Task 3: Sidebar Component — Implementation Plan

## 1. Deliverables

### Files to Create

| File                                                     | Purpose                                                     |
| -------------------------------------------------------- | ----------------------------------------------------------- |
| `packages/ui/src/components/sidebar/sidebar.types.ts`    | Props types for all 8 sub-components                        |
| `packages/ui/src/components/sidebar/sidebar.styles.ts`   | CVA variants for SidebarMenuButton + static style constants |
| `packages/ui/src/components/sidebar/sidebar.tsx`         | Implementation of 8 sub-components + `useSidebar` hook      |
| `packages/ui/src/components/sidebar/sidebar.test.tsx`    | Vitest + Testing Library + vitest-axe tests                 |
| `packages/ui/src/components/sidebar/sidebar.stories.tsx` | Storybook CSF3 stories with `tags: ['autodocs']`            |

### Files to Modify

| File                       | Change                                                                           |
| -------------------------- | -------------------------------------------------------------------------------- |
| `packages/ui/src/index.ts` | Add exports for all 8 sub-components, `useSidebar` hook, types, and CVA variants |

## 2. Dependencies

- **Already installed (no action needed):**
  - `@radix-ui/react-slot` — used by `SidebarMenuButton` and `SidebarGroupLabel` for `asChild` support
  - `class-variance-authority` — CVA variants for `SidebarMenuButton`
  - `@components/utils` — `cn()` helper via `../../lib/utils.js`
- **From M01 (already implemented):**
  - `Button` component — composed by `SidebarTrigger` (`variant="ghost"`, `size="icon"`)
  - `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent` — used in stories for nested menu demos
- **From M03/P01 (already implemented):**
  - `ScrollArea` component — composed by `SidebarContent` for scrollable menu areas
- **CSS tokens (already defined in `globals.css`, mapped via `@theme inline`):**
  - `bg-sidebar-background`, `text-sidebar-foreground`, `bg-sidebar-primary`, `text-sidebar-primary-foreground`, `bg-sidebar-accent`, `text-sidebar-accent-foreground`, `border-sidebar-border`, `ring-sidebar-ring`

## 3. Implementation Details

### 3.1 `sidebar.types.ts`

**Purpose:** Define TypeScript types for all sub-components. The `SidebarContext` type is internal to `sidebar.tsx` and not defined here.

**Exports:**

```typescript
import type { VariantProps } from 'class-variance-authority';
import type { sidebarMenuButtonVariants } from './sidebar.styles.js';

export type SidebarProviderProps = React.ComponentProps<'div'> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export type SidebarTriggerProps = React.ComponentProps<'button'>;

export type SidebarContentProps = React.ComponentProps<'div'>;

export type SidebarGroupProps = React.ComponentProps<'div'>;

export type SidebarGroupLabelProps = React.ComponentProps<'div'> & {
  asChild?: boolean;
};

export type SidebarMenuProps = React.ComponentProps<'ul'>;

export type SidebarMenuItemProps = React.ComponentProps<'li'>;

export type SidebarMenuButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof sidebarMenuButtonVariants> & {
    asChild?: boolean;
    isActive?: boolean;
  };
```

**Notes:**

- No `SidebarContext` type exported — the context shape (`{ open: boolean; toggleSidebar: () => void }`) is internal to `sidebar.tsx` and not part of the public API.
- `SidebarTriggerProps` extends `React.ComponentProps<'button'>` because it renders a `Button` component; consumers can pass `onClick`, `className`, etc. through props spread.

### 3.2 `sidebar.styles.ts`

**Purpose:** CVA variants for `SidebarMenuButton` and static Tailwind class string constants for all other sub-components using `sidebar-*` token classes.

**Exports:**

```typescript
import { cva } from 'class-variance-authority';

// SidebarProvider wrapper — flex container for sidebar + content layout
export const sidebarProviderStyles = 'flex min-h-svh w-full';

// SidebarContent — the <aside> element that serves as the sidebar container.
// Contains the sidebar width, background, border, and collapse transition.
// When collapsed, width transitions to 0 and overflow is hidden.
export const sidebarContentStyles =
  'flex h-full w-64 flex-col bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border transition-[width] duration-200 ease-linear';

export const sidebarContentCollapsedStyles = 'w-0 overflow-hidden border-r-0';

// SidebarContent inner — scrollable area inside the <aside>, wraps ScrollArea
export const sidebarContentInnerStyles = 'flex min-h-0 flex-1 flex-col';

// SidebarGroup
export const sidebarGroupStyles = 'flex w-full min-w-0 flex-col gap-2 p-2';

// SidebarGroupLabel
export const sidebarGroupLabelStyles =
  'flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70';

// SidebarMenu
export const sidebarMenuStyles = 'flex w-full min-w-0 flex-col gap-1';

// SidebarMenuItem
export const sidebarMenuItemStyles = 'group/menu-item relative';

// SidebarMenuButton — CVA variants for variant × size
export const sidebarMenuButtonVariants = cva(
  'flex w-full items-center gap-2 overflow-hidden rounded-md px-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: '',
        outline:
          'bg-sidebar-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:shadow-[0_0_0_1px_var(--sidebar-accent)]',
      },
      size: {
        sm: 'h-7 text-xs',
        default: 'h-8',
        lg: 'h-12 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

// Active state classes applied conditionally when isActive is true
export const sidebarMenuButtonActiveStyles =
  'bg-sidebar-primary text-sidebar-primary-foreground font-medium hover:bg-sidebar-primary hover:text-sidebar-primary-foreground';
```

**Changes from v1:**

- Removed empty `sidebarTriggerStyles` constant — it served no purpose.
- Removed `sidebarStyles` and `sidebarCollapsedStyles` (previously for a standalone `<aside>`). Renamed to `sidebarContentStyles` and `sidebarContentCollapsedStyles` to align with the final architecture where `SidebarContent` renders the `<aside>`.
- Added `sidebarContentInnerStyles` for the scrollable interior.
- Removed duplicate `hover:bg-sidebar-accent hover:text-sidebar-accent-foreground` from the `default` variant string — these classes are already in the base string. The `default` variant value is now an empty string.

### 3.3 `sidebar.tsx`

**Purpose:** Implementation of all 8 sub-components + `useSidebar` hook.

**Architecture decision:** `SidebarContent` renders the `<aside>` element that serves as the sidebar container, including the `w-64` width, `bg-sidebar-background` surface color, right border, and collapse transition. This is the final and only approach — `SidebarContent` is both the sidebar container and the scrollable content area. `SidebarProvider` renders a plain `<div>` context wrapper with flex layout. See Section 8 (Design Deviations) for rationale.

**Component implementations:**

**1. SidebarContext** — Internal `React.createContext<{ open: boolean; toggleSidebar: () => void } | null>(null)`.

**2. SidebarProvider** — Context provider and layout wrapper.

DOM output: `<div data-slot="sidebar-provider" class="flex min-h-svh w-full {className}">`.

State management uses an inline controllable state pattern (since `@components/hooks` is not a dependency of `@components/ui`):

```typescript
const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? true);
const isControlled = open !== undefined;
const resolvedOpen = isControlled ? open : uncontrolledOpen;

const toggleSidebar = useCallback(() => {
  const next = !resolvedOpen;
  if (!isControlled) {
    setUncontrolledOpen(next);
  }
  onOpenChange?.(next);
}, [resolvedOpen, isControlled, onOpenChange]);
```

Keyboard shortcut listener uses `toggleSidebar` (memoized via `useCallback`) as a dependency:

```typescript
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'b' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      toggleSidebar();
    }
  };
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [toggleSidebar]);
```

Provides `{ open: resolvedOpen, toggleSidebar }` via context.

**3. SidebarTrigger** — Composes the existing `Button` component with `variant="ghost"` and `size="icon"`. Calls `toggleSidebar()` from context.

onClick composition pattern: the user's `onClick` handler runs first, then `toggleSidebar()`:

```typescript
export function SidebarTrigger({ className, onClick, ref, ...props }: SidebarTriggerProps) {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={className}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        toggleSidebar();
      }}
      ref={ref}
      aria-label="Toggle Sidebar"
      {...props}
    >
      {/* PanelLeft icon — 24×24 viewBox, two rectangles representing a sidebar layout */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M9 3v18" />
      </svg>
    </Button>
  );
}
```

The SVG is a "PanelLeft" icon: a rounded rectangle with a vertical divider line at 9px, representing a sidebar panel layout. Dimensions: 16×16 rendered size, 24×24 viewBox. This matches the Lucide `PanelLeft` icon geometry but is inlined as raw SVG (the project does not use Lucide as a dependency).

**4. SidebarContent** — Renders the sidebar `<aside>` element with width, background, border, and collapse transition. Internally wraps children in `ScrollArea` from M03/P01.

DOM output:

```
<aside data-slot="sidebar-content" class="flex h-full w-64 flex-col bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border transition-[width] duration-200 ease-linear {collapsed: w-0 overflow-hidden border-r-0} {className}">
  <ScrollArea class="flex min-h-0 flex-1 flex-col">
    {children}
  </ScrollArea>
</aside>
```

Implementation:

```typescript
export function SidebarContent({ className, children, ref, ...props }: SidebarContentProps) {
  const { open } = useSidebar();
  return (
    <aside
      data-slot="sidebar-content"
      className={cn(
        sidebarContentStyles,
        !open && sidebarContentCollapsedStyles,
        className,
      )}
      ref={ref}
      {...props}
    >
      <ScrollArea className={sidebarContentInnerStyles}>
        {children}
      </ScrollArea>
    </aside>
  );
}
```

**5. SidebarGroup** — `<div>` with `sidebarGroupStyles` and `data-slot="sidebar-group"`. Spreads `className` and `ref`.

**6. SidebarGroupLabel** — `<div>` (or `Slot` when `asChild`) with `sidebarGroupLabelStyles` and `data-slot="sidebar-group-label"`.

```typescript
export function SidebarGroupLabel({
  className,
  asChild = false,
  ref,
  ...props
}: SidebarGroupLabelProps) {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      data-slot="sidebar-group-label"
      className={cn(sidebarGroupLabelStyles, className)}
      ref={ref}
      {...props}
    />
  );
}
```

**7. SidebarMenu** — `<ul>` with `sidebarMenuStyles` and `data-slot="sidebar-menu"`.

**8. SidebarMenuItem** — `<li>` with `sidebarMenuItemStyles` and `data-slot="sidebar-menu-item"`.

**9. SidebarMenuButton** — `<button>` (or `Slot` when `asChild`) with CVA variants. Conditionally applies active styles.

```typescript
export function SidebarMenuButton({
  className,
  asChild = false,
  variant,
  size,
  isActive = false,
  ref,
  ...props
}: SidebarMenuButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      data-slot="sidebar-menu-button"
      data-active={isActive ? '' : undefined}
      className={cn(
        sidebarMenuButtonVariants({ variant, size }),
        isActive && sidebarMenuButtonActiveStyles,
        className,
      )}
      ref={ref}
      {...props}
    />
  );
}
```

**10. useSidebar** — Hook that reads from `SidebarContext`. Throws if context is null:

```typescript
export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
```

**Exports from `sidebar.tsx`:**

- Components: `SidebarProvider`, `SidebarTrigger`, `SidebarContent`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`
- Hook: `useSidebar`
- Type re-exports: all 8 prop types from `sidebar.types.js`

### 3.4 `sidebar.test.tsx`

See Section 5 (Test Plan) below.

### 3.5 `sidebar.stories.tsx`

**Meta:** `title: 'Components/Sidebar'`, `component: SidebarProvider`, `tags: ['autodocs']`.

**Stories:**

1. **Default** — Expanded sidebar with two `SidebarGroup` sections, each having a `SidebarGroupLabel` and multiple `SidebarMenuButton` items. One item marked `isActive`. Sidebar + main content area side by side.
2. **Collapsed** — Same as Default but with `defaultOpen={false}` to show collapsed state.
3. **WithNestedMenus** — Demonstrates collapsible sub-menus using `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent` from M01 inside `SidebarGroup`.
4. **ControlledState** — Uses React state with `open` and `onOpenChange` props to demonstrate controlled sidebar behavior with an external toggle button.

Each story wraps content in `SidebarProvider` with a layout showing `SidebarContent` (the `<aside>`) alongside a `<main>` area with a `SidebarTrigger`.

### 3.6 `index.ts` modifications

Add the following export block after the Breadcrumb exports (currently ending at line 244):

```typescript
export {
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  type SidebarProviderProps,
  type SidebarTriggerProps,
  type SidebarContentProps,
  type SidebarGroupProps,
  type SidebarGroupLabelProps,
  type SidebarMenuProps,
  type SidebarMenuItemProps,
  type SidebarMenuButtonProps,
} from './components/sidebar/sidebar.js';
export { sidebarMenuButtonVariants } from './components/sidebar/sidebar.styles.js';
```

## 4. API Contracts

### SidebarProvider

```tsx
// Uncontrolled (default — open on mount)
<SidebarProvider>
  <SidebarContent>
    <SidebarGroup>...</SidebarGroup>
  </SidebarContent>
  <main className="flex-1">
    <SidebarTrigger />
    Content
  </main>
</SidebarProvider>

// Uncontrolled, start collapsed
<SidebarProvider defaultOpen={false}>...</SidebarProvider>

// Controlled
const [open, setOpen] = useState(true);
<SidebarProvider open={open} onOpenChange={setOpen}>...</SidebarProvider>
```

### useSidebar

```typescript
const { open, toggleSidebar } = useSidebar();
// open: boolean — current sidebar state
// toggleSidebar: () => void — toggles open/closed
```

### SidebarMenuButton

```tsx
// Default button
<SidebarMenuButton>Dashboard</SidebarMenuButton>

// Active state
<SidebarMenuButton isActive>Dashboard</SidebarMenuButton>

// Outline variant, large size
<SidebarMenuButton variant="outline" size="lg">Settings</SidebarMenuButton>

// asChild with router link
<SidebarMenuButton asChild isActive>
  <a href="/dashboard">Dashboard</a>
</SidebarMenuButton>
```

### SidebarGroupLabel

```tsx
// Default
<SidebarGroupLabel>Navigation</SidebarGroupLabel>

// asChild
<SidebarGroupLabel asChild>
  <h3>Navigation</h3>
</SidebarGroupLabel>
```

## 5. Test Plan

**Test file:** `packages/ui/src/components/sidebar/sidebar.test.tsx`

**Setup:** Import from `@testing-library/react`, `@testing-library/user-event`, `vitest-axe`, and `vitest`. Create a `TestSidebar` helper component that renders a complete sidebar layout:

```tsx
function TestSidebar(props: Partial<SidebarProviderProps>) {
  return (
    <SidebarProvider {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>Settings</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <main className="flex-1">
        <SidebarTrigger />
        <p>Main content</p>
      </main>
    </SidebarProvider>
  );
}
```

**Tests:**

| #   | Test Name                                            | What It Verifies                                                                                                                                                                                                                                                                                                              |
| --- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `renders sidebar with content`                       | Mounts `TestSidebar`; verifies "Dashboard" and "Settings" menu items are visible in the document                                                                                                                                                                                                                              |
| 2   | `toggles collapse state on SidebarTrigger click`     | Click `SidebarTrigger` (by `aria-label="Toggle Sidebar"`); verify the `<aside>` element gains `w-0` class                                                                                                                                                                                                                     |
| 3   | `keyboard shortcut Cmd+B toggles sidebar`            | Dispatch `keydown` event with `{ key: 'b', metaKey: true }`; verify `<aside>` gains `w-0` class. Dispatch again; verify `w-0` is removed                                                                                                                                                                                      |
| 4   | `keyboard shortcut Ctrl+B toggles sidebar`           | Dispatch `keydown` event with `{ key: 'b', ctrlKey: true }`; verify toggle behavior                                                                                                                                                                                                                                           |
| 5   | `menu button renders active state via data-active`   | Render `SidebarMenuButton` with `isActive`; verify element has `data-active` attribute and `bg-sidebar-primary` class                                                                                                                                                                                                         |
| 6   | `menu button applies variant classes`                | Render with `variant="outline"`; verify `shadow-` class is present                                                                                                                                                                                                                                                            |
| 7   | `menu button applies size classes`                   | Render with `size="lg"`; verify `h-12` class is present                                                                                                                                                                                                                                                                       |
| 8   | `SidebarMenuButton asChild renders custom element`   | Render with `asChild` and an `<a>` child; verify link element has `data-slot="sidebar-menu-button"`                                                                                                                                                                                                                           |
| 9   | `SidebarGroupLabel asChild renders custom element`   | Render with `asChild` and an `<h3>` child; verify `data-slot="sidebar-group-label"`                                                                                                                                                                                                                                           |
| 10  | `useSidebar provides context`                        | Create a consumer component that calls `useSidebar()` and displays `open` state as text; verify it reads `true` from context                                                                                                                                                                                                  |
| 11  | `useSidebar throws outside SidebarProvider`          | Render a component that calls `useSidebar()` without wrapping in `SidebarProvider`; expect error to be thrown (suppress console.error)                                                                                                                                                                                        |
| 12  | `data-slot attributes present on all sub-components` | Render `TestSidebar`; query `[data-slot="sidebar-provider"]`, `[data-slot="sidebar-trigger"]`, `[data-slot="sidebar-content"]`, `[data-slot="sidebar-group"]`, `[data-slot="sidebar-group-label"]`, `[data-slot="sidebar-menu"]`, `[data-slot="sidebar-menu-item"]`, `[data-slot="sidebar-menu-button"]` — verify each exists |
| 13  | `className merging works`                            | Pass custom `className="custom-test"` to `SidebarProvider`, `SidebarContent`, `SidebarMenuButton`; verify both custom class and base styles are present                                                                                                                                                                       |
| 14  | `controlled mode with open and onOpenChange`         | Pass `open={true}` and an `onOpenChange` vi.fn() spy; click trigger; verify spy called with `false`; verify sidebar does NOT collapse (controlled mode — state is owned by parent)                                                                                                                                            |
| 15  | `sidebar uses sidebar-* token classes`               | Verify the `<aside data-slot="sidebar-content">` element has `bg-sidebar-background`, `text-sidebar-foreground`, `border-sidebar-border` classes                                                                                                                                                                              |
| 16  | `has no accessibility violations`                    | Render full `TestSidebar`; run `axe(container)`; verify no violations                                                                                                                                                                                                                                                         |

## 6. Implementation Order

1. **`sidebar.styles.ts`** — Define all static style constants and the `sidebarMenuButtonVariants` CVA. No dependencies on other sidebar files.

2. **`sidebar.types.ts`** — Define all prop types. Depends on `sidebar.styles.js` (for `VariantProps<typeof sidebarMenuButtonVariants>`).

3. **`sidebar.tsx`** — Implement all 8 sub-components and the `useSidebar` hook. Depends on `sidebar.styles.js` and `sidebar.types.js`, plus external components (`Button`, `ScrollArea`, `Slot`).

4. **`sidebar.test.tsx`** — Write all tests. Depends on `sidebar.tsx`.

5. **`sidebar.stories.tsx`** — Write all Storybook stories. Depends on `sidebar.tsx` plus `Collapsible` components for the nested menus story.

6. **`packages/ui/src/index.ts`** — Add exports for all sidebar components, hook, types, and CVA variants.

## 7. Verification Commands

```bash
# Run sidebar tests only
pnpm --filter @components/ui test -- --run src/components/sidebar/sidebar.test.tsx

# Run full test suite
pnpm test

# TypeScript type checking
pnpm typecheck

# Verify exports compile (build the package)
pnpm --filter @components/ui build

# Launch Storybook to visually verify stories
pnpm storybook
```

## 8. Design Deviations

### Deviation 1: `SidebarContent` renders the `<aside>` container element

**Parent spec says:** "SidebarContent — Scrollable container composing ScrollArea from P01. `data-slot="sidebar-content"`" and the spec lists 8 sub-components without a separate `Sidebar` root component.

**What this plan does:** `SidebarContent` renders an `<aside>` element (not a `<div>`) that serves as both the sidebar container and the scrollable content wrapper. It applies the sidebar width (`w-64`), background (`bg-sidebar-background`), border (`border-r border-sidebar-border`), and collapse transition (`transition-[width]`, collapsing to `w-0`). Internally, it wraps children in `ScrollArea` from M03/P01.

**Why:** The spec scopes this task to exactly 8 named sub-components. There is no `Sidebar` root component in the spec's list. The collapse/expand behavior requires an element that transitions width and reads the `open` state from context. Rather than requiring consumers to manually manage an unstyled `<aside>` wrapper with context-dependent classes, `SidebarContent` absorbs this responsibility. This keeps the consumer API clean (place `SidebarContent` inside `SidebarProvider`), maintains the 8-component constraint, and composes `ScrollArea` as the spec requires. The `<aside>` semantic element is appropriate because the sidebar is a complementary landmark.

### Deviation 2: Inline controllable state instead of `useControllableState` hook

**Project has:** A `useControllableState` hook in `@components/hooks`.

**What this plan does:** Implements the controlled/uncontrolled state pattern inline in `SidebarProvider` using `useState` + `useCallback` + a controlled check (`open !== undefined`).

**Why:** `@components/hooks` is not listed in `@components/ui`'s `package.json` dependencies, and adding a new package dependency is an "ask first" action per AGENTS.md. The inline pattern is straightforward (6 lines), avoids adding a cross-package dependency for a single use, and follows the same logic as the hook. If a future task adds `@components/hooks` as a dependency of `@components/ui`, this can be refactored to use the shared hook.
