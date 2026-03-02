I now have all the information I need. Let me produce the complete implementation plan.

# Task 3: Sidebar Component — Implementation Plan

## 1. Deliverables

### Files to Create

| File                                                     | Purpose                                                                                  |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `packages/ui/src/components/sidebar/sidebar.types.ts`    | Props types for all 8 sub-components + `useSidebar` return type                          |
| `packages/ui/src/components/sidebar/sidebar.styles.ts`   | CVA variants for SidebarMenuButton + static style constants for all other sub-components |
| `packages/ui/src/components/sidebar/sidebar.tsx`         | Implementation of 8 sub-components + `useSidebar` hook                                   |
| `packages/ui/src/components/sidebar/sidebar.test.tsx`    | Vitest + Testing Library + vitest-axe tests                                              |
| `packages/ui/src/components/sidebar/sidebar.stories.tsx` | Storybook CSF3 stories with `tags: ['autodocs']`                                         |

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
- **CSS tokens (already defined):**
  - `sidebar-*` tokens in `globals.css` mapped to Tailwind via `@theme inline` block: `bg-sidebar-background`, `text-sidebar-foreground`, `bg-sidebar-primary`, `text-sidebar-primary-foreground`, `bg-sidebar-accent`, `text-sidebar-accent-foreground`, `border-sidebar-border`, `ring-sidebar-ring`

## 3. Implementation Details

### 3.1 `sidebar.types.ts`

**Purpose:** Define TypeScript types for all sub-components and the sidebar context.

**Exports:**

```typescript
import type { VariantProps } from 'class-variance-authority';
import type { sidebarMenuButtonVariants } from './sidebar.styles.js';

export type SidebarContext = {
  open: boolean;
  toggleSidebar: () => void;
};

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

- `SidebarTriggerProps` extends `React.ComponentProps<'button'>` because it composes the Button component, but additional button props (onClick, etc.) are passed through
- `SidebarContext` is not exported from the types file's public API — it's used internally by the context and `useSidebar` hook

### 3.2 `sidebar.styles.ts`

**Purpose:** CVA variants for `SidebarMenuButton` and static style constants for all other sub-components using `sidebar-*` token classes.

**Exports:**

```typescript
import { cva } from 'class-variance-authority';

// SidebarProvider wrapping div — flex container for sidebar + content layout
export const sidebarProviderStyles = 'flex min-h-svh w-full';

// The sidebar aside element — contains SidebarContent, collapsible with width transition
export const sidebarStyles =
  'flex h-full w-64 flex-col bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border transition-[width] duration-200 ease-linear';

// Collapsed state — hides the sidebar by setting width to 0, hiding overflow
export const sidebarCollapsedStyles = 'w-0 overflow-hidden border-r-0';

// SidebarContent — takes remaining space, composes ScrollArea internally
export const sidebarContentStyles = 'flex min-h-0 flex-1 flex-col gap-2 overflow-auto';

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
        default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        outline:
          'bg-sidebar-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]',
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

// Active state classes applied conditionally via data-active
export const sidebarMenuButtonActiveStyles =
  'bg-sidebar-primary text-sidebar-primary-foreground font-medium hover:bg-sidebar-primary hover:text-sidebar-primary-foreground';

