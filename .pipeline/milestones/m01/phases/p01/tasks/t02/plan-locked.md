Now I have complete context. Here is the implementation plan:

# Task 2: Badge — Implementation Specification

## 1. Deliverables

| #   | File                                                 | Action     | Purpose                                                |
| --- | ---------------------------------------------------- | ---------- | ------------------------------------------------------ |
| 1   | `packages/ui/src/components/badge/badge.types.ts`    | **Create** | TypeScript prop types for Badge                        |
| 2   | `packages/ui/src/components/badge/badge.styles.ts`   | **Create** | CVA variant definitions for 4 visual variants          |
| 3   | `packages/ui/src/components/badge/badge.tsx`         | **Create** | Component implementation with `asChild` via Radix Slot |
| 4   | `packages/ui/src/components/badge/badge.test.tsx`    | **Create** | Vitest + Testing Library + vitest-axe tests            |
| 5   | `packages/ui/src/components/badge/badge.stories.tsx` | **Create** | Storybook CSF3 stories with autodocs                   |
| 6   | `packages/ui/src/index.ts`                           | **Modify** | Add `Badge`, `BadgeProps`, `badgeVariants` exports     |

## 2. Dependencies

### Pre-existing (no installation needed)

- `@radix-ui/react-slot` — already installed in `packages/ui/package.json` (used by Button for `asChild` pattern)
- `class-variance-authority` — already installed
- `@components/utils` — `cn()` helper
- `vitest`, `@testing-library/react`, `@testing-library/user-event`, `vitest-axe` — already in devDependencies

### To be installed

None. Badge has no new external dependencies.

## 3. Implementation Details

### 3.1 `badge.types.ts`

**Purpose**: Define the `BadgeProps` type.

**Exports**: `BadgeProps`

**Contract**:

```typescript
import type { VariantProps } from 'class-variance-authority';
import type { badgeVariants } from './badge.styles.js';

export type BadgeProps = React.ComponentProps<'div'> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
  };
```

- Extends `React.ComponentProps<'div'>` — includes `ref`, `className`, `children`, and all standard HTML div attributes (React 19 ref-as-prop, no `forwardRef`)
- Intersects with `VariantProps<typeof badgeVariants>` to get type-safe `variant` prop
- Adds optional `asChild` boolean for polymorphic rendering via Radix Slot

### 3.2 `badge.styles.ts`

**Purpose**: Define CVA variant definitions for Badge.

**Exports**: `badgeVariants`

**Specification**:

```typescript
import { cva } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);
```

- **Base classes**: `inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2`
- **Variants**:
  - `default` — solid primary background: `border-transparent bg-primary text-primary-foreground`
  - `secondary` — solid secondary background: `border-transparent bg-secondary text-secondary-foreground`
  - `destructive` — solid destructive background: `border-transparent bg-destructive text-destructive-foreground`
  - `outline` — border-only: `text-foreground` (border comes from base classes, remains visible since no `border-transparent`)
- **Default variant**: `"default"`

### 3.3 `badge.tsx`

**Purpose**: Badge component implementation.

**Exports**: `Badge` (function component), re-exports `BadgeProps` type.

**Implementation**:

```typescript
import { Slot } from '@radix-ui/react-slot';

import { cn } from '../../lib/utils.js';
import { badgeVariants } from './badge.styles.js';
import type { BadgeProps } from './badge.types.js';

export type { BadgeProps } from './badge.types.js';

export function Badge({
  className,
  variant,
  asChild = false,
  ref,
  ...props
}: BadgeProps): React.JSX.Element {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, className }))}
      ref={ref}
      {...props}
    />
  );
}
```

**Key details**:

- Follows the exact same structure as `Button` — destructure `className`, variant props, `asChild`, `ref`, and `...props`
- `asChild` defaults to `false`; when `true`, renders via Radix `Slot` merging props onto the child element
- `data-slot="badge"` applied on root element
- `cn()` merges CVA output with consumer `className`
- Return type is `React.JSX.Element` (consistent with Button and Separator)

### 3.4 `badge.test.tsx`

**Purpose**: Comprehensive tests for Badge.

**Test setup**: Uses `@testing-library/react`, `@testing-library/user-event`, `vitest-axe`, `vitest`.

**Tests** (9 test cases):

1. **`renders with default props`** — render `<Badge>Status</Badge>`, assert text "Status" is in the document.
2. **`applies default variant classes`** — render without explicit variant, assert `bg-primary` and `text-primary-foreground` classes.
3. **`applies secondary variant classes`** — render with `variant="secondary"`, assert `bg-secondary`.
4. **`applies destructive variant classes`** — render with `variant="destructive"`, assert `bg-destructive`.
5. **`applies outline variant classes`** — render with `variant="outline"`, assert `text-foreground` and no `border-transparent`.
6. **`renders as child element when asChild is true`** — render `<Badge asChild><a href="/test">Link</a></Badge>`, assert the rendered element is an `<a>` tag with `href="/test"`, has `data-slot="badge"`, and has the base CVA classes (e.g., `inline-flex`).
7. **`merges custom className`** — render with `className="custom-class"`, assert both `custom-class` and a base class (e.g., `inline-flex`) are present.
8. **`has data-slot attribute`** — render Badge, assert `data-slot="badge"`.
9. **`has no accessibility violations`** — render Badge, run `axe(container)`, assert `toHaveNoViolations()`.

