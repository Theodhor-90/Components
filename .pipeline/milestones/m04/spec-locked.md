Now I have all the context needed. Let me compose the revised specification addressing every feedback issue.

# Milestone 4: Data Display — Specification

## Goal

Deliver components for presenting tabular data, user identity, inline hints, and empty/loading states. After this milestone, consumer apps can build data-rich pages with accessible tables, avatar stacks, tooltips, hover previews, progress indicators, placeholder states, and inline search filtering.

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
- **Search Input** — custom component with a search icon prefix, clear button suffix, `onSearch` (Enter key), and `onClear` callbacks
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

Implement the Table compound component as a styled wrapper around native HTML `<table>`, `<thead>`, `<tbody>`, `<tfoot>`, `<tr>`, `<th>`, `<td>`, and `<caption>` elements. Each sub-component (TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption, TableFooter) receives its own `data-slot` value and supports className merging via `cn()`. Table and all sub-components support `asChild` via Radix `Slot`. Both Table and its sub-components are pure shadcn ports with no Radix dependency beyond Slot.

Implement Pagination as a `<nav>` element with `aria-label="pagination"` containing styled links for page navigation. PaginationLink renders as an `<a>` element by default (supporting `href` for static routing) and supports `asChild` for consumers who need `onClick`-based navigation or router integration. PaginationPrevious and PaginationNext are convenience wrappers around PaginationLink that render left/right arrow icons (inline SVG) alongside "Previous"/"Next" text. Disabling PaginationPrevious at the first page and PaginationNext at the last page is consumer responsibility — the components accept `aria-disabled` and apply disabled styling when present. PaginationEllipsis renders a `<span>` with `aria-hidden="true"` and a "More pages" `<span className="sr-only">` label. Both components follow the 5-file pattern and are pure shadcn ports.

### Phase 2: Identity & Hints

Implement Avatar wrapping `@radix-ui/react-avatar` with image-loading fallback to initials rendered in AvatarFallback. AvatarImage renders the user's image and AvatarFallback displays when the image fails to load or is absent.

Implement Avatar Group as a custom component that renders a row of overlapping Avatars using negative margin stacking (`-ml-3` on each avatar after the first). Avatars stack with **right-to-left z-index** — the first avatar has the highest z-index and appears on top, with each subsequent avatar tucked behind the previous one (`z-[N]` where N decreases). This matches the conventional left-to-right reading order where the first item is visually prominent. The component accepts a `max` prop to cap visible avatars and renders a `+N` indicator (styled as a circular badge matching avatar dimensions) for overflow.

Implement Tooltip wrapping `@radix-ui/react-tooltip` with configurable open delay via `delayDuration`. TooltipProvider is exported as part of the Tooltip component's file and is required to wrap any tree containing tooltips — it is a Radix context provider, not a standalone component with its own 5-file pattern. Implement Hover Card wrapping `@radix-ui/react-hover-card` for rich preview content on hover/focus. Implement Progress wrapping `@radix-ui/react-progress` with an animated indicator bar whose width reflects the `value` prop (0–100) using a CSS `transition` on the `transform` property. All Radix-based components support controlled and uncontrolled usage.

### Phase 3: States & Search

Implement Empty State as a custom component with a centered flexbox layout containing an optional icon slot (rendered above the title via a `ReactNode` prop), a required title, an optional description, and an optional CTA button slot (also a `ReactNode` prop). The component uses `text-muted-foreground` for description text and centers content both horizontally and vertically within its container.

Implement Search Input as a custom standalone component that renders its own `<input>` element — it does **not** compose the existing Input component. Search Input renders a relative-positioned container `<div>` with:

- An absolutely-positioned search icon (inline SVG, magnifying glass) on the left
- A native `<input>` element with left padding to accommodate the icon, styled to match Input's visual appearance by reusing `inputVariants` from `input.styles.ts`
- An absolutely-positioned clear button (inline SVG, X icon) on the right, visible only when the input has a value

Search Input fires `onSearch` when the user presses Enter and `onClear` when the clear button is clicked (which also clears the input value and refocuses the `<input>`). The component supports both controlled (`value`/`onChange`) and uncontrolled usage via internal state.

## Exit Criteria

1. All 10 components (Table, Pagination, Avatar, Avatar Group, Tooltip, Hover Card, Progress, Empty State, Search Input) render correctly in Storybook with all variants and states documented via autodocs
2. `pnpm test` passes with zero failures, including vitest-axe accessibility assertions for every component
3. `pnpm typecheck` passes with no TypeScript errors across the entire `@components/ui` package
4. Table renders semantic, accessible HTML: `<table>` containing `<thead>`/`<tbody>` with `<tr>`, `<th>`, and `<td>` elements, and optional `<caption>` and `<tfoot>`
5. Pagination renders as a `<nav>` element with `aria-label="pagination"`, PaginationLink renders as `<a>` with `asChild` support, and PaginationEllipsis includes an `sr-only` label
6. Avatar displays AvatarImage when the image loads successfully and falls back to AvatarFallback (initials) when the image fails or is absent
7. Avatar Group stacks avatars with negative margins and right-to-left z-index ordering (first avatar on top), respects the `max` prop, and renders a `+N` overflow indicator when the avatar count exceeds `max`
8. Tooltip appears on hover and focus with a configurable delay, positions relative to its trigger, and dismisses on Escape
9. Hover Card opens on hover with a delay, renders rich content in a popover-style surface, and closes on mouse leave
10. Progress bar renders an indicator whose width reflects the `value` prop (0–100) with a smooth CSS transition
11. Empty State renders a centered layout with conditional icon, title, description, and CTA button slots
12. Search Input renders an inline SVG search icon prefix and clear button suffix, fires `onSearch` on Enter keypress, and fires `onClear` on clear button click while clearing the value and refocusing the input
13. All components and their types are exported from `packages/ui/src/index.ts`

## Dependencies

### Prior Milestones

- **Milestone 1 (Foundation)** — must be complete. Provides Button (used by Pagination links and Empty State CTA), Popover (architectural reference for Tooltip/HoverCard positioning), Badge, Card, and the established 5-file component pattern
- **Milestone 2 (Form Controls)** — must be complete. Provides Input (whose `inputVariants` CVA styles are reused by Search Input) and the established pattern for controlled/uncontrolled component state
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

## Risks

1. **Avatar image loading in test environment** — `@radix-ui/react-avatar` uses browser image loading to detect failures, which behaves differently in jsdom. Tests may need to mock the image `onload`/`onerror` events or use Radix's built-in test utilities to simulate fallback behavior reliably.
2. **Tooltip/HoverCard hover timing in tests** — Tooltip and HoverCard rely on pointer hover events with configurable delays. Tests using `@testing-library/user-event` must correctly simulate `pointerEnter`/`pointerLeave` and advance timers to trigger delayed open/close behavior.
3. **Progress animation performance** — The animated fill uses CSS `transition` on transform. If consumers update `value` at high frequency (e.g., real-time upload progress), transitions could queue and create visual lag. The component should use a `transition-duration` that balances smoothness with responsiveness.