// SidebarTrigger icon
export const sidebarTriggerStyles = '';
```

### 3.3 `sidebar.tsx`

**Purpose:** Implementation of all 8 sub-components + `useSidebar` hook.

**Key implementation details:**

1. **SidebarContext** — Create a React context with `React.createContext<SidebarContext | null>(null)`.

2. **SidebarProvider** — Manages `open` state:
   - Uses `useState` for uncontrolled mode (initialized from `defaultOpen`, default `true`)
   - If `open` prop is provided, uses that (controlled mode); otherwise uses internal state
   - `toggleSidebar()` function toggles state and calls `onOpenChange`
   - Registers a `keydown` event listener on `document` for `Cmd+B` / `Ctrl+B` shortcut:
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
   - Wraps children in the context provider and renders a `<div data-slot="sidebar-provider">` with `sidebarProviderStyles`

3. **SidebarTrigger** — Composes the existing `Button` component with `variant="ghost"` and `size="icon"`. Calls `toggleSidebar()` from context on click. Renders an inline SVG panel/hamburger icon (PanelLeft icon from Lucide). Also accepts an `onClick` prop that is called alongside the toggle (using spread `...props` and composing `onClick`). Labeled with `data-slot="sidebar-trigger"` and `aria-label="Toggle Sidebar"`.

4. **Sidebar internal element** — Inside `SidebarProvider`, the sidebar `<aside>` element wraps `SidebarContent`. Its width transitions between `w-64` (expanded) and `w-0` (collapsed) using `sidebarStyles` and conditionally `sidebarCollapsedStyles`.

5. **SidebarContent** — Wraps children in a `<div>` with `sidebarContentStyles`. Internally uses `ScrollArea` from the scroll-area component.

6. **SidebarGroup** — Simple `<div>` with `sidebarGroupStyles` and `data-slot="sidebar-group"`.

7. **SidebarGroupLabel** — `<div>` (or `Slot` when `asChild`) with `sidebarGroupLabelStyles` and `data-slot="sidebar-group-label"`.

8. **SidebarMenu** — `<ul>` with `sidebarMenuStyles` and `data-slot="sidebar-menu"`.

9. **SidebarMenuItem** — `<li>` with `sidebarMenuItemStyles` and `data-slot="sidebar-menu-item"`.

10. **SidebarMenuButton** — `<button>` (or `Slot` when `asChild`) with CVA `sidebarMenuButtonVariants({ variant, size })`. Conditionally applies `sidebarMenuButtonActiveStyles` when `isActive` is `true`. Sets `data-active={isActive ? '' : undefined}` and `data-slot="sidebar-menu-button"`.

11. **useSidebar** — Hook that reads from `SidebarContext`. Throws `Error('useSidebar must be used within a SidebarProvider')` if context is null.

**Exports from `sidebar.tsx`:**

- Components: `SidebarProvider`, `SidebarTrigger`, `SidebarContent`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`
- Hook: `useSidebar`
- Type re-exports: all 8 prop types from `sidebar.types.js`

### 3.4 `sidebar.test.tsx`

See Section 5 (Test Plan) below.

### 3.5 `sidebar.stories.tsx`

**Meta:** `title: 'Components/Sidebar'`, `component: SidebarProvider`, `tags: ['autodocs']`.

**Stories:**

1. **Default** — Expanded sidebar with two `SidebarGroup` sections, each having a `SidebarGroupLabel` and multiple `SidebarMenuButton` items. One item marked `isActive`. Sidebar + main content area.
2. **Collapsed** — Same as Default but with `defaultOpen={false}` to show collapsed state.
3. **WithNestedMenus** — Demonstrates collapsible sub-menus using `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent` from M01 inside `SidebarGroup`.
4. **ControlledState** — Uses React state with `open` and `onOpenChange` props to demonstrate controlled sidebar behavior with an external toggle button.

Each story wraps content in `SidebarProvider` with a layout showing sidebar + main content to demonstrate the sidebar in context.

### 3.6 `index.ts` modifications

Add the following export block after the Breadcrumb exports (line 244):

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
  <SidebarTrigger />
  <aside>
    <SidebarContent>...</SidebarContent>
  </aside>
  <main>Content</main>
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

**Setup:** Import from `@testing-library/react`, `@testing-library/user-event`, `vitest-axe`, and `vitest`. Create a `TestSidebar` helper component that renders a complete sidebar layout (SidebarProvider > aside with SidebarContent > SidebarGroup > SidebarMenu > SidebarMenuItem > SidebarMenuButton, plus a main content area with SidebarTrigger).

**Tests:**

