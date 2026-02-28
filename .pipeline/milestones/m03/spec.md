# Milestone 3: Layout & Navigation

## Goal

Deliver the structural components for building full application shells with navigation, collapsible panels, and responsive layouts. After this milestone, consumer apps can assemble complete page layouts.

## Phases

### Phase 1: Content Containers

Sheet with SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, SheetClose (shadcn port using `@radix-ui/react-dialog` with side variants: top/right/bottom/left), Tabs with TabsList, TabsTrigger, TabsContent (shadcn port wrapping `@radix-ui/react-tabs`), Accordion with AccordionItem, AccordionTrigger, AccordionContent (shadcn port wrapping `@radix-ui/react-accordion` with single/multiple modes and animated open/close), Scroll Area with ScrollBar (shadcn port wrapping `@radix-ui/react-scroll-area` with vertical and horizontal scrollbar variants).

### Phase 2: Navigation

Breadcrumb with BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis (shadcn port), Sidebar with SidebarProvider, SidebarTrigger, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton (shadcn port with collapsible behavior using `sidebar-*` tokens), Resizable with ResizablePanelGroup, ResizablePanel, ResizableHandle (shadcn port wrapping `react-resizable-panels`).

### Phase 3: Application Shell

App Layout (custom, composes Sidebar + Header + scrollable content area with responsive behavior), Header (custom, top bar with title slot, user info area, and action button slots).

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
