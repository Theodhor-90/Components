Now I have comprehensive context. Let me produce the specification document.

# Phase 3: Application Shell — Specification

## Goal

Deliver two custom components — Header and App Layout — that compose the existing Sidebar (from Phase 2), a top bar, and a scrollable main content area into a complete, responsive application shell, providing consumer apps (Task Manager, Chess, Orchestrator, Iteration Engine, Scheduler) with a consistent, ready-to-use page layout structure that handles sidebar collapse, responsive viewport behavior, and standard header patterns out of the box.

## Design Decisions

### 1. Header is a pure layout component — no Radix primitives

Header is a lightweight `<header>` element with three slot areas (title, actions, user info). It has no interactive behavior requiring Radix. It uses `children` for the title slot, a `actions` render prop or ReactNode for the right-side action buttons, and a `userInfo` ReactNode slot for avatar/profile display. This keeps the component simple, composable, and consistent with how shadcn/ui handles layout-only components.

### 2. App Layout composes SidebarProvider internally

App Layout wraps its children in `SidebarProvider` so consumers get sidebar state management (open/close, keyboard shortcut) without manual wiring. It renders `SidebarContent` on the left, `Header` at the top of the main area, and a `ScrollArea`-wrapped content region below. This means consumers only need to pass sidebar content, header props, and page children.

### 3. Responsive sidebar collapse via CSS and the existing `useSidebar` hook

On viewports below a configurable breakpoint (default: `768px` / `md`), the sidebar collapses to a Sheet (slide-over overlay) rather than taking up inline space. This follows the shadcn/ui Sidebar pattern where mobile viewports use a Sheet and desktop viewports show the inline sidebar. The `useSidebar` hook from Phase 2 already provides the `open` / `toggleSidebar` state — App Layout connects this to viewport-aware behavior using the `useMediaQuery` hook from `@components/hooks`.

### 4. No new design tokens

Both components use the existing semantic tokens (`--background`, `--foreground`, `--border`, `--sidebar-*`). Header uses `bg-background`, `border-border` for its bottom border. No additions to `globals.css` are needed.

### 5. CVA variants for Header height and App Layout sidebar position

Header supports a `size` variant (`default` at `h-14`, `sm` at `h-12`, `lg` at `h-16`) via CVA. App Layout supports a `sidebarPosition` variant (`left` | `right`) defaulting to `left`, controlling which side the sidebar appears on.

### 6. Both components support `asChild` on appropriate elements

Header supports `asChild` so consumers can replace the root `<header>` element (e.g., with a `<div>` for non-semantic contexts). App Layout does not support `asChild` since it is a structural composition component.

## Tasks

### Task 1: Header Component

**Deliverables:**

- `packages/ui/src/components/header/header.tsx` — Implementation of the `Header` component as a `<header>` element with `data-slot="header"`. Renders three regions using flexbox:
  - **Left region** — renders `children` (typically a title or breadcrumb)
  - **Right region** — renders `actions` prop (ReactNode) for action buttons
  - **User info** — renders `userInfo` prop (ReactNode) for avatar/profile display, separated from actions by a vertical divider
  - Supports `asChild` via Radix `Slot` for root element replacement
  - Includes a bottom border (`border-b border-border`)
- `packages/ui/src/components/header/header.styles.ts` — CVA variants for `size` (`default` / `sm` / `lg`) controlling height and padding
- `packages/ui/src/components/header/header.types.ts` — `HeaderProps` extending `React.ComponentProps<'header'>` with `VariantProps<typeof headerVariants>`, plus `actions?: React.ReactNode`, `userInfo?: React.ReactNode`, and `asChild?: boolean`
- `packages/ui/src/components/header/header.test.tsx` — Tests: smoke render, size variants, slot rendering (children, actions, userInfo), asChild composition, vitest-axe accessibility
- `packages/ui/src/components/header/header.stories.tsx` — CSF3 stories: Default, WithActions, WithUserInfo, FullHeader (all slots populated), SmallSize, LargeSize, AsChild; `tags: ['autodocs']`

### Task 2: App Layout Component

**Deliverables:**

- `packages/ui/src/components/app-layout/app-layout.tsx` — Implementation of the `AppLayout` component that composes:
  - `SidebarProvider` as the outermost wrapper (passes through `defaultOpen`, `open`, `onOpenChange`)
  - Sidebar region rendering the `sidebar` prop (ReactNode) inside the sidebar area
  - Main content region containing a header area (renders `header` prop, ReactNode) and a scrollable content area (renders `children`) using `ScrollArea`
  - Responsive behavior: on viewports below `md` (768px), sidebar renders as a Sheet overlay; on `md` and above, sidebar renders inline
  - Uses `useMediaQuery` from `@components/hooks` for viewport detection
