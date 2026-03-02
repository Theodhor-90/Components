Now I have all the context I need. Let me produce the revised specification addressing all three feedback issues:

1. **Remove `sidebarPosition` variant** — sidebar is always on the left
2. **Remove Header `size` variant** — single fixed height, no CVA variants for size
3. **Resolve divider ambiguity** — commit to using the existing `Separator` component with `orientation="vertical"`

# Phase 3: Application Shell — Specification

## Goal

Deliver two custom components — Header and App Layout — that compose the existing Sidebar (from Phase 2), a top bar, and a scrollable main content area into a complete, responsive application shell, providing consumer apps (Task Manager, Chess, Orchestrator, Iteration Engine, Scheduler) with a consistent, ready-to-use page layout structure that handles sidebar collapse, responsive viewport behavior, and standard header patterns out of the box.

## Design Decisions

### 1. Header is a pure layout component — no Radix primitives

Header is a lightweight `<header>` element with three slot areas (title, actions, user info). It has no interactive behavior requiring Radix. It uses `children` for the title slot, an `actions` ReactNode for the right-side action buttons, and a `userInfo` ReactNode slot for avatar/profile display, separated from actions by a vertical `Separator` component (from Milestone 1). This keeps the component simple, composable, and consistent with how shadcn/ui handles layout-only components.

### 2. App Layout composes SidebarProvider internally

App Layout wraps its children in `SidebarProvider` so consumers get sidebar state management (open/close, keyboard shortcut) without manual wiring. It renders sidebar content on the left, `Header` at the top of the main area, and a `ScrollArea`-wrapped content region below. This means consumers only need to pass sidebar content, header props, and page children.

### 3. Responsive sidebar collapse via CSS and the existing `useSidebar` hook

On viewports below `768px` (`md` breakpoint), the sidebar collapses to a Sheet (slide-over overlay) rather than taking up inline space. This follows the shadcn/ui Sidebar pattern where mobile viewports use a Sheet and desktop viewports show the inline sidebar. The `useSidebar` hook from Phase 2 already provides the `open` / `toggleSidebar` state — App Layout connects this to viewport-aware behavior using the `useMediaQuery` hook from `@components/hooks`.

### 4. No new design tokens

Both components use the existing semantic tokens (`--background`, `--foreground`, `--border`, `--sidebar-*`). Header uses `bg-background`, `border-border` for its bottom border. No additions to `globals.css` are needed.

### 5. Header has a single fixed height — no size variants

Header renders at a single standard height (`h-14` / 3.5rem) with corresponding padding. The master plan specifies "top bar with title slot, user info area, and action button slots" with no size variants, so the CVA styles file defines base styles only without variant dimensions.

### 6. Sidebar is always on the left

The master plan describes App Layout as composing "Sidebar + Header + scrollable content area with responsive behavior" with no configurable sidebar position. The sidebar renders on the left side. No `sidebarPosition` variant is needed.

### 7. Divider between actions and userInfo uses the Separator component

When both `actions` and `userInfo` are provided, Header renders a `Separator` component with `orientation="vertical"` between them. This reuses the existing Separator from Milestone 1 rather than a CSS-only border, keeping the approach consistent with the library's component-based patterns.

### 8. Header supports `asChild` on the root element

Header supports `asChild` via Radix `Slot` so consumers can replace the root `<header>` element (e.g., with a `<div>` for non-semantic contexts). App Layout does not support `asChild` since it is a structural composition component.

## Tasks

### Task 1: Header Component

**Deliverables:**

- `packages/ui/src/components/header/header.tsx` — Implementation of the `Header` component as a `<header>` element with `data-slot="header"`. Renders three regions using flexbox:
  - **Left region** — renders `children` (typically a title or breadcrumb)
  - **Right region** — renders `actions` prop (ReactNode) for action buttons
  - **User info** — renders `userInfo` prop (ReactNode) for avatar/profile display
  - When both `actions` and `userInfo` are provided, a `Separator` component with `orientation="vertical"` is rendered between them
  - Supports `asChild` via Radix `Slot` for root element replacement
  - Includes a bottom border (`border-b border-border`)
  - Fixed height: `h-14` with `px-4` horizontal padding
- `packages/ui/src/components/header/header.styles.ts` — CVA base styles for the header layout (flex, items-center, h-14, px-4, border-b, bg-background). No variant dimensions.
- `packages/ui/src/components/header/header.types.ts` — `HeaderProps` extending `React.ComponentProps<'header'>` with `actions?: React.ReactNode`, `userInfo?: React.ReactNode`, and `asChild?: boolean`
- `packages/ui/src/components/header/header.test.tsx` — Tests: smoke render, slot rendering (children, actions, userInfo), separator rendered when both actions and userInfo are present, separator absent when only one is provided, asChild composition, vitest-axe accessibility
- `packages/ui/src/components/header/header.stories.tsx` — CSF3 stories: Default, WithActions, WithUserInfo, FullHeader (all slots populated showing separator), AsChild; `tags: ['autodocs']`

### Task 2: App Layout Component

**Deliverables:**

