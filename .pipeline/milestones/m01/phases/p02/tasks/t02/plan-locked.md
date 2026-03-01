Now I have all the context I need. Let me produce the implementation plan.

## 1. Deliverables

| #   | File                                                               | Action | Purpose                                                                                  |
| --- | ------------------------------------------------------------------ | ------ | ---------------------------------------------------------------------------------------- |
| 1   | `packages/ui/package.json`                                         | Modify | Add `@radix-ui/react-alert-dialog` to `dependencies`                                     |
| 2   | `packages/ui/src/components/alert-dialog/alert-dialog.types.ts`    | Create | TypeScript prop types for all 11 Alert Dialog sub-components                             |
| 3   | `packages/ui/src/components/alert-dialog/alert-dialog.styles.ts`   | Create | Style constants for overlay, content, header, footer, title, description, action, cancel |
| 4   | `packages/ui/src/components/alert-dialog/alert-dialog.tsx`         | Create | Implementation of 11 named exports wrapping `@radix-ui/react-alert-dialog` primitives    |
| 5   | `packages/ui/src/components/alert-dialog/alert-dialog.test.tsx`    | Create | Vitest + Testing Library + vitest-axe tests                                              |
| 6   | `packages/ui/src/components/alert-dialog/alert-dialog.stories.tsx` | Create | Storybook CSF3 stories with autodocs                                                     |
| 7   | `packages/ui/src/index.ts`                                         | Modify | Add exports for all Alert Dialog sub-components and types                                |

## 2. Dependencies

### Prerequisites

- **Task 0** (completed): `tailwindcss-animate` installed and configured — provides `animate-in`/`animate-out` utility classes
- **Task 1** (completed): Dialog component — establishes the overlay compound component pattern that Alert Dialog mirrors
- **Button component** (pre-existing): `buttonVariants` exported from `packages/ui/src/components/button/button.styles.ts`
- **`cn()` helper** (pre-existing): from `../../lib/utils.js`

### Package to install

- `@radix-ui/react-alert-dialog` — latest version (add to `dependencies` in `packages/ui/package.json`)

## 3. Implementation Details

### 3.1 `alert-dialog.types.ts`

**Purpose**: Define TypeScript prop types for all 11 sub-components.

**Exports** (all `export type`):

```ts
import type * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

export type AlertDialogProps = React.ComponentProps<typeof AlertDialogPrimitive.Root>;
export type AlertDialogTriggerProps = React.ComponentProps<typeof AlertDialogPrimitive.Trigger>;
export type AlertDialogPortalProps = React.ComponentProps<typeof AlertDialogPrimitive.Portal>;
export type AlertDialogOverlayProps = React.ComponentProps<typeof AlertDialogPrimitive.Overlay>;
export type AlertDialogContentProps = React.ComponentProps<typeof AlertDialogPrimitive.Content>;
export type AlertDialogHeaderProps = React.ComponentProps<'div'>;
export type AlertDialogFooterProps = React.ComponentProps<'div'>;
export type AlertDialogTitleProps = React.ComponentProps<typeof AlertDialogPrimitive.Title>;
export type AlertDialogDescriptionProps = React.ComponentProps<
  typeof AlertDialogPrimitive.Description
>;
export type AlertDialogActionProps = React.ComponentProps<typeof AlertDialogPrimitive.Action>;
export type AlertDialogCancelProps = React.ComponentProps<typeof AlertDialogPrimitive.Cancel>;
```

**Pattern**: Follows the exact same pattern as `dialog.types.ts` — each type is a direct alias for `React.ComponentProps<typeof Primitive>`. Header and Footer extend `React.ComponentProps<'div'>` since they are plain `<div>` elements. No `DialogCloseProps` equivalent — replaced by `AlertDialogActionProps` and `AlertDialogCancelProps`.

### 3.2 `alert-dialog.styles.ts`

**Purpose**: Export style constants for each sub-component. Shares most styling with Dialog.

**Exports**:

```ts
import { buttonVariants } from '../button/button.styles.js';

export const alertDialogOverlayStyles =
  'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0';

export const alertDialogContentStyles =
  'fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg';

export const alertDialogHeaderStyles = 'flex flex-col space-y-1.5 text-center sm:text-left';

export const alertDialogFooterStyles =
  'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2';

export const alertDialogTitleStyles = 'text-lg font-semibold leading-none tracking-tight';

export const alertDialogDescriptionStyles = 'text-sm text-muted-foreground';

export const alertDialogActionStyles = buttonVariants();

export const alertDialogCancelStyles = `${buttonVariants({ variant: 'outline' })} mt-2 sm:mt-0`;
```

