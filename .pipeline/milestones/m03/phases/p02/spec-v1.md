I now have complete context. Here is the phase specification:

# Phase 2: Navigation — Specification

## Goal

Implement three navigation components — Breadcrumb, Sidebar, and Resizable — that provide wayfinding via semantic breadcrumb trails, a collapsible sidebar with nested menu structure using `sidebar-*` design tokens, and drag-to-resize panel layouts via `react-resizable-panels`, enabling consumer apps to build structured, navigable application interfaces.

## Design Decisions

### Breadcrumb

- **No Radix primitive.** Breadcrumb is built on semantic HTML (`<nav aria-label="breadcrumb">`, `<ol>`, `<li>`) following the shadcn/ui reference. This is the correct approach as WAI-ARIA breadcrumb guidance requires native list semantics.
- **`asChild` on BreadcrumbLink.** Uses `@radix-ui/react-slot` (already installed) so consumers can pass router-aware `<Link>` components (e.g., React Router, Next.js) without wrapper elements.
- **BreadcrumbEllipsis.** Renders a static `<span>` with an inline SVG ellipsis icon (three dots), not an interactive element. Consumers compose it with DropdownMenu (Milestone 5) when they need a truncation popover.
- **Separator as prop.** BreadcrumbSeparator renders a chevron-right SVG by default but accepts `children` to override with a custom separator character or icon.

### Sidebar

- **Context-based architecture.** `SidebarProvider` creates a React context holding the collapsed/expanded state (`open: boolean`) and a `toggleSidebar()` function. All child components read from this context.
- **`sidebar-*` CSS tokens.** The eight sidebar tokens (`--sidebar-background`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-primary-foreground`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-border`, `--sidebar-ring`) are already defined in `globals.css` for both light and dark themes. The Sidebar component tree maps to these tokens via Tailwind classes (`bg-sidebar-background`, `text-sidebar-foreground`, etc.).
- **Composes existing components.** SidebarMenuButton wraps the existing `Button` component (M01). Collapsible menu sections use the existing `Collapsible`, `CollapsibleTrigger`, and `CollapsibleContent` components (M01). Scrollable sidebar content uses `ScrollArea` (M03/P01).
- **Keyboard shortcut.** `SidebarProvider` registers a global `keydown` listener for `Cmd+B` (macOS) / `Ctrl+B` (other platforms) to toggle sidebar state. The listener is cleaned up on unmount.
- **Cookie/localStorage persistence.** The sidebar stores its collapsed state in a cookie (`sidebar_state`) for SSR compatibility, following the shadcn/ui pattern. Falls back to `defaultOpen` prop on first render.
- **Variant support.** The sidebar supports `variant` ("sidebar" | "floating" | "inset") and `collapsible` ("offcanvas" | "icon" | "none") props matching shadcn/ui's Sidebar API. The `side` prop ("left" | "right") controls placement.
- **No inline SVG icons for trigger.** `SidebarTrigger` uses the existing Button component with `variant="ghost"` and `size="icon"`, rendering an inline SVG hamburger/panel icon.

### Resizable

- **`react-resizable-panels` wrapping.** This is a thin wrapper around the `react-resizable-panels` library, following the shadcn/ui pattern exactly. The library handles all drag, keyboard, and persistence logic.
- **New dependency.** `react-resizable-panels` must be installed in `packages/ui/package.json` as a runtime dependency.
- **ResizableHandle grip indicator.** The handle renders an optional drag grip (six-dot pattern) via inline SVG when `withHandle` prop is true, matching shadcn/ui's visual design.
- **Orientation.** `ResizablePanelGroup` accepts a `direction` prop ("horizontal" | "vertical") passed through to the underlying `PanelGroup`.

## Tasks

### Task 1: Install `react-resizable-panels` dependency

**Deliverables:**

- Add `react-resizable-panels` to `packages/ui/package.json` under `dependencies`
- Run `pnpm install` to update the lockfile
- Verify the package resolves correctly

### Task 2: Breadcrumb component

**Deliverables:**

