Now I have all the context needed. Let me produce the revised specification addressing every feedback issue.

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

- **Scoped to the 8 sub-components listed in the parent specs.** The milestone locked spec and phase seed spec explicitly list: SidebarProvider, SidebarTrigger, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton. This phase implements exactly these 8 sub-components plus a `useSidebar` hook to access context (required for any descendant to read collapse state). Additional sub-components (SidebarRail, SidebarInset, SidebarHeader, SidebarFooter, SidebarMenuSub, etc.) are deferred to a future scope expansion if needed.
- **Context-based architecture.** `SidebarProvider` creates a React context holding the collapsed/expanded state (`open: boolean`) and a `toggleSidebar()` function. All child components read from this context. The `useSidebar` hook is the public API for accessing this context.
- **Controlled and uncontrolled modes.** `SidebarProvider` accepts `defaultOpen` (default `true`) for uncontrolled usage and `open` + `onOpenChange` for controlled usage. No persistence mechanism (no cookies, no localStorage) — state management and persistence are the consumer app's responsibility.
- **No variant/collapsible prop enums.** The parent specs specify "collapsible behavior" without mentioning variant modes (`floating`, `inset`) or collapsible modes (`offcanvas`, `icon`). This phase implements a single collapsible sidebar that transitions between expanded and collapsed states. The collapsed state hides the sidebar content (width transitions to 0). Advanced modes can be added in a future phase if needed.
- **`sidebar-*` CSS tokens.** The eight sidebar tokens (`--sidebar-background`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-primary-foreground`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-border`, `--sidebar-ring`) are already defined in `globals.css` for both light and dark themes. The Sidebar component tree maps to these tokens via Tailwind classes (`bg-sidebar-background`, `text-sidebar-foreground`, etc.).
- **Composes existing components.** Collapsible menu sections use the existing `Collapsible`, `CollapsibleTrigger`, and `CollapsibleContent` components (M01). Scrollable sidebar content uses `ScrollArea` (M03/P01).
- **Keyboard shortcut.** `SidebarProvider` registers a global `keydown` listener for `Cmd+B` (macOS) / `Ctrl+B` (other platforms) to toggle sidebar state. The listener is cleaned up on unmount.
- **No tooltip integration.** SidebarMenuButton does not include tooltip support. The Tooltip component is part of Milestone 4 and is not yet available. Tooltip integration can be added as an enhancement after M04 is complete.
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

- `packages/ui/src/components/sidebar/sidebar.tsx` — Implementation of 8 sub-components + hook:
  - `SidebarProvider` — Context provider managing `open` state and `toggleSidebar()` function. Accepts `defaultOpen` (default `true`), `open` (controlled), `onOpenChange` callback. Registers keyboard shortcut listener (`Cmd+B`/`Ctrl+B`) on mount, cleans up on unmount. Renders a wrapping `<div>` with `data-slot="sidebar-provider"`
  - `SidebarTrigger` — Button with `variant="ghost"` and `size="icon"` that calls `toggleSidebar()` from context, renders an inline SVG panel icon. `data-slot="sidebar-trigger"`
  - `SidebarContent` — Scrollable container (composes `ScrollArea` from P01) for menu groups. `data-slot="sidebar-content"`
  - `SidebarGroup` — Grouping container (`<div>`) for related menu items. `data-slot="sidebar-group"`
  - `SidebarGroupLabel` — Group heading label (`<div>` with `text-sidebar-foreground/70` styling), supports `asChild`. `data-slot="sidebar-group-label"`
  - `SidebarMenu` — `<ul>` for menu item list. `data-slot="sidebar-menu"`
  - `SidebarMenuItem` — `<li>` for a single menu entry. `data-slot="sidebar-menu-item"`
  - `SidebarMenuButton` — Interactive button/link with `data-active` attribute for active state styling. Supports `asChild` for router link composition, `variant` ("default" | "outline") and `size` ("sm" | "default" | "lg") props. `data-slot="sidebar-menu-button"`
  - `useSidebar` — Hook to access sidebar context (`open`, `toggleSidebar`) from any descendant. Throws if used outside `SidebarProvider`
- `packages/ui/src/components/sidebar/sidebar.styles.ts` — CVA variants for SidebarMenuButton (variant × size), static style constants for all other sub-components using `sidebar-*` token classes
- `packages/ui/src/components/sidebar/sidebar.types.ts` — Props types for all 8 sub-components; `SidebarProviderProps` extends `React.ComponentProps<'div'>` with `defaultOpen?: boolean`, `open?: boolean`, `onOpenChange?: (open: boolean) => void`; `SidebarMenuButtonProps` extends `React.ComponentProps<'button'>` with `asChild?: boolean`, `variant?: 'default' | 'outline'`, `size?: 'sm' | 'default' | 'lg'`, `isActive?: boolean`; `SidebarGroupLabelProps` includes `asChild?: boolean`
- `packages/ui/src/components/sidebar/sidebar.test.tsx` — Tests: renders sidebar with content, toggles collapse state on trigger click, keyboard shortcut toggles sidebar, menu button renders active state, `asChild` renders custom elements, `SidebarProvider` provides context via `useSidebar`, `sidebar-*` token classes applied, `data-slot` attributes present, className merging, vitest-axe accessibility pass
- `packages/ui/src/components/sidebar/sidebar.stories.tsx` — Stories: Default (expanded with menu groups), Collapsed (triggered via click), WithNestedMenus (using Collapsible from M01), ControlledState (open/onOpenChange demo)
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
- All three components render correctly in Storybook
- Verify all exports are present in `packages/ui/src/index.ts`

