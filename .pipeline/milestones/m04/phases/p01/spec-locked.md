Now I have all the context needed. Here is the complete phase specification:

# Phase 1: Tables & Pagination — Specification

## Goal

Implement the Table compound component and the Pagination navigation component — the two foundational data-display primitives in Milestone 4 that enable consumer apps to render structured tabular data with page-based navigation controls, following the established 5-file component pattern and shadcn/ui API surface.

## Design Decisions

### Table

1. **Native HTML elements, not Radix primitives.** Table wraps semantic `<table>`, `<thead>`, `<tbody>`, `<tfoot>`, `<tr>`, `<th>`, `<td>`, and `<caption>` elements. The only Radix dependency is `@radix-ui/react-slot` for `asChild` support. This follows the shadcn/ui approach where Table is a styled wrapper, not a behavioral primitive.

2. **Static string styles, not CVA.** Table sub-components have no variant props — each has a single visual treatment. Following the Card component precedent, styles are exported as plain string constants (e.g., `tableRowStyles`, `tableHeadStyles`) rather than CVA functions. This keeps the styles file simple and avoids unnecessary variant machinery.

3. **All sub-components support `asChild`.** Each sub-component (TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption, TableFooter) accepts `asChild` via Radix `Slot`, enabling consumers to replace the underlying HTML element while preserving merged props and styling.

4. **Each sub-component gets its own `data-slot`.** Values: `table`, `table-header`, `table-body`, `table-row`, `table-head`, `table-cell`, `table-caption`, `table-footer`. This enables targeted styling and testing from parent components.

### Pagination

5. **`<nav>` wrapper with `aria-label`.** The root Pagination component renders a `<nav aria-label="pagination">` element, matching shadcn/ui's accessible pattern. This is a static string, not configurable — consumers can override via `aria-label` prop if needed.

6. **PaginationLink uses `buttonVariants` for styling.** PaginationLink is styled using the existing `buttonVariants` CVA function from the Button component (imported from `../button/button.styles.js`), applying the `outline` variant for inactive pages and the `default` variant for the active page. This reuses existing styles rather than duplicating them. PaginationLink has its own `paginationLinkVariants` CVA in its styles file that composes `buttonVariants` with an `isActive` boolean variant and size variant.

7. **PaginationLink renders `<a>` by default with `asChild` support.** The default element is `<a>` (supporting `href` for static/server routing). Consumers using client-side routers pass `asChild` with their router's Link component. This matches the shadcn/ui pattern.

8. **Boundary disabling is consumer responsibility.** PaginationPrevious and PaginationNext do not accept a `disabled` boolean prop. Consumers use `aria-disabled="true"` to indicate boundary state, and the component applies `pointer-events-none opacity-50` styling when `aria-disabled` is present. This keeps the pagination stateless.

9. **Arrow icons as inline SVG.** PaginationPrevious renders a left chevron SVG and PaginationNext renders a right chevron SVG. These are inline `<svg>` elements (not an icon library dependency) to avoid adding external dependencies. The SVGs use `currentColor` for fill and are sized at 16×16.

## Tasks

### Task 1: Table Component

Implement the Table compound component with all 7 sub-components following the 5-file pattern.

**Deliverables:**

- `packages/ui/src/components/table/table.types.ts` — Props types for all 8 components (Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption, TableFooter). Each type extends `React.ComponentProps<'element'>` for its corresponding HTML element (`'table'`, `'thead'`, `'tbody'`, `'tr'`, `'th'`, `'td'`, `'caption'`, `'tfoot'`) plus `{ asChild?: boolean }`.
- `packages/ui/src/components/table/table.styles.ts` — Static string style constants for all 8 sub-components. Key styles: Table gets `w-full caption-bottom text-sm`, TableRow gets `border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted`, TableHead gets `h-12 px-4 text-left align-middle font-medium text-muted-foreground`, TableCell gets `p-4 align-middle`, etc. Follow the Card pattern of plain string exports.
- `packages/ui/src/components/table/table.tsx` — Implementation of all 8 components as named exports. Each component destructures `{ className, asChild, ref, ...props }`, uses `Slot` or the native HTML element based on `asChild`, applies `data-slot`, and merges styles via `cn()`. Table wraps its children in a `<div className="relative w-full overflow-auto">` container for horizontal scroll support — the `<table>` sits inside this wrapper div.
- `packages/ui/src/components/table/table.test.tsx` — Test suite covering: smoke render of Table with all sub-components, `data-slot` attributes on every sub-component, className merging, `asChild` rendering, ref forwarding, semantic HTML structure verification (table > thead > tr > th, table > tbody > tr > td), and vitest-axe accessibility assertions.
- `packages/ui/src/components/table/table.stories.tsx` — Storybook CSF3 stories with `tags: ['autodocs']`. Stories: Default (basic table with header and body rows), WithCaption (table with TableCaption), WithFooter (table with TableFooter for totals row), Striped (demonstrating even-row styling via className), Empty (table with no body rows).
- Export all Table components and types from `packages/ui/src/index.ts`.

