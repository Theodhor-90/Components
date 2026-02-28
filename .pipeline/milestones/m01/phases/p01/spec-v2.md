Now I have all the context. Let me produce the revised specification addressing every feedback point.

# Phase 1: Display Primitives — Specification

## Goal

Implement the six non-interactive visual components — Separator, Badge, Card, Skeleton, Spinner, and Alert — that form the static building blocks of every page layout across the Portfolio applications. Each component follows the canonical 5-file pattern established by the Button reference, uses Tailwind v4 utility classes with OKLCH semantic tokens, and ships with full Vitest + vitest-axe test coverage and Storybook CSF3 autodocs. Upon completion, consumers can import these components from `@components/ui` to build page scaffolding, status indicators, content containers, loading placeholders, and feedback messages.

## Design Decisions

### DD-1: Task ordering — Separator first, Alert last

Separator is the simplest component (single element, one Radix dependency, no compound structure) and serves as a gentle introduction to the Radix wrapping pattern. Badge and Skeleton follow as single-element components without Radix. Card introduces the compound component pattern (six sub-components with distinct `data-slot` values). Spinner is custom (no shadcn reference) and benefits from the conventions established by the earlier ports. Alert comes last because it is a compound component with variants, combining patterns from Badge (CVA variants) and Card (sub-components).

### DD-2: Separator uses `@radix-ui/react-separator`

Although a `<hr>` element could suffice, the shadcn/ui reference wraps `@radix-ui/react-separator` for correct `role="separator"` semantics and `aria-orientation` on vertical separators. We follow the shadcn reference to maintain API parity.

### DD-3: Spinner is a custom animated SVG

No shadcn/ui Spinner exists. We implement an animated SVG circle with `stroke-dasharray` animation rather than a CSS-only approach, giving us precise control over size variants and consistent rendering across browsers. The API mirrors the library's conventions: CVA size variants (`sm`/`md`/`lg`), `data-slot="spinner"`, `role="status"`, and `aria-label` defaulting to `"Loading"`.

### DD-4: Card sub-components share a single styles file

All six Card sub-components (`Card`, `CardHeader`, `CardContent`, `CardFooter`, `CardTitle`, `CardDescription`) are defined in a single `card.tsx` file and share a single `card.styles.ts` file. Each sub-component has its own CVA definition (or plain class string) within that styles file. The types file exports individual prop types for each sub-component. This matches the shadcn/ui pattern where compound components are co-located.

### DD-5: Alert uses semantic color tokens, not hardcoded colors

The `default` variant uses `bg-background text-foreground` and the `destructive` variant uses `border-destructive/50 text-destructive` with dark mode adjustments. All colors reference semantic CSS custom properties from `globals.css`, ensuring theme consistency.

### DD-6: `asChild` only on single-element leaf components

Following the shadcn/ui convention, `asChild` (via Radix `Slot`) is supported on single-element components that render a single semantic element: Separator and Badge. It is not supported on Skeleton (which is a variant-free placeholder — see DD-7), Spinner (which renders an SVG with internal structure), compound component wrappers (Card, Alert), or Card/Alert sub-components. This matches the shadcn/ui Card reference, which does not use `asChild` on any Card sub-component.

### DD-7: Skeleton has no CVA variants and no asChild

Skeleton is intentionally variant-free and does not support `asChild`. Consumers control its dimensions entirely through `className` (e.g., `className="h-4 w-[200px]"`). The component only applies base styling: `animate-pulse`, `rounded-md`, and `bg-muted`. This matches the shadcn/ui Skeleton API.

### DD-8: Spinner accessible label uses `<span className="sr-only">`

The Spinner's accessible label is implemented using `<span className="sr-only">Loading</span>` (Tailwind's built-in screen-reader-only utility class). This avoids depending on the `VisuallyHidden` component from Phase 3, which has not been built yet. The `sr-only` class is available in Tailwind v4 out of the box and provides equivalent functionality.

## Tasks

### Task 1: Separator

**Deliverables:**

