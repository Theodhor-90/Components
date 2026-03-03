I now have all the information needed. Here is the specification:

# Milestone 4: Data Display — Specification

## Goal

Deliver the complete set of components for presenting tabular data, user identity, inline contextual hints, and empty/loading states, enabling consumer apps (Task Manager, Chess, Orchestrator, Iteration Engine, Scheduler) to build data-rich pages with accessible tables, avatar stacks, tooltips, hover previews, progress indicators, placeholder states, and inline search filtering.

## Scope

### In Scope

- **Table** — shadcn port of styled native `<table>` elements with 7 sub-components (TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption, TableFooter)
- **Pagination** — shadcn port of a `<nav>` element with button-style links and 6 sub-components (PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis)
- **Avatar** — shadcn port wrapping `@radix-ui/react-avatar` with AvatarImage and AvatarFallback sub-components
- **Avatar Group** — custom component for stacking overlapping Avatars with configurable `max` visible count and `+N` overflow indicator
- **Tooltip** — shadcn port wrapping `@radix-ui/react-tooltip` with TooltipTrigger, TooltipContent, and TooltipProvider sub-components
- **Hover Card** — shadcn port wrapping `@radix-ui/react-hover-card` with HoverCardTrigger and HoverCardContent sub-components
- **Progress** — shadcn port wrapping `@radix-ui/react-progress` with animated fill bar
- **Empty State** — custom component with centered layout, icon slot, title, description, and optional CTA button
- **Search Input** — custom Input variant with search icon prefix, clear button suffix, `onSearch` (Enter key), and `onClear` callbacks
- Full test suites (Vitest + vitest-axe) and Storybook stories (CSF3 with autodocs) for all 10 components
- All components exported from `packages/ui/src/index.ts`

### Out of Scope

- Data fetching, server-side pagination logic, or table sorting/filtering state management
- Virtualized or infinite-scroll table rendering
- Data Table (column definitions, sorting, filtering) — that is a composed pattern built on Table, not part of this milestone
- Any components belonging to Milestones 5 or 6 (menus, date pickers, domain patterns)
- Consumer app integration — this milestone delivers the components, not the app-level pages that use them

## Phases

### Phase 1: Tables & Pagination

Implement the Table compound component as a styled wrapper around native HTML `<table>`, `<thead>`, `<tbody>`, `<tfoot>`, `<tr>`, `<th>`, `<td>`, and `<caption>` elements. Each sub-component (TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption, TableFooter) receives its own `data-slot` value and supports className merging via `cn()`. Implement Pagination as a `<nav>` element containing styled button links for page navigation with previous/next buttons and ellipsis for truncated ranges. Both components follow the 5-file pattern and are pure shadcn ports with no Radix dependency.

### Phase 2: Identity & Hints

Implement Avatar wrapping `@radix-ui/react-avatar` with image-loading fallback to initials rendered in AvatarFallback. Implement Avatar Group as a custom component that renders a row of overlapping Avatars using negative margin stacking, accepts a `max` prop to cap visible avatars, and renders a `+N` indicator for overflow. Implement Tooltip wrapping `@radix-ui/react-tooltip` with configurable open delay via `delayDuration`. Implement Hover Card wrapping `@radix-ui/react-hover-card` for rich preview content on hover/focus. Implement Progress wrapping `@radix-ui/react-progress` with an animated indicator bar whose width reflects the `value` prop. All Radix-based components support controlled and uncontrolled usage.

### Phase 3: States & Search

Implement Empty State as a custom component with a centered flexbox layout containing an optional icon slot (rendered above the title), a required title, an optional description, and an optional CTA button slot. Implement Search Input as a custom component that composes the existing Input component with a search icon prefix and a clear button suffix, emitting `onSearch` when the user presses Enter and `onClear` when the clear button is clicked (which also clears the input value and refocuses the field). Search Input supports both controlled and uncontrolled usage.

## Exit Criteria

