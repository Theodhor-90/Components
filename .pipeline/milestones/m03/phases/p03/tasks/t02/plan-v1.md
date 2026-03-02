Now I have complete context. Let me produce the specification.

# Task Plan: App Layout Component (m03/p03/t02)

## 1. Deliverables

| File                                                           | Purpose                                                                                                                                                                          |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/ui/src/components/app-layout/app-layout.types.ts`    | `AppLayoutProps` type definition extending `React.ComponentProps<'div'>` with `sidebar`, `header`, `defaultOpen`, `open`, `onOpenChange` props                                   |
| `packages/ui/src/components/app-layout/app-layout.styles.ts`   | CVA `appLayoutVariants` with base flex layout styles; no variant dimensions                                                                                                      |
| `packages/ui/src/components/app-layout/app-layout.tsx`         | AppLayout component composing SidebarProvider, SidebarContent, Header area, and ScrollArea content region with responsive mobile Sheet overlay                                   |
| `packages/ui/src/components/app-layout/app-layout.test.tsx`    | Vitest + Testing Library + vitest-axe tests covering smoke render, slot rendering, responsive behavior, controlled/uncontrolled state, data-slot, className merge, accessibility |
| `packages/ui/src/components/app-layout/app-layout.stories.tsx` | Storybook CSF3 stories: Default, CollapsedSidebar, WithHeaderAndSidebar, FullShell, MobileView; `tags: ['autodocs']`                                                             |
| `packages/ui/src/index.ts`                                     | Add `AppLayout`, `type AppLayoutProps`, `appLayoutVariants` exports                                                                                                              |

## 2. Dependencies

### Already available on current branch

- `@radix-ui/react-slot` — already installed (for potential future extension, though AppLayout does not use `asChild`)
- `@components/utils` — provides `cn()` helper
- `class-variance-authority` — for CVA styles
- `@radix-ui/react-scroll-area` — ScrollArea component exists on current branch
- `@radix-ui/react-dialog` — Sheet component exists on current branch

### Available on `phase/m03-p02` branch (will be merged before this task runs)

- Sidebar components: `SidebarProvider`, `SidebarTrigger`, `SidebarContent`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, `useSidebar` — all from `packages/ui/src/components/sidebar/sidebar.js`

### Must be added

- `@components/hooks` — must be added to `packages/ui/package.json` `dependencies` as `"@components/hooks": "workspace:*"`. This provides `useMediaQuery` for responsive viewport detection.

### No new npm packages required

All Radix and third-party dependencies are already installed.

## 3. Implementation Details

### 3.1 `app-layout.types.ts`

**Purpose**: Define the props interface for AppLayout.

**Exports**: `AppLayoutProps`

**Interface**:

```typescript
import type { VariantProps } from 'class-variance-authority';
import type { appLayoutVariants } from './app-layout.styles.js';

export type AppLayoutProps = React.ComponentProps<'div'> &
  VariantProps<typeof appLayoutVariants> & {
    sidebar?: React.ReactNode;
    header?: React.ReactNode;
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  };
```

- `sidebar` — ReactNode rendered inside the sidebar region (SidebarContent on desktop, Sheet on mobile)
- `header` — ReactNode rendered in the header area above the main content
- `defaultOpen` — initial sidebar open state for uncontrolled mode (defaults to `true` in SidebarProvider)
- `open` — controlled sidebar open state
- `onOpenChange` — callback fired when sidebar state changes
- Extends `React.ComponentProps<'div'>` to accept `className`, `ref`, `children`, etc.
- Includes CVA `VariantProps` for forward-compatibility even though no variants exist yet

### 3.2 `app-layout.styles.ts`

**Purpose**: CVA variant definition for the root AppLayout container.

**Exports**: `appLayoutVariants`

**Implementation**:

```typescript
import { cva } from 'class-variance-authority';

export const appLayoutVariants = cva('flex h-svh w-full overflow-hidden');
```

- `flex` — horizontal flex container for sidebar + main
- `h-svh` — full viewport height using `svh` unit (consistent with SidebarProvider's `min-h-svh` pattern)
- `w-full` — full width
- `overflow-hidden` — prevent scrolling on the root; ScrollArea handles content overflow
- No variant dimensions — AppLayout has a single layout configuration

### 3.3 `app-layout.tsx`

**Purpose**: Main component composing the application shell.

**Exports**: `AppLayout`, re-exports `AppLayoutProps`

**Key logic**:

```typescript
import { useMediaQuery } from '@components/hooks';

