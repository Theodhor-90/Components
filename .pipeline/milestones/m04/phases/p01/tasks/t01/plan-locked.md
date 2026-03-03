Good. Now I have everything I need. Let me compose the revised plan addressing all four feedback issues.

# Task Plan: Table Component

## 1. Deliverables

| #   | File                                                 | Action | Purpose                                                |
| --- | ---------------------------------------------------- | ------ | ------------------------------------------------------ |
| 1   | `packages/ui/src/components/table/table.types.ts`    | Create | Props types for Table and all 7 sub-components         |
| 2   | `packages/ui/src/components/table/table.styles.ts`   | Create | Static string style constants for all 8 sub-components |
| 3   | `packages/ui/src/components/table/table.tsx`         | Create | Implementation of all 8 components as named exports    |
| 4   | `packages/ui/src/components/table/table.test.tsx`    | Create | Vitest + Testing Library + vitest-axe test suite       |
| 5   | `packages/ui/src/components/table/table.stories.tsx` | Create | Storybook CSF3 stories with autodocs                   |
| 6   | `packages/ui/src/index.ts`                           | Modify | Add exports for all Table components and types         |

## 2. Dependencies

### Prior Work Required

- Milestones 1–3 complete (Button, Card, and all preceding components exist)

### Existing Dependencies Used (no new installs)

- `@radix-ui/react-slot` — for `asChild` support on all sub-components
- `@components/utils` — `cn()` helper via `../../lib/utils.js`

### New Dependencies

None. No new npm packages are required.

## 3. Implementation Details

### 3.1 `table.types.ts`

**Purpose**: Define prop types for all 8 components.

**Exports** (all as named type exports):

```typescript
export type TableProps = React.ComponentProps<'table'> & { asChild?: boolean };
export type TableHeaderProps = React.ComponentProps<'thead'> & { asChild?: boolean };
export type TableBodyProps = React.ComponentProps<'tbody'> & { asChild?: boolean };
export type TableRowProps = React.ComponentProps<'tr'> & { asChild?: boolean };
export type TableHeadProps = React.ComponentProps<'th'> & { asChild?: boolean };
export type TableCellProps = React.ComponentProps<'td'> & { asChild?: boolean };
export type TableCaptionProps = React.ComponentProps<'caption'> & { asChild?: boolean };
export type TableFooterProps = React.ComponentProps<'tfoot'> & { asChild?: boolean };
```

Each type extends `React.ComponentProps` for its corresponding native HTML element (which includes `ref` in React 19) plus `{ asChild?: boolean }`.

No CVA `VariantProps` are needed — Table has no variant props, following the Card pattern of static string styles.

### 3.2 `table.styles.ts`

**Purpose**: Export static string style constants for each sub-component. Follows the Card precedent (plain string constants, not CVA).

**Exports**:

| Export               | Value                                                                                                |
| -------------------- | ---------------------------------------------------------------------------------------------------- |
| `tableStyles`        | `'w-full caption-bottom text-sm'`                                                                    |
| `tableHeaderStyles`  | `'[&_tr]:border-b'`                                                                                  |
| `tableBodyStyles`    | `'[&_tr:last-child]:border-0'`                                                                       |
| `tableRowStyles`     | `'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted'`                      |
| `tableHeadStyles`    | `'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0'` |
| `tableCellStyles`    | `'p-4 align-middle [&:has([role=checkbox])]:pr-0'`                                                   |
| `tableCaptionStyles` | `'mt-4 text-sm text-muted-foreground'`                                                               |
| `tableFooterStyles`  | `'border-t bg-muted/50 font-medium [&>tr:last-child]:border-b-0'`                                    |

These match the shadcn/ui Table styles. The `[&:has([role=checkbox])]` selectors allow tighter spacing when cells contain checkboxes (common in data tables). The `tableFooterStyles` uses `[&>tr:last-child]:border-b-0` to target the last child `<tr>` within the footer — the `:last-child` pseudo-class is placed inside the selector brackets to correctly scope to the child element.