| #   | Test Name                                            | What It Verifies                                                                                                                                                                                                                                                                                                             |
| --- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `renders sidebar with content`                       | Mounts `TestSidebar`; verifies sidebar menu items are visible in the document                                                                                                                                                                                                                                                |
| 2   | `toggles collapse state on SidebarTrigger click`     | Click `SidebarTrigger`; verify sidebar aside element gains collapsed styles (e.g., `w-0`)                                                                                                                                                                                                                                    |
| 3   | `keyboard shortcut Cmd+B toggles sidebar`            | Dispatch `keydown` event with `{ key: 'b', metaKey: true }`; verify sidebar collapses. Dispatch again; verify it expands                                                                                                                                                                                                     |
| 4   | `keyboard shortcut Ctrl+B toggles sidebar`           | Dispatch `keydown` event with `{ key: 'b', ctrlKey: true }`; verify toggle behavior                                                                                                                                                                                                                                          |
| 5   | `menu button renders active state via data-active`   | Render `SidebarMenuButton` with `isActive`; verify element has `data-active` attribute and active style classes                                                                                                                                                                                                              |
| 6   | `menu button applies variant classes`                | Render with `variant="outline"`; verify `shadow-` class is present                                                                                                                                                                                                                                                           |
| 7   | `menu button applies size classes`                   | Render with `size="lg"`; verify `h-12` class is present                                                                                                                                                                                                                                                                      |
| 8   | `SidebarMenuButton asChild renders custom element`   | Render with `asChild` and an `<a>` child; verify link element has `data-slot="sidebar-menu-button"`                                                                                                                                                                                                                          |
| 9   | `SidebarGroupLabel asChild renders custom element`   | Render with `asChild` and an `<h3>` child; verify `data-slot="sidebar-group-label"`                                                                                                                                                                                                                                          |
| 10  | `useSidebar provides context`                        | Create a consumer component that calls `useSidebar()` and displays `open` state; verify it reads `true` from context                                                                                                                                                                                                         |
| 11  | `useSidebar throws outside SidebarProvider`          | Render a component that calls `useSidebar()` without wrapping in `SidebarProvider`; expect error to be thrown                                                                                                                                                                                                                |
| 12  | `data-slot attributes present on all sub-components` | Render full sidebar; query `[data-slot="sidebar-provider"]`, `[data-slot="sidebar-trigger"]`, `[data-slot="sidebar-content"]`, `[data-slot="sidebar-group"]`, `[data-slot="sidebar-group-label"]`, `[data-slot="sidebar-menu"]`, `[data-slot="sidebar-menu-item"]`, `[data-slot="sidebar-menu-button"]` — verify each exists |
| 13  | `className merging works`                            | Pass custom `className` to each sub-component; verify both custom class and base styles are present                                                                                                                                                                                                                          |
| 14  | `controlled mode with open and onOpenChange`         | Pass `open={true}` and an `onOpenChange` spy; click trigger; verify spy called with `false`                                                                                                                                                                                                                                  |
| 15  | `sidebar uses sidebar-* token classes`               | Verify the sidebar aside element has `bg-sidebar-background`, `text-sidebar-foreground`, `border-sidebar-border` classes                                                                                                                                                                                                     |
| 16  | `has no accessibility violations`                    | Render full `TestSidebar`; run `axe(container)`; verify no violations                                                                                                                                                                                                                                                        |

## 6. Implementation Order

1. **`sidebar.styles.ts`** — Define all static style constants and the `sidebarMenuButtonVariants` CVA. No dependencies on other sidebar files.

2. **`sidebar.types.ts`** — Define all prop types and the `SidebarContext` type. Depends on `sidebar.styles.js` (for `VariantProps<typeof sidebarMenuButtonVariants>`).

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

### Deviation 1: Sidebar layout structure

**Parent spec requires:** The phase spec describes `SidebarContent` as composing `ScrollArea` from P01 directly.

**Why adjusted:** `SidebarContent` needs to be a lightweight wrapper that can contain `SidebarGroup` children. Rather than making `SidebarContent` always wrap everything in `ScrollArea`, the `SidebarContent` component renders a `<div>` with `overflow-auto` styling. Consumers can optionally wrap in `ScrollArea` if they need custom scrollbar styling. This is simpler and avoids forcing `ScrollArea` when the sidebar content doesn't overflow, and avoids issues with Radix ScrollArea intercepting layout calculations. The component still supports scrollable content via `overflow-auto`.

### Deviation 2: Sidebar `<aside>` element not a named export

