I have all the context I need from the task spec, phase spec, and existing codebase patterns. Let me now produce the implementation plan.

# Task 3: Card — Implementation Plan

## 1. Deliverables

| #   | File                                               | Action     | Purpose                                                                                            |
| --- | -------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------- |
| 1   | `packages/ui/src/components/card/card.types.ts`    | **Create** | TypeScript prop types for all six Card sub-components                                              |
| 2   | `packages/ui/src/components/card/card.styles.ts`   | **Create** | Class string constants for each sub-component (no CVA variants — Card is variantless)              |
| 3   | `packages/ui/src/components/card/card.tsx`         | **Create** | Six named component exports: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter |
| 4   | `packages/ui/src/components/card/card.test.tsx`    | **Create** | Vitest + Testing Library + vitest-axe tests                                                        |
| 5   | `packages/ui/src/components/card/card.stories.tsx` | **Create** | Storybook CSF3 stories with autodocs                                                               |
| 6   | `packages/ui/src/index.ts`                         | **Modify** | Add exports for all six components and their prop types                                            |

## 2. Dependencies

### Pre-existing (no installation needed)

- `@components/utils` — `cn()` helper (clsx + tailwind-merge)
- `class-variance-authority` — already installed (not strictly needed since Card is variantless, but styles file follows the consistent pattern)
- `globals.css` — provides `--card`, `--card-foreground` semantic tokens
- Vitest + Testing Library + vitest-axe — test infrastructure
- Storybook 8.5 — configured in `apps/docs/`

### To be installed

None. Card is a pure `<div>`-based compound component with no Radix primitive dependency.

## 3. Implementation Details

### 3.1 `card.types.ts`

**Purpose**: Define prop types for all six sub-components.

**Exports** (all `type` exports):

- `CardProps` — extends `React.ComponentProps<'div'>`
- `CardHeaderProps` — extends `React.ComponentProps<'div'>`
- `CardTitleProps` — extends `React.ComponentProps<'div'>`
- `CardDescriptionProps` — extends `React.ComponentProps<'div'>`
- `CardContentProps` — extends `React.ComponentProps<'div'>`
- `CardFooterProps` — extends `React.ComponentProps<'div'>`

**Key details**:

- No CVA `VariantProps` intersection — Card has no variants (Design Decision DD-7 equivalent for Card)
- No `asChild` prop on any sub-component (Design Decision DD-6)
- Each type extends `React.ComponentProps<'div'>` which includes `ref` in React 19

```typescript
export type CardProps = React.ComponentProps<'div'>;

export type CardHeaderProps = React.ComponentProps<'div'>;

export type CardTitleProps = React.ComponentProps<'div'>;

export type CardDescriptionProps = React.ComponentProps<'div'>;

export type CardContentProps = React.ComponentProps<'div'>;

export type CardFooterProps = React.ComponentProps<'div'>;
```

### 3.2 `card.styles.ts`

**Purpose**: Define class string constants for each sub-component. Since Card has no variants, these are plain string constants rather than CVA definitions. This is consistent with how shadcn/ui handles variantless compound components.

**Exports**:

- `cardStyles` — root card container classes
- `cardHeaderStyles` — header section classes
- `cardTitleStyles` — title text classes
- `cardDescriptionStyles` — description text classes
- `cardContentStyles` — content section classes
- `cardFooterStyles` — footer section classes

**Class assignments** (following shadcn/ui reference):

```typescript
export const cardStyles = 'rounded-xl border bg-card text-card-foreground shadow-sm';

export const cardHeaderStyles = 'flex flex-col gap-y-1.5 p-6';

export const cardTitleStyles = 'leading-none font-semibold tracking-tight';

export const cardDescriptionStyles = 'text-sm text-muted-foreground';

export const cardContentStyles = 'p-6 pt-0';

export const cardFooterStyles = 'flex items-center p-6 pt-0';
```

### 3.3 `card.tsx`

**Purpose**: Six named component exports, each rendering a styled `<div>` with a unique `data-slot` value.

**Exports**:

