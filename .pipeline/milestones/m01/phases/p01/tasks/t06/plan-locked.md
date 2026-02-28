Now I have all the context I need. Let me produce the implementation plan.

## 1. Deliverables

| #   | File                                                 | Action     | Purpose                                                                                      |
| --- | ---------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------- |
| 1   | `packages/ui/src/components/alert/alert.types.ts`    | **Create** | TypeScript prop types for `Alert`, `AlertTitle`, and `AlertDescription`                      |
| 2   | `packages/ui/src/components/alert/alert.styles.ts`   | **Create** | CVA variant definition for Alert with `default` and `destructive` variants                   |
| 3   | `packages/ui/src/components/alert/alert.tsx`         | **Create** | Component implementation — three named exports: `Alert`, `AlertTitle`, `AlertDescription`    |
| 4   | `packages/ui/src/components/alert/alert.test.tsx`    | **Create** | Vitest + Testing Library + vitest-axe tests                                                  |
| 5   | `packages/ui/src/components/alert/alert.stories.tsx` | **Create** | Storybook CSF3 stories with autodocs                                                         |
| 6   | `packages/ui/src/index.ts`                           | **Modify** | Add `Alert`, `AlertTitle`, `AlertDescription`, their prop types, and `alertVariants` exports |

## 2. Dependencies

### Pre-existing (no installation required)

- `class-variance-authority` — already in `packages/ui/package.json` dependencies
- `@components/utils` — `cn()` helper, imported as `../../lib/utils.js`
- `@radix-ui/react-slot` — already installed (not used by Alert, but present)
- `vitest`, `@testing-library/react`, `@testing-library/user-event`, `vitest-axe` — already in devDependencies

### New packages

None. Alert has no Radix dependency — it uses native `<div>` and `<h5>` elements.

## 3. Implementation Details

### 3.1 `alert.types.ts`

**Purpose**: Define prop types for all three Alert sub-components.

**Exports**:

- `AlertProps` — extends `React.ComponentProps<'div'>` intersected with `VariantProps<typeof alertVariants>`. Provides the `variant` prop (`'default' | 'destructive' | null | undefined`).
- `AlertTitleProps` — extends `React.ComponentProps<'h5'>`. No additional props.
- `AlertDescriptionProps` — extends `React.ComponentProps<'div'>`. No additional props.

**Implementation**:

```typescript
import type { VariantProps } from 'class-variance-authority';

import type { alertVariants } from './alert.styles.js';

export type AlertProps = React.ComponentProps<'div'> & VariantProps<typeof alertVariants>;

export type AlertTitleProps = React.ComponentProps<'h5'>;

export type AlertDescriptionProps = React.ComponentProps<'div'>;
```

### 3.2 `alert.styles.ts`

**Purpose**: CVA variant definitions for the Alert root component. Sub-component styles are plain string constants (same pattern as Card).

**Exports**:

- `alertVariants` — CVA function with `variant` axis
- `alertTitleStyles` — class string constant for AlertTitle
- `alertDescriptionStyles` — class string constant for AlertDescription

**Implementation**:

```typescript
import { cva } from 'class-variance-authority';

export const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&:has(svg)]:pl-11',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export const alertTitleStyles = 'mb-1 font-medium leading-none tracking-tight';

export const alertDescriptionStyles = 'text-sm [&_p]:leading-relaxed';
```

**Key details**:

- The base classes include SVG icon positioning selectors (`[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4`) and the padding shift `[&:has(svg)]:pl-11` which adds left padding when an SVG icon is a direct child.
- The `destructive` variant overrides the SVG icon color to `text-destructive` and uses `dark:border-destructive` for dark mode border visibility.
- AlertTitle uses `mb-1 font-medium leading-none tracking-tight` matching the shadcn/ui reference.
- AlertDescription uses `text-sm [&_p]:leading-relaxed` for proper paragraph spacing within the description.

### 3.3 `alert.tsx`

**Purpose**: Three named component exports implementing the Alert compound component.

**Exports**:

- `Alert` — root container `<div>` with `role="alert"` and `data-slot="alert"`, applies CVA variant classes via `cn(alertVariants({ variant, className }))`
- `AlertTitle` — `<h5>` element with `data-slot="alert-title"`, applies static classes via `cn(alertTitleStyles, className)`
- `AlertDescription` — `<div>` element with `data-slot="alert-description"`, applies static classes via `cn(alertDescriptionStyles, className)`