- Install `@radix-ui/react-separator` as a dependency in `packages/ui/package.json`
- Create `packages/ui/src/components/separator/` directory with 5 files:
  - `separator.tsx` — Wraps `@radix-ui/react-separator` Root. Props: `orientation` (`"horizontal" | "vertical"`, default `"horizontal"`), `decorative` (boolean, default `true`), `className`, `ref`. Applies `data-slot="separator"`. Renders as `<div>` with `shrink-0 bg-border` base classes, `h-px w-full` for horizontal, `h-full w-px` for vertical.
  - `separator.styles.ts` — CVA definition with `orientation` variant (`horizontal` / `vertical`). No `defaultVariants` needed since orientation comes from the Radix primitive's default.
  - `separator.types.ts` — `SeparatorProps` extending `React.ComponentProps<typeof SeparatorPrimitive.Root>` intersected with `VariantProps<typeof separatorVariants>`.
  - `separator.test.tsx` — Tests: smoke render (horizontal), vertical orientation, custom className merging, `data-slot` attribute, `role="separator"` for non-decorative, `aria-orientation` for vertical, accessibility (axe).
  - `separator.stories.tsx` — Stories: `Horizontal` (default), `Vertical` (in a flex row), `InCard` (demonstrating real usage between content sections).
- Export `Separator`, `type SeparatorProps`, and `separatorVariants` from `packages/ui/src/index.ts`

### Task 2: Badge

**Deliverables:**

- Create `packages/ui/src/components/badge/` directory with 5 files:
  - `badge.tsx` — Renders a `<div>` (or `Slot` when `asChild`). Props: `variant` (`"default" | "secondary" | "destructive" | "outline"`), `className`, `asChild`, `ref`. Applies `data-slot="badge"`.
  - `badge.styles.ts` — CVA definition with `variant` variants. Base classes: `inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2`. Variant classes: `default` → `border-transparent bg-primary text-primary-foreground`, `secondary` → `border-transparent bg-secondary text-secondary-foreground`, `destructive` → `border-transparent bg-destructive text-destructive-foreground`, `outline` → `text-foreground`. Default variant: `"default"`.
  - `badge.types.ts` — `BadgeProps` extending `React.ComponentProps<'div'>` intersected with `VariantProps<typeof badgeVariants>` plus `asChild?: boolean`.
  - `badge.test.tsx` — Tests: smoke render, all four variants apply correct classes, `asChild` rendering, custom className, `data-slot`, accessibility (axe).
  - `badge.stories.tsx` — Stories: `Default`, `Secondary`, `Destructive`, `Outline`, `AsChild`.
- Export `Badge`, `type BadgeProps`, and `badgeVariants` from `packages/ui/src/index.ts`

### Task 3: Card

**Deliverables:**

- Create `packages/ui/src/components/card/` directory with 5 files:
  - `card.tsx` — Six named exports: `Card` (`<div>`, `data-slot="card"`), `CardHeader` (`<div>`, `data-slot="card-header"`), `CardTitle` (`<div>`, `data-slot="card-title"`), `CardDescription` (`<div>`, `data-slot="card-description"`), `CardContent` (`<div>`, `data-slot="card-content"`), `CardFooter` (`<div>`, `data-slot="card-footer"`). Card root applies `rounded-xl border bg-card text-card-foreground shadow-sm`. No sub-component supports `asChild`.
  - `card.styles.ts` — Separate class strings or minimal CVA definitions for each sub-component. No variant props (Card has no variants in shadcn/ui).
  - `card.types.ts` — `CardProps`, `CardHeaderProps`, `CardTitleProps`, `CardDescriptionProps`, `CardContentProps`, `CardFooterProps` — each extending `React.ComponentProps<'div'>`.
  - `card.test.tsx` — Tests: smoke render of each sub-component, compound composition, custom className on each, `data-slot` on each, accessibility (axe) on a fully composed card.
  - `card.stories.tsx` — Stories: `Default` (fully composed card), `WithFooter`, `WithForm` (card containing form elements), individual sub-component stories as needed.
- Export all six components and all six prop types from `packages/ui/src/index.ts`

### Task 4: Skeleton

**Deliverables:**