- `packages/ui/src/components/breadcrumb/breadcrumb.tsx` — Implementation of all sub-components:
  - `Breadcrumb` — `<nav aria-label="breadcrumb">` root element with `data-slot="breadcrumb"`
  - `BreadcrumbList` — `<ol>` with flex layout, gap, and `text-muted-foreground` styling
  - `BreadcrumbItem` — `<li>` with inline-flex alignment
  - `BreadcrumbLink` — `<a>` element supporting `asChild` via `@radix-ui/react-slot` for router integration, with hover transition to `text-foreground`
  - `BreadcrumbPage` — `<span role="link" aria-disabled="true" aria-current="page">` for the current page (non-interactive)
  - `BreadcrumbSeparator` — `<li role="presentation" aria-hidden="true">` rendering a chevron-right SVG by default, accepting `children` for custom separators
  - `BreadcrumbEllipsis` — `<span>` with three-dot SVG icon and `sr-only` "More" label
- `packages/ui/src/components/breadcrumb/breadcrumb.styles.ts` — CVA/static styles for list, item, link, page, separator, and ellipsis
- `packages/ui/src/components/breadcrumb/breadcrumb.types.ts` — Props types extending `React.ComponentProps<'nav'>`, `React.ComponentProps<'ol'>`, `React.ComponentProps<'li'>`, `React.ComponentProps<'a'>`, `React.ComponentProps<'span'>` as appropriate; `BreadcrumbLinkProps` includes `asChild?: boolean`
- `packages/ui/src/components/breadcrumb/breadcrumb.test.tsx` — Tests: smoke render with all sub-components, `aria-current="page"` on BreadcrumbPage, separator renders between items, `asChild` renders custom link element, `data-slot` attributes present, className merging, vitest-axe accessibility pass
- `packages/ui/src/components/breadcrumb/breadcrumb.stories.tsx` — Stories: Default (3-level breadcrumb), WithCustomSeparator (slash character), WithEllipsis (collapsed middle items), WithRouterLink (asChild demo), ResponsiveCollapsed
- Exports added to `packages/ui/src/index.ts`

### Task 3: Sidebar component

**Deliverables:**

- `packages/ui/src/components/sidebar/sidebar.tsx` — Implementation of all sub-components:
  - `SidebarProvider` — Context provider managing `open` state, `toggleSidebar()`, keyboard shortcut listener (`Cmd+B`/`Ctrl+B`), and cookie-based state persistence. Accepts `defaultOpen` (default `true`), `open` (controlled), `onOpenChange` callback, `style` prop for `--sidebar-width` and `--sidebar-width-icon` CSS variables
  - `Sidebar` — Root `<aside>` element using `sidebar-*` token classes. Props: `side` ("left" | "right"), `variant` ("sidebar" | "floating" | "inset"), `collapsible` ("offcanvas" | "icon" | "none")
  - `SidebarTrigger` — Button with `variant="ghost"` and `size="icon"` that calls `toggleSidebar()` from context, renders an inline SVG panel icon
  - `SidebarRail` — Thin hover-interactive strip on the sidebar edge for quick toggle
  - `SidebarInset` — Main content wrapper used alongside the sidebar (a styled `<main>` element)
  - `SidebarContent` — Scrollable container (composes `ScrollArea` from P01) for menu groups
  - `SidebarGroup` — Grouping container (`<div>`) for related menu items
  - `SidebarGroupLabel` — Group heading label (`<div>` with `text-sidebar-foreground/70` styling), supports `asChild`
  - `SidebarGroupAction` — Action button positioned at the group header's trailing edge, supports `asChild`
  - `SidebarGroupContent` — Wrapper for group items
  - `SidebarMenu` — `<ul>` for menu item list
  - `SidebarMenuItem` — `<li>` for a single menu entry
  - `SidebarMenuButton` — Interactive button/link with `data-active` and `data-size` attributes, supports `asChild` for router link composition, variant ("default" | "outline") and size ("sm" | "default" | "lg") props, tooltip integration when sidebar is collapsed to icon mode
  - `SidebarMenuAction` — Trailing action button on a menu item (e.g., "..." more button)
  - `SidebarMenuSub` — Nested `<ul>` for sub-menu items
  - `SidebarMenuSubItem` — `<li>` for nested sub-menu entry
  - `SidebarMenuSubButton` — Button/link for sub-menu items, supports `asChild`
  - `SidebarMenuSkeleton` — Loading placeholder skeleton for menu items
  - `SidebarMenuBadge` — Badge rendered at the trailing edge of a menu item
  - `SidebarHeader` — Container at the top of the sidebar
  - `SidebarFooter` — Container at the bottom of the sidebar
  - `SidebarSeparator` — Themed separator using existing Separator component
  - `useSidebar` — Hook to access sidebar context from any descendant