- `packages/ui/src/components/app-layout/app-layout.styles.ts` — CVA variants for `sidebarPosition` (`left` | `right`) controlling sidebar placement; base styles for the root layout container (`flex h-screen`)
- `packages/ui/src/components/app-layout/app-layout.types.ts` — `AppLayoutProps` extending `React.ComponentProps<'div'>` with:
  - `sidebar?: React.ReactNode` — content rendered in the sidebar region
  - `header?: React.ReactNode` — content rendered in the header region
  - `sidebarPosition?: 'left' | 'right'` — which side the sidebar appears
  - `defaultOpen?: boolean` — initial sidebar state
  - `open?: boolean` — controlled sidebar state
  - `onOpenChange?: (open: boolean) => void` — sidebar state callback
  - Plus `VariantProps<typeof appLayoutVariants>`
- `packages/ui/src/components/app-layout/app-layout.test.tsx` — Tests: smoke render, sidebar/header/content positioning, sidebar on left vs right, responsive collapse behavior (mock `useMediaQuery`), controlled and uncontrolled sidebar state, vitest-axe accessibility
- `packages/ui/src/components/app-layout/app-layout.stories.tsx` — CSF3 stories: Default, SidebarRight, CollapsedSidebar, WithHeaderAndSidebar, FullShell (all slots), MobileView (using Storybook viewport addon); `tags: ['autodocs']`

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
2. Header renders children in the left region, actions on the right, and userInfo separated by a divider
3. Header supports `sm`, `default`, and `lg` size variants with correct heights (h-12, h-14, h-16)
4. Header supports `asChild` for root element replacement
5. App Layout renders sidebar, header, and content in the correct positions with `flex h-screen` layout
6. App Layout supports `sidebarPosition="left"` (default) and `sidebarPosition="right"`
7. App Layout sidebar collapses to a Sheet overlay on viewports below `md` (768px)
8. App Layout supports controlled (`open` / `onOpenChange`) and uncontrolled (`defaultOpen`) sidebar state
9. `pnpm test` passes with vitest-axe accessibility assertions for both components
10. `pnpm typecheck` passes with no errors
11. Both components and their types are exported from `packages/ui/src/index.ts`
12. Both components render correctly in Storybook with all stories documented via autodocs

## Dependencies

1. **Phase 2 (Navigation) — complete** — Provides `SidebarProvider`, `SidebarTrigger`, `SidebarContent`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, and `useSidebar` hook. App Layout composes these directly.
2. **Phase 1 (Content Containers) — complete** — Provides `ScrollArea` (used by App Layout for the scrollable content region) and `Sheet` (used by App Layout for mobile sidebar overlay).
3. **Milestone 1 — complete** — Provides `Button` (used for Header action slots and SidebarTrigger), `Separator` (potential use as divider in Header), and the full monorepo infrastructure (Turborepo, Storybook, Vitest, build pipeline).
4. **`@components/hooks`** — Provides `useMediaQuery` hook for responsive viewport detection in App Layout.
5. **`@radix-ui/react-slot`** — Already installed; used by Header for `asChild` support.

## Artifacts

| Artifact                                                       | Type     | Description                             |
| -------------------------------------------------------------- | -------- | --------------------------------------- |
| `packages/ui/src/components/header/header.tsx`                 | New file | Header component implementation         |
| `packages/ui/src/components/header/header.styles.ts`           | New file | Header CVA variant definitions          |
| `packages/ui/src/components/header/header.types.ts`            | New file | Header props type definition            |
| `packages/ui/src/components/header/header.test.tsx`            | New file | Header unit and accessibility tests     |
| `packages/ui/src/components/header/header.stories.tsx`         | New file | Header Storybook stories                |
| `packages/ui/src/components/app-layout/app-layout.tsx`         | New file | App Layout component implementation     |
| `packages/ui/src/components/app-layout/app-layout.styles.ts`   | New file | App Layout CVA variant definitions      |
| `packages/ui/src/components/app-layout/app-layout.types.ts`    | New file | App Layout props type definition        |
| `packages/ui/src/components/app-layout/app-layout.test.tsx`    | New file | App Layout unit and accessibility tests |
| `packages/ui/src/components/app-layout/app-layout.stories.tsx` | New file | App Layout Storybook stories            |
| `packages/ui/src/index.ts`                                     | Modified | Add Header and AppLayout exports        |