- Create `packages/ui/src/components/skeleton/` directory with 5 files:
  - `skeleton.tsx` — Renders a `<div>` with `animate-pulse rounded-md bg-muted` base classes. Props: `className`, `ref`, and all `div` props. Applies `data-slot="skeleton"`. No variants, no `asChild`.
  - `skeleton.styles.ts` — Exports base class string constant (no CVA needed since there are no variants). If CVA is used for consistency, a single variant-less definition.
  - `skeleton.types.ts` — `SkeletonProps` extending `React.ComponentProps<'div'>`.
  - `skeleton.test.tsx` — Tests: smoke render, `animate-pulse` class present, custom className + custom dimensions, `data-slot`, accessibility (axe).
  - `skeleton.stories.tsx` — Stories: `Default`, `TextLine` (`h-4 w-[250px]`), `Circle` (`h-12 w-12 rounded-full`), `CardSkeleton` (composed layout showing realistic loading state).
- Export `Skeleton` and `type SkeletonProps` from `packages/ui/src/index.ts`

### Task 5: Spinner

**Deliverables:**

- Create `packages/ui/src/components/spinner/` directory with 5 files:
  - `spinner.tsx` — Renders an animated SVG with a circular path. Props: `size` (`"sm" | "md" | "lg"`), `className`, `ref`. Applies `data-slot="spinner"`, `role="status"`. Includes a `<span className="sr-only">` element with default text `"Loading"` (overridable via `aria-label` on the wrapping element — when `aria-label` is provided, the `sr-only` span is omitted). SVG uses `currentColor` for stroke so it inherits text color from parent.
  - `spinner.styles.ts` — CVA definition with `size` variant: `sm` → `h-4 w-4`, `md` → `h-6 w-6`, `lg` → `h-8 w-8`. Default: `"md"`. Base classes: `animate-spin text-muted-foreground`.
  - `spinner.types.ts` — `SpinnerProps` extending `React.ComponentProps<'svg'>` intersected with `VariantProps<typeof spinnerVariants>`.
  - `spinner.test.tsx` — Tests: smoke render, `role="status"` present, default accessible name ("Loading"), all three sizes apply correct dimension classes, custom className, `data-slot`, custom `aria-label`, accessibility (axe).
  - `spinner.stories.tsx` — Stories: `Default` (md), `Small`, `Large`, `CustomColor` (with `className="text-primary"`), `InButton` (Spinner inside a disabled Button).
- Export `Spinner`, `type SpinnerProps`, and `spinnerVariants` from `packages/ui/src/index.ts`

### Task 6: Alert

**Deliverables:**

- Create `packages/ui/src/components/alert/` directory with 5 files:
  - `alert.tsx` — Three named exports: `Alert` (`<div role="alert">`, `data-slot="alert"`), `AlertTitle` (`<h5>`, `data-slot="alert-title"`), `AlertDescription` (`<div>`, `data-slot="alert-description"`). Alert root supports `variant` prop (`"default" | "destructive"`). No sub-component supports `asChild`.
  - `alert.styles.ts` — CVA definition for Alert with `variant`: `default` → `bg-background text-foreground`, `destructive` → `border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive`. Base classes: `relative w-full rounded-lg border p-4 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&:has(svg)]:pl-11`. Default variant: `"default"`.
  - `alert.types.ts` — `AlertProps` extending `React.ComponentProps<'div'>` + `VariantProps<typeof alertVariants>`. `AlertTitleProps` extending `React.ComponentProps<'h5'>`. `AlertDescriptionProps` extending `React.ComponentProps<'div'>`.
  - `alert.test.tsx` — Tests: smoke render, `role="alert"` present, default variant classes, destructive variant classes, compound composition (Alert + AlertTitle + AlertDescription), with icon (SVG child shifts content), custom className on each, `data-slot` on each, accessibility (axe).
  - `alert.stories.tsx` — Stories: `Default`, `Destructive`, `WithIcon` (using an inline SVG icon), `WithTitle`, `WithTitleAndDescription`.