- `packages/ui/src/components/sidebar/sidebar.styles.ts` — CVA variants for SidebarMenuButton (variant × size), static style constants for all other sub-components
- `packages/ui/src/components/sidebar/sidebar.types.ts` — Props types for all sub-components; `SidebarProviderProps` extends `React.ComponentProps<'div'>` with `defaultOpen?`, `open?`, `onOpenChange?`; `SidebarProps` extends `React.ComponentProps<'aside'>` with `side?`, `variant?`, `collapsible?`; menu button props include `asChild?`, `variant?`, `size?`, `isActive?`, `tooltip?`
- `packages/ui/src/components/sidebar/sidebar.test.tsx` — Tests: renders sidebar with content, toggles collapse state on trigger click, keyboard shortcut toggles sidebar, menu button renders active state, `asChild` renders custom elements, `SidebarProvider` provides context via `useSidebar`, sidebar-\* token classes applied, `data-slot` attributes present, className merging, vitest-axe accessibility pass
- `packages/ui/src/components/sidebar/sidebar.stories.tsx` — Stories: Default (expanded), Collapsed (icon mode), RightSide, FloatingVariant, InsetVariant, WithNestedMenus (using Collapsible), WithSkeleton (loading state)
- Exports added to `packages/ui/src/index.ts`

### Task 4: Resizable component

**Deliverables:**

- `packages/ui/src/components/resizable/resizable.tsx` — Implementation of:
  - `ResizablePanelGroup` — Wraps `PanelGroup` from `react-resizable-panels` with `data-slot="resizable-panel-group"` and themed border/styling
  - `ResizablePanel` — Re-exports `Panel` from `react-resizable-panels` with `data-slot="resizable-panel"`
  - `ResizableHandle` — Wraps `PanelResizeHandle` from `react-resizable-panels` with `data-slot="resizable-handle"`, themed styling using `bg-border` token, focus ring with `ring-ring`, and optional `withHandle` prop that renders a six-dot grip indicator via inline SVG
- `packages/ui/src/components/resizable/resizable.styles.ts` — Static styles for panel group and handle; CVA variant for handle orientation (horizontal/vertical grip positioning)
- `packages/ui/src/components/resizable/resizable.types.ts` — `ResizablePanelGroupProps` extending the library's `PanelGroupProps` with `className?`; `ResizablePanelProps` as the library's `PanelProps`; `ResizableHandleProps` extending the library's `PanelResizeHandleProps` with `withHandle?: boolean` and `className?`
- `packages/ui/src/components/resizable/resizable.test.tsx` — Tests: renders panel group with two panels, handle renders between panels, `withHandle` renders grip indicator, orientation classes applied for horizontal/vertical, `data-slot` attributes present, className merging, vitest-axe accessibility pass
- `packages/ui/src/components/resizable/resizable.stories.tsx` — Stories: Horizontal (two panels), Vertical (stacked panels), WithHandle (grip indicator), ThreePanels, NestedGroups
- Exports added to `packages/ui/src/index.ts`

### Task 5: Integration verification

**Deliverables:**

- `pnpm typecheck` passes with zero errors
- `pnpm test` passes with all new tests passing (including vitest-axe assertions)
- `pnpm build` produces clean output
- All three components render correctly in Storybook
- Verify all exports are present in `packages/ui/src/index.ts`

## Exit Criteria

