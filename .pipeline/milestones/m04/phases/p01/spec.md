## Goal

Implement the Table compound component and the Pagination navigation component — the two foundational data-display primitives that enable consumer apps to render structured tabular data with page-based navigation.

## Deliverables

- **Table** — shadcn port of styled native `<table>` elements with 7 sub-components: TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption, TableFooter. Each sub-component receives its own `data-slot` value and supports `className` merging via `cn()`. All sub-components support `asChild` via Radix `Slot`. No Radix dependency beyond Slot.
- **Pagination** — shadcn port of a `<nav>` element with `aria-label="pagination"` containing styled links for page navigation, with 6 sub-components: PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis.
  - PaginationLink renders as an `<a>` element by default (supporting `href` for static routing) and supports `asChild` for `onClick`-based navigation or router integration.
  - PaginationPrevious and PaginationNext are convenience wrappers around PaginationLink that render left/right arrow icons (inline SVG) alongside "Previous"/"Next" text.
  - Disabling PaginationPrevious/PaginationNext at boundary pages is consumer responsibility — the components accept `aria-disabled` and apply disabled styling when present.
  - PaginationEllipsis renders a `<span>` with `aria-hidden="true"` and a "More pages" `<span className="sr-only">` label.
- Full Vitest + vitest-axe test suites and Storybook CSF3 stories with autodocs for both components.
- Both components exported from `packages/ui/src/index.ts`.

## Technical Constraints

- Both components follow the 5-file pattern: `{name}.tsx`, `{name}.styles.ts`, `{name}.types.ts`, `{name}.test.tsx`, `{name}.stories.tsx`.
- Table must render semantic, accessible HTML: `<table>` containing `<thead>`/`<tbody>` with `<tr>`, `<th>`, and `<td>` elements, and optional `<caption>` and `<tfoot>`.
- Both are pure shadcn ports — preserve the shadcn/ui API surface and behavior.
- Use OKLCH semantic tokens for all styling (`border-border`, `bg-muted`, `text-foreground`, etc.).
- Named exports only, no default exports. `import type` for type-only imports.
- React 19 ref-as-prop — no `forwardRef`.

## Dependencies

- No prior phases within this milestone (this is Phase 1).
- **Milestone 1 (Foundation)** must be complete — provides Button (used by Pagination links), and the established 5-file component pattern.
- **Milestone 2 (Form Controls)** must be complete.
- **Milestone 3 (Layout & Navigation)** must be complete.
- Existing dependencies: `@radix-ui/react-slot` (for `asChild`), `class-variance-authority`, `@components/utils` (`cn()` helper).
- No new npm dependencies required for this phase.
