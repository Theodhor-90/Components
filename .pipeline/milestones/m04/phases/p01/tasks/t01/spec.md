# Task: Table Component

## Objective

Implement the Table compound component with all 7 sub-components (TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption, TableFooter) following the established 5-file component pattern as a shadcn/ui port of styled native HTML `<table>` elements.

## Deliverables

### Files to Create

1. **`packages/ui/src/components/table/table.types.ts`** — Props types for all 8 components (Table + 7 sub-components). Each type extends `React.ComponentProps<'element'>` for its corresponding HTML element (`'table'`, `'thead'`, `'tbody'`, `'tr'`, `'th'`, `'td'`, `'caption'`, `'tfoot'`) plus `{ asChild?: boolean }`.

2. **`packages/ui/src/components/table/table.styles.ts`** — Static string style constants (not CVA) for all 8 sub-components, following the Card component precedent. Key styles:
   - Table: `w-full caption-bottom text-sm`
   - TableRow: `border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted`
   - TableHead: `h-12 px-4 text-left align-middle font-medium text-muted-foreground`
   - TableCell: `p-4 align-middle`
   - Export as plain string constants (e.g., `tableRowStyles`, `tableHeadStyles`)

3. **`packages/ui/src/components/table/table.tsx`** — Implementation of all 8 components as named exports. Each component:
   - Destructures `{ className, asChild, ref, ...props }`
   - Uses `Slot` or the native HTML element based on `asChild`
   - Applies `data-slot` attribute
   - Merges styles via `cn()`
   - Table wraps its children in a `<div className="relative w-full overflow-auto">` container for horizontal scroll support — the `<table>` sits inside this wrapper div

4. **`packages/ui/src/components/table/table.test.tsx`** — Test suite covering:
   - Smoke render of Table with all sub-components
   - `data-slot` attributes on every sub-component (`table`, `table-header`, `table-body`, `table-row`, `table-head`, `table-cell`, `table-caption`, `table-footer`)
   - className merging
   - `asChild` rendering
   - Ref forwarding
   - Semantic HTML structure verification (table > thead > tr > th, table > tbody > tr > td)
   - vitest-axe accessibility assertions

5. **`packages/ui/src/components/table/table.stories.tsx`** — Storybook CSF3 stories with `tags: ['autodocs']`. Stories:
   - Default (basic table with header and body rows)
   - WithCaption (table with TableCaption)
   - WithFooter (table with TableFooter for totals row)
   - Striped (demonstrating even-row styling via className)
   - Empty (table with no body rows)

### Files to Modify

- **`packages/ui/src/index.ts`** — Add exports for all Table components and types.

## Design Decisions

- **Native HTML elements, not Radix primitives.** The only Radix dependency is `@radix-ui/react-slot` for `asChild` support.
- **Static string styles, not CVA.** Table sub-components have no variant props — each has a single visual treatment. Follow the Card component precedent.
- **All sub-components support `asChild`** via Radix `Slot` for polymorphic rendering.
- **Each sub-component gets its own `data-slot`** value: `table`, `table-header`, `table-body`, `table-row`, `table-head`, `table-cell`, `table-caption`, `table-footer`.

## Dependencies

- No prior tasks within this phase (can be implemented independently of Task 2)
- Existing dependency: `@radix-ui/react-slot` for `asChild` support
- Existing dependency: `@components/utils` for `cn()` helper
- Reference: Study the Card component (`packages/ui/src/components/card/`) for the compound component pattern with static string styles
- Reference: Study the Button component for the canonical 5-file pattern

## Verification Criteria

1. Table renders semantic HTML: `<table>` containing `<thead>`/`<tbody>` with `<tr>`, `<th>`, and `<td>` elements, and optional `<caption>` via TableCaption and `<tfoot>` via TableFooter
2. All 8 sub-components apply their respective `data-slot` attributes
3. Table wraps its `<table>` in an overflow-auto container for horizontal scroll support
4. All sub-components support `asChild` via Radix `Slot` and merge `className` via `cn()`
5. All Storybook stories render correctly with autodocs
6. vitest-axe accessibility assertions pass
7. All components and types are exported from `packages/ui/src/index.ts`