**Key details**:

- Overlay, content, header, footer, title, and description styles are identical to Dialog's corresponding styles
- No `dialogCloseButtonStyles` equivalent — Alert Dialog has no close (X) button
- `alertDialogActionStyles` uses `buttonVariants()` with default variant
- `alertDialogCancelStyles` uses `buttonVariants({ variant: 'outline' })` plus `mt-2 sm:mt-0` for responsive margin

### 3.3 `alert-dialog.tsx`

**Purpose**: Implementation of 11 named exports wrapping `@radix-ui/react-alert-dialog`.

**Imports**:

```ts
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { cn } from '../../lib/utils.js';
import {} from /* style constants */ './alert-dialog.styles.js';
import type {} from /* all prop types */ './alert-dialog.types.js';
```

**Exports** (11 component exports + all type re-exports):

1. **`AlertDialog`** — Direct re-assignment: `export const AlertDialog = AlertDialogPrimitive.Root;`. Context provider, no DOM output, no `data-slot`.

2. **`AlertDialogPortal`** — Direct re-assignment: `export const AlertDialogPortal = AlertDialogPrimitive.Portal;`. Pure pass-through, no `data-slot`.

3. **`AlertDialogTrigger`** — Function component wrapping `AlertDialogPrimitive.Trigger`. Destructures `{ className, ref, ...props }` from `AlertDialogTriggerProps`. Applies `data-slot="alert-dialog-trigger"`. Passes `className` directly (no `cn()` needed — no base styles).

4. **`AlertDialogOverlay`** — Function component wrapping `AlertDialogPrimitive.Overlay`. Destructures `{ className, ref, ...props }` from `AlertDialogOverlayProps`. Applies `data-slot="alert-dialog-overlay"`. Uses `cn(alertDialogOverlayStyles, className)`.

5. **`AlertDialogContent`** — Function component wrapping `AlertDialogPrimitive.Content`. Destructures `{ className, children, ref, ...props }` from `AlertDialogContentProps`. Renders inside `<AlertDialogPortal><AlertDialogOverlay />...</AlertDialogPortal>`. Applies `data-slot="alert-dialog-content"`. Uses `cn(alertDialogContentStyles, className)`. **No close button (X)** — only renders `{children}`.

6. **`AlertDialogHeader`** — Function component rendering a plain `<div>`. Destructures `{ className, ref, ...props }` from `AlertDialogHeaderProps`. Applies `data-slot="alert-dialog-header"`. Uses `cn(alertDialogHeaderStyles, className)`.

7. **`AlertDialogFooter`** — Function component rendering a plain `<div>`. Destructures `{ className, ref, ...props }` from `AlertDialogFooterProps`. Applies `data-slot="alert-dialog-footer"`. Uses `cn(alertDialogFooterStyles, className)`.

8. **`AlertDialogTitle`** — Function component wrapping `AlertDialogPrimitive.Title`. Destructures `{ className, ref, ...props }` from `AlertDialogTitleProps`. Applies `data-slot="alert-dialog-title"`. Uses `cn(alertDialogTitleStyles, className)`.

9. **`AlertDialogDescription`** — Function component wrapping `AlertDialogPrimitive.Description`. Destructures `{ className, ref, ...props }` from `AlertDialogDescriptionProps`. Applies `data-slot="alert-dialog-description"`. Uses `cn(alertDialogDescriptionStyles, className)`.

10. **`AlertDialogAction`** — Function component wrapping `AlertDialogPrimitive.Action`. Destructures `{ className, ref, ...props }` from `AlertDialogActionProps`. Applies `data-slot="alert-dialog-action"`. Uses `cn(alertDialogActionStyles, className)`.

11. **`AlertDialogCancel`** — Function component wrapping `AlertDialogPrimitive.Cancel`. Destructures `{ className, ref, ...props }` from `AlertDialogCancelProps`. Applies `data-slot="alert-dialog-cancel"`. Uses `cn(alertDialogCancelStyles, className)`.

**Type re-exports**: All 11 types from `alert-dialog.types.js` are re-exported using `export type { ... } from './alert-dialog.types.js';`.

**Return type annotation**: All function components use `: React.JSX.Element` return type, matching the Dialog convention.

### 3.4 `alert-dialog.test.tsx`

**Purpose**: Comprehensive test coverage for Alert Dialog behavior, accessibility, and styling.