import { cn } from '../../lib/utils.js';
import { ScrollArea } from '../scroll-area/scroll-area.js';
import { Sheet, SheetContent } from '../sheet/sheet.js';
import { SidebarProvider, SidebarContent, useSidebar } from '../sidebar/sidebar.js';
import { appLayoutVariants } from './app-layout.styles.js';
import type { AppLayoutProps } from './app-layout.types.js';

export type { AppLayoutProps } from './app-layout.types.js';
```

**Component structure**:

1. `AppLayout` renders `SidebarProvider` as the outermost wrapper, passing through `defaultOpen`, `open`, and `onOpenChange`.
2. Inside SidebarProvider, render an inner `AppLayoutInner` component (private, non-exported) that uses `useSidebar()` and `useMediaQuery('(min-width: 768px)')`.
3. Inner component renders:
   - **Desktop (≥768px)**: `SidebarContent` wrapping the `sidebar` prop, followed by the main region
   - **Mobile (<768px)**: A `Sheet` (open state tied to sidebar's `open` via `useSidebar()`) rendering the `sidebar` prop inside `SheetContent` with `side="left"`
4. Main region is a `<div>` with `flex flex-1 flex-col overflow-hidden`:
   - If `header` prop is provided, render it directly
   - `ScrollArea` wrapping `children` with `className="flex-1"`

**Detailed implementation**:

```typescript
export function AppLayout({
  className,
  sidebar,
  header,
  children,
  defaultOpen,
  open,
  onOpenChange,
  ref,
  ...props
}: AppLayoutProps): React.JSX.Element {
  return (
    <SidebarProvider defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
      <AppLayoutInner
        className={className}
        sidebar={sidebar}
        header={header}
        ref={ref}
        {...props}
      >
        {children}
      </AppLayoutInner>
    </SidebarProvider>
  );
}

// Private inner component — needs useSidebar() which requires SidebarProvider ancestor
function AppLayoutInner({
  className,
  sidebar,
  header,
  children,
  ref,
  ...props
}: Omit<AppLayoutProps, 'defaultOpen' | 'open' | 'onOpenChange'>): React.JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { open, toggleSidebar } = useSidebar();

  return (
    <div
      data-slot="app-layout"
      className={cn(appLayoutVariants({ className }))}
      ref={ref}
      {...props}
    >
      {isDesktop ? (
        <SidebarContent>{sidebar}</SidebarContent>
      ) : (
        <Sheet open={open} onOpenChange={toggleSidebar}>
          <SheetContent side="left" className="w-64 p-0">
            {sidebar}
          </SheetContent>
        </Sheet>
      )}
      <div className="flex flex-1 flex-col overflow-hidden">
        {header}
        <ScrollArea className="flex-1">{children}</ScrollArea>
      </div>
    </div>
  );
}
```

**Key decisions**:

- `AppLayoutInner` is a separate non-exported function (not a constant) to use `useSidebar()` which requires being inside `SidebarProvider`.
- On mobile, the Sheet's `open` state is driven by the same sidebar context (`useSidebar`). Calling `toggleSidebar` in `onOpenChange` ensures the Sheet close button and overlay click properly sync with sidebar state.
- The Sheet uses `side="left"` since the sidebar is always on the left.
- `SheetContent` gets `w-64 p-0` to match the desktop sidebar width and remove Sheet's default padding.
- `ScrollArea` wraps `children` with `flex-1` to fill the remaining vertical space.
- Does NOT support `asChild` — it is a structural composition component per the phase spec.

### 3.4 `app-layout.test.tsx`

**Purpose**: Unit and accessibility tests.

See section 5 for full test plan.

### 3.5 `app-layout.stories.tsx`

**Purpose**: Storybook documentation with interactive examples.

**Exports**: `default` (meta), `Default`, `CollapsedSidebar`, `WithHeaderAndSidebar`, `FullShell`, `MobileView`

**Implementation notes**:

- Import `Header` from sibling component, `Button` for action slots, `SidebarGroup`, `SidebarGroupLabel`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton` for sidebar content
- Each story renders `AppLayout` with a realistic sidebar (navigation items) and header content
- `MobileView` uses Storybook viewport parameters: `parameters: { viewport: { defaultViewport: 'mobile1' } }`
- `CollapsedSidebar` passes `defaultOpen={false}`
- `FullShell` shows all slots populated with realistic content

