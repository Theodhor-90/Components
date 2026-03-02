## Phase 2: Navigation

### Goal

Implement three navigation components — Breadcrumb, Sidebar, and Resizable — that provide wayfinding, sidebar navigation with collapsible behavior, and resizable panel layouts for building structured application interfaces.

### Deliverables

- **Breadcrumb** — shadcn port using semantic `<nav>` and `<ol>` markup. Sub-components: BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis. BreadcrumbLink supports `asChild` for router integration.
- **Sidebar** — shadcn port with collapsible behavior using the `sidebar-*` CSS custom properties. Sub-components: SidebarProvider, SidebarTrigger, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton. Provides a context for collapse state toggled by SidebarTrigger or keyboard shortcut (`Cmd+B` on macOS, `Ctrl+B` on other platforms).
- **Resizable** — shadcn port wrapping `react-resizable-panels`. Sub-components: ResizablePanelGroup, ResizablePanel, ResizableHandle. Supports horizontal and vertical orientations with drag-to-resize and keyboard arrow key resizing.

Each component follows the 5-file pattern (`*.tsx`, `*.styles.ts`, `*.types.ts`, `*.test.tsx`, `*.stories.tsx`). All components must be exported from `packages/ui/src/index.ts`.

### Technical Decisions & Constraints

- Breadcrumb uses no Radix primitive — it is built on semantic HTML (`<nav>`, `<ol>`, `<li>`) with `asChild` via `@radix-ui/react-slot` for router link integration.
- Sidebar uses the `sidebar-*` CSS custom properties already defined in `globals.css`: `--sidebar-background`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-primary-foreground`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-border`, `--sidebar-ring` (defined for both light and dark themes).
- Sidebar composes the Collapsible component from Milestone 1 for collapsible menu sections.
- `react-resizable-panels` must be installed as a new dependency in `packages/ui`.
- Follow React 19 conventions: ref-as-prop (no forwardRef), `data-slot` attributes, `cn()` for class merging.
- Storybook stories use CSF3 format with `tags: ['autodocs']`.
- Tests include vitest-axe accessibility assertions.

### Exit Criteria (phase-specific)

1. All 3 components render correctly in Storybook with all variants documented
2. `pnpm test` passes with vitest-axe accessibility assertions for every component
3. `pnpm typecheck` passes with no errors
4. Sidebar collapses and expands with keyboard shortcut support
5. Resizable panels support drag-to-resize with keyboard fallback

### Dependencies

- **Phase 1 (Content Containers)** — must be complete. The Sidebar may use Scroll Area for scrollable menu content.
- **Milestone 1** — provides Button (used by SidebarTrigger) and Collapsible (composed by Sidebar for collapsible menu sections).
- `sidebar-*` CSS tokens already exist in `globals.css`.
- `react-resizable-panels` must be installed.