**Test fixture**: A `TestAlertDialog` helper component (similar to Dialog's `TestDialog`) that renders a full Alert Dialog with trigger, content, header, title, description, footer, action, and cancel. Accepts optional `open`, `onOpenChange`, and `classNames` props.

```tsx
function TestAlertDialog({
  open,
  onOpenChange,
  classNames,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  classNames?: TestAlertDialogClassNames;
}): React.JSX.Element {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger className={classNames?.trigger}>Open Alert</AlertDialogTrigger>
      <AlertDialogContent className={classNames?.content}>
        <AlertDialogHeader className={classNames?.header}>
          <AlertDialogTitle className={classNames?.title}>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription className={classNames?.description}>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={classNames?.footer}>
          <AlertDialogCancel className={classNames?.cancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction className={classNames?.action}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

**Tests** (within `describe('AlertDialog', () => { ... })`):

| Test                                                 | Description                                                                                                                                                                        |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `renders trigger button`                             | Smoke render — asserts trigger button is in document                                                                                                                               |
| `opens on trigger click`                             | Click trigger, assert `alertdialog` role and title visible                                                                                                                         |
| `does not close on overlay click`                    | **Critical test** — Click trigger, click overlay, assert dialog **remains** open. Uses `document.querySelector('[data-slot="alert-dialog-overlay"]')`                              |
| `closes on Cancel click`                             | Click trigger, click Cancel button, assert dialog closes                                                                                                                           |
| `Action triggers onOpenChange(false)`                | Render with `onOpenChange` spy, click trigger, click Action, assert spy called with `false`                                                                                        |
| `closes on ESC`                                      | Click trigger, press Escape, assert dialog closes                                                                                                                                  |
| `traps focus within the dialog`                      | Render open, tab multiple times, assert focus stays inside dialog and never reaches trigger                                                                                        |
| `sets aria-labelledby and aria-describedby links`    | Open dialog, verify `aria-labelledby` matches title `id` and `aria-describedby` matches description `id`                                                                           |
| `data-slot on alert-dialog-trigger`                  | Assert `[data-slot="alert-dialog-trigger"]` exists                                                                                                                                 |
| `data-slot on alert-dialog-content`                  | Open dialog, assert `[data-slot="alert-dialog-content"]` exists                                                                                                                    |
| `data-slot on alert-dialog-overlay`                  | Open dialog, assert `[data-slot="alert-dialog-overlay"]` exists                                                                                                                    |
| `data-slot on alert-dialog-header`                   | Open dialog, assert `[data-slot="alert-dialog-header"]` exists                                                                                                                     |
| `data-slot on alert-dialog-footer`                   | Open dialog, assert `[data-slot="alert-dialog-footer"]` exists                                                                                                                     |
| `data-slot on alert-dialog-title`                    | Open dialog, assert `[data-slot="alert-dialog-title"]` exists                                                                                                                      |
| `data-slot on alert-dialog-description`              | Open dialog, assert `[data-slot="alert-dialog-description"]` exists                                                                                                                |
| `data-slot on alert-dialog-action`                   | Open dialog, assert `[data-slot="alert-dialog-action"]` exists                                                                                                                     |
| `data-slot on alert-dialog-cancel`                   | Open dialog, assert `[data-slot="alert-dialog-cancel"]` exists                                                                                                                     |
| `controlled mode`                                    | Render with `open={true}` and `onOpenChange` spy, press ESC, assert spy called with `false`                                                                                        |
| `merges custom className on all sub-components`      | Render open with custom classNames, assert each sub-component has the custom class                                                                                                 |
| `merges custom className on overlay`                 | Render `AlertDialogOverlay` directly with custom class inside `AlertDialog open` + `AlertDialogPortal`, assert it has the class                                                    |
| `Action renders with button default variant styling` | Open dialog, query `[data-slot="alert-dialog-action"]`, assert it has classes from `buttonVariants()` (check for key classes like `bg-primary`)                                    |
| `Cancel renders with button outline variant styling` | Open dialog, query `[data-slot="alert-dialog-cancel"]`, assert it has classes from `buttonVariants({ variant: 'outline' })` (check for key classes like `border`, `bg-background`) |
| `has no accessibility violations`                    | Render open, run `axe(container)`, assert `toHaveNoViolations()`                                                                                                                   |

**Imports**: `render`, `screen`, `waitFor` from `@testing-library/react`; `userEvent` from `@testing-library/user-event`; `axe` from `vitest-axe`; `describe`, `expect`, `it`, `vi` from `vitest`; all Alert Dialog components from `./alert-dialog.js`.

**Important behavioral note**: The `alertdialog` ARIA role is used by Radix's Alert Dialog (not `dialog`). Tests must query `screen.getByRole('alertdialog')` rather than `screen.getByRole('dialog')`.

### 3.5 `alert-dialog.stories.tsx`

**Purpose**: Storybook CSF3 stories with autodocs tag.

**Meta**:

```ts
const meta: Meta<typeof AlertDialog> = {
  title: 'Components/AlertDialog',
  component: AlertDialog,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;
```

**Stories**:

1. **`Default`** — Standard confirmation dialog. Trigger button ("Show Alert"). Content has header with title "Are you sure?" and description "This action cannot be undone. This will permanently delete your account and remove your data from our servers." Footer with Cancel and Action ("Continue") buttons. Action and Cancel use `asChild` with `<Button>` for the render.

2. **`Destructive`** — Delete confirmation. Trigger "Delete Item". Title "Delete item?". Description "This item will be permanently deleted." Action is styled with destructive variant via `<Button variant="destructive">Delete</Button>` wrapped in `AlertDialogAction asChild`. Cancel as outline button.

3. **`Controlled`** — Externally controlled open state. Uses a `ControlledDemo` function component with `useState`. External "Open" and "Close" buttons + the Alert Dialog. Shows programmatic control pattern.

4. **`WithDescription`** — Detailed description text. Title "Discard changes?". A longer, multi-sentence description explaining what will happen. Action "Discard" and Cancel "Keep editing".

**Imports**: `useState` from `react`; `Meta`, `StoryObj` from `@storybook/react-vite`; `Button` from `../button/button.js`; all Alert Dialog components from `./alert-dialog.js`.

### 3.6 `packages/ui/src/index.ts` (modification)

Append the following block after the Dialog exports:

```ts
export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  type AlertDialogProps,
  type AlertDialogTriggerProps,
  type AlertDialogPortalProps,
  type AlertDialogOverlayProps,
  type AlertDialogContentProps,
  type AlertDialogHeaderProps,
  type AlertDialogFooterProps,
  type AlertDialogTitleProps,
  type AlertDialogDescriptionProps,
  type AlertDialogActionProps,
  type AlertDialogCancelProps,
} from './components/alert-dialog/alert-dialog.js';
```

### 3.7 `packages/ui/package.json` (modification)

Add to `dependencies`:

```json
"@radix-ui/react-alert-dialog": "^1.1.14"
```

Use the latest version available. The version should be checked during `pnpm install`.

## 4. API Contracts

### Component exports

```ts
// Context provider — no DOM output
<AlertDialog open? onOpenChange?>
  // Trigger button
  <AlertDialogTrigger asChild? className? ref?>

  // Content (renders portal + overlay internally)
  <AlertDialogContent className? ref?>
    <AlertDialogHeader className? ref?>
      <AlertDialogTitle className? ref?>
      <AlertDialogDescription className? ref?>
    </AlertDialogHeader>
    <AlertDialogFooter className? ref?>
      <AlertDialogCancel asChild? className? ref?>
      <AlertDialogAction asChild? className? ref?>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

// Low-level primitives (rarely used directly):
<AlertDialogPortal>     // pure pass-through
<AlertDialogOverlay>    // styled overlay
```

### Usage example

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@components/ui';

function DeleteConfirmation() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

## 5. Test Plan

### Test setup

- **Runner**: Vitest (via `pnpm test`)
- **DOM**: jsdom (configured in project)
- **Libraries**: `@testing-library/react`, `@testing-library/user-event`, `vitest-axe`
- **Imports**: All components imported from `./alert-dialog.js` (co-located import)

### Test specifications

| #    | Test name                           | Setup                                                 | Action                                    | Assertion                                                                                      |
| ---- | ----------------------------------- | ----------------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 1    | renders trigger button              | `render(<TestAlertDialog />)`                         | —                                         | `screen.getByRole('button', { name: 'Open Alert' })` is in document                            |
| 2    | opens on trigger click              | `render(<TestAlertDialog />)`                         | Click trigger                             | `screen.getByRole('alertdialog')` is in document; title text visible                           |
| 3    | does not close on overlay click     | `render(<TestAlertDialog />)`                         | Click trigger, then click overlay element | `screen.getByRole('alertdialog')` **still** in document                                        |
| 4    | closes on Cancel click              | `render(<TestAlertDialog />)`                         | Click trigger, click Cancel               | `screen.queryByRole('alertdialog')` is null (via `waitFor`)                                    |
| 5    | Action triggers onOpenChange(false) | `render(<TestAlertDialog onOpenChange={vi.fn()} />)`  | Click trigger, click Action               | `onOpenChange` called with `false`                                                             |
| 6    | closes on ESC                       | `render(<TestAlertDialog />)`                         | Click trigger, press `{Escape}`           | `screen.queryByRole('alertdialog')` is null (via `waitFor`)                                    |
| 7    | traps focus                         | `render(<TestAlertDialog open />)`                    | Tab 8 times                               | `document.activeElement` always inside dialog, never on trigger                                |
| 8    | aria-labelledby/aria-describedby    | `render(<TestAlertDialog />)`                         | Click trigger                             | Dialog's `aria-labelledby` matches title's `id`; `aria-describedby` matches description's `id` |
| 9–16 | data-slot on each sub-component     | Render / open as needed                               | —                                         | `document.querySelector('[data-slot="alert-dialog-{name}"]')` is in document                   |
| 17   | controlled mode                     | `render(<TestAlertDialog open onOpenChange={spy} />)` | Press Escape                              | spy called with `false`                                                                        |
| 18   | merges custom className on all      | `render(<TestAlertDialog open classNames={{...}} />)` | —                                         | Each sub-component has its custom class                                                        |
| 19   | merges custom className on overlay  | Direct `AlertDialogOverlay` render                    | —                                         | Has custom class                                                                               |
| 20   | Action has button default styling   | Open dialog                                           | —                                         | Action element has `bg-primary` class                                                          |
| 21   | Cancel has button outline styling   | Open dialog                                           | —                                         | Cancel element has `border` and `bg-background` classes                                        |
| 22   | has no accessibility violations     | `render(<TestAlertDialog open />)`                    | `await axe(container)`                    | `toHaveNoViolations()`                                                                         |

## 6. Implementation Order

1. **Install dependency**: Add `@radix-ui/react-alert-dialog` to `packages/ui/package.json` and run `pnpm install`.

2. **Create types file**: `alert-dialog.types.ts` — defines all 11 prop types. No other files depend on this except the implementation, but it's the simplest file and establishes the API contract.

3. **Create styles file**: `alert-dialog.styles.ts` — defines all style constants. Imports `buttonVariants` from `../button/button.styles.js`. Must exist before the implementation file.

4. **Create implementation file**: `alert-dialog.tsx` — the 11 component exports and type re-exports. Imports from both types and styles files.

5. **Update index.ts**: Add all Alert Dialog exports to `packages/ui/src/index.ts`.

6. **Run typecheck**: `pnpm typecheck` to verify all types resolve correctly before writing tests.

7. **Create test file**: `alert-dialog.test.tsx` — all 22 tests described above.

8. **Run tests**: `pnpm test` to verify all tests pass.

9. **Create stories file**: `alert-dialog.stories.tsx` — 4 stories with autodocs.

10. **Final verification**: Run `pnpm typecheck`, `pnpm test`, and `pnpm lint`.

## 7. Verification Commands

```bash
# Install the new dependency
pnpm --filter @components/ui add @radix-ui/react-alert-dialog

# Type check the entire monorepo
pnpm typecheck

# Run all tests (includes alert-dialog tests)
pnpm test

# Run only alert-dialog tests
pnpm --filter @components/ui test -- alert-dialog

# Lint
pnpm lint

# Build the ui package (verifies TSC compilation)
pnpm --filter @components/ui build

# Verify the 5 files exist
ls packages/ui/src/components/alert-dialog/
```

## 8. Design Deviations

**Deviation 1: Style constants approach for Action and Cancel**

- **Parent spec states**: `alert-dialog.styles.ts` — "Action and Cancel styles reference `buttonVariants` from `'../button/button.styles.js'`"
- **Issue**: The `buttonVariants()` function returns a string of CSS classes at call time. Storing the result as a style constant (`export const alertDialogActionStyles = buttonVariants()`) is straightforward, but `alertDialogCancelStyles` needs both the outline variant classes and the additional `mt-2 sm:mt-0` classes. Using simple string concatenation (`${buttonVariants({ variant: 'outline' })} mt-2 sm:mt-0`) works here because `cn()` in the component will handle any merge conflicts when consumers pass additional `className`.
- **Alternative chosen**: Concatenation with template literal for the cancel style constant. The `cn()` call in the component will properly handle class merging. This is the simplest approach that avoids calling `buttonVariants` at render time while still producing correct output.

No other deviations are needed. The implementation follows the Dialog pattern exactly, with the behavioral differences (no close button, no backdrop dismiss) handled naturally by the `@radix-ui/react-alert-dialog` primitive.