**Key details**:

- No `asChild` support on any sub-component (per DD-6)
- React 19 ref-as-prop pattern — `ref` is destructured from props, no `forwardRef`
- Each function has return type `React.JSX.Element`
- Follows the Card compound component pattern exactly

**Implementation**:

```typescript
import { cn } from '../../lib/utils.js';
import { alertDescriptionStyles, alertTitleStyles, alertVariants } from './alert.styles.js';
import type { AlertDescriptionProps, AlertProps, AlertTitleProps } from './alert.types.js';

export type { AlertDescriptionProps, AlertProps, AlertTitleProps } from './alert.types.js';

export function Alert({ className, variant, ref, ...props }: AlertProps): React.JSX.Element {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant, className }))}
      ref={ref}
      {...props}
    />
  );
}

export function AlertTitle({ className, ref, ...props }: AlertTitleProps): React.JSX.Element {
  return (
    <h5
      data-slot="alert-title"
      className={cn(alertTitleStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function AlertDescription({
  className,
  ref,
  ...props
}: AlertDescriptionProps): React.JSX.Element {
  return (
    <div
      data-slot="alert-description"
      className={cn(alertDescriptionStyles, className)}
      ref={ref}
      {...props}
    />
  );
}
```

### 3.4 `alert.test.tsx`

**Purpose**: Comprehensive test coverage including smoke tests, variant rendering, compound composition, icon positioning, ref forwarding, custom className merging, data-slot attributes, and vitest-axe accessibility.

**Test cases** (detailed in Section 5 below).

### 3.5 `alert.stories.tsx`

**Purpose**: Storybook CSF3 stories with autodocs covering all variants and compositions.

**Stories**:

- `Default` — default variant with AlertTitle and AlertDescription
- `Destructive` — destructive variant with AlertTitle and AlertDescription
- `WithIcon` — default variant with an inline SVG icon (e.g., a terminal/info icon), AlertTitle, and AlertDescription to demonstrate icon positioning
- `WithTitle` — default variant with only AlertTitle (no description)
- `WithTitleAndDescription` — explicit composition showing title + description together

**Meta configuration**:

```typescript
const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
    },
  },
};
```

### 3.6 `index.ts` modification

**Current last line** (line 26–27):

```typescript
export { Spinner, type SpinnerProps } from './components/spinner/spinner.js';
export { spinnerVariants } from './components/spinner/spinner.styles.js';
```

**Lines to append**:

```typescript
export {
  Alert,
  AlertTitle,
  AlertDescription,
  type AlertProps,
  type AlertTitleProps,
  type AlertDescriptionProps,
} from './components/alert/alert.js';
export { alertVariants } from './components/alert/alert.styles.js';
```

## 4. API Contracts

### Component Props

**AlertProps**:

```typescript
{
  variant?: 'default' | 'destructive' | null;  // default: 'default'
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  children?: React.ReactNode;
  // ...all other React.ComponentProps<'div'> props
}
```

**AlertTitleProps**:

```typescript
{
  className?: string;
  ref?: React.Ref<HTMLHeadingElement>;
  children?: React.ReactNode;
  // ...all other React.ComponentProps<'h5'> props
}
```

**AlertDescriptionProps**:

```typescript
{
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  children?: React.ReactNode;
  // ...all other React.ComponentProps<'div'> props
}
```

### Usage Examples

**Default alert**:

```tsx
<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>You can add components to your app.</AlertDescription>
</Alert>
```

**Destructive alert with icon**:

```tsx
<Alert variant="destructive">
  <AlertCircleIcon className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Your session has expired.</AlertDescription>
</Alert>
```

### Exported Symbols from `@components/ui`

| Export                  | Type      | Description                              |
| ----------------------- | --------- | ---------------------------------------- |
| `Alert`                 | Component | Root alert container with `role="alert"` |
| `AlertTitle`            | Component | `<h5>` title sub-component               |
| `AlertDescription`      | Component | `<div>` description sub-component        |
| `AlertProps`            | Type      | Props for Alert                          |
| `AlertTitleProps`       | Type      | Props for AlertTitle                     |
| `AlertDescriptionProps` | Type      | Props for AlertDescription               |
| `alertVariants`         | Function  | CVA variant function                     |

## 5. Test Plan

### Test Setup

