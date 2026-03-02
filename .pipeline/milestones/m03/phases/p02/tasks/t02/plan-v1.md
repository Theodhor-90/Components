No problem — I have sufficient context from the task spec, phase spec, and shadcn/ui patterns established in the codebase. Let me now produce the complete specification.

# Task 2: Breadcrumb Component — Implementation Plan

## 1. Deliverables

### Files to Create

| File                                                           | Purpose                                       |
| -------------------------------------------------------------- | --------------------------------------------- |
| `packages/ui/src/components/breadcrumb/breadcrumb.types.ts`    | Props types for all 7 sub-components          |
| `packages/ui/src/components/breadcrumb/breadcrumb.styles.ts`   | Static style constants for all sub-components |
| `packages/ui/src/components/breadcrumb/breadcrumb.tsx`         | Implementation of all 7 sub-components        |
| `packages/ui/src/components/breadcrumb/breadcrumb.test.tsx`    | Vitest + Testing Library + vitest-axe tests   |
| `packages/ui/src/components/breadcrumb/breadcrumb.stories.tsx` | Storybook CSF3 stories with autodocs          |

### Files to Modify

| File                       | Change                                               |
| -------------------------- | ---------------------------------------------------- |
| `packages/ui/src/index.ts` | Add exports for all 7 sub-components and their types |

## 2. Dependencies

- **No new packages required.** Breadcrumb is built on semantic HTML (`<nav>`, `<ol>`, `<li>`, `<a>`, `<span>`).
- **`@radix-ui/react-slot`** — already installed at `^1.2.4`; used by `BreadcrumbLink` for `asChild` support.
- **`@components/utils`** — already a workspace dependency; provides the `cn()` helper.
- Does not depend on sibling task t01 (`react-resizable-panels` installation).

## 3. Implementation Details

### 3.1 `breadcrumb.types.ts`

**Purpose:** Define props interfaces for all 7 sub-components.

**Exports:**

- `BreadcrumbProps` — extends `React.ComponentProps<'nav'>`
- `BreadcrumbListProps` — extends `React.ComponentProps<'ol'>`
- `BreadcrumbItemProps` — extends `React.ComponentProps<'li'>`
- `BreadcrumbLinkProps` — extends `React.ComponentProps<'a'>` with `{ asChild?: boolean }`
- `BreadcrumbPageProps` — extends `React.ComponentProps<'span'>`
- `BreadcrumbSeparatorProps` — extends `React.ComponentProps<'li'>`
- `BreadcrumbEllipsisProps` — extends `React.ComponentProps<'span'>`

**Key details:**

- No CVA `VariantProps` needed — Breadcrumb has no visual variants. All types are plain HTML element props extensions.
- `BreadcrumbLinkProps` adds `asChild?: boolean` for router integration via `@radix-ui/react-slot`.
- Follow the Card/Alert pattern: compound components with simple HTML element types.

```typescript
export type BreadcrumbProps = React.ComponentProps<'nav'>;

export type BreadcrumbListProps = React.ComponentProps<'ol'>;

export type BreadcrumbItemProps = React.ComponentProps<'li'>;

export type BreadcrumbLinkProps = React.ComponentProps<'a'> & {
  asChild?: boolean;
};

export type BreadcrumbPageProps = React.ComponentProps<'span'>;

export type BreadcrumbSeparatorProps = React.ComponentProps<'li'>;

export type BreadcrumbEllipsisProps = React.ComponentProps<'span'>;
```

### 3.2 `breadcrumb.styles.ts`

**Purpose:** Static style string constants for each sub-component. No CVA needed since Breadcrumb has no visual variants.

**Exports:**

- `breadcrumbListStyles` — flex layout with gap, wrapping, small text, muted foreground color
- `breadcrumbItemStyles` — inline-flex with center alignment, gap for content
- `breadcrumbLinkStyles` — transition to foreground color on hover
- `breadcrumbPageStyles` — normal font weight, foreground color (current page)
- `breadcrumbSeparatorStyles` — presentational list item for separator rendering
- `breadcrumbEllipsisStyles` — flex sizing for the ellipsis icon wrapper

```typescript
export const breadcrumbListStyles =
  'flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5';

export const breadcrumbItemStyles = 'inline-flex items-center gap-1.5';

export const breadcrumbLinkStyles = 'transition-colors hover:text-foreground';

export const breadcrumbPageStyles = 'font-normal text-foreground';

export const breadcrumbSeparatorStyles = '[&>svg]:h-3.5 [&>svg]:w-3.5';

export const breadcrumbEllipsisStyles = 'flex h-9 w-9 items-center justify-center';
```