**Parent spec requires:** The spec lists 8 sub-components (SidebarProvider, SidebarTrigger, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton).

**Why this is correct:** The sidebar `<aside>` wrapper (the element that actually holds the width, border, and `bg-sidebar-background` styles and collapses) is rendered internally by `SidebarProvider`. The provider renders a `<div data-slot="sidebar-provider">` containing both the sidebar `<aside>` and the children (main content area). This means `SidebarProvider` handles: (a) the context, (b) the keyboard shortcut listener, and (c) the sidebar container `<aside>` element. `SidebarContent` is then placed inside this `<aside>` by the consumer. This matches the shadcn/ui pattern where the `<Sidebar>` root component renders the `<aside>` and the `SidebarProvider` is an outer wrapper. Since the spec scopes to exactly 8 sub-components and does not list a separate `Sidebar` root component, the `<aside>` is rendered by `SidebarProvider` and the consumer places `SidebarContent` (and `SidebarTrigger`) as children within a prescribed layout structure.

**Alternative chosen:** `SidebarProvider` renders:

```tsx
<div data-slot="sidebar-provider" className={sidebarProviderStyles}>
  <aside className={cn(sidebarStyles, !open && sidebarCollapsedStyles)}>
    {/* SidebarContent goes here as a child */}
  </aside>
  {/* main content area goes here */}
</div>
```

To support this, `SidebarProvider` will accept `children` as a render function or use a designated "sidebar" slot pattern. After further consideration, the simplest approach matching the 8-component constraint is: `SidebarProvider` provides the context and keyboard listener, and consumers compose the layout themselves:

```tsx
<SidebarProvider>
  <aside className="...sidebar styles read from context...">
    <SidebarContent>
      <SidebarGroup>...</SidebarGroup>
    </SidebarContent>
  </aside>
  <main>
    <SidebarTrigger />
    Content
  </main>
</SidebarProvider>
```

However, to keep the sidebar's collapsed width transition logic internal (not requiring consumers to manually read context for classes), `SidebarProvider` will render the `<div>` wrapper with flex layout, and a **Sidebar** internal `<aside>` element. The consumer passes the sidebar content and main content as children of `SidebarProvider`, using an internal slot pattern:

**Final approach:** Add a 9th internal-only component (not exported): a `Sidebar` `<aside>` element that reads context and applies collapsed styles. This `<aside>` is what consumers place inside `SidebarProvider`:

```tsx
// Internal (not exported as public API)
function SidebarContainer({ className, ref, children, ...props }) {
  const { open } = useSidebar();
  return (
    <aside
      data-slot="sidebar"
      className={cn(sidebarStyles, !open && sidebarCollapsedStyles, className)}
      ref={ref}
      {...props}
    >
      {children}
    </aside>
  );
}
```

Then the consumer usage:

```tsx
<SidebarProvider>
  <SidebarContainer>
    <SidebarContent>
      <SidebarGroup>...</SidebarGroup>
    </SidebarContent>
  </SidebarContainer>
  <main className="flex-1">
    <SidebarTrigger />
    ...
  </main>
</SidebarProvider>
```

Since the spec explicitly says 8 sub-components (not 9), `SidebarContainer` is internal and not exported from `index.ts`. However, this adds an extra component consumers need to know about without it being in the public API. A simpler approach: **embed the `<aside>` inside `SidebarProvider`** so it renders the full layout wrapper automatically, and use a children convention where the first child is treated as sidebar content and the rest as main content.

**Simplest correct approach:** `SidebarProvider` renders the flex wrapper `<div>` and accepts `children`. The consumer composes freely. The sidebar `<aside>` is rendered by `SidebarContent` instead — `SidebarContent` renders `<aside data-slot="sidebar-content">` with the sidebar width, background, border, and collapse transition styles, and wraps its children in a scrollable container. This way, `SidebarContent` is the "sidebar container" and no extra component is needed:

```tsx
<SidebarProvider>
  <SidebarContent>
    <SidebarGroup>...</SidebarGroup>
  </SidebarContent>
  <main className="flex-1">
    <SidebarTrigger />
  </main>
</SidebarProvider>
```

This is the approach used in the implementation.
