# Task: Pagination Component

## Objective

Implement the Pagination navigation component with all 6 sub-components (PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis) following the established 5-file component pattern as a shadcn/ui port.

## Deliverables

### Files to Create

1. **`packages/ui/src/components/pagination/pagination.types.ts`** — Props types for all 7 components:
   - `PaginationProps` extends `React.ComponentProps<'nav'>`
   - `PaginationContentProps` extends `React.ComponentProps<'ul'>`
   - `PaginationItemProps` extends `React.ComponentProps<'li'>`
   - `PaginationLinkProps` extends `React.ComponentProps<'a'> & { isActive?: boolean; asChild?: boolean } & Pick<VariantProps<typeof buttonVariants>, 'size'>`
   - `PaginationPreviousProps` and `PaginationNextProps` extend `PaginationLinkProps` (omitting `children` and providing their own)
   - `PaginationEllipsisProps` extends `React.ComponentProps<'span'>`

2. **`packages/ui/src/components/pagination/pagination.styles.ts`** — CVA variant for PaginationLink that composes with `buttonVariants` (importing from `../button/button.styles.js`). The `isActive` variant toggles between `outline` and `default` button variant styling. Static string styles for remaining sub-components:
   - Pagination: `mx-auto flex w-full justify-center`
   - PaginationContent: `flex flex-row items-center gap-1`
   - PaginationItem: no additional styles beyond `list-none`

3. **`packages/ui/src/components/pagination/pagination.tsx`** — Implementation of all 7 components as named exports:
   - Pagination renders `<nav aria-label="pagination">` wrapping children
   - PaginationContent renders a `<ul>`
   - PaginationItem renders an `<li>`
   - PaginationLink renders an `<a>` (or Slot when `asChild`) styled with `buttonVariants`
   - PaginationPrevious renders PaginationLink with a left chevron SVG (inline, 16x16, `currentColor`) + "Previous" text, with `aria-label="Go to previous page"`
   - PaginationNext renders PaginationLink with "Next" text + right chevron SVG, with `aria-label="Go to next page"`
   - PaginationEllipsis renders `<span aria-hidden="true">` containing a horizontal ellipsis character (...) and a `<span className="sr-only">More pages</span>`

4. **`packages/ui/src/components/pagination/pagination.test.tsx`** — Test suite covering:
   - Smoke render with all sub-components
   - `<nav>` element with `aria-label="pagination"`
   - PaginationLink renders as `<a>` by default
   - PaginationLink `isActive` applies active styling
   - PaginationLink `asChild` rendering
   - PaginationPrevious/Next render with correct aria-labels
   - PaginationPrevious/Next render chevron icons
   - PaginationEllipsis renders with `aria-hidden` and sr-only label
   - `aria-disabled` styling on boundary links
   - className merging
   - `data-slot` attributes
   - vitest-axe accessibility assertions

5. **`packages/ui/src/components/pagination/pagination.stories.tsx`** — Storybook CSF3 stories with `tags: ['autodocs']`. Stories:
   - Default (5-page pagination with active page highlighted)
   - WithEllipsis (pagination showing ellipsis for large page counts)
   - FirstPage (PaginationPrevious with `aria-disabled`)
   - LastPage (PaginationNext with `aria-disabled`)
   - AsChild (PaginationLink with custom router link component)

### Files to Modify

- **`packages/ui/src/index.ts`** — Add exports for all Pagination components and types.

## Design Decisions

- **`<nav>` wrapper with `aria-label="pagination"`.** Static string, not configurable — consumers can override via `aria-label` prop.
- **PaginationLink uses `buttonVariants` for styling.** Reuses existing Button CVA styles rather than duplicating them. Has its own `paginationLinkVariants` that composes `buttonVariants` with `isActive` boolean variant and size variant.
- **PaginationLink renders `<a>` by default with `asChild` support.** Default `<a>` supports `href` for static/server routing; `asChild` enables client-side router Links.
- **Boundary disabling is consumer responsibility.** PaginationPrevious/Next do not accept a `disabled` boolean prop. Consumers use `aria-disabled="true"` and the component applies `pointer-events-none opacity-50` styling.
- **Arrow icons as inline SVG.** Left/right chevron SVGs using `currentColor`, sized 16x16, avoiding external icon library dependencies.

## Dependencies

- No dependency on Task 1 (Table) — can be implemented in parallel
- Depends on Button component's `buttonVariants` export from Milestone 1 (existing, already available)
- Existing dependency: `@radix-ui/react-slot` for `asChild` support on PaginationLink
- Existing dependency: `class-variance-authority` for CVA variants
- Existing dependency: `@components/utils` for `cn()` helper
- Reference: Study the Button component (`packages/ui/src/components/button/`) for `buttonVariants` import and usage

## Verification Criteria

1. Pagination renders as `<nav aria-label="pagination">` containing a `<ul>`/`<li>` list structure
2. PaginationLink renders as `<a>` by default with `asChild` support, and applies `buttonVariants` styling with `isActive` toggle
3. PaginationPrevious and PaginationNext render inline SVG chevron icons with accessible `aria-label` attributes
4. PaginationEllipsis renders with `aria-hidden="true"` and a `<span className="sr-only">More pages</span>` for screen readers
5. `aria-disabled="true"` on PaginationPrevious/PaginationNext applies `pointer-events-none` disabled styling
6. All Storybook stories render correctly with autodocs
7. vitest-axe accessibility assertions pass
8. All components and types are exported from `packages/ui/src/index.ts`