### 3.3 `breadcrumb.tsx`

**Purpose:** Implementation of all 7 sub-components as named exports.

**Sub-components:**

1. **`Breadcrumb`** — Renders `<nav aria-label="breadcrumb">` with `data-slot="breadcrumb"`. Passes through `className` and all other props.

2. **`BreadcrumbList`** — Renders `<ol>` with flex layout styles from `breadcrumbListStyles`. `data-slot="breadcrumb-list"`.

3. **`BreadcrumbItem`** — Renders `<li>` with inline-flex alignment. `data-slot="breadcrumb-item"`.

4. **`BreadcrumbLink`** — Renders `<a>` by default, or uses `Slot` from `@radix-ui/react-slot` when `asChild={true}` (same pattern as Button). Applies `breadcrumbLinkStyles`. `data-slot="breadcrumb-link"`.

5. **`BreadcrumbPage`** — Renders `<span role="link" aria-disabled="true" aria-current="page">`. Non-interactive representation of the current page. `data-slot="breadcrumb-page"`.

6. **`BreadcrumbSeparator`** — Renders `<li role="presentation" aria-hidden="true">`. If no `children` provided, renders a default chevron-right SVG icon. `data-slot="breadcrumb-separator"`.

7. **`BreadcrumbEllipsis`** — Renders `<span role="presentation" aria-hidden="true">` with a three-dot ellipsis SVG icon and a screen-reader-only "More" `<span>`. `data-slot="breadcrumb-ellipsis"`.

**Implementation pattern** (follows Card compound component pattern):

```typescript
import { Slot } from '@radix-ui/react-slot';

import { cn } from '../../lib/utils.js';
import {
  breadcrumbEllipsisStyles,
  breadcrumbItemStyles,
  breadcrumbLinkStyles,
  breadcrumbListStyles,
  breadcrumbPageStyles,
  breadcrumbSeparatorStyles,
} from './breadcrumb.styles.js';
import type {
  BreadcrumbEllipsisProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbListProps,
  BreadcrumbPageProps,
  BreadcrumbProps,
  BreadcrumbSeparatorProps,
} from './breadcrumb.types.js';

export type {
  BreadcrumbEllipsisProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbListProps,
  BreadcrumbPageProps,
  BreadcrumbProps,
  BreadcrumbSeparatorProps,
} from './breadcrumb.types.js';

export function Breadcrumb({ ref, ...props }: BreadcrumbProps): React.JSX.Element {
  return <nav data-slot="breadcrumb" aria-label="breadcrumb" ref={ref} {...props} />;
}

export function BreadcrumbList({ className, ref, ...props }: BreadcrumbListProps): React.JSX.Element {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(breadcrumbListStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function BreadcrumbItem({ className, ref, ...props }: BreadcrumbItemProps): React.JSX.Element {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn(breadcrumbItemStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function BreadcrumbLink({
  className,
  asChild = false,
  ref,
  ...props
}: BreadcrumbLinkProps): React.JSX.Element {
  const Comp = asChild ? Slot : 'a';
  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn(breadcrumbLinkStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function BreadcrumbPage({ className, ref, ...props }: BreadcrumbPageProps): React.JSX.Element {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(breadcrumbPageStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function BreadcrumbSeparator({
  className,
  children,
  ref,
  ...props
}: BreadcrumbSeparatorProps): React.JSX.Element {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn(breadcrumbSeparatorStyles, className)}
      ref={ref}
      {...props}
    >
      {children ?? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      )}
    </li>
  );
}

export function BreadcrumbEllipsis({
  className,
  ref,
  ...props
}: BreadcrumbEllipsisProps): React.JSX.Element {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn(breadcrumbEllipsisStyles, className)}
      ref={ref}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>
      <span className="sr-only">More</span>
    </span>
  );
}
```

### 3.4 `breadcrumb.test.tsx`

**Purpose:** Comprehensive tests covering smoke rendering, ARIA attributes, composition, className merging, asChild, and accessibility.

**Test categories:**

