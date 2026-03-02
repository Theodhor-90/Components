# Task: App Layout Component

## Objective

Implement the App Layout component — a custom structural composition that combines Sidebar, Header, and a scrollable main content area into a complete, responsive application shell — following the project's 5-file component pattern.

## Deliverables

Create 5 new files under `packages/ui/src/components/app-layout/`:

### 1. `app-layout.tsx` — Component Implementation

- Render a root `<div>` element with `data-slot="app-layout"` and `flex h-screen` layout
- Compose the following internally:
  - **`SidebarProvider`** as the outermost wrapper — pass through `defaultOpen`, `open`, `onOpenChange` props
  - **Sidebar region** (left) — renders the `sidebar` prop (`ReactNode`) inside the sidebar area
  - **Main content region** containing:
    - Header area — renders the `header` prop (`ReactNode`)
    - Scrollable content area — renders `children` wrapped in `ScrollArea`
- **Responsive behavior**:
  - On viewports below `md` (768px): sidebar renders as a Sheet overlay (mobile pattern)
  - On viewports `md` and above: sidebar renders inline on the left
  - Use `useMediaQuery` from `@components/hooks` for viewport detection
- Sidebar is always on the left — no configurable position
- Does NOT support `asChild` (it is a structural composition component)

### 2. `app-layout.styles.ts` — CVA Styles

- Define `appLayoutVariants` using CVA with base styles: `flex h-screen`
- No variants
- Export `appLayoutVariants`

### 3. `app-layout.types.ts` — Type Definitions

- `AppLayoutProps` extending `React.ComponentProps<'div'>` with:
  - `sidebar?: React.ReactNode` — content rendered in the sidebar region
  - `header?: React.ReactNode` — content rendered in the header region
  - `defaultOpen?: boolean` — initial sidebar open state
  - `open?: boolean` — controlled sidebar state
  - `onOpenChange?: (open: boolean) => void` — sidebar state change callback
- Use `import type` for type-only imports

### 4. `app-layout.test.tsx` — Tests

- Smoke render test
- Sidebar/header/content positioning verification
- Responsive collapse behavior — mock `useMediaQuery` to test:
  - Desktop (≥768px): sidebar renders inline
  - Mobile (<768px): sidebar renders as Sheet overlay
- Controlled sidebar state (`open` / `onOpenChange`)
- Uncontrolled sidebar state (`defaultOpen`)
- vitest-axe accessibility assertion
- Use `@testing-library/user-event` for any interaction tests

### 5. `app-layout.stories.tsx` — Storybook Stories

- CSF3 format with `Meta` and `StoryObj` types
- Include `tags: ['autodocs']` in meta
- Stories: Default, CollapsedSidebar, WithHeaderAndSidebar, FullShell (all slots), MobileView (using Storybook viewport addon)

## Dependencies

- **Task t01 (Header)**: Header component is used in App Layout stories and is the expected content for the `header` prop
- **Phase 2 (Navigation)**: `SidebarProvider`, `SidebarTrigger`, `SidebarContent`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, and `useSidebar` hook
- **Phase 1 (Content Containers)**: `ScrollArea` (for scrollable content region), `Sheet` (for mobile sidebar overlay)
- **`@components/hooks`**: `useMediaQuery` hook for responsive viewport detection
- **Milestone 1**: `Button` (for SidebarTrigger and Header action slots)

## Implementation Constraints

- Follow the canonical Button component as the reference for the 5-file pattern
- React 19 ref-as-prop — do NOT use `forwardRef`
- Named exports only — no default exports
- Use `import type` for type-only imports
- All styling via Tailwind utility classes mapped to semantic CSS custom properties
- Use existing tokens only (`--background`, `--foreground`, `--border`, `--sidebar-*`) — no new tokens
- App Layout wraps children in `SidebarProvider` internally so consumers don't need to wire it manually

## Verification Criteria

1. App Layout renders sidebar on the left, header at the top, and scrollable content below
2. Sidebar collapses to a Sheet overlay on viewports below `md` (768px)
3. Supports controlled (`open` / `onOpenChange`) and uncontrolled (`defaultOpen`) sidebar state
4. All 5 files exist and follow the naming conventions
5. Tests pass with `pnpm test`
6. Stories render correctly in Storybook