1. All 3 components (Breadcrumb, Sidebar, Resizable) render correctly in Storybook with all variants documented via autodocs
2. `pnpm test` passes with vitest-axe accessibility assertions for every component
3. `pnpm typecheck` passes with zero errors
4. `pnpm build` completes with zero errors
5. Breadcrumb renders semantic `<nav>` > `<ol>` > `<li>` markup with `aria-label="breadcrumb"` and `aria-current="page"` on the active item
6. BreadcrumbLink `asChild` correctly renders a consumer-provided router link element
7. Sidebar collapses and expands via `SidebarTrigger` click
8. Sidebar collapses and expands via keyboard shortcut (`Cmd+B` / `Ctrl+B`)
9. Sidebar uses `sidebar-*` semantic token classes for all surface colors
10. Sidebar `useSidebar` hook provides `open` state and `toggleSidebar` to descendants
11. Resizable panels support drag-to-resize with the `react-resizable-panels` library
12. ResizableHandle renders a visible grip indicator when `withHandle` is true
13. All components use `data-slot` attributes on root elements
14. All components and their types are exported from `packages/ui/src/index.ts`

## Dependencies

1. **Phase 1 (Content Containers) — complete.** ScrollArea is composed by SidebarContent for scrollable menu areas. Sheet, Tabs, and Accordion are not directly used but their completion confirms the M03 infrastructure is working.
2. **Milestone 1 components:**
   - `Button` — composed by SidebarTrigger (`variant="ghost"`, `size="icon"`)
   - `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent` — composed by Sidebar for collapsible nested menu sections
   - `Separator` — composed by SidebarSeparator
   - `Skeleton` — composed by SidebarMenuSkeleton
3. **Milestone 2 components:**
   - `Input` — optionally composed by SidebarContent for search (not required, but available)
4. **`@radix-ui/react-slot`** — already installed; used by BreadcrumbLink and several Sidebar sub-components for `asChild` support
5. **`sidebar-*` CSS tokens** — already defined in `packages/ui/styles/globals.css` (8 tokens, light + dark)
6. **`react-resizable-panels`** — must be installed (Task 1)

## Artifacts

### Created

| File                                                           | Description                                                  |
| -------------------------------------------------------------- | ------------------------------------------------------------ |
| `packages/ui/src/components/breadcrumb/breadcrumb.tsx`         | Breadcrumb implementation (7 sub-components)                 |
| `packages/ui/src/components/breadcrumb/breadcrumb.styles.ts`   | Breadcrumb CVA/static styles                                 |
| `packages/ui/src/components/breadcrumb/breadcrumb.types.ts`    | Breadcrumb TypeScript props                                  |
| `packages/ui/src/components/breadcrumb/breadcrumb.test.tsx`    | Breadcrumb tests with vitest-axe                             |
| `packages/ui/src/components/breadcrumb/breadcrumb.stories.tsx` | Breadcrumb Storybook stories                                 |
| `packages/ui/src/components/sidebar/sidebar.tsx`               | Sidebar implementation (22 sub-components + useSidebar hook) |
| `packages/ui/src/components/sidebar/sidebar.styles.ts`         | Sidebar CVA variants and static styles                       |
| `packages/ui/src/components/sidebar/sidebar.types.ts`          | Sidebar TypeScript props                                     |
| `packages/ui/src/components/sidebar/sidebar.test.tsx`          | Sidebar tests with vitest-axe                                |
| `packages/ui/src/components/sidebar/sidebar.stories.tsx`       | Sidebar Storybook stories                                    |
| `packages/ui/src/components/resizable/resizable.tsx`           | Resizable implementation (3 sub-components)                  |
| `packages/ui/src/components/resizable/resizable.styles.ts`     | Resizable CVA/static styles                                  |
| `packages/ui/src/components/resizable/resizable.types.ts`      | Resizable TypeScript props                                   |
| `packages/ui/src/components/resizable/resizable.test.tsx`      | Resizable tests with vitest-axe                              |
| `packages/ui/src/components/resizable/resizable.stories.tsx`   | Resizable Storybook stories                                  |

### Modified

| File                       | Change                                                                                                                                     |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `packages/ui/package.json` | Add `react-resizable-panels` to `dependencies`                                                                                             |
| `packages/ui/src/index.ts` | Add exports for Breadcrumb (7 components + types), Sidebar (22 components + hook + types + CVA variants), Resizable (3 components + types) |
| `pnpm-lock.yaml`           | Updated with `react-resizable-panels` resolution                                                                                           |