- **Framework**: Vitest (configured in `packages/ui`)
- **Rendering**: `@testing-library/react` (`render`, `screen`)
- **User events**: `@testing-library/user-event` (imported but Alert has no interactive tests)
- **Accessibility**: `vitest-axe` (`axe` function)
- **Imports**: `{ describe, expect, it }` from `vitest`, `{ createRef }` from `react`

### Test Specifications

| #   | Test name                                              | Category      | Description                                                                                           |
| --- | ------------------------------------------------------ | ------------- | ----------------------------------------------------------------------------------------------------- |
| 1   | `Alert renders without crashing`                       | Smoke         | Render `<Alert>Content</Alert>`, assert text is in the document                                       |
| 2   | `AlertTitle renders without crashing`                  | Smoke         | Render `<AlertTitle>Title</AlertTitle>`, assert text is in the document                               |
| 3   | `AlertDescription renders without crashing`            | Smoke         | Render `<AlertDescription>Desc</AlertDescription>`, assert text is in the document                    |
| 4   | `Alert has role="alert"`                               | Semantics     | Render Alert, assert `screen.getByRole('alert')` exists                                               |
| 5   | `Alert applies default variant classes`                | Variants      | Render Alert with no variant, assert element has `bg-background` and `text-foreground`                |
| 6   | `Alert applies destructive variant classes`            | Variants      | Render `<Alert variant="destructive">`, assert element has `text-destructive`                         |
| 7   | `renders a fully composed alert`                       | Composition   | Render Alert + AlertTitle + AlertDescription, assert all three are in the document                    |
| 8   | `Alert has correct data-slot`                          | Data-slot     | Assert `data-slot="alert"` on Alert root                                                              |
| 9   | `AlertTitle has correct data-slot`                     | Data-slot     | Assert `data-slot="alert-title"` on AlertTitle                                                        |
| 10  | `AlertDescription has correct data-slot`               | Data-slot     | Assert `data-slot="alert-description"` on AlertDescription                                            |
| 11  | `Alert merges custom className`                        | ClassName     | Render with `className="custom-class"`, assert both custom and base classes present                   |
| 12  | `AlertTitle merges custom className`                   | ClassName     | Render with `className="custom-class"`, assert both custom and base classes present                   |
| 13  | `AlertDescription merges custom className`             | ClassName     | Render with `className="custom-class"`, assert both custom and base classes present                   |
| 14  | `AlertTitle applies base styling`                      | Styling       | Assert AlertTitle has `font-medium` and `tracking-tight`                                              |
| 15  | `AlertDescription applies base styling`                | Styling       | Assert AlertDescription has `text-sm`                                                                 |
| 16  | `Alert forwards ref`                                   | Ref           | Create ref via `createRef<HTMLDivElement>()`, pass to Alert, assert `ref.current` is `HTMLDivElement` |
| 17  | `fully composed alert has no accessibility violations` | Accessibility | Render full composition (Alert + AlertTitle + AlertDescription), run `axe()`, assert no violations    |
| 18  | `destructive variant has no accessibility violations`  | Accessibility | Render destructive variant with title and description, run `axe()`, assert no violations              |

## 6. Implementation Order

1. **`alert.styles.ts`** — Define the CVA `alertVariants` function and the static class string constants `alertTitleStyles` and `alertDescriptionStyles`. This file has no internal dependencies and is imported by both the types and implementation files.

2. **`alert.types.ts`** — Define `AlertProps`, `AlertTitleProps`, and `AlertDescriptionProps`. Imports `alertVariants` from the styles file for the `VariantProps` intersection.

3. **`alert.tsx`** — Implement the three component functions (`Alert`, `AlertTitle`, `AlertDescription`). Imports from both styles and types files. Re-exports types.

4. **`alert.test.tsx`** — Write all 18 test cases. Imports components from `alert.js`.

5. **`alert.stories.tsx`** — Write all 5 stories. Imports components from `alert.js`.

6. **`packages/ui/src/index.ts`** — Append export lines for all three components, their prop types, and `alertVariants`.

## 7. Verification Commands

```bash
# Run Alert tests only
pnpm --filter @components/ui test -- alert

# Run the full test suite (ensures no regressions)
pnpm test

# TypeScript type checking across the monorepo
pnpm typecheck

# Lint check (ensures no ESLint/Prettier violations)
pnpm lint

# Verify the 5-file structure exists
ls packages/ui/src/components/alert/

# Verify exports compile (build the package)
pnpm --filter @components/ui build
```