1. **Smoke render** — Renders a fully composed breadcrumb with all sub-components, verifies all are in the document.
2. **Semantic structure** — Verifies `<nav>` root with `aria-label="breadcrumb"` containing `<ol>` with `<li>` children.
3. **BreadcrumbPage ARIA** — `aria-current="page"` and `aria-disabled="true"` present on the current page span.
4. **BreadcrumbSeparator default** — Renders chevron-right SVG when no children provided.
5. **BreadcrumbSeparator custom** — Renders custom children (`/` character) when provided.
6. **BreadcrumbLink asChild** — When `asChild={true}`, renders the child element (e.g., `<span>`) instead of `<a>`, merging props.
7. **BreadcrumbEllipsis** — Renders the three-dot SVG icon and a screen-reader-only "More" span.
8. **data-slot attributes** — Each sub-component has the correct `data-slot` value: `"breadcrumb"`, `"breadcrumb-list"`, `"breadcrumb-item"`, `"breadcrumb-link"`, `"breadcrumb-page"`, `"breadcrumb-separator"`, `"breadcrumb-ellipsis"`.
9. **className merging** — Each sub-component accepts and merges a custom `className`.
10. **Accessibility** — `vitest-axe` passes on a fully composed breadcrumb.

**Imports and pattern:**

```typescript
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb.js';
```

### 3.5 `breadcrumb.stories.tsx`

**Purpose:** Storybook CSF3 stories demonstrating all usage patterns.

**Meta configuration:**

```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumb } from './breadcrumb.js';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Breadcrumb>;
```

**Stories:**

1. **Default** — 3-level breadcrumb: Home (link) → Products (link) → Shoes (current page). Separators between each item.
2. **WithCustomSeparator** — Same structure but using `/` character instead of chevron SVG as separator.
3. **WithEllipsis** — Home → BreadcrumbEllipsis → Category → Current page. Demonstrates truncated middle items.
4. **WithRouterLink** — Uses `asChild` on `BreadcrumbLink` with a `<span>` element to demonstrate router integration without an actual router dependency.
5. **ResponsiveCollapsed** — Demonstrates a breadcrumb that could collapse on smaller screens, using `BreadcrumbEllipsis` in the middle.

### 3.6 `packages/ui/src/index.ts` modification

Append the following export block after the existing `ScrollArea` exports (line 228):

```typescript
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  type BreadcrumbProps,
  type BreadcrumbListProps,
  type BreadcrumbItemProps,
  type BreadcrumbLinkProps,
  type BreadcrumbPageProps,
  type BreadcrumbSeparatorProps,
  type BreadcrumbEllipsisProps,
} from './components/breadcrumb/breadcrumb.js';
```

No CVA variants export is needed since Breadcrumb uses only static styles.

## 4. API Contracts

### Component API

```tsx
<Breadcrumb>
  {' '}
  {/* <nav aria-label="breadcrumb"> */}
  <BreadcrumbList>
    {' '}
    {/* <ol> with flex layout */}
    <BreadcrumbItem>
      {' '}
      {/* <li> */}
      <BreadcrumbLink href="/">Home</BreadcrumbLink> {/* <a> */}
    </BreadcrumbItem>
    <BreadcrumbSeparator /> {/* <li> with chevron SVG */}
    <BreadcrumbItem>
      <BreadcrumbLink href="/products">Products</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current Page</BreadcrumbPage> {/* <span aria-current="page"> */}
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### `asChild` usage (router integration)

```tsx
<BreadcrumbLink asChild>
  <RouterLink to="/products">Products</RouterLink>
</BreadcrumbLink>
```

### Custom separator

```tsx
<BreadcrumbSeparator>/</BreadcrumbSeparator>
```

### Ellipsis for truncated trails

```tsx
<BreadcrumbItem>
  <BreadcrumbEllipsis />