### Task 2: Pagination Component

Implement the Pagination navigation component with all 6 sub-components following the 5-file pattern.

**Deliverables:**

- `packages/ui/src/components/pagination/pagination.types.ts` — Props types for all 7 components. Pagination extends `React.ComponentProps<'nav'>`. PaginationContent extends `React.ComponentProps<'ul'>`. PaginationItem extends `React.ComponentProps<'li'>`. PaginationLink extends `React.ComponentProps<'a'> & { isActive?: boolean; asChild?: boolean } & Pick<VariantProps<typeof buttonVariants>, 'size'>`. PaginationPrevious and PaginationNext extend `PaginationLinkProps` (omitting `children` and providing their own). PaginationEllipsis extends `React.ComponentProps<'span'>`.
- `packages/ui/src/components/pagination/pagination.styles.ts` — CVA variant for PaginationLink that composes with `buttonVariants` (importing from `../button/button.styles.js`). The `isActive` variant toggles between `outline` and `default` button variant styling. Static string styles for the remaining sub-components: Pagination gets `mx-auto flex w-full justify-center`, PaginationContent gets `flex flex-row items-center gap-1`, PaginationItem gets no additional styles beyond `list-none`.
- `packages/ui/src/components/pagination/pagination.tsx` — Implementation of all 7 components as named exports. Pagination renders `<nav aria-label="pagination">` wrapping children. PaginationContent renders a `<ul>`. PaginationItem renders an `<li>`. PaginationLink renders an `<a>` (or Slot when `asChild`) styled with `buttonVariants`. PaginationPrevious renders PaginationLink with a left chevron SVG (inline, 16×16, `currentColor`) + "Previous" text, with `aria-label="Go to previous page"`. PaginationNext renders PaginationLink with "Next" text + right chevron SVG, with `aria-label="Go to next page"`. PaginationEllipsis renders `<span aria-hidden="true">` containing a horizontal ellipsis character (…) and a `<span className="sr-only">More pages</span>`.
- `packages/ui/src/components/pagination/pagination.test.tsx` — Test suite covering: smoke render with all sub-components, `<nav>` element with `aria-label="pagination"`, PaginationLink renders as `<a>` by default, PaginationLink `isActive` applies active styling, PaginationLink `asChild` rendering, PaginationPrevious/Next render with correct aria-labels, PaginationPrevious/Next render chevron icons, PaginationEllipsis renders with `aria-hidden` and sr-only label, `aria-disabled` styling on boundary links, className merging, `data-slot` attributes, and vitest-axe accessibility assertions.
- `packages/ui/src/components/pagination/pagination.stories.tsx` — Storybook CSF3 stories with `tags: ['autodocs']`. Stories: Default (5-page pagination with active page highlighted), WithEllipsis (pagination showing ellipsis for large page counts), FirstPage (PaginationPrevious with `aria-disabled`), LastPage (PaginationNext with `aria-disabled`), AsChild (PaginationLink with custom router link component).
- Export all Pagination components and types from `packages/ui/src/index.ts`.

### Task 3: Integration Verification

Verify both components work together and all quality gates pass.

**Deliverables:**

- Run `pnpm typecheck` — must pass with zero TypeScript errors.
- Run `pnpm test` — all Table and Pagination tests must pass, including vitest-axe accessibility checks.
- Run `pnpm build` (if applicable) — the `@components/ui` package builds successfully with the new components included.
- Verify Storybook renders both components correctly with all stories visible and interactive.
- Verify `packages/ui/src/index.ts` exports all new components, types, and style functions.