- Export `Alert`, `AlertTitle`, `AlertDescription`, their prop types, and `alertVariants` from `packages/ui/src/index.ts`

## Exit Criteria

1. All six component directories exist under `packages/ui/src/components/` (`separator/`, `badge/`, `card/`, `skeleton/`, `spinner/`, `alert/`) each containing exactly 5 files following the `{name}.tsx`, `{name}.styles.ts`, `{name}.types.ts`, `{name}.test.tsx`, `{name}.stories.tsx` pattern.
2. `pnpm test` passes with zero failures, including vitest-axe accessibility assertions for all six components.
3. `pnpm typecheck` passes with zero TypeScript errors across the monorepo.
4. All components render correctly in Storybook (`pnpm storybook`) with all variants and states documented via CSF3 stories with `tags: ['autodocs']`.
5. Separator renders as a horizontal divider by default and as a vertical divider when `orientation="vertical"`, with correct `aria-orientation` on non-decorative instances.
6. Badge renders all four variants (`default`, `secondary`, `destructive`, `outline`) with correct semantic token classes.
7. Card renders as a composed group of six sub-components, each with its own `data-slot` value, styled with `bg-card` and `text-card-foreground`.
8. Skeleton renders with `animate-pulse` and `bg-muted` and accepts arbitrary dimensions via `className`.
9. Spinner renders an animated SVG in three sizes (`sm`/`md`/`lg`), has `role="status"`, and includes a screen-reader-accessible label.
10. Alert renders with `role="alert"`, supports `default` and `destructive` variants, and correctly positions an optional leading icon.
11. All components and their associated types and CVA variant functions are exported from `packages/ui/src/index.ts`.
12. No new ESLint or Prettier violations are introduced (verified by `pnpm lint`).

## Dependencies

### Pre-existing (must be in place before this phase starts)

- **Monorepo scaffolding** — pnpm workspace, Turborepo build pipeline, shared `tsconfig` and `eslint-config` packages
- **Button reference component** — canonical 5-file implementation in `packages/ui/src/components/button/` serving as the template for all new components
- **`@components/utils`** — `cn()` helper (clsx + tailwind-merge), imported as `../../lib/utils.js`
- **`@components/tokens`** — OKLCH design tokens and semantic theme definitions
- **`globals.css`** — complete light/dark theme with all semantic CSS custom properties (background, foreground, card, primary, secondary, muted, destructive, accent, border, input, ring, radius tokens)
- **Storybook 8.5** — configured in `apps/docs/` with `@storybook/react-vite`, accessibility addon, and theme switching
- **Vitest + Testing Library + vitest-axe** — test infrastructure configured in `packages/ui/`
- **`@radix-ui/react-slot`** — already installed (used by Button for `asChild`)
- **`class-variance-authority`** — already installed (used by Button for variant management)

### To be installed

- **`@radix-ui/react-separator`** — required by Task 1 (Separator component)

### No dependency on other phases

This is Phase 1 of Milestone 1. It has no dependency on any other phase. Phases 2 (Overlay Primitives) and 3 (Accessibility Primitives) are fully independent and may be developed in parallel without waiting for Phase 1 to complete.

## Artifacts

| Artifact                                | Type                | Description                                                             |
| --------------------------------------- | ------------------- | ----------------------------------------------------------------------- |
| `packages/ui/src/components/separator/` | Directory (5 files) | Separator component implementation                                      |
| `packages/ui/src/components/badge/`     | Directory (5 files) | Badge component implementation                                          |
| `packages/ui/src/components/card/`      | Directory (5 files) | Card compound component implementation                                  |
| `packages/ui/src/components/skeleton/`  | Directory (5 files) | Skeleton component implementation                                       |
| `packages/ui/src/components/spinner/`   | Directory (5 files) | Spinner component implementation                                        |
| `packages/ui/src/components/alert/`     | Directory (5 files) | Alert compound component implementation                                 |
| `packages/ui/src/index.ts`              | Modified file       | Updated with exports for all 6 components, types, and variant functions |
| `packages/ui/package.json`              | Modified file       | `@radix-ui/react-separator` added to dependencies                       |