- `packages/ui/src/components/app-layout/app-layout.tsx` — Implementation of the `AppLayout` component that composes:
  - `SidebarProvider` as the outermost wrapper (passes through `defaultOpen`, `open`, `onOpenChange`)
  - Sidebar on the left, rendering the `sidebar` prop (ReactNode) inside the sidebar area
  - Main content region containing a header area (renders `header` prop, ReactNode) and a scrollable content area (renders `children`) using `ScrollArea`
  - Responsive behavior: on viewports below `md` (768px), sidebar renders as a Sheet overlay; on `md` and above, sidebar renders inline on the left
  - Uses `useMediaQuery` from `@components/hooks` for viewport detection
- `packages/ui/src/components/app-layout/app-layout.styles.ts` — CVA base styles for the root layout container (`flex h-screen`). No variants.
- `packages/ui/src/components/app-layout/app-layout.types.ts` — `AppLayoutProps` extending `React.ComponentProps<'div'>` with:
  - `sidebar?: React.ReactNode` — content rendered in the sidebar region
  - `header?: React.ReactNode` — content rendered in the header region
  - `defaultOpen?: boolean` — initial sidebar state
  - `open?: boolean` — controlled sidebar state
  - `onOpenChange?: (open: boolean) => void` — sidebar state callback
- `packages/ui/src/components/app-layout/app-layout.test.tsx` — Tests: smoke render, sidebar/header/content positioning, responsive collapse behavior (mock `useMediaQuery`), controlled and uncontrolled sidebar state, vitest-axe accessibility
- `packages/ui/src/components/app-layout/app-layout.stories.tsx` — CSF3 stories: Default, CollapsedSidebar, WithHeaderAndSidebar, FullShell (all slots), MobileView (using Storybook viewport addon); `tags: ['autodocs']`

### Task 3: Exports and Integration Verification

**Deliverables:**

- Add exports to `packages/ui/src/index.ts`:
  - `Header`, `type HeaderProps`, `headerVariants`
  - `AppLayout`, `type AppLayoutProps`, `appLayoutVariants`
- Run `pnpm typecheck` — must pass with no errors
- Run `pnpm test` — all tests including new Header and App Layout tests must pass
- Run `pnpm build` — verify clean build output
- Verify Storybook renders both components correctly with `pnpm storybook`

## Exit Criteria

1. Header renders a `<header>` element with `data-slot="header"` and bottom border
2. Header renders children in the left region, actions on the right, and userInfo after a vertical Separator
3. Header renders the vertical `Separator` only when both `actions` and `userInfo` are provided
4. Header supports `asChild` for root element replacement
5. App Layout renders sidebar on the left, header at the top, and scrollable content below
6. App Layout sidebar collapses to a Sheet overlay on viewports below `md` (768px)
7. App Layout supports controlled (`open` / `onOpenChange`) and uncontrolled (`defaultOpen`) sidebar state
8. `pnpm test` passes with vitest-axe accessibility assertions for both components
9. `pnpm typecheck` passes with no errors
10. Both components and their types are exported from `packages/ui/src/index.ts`
11. Both components render correctly in Storybook with all stories documented via autodocs

## Dependencies

1. **Phase 2 (Navigation) — complete** — Provides `SidebarProvider`, `SidebarTrigger`, `SidebarContent`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, and `useSidebar` hook. App Layout composes these directly.
2. **Phase 1 (Content Containers) — complete** — Provides `ScrollArea` (used by App Layout for the scrollable content region) and `Sheet` (used by App Layout for mobile sidebar overlay).
3. **Milestone 1 — complete** — Provides `Button` (used for Header action slots and SidebarTrigger), `Separator` (used as vertical divider in Header between actions and userInfo), and the full monorepo infrastructure (Turborepo, Storybook, Vitest, build pipeline).
4. **`@components/hooks`** — Provides `useMediaQuery` hook for responsive viewport detection in App Layout.
5. **`@radix-ui/react-slot`** — Already installed; used by Header for `asChild` support.

## Artifacts

| Artifact                                                       | Type     | Description                             |
| -------------------------------------------------------------- | -------- | --------------------------------------- |
| `packages/ui/src/components/header/header.tsx`                 | New file | Header component implementation         |
| `packages/ui/src/components/header/header.styles.ts`           | New file | Header CVA base styles                  |
| `packages/ui/src/components/header/header.types.ts`            | New file | Header props type definition            |
| `packages/ui/src/components/header/header.test.tsx`            | New file | Header unit and accessibility tests     |
| `packages/ui/src/components/header/header.stories.tsx`         | New file | Header Storybook stories                |
| `packages/ui/src/components/app-layout/app-layout.tsx`         | New file | App Layout component implementation     |
| `packages/ui/src/components/app-layout/app-layout.styles.ts`   | New file | App Layout CVA base styles              |
| `packages/ui/src/components/app-layout/app-layout.types.ts`    | New file | App Layout props type definition        |
| `packages/ui/src/components/app-layout/app-layout.test.tsx`    | New file | App Layout unit and accessibility tests |
| `packages/ui/src/components/app-layout/app-layout.stories.tsx` | New file | App Layout Storybook stories            |
| `packages/ui/src/index.ts`                                     | Modified | Add Header and AppLayout exports        |