## Exit Criteria

1. Table renders semantic HTML: `<table>` containing `<thead>`/`<tbody>` with `<tr>`, `<th>`, and `<td>` elements, and optional `<caption>` via TableCaption and `<tfoot>` via TableFooter
2. All 8 Table sub-components apply their respective `data-slot` attributes (`table`, `table-header`, `table-body`, `table-row`, `table-head`, `table-cell`, `table-caption`, `table-footer`)
3. Table wraps its `<table>` in an overflow-auto container for horizontal scroll support
4. All Table sub-components support `asChild` via Radix `Slot` and merge `className` via `cn()`
5. Pagination renders as `<nav aria-label="pagination">` containing a `<ul>`/`<li>` list structure
6. PaginationLink renders as `<a>` by default with `asChild` support, and applies `buttonVariants` styling with `isActive` toggle
7. PaginationPrevious and PaginationNext render inline SVG chevron icons with accessible `aria-label` attributes
8. PaginationEllipsis renders with `aria-hidden="true"` and a `<span className="sr-only">More pages</span>` for screen readers
9. `aria-disabled="true"` on PaginationPrevious/PaginationNext applies `pointer-events-none` disabled styling
10. `pnpm typecheck` passes with zero errors
11. `pnpm test` passes with zero failures, including vitest-axe accessibility assertions for both components
12. All Storybook stories render correctly with `tags: ['autodocs']` generating documentation
13. All components and their types are exported from `packages/ui/src/index.ts`

## Dependencies

### Prior Milestones

- **Milestone 1 (Foundation)** — complete. Provides Button (`buttonVariants` reused by PaginationLink), the 5-file component pattern, and foundational primitives.
- **Milestone 2 (Form Controls)** — complete. Provides Input (architectural reference) and controlled/uncontrolled state patterns.
- **Milestone 3 (Layout & Navigation)** — complete. Provides all preceding components in the master plan.

### Within This Phase

- Task 2 (Pagination) depends on the Button component's `buttonVariants` export from Milestone 1 — but has **no dependency** on Task 1 (Table). Tasks 1 and 2 can be implemented in parallel.
- Task 3 (Integration Verification) depends on Tasks 1 and 2 being complete.

### Infrastructure

- Monorepo build pipeline (`pnpm`, Turborepo, `tsc --build`) operational
- Storybook 8.5 running with Tailwind v4 and `@theme inline` mapping
- Vitest + Testing Library + vitest-axe test infrastructure operational
- `packages/ui/styles/globals.css` with all OKLCH semantic tokens defined

### Existing Dependencies Used

- `@radix-ui/react-slot` — for `asChild` support on all sub-components
- `class-variance-authority` — CVA for PaginationLink variants
- `@components/utils` — `cn()` helper for className merging

### New Dependencies

None. This phase uses only existing dependencies. No new npm packages are required.

## Artifacts

| Artifact                                                       | Action | Description                                                   |
| -------------------------------------------------------------- | ------ | ------------------------------------------------------------- |
| `packages/ui/src/components/table/table.types.ts`              | Create | Props types for Table and all 7 sub-components                |
| `packages/ui/src/components/table/table.styles.ts`             | Create | Static string style constants for all sub-components          |
| `packages/ui/src/components/table/table.tsx`                   | Create | Implementation of Table and all sub-components                |
| `packages/ui/src/components/table/table.test.tsx`              | Create | Vitest + vitest-axe test suite                                |
| `packages/ui/src/components/table/table.stories.tsx`           | Create | Storybook CSF3 stories with autodocs                          |
| `packages/ui/src/components/pagination/pagination.types.ts`    | Create | Props types for Pagination and all 6 sub-components           |
| `packages/ui/src/components/pagination/pagination.styles.ts`   | Create | CVA variants for PaginationLink, static styles for others     |
| `packages/ui/src/components/pagination/pagination.tsx`         | Create | Implementation of Pagination and all sub-components           |
| `packages/ui/src/components/pagination/pagination.test.tsx`    | Create | Vitest + vitest-axe test suite                                |
| `packages/ui/src/components/pagination/pagination.stories.tsx` | Create | Storybook CSF3 stories with autodocs                          |
| `packages/ui/src/index.ts`                                     | Modify | Add exports for all Table and Pagination components and types |