### 3.6 `packages/ui/src/index.ts` modification

Add the following lines:

```typescript
export { AppLayout, type AppLayoutProps } from './components/app-layout/app-layout.js';
export { appLayoutVariants } from './components/app-layout/app-layout.styles.js';
```

## 4. API Contracts

### AppLayout Props

| Prop           | Type                        | Default                      | Description                               |
| -------------- | --------------------------- | ---------------------------- | ----------------------------------------- |
| `sidebar`      | `React.ReactNode`           | `undefined`                  | Content rendered in the sidebar region    |
| `header`       | `React.ReactNode`           | `undefined`                  | Content rendered in the header area       |
| `children`     | `React.ReactNode`           | `undefined`                  | Main content area (wrapped in ScrollArea) |
| `defaultOpen`  | `boolean`                   | `true` (via SidebarProvider) | Initial sidebar open state (uncontrolled) |
| `open`         | `boolean`                   | `undefined`                  | Controlled sidebar open state             |
| `onOpenChange` | `(open: boolean) => void`   | `undefined`                  | Fired when sidebar state changes          |
| `className`    | `string`                    | `undefined`                  | Merged onto root `<div>` via `cn()`       |
| `ref`          | `React.Ref<HTMLDivElement>` | `undefined`                  | Forwarded to root `<div>`                 |

### Usage example

```tsx
import { AppLayout } from '@components/ui';
import { Header } from '@components/ui';
import { SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@components/ui';

function App() {
  return (
    <AppLayout
      sidebar={
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>Settings</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      }
      header={<Header>My Application</Header>}
    >
      <div className="p-6">
        <h1>Page Content</h1>
      </div>
    </AppLayout>
  );
}
```

## 5. Test Plan

### Test setup

- `vitest` + `@testing-library/react` + `vitest-axe`
- Mock `useMediaQuery` from `@components/hooks` to control responsive behavior: `vi.mock('@components/hooks', () => ({ useMediaQuery: vi.fn() }))`
- The mock lets tests explicitly set desktop vs mobile mode without needing `window.matchMedia`
- Import `useMediaQuery` as a mocked function and set return values per test

### Per-test specification

| #   | Test Name                               | Description                                                                                                                                                                                                              |
| --- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `renders with default props`            | Render `<AppLayout>Content</AppLayout>` with desktop mock. Assert root element is in the document and contains "Content".                                                                                                |
| 2   | `has data-slot attribute`               | Render AppLayout. Assert root element has `data-slot="app-layout"`.                                                                                                                                                      |
| 3   | `renders sidebar content on desktop`    | Set `useMediaQuery` to return `true` (desktop). Render with `sidebar={<nav data-testid="sidebar-nav">Nav</nav>}`. Assert `getByTestId('sidebar-nav')` is in the document. Assert `[data-slot="sidebar-content"]` exists. |
| 4   | `renders sidebar in Sheet on mobile`    | Set `useMediaQuery` to return `false` (mobile). Render with `sidebar={<nav data-testid="sidebar-nav">Nav</nav>}`. Assert sidebar renders within Sheet (check for `[data-slot="sheet-content"]`).                         |
| 5   | `renders header when provided`          | Render with `header={<header data-testid="app-header">Title</header>}`. Assert `getByTestId('app-header')` is in the document.                                                                                           |
| 6   | `renders children in scrollable area`   | Render with children `<div data-testid="main-content">Main</div>`. Assert content is in the document. Assert `[data-slot="scroll-area"]` exists.                                                                         |
| 7   | `passes defaultOpen to SidebarProvider` | Render with `defaultOpen={false}` and desktop mock. Assert sidebar content element has collapsed styling (collapsed state: `w-0`).                                                                                       |
| 8   | `merges custom className`               | Render with `className="custom-class"`. Assert root element has both `custom-class` and the base flex classes.                                                                                                           |
| 9   | `has no accessibility violations`       | Render a full AppLayout with sidebar, header, and children. Run `axe()` on the container. Assert `toHaveNoViolations()`.                                                                                                 |