Note: `tableHeaderStyles` and `tableBodyStyles` use Tailwind arbitrary variant selectors (`[&_tr]:border-b`, `[&_tr:last-child]:border-0`) that are applied as literal class strings on the DOM element via `cn()`. Tests verify these classes with `toHaveClass()`.

### 3.3 `table.tsx`

**Purpose**: Implementation of all 8 components as named exports. Each component:

- Destructures `{ className, asChild, ref, ...props }`
- Uses `Slot` (from `@radix-ui/react-slot`) or the native HTML element based on `asChild`
- Applies `data-slot` attribute
- Merges styles via `cn()`

**Key implementation detail for Table**: The `Table` component renders a wrapper `<div className="relative w-full overflow-auto">` around the `<table>` element for horizontal scroll support. The `data-slot="table"` goes on the `<table>`, not the wrapper div. When `asChild` is used, only the `<table>` element is replaced by the Slot — the wrapper div remains.

**Component signatures** (all exported as named functions with `React.JSX.Element` return type):

```typescript
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils.js';
import { tableStyles, tableHeaderStyles, tableBodyStyles, tableRowStyles, tableHeadStyles, tableCellStyles, tableCaptionStyles, tableFooterStyles } from './table.styles.js';
import type { TableProps, TableHeaderProps, TableBodyProps, TableRowProps, TableHeadProps, TableCellProps, TableCaptionProps, TableFooterProps } from './table.types.js';

// Re-export types
export type { TableProps, TableHeaderProps, TableBodyProps, TableRowProps, TableHeadProps, TableCellProps, TableCaptionProps, TableFooterProps } from './table.types.js';

export function Table({ className, asChild = false, ref, ...props }: TableProps): React.JSX.Element {
  const Comp = asChild ? Slot : 'table';
  return (
    <div className="relative w-full overflow-auto">
      <Comp data-slot="table" className={cn(tableStyles, className)} ref={ref} {...props} />
    </div>
  );
}

export function TableHeader({ className, asChild = false, ref, ...props }: TableHeaderProps): React.JSX.Element {
  const Comp = asChild ? Slot : 'thead';
  return <Comp data-slot="table-header" className={cn(tableHeaderStyles, className)} ref={ref} {...props} />;
}

export function TableBody({ className, asChild = false, ref, ...props }: TableBodyProps): React.JSX.Element {
  const Comp = asChild ? Slot : 'tbody';
  return <Comp data-slot="table-body" className={cn(tableBodyStyles, className)} ref={ref} {...props} />;
}

export function TableRow({ className, asChild = false, ref, ...props }: TableRowProps): React.JSX.Element {
  const Comp = asChild ? Slot : 'tr';
  return <Comp data-slot="table-row" className={cn(tableRowStyles, className)} ref={ref} {...props} />;
}

export function TableHead({ className, asChild = false, ref, ...props }: TableHeadProps): React.JSX.Element {
  const Comp = asChild ? Slot : 'th';
  return <Comp data-slot="table-head" className={cn(tableHeadStyles, className)} ref={ref} {...props} />;
}

export function TableCell({ className, asChild = false, ref, ...props }: TableCellProps): React.JSX.Element {
  const Comp = asChild ? Slot : 'td';
  return <Comp data-slot="table-cell" className={cn(tableCellStyles, className)} ref={ref} {...props} />;
}

export function TableCaption({ className, asChild = false, ref, ...props }: TableCaptionProps): React.JSX.Element {
  const Comp = asChild ? Slot : 'caption';
  return <Comp data-slot="table-caption" className={cn(tableCaptionStyles, className)} ref={ref} {...props} />;
}

export function TableFooter({ className, asChild = false, ref, ...props }: TableFooterProps): React.JSX.Element {
  const Comp = asChild ? Slot : 'tfoot';
  return <Comp data-slot="table-footer" className={cn(tableFooterStyles, className)} ref={ref} {...props} />;
}
```

### 3.4 `table.test.tsx`

**Purpose**: Comprehensive test suite following the Card test patterns.

**Imports**:

```typescript
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
```

**Test categories** (organized in a single `describe('Table', () => { ... })` block):

