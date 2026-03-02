Now I have all the context needed. Let me produce the milestone specification.

# Milestone 3: Layout & Navigation

## Goal

Deliver the structural components for building full application shells — including slide-over panels, tabbed interfaces, collapsible sections, custom scroll containers, breadcrumb trails, a collapsible sidebar, resizable panels, and a composed application shell with header — so that consumer apps (Task Manager, Chess, Orchestrator, Iteration Engine, Scheduler) can assemble complete, responsive page layouts using the shared component library.

## Scope

### Included

- **9 components** across 3 phases: Sheet, Tabs, Accordion, Scroll Area, Breadcrumb, Sidebar, Resizable, App Layout, Header
- All components follow the 5-file pattern (`*.tsx`, `*.styles.ts`, `*.types.ts`, `*.test.tsx`, `*.stories.tsx`)
- Radix UI primitives for Sheet (`@radix-ui/react-dialog`), Tabs (`@radix-ui/react-tabs`), Accordion (`@radix-ui/react-accordion`), and Scroll Area (`@radix-ui/react-scroll-area`)
- Third-party integration with `react-resizable-panels` for the Resizable component
- Storybook stories with `tags: ['autodocs']` for every component
- Vitest + Testing Library + vitest-axe tests for every component
- Exports added to `packages/ui/src/index.ts`
- Light and dark theme support using existing OKLCH semantic tokens (including `sidebar-*` tokens)

### Out of Scope

- Navigation components not listed in the master plan (e.g., top-level router, navigation bar)
- Responsive breakpoint utilities or a grid system
- Consumer-app-specific layout compositions (each app composes App Layout + Sidebar on its own)
- New design tokens — all components use the existing token set defined in `globals.css`
- Any components from Milestones 4–6

## Phases

### Phase 1: Content Containers

Implement four container components that manage content visibility, scrolling, and panel organization.

- **Sheet** — shadcn port using `@radix-ui/react-dialog` with `side` variants (top, right, bottom, left). Sub-components: SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, SheetClose. Content slides in from the specified edge with overlay backdrop.
- **Tabs** — shadcn port wrapping `@radix-ui/react-tabs`. Sub-components: TabsList, TabsTrigger, TabsContent. Supports controlled and uncontrolled modes with keyboard navigation between tabs.
- **Accordion** — shadcn port wrapping `@radix-ui/react-accordion` with `type="single"` and `type="multiple"` modes. Sub-components: AccordionItem, AccordionTrigger, AccordionContent. Animated open/close transitions via CSS height animation.
- **Scroll Area** — shadcn port wrapping `@radix-ui/react-scroll-area`. Sub-components: ScrollArea, ScrollBar. Supports vertical and horizontal scrollbar variants with theme-matched custom scrollbar styling.

### Phase 2: Navigation

Implement three navigation components for wayfinding, sidebar navigation, and panel resizing.

- **Breadcrumb** — shadcn port using semantic `<nav>` and `<ol>` markup. Sub-components: BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis. BreadcrumbLink supports `asChild` for router integration.
- **Sidebar** — shadcn port with collapsible behavior using the `sidebar-*` CSS custom properties. Sub-components: SidebarProvider, SidebarTrigger, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton. Provides a context for collapse state toggled by SidebarTrigger or keyboard shortcut.
- **Resizable** — shadcn port wrapping `react-resizable-panels`. Sub-components: ResizablePanelGroup, ResizablePanel, ResizableHandle. Supports horizontal and vertical orientations with drag-to-resize and keyboard arrow key resizing.

### Phase 3: Application Shell

Implement two custom components that compose the sidebar, header, and content area into a complete application shell.

- **Header** — custom component providing a top bar layout with a title slot (left), action button slots (right), and optional user info area. Uses semantic `<header>` element with `data-slot="header"`.
- **App Layout** — custom component that composes Sidebar + Header + a scrollable main content area. Manages responsive behavior (sidebar collapses on small viewports) and provides a consistent layout structure across consumer apps.

## Exit Criteria

1. All 9 components render correctly in Storybook with all variants and sub-components documented via autodocs
2. `pnpm test` passes with vitest-axe accessibility assertions for every component
3. `pnpm typecheck` passes with no errors across the entire monorepo
4. Sheet slides in from the correct edge (top, right, bottom, left) based on the `side` prop and closes on overlay click or ESC
5. Tabs switch content panels on click and keyboard (arrow keys navigate triggers, Enter/Space activates)
6. Accordion animates open/close and correctly enforces single-open vs. multiple-open behavior based on `type` prop
7. Scroll Area renders custom-styled scrollbars (vertical and horizontal) that match the current theme
8. Breadcrumb renders accessible `<nav>` > `<ol>` markup with proper `aria-label` and separator elements
9. Sidebar collapses and expands via SidebarTrigger click and keyboard shortcut, persisting state through SidebarProvider context
10. Resizable panels support drag-to-resize with mouse and keyboard arrow key fallback, respecting min/max size constraints
11. Header renders title, actions, and user info areas in the correct positions
12. App Layout renders sidebar, header, and scrollable content area in the correct layout positions with responsive sidebar collapse
13. All 9 components and their sub-components are exported from `packages/ui/src/index.ts`

## Dependencies

1. **Milestone 2 complete** — Form Controls milestone must be finished (currently complete), as the Sidebar and App Layout may compose with form elements (e.g., Search Input in sidebar, though Search Input is in Milestone 4, the pattern dependency on Input exists)
2. **Existing infrastructure** — Monorepo tooling (Turborepo, pnpm), Storybook, Vitest, and the build pipeline must be operational (established in Milestone 1)
3. **Button component** — already exists as the canonical reference component; used by Sheet close, Sidebar trigger, and Header action slots
4. **Radix UI packages** — `@radix-ui/react-dialog` (already installed for Dialog/AlertDialog; Sheet reuses it), `@radix-ui/react-tabs`, `@radix-ui/react-accordion`, `@radix-ui/react-scroll-area` must be installed
5. **react-resizable-panels** — third-party dependency required for the Resizable component, must be installed in `packages/ui`
6. **Sidebar CSS tokens** — the `sidebar-*` custom properties must exist in `globals.css` (defined in the theme system)
7. **Collapsible component** — already implemented in Milestone 1; the Sidebar may compose with it for collapsible menu sections

## Risks

1. **Sidebar complexity** — The Sidebar component has the most sub-components (8) and requires a context provider, collapsible behavior, keyboard shortcut binding, and integration with the `sidebar-*` tokens. It is the highest-effort component in this milestone and may require more implementation iterations than typical shadcn ports.
2. **App Layout responsive behavior** — The App Layout is a custom component with no shadcn reference. Defining responsive breakpoints for sidebar collapse requires design decisions that may need iteration with consumer app requirements.
3. **Sheet vs. Dialog overlap** — Sheet reuses `@radix-ui/react-dialog` internally (same as Dialog). Care must be taken to ensure Sheet does not conflict with Dialog exports or cause Radix context collisions when both are used on the same page.
4. **Accordion animation** — The animated height transition for AccordionContent requires CSS `grid-template-rows` or `max-height` animation that works reliably across browsers. The animation approach should match shadcn/ui's implementation to avoid layout jank.
5. **react-resizable-panels version compatibility** — The library must be compatible with React 19. Version pinning or testing against RC builds may be required if the latest release does not explicitly support React 19.
