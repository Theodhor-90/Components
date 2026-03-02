# Task 3: Sidebar component

## Objective

Implement the Sidebar component as a shadcn port with collapsible behavior, using the `sidebar-*` CSS custom properties, context-based state management, and keyboard shortcut toggling. This is the most complex component in the phase, with 8 sub-components plus a `useSidebar` hook.

## Deliverables

### Files to Create

| File                                                     | Purpose                                              |
| -------------------------------------------------------- | ---------------------------------------------------- |
| `packages/ui/src/components/sidebar/sidebar.tsx`         | Implementation of 8 sub-components + useSidebar hook |
| `packages/ui/src/components/sidebar/sidebar.styles.ts`   | CVA variants for SidebarMenuButton + static styles   |
| `packages/ui/src/components/sidebar/sidebar.types.ts`    | Props types for all 8 sub-components                 |
| `packages/ui/src/components/sidebar/sidebar.test.tsx`    | Tests with vitest-axe accessibility assertions       |
| `packages/ui/src/components/sidebar/sidebar.stories.tsx` | Storybook CSF3 stories with `tags: ['autodocs']`     |

### Files to Modify

| File                       | Change                                                               |
| -------------------------- | -------------------------------------------------------------------- |
| `packages/ui/src/index.ts` | Add exports for Sidebar (8 components + hook + types + CVA variants) |

## Sub-components

1. **SidebarProvider** — Context provider managing `open` state and `toggleSidebar()` function. Accepts `defaultOpen` (default `true`), `open` (controlled), `onOpenChange` callback. Registers keyboard shortcut (`Cmd+B`/`Ctrl+B`) on mount, cleans up on unmount. Renders wrapping `<div>` with `data-slot="sidebar-provider"`
2. **SidebarTrigger** — Button with `variant="ghost"` and `size="icon"` composing the existing Button component (M01). Calls `toggleSidebar()` from context. Renders inline SVG panel icon. `data-slot="sidebar-trigger"`
3. **SidebarContent** — Scrollable container composing `ScrollArea` from P01. `data-slot="sidebar-content"`
4. **SidebarGroup** — Grouping container (`<div>`) for related menu items. `data-slot="sidebar-group"`
5. **SidebarGroupLabel** — Group heading label (`<div>` with `text-sidebar-foreground/70` styling), supports `asChild`. `data-slot="sidebar-group-label"`
6. **SidebarMenu** — `<ul>` for menu item list. `data-slot="sidebar-menu"`
7. **SidebarMenuItem** — `<li>` for a single menu entry. `data-slot="sidebar-menu-item"`
8. **SidebarMenuButton** — Interactive button/link with `data-active` attribute for active state styling. Supports `asChild`, `variant` ("default" | "outline"), and `size` ("sm" | "default" | "lg") props. `data-slot="sidebar-menu-button"`

### Hook

- **useSidebar** — Returns `{ open: boolean, toggleSidebar: () => void }` from sidebar context. Throws an error if used outside `SidebarProvider`.

## Implementation Constraints

- **Context-based architecture.** All child components read collapse state from SidebarProvider context.
- **Controlled and uncontrolled modes.** `defaultOpen` for uncontrolled, `open` + `onOpenChange` for controlled. No cookies or localStorage persistence — consumer's responsibility.
- **Single collapsible behavior.** No variant/collapsible prop enums (no floating, inset, offcanvas, icon modes). Collapsed state transitions sidebar width to 0.
- **`sidebar-*` CSS tokens.** Use Tailwind classes mapped to the 8 sidebar tokens: `bg-sidebar-background`, `text-sidebar-foreground`, `bg-sidebar-primary`, `text-sidebar-primary-foreground`, `bg-sidebar-accent`, `text-sidebar-accent-foreground`, `border-sidebar-border`, `ring-sidebar-ring`.
- **Composes existing components.** SidebarTrigger composes Button (M01). SidebarContent composes ScrollArea (M03/P01). Collapsible menu sections in stories use Collapsible (M01).
- **No tooltip integration.** Tooltip is M04; defer integration.
- **CVA variants for SidebarMenuButton** — variant × size matrix.
- **Scoped to 8 sub-components only** — no SidebarRail, SidebarInset, SidebarHeader, SidebarFooter, SidebarMenuSub.

## Tests Required

- Renders sidebar with content
- Toggles collapse state on SidebarTrigger click
- Keyboard shortcut (`Cmd+B`/`Ctrl+B`) toggles sidebar
- Menu button renders active state via `data-active`
- `asChild` renders custom elements on SidebarMenuButton and SidebarGroupLabel
- `SidebarProvider` provides context via `useSidebar` hook
- `sidebar-*` token classes are applied
- `data-slot` attributes present on all sub-components
- className merging works correctly
- vitest-axe accessibility pass

## Stories Required

- Default (expanded with menu groups)
- Collapsed (triggered via click)
- WithNestedMenus (using Collapsible from M01)
- ControlledState (open/onOpenChange demo)

## Dependencies

- **Within this phase:** None (does not depend on t01 or t02)
- **From M01:** Button component (SidebarTrigger), Collapsible component (stories only)
- **From M03/P01:** ScrollArea component (SidebarContent)
- **CSS tokens:** `sidebar-*` tokens already in `globals.css`

## Verification

1. All 5 files exist in `packages/ui/src/components/sidebar/`
2. Sidebar collapses/expands via SidebarTrigger click
3. Sidebar collapses/expands via keyboard shortcut (`Cmd+B`/`Ctrl+B`)
4. `useSidebar` hook returns correct `open` state and `toggleSidebar` function
5. Sidebar uses `sidebar-*` semantic token classes for all surfaces
6. SidebarMenuButton shows active state with `data-active`
7. All stories render in Storybook with autodocs
8. `pnpm test` passes for sidebar tests including vitest-axe
9. Exports present in `packages/ui/src/index.ts`