1. **Smoke render tests** (8 tests — one per sub-component):
   - Each renders the component in a minimal valid HTML context (e.g., `TableHead` inside `<table><thead><tr>...</tr></thead></table>`) and asserts `toBeInTheDocument()`.
   - Table: `render(<Table><tbody><tr><td>Content</td></tr></tbody></Table>)` — check "Content" is in the document.
   - TableHeader: render inside `<table>`, check text present.
   - TableBody: render inside `<table>`, check text present.
   - TableRow: render inside `<table><tbody>`, check text present.
   - TableHead: render inside `<table><thead><tr>`, check text present.
   - TableCell: render inside `<table><tbody><tr>`, check text present.
   - TableCaption: render inside `<table>`, check text present.
   - TableFooter: render inside `<table>`, check text present.

2. **Composed table render test** (1 test):
   - Renders a full table with all sub-components using `data-testid` on each, asserts all are present.

3. **data-slot attribute tests** (8 tests — one per sub-component):
   - Each verifies the correct `data-slot` value: `table`, `table-header`, `table-body`, `table-row`, `table-head`, `table-cell`, `table-caption`, `table-footer`.

4. **Base styling tests** (8 tests — one per sub-component):
   - Table: `toHaveClass('w-full', 'caption-bottom', 'text-sm')`
   - TableHeader: `toHaveClass('[&_tr]:border-b')` — Tailwind arbitrary variant selectors are applied as literal class strings on the DOM element via `cn()`, so `toHaveClass()` correctly matches them.
   - TableBody: `toHaveClass('[&_tr:last-child]:border-0')` — same reasoning as TableHeader; the descendant selector class string is present on the element's `className`.
   - TableRow: `toHaveClass('border-b', 'transition-colors')`
   - TableHead: `toHaveClass('h-12', 'px-4', 'text-left', 'align-middle', 'font-medium', 'text-muted-foreground')`
   - TableCell: `toHaveClass('p-4', 'align-middle')`
   - TableCaption: `toHaveClass('mt-4', 'text-sm', 'text-muted-foreground')`
   - TableFooter: `toHaveClass('border-t', 'font-medium')`

5. **className merging test** (1 test):
   - Renders a full composed table with `className="custom-class"` on every sub-component. Asserts each has both `custom-class` and a key base class.

6. **Ref forwarding test** (1 test):
   - Creates a `createRef<HTMLTableElement>()`, passes to Table, asserts `ref.current` is `instanceof HTMLTableElement` and has `data-slot="table"`.

7. **asChild rendering tests** (3 tests):
   - **TableRow asChild**: Renders `<TableRow asChild><div data-testid="custom-row">Custom</div></TableRow>` (wrapped in valid table context), asserts the custom element receives the `data-slot="table-row"` attribute and className from TableRow.
   - **Table asChild**: Renders `<Table asChild><table data-testid="custom-table"><tbody><tr><td>Content</td></tr></tbody></table></Table>`, asserts the custom `<table>` element receives `data-slot="table"` and the base classes, and the overflow wrapper div is still present.
   - **TableCell asChild**: Renders `<TableCell asChild><div data-testid="custom-cell">Content</div></TableCell>` (wrapped in valid table context), asserts the custom element receives `data-slot="table-cell"` and the base classes. This verifies asChild works for `<td>` element types where the replacement element has different semantics.

8. **Overflow container test** (1 test):
   - Renders a Table component, finds the `<table>` element's parent div, asserts it has `className` containing `overflow-auto`.

9. **Semantic HTML structure test** (1 test):
   - Renders a full table, uses `container.querySelector` to verify: `table > thead > tr > th` and `table > tbody > tr > td` structural relationships.

10. **Accessibility test** (1 test):
    - Renders a fully composed table with TableCaption (which provides accessible labeling), runs `axe(container)`, asserts `toHaveNoViolations()`.

### 3.5 `table.stories.tsx`

**Purpose**: Storybook CSF3 stories with `tags: ['autodocs']` for interactive documentation.

**Meta configuration**:

```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table.js';

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Table>;
```

**Stories**:

