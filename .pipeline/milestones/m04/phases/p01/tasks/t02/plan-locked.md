Now I have all the context needed. Let me produce the implementation plan.

# Task 2: Pagination Component — Implementation Plan

## 1. Deliverables

| #   | File                                                           | Action | Purpose                                                              |
| --- | -------------------------------------------------------------- | ------ | -------------------------------------------------------------------- |
| 1   | `packages/ui/src/components/pagination/pagination.types.ts`    | Create | Props types for Pagination and all 6 sub-components                  |
| 2   | `packages/ui/src/components/pagination/pagination.styles.ts`   | Create | Static string styles for layout sub-components; CVA variant for link |
| 3   | `packages/ui/src/components/pagination/pagination.tsx`         | Create | Implementation of all 7 components as named exports                  |
| 4   | `packages/ui/src/components/pagination/pagination.test.tsx`    | Create | Vitest + Testing Library + vitest-axe test suite                     |
| 5   | `packages/ui/src/components/pagination/pagination.stories.tsx` | Create | Storybook CSF3 stories with autodocs                                 |
| 6   | `packages/ui/src/index.ts`                                     | Modify | Add exports for all Pagination components and types                  |

## 2. Dependencies

### Existing (no installs needed)

- `@radix-ui/react-slot` — for `asChild` support on PaginationLink
- `class-variance-authority` — CVA for PaginationLink variant composition
- `@components/utils` — `cn()` helper for className merging
- `buttonVariants` from `../button/button.styles.js` — reused for PaginationLink styling

### New Dependencies

None. This task uses only existing dependencies.

### Prior Work

- **Button component** (Milestone 1) — provides `buttonVariants` CVA export. PaginationLink composes `buttonVariants` to style links as buttons.
- **Table component** (Task t01) — already completed, already exported from `index.ts`. Pagination builds on the same patterns.

## 3. Implementation Details

### 3.1 `pagination.types.ts`

**Purpose:** TypeScript prop types for all 7 Pagination sub-components.

**Exports:**

```typescript
export type PaginationProps = React.ComponentProps<'nav'>;

export type PaginationContentProps = React.ComponentProps<'ul'>;

export type PaginationItemProps = React.ComponentProps<'li'>;

export type PaginationLinkProps = React.ComponentProps<'a'> &
  Pick<VariantProps<typeof buttonVariants>, 'size'> & {
    isActive?: boolean;
    asChild?: boolean;
  };

export type PaginationPreviousProps = Omit<PaginationLinkProps, 'children'>;

export type PaginationNextProps = Omit<PaginationLinkProps, 'children'>;

export type PaginationEllipsisProps = React.ComponentProps<'span'>;
```

**Key decisions:**