</BreadcrumbItem>
```

### Props Summary

| Component             | Base Element   | Key Props                                                          | ARIA                                                         |
| --------------------- | -------------- | ------------------------------------------------------------------ | ------------------------------------------------------------ |
| `Breadcrumb`          | `<nav>`        | `React.ComponentProps<'nav'>`                                      | `aria-label="breadcrumb"` (hardcoded)                        |
| `BreadcrumbList`      | `<ol>`         | `React.ComponentProps<'ol'>`                                       | —                                                            |
| `BreadcrumbItem`      | `<li>`         | `React.ComponentProps<'li'>`                                       | —                                                            |
| `BreadcrumbLink`      | `<a>` / `Slot` | `asChild?: boolean`, `React.ComponentProps<'a'>`                   | —                                                            |
| `BreadcrumbPage`      | `<span>`       | `React.ComponentProps<'span'>`                                     | `role="link"`, `aria-disabled="true"`, `aria-current="page"` |
| `BreadcrumbSeparator` | `<li>`         | `React.ComponentProps<'li'>`, `children` overrides default chevron | `role="presentation"`, `aria-hidden="true"`                  |
| `BreadcrumbEllipsis`  | `<span>`       | `React.ComponentProps<'span'>`                                     | `role="presentation"`, `aria-hidden="true"`, sr-only "More"  |

## 5. Test Plan

### Test Setup

- Framework: Vitest with jsdom environment
- Rendering: `@testing-library/react`
- Accessibility: `vitest-axe` with `toHaveNoViolations` matcher
- Config: Uses existing `packages/ui/vitest.config.ts` and `src/test-setup.ts`
- No additional test utilities or mocks required

### Per-Test Specification

| #   | Test Name                                                  | Setup                                                                                      | Assertion                                                                                       |
| --- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| 1   | renders a fully composed breadcrumb                        | Render Breadcrumb > BreadcrumbList > 3× BreadcrumbItem (2 links + 1 page) with separators  | All text content present in the document                                                        |
| 2   | Breadcrumb renders a nav element with aria-label           | Render `<Breadcrumb>`                                                                      | `screen.getByRole('navigation')` has `aria-label="breadcrumb"`                                  |
| 3   | BreadcrumbList renders an ol element                       | Render `<Breadcrumb><BreadcrumbList>...</BreadcrumbList></Breadcrumb>`                     | `screen.getByRole('list')` is in the document                                                   |
| 4   | BreadcrumbLink renders as an anchor by default             | Render `<BreadcrumbLink href="/test">Link</BreadcrumbLink>`                                | `screen.getByRole('link', { name: 'Link' })` has `href="/test"`                                 |
| 5   | BreadcrumbLink renders as child element when asChild       | Render `<BreadcrumbLink asChild><span data-testid="custom">Custom</span></BreadcrumbLink>` | `screen.getByTestId('custom')` has `data-slot="breadcrumb-link"` and is a `<span>` not an `<a>` |
| 6   | BreadcrumbPage has aria-current="page"                     | Render `<BreadcrumbPage>Current</BreadcrumbPage>`                                          | Element has `aria-current="page"` and `aria-disabled="true"`                                    |
| 7   | BreadcrumbSeparator renders chevron by default             | Render `<BreadcrumbSeparator />`                                                           | `<li>` contains an `<svg>` element, has `aria-hidden="true"`                                    |
| 8   | BreadcrumbSeparator renders custom children                | Render `<BreadcrumbSeparator>/</BreadcrumbSeparator>`                                      | `<li>` contains text "/" and no `<svg>`                                                         |
| 9   | BreadcrumbEllipsis renders three-dot icon and sr-only text | Render `<BreadcrumbEllipsis />`                                                            | Contains `<svg>` and a span with text "More"                                                    |
| 10  | data-slot attributes are correct on all sub-components     | Render full breadcrumb with data-testid on each sub-component                              | Each has correct `data-slot` value                                                              |
| 11  | each sub-component merges custom className                 | Render each with `className="custom-class"`                                                | Each element `toHaveClass('custom-class')` alongside base styles                                |
| 12  | fully composed breadcrumb has no accessibility violations  | Render complete breadcrumb with links and current page                                     | `expect(await axe(container)).toHaveNoViolations()`                                             |

## 6. Implementation Order

1. **`breadcrumb.types.ts`** — Define all 7 prop types. No dependencies on other files.
2. **`breadcrumb.styles.ts`** — Define all static style constants. No dependencies on other files.
3. **`breadcrumb.tsx`** — Implement all 7 sub-components. Imports from types and styles files, plus `cn()` and `Slot`.
4. **`breadcrumb.test.tsx`** — Write all tests. Imports from `breadcrumb.js`.
5. **`breadcrumb.stories.tsx`** — Write all Storybook stories. Imports from `breadcrumb.js`.
6. **`packages/ui/src/index.ts`** — Add the export block for all 7 components and their types.

## 7. Verification Commands

```bash
# Run breadcrumb tests only
pnpm --filter @components/ui test -- breadcrumb

# Run full test suite
pnpm --filter @components/ui test

# Type check
pnpm --filter @components/ui typecheck

# Lint
pnpm --filter @components/ui lint

# Build (ensures exports are valid)
pnpm --filter @components/ui build

# Launch Storybook to visually verify stories
pnpm storybook
```

## 8. Design Deviations

None.

The task spec and phase spec prescribe Breadcrumb as a semantic HTML component (`<nav>`, `<ol>`, `<li>`) with `asChild` via `@radix-ui/react-slot`, which is technically sound and matches the WAI-ARIA breadcrumb pattern. All sub-components, ARIA attributes, and behaviors described in the spec are implementable as specified without any technical issues.
