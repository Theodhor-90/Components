# Milestone 4: Data Display

## Goal

Deliver components for presenting tabular data, user identity, inline hints, and empty/loading states. After this milestone, consumer apps can build data-rich pages.

## Phases

### Phase 1: Tables & Pagination

Table with TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption, TableFooter (shadcn port, styled native `<table>` elements), Pagination with PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis (shadcn port, nav element with button links).

### Phase 2: Identity & Hints

Avatar with AvatarImage and AvatarFallback (shadcn port wrapping `@radix-ui/react-avatar` with image loading fallback to initials), Avatar Group (custom, stacked overlapping Avatars with configurable max visible and `+N` overflow indicator), Tooltip with TooltipTrigger, TooltipContent, TooltipProvider (shadcn port wrapping `@radix-ui/react-tooltip`), Hover Card with HoverCardTrigger and HoverCardContent (shadcn port wrapping `@radix-ui/react-hover-card`), Progress (shadcn port wrapping `@radix-ui/react-progress` with animated fill).

### Phase 3: States & Search

Empty State (custom, centered layout with icon slot, title, description, and optional CTA button), Search Input (custom, Input variant with search icon prefix and clear button suffix; emits `onSearch` on Enter and `onClear` on clear).

## Exit Criteria

1. All 10 components render correctly in Storybook with all variants documented
2. `pnpm test` passes with vitest-axe accessibility assertions for every component
3. `pnpm typecheck` passes with no errors
4. Table renders accessible `<table>` markup with proper `<thead>`/`<tbody>` structure
5. Avatar falls back to initials when image fails to load
6. Avatar Group correctly stacks avatars and shows overflow count
7. Tooltip appears on hover/focus with configurable delay
8. Progress bar animates from 0 to the given value
9. Search Input clears value and refocuses on clear button click
10. All components are exported from `packages/ui/src/index.ts`