### 3.5 `badge.stories.tsx`

**Purpose**: Storybook CSF3 stories with autodocs for interactive documentation.

**Meta configuration**:

- `title: 'Components/Badge'`
- `component: Badge`
- `tags: ['autodocs']`
- `argTypes`: `variant` as select control with 4 options, `asChild` as boolean

**Stories** (5 stories):

1. **`Default`** — `args: { children: 'Badge' }` — renders default variant
2. **`Secondary`** — `args: { children: 'Secondary', variant: 'secondary' }`
3. **`Destructive`** — `args: { children: 'Destructive', variant: 'destructive' }`
4. **`Outline`** — `args: { children: 'Outline', variant: 'outline' }`
5. **`AsChild`** — render function wrapping `<a href="/">` inside Badge with `asChild: true`

## 4. API Contracts

### Component API

```typescript
// Import
import { Badge, type BadgeProps, badgeVariants } from '@components/ui';

// Usage — basic
<Badge>New</Badge>

// Usage — with variant
<Badge variant="destructive">Error</Badge>
<Badge variant="secondary">Draft</Badge>
<Badge variant="outline">v1.2.0</Badge>

// Usage — with asChild (polymorphic rendering)
<Badge asChild variant="secondary">
  <a href="/status">Active</a>
</Badge>

// Usage — with custom className
<Badge className="gap-1">
  <CircleIcon className="h-3 w-3" />
  Online
</Badge>
```

### Props

| Prop        | Type                                                     | Default     | Description                              |
| ----------- | -------------------------------------------------------- | ----------- | ---------------------------------------- |
| `variant`   | `'default' \| 'secondary' \| 'destructive' \| 'outline'` | `'default'` | Visual style variant                     |
| `asChild`   | `boolean`                                                | `false`     | Render as child element via Radix Slot   |
| `className` | `string`                                                 | `undefined` | Additional CSS classes merged via `cn()` |
| `ref`       | `React.Ref<HTMLDivElement>`                              | `undefined` | Ref forwarded to root element (React 19) |
| `...rest`   | `React.ComponentProps<'div'>`                            | —           | All standard HTML div attributes         |

### Exports from `@components/ui`

| Export          | Type      | Description                    |
| --------------- | --------- | ------------------------------ |
| `Badge`         | Component | Badge function component       |
| `BadgeProps`    | Type      | Props type (type-only export)  |
| `badgeVariants` | Function  | CVA variant function for reuse |

## 5. Test Plan

### Test Setup

- Framework: Vitest (configured in `packages/ui/`)
- DOM environment: jsdom (configured in vitest config)
- Libraries: `@testing-library/react` for rendering, `@testing-library/user-event` for interactions, `vitest-axe` for accessibility
- Import pattern: `import { Badge } from './badge.js';`

### Test Specifications

| #   | Test Name                                     | Category      | Assertions                                                                                       |
| --- | --------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------ |
| 1   | renders with default props                    | Smoke         | `screen.getByText('Status')` is in the document                                                  |
| 2   | applies default variant classes               | Variants      | Element has classes `bg-primary`, `text-primary-foreground`                                      |
| 3   | applies secondary variant classes             | Variants      | Element has class `bg-secondary`                                                                 |
| 4   | applies destructive variant classes           | Variants      | Element has class `bg-destructive`                                                               |
| 5   | applies outline variant classes               | Variants      | Element has class `text-foreground`, does NOT have `border-transparent`                          |
| 6   | renders as child element when asChild is true | asChild       | Rendered as `<a>` tag, has `href="/test"`, has `data-slot="badge"`, has base class `inline-flex` |
| 7   | merges custom className                       | className     | Element has both `custom-class` and `inline-flex`                                                |
| 8   | has data-slot attribute                       | data-slot     | `data-slot` attribute equals `"badge"`                                                           |
| 9   | has no accessibility violations               | Accessibility | `axe(container)` returns `toHaveNoViolations()`                                                  |

## 6. Implementation Order

1. **`badge.styles.ts`** — Create CVA variant definitions first (no dependencies on other Badge files)
2. **`badge.types.ts`** — Create props type (depends on `badgeVariants` type import from styles)
3. **`badge.tsx`** — Create component implementation (depends on styles and types)
4. **`badge.test.tsx`** — Create tests (depends on component)
5. **`badge.stories.tsx`** — Create Storybook stories (depends on component)
6. **`packages/ui/src/index.ts`** — Add Badge exports (depends on component and styles being created)

## 7. Verification Commands

```bash
# Run Badge tests only
pnpm --filter @components/ui test -- --run src/components/badge/badge.test.tsx

# Run all tests across the UI package
pnpm --filter @components/ui test

# TypeScript type checking
pnpm --filter @components/ui typecheck

# Lint check
pnpm --filter @components/ui lint

# Verify exports are correct (build the package)
pnpm --filter @components/ui build

# Launch Storybook to visually verify stories
pnpm storybook
```