1. **Default** — Basic table with a header row (3 columns: Invoice, Status, Amount) and 4 body rows of sample invoice data.

2. **WithCaption** — Same table as Default but wrapped with `<TableCaption>A list of your recent invoices.</TableCaption>`.

3. **WithFooter** — Same as Default but adds a `<TableFooter>` row showing a "Total" summary cell spanning 2 columns and a total amount.

4. **Striped** — Same data as Default but with `className="even:bg-muted/50"` on each `<TableRow>` in the body to demonstrate even-row striping.

5. **Empty** — Table with only `<TableHeader>` and an empty `<TableBody>`, demonstrating the empty state appearance.

### 3.6 `index.ts` modification

**Append** the following exports at the end of `packages/ui/src/index.ts`:

```typescript
export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableFooter,
  type TableProps,
  type TableHeaderProps,
  type TableBodyProps,
  type TableRowProps,
  type TableHeadProps,
  type TableCellProps,
  type TableCaptionProps,
  type TableFooterProps,
} from './components/table/table.js';
```

No styles file export is needed — Table uses static string constants (not CVA variants), following the Card pattern where `cardStyles` etc. are not exported from `index.ts`.

## 4. API Contracts

### Component Props

| Component      | HTML Element | Props (beyond native element props) |
| -------------- | ------------ | ----------------------------------- |
| `Table`        | `<table>`    | `asChild?: boolean`                 |
| `TableHeader`  | `<thead>`    | `asChild?: boolean`                 |
| `TableBody`    | `<tbody>`    | `asChild?: boolean`                 |
| `TableRow`     | `<tr>`       | `asChild?: boolean`                 |
| `TableHead`    | `<th>`       | `asChild?: boolean`                 |
| `TableCell`    | `<td>`       | `asChild?: boolean`                 |
| `TableCaption` | `<caption>`  | `asChild?: boolean`                 |
| `TableFooter`  | `<tfoot>`    | `asChild?: boolean`                 |

### Usage Example

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui';

<Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell colSpan={2}>Total</TableCell>
      <TableCell className="text-right">$2,500.00</TableCell>
    </TableRow>
  </TableFooter>