- `PaginationProps` extends `React.ComponentProps<'nav'>` — no `asChild` on the nav wrapper (follows Breadcrumb pattern where the structural wrapper doesn't need polymorphism).
- `PaginationContentProps` extends `React.ComponentProps<'ul'>` and `PaginationItemProps` extends `React.ComponentProps<'li'>` — structural list elements, no `asChild`.
- `PaginationLinkProps` picks `size` from `buttonVariants` VariantProps, adds `isActive` boolean to toggle between outline/default button variant, and adds `asChild` for router integration.
- `PaginationPreviousProps` and `PaginationNextProps` omit `children` from `PaginationLinkProps` since they render fixed icon + text content.
- `PaginationEllipsisProps` extends `React.ComponentProps<'span'>` — decorative, no `asChild`.
- Import `VariantProps` from `class-variance-authority` and `buttonVariants` from `../button/button.styles.js` for the `Pick` type on `PaginationLinkProps`.

### 3.2 `pagination.styles.ts`

**Purpose:** Static string style constants for structural sub-components and the `buttonVariants` import for PaginationLink.

**Exports:**

```typescript
export const paginationStyles = 'mx-auto flex w-full justify-center';

export const paginationContentStyles = 'flex flex-row items-center gap-1';

export const paginationItemStyles = '';
```

**Key decisions:**

- No CVA variant is defined in this file. PaginationLink uses `buttonVariants` directly (imported from `../button/button.styles.js` in the implementation file). The `isActive` toggle selects between `variant: 'outline'` (default) and `variant: 'default'` (active) at runtime, avoiding a separate CVA definition that would duplicate `buttonVariants` logic.
- `paginationItemStyles` is an empty string — `<li>` elements need no additional styling beyond being list items in a flex container. This matches the spec's "no additional styles beyond `list-none`" — however, since the `<ul>` parent uses `flex`, the default list-style is already suppressed, so `list-none` is not needed.
- Static string exports follow the Table and Card pattern.

### 3.3 `pagination.tsx`

**Purpose:** Implementation of all 7 Pagination components as named exports.

**Exports:** `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`, `PaginationNext`, `PaginationEllipsis`, and all their types re-exported from the types file.

**Component-by-component breakdown:**

**`Pagination`** — Renders `<nav aria-label="pagination" data-slot="pagination">`. Spreads `className` merged with `paginationStyles` via `cn()`. Spreads remaining props and ref. The `aria-label` is a static default that consumers can override via the prop spread.

**`PaginationContent`** — Renders `<ul data-slot="pagination-content">`. Merges `paginationContentStyles` with `className` via `cn()`. Spreads remaining props and ref.

**`PaginationItem`** — Renders `<li data-slot="pagination-item">`. Merges `paginationItemStyles` with `className` via `cn()`. Spreads remaining props and ref.

**`PaginationLink`** — Destructures `{ className, isActive, asChild = false, size = 'icon', ref, ...props }`. Uses `Slot` or `'a'` based on `asChild`. Styles with `buttonVariants({ variant: isActive ? 'default' : 'outline', size })` merged with `className` via `cn()`. Sets `data-slot="pagination-link"` and `aria-current={isActive ? 'page' : undefined}`.

**`PaginationPrevious`** — Destructures `{ className, ref, ...props }`. Renders `<PaginationLink>` with `aria-label="Go to previous page"` and `size="default"`. Children: inline left-chevron SVG (16×16, `currentColor`, `<path d="m15 18-6-6 6-6" />` in a 24×24 viewBox) followed by `<span>Previous</span>`. Merges `className` with `cn('gap-1 pl-2.5', className)`. Sets `data-slot="pagination-previous"`. The `ref` and remaining `...props` are spread onto the inner PaginationLink.

**`PaginationNext`** — Same pattern as PaginationPrevious, mirrored. `aria-label="Go to next page"`, `<span>Next</span>` followed by right-chevron SVG (`<path d="m9 18 6-6-6-6" />`). Merges `className` with `cn('gap-1 pr-2.5', className)`. Sets `data-slot="pagination-next"`.

**`PaginationEllipsis`** — Renders `<span aria-hidden="true" data-slot="pagination-ellipsis">`. Merges `cn('flex h-9 w-9 items-center justify-center', className)`. Contains the horizontal ellipsis character `…` (Unicode, not three dots) and `<span className="sr-only">More pages</span>`.

**Disabled styling:** PaginationPrevious and PaginationNext do not accept a `disabled` prop. When consumers add `aria-disabled="true"`, the styling is handled by adding `aria-disabled:pointer-events-none aria-disabled:opacity-50` to the PaginationLink base styles. This is applied by including these classes in the PaginationPrevious/PaginationNext `className` merge.

### 3.4 `pagination.test.tsx`

**Purpose:** Comprehensive test suite covering smoke render, structure, accessibility, and composition.

**Tests (14 total):**

1. **Smoke render** — Render a fully composed Pagination with all sub-components, verify key text content is present.
2. **Nav with aria-label** — Pagination renders a `<nav>` element with `aria-label="pagination"`.
3. **PaginationContent renders a ul** — Verify the list renders as `<ul>`.
4. **PaginationItem renders an li** — Verify each item renders as `<li>`.
5. **PaginationLink renders as anchor** — Verify default `<a>` element with `href`.
6. **PaginationLink isActive** — When `isActive` is true, verify `aria-current="page"` and active button styling class (`bg-primary`).
7. **PaginationLink asChild** — Render with `asChild` and a custom child, verify the child element receives `data-slot` and styling.
8. **PaginationPrevious aria-label** — Verify `aria-label="Go to previous page"`.
9. **PaginationNext aria-label** — Verify `aria-label="Go to next page"`.
10. **PaginationPrevious/Next render chevrons** — Verify SVG elements are present within each.
11. **PaginationEllipsis** — Verify `aria-hidden="true"`, contains `…`, and has `<span className="sr-only">More pages</span>`.
12. **data-slot attributes** — Verify correct `data-slot` on every sub-component: `pagination`, `pagination-content`, `pagination-item`, `pagination-link`, `pagination-previous`, `pagination-next`, `pagination-ellipsis`.
13. **className merging** — Verify custom className is merged alongside base styles for multiple sub-components.
14. **Accessibility (vitest-axe)** — Render a complete pagination with `PaginationPrevious`, page links (one active), `PaginationEllipsis`, and `PaginationNext`. Run `axe()` and assert `toHaveNoViolations()`.

**Imports:** `render`, `screen` from `@testing-library/react`; `axe` from `vitest-axe`; `describe`, `expect`, `it` from `vitest`. Import all 7 components from `./pagination.js`.

### 3.5 `pagination.stories.tsx`

**Purpose:** Storybook CSF3 stories with autodocs for interactive documentation.

**Meta configuration:**

```typescript
const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
};
export default meta;
```

**Stories (5):**

1. **Default** — 5-page pagination with page 1 active. Structure: `PaginationPrevious` (with `aria-disabled="true"`), PaginationLink pages 1–5 (page 1 `isActive`), PaginationNext.

2. **WithEllipsis** — Large pagination showing pages 1, 2, 3, PaginationEllipsis, 8, 9, 10 with page 2 active. Demonstrates truncated page ranges.

3. **FirstPage** — PaginationPrevious with `aria-disabled="true"` and className `pointer-events-none opacity-50`, showing the disabled state on the first page boundary.

4. **LastPage** — PaginationNext with `aria-disabled="true"` and className `pointer-events-none opacity-50`, showing the disabled state on the last page boundary.

5. **AsChild** — PaginationLink with `asChild` wrapping a `<button>` element, demonstrating client-side navigation without `<a>`.

All stories use render functions to compose the full Pagination structure (Pagination > PaginationContent > PaginationItem wrappers around each link/ellipsis).

## 4. API Contracts

### Pagination (root)

```tsx
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="/page/1" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="/page/1" isActive>
        1
      </PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="/page/2">2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="/page/3" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

**Output HTML structure:**

```html
<nav aria-label="pagination" data-slot="pagination" class="mx-auto flex w-full justify-center">
  <ul data-slot="pagination-content" class="flex flex-row items-center gap-1">
    <li data-slot="pagination-item">
      <a
        data-slot="pagination-previous"
        aria-label="Go to previous page"
        href="/page/1"
        class="...buttonVariants..."
      >
        <svg ...>chevron-left</svg>
        <span>Previous</span>
      </a>
    </li>
    <li data-slot="pagination-item">
      <a
        data-slot="pagination-link"
        aria-current="page"
        href="/page/1"
        class="...active button styles..."
        >1</a
      >
    </li>
    <li data-slot="pagination-item">
      <a data-slot="pagination-link" href="/page/2" class="...outline button styles...">2</a>
    </li>
    <li data-slot="pagination-item">
      <span
        data-slot="pagination-ellipsis"
        aria-hidden="true"
        class="flex h-9 w-9 items-center justify-center"
      >
        …
        <span class="sr-only">More pages</span>
      </span>
    </li>
    <li data-slot="pagination-item">
      <a
        data-slot="pagination-next"
        aria-label="Go to next page"
        href="/page/3"
        class="...buttonVariants..."
      >
        <span>Next</span>
        <svg ...>chevron-right</svg>
      </a>
    </li>
  </ul>
</nav>
```

### PaginationLink with asChild (router integration)

```tsx
<PaginationLink asChild isActive>
  <RouterLink to="/page/1">1</RouterLink>
</PaginationLink>
```

### Disabled boundary (consumer responsibility)

```tsx
<PaginationPrevious href="#" aria-disabled="true" className="pointer-events-none opacity-50" />
```

## 5. Test Plan

### Test Setup

- **Framework:** Vitest + `@testing-library/react` + `vitest-axe`
- **File:** `packages/ui/src/components/pagination/pagination.test.tsx`
- **Imports:** All 7 components from `./pagination.js`; `render`, `screen` from `@testing-library/react`; `axe` from `vitest-axe`; `describe`, `expect`, `it` from `vitest`

### Per-Test Specification

| #   | Test Name                                                       | What It Verifies                          | Key Assertions                                                                           |
| --- | --------------------------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------- |
| 1   | renders a fully composed pagination                             | All sub-components render together        | `getByText('Previous')`, `getByText('1')`, `getByText('Next')` all `toBeInTheDocument()` |
| 2   | Pagination renders a nav with aria-label                        | Root element is `<nav>` with correct ARIA | `getByRole('navigation')` has attribute `aria-label="pagination"`                        |
| 3   | PaginationContent renders a ul                                  | List structure                            | `getByRole('list')` is in the document                                                   |
| 4   | PaginationItem renders an li                                    | List item structure                       | Rendered `<li>` element found via `data-testid`                                          |
| 5   | PaginationLink renders as anchor by default                     | Default `<a>` with href                   | `getByRole('link')` has correct `href`, `tagName === 'A'`                                |
| 6   | PaginationLink isActive applies active styling and aria-current | Active state                              | Element has `aria-current="page"` and `bg-primary` class                                 |
| 7   | PaginationLink supports asChild                                 | Polymorphic rendering                     | Custom child element has `data-slot="pagination-link"`                                   |
| 8   | PaginationPrevious has correct aria-label                       | Accessible name                           | Element has `aria-label="Go to previous page"`                                           |
| 9   | PaginationNext has correct aria-label                           | Accessible name                           | Element has `aria-label="Go to next page"`                                               |
| 10  | PaginationPrevious and PaginationNext render chevron SVGs       | Icon rendering                            | `querySelector('svg')` is not null for both                                              |
| 11  | PaginationEllipsis renders with aria-hidden and sr-only         | Decorative + screen reader                | `aria-hidden="true"`, text contains `…`, `sr-only` span says "More pages"                |
| 12  | data-slot attributes on all sub-components                      | Targeting support                         | Each data-testid element has correct `data-slot` value                                   |
| 13  | each sub-component merges custom className                      | Style composition                         | Custom class present alongside base classes                                              |
| 14  | fully composed pagination has no accessibility violations       | axe-core pass                             | `expect(await axe(container)).toHaveNoViolations()`                                      |

## 6. Implementation Order

1. **`pagination.types.ts`** — Define all 7 prop types. This file has no internal dependencies beyond importing `VariantProps` from CVA and `buttonVariants` from the button styles.

2. **`pagination.styles.ts`** — Define the 3 static string style constants. No dependencies on types.

3. **`pagination.tsx`** — Implement all 7 components. Imports from types file, styles file, `buttonVariants` from `../button/button.styles.js`, `Slot` from `@radix-ui/react-slot`, and `cn()` from `../../lib/utils.js`. Re-exports all types.

4. **`pagination.test.tsx`** — Write the 14-test suite importing from `./pagination.js`.

5. **`pagination.stories.tsx`** — Write 5 CSF3 stories importing from `./pagination.js`.

6. **`packages/ui/src/index.ts`** — Add export block for all Pagination components and types.

## 7. Verification Commands

```bash
# Run pagination tests only
pnpm --filter @components/ui test -- --grep "Pagination"

# Run all tests across the ui package
pnpm --filter @components/ui test

# TypeScript type checking
pnpm --filter @components/ui typecheck

# Run full monorepo test + typecheck via Turbo
pnpm test && pnpm typecheck

# Lint the new files
pnpm --filter @components/ui lint
```

## 8. Design Deviations

**Deviation 1: No `paginationLinkVariants` CVA function in styles file.**

- **Parent spec requires:** The phase spec states "CVA variant for PaginationLink that composes with `buttonVariants`" and "has its own `paginationLinkVariants` CVA in its styles file that composes `buttonVariants` with an `isActive` boolean variant and size variant."
- **Why problematic:** Creating a separate `paginationLinkVariants` CVA that wraps `buttonVariants` is awkward because CVA does not natively compose — you cannot call one CVA inside another's variant definitions. You would need to call `buttonVariants()` inside `paginationLinkVariants` variant strings, but CVA variants must be static Tailwind class strings, not function calls. The common shadcn/ui approach is to call `buttonVariants()` directly in the component with the appropriate `variant` and `size` parameters, toggling `variant` based on `isActive` at render time.
- **Alternative chosen:** PaginationLink calls `buttonVariants({ variant: isActive ? 'default' : 'outline', size })` directly in the component file. The styles file exports only static string constants for structural sub-components (Pagination, PaginationContent, PaginationItem). This is simpler, avoids CVA composition issues, and matches how shadcn/ui's actual pagination source works.

**Deviation 2: PaginationPrevious/PaginousNext render PaginationLink internally rather than extending it.**

- **Parent spec requires:** "PaginationPreviousProps and PaginationNextProps extend PaginationLinkProps (omitting children and providing their own)."
- **Why this is fine but nuanced:** The props types correctly extend/omit from PaginationLinkProps as specified. However, in the implementation, PaginationPrevious and PaginationNext render a `<PaginationLink>` component internally (composition) rather than being a thin wrapper that IS a PaginationLink. This means the `data-slot` on the rendered `<a>` element will be `pagination-previous` or `pagination-next` (not `pagination-link`), because the outer component's data-slot overrides it. This is intentional — each sub-component should have its own distinct `data-slot` for targeting. The props flow through correctly since `...props` is spread onto the inner PaginationLink which spreads onto the `<a>`.
- **Alternative chosen:** PaginationPrevious and PaginationNext compose PaginationLink internally but set their own `data-slot` value. The underlying `<a>` or `<Slot>` element will carry the Previous/Next data-slot rather than the generic link data-slot.
