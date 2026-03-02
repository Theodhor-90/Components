Now I have complete context. Let me produce the definitive specification.

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
- **Tabs** — shadcn port wrapping `@radix-ui/react-tabs`. Sub-components: TabsList, TabsTrigger, TabsContent. Supports controlled and uncontrolled modes.
- **Accordion** — shadcn port wrapping `@radix-ui/react-accordion` with `type="single"` and `type="multiple"` modes. Sub-components: AccordionItem, AccordionTrigger, AccordionContent. Animated open/close transitions via CSS height animation.
- **Scroll Area** — shadcn port wrapping `@radix-ui/react-scroll-area`. Sub-components: ScrollArea, ScrollBar. Supports vertical and horizontal scrollbar variants with theme-matched custom scrollbar styling.

### Phase 2: Navigation

Implement three navigation components for wayfinding, sidebar navigation, and panel resizing.

- **Breadcrumb** — shadcn port using semantic `<nav>` and `<ol>` markup. Sub-components: BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis. BreadcrumbLink supports `asChild` for router integration.
- **Sidebar** — shadcn port with collapsible behavior using the `sidebar-*` CSS custom properties. Sub-components: SidebarProvider, SidebarTrigger, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton. Provides a context for collapse state toggled by SidebarTrigger or keyboard shortcut (`Cmd+B` on macOS, `Ctrl+B` on other platforms).
- **Resizable** — shadcn port wrapping `react-resizable-panels`. Sub-components: ResizablePanelGroup, ResizablePanel, ResizableHandle. Supports horizontal and vertical orientations with drag-to-resize and keyboard arrow key resizing.

### Phase 3: Application Shell

Implement two custom components that compose the sidebar, header, and content area into a complete application shell.

- **Header** — custom component providing a top bar layout with a title slot (left), action button slots (right), and user info area. Uses `data-slot="header"`.
- **App Layout** — custom component that composes Sidebar + Header + a scrollable main content area with responsive behavior (sidebar collapses on small viewports). Provides a consistent layout structure across consumer apps.

## Exit Criteria

1. All 9 components render correctly in Storybook with all variants documented
2. `pnpm test` passes with vitest-axe accessibility assertions for every component
3. `pnpm typecheck` passes with no errors
4. Sheet slides in from the correct edge based on `side` prop
5. Accordion animates open/close and supports single and multiple open sections
6. Scroll Area renders custom scrollbars that match the theme
7. Sidebar collapses and expands with keyboard shortcut support
8. Resizable panels support drag-to-resize with keyboard fallback
9. App Layout renders sidebar, header, and content in the correct positions
10. All components are exported from `packages/ui/src/index.ts`

## Dependencies

1. **Milestone 1 complete** — M1 provides the monorepo infrastructure (Turborepo, pnpm, Storybook, Vitest, build pipeline), the Button component (used by Sheet close, Sidebar trigger, Header actions), and the Collapsible component (composed by Sidebar for collapsible menu sections)
2. **Radix UI packages** — `@radix-ui/react-dialog` (already installed; Sheet reuses it), `@radix-ui/react-tabs`, `@radix-ui/react-accordion`, `@radix-ui/react-scroll-area` must be installed
3. **react-resizable-panels** — third-party dependency required for the Resizable component, must be installed in `packages/ui`
4. **Sidebar CSS tokens** — the `sidebar-*` custom properties already exist in `globals.css` (`--sidebar-background`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-primary-foreground`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-border`, `--sidebar-ring` are defined for both light and dark themes)