</Table>;
```

### Data Attributes

Every sub-component applies `data-slot` on its root element:

| Component      | `data-slot` value |
| -------------- | ----------------- |
| `Table`        | `"table"`         |
| `TableHeader`  | `"table-header"`  |
| `TableBody`    | `"table-body"`    |
| `TableRow`     | `"table-row"`     |
| `TableHead`    | `"table-head"`    |
| `TableCell`    | `"table-cell"`    |
| `TableCaption` | `"table-caption"` |
| `TableFooter`  | `"table-footer"`  |

## 5. Test Plan

### Test Setup

- **Runner**: Vitest with jsdom environment
- **Setup file**: `packages/ui/src/test-setup.ts` (provides `@testing-library/jest-dom` matchers and `vitest-axe` matchers)
- **Imports**: `@testing-library/react` for `render`/`screen`, `vitest-axe` for `axe`, `vitest` for `describe`/`expect`/`it`, `react` for `createRef`

### Test File: `table.test.tsx`

| #   | Test Name                                              | Category    | What It Verifies                                                                           |
| --- | ------------------------------------------------------ | ----------- | ------------------------------------------------------------------------------------------ |
| 1   | `Table renders without crashing`                       | Smoke       | Table component renders and displays content                                               |
| 2   | `TableHeader renders without crashing`                 | Smoke       | TableHeader renders inside a table context                                                 |
| 3   | `TableBody renders without crashing`                   | Smoke       | TableBody renders inside a table context                                                   |
| 4   | `TableRow renders without crashing`                    | Smoke       | TableRow renders inside a table/tbody context                                              |
| 5   | `TableHead renders without crashing`                   | Smoke       | TableHead renders inside a table/thead/tr context                                          |
| 6   | `TableCell renders without crashing`                   | Smoke       | TableCell renders inside a table/tbody/tr context                                          |
| 7   | `TableCaption renders without crashing`                | Smoke       | TableCaption renders inside a table context                                                |
| 8   | `TableFooter renders without crashing`                 | Smoke       | TableFooter renders inside a table context                                                 |
| 9   | `renders a fully composed table`                       | Composition | All sub-components render together via data-testid                                         |
| 10  | `Table has correct data-slot`                          | data-slot   | `data-slot="table"`                                                                        |
| 11  | `TableHeader has correct data-slot`                    | data-slot   | `data-slot="table-header"`                                                                 |
| 12  | `TableBody has correct data-slot`                      | data-slot   | `data-slot="table-body"`                                                                   |
| 13  | `TableRow has correct data-slot`                       | data-slot   | `data-slot="table-row"`                                                                    |
| 14  | `TableHead has correct data-slot`                      | data-slot   | `data-slot="table-head"`                                                                   |
| 15  | `TableCell has correct data-slot`                      | data-slot   | `data-slot="table-cell"`                                                                   |
| 16  | `TableCaption has correct data-slot`                   | data-slot   | `data-slot="table-caption"`                                                                |
| 17  | `TableFooter has correct data-slot`                    | data-slot   | `data-slot="table-footer"`                                                                 |
| 18  | `Table applies base styling`                           | Styling     | `w-full`, `caption-bottom`, `text-sm` classes                                              |
| 19  | `TableHeader applies base styling`                     | Styling     | `[&_tr]:border-b` class (arbitrary variant applied as literal class string)                |
| 20  | `TableBody applies base styling`                       | Styling     | `[&_tr:last-child]:border-0` class (arbitrary variant applied as literal class string)     |
| 21  | `TableRow applies base styling`                        | Styling     | `border-b`, `transition-colors` classes                                                    |
| 22  | `TableHead applies base styling`                       | Styling     | `h-12`, `px-4`, `text-left`, `align-middle`, `font-medium`, `text-muted-foreground`        |
| 23  | `TableCell applies base styling`                       | Styling     | `p-4`, `align-middle` classes                                                              |
| 24  | `TableCaption applies base styling`                    | Styling     | `mt-4`, `text-sm`, `text-muted-foreground`                                                 |
| 25  | `TableFooter applies base styling`                     | Styling     | `border-t`, `font-medium` classes                                                          |
| 26  | `each sub-component merges custom className`           | className   | All sub-components have both `custom-class` and base classes                               |
| 27  | `Table forwards ref`                                   | Ref         | `ref.current` is `HTMLTableElement` with `data-slot="table"`                               |
| 28  | `TableRow supports asChild`                            | asChild     | Custom element receives `data-slot="table-row"` and className                              |
| 29  | `Table supports asChild`                               | asChild     | Custom `<table>` receives `data-slot="table"` and base classes; overflow wrapper preserved |
| 30  | `TableCell supports asChild`                           | asChild     | Custom element receives `data-slot="table-cell"` and base classes                          |
| 31  | `Table wraps table in overflow container`              | Structure   | Parent div of `<table>` has `overflow-auto` class                                          |
| 32  | `renders semantic HTML structure`                      | Structure   | `table > thead > tr > th` and `table > tbody > tr > td` exist                              |
| 33  | `fully composed table has no accessibility violations` | a11y        | `axe(container)` returns no violations                                                     |

### Important Test Context Notes

Table sub-components that are HTML table elements (`<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`, `<caption>`, `<tfoot>`) must be rendered within valid parent contexts to avoid jsdom warnings:

- `TableHead` → wrap in `<table><thead><tr>...</tr></thead></table>`
- `TableCell` → wrap in `<table><tbody><tr>...</tr></tbody></table>`
- `TableRow` → wrap in `<table><tbody>...</tbody></table>`
- `TableHeader`, `TableBody`, `TableFooter`, `TableCaption` → wrap in `<table>...</table>`

Use native HTML elements (not our components) for the wrapping context in individual smoke/data-slot/styling tests to isolate each component under test.

## 6. Implementation Order

1. **`table.types.ts`** — Define all 8 prop types. No dependencies on other new files.
2. **`table.styles.ts`** — Define all 8 static string style constants. No dependencies on other new files.
3. **`table.tsx`** — Implement all 8 components. Depends on types and styles files.
4. **`table.test.tsx`** — Write test suite. Depends on the implementation file.
5. **`table.stories.tsx`** — Write Storybook stories. Depends on the implementation file.
6. **`index.ts`** — Append Table exports. Depends on the implementation file.

Steps 1 and 2 can be done in parallel. Steps 4 and 5 can be done in parallel after step 3.

## 7. Verification Commands

```bash
# Run Table-specific tests
pnpm --filter @components/ui test -- --run src/components/table/table.test.tsx