## Exit Criteria

1. All 3 components (Breadcrumb, Sidebar, Resizable) render correctly in Storybook with all variants documented via autodocs
2. `pnpm test` passes with vitest-axe accessibility assertions for every component
3. `pnpm typecheck` passes with zero errors
4. Breadcrumb renders semantic `<nav>` > `<ol>` > `<li>` markup with `aria-label="breadcrumb"` and `aria-current="page"` on the active item
5. BreadcrumbLink `asChild` correctly renders a consumer-provided router link element
6. Sidebar collapses and expands via `SidebarTrigger` click
7. Sidebar collapses and expands via keyboard shortcut (`Cmd+B` / `Ctrl+B`)
8. Sidebar uses `sidebar-*` semantic token classes for all surface colors
9. Sidebar `useSidebar` hook provides `open` state and `toggleSidebar` to descendants
10. Resizable panels support drag-to-resize with the `react-resizable-panels` library
11. ResizableHandle renders a visible grip indicator when `withHandle` is true
12. All components use `data-slot` attributes on root elements
13. All components and their types are exported from `packages/ui/src/index.ts`

## Dependencies

1. **Phase 1 (Content Containers) — complete.** ScrollArea is composed by SidebarContent for scrollable menu areas. Sheet, Tabs, and Accordion are not directly used but their completion confirms the M03 infrastructure is working.
2. **Milestone 1 components:**
   - `Button` — composed by SidebarTrigger (`variant="ghost"`, `size="icon"`)
   - `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent` — composed by Sidebar for collapsible nested menu sections (shown in stories, not a core sub-component)
   - `Separator` — available for use in sidebar layouts but not a hard dependency
3. **`@radix-ui/react-slot`** — already installed; used by BreadcrumbLink and SidebarMenuButton/SidebarGroupLabel for `asChild` support
4. **`sidebar-*` CSS tokens** — already defined in `packages/ui/styles/globals.css` (8 tokens, light + dark)
5. **`react-resizable-panels`** — must be installed (Task 1)

## Artifacts

### Created

| File                                                           | Description                                                 |
| -------------------------------------------------------------- | ----------------------------------------------------------- |
| `packages/ui/src/components/breadcrumb/breadcrumb.tsx`         | Breadcrumb implementation (7 sub-components)                |
| `packages/ui/src/components/breadcrumb/breadcrumb.styles.ts`   | Breadcrumb CVA/static styles                                |
| `packages/ui/src/components/breadcrumb/breadcrumb.types.ts`    | Breadcrumb TypeScript props                                 |
| `packages/ui/src/components/breadcrumb/breadcrumb.test.tsx`    | Breadcrumb tests with vitest-axe                            |
| `packages/ui/src/components/breadcrumb/breadcrumb.stories.tsx` | Breadcrumb Storybook stories                                |
| `packages/ui/src/components/sidebar/sidebar.tsx`               | Sidebar implementation (8 sub-components + useSidebar hook) |
| `packages/ui/src/components/sidebar/sidebar.styles.ts`         | Sidebar CVA variants and static styles                      |
| `packages/ui/src/components/sidebar/sidebar.types.ts`          | Sidebar TypeScript props                                    |
| `packages/ui/src/components/sidebar/sidebar.test.tsx`          | Sidebar tests with vitest-axe                               |
| `packages/ui/src/components/sidebar/sidebar.stories.tsx`       | Sidebar Storybook stories                                   |
| `packages/ui/src/components/resizable/resizable.tsx`           | Resizable implementation (3 sub-components)                 |
| `packages/ui/src/components/resizable/resizable.styles.ts`     | Resizable CVA/static styles                                 |
| `packages/ui/src/components/resizable/resizable.types.ts`      | Resizable TypeScript props                                  |
| `packages/ui/src/components/resizable/resizable.test.tsx`      | Resizable tests with vitest-axe                             |
| `packages/ui/src/components/resizable/resizable.stories.tsx`   | Resizable Storybook stories                                 |

### Modified

| File                       | Change                                                                                                                                    |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/ui/package.json` | Add `react-resizable-panels` to `dependencies`                                                                                            |
| `packages/ui/src/index.ts` | Add exports for Breadcrumb (7 components + types), Sidebar (8 components + hook + types + CVA variants), Resizable (3 components + types) |
| `pnpm-lock.yaml`           | Updated with `react-resizable-panels` resolution                                                                                          |