- `Card` — root container (`data-slot="card"`)
- `CardHeader` — header wrapper (`data-slot="card-header"`)
- `CardTitle` — title element (`data-slot="card-title"`)
- `CardDescription` — description text (`data-slot="card-description"`)
- `CardContent` — content wrapper (`data-slot="card-content"`)
- `CardFooter` — footer wrapper (`data-slot="card-footer"`)

**Re-exports**: All six prop types from `card.types.js`

**Pattern per sub-component**:

```typescript
export function Card({ className, ref, ...props }: CardProps): React.JSX.Element {
  return (
    <div
      data-slot="card"
      className={cn(cardStyles, className)}
      ref={ref}
      {...props}
    />
  );
}
```

**Key details**:

- Each sub-component follows the same pattern: destructure `className`, `ref`, spread rest props
- Use `cn()` to merge base styles with consumer-provided `className`
- No `asChild` / `Slot` usage on any sub-component
- No `forwardRef` — React 19 ref-as-prop via `React.ComponentProps<'div'>`
- Import `cn` from `../../lib/utils.js`
- Import styles from `./card.styles.js`
- Import types from `./card.types.js`

### 3.4 `card.test.tsx`

**Purpose**: Test all six sub-components for rendering, composition, className merging, data-slot attributes, and accessibility.

**Test categories**:

1. **Smoke render tests** — one per sub-component, verifying it renders without crashing
2. **Compound composition test** — renders all six together, verifies full structure
3. **Custom className merging** — verifies `className` prop is merged with base styles on each sub-component
4. **`data-slot` attribute tests** — verifies each sub-component has the correct `data-slot` value:
   - Card → `"card"`
   - CardHeader → `"card-header"`
   - CardTitle → `"card-title"`
   - CardDescription → `"card-description"`
   - CardContent → `"card-content"`
   - CardFooter → `"card-footer"`
5. **Style application tests** — verifies key classes:
   - Card has `bg-card`, `text-card-foreground`, `rounded-xl`, `border`, `shadow-sm`
   - CardHeader has `p-6`, `flex`, `flex-col`
   - CardContent has `p-6`, `pt-0`
   - CardFooter has `flex`, `items-center`, `p-6`, `pt-0`
   - CardTitle has `font-semibold`, `tracking-tight`
   - CardDescription has `text-sm`, `text-muted-foreground`
6. **Ref forwarding test** — verifies a ref passed to Card resolves to the DOM element
7. **Accessibility test** — `axe()` on a fully composed card with all six sub-components

**Imports**:

```typescript
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card.js';
```

Note: `userEvent` and `vi` are not imported since Card is non-interactive and has no event handlers to test. This follows the principle of not importing unnecessary dependencies.

### 3.5 `card.stories.tsx`

**Purpose**: Storybook CSF3 stories with autodocs covering common Card usage patterns.

**Meta configuration**:

```typescript
const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
};
```

**Stories**:

1. **`Default`** — Fully composed card with CardHeader (CardTitle + CardDescription), CardContent (paragraph text), and no footer. Demonstrates the standard card layout.

2. **`WithFooter`** — Same as Default but includes CardFooter with a Button. Demonstrates the footer pattern with action buttons.

3. **`WithForm`** — Card containing form elements (labels + inputs inside CardContent, submit button in CardFooter). Demonstrates using Card as a form container — a common use case in settings pages and login forms.

**Key details**:

- Import all six sub-components from `./card.js`
- Import `Button` from `../button/button.js` for footer actions in stories
- Each story uses a `render` function composing the sub-components together
- Use `export default meta` (Storybook's required default export)

## 4. API Contracts

### Component API

All six sub-components share the same base contract:

```typescript
// Input: React.ComponentProps<'div'> (className, ref, children, all HTML div attributes)
// Output: React.JSX.Element (a styled <div> with data-slot)

// Card — root container
<Card className="w-[350px]">...</Card>
// Renders: <div data-slot="card" class="rounded-xl border bg-card text-card-foreground shadow-sm w-[350px]">

// CardHeader — groups title and description
<CardHeader>...</CardHeader>
// Renders: <div data-slot="card-header" class="flex flex-col gap-y-1.5 p-6">

// CardTitle — primary heading
<CardTitle>Title</CardTitle>
// Renders: <div data-slot="card-title" class="leading-none font-semibold tracking-tight">

// CardDescription — secondary text
<CardDescription>Description</CardDescription>
// Renders: <div data-slot="card-description" class="text-sm text-muted-foreground">

// CardContent — main content area
<CardContent>...</CardContent>
// Renders: <div data-slot="card-content" class="p-6 pt-0">

// CardFooter — action area
<CardFooter>...</CardFooter>
// Renders: <div data-slot="card-footer" class="flex items-center p-6 pt-0">
```

### Typical composition

```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Public exports from `index.ts`

```typescript
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './components/card/card.js';
export type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
} from './components/card/card.js';
```

Note: No CVA variants export since Card is variantless.

## 5. Test Plan

### Test setup

- **Framework**: Vitest with jsdom environment
- **Libraries**: `@testing-library/react`, `vitest-axe`
- **File**: `packages/ui/src/components/card/card.test.tsx`
- **No `userEvent` needed**: Card is non-interactive (pure presentational compound component)

### Per-test specification

| #   | Test name                                             | What it verifies                                                                                            |
| --- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 1   | `Card renders without crashing`                       | `render(<Card>Content</Card>)` produces a DOM element with text                                             |
| 2   | `CardHeader renders without crashing`                 | Same for CardHeader                                                                                         |
| 3   | `CardTitle renders without crashing`                  | Same for CardTitle                                                                                          |
| 4   | `CardDescription renders without crashing`            | Same for CardDescription                                                                                    |
| 5   | `CardContent renders without crashing`                | Same for CardContent                                                                                        |
| 6   | `CardFooter renders without crashing`                 | Same for CardFooter                                                                                         |
| 7   | `renders a fully composed card`                       | All 6 sub-components render together; query each by `data-testid`                                           |
| 8   | `Card has correct data-slot`                          | `data-slot="card"` on Card root element                                                                     |
| 9   | `CardHeader has correct data-slot`                    | `data-slot="card-header"`                                                                                   |
| 10  | `CardTitle has correct data-slot`                     | `data-slot="card-title"`                                                                                    |
| 11  | `CardDescription has correct data-slot`               | `data-slot="card-description"`                                                                              |
| 12  | `CardContent has correct data-slot`                   | `data-slot="card-content"`                                                                                  |
| 13  | `CardFooter has correct data-slot`                    | `data-slot="card-footer"`                                                                                   |
| 14  | `Card applies base styling`                           | Has classes: `rounded-xl`, `border`, `bg-card`, `text-card-foreground`, `shadow-sm`                         |
| 15  | `CardHeader applies base styling`                     | Has classes: `flex`, `flex-col`, `p-6`                                                                      |
| 16  | `CardContent applies base styling`                    | Has classes: `p-6`, `pt-0`                                                                                  |
| 17  | `CardFooter applies base styling`                     | Has classes: `flex`, `items-center`, `p-6`, `pt-0`                                                          |
| 18  | `CardTitle applies base styling`                      | Has classes: `font-semibold`, `tracking-tight`                                                              |
| 19  | `CardDescription applies base styling`                | Has classes: `text-sm`, `text-muted-foreground`                                                             |
| 20  | `each sub-component merges custom className`          | Pass `className="custom-class"` to each and verify it appears alongside base classes                        |
| 21  | `Card forwards ref`                                   | Create a ref via `React.createRef<HTMLDivElement>()`, pass to Card, verify `ref.current` is the DOM element |
| 22  | `fully composed card has no accessibility violations` | `axe()` on a complete Card with all sub-components returns no violations                                    |

## 6. Implementation Order

1. **`card.types.ts`** — Define all six prop types first, as they are imported by both the styles and implementation files.
2. **`card.styles.ts`** — Define class string constants for each sub-component.
3. **`card.tsx`** — Implement all six sub-components using the types and styles.
4. **`card.test.tsx`** — Write the full test suite verifying all sub-components.
5. **`card.stories.tsx`** — Create Storybook stories for documentation.
6. **`packages/ui/src/index.ts`** — Add all six component and type exports.

## 7. Verification Commands

```bash
# Run Card-specific tests
pnpm --filter @components/ui test -- card

# Run all tests across packages
pnpm test

# TypeScript type checking
pnpm typecheck

# Lint check
pnpm lint

# Launch Storybook to visually verify stories
pnpm storybook
```