1. All 10 components (Table, Pagination, Avatar, Avatar Group, Tooltip, Hover Card, Progress, Empty State, Search Input, plus TooltipProvider) render correctly in Storybook with all variants and states documented via autodocs
2. `pnpm test` passes with zero failures, including vitest-axe accessibility assertions for every component
3. `pnpm typecheck` passes with no TypeScript errors across the entire `@components/ui` package
4. Table renders semantic, accessible HTML: `<table>` containing `<thead>`/`<tbody>` with `<tr>`, `<th>`, and `<td>` elements, and optional `<caption>` and `<tfoot>`
5. Pagination renders as a `<nav>` element with `aria-label="pagination"` and supports keyboard navigation between page links
6. Avatar displays AvatarImage when the image loads successfully and falls back to AvatarFallback (initials) when the image fails or is absent
7. Avatar Group stacks avatars with negative margins, respects the `max` prop, and renders a `+N` overflow indicator when the avatar count exceeds `max`
8. Tooltip appears on hover and focus with a configurable delay, positions relative to its trigger, and dismisses on Escape
9. Hover Card opens on hover with a delay, renders rich content in a popover-style surface, and closes on mouse leave
10. Progress bar renders an indicator whose width reflects the `value` prop (0–100) with a smooth CSS transition
11. Empty State renders a centered layout with conditional icon, title, description, and CTA button slots
12. Search Input renders a search icon prefix and clear button suffix, fires `onSearch` on Enter keypress, and fires `onClear` on clear button click while clearing the value and refocusing the input
13. All components use semantic design tokens (`bg-background`, `text-foreground`, `border-border`, `bg-muted`, etc.) and render correctly in both light and dark themes
14. All components and their types are exported from `packages/ui/src/index.ts`

## Dependencies

### Prior Milestones

- **Milestone 1 (Foundation)** — must be complete. Provides Button (used by Pagination links and Empty State CTA), Popover (architectural reference for Tooltip/HoverCard positioning), Badge, Card, and the established 5-file component pattern
- **Milestone 2 (Form Controls)** — must be complete. Provides Input (composed by Search Input) and the established pattern for controlled/uncontrolled component state
- **Milestone 3 (Layout & Navigation)** — must be complete. Provides the full component inventory that precedes this milestone in the master plan

### Infrastructure

- Monorepo build pipeline (`pnpm`, Turborepo, `tsc --build`) operational
- Storybook 8.5 running with Tailwind v4 theme integration
- Vitest + Testing Library + vitest-axe test infrastructure operational
- `packages/ui/styles/globals.css` with all OKLCH semantic tokens defined

### New Dependencies to Install

- `@radix-ui/react-avatar` — Avatar component primitive
- `@radix-ui/react-tooltip` — Tooltip component primitive
- `@radix-ui/react-hover-card` — Hover Card component primitive
- `@radix-ui/react-progress` — Progress component primitive

### Existing Dependencies Used

- `@radix-ui/react-slot` — for `asChild` support on leaf components
- `class-variance-authority` — CVA variants for all components
- `@components/utils` — `cn()` helper
- `lucide-react` or inline SVG — for Search Input's search and clear icons (verify icon approach used in existing components)

## Risks

1. **Avatar image loading in test environment** — `@radix-ui/react-avatar` uses browser image loading to detect failures, which behaves differently in jsdom. Tests may need to mock the image `onload`/`onerror` events or use Radix's built-in test utilities to simulate fallback behavior reliably.
2. **Tooltip/HoverCard hover timing in tests** — Tooltip and HoverCard rely on pointer hover events with configurable delays. Tests using `@testing-library/user-event` must correctly simulate `pointerEnter`/`pointerLeave` and advance timers to trigger delayed open/close behavior.
3. **Search Input composition complexity** — Search Input builds on the existing Input component. If Input's styling uses a flat `<input>` element without wrapper support, the search icon prefix and clear button suffix may require wrapping the Input in a container div with relative positioning, which could affect className passthrough and `asChild` behavior.
4. **Avatar Group stacking z-index** — Overlapping avatars rendered with negative margins require explicit `z-index` ordering so that earlier avatars appear above later ones (or vice versa). The chosen stacking direction must be consistent and well-documented.
5. **Progress animation performance** — The animated fill uses CSS `transition` on width. If consumers update `value` at high frequency (e.g., real-time upload progress), transitions could queue and create visual lag. The component should use `transition-duration` that balances smoothness with responsiveness.
