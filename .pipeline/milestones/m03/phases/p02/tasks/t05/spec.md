# Task 5: Integration verification

## Objective

Run the full verification suite to confirm that all three navigation components (Breadcrumb, Sidebar, Resizable) work together, pass type checks, pass tests, render in Storybook, and are properly exported.

## Deliverables

- `pnpm typecheck` passes with zero errors across the entire monorepo
- `pnpm test` passes with all new tests passing (including vitest-axe accessibility assertions for all 3 components)
- All three components render correctly in Storybook with autodocs
- All exports verified present in `packages/ui/src/index.ts`

## Verification Checklist

### Type Checking

- [ ] `pnpm typecheck` exits with code 0
- [ ] No new TypeScript errors introduced

### Test Suite

- [ ] `pnpm test` exits with code 0
- [ ] Breadcrumb tests pass (smoke, a11y, asChild, separator, data-slot)
- [ ] Sidebar tests pass (smoke, toggle, keyboard shortcut, active state, context, a11y)
- [ ] Resizable tests pass (smoke, withHandle, orientation, data-slot, a11y)
- [ ] All vitest-axe assertions pass

### Storybook

- [ ] Breadcrumb stories render: Default, WithCustomSeparator, WithEllipsis, WithRouterLink, ResponsiveCollapsed
- [ ] Sidebar stories render: Default, Collapsed, WithNestedMenus, ControlledState
- [ ] Resizable stories render: Horizontal, Vertical, WithHandle, ThreePanels, NestedGroups
- [ ] All stories have `tags: ['autodocs']` and autodocs pages generate correctly

### Exports

- [ ] `packages/ui/src/index.ts` exports: Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis + types
- [ ] `packages/ui/src/index.ts` exports: SidebarProvider, SidebarTrigger, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar + types + CVA variants
- [ ] `packages/ui/src/index.ts` exports: ResizablePanelGroup, ResizablePanel, ResizableHandle + types

### Phase Exit Criteria (from phase spec)

- [ ] Breadcrumb renders semantic `<nav>` > `<ol>` > `<li>` markup with `aria-label="breadcrumb"` and `aria-current="page"`
- [ ] BreadcrumbLink `asChild` correctly renders consumer-provided router link
- [ ] Sidebar collapses/expands via SidebarTrigger click
- [ ] Sidebar collapses/expands via keyboard shortcut (`Cmd+B`/`Ctrl+B`)
- [ ] Sidebar uses `sidebar-*` semantic token classes
- [ ] `useSidebar` hook provides `open` and `toggleSidebar` to descendants
- [ ] Resizable panels support drag-to-resize
- [ ] ResizableHandle renders grip indicator when `withHandle` is true
- [ ] All components use `data-slot` attributes

## Dependencies

- **Within this phase:** Depends on **t01**, **t02**, **t03**, and **t04** — all must be complete before integration verification.

## Artifacts

No new files created. This task validates the work from t01–t04 and fixes any issues discovered during verification.