### Mock strategy

```typescript
import { vi } from 'vitest';
import { useMediaQuery } from '@components/hooks';

vi.mock('@components/hooks', () => ({
  useMediaQuery: vi.fn(),
}));

const mockedUseMediaQuery = vi.mocked(useMediaQuery);

// In each test:
mockedUseMediaQuery.mockReturnValue(true); // desktop
mockedUseMediaQuery.mockReturnValue(false); // mobile
```

## 6. Implementation Order

1. **Add `@components/hooks` dependency** — Run `pnpm --filter @components/ui add @components/hooks@"workspace:*"` to add `useMediaQuery` as a dependency.

2. **Merge Phase 2 Sidebar code** — The Sidebar components from `phase/m03-p02` must be available on the current branch. Either merge `phase/m03-p02` into the current branch or cherry-pick the Sidebar component files. Without `SidebarProvider`, `SidebarContent`, and `useSidebar`, AppLayout cannot be implemented.

3. **Create `app-layout.types.ts`** — Define `AppLayoutProps` type.

4. **Create `app-layout.styles.ts`** — Define `appLayoutVariants` CVA with base styles.

5. **Create `app-layout.tsx`** — Implement `AppLayout` and `AppLayoutInner` components.

6. **Create `app-layout.test.tsx`** — Write all tests with `useMediaQuery` mocking.

7. **Create `app-layout.stories.tsx`** — Write Storybook stories.

8. **Update `packages/ui/src/index.ts`** — Add AppLayout exports.

9. **Run verification commands** — typecheck, test, and build.

## 7. Verification Commands

```bash
# Install the new workspace dependency
pnpm --filter @components/ui add @components/hooks@"workspace:*"

# Type-check the entire monorepo
pnpm typecheck

# Run all tests (includes the new app-layout tests)
pnpm test

# Run only the new app-layout tests
pnpm --filter @components/ui test -- --testPathPattern=app-layout

# Build the UI package
pnpm build

# Lint check
pnpm lint
```

## 8. Design Deviations

### Deviation 1: Sheet `onOpenChange` wiring

**Parent spec requires**: "On viewports below `md` (768px): sidebar renders as a Sheet overlay (mobile pattern)" with sidebar state driven by `useSidebar` hook.

**Issue**: The `Sheet` component (wrapping `@radix-ui/react-dialog`) fires `onOpenChange` with a boolean value, but `useSidebar().toggleSidebar()` takes no arguments — it simply flips the state. Passing `toggleSidebar` directly to `Sheet`'s `onOpenChange` works because Dialog calls `onOpenChange(false)` when closing, which triggers `toggleSidebar()` to flip the state. However, this creates a subtle bug: if the Sheet is already closed and `onOpenChange(false)` fires (e.g., from an overlay click during animation), `toggleSidebar()` would re-open it.

**Alternative chosen**: Instead of passing `toggleSidebar` to `Sheet`'s `onOpenChange`, pass an inline function that only calls `toggleSidebar()` when the Sheet requests a state change that differs from the current sidebar state. Specifically, since closing the Sheet fires `onOpenChange(false)`, we guard: `onOpenChange={(sheetOpen) => { if (sheetOpen !== open) toggleSidebar(); }}`. This prevents stale toggles. The `open` prop on `Sheet` is set to the sidebar context's `open` value, keeping the two in sync.

### Deviation 2: `useMediaQuery` returns `false` on initial SSR/hydration render

**Parent spec requires**: Responsive behavior with `useMediaQuery` from `@components/hooks`.

**Issue**: The `useMediaQuery` hook initializes with `useState(false)` before the `useEffect` runs. This means on the first render, `isDesktop` will be `false` (mobile mode), then flip to `true` on desktop after mount. This causes a brief flash of mobile layout on desktop.

**Alternative chosen**: This is acceptable behavior for a client-side rendered component library (all consumer apps are CSR React SPAs). The flash is a single frame and is standard for media query hooks. No deviation in implementation is needed — this is documented for awareness. If SSR support is needed in the future, the hook can be updated to accept an initial value parameter.
