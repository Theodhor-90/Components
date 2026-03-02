# Task 2: Breadcrumb component

## Objective

Implement the Breadcrumb component as a shadcn/ui port using semantic HTML (`<nav>`, `<ol>`, `<li>`). This component provides wayfinding breadcrumb trails with 7 sub-components, `asChild` support for router integration, and full accessibility.

## Deliverables

### Files to Create

| File                                                           | Purpose                                                           |
| -------------------------------------------------------------- | ----------------------------------------------------------------- |
| `packages/ui/src/components/breadcrumb/breadcrumb.tsx`         | Implementation of all 7 sub-components                            |
| `packages/ui/src/components/breadcrumb/breadcrumb.styles.ts`   | CVA/static styles for list, item, link, page, separator, ellipsis |
| `packages/ui/src/components/breadcrumb/breadcrumb.types.ts`    | Props types for all sub-components                                |
| `packages/ui/src/components/breadcrumb/breadcrumb.test.tsx`    | Tests with vitest-axe accessibility assertions                    |
| `packages/ui/src/components/breadcrumb/breadcrumb.stories.tsx` | Storybook CSF3 stories with `tags: ['autodocs']`                  |

### Files to Modify

| File                       | Change                                            |
| -------------------------- | ------------------------------------------------- |
| `packages/ui/src/index.ts` | Add exports for Breadcrumb (7 components + types) |

## Sub-components

1. **Breadcrumb** — `<nav aria-label="breadcrumb">` root element with `data-slot="breadcrumb"`
2. **BreadcrumbList** — `<ol>` with flex layout, gap, and `text-muted-foreground` styling
3. **BreadcrumbItem** — `<li>` with inline-flex alignment
4. **BreadcrumbLink** — `<a>` element supporting `asChild` via `@radix-ui/react-slot` for router integration, with hover transition to `text-foreground`
5. **BreadcrumbPage** — `<span role="link" aria-disabled="true" aria-current="page">` for the current page (non-interactive)
6. **BreadcrumbSeparator** — `<li role="presentation" aria-hidden="true">` rendering a chevron-right SVG by default, accepting `children` for custom separators
7. **BreadcrumbEllipsis** — `<span>` with three-dot SVG icon and `sr-only` "More" label

## Implementation Constraints

- No Radix primitive — built on semantic HTML following WAI-ARIA breadcrumb guidance
- `asChild` on BreadcrumbLink uses `@radix-ui/react-slot` (already installed)
- BreadcrumbEllipsis is a static `<span>`, not interactive (DropdownMenu composition is deferred to M05)
- BreadcrumbSeparator renders chevron-right SVG by default but accepts `children` to override
- Follow the 5-file pattern established by Button component
- Use `data-slot` on each sub-component root element
- Props extend appropriate `React.ComponentProps<'element'>` types
- Named exports only, no default exports
- `BreadcrumbLinkProps` includes `asChild?: boolean`

## Tests Required

- Smoke render with all sub-components
- `aria-current="page"` present on BreadcrumbPage
- Separator renders between items
- `asChild` renders custom link element
- `data-slot` attributes present on all sub-components
- className merging works correctly
- vitest-axe accessibility pass

## Stories Required

- Default (3-level breadcrumb)
- WithCustomSeparator (slash character)
- WithEllipsis (collapsed middle items)
- WithRouterLink (asChild demo)
- ResponsiveCollapsed

## Dependencies

- None within this phase. Does not depend on t01 (react-resizable-panels).
- `@radix-ui/react-slot` is already installed.

## Verification

1. All 5 files exist in `packages/ui/src/components/breadcrumb/`
2. Breadcrumb renders semantic `<nav>` > `<ol>` > `<li>` markup
3. `aria-label="breadcrumb"` on the root nav element
4. `aria-current="page"` on BreadcrumbPage
5. BreadcrumbLink `asChild` correctly renders a consumer-provided element
6. All stories render in Storybook with autodocs
7. `pnpm test` passes for breadcrumb tests including vitest-axe
8. Exports present in `packages/ui/src/index.ts`