# Run full test suite to check for regressions
pnpm test

# TypeScript type checking
pnpm typecheck

# Build the package to verify exports
pnpm build

# Lint check
pnpm lint
```

## 8. Design Deviations

**Deviation 1: Card does not use `asChild` — Table does**

- **Card precedent**: The Card component (referenced as the compound component pattern to follow) does NOT use `asChild` or `Slot`. Its types are plain `React.ComponentProps<'div'>` without `asChild`.
- **Task spec requirement**: The task spec explicitly requires all Table sub-components to support `asChild` via Radix `Slot`.
- **Decision**: Follow the task spec. Table sub-components accept `asChild?: boolean` and use `Slot` from `@radix-ui/react-slot` when `asChild` is true. This is the correct approach since the task spec and phase spec both explicitly require it, and it aligns with the broader project convention that leaf components support `asChild` for polymorphic rendering. Card's omission of `asChild` appears to be an intentional simplification for its use case (always renders `<div>` elements), not a prohibition against using it.

**Deviation 2: Style string exports for TableHeader/TableBody use descendant selectors**

- **Card precedent**: Card style strings contain only direct utility classes applied to the element itself (e.g., `'flex flex-col gap-y-1.5 p-6'`).
- **Issue**: The shadcn/ui Table styles for `<thead>` and `<tbody>` use descendant selectors (`[&_tr]:border-b` and `[&_tr:last-child]:border-0`) rather than direct utility classes. These are valid Tailwind v4 arbitrary variant selectors that style child `<tr>` elements from the parent.
- **Decision**: Use the descendant selector styles as-is. This is a fundamental part of how shadcn/ui Table works — the border-bottom on rows is controlled from the parent section elements to allow removing the border from the last row in `<tbody>`. These selectors are fully supported by Tailwind v4, are applied as literal class strings on the DOM element via `cn()`, and are verified in tests using `toHaveClass()`.

## 9. Feedback Revisions

This section documents how each issue from the v1 feedback was addressed:

1. **CSS syntax error in `tableFooterStyles`** (correctness): Fixed `[&>tr]:last:border-b-0` to `[&>tr:last-child]:border-b-0`. The `:last-child` pseudo-class is now correctly placed inside the selector brackets to target the last child `<tr>` within the footer, not the footer itself when it is `:last-child`. See section 3.2.

2. **Ambiguous TableHeader/TableBody styling tests** (completeness): Clarified that `[&_tr]:border-b` and `[&_tr:last-child]:border-0` ARE applied as literal class strings on the DOM element by `cn()`. Tests #19 and #20 now explicitly use `toHaveClass('[&_tr]:border-b')` and `toHaveClass('[&_tr:last-child]:border-0')` respectively. The incorrect claim that these "are not applied as classes on the element itself" has been removed. See sections 3.2 and 3.4.

3. **asChild test coverage limited to TableRow** (completeness): Added two additional asChild tests — test #29 for `Table` (verifies asChild works for the `<table>` element type and that the overflow wrapper div is preserved) and test #30 for `TableCell` (verifies asChild works for `<td>` element types with different semantics). The test suite now covers 3 asChild tests across different element types. See sections 3.4 and 5.

4. **Incorrect claim about child selector classes** (correctness): The erroneous statement in section 3.4 point 4 that TableHeader/TableBody styles "are not applied as classes on the element itself" has been removed. The plan now correctly states that Tailwind v4 applies arbitrary variant selectors as literal class strings on the DOM element, and tests verify this with `toHaveClass()`. See sections 3.2 and 3.4.
