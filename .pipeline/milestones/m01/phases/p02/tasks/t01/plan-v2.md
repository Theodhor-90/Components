I now have all the context needed. Let me produce the revised plan.

## 1. Deliverables

| #   | File                                                   | Action | Purpose                                                                                    |
| --- | ------------------------------------------------------ | ------ | ------------------------------------------------------------------------------------------ |
| 1   | `packages/ui/package.json`                             | Modify | Add `@radix-ui/react-dialog` to `dependencies`                                             |
| 2   | `packages/ui/src/components/dialog/dialog.types.ts`    | Create | TypeScript prop types for all 10 Dialog sub-components                                     |
| 3   | `packages/ui/src/components/dialog/dialog.styles.ts`   | Create | Style constants for overlay, content, header, footer, title, description, and close button |
| 4   | `packages/ui/src/components/dialog/dialog.tsx`         | Create | Implementation of 10 named exports wrapping `@radix-ui/react-dialog` primitives            |
| 5   | `packages/ui/src/components/dialog/dialog.test.tsx`    | Create | Vitest + Testing Library + vitest-axe tests                                                |
| 6   | `packages/ui/src/components/dialog/dialog.stories.tsx` | Create | Storybook CSF3 stories with autodocs                                                       |
| 7   | `packages/ui/src/index.ts`                             | Modify | Add exports for all Dialog sub-components and types                                        |

## 2. Dependencies

### Pre-existing (already installed)

- `@radix-ui/react-slot` — already in `packages/ui/package.json`
- `class-variance-authority` — already in `packages/ui/package.json`
- `@components/utils` — `cn()` helper
- `tailwindcss-animate` — already installed and configured in `globals.css` (Task t00 completed)
- `@testing-library/react`, `@testing-library/user-event`, `vitest`, `vitest-axe` — dev dependencies already installed

### To install

- `@radix-ui/react-dialog` — add to `dependencies` in `packages/ui/package.json`

Run `pnpm install` after modifying `package.json` to install the new dependency.

## 3. Implementation Details

### 3.1 `dialog.types.ts`

**Purpose**: Define TypeScript prop types for all 10 Dialog sub-components.

**Exports** (all type-only):

```ts
import * as DialogPrimitive from '@radix-ui/react-dialog';

export type DialogProps = React.ComponentProps<typeof DialogPrimitive.Root>;
export type DialogTriggerProps = React.ComponentProps<typeof DialogPrimitive.Trigger>;
export type DialogPortalProps = React.ComponentProps<typeof DialogPrimitive.Portal>;
export type DialogOverlayProps = React.ComponentProps<typeof DialogPrimitive.Overlay>;
export type DialogContentProps = React.ComponentProps<typeof DialogPrimitive.Content>;
export type DialogHeaderProps = React.ComponentProps<'div'>;
export type DialogFooterProps = React.ComponentProps<'div'>;
export type DialogTitleProps = React.ComponentProps<typeof DialogPrimitive.Title>;
export type DialogDescriptionProps = React.ComponentProps<typeof DialogPrimitive.Description>;
export type DialogCloseProps = React.ComponentProps<typeof DialogPrimitive.Close>;
```

**Key notes**:

- `DialogHeaderProps` and `DialogFooterProps` extend `React.ComponentProps<'div'>` because they render plain `<div>` elements
- All Radix-based types use `React.ComponentProps<typeof DialogPrimitive.X>` to include `ref` in React 19
- `DialogPortalProps` is a direct alias — no additional props

### 3.2 `dialog.styles.ts`

**Purpose**: Export string constants containing Tailwind utility classes for each sub-component. No CVA — Dialog has no variant props. No styles from this file are exported from `packages/ui/src/index.ts` — style constants are internal to the component (unlike `buttonVariants` or `alertVariants`, which are CVA functions consumers may need to compose variants; Dialog has no CVA definitions, so there is nothing for consumers to import from styles).

**Exports**:

```ts
export const dialogOverlayStyles: string;
export const dialogContentStyles: string;
export const dialogCloseButtonStyles: string;
export const dialogHeaderStyles: string;
export const dialogFooterStyles: string;
export const dialogTitleStyles: string;
export const dialogDescriptionStyles: string;
```

**Values** (matching phase spec DD-3, DD-4, DD-10):

| Export                    | Value                                                                                                                                                                                                                                                                                                                                           |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dialogOverlayStyles`     | `'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'`                                                                                                                                                                                      |
| `dialogContentStyles`     | `'fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg'` |
| `dialogCloseButtonStyles` | `'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'`                                                               |
| `dialogHeaderStyles`      | `'flex flex-col space-y-1.5 text-center sm:text-left'`                                                                                                                                                                                                                                                                                          |
| `dialogFooterStyles`      | `'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2'`                                                                                                                                                                                                                                                                               |
| `dialogTitleStyles`       | `'text-lg font-semibold leading-none tracking-tight'`                                                                                                                                                                                                                                                                                           |
| `dialogDescriptionStyles` | `'text-sm text-muted-foreground'`                                                                                                                                                                                                                                                                                                               |

### 3.3 `dialog.tsx`

**Purpose**: Implement 10 named exports wrapping `@radix-ui/react-dialog` primitives.

**Imports**:

- `import * as DialogPrimitive from '@radix-ui/react-dialog'`
- `import { cn } from '../../lib/utils.js'`
- All style constants from `./dialog.styles.js`
- All type imports from `./dialog.types.js`

**`cn()` usage rule**: `cn()` is used only when merging a base style constant with a user-provided `className` (e.g., `cn(dialogOverlayStyles, className)`). When a sub-component has no base styles — only a `data-slot` attribute — `className` is passed through directly without `cn()`, since there is nothing to merge.

**Exports**:

1. **`Dialog`** — Direct re-assignment of `DialogPrimitive.Root`. Context provider only, no DOM output, no `data-slot`. Implementation: `const Dialog = DialogPrimitive.Root;`

2. **`DialogPortal`** — Direct re-assignment of `DialogPrimitive.Portal`. Pure pass-through, no DOM output, no `data-slot`. Implementation: `const DialogPortal = DialogPrimitive.Portal;`

3. **`DialogTrigger`** — Thin function component wrapping `DialogPrimitive.Trigger`. Adds `data-slot="dialog-trigger"`. Passes `className` through directly (no `cn()` — no base styles to merge):

   ```tsx
   function DialogTrigger({ className, ref, ...props }: DialogTriggerProps) {
     return (
       <DialogPrimitive.Trigger
         data-slot="dialog-trigger"
         className={className}
         ref={ref}
         {...props}
       />
     );
   }
   ```

4. **`DialogClose`** — Thin function component wrapping `DialogPrimitive.Close`. Adds `data-slot="dialog-close"`. Passes `className` through directly (no `cn()` — no base styles to merge):

   ```tsx
   function DialogClose({ className, ref, ...props }: DialogCloseProps) {
     return (
       <DialogPrimitive.Close data-slot="dialog-close" className={className} ref={ref} {...props} />
     );
   }
   ```

5. **`DialogOverlay`** — Function component wrapping `DialogPrimitive.Overlay`. Has base styles, uses `cn()`:

   ```tsx
   function DialogOverlay({ className, ref, ...props }: DialogOverlayProps) {
     return (
       <DialogPrimitive.Overlay
         data-slot="dialog-overlay"
         className={cn(dialogOverlayStyles, className)}
         ref={ref}
         {...props}
       />
     );
   }
   ```

6. **`DialogContent`** — Function component wrapping `DialogPrimitive.Content`, rendered inside `DialogPortal` + `DialogOverlay`. Has base styles, uses `cn()`. Includes default close button with inline SVG X icon and sr-only "Close" label:

   ```tsx
   function DialogContent({ className, children, ref, ...props }: DialogContentProps) {
     return (
       <DialogPortal>
         <DialogOverlay />
         <DialogPrimitive.Content
           data-slot="dialog-content"
           className={cn(dialogContentStyles, className)}
           ref={ref}
           {...props}
         >
           {children}
           <DialogPrimitive.Close className={dialogCloseButtonStyles}>
             <svg
               xmlns="http://www.w3.org/2000/svg"
               width="15"
               height="15"
               viewBox="0 0 15 15"
               fill="none"
               stroke="currentColor"
               strokeWidth="1.5"
               strokeLinecap="round"
               strokeLinejoin="round"
             >
               <path d="M11.25 3.75 3.75 11.25" />
               <path d="M3.75 3.75l7.5 7.5" />
             </svg>
             <span className="sr-only">Close</span>
           </DialogPrimitive.Close>
         </DialogPrimitive.Content>
       </DialogPortal>
     );
   }
   ```

7. **`DialogHeader`** — Plain `<div>` function component. Has base styles, uses `cn()`:

   ```tsx
   function DialogHeader({ className, ref, ...props }: DialogHeaderProps) {
     return (
       <div
         data-slot="dialog-header"
         className={cn(dialogHeaderStyles, className)}
         ref={ref}
         {...props}
       />
     );
   }
   ```

8. **`DialogFooter`** — Plain `<div>` function component, same pattern as `DialogHeader` with `data-slot="dialog-footer"` and `dialogFooterStyles`. Uses `cn()`.

9. **`DialogTitle`** — Function component wrapping `DialogPrimitive.Title` with `data-slot="dialog-title"` and `cn(dialogTitleStyles, className)`. Uses `cn()`.

10. **`DialogDescription`** — Function component wrapping `DialogPrimitive.Description` with `data-slot="dialog-description"` and `cn(dialogDescriptionStyles, className)`. Uses `cn()`.

**Re-exports**: All 10 types are re-exported: `export type { DialogProps, DialogTriggerProps, ... } from './dialog.types.js';`

**Return type**: `React.JSX.Element` on all function components, matching the Button/Card reference pattern.

### 3.4 `dialog.test.tsx`

**Purpose**: Full test coverage for the Dialog component.

**Imports**:

- `render`, `screen` from `@testing-library/react`
- `userEvent` from `@testing-library/user-event`
- `axe` from `vitest-axe`
- `describe`, `expect`, `it`, `vi` from `vitest`
- All Dialog exports from `./dialog.js`

**Test helper**: A reusable `TestDialog` wrapper with explicitly typed props (no `Record<string, unknown>`):

```tsx
function TestDialog({
  open,
  onOpenChange,
  contentClassName,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  contentClassName?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger>Open Dialog</DialogTrigger>
      <DialogContent className={contentClassName}>
        <DialogHeader>
          <DialogTitle>Test Title</DialogTitle>
          <DialogDescription>Test Description</DialogDescription>
        </DialogHeader>
        <div>Dialog body</div>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

**Test cases** (within `describe('Dialog', () => { ... })`):

| #   | Test name                            | What it verifies                                                                                                               |
| --- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `renders trigger button`             | Smoke render — `DialogTrigger` renders a button with text "Open Dialog"                                                        |
| 2   | `opens on trigger click`             | Click trigger → dialog content appears with title "Test Title"                                                                 |
| 3   | `closes on ESC`                      | Open dialog → press Escape → content disappears                                                                                |
| 4   | `closes on overlay click`            | Open dialog → click overlay → content disappears                                                                               |
| 5   | `close button (X) dismisses dialog`  | Open dialog → click the close button (sr-only "Close") → content disappears                                                    |
| 6   | `data-slot on dialog-trigger`        | Render → `data-slot="dialog-trigger"` present on trigger element                                                               |
| 7   | `data-slot on dialog-close`          | Open dialog → `data-slot="dialog-close"` present on the `DialogClose` element in footer                                        |
| 8   | `data-slot on dialog-content`        | Open dialog → `data-slot="dialog-content"` present on content element                                                          |
| 9   | `data-slot on dialog-overlay`        | Open dialog → `data-slot="dialog-overlay"` present on overlay element                                                          |
| 10  | `data-slot on dialog-header`         | Open dialog → `data-slot="dialog-header"` present                                                                              |
| 11  | `data-slot on dialog-footer`         | Open dialog → `data-slot="dialog-footer"` present                                                                              |
| 12  | `data-slot on dialog-title`          | Open dialog → `data-slot="dialog-title"` present                                                                               |
| 13  | `data-slot on dialog-description`    | Open dialog → `data-slot="dialog-description"` present                                                                         |
| 14  | `controlled mode`                    | Render with `open={true}` and `onOpenChange` spy → content visible immediately. Press ESC → `onOpenChange` called with `false` |
| 15  | `merges custom className on content` | Render open dialog with `contentClassName="custom-class"` → content element has `custom-class`                                 |
| 16  | `has no accessibility violations`    | Render open dialog → `const results = await axe(container)` → `expect(results).toHaveNoViolations()`                           |

**Key testing notes**:

- Radix Dialog renders content in a portal. Use `screen.getByRole('dialog')` to find the dialog content when open.
- Overlay click: target the overlay element via `document.querySelector('[data-slot="dialog-overlay"]')` and use `userEvent.click`.
- Close button (X): use `screen.getByRole('button', { name: 'Close' })` to find the sr-only labeled close button.
- `DialogClose` in footer: use `document.querySelector('[data-slot="dialog-close"]')` to find the footer close button for the data-slot test.
- `DialogTrigger` data-slot: available before opening — use `document.querySelector('[data-slot="dialog-trigger"]')`.
- For `axe` tests, render the dialog in an open (controlled) state so the dialog content is in the DOM.
- Use `waitFor` or check `queryByRole('dialog')` to verify the dialog has closed after dismiss actions.

### 3.5 `dialog.stories.tsx`

**Purpose**: Storybook CSF3 stories with autodocs covering all Dialog usage patterns.

**Meta configuration**: Since Dialog is a compound component with no single root element that accepts all props (unlike Button or Card where `Meta<typeof Button>` / `Meta<typeof Card>` works), the meta uses `Meta<typeof Dialog>` with `component: Dialog`. The `Dialog` root is a context provider (wrapping `DialogPrimitive.Root`), so Storybook's autodocs will extract its `open`/`onOpenChange` props. `type Story = StoryObj<typeof meta>` derives story types from the meta object rather than a component directly, ensuring proper type inference for the `render` function.

```ts
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from './dialog.js';
import { Button } from '../button/button.js';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;
```

**Stories** (all use `render` functions that compose the Dialog sub-components):

1. **`Default`** — Trigger button opens a dialog with title, description, and X close button. No additional footer actions.

2. **`WithForm`** — Dialog containing a form with labeled input fields and Submit/Cancel buttons in `DialogFooter`. Cancel uses `DialogClose asChild` wrapping a `Button variant="outline"`. Submit is a plain `Button`.

3. **`Controlled`** — Uses React `useState` to control `open` state externally. Renders an external "Open" button and the `open`/`onOpenChange` props. Also shows an external "Close" button that sets state to false.

4. **`LongContent`** — Dialog with a large amount of text content to demonstrate scrollable behavior. The content overflows the viewport height.

5. **`CustomClose`** — Uses `DialogClose` with `asChild` wrapping a custom `Button` to demonstrate polymorphic close behavior.

### 3.6 `index.ts` modifications

Add the following block after the existing Alert exports (following the same pattern used by Card — all sub-components and types from the `.tsx` file, no styles export since Dialog has no CVA definitions):

```ts
export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  type DialogProps,
  type DialogTriggerProps,
  type DialogPortalProps,
  type DialogOverlayProps,
  type DialogContentProps,
  type DialogHeaderProps,
  type DialogFooterProps,
  type DialogTitleProps,
  type DialogDescriptionProps,
  type DialogCloseProps,
} from './components/dialog/dialog.js';
```

No styles export line is needed. The existing `index.ts` pattern exports CVA variant functions from `.styles.js` files (e.g., `buttonVariants`, `alertVariants`) for components where consumers need to compose or reference variants. Dialog has no CVA definitions — its style constants are internal implementation details, not a public API.

## 4. API Contracts

### Component API

**Dialog** (Root — context provider):

```tsx
<Dialog open?: boolean onOpenChange?: (open: boolean) => void>
  {children}
</Dialog>
```

**DialogTrigger**:

```tsx
<DialogTrigger asChild?: boolean>
  {children}  // Button or custom element (when asChild)
</DialogTrigger>
```

**DialogContent**:

```tsx
<DialogContent className?: string ref?: React.Ref<HTMLDivElement>>
  {children}  // Automatically includes overlay + portal + close button (X)
</DialogContent>
```

**DialogHeader / DialogFooter**:

```tsx
<DialogHeader className?: string>{children}</DialogHeader>
<DialogFooter className?: string>{children}</DialogFooter>
```

**DialogTitle / DialogDescription**:

```tsx
<DialogTitle className?: string>{children}</DialogTitle>
<DialogDescription className?: string>{children}</DialogDescription>
```

**DialogClose**:

```tsx
<DialogClose asChild?: boolean>{children}</DialogClose>
```

### Usage Example

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@components/ui';

function Example() {
  return (
    <Dialog>
      <DialogTrigger>Edit Profile</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Make changes to your profile here.</DialogDescription>
        </DialogHeader>
        <div>Form content here...</div>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <button>Save Changes</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

## 5. Test Plan

### Test Setup

- **Runner**: Vitest with jsdom environment (configured in `packages/ui/vitest.config.ts`)
- **Setup file**: `src/test-setup.ts` (already configures `@testing-library/jest-dom/vitest` matchers and `vitest-axe/matchers`)
- **User events**: `@testing-library/user-event` with `userEvent.setup()` for realistic interaction simulation

### Test Specifications

**File**: `packages/ui/src/components/dialog/dialog.test.tsx`

| #   | Test Name                            | Type        | Implementation                                                                                                                                |
| --- | ------------------------------------ | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `renders trigger button`             | Smoke       | `render(<TestDialog />)` → `expect(screen.getByRole('button', { name: 'Open Dialog' })).toBeInTheDocument()`                                  |
| 2   | `opens on trigger click`             | Interaction | Click trigger → `expect(screen.getByRole('dialog')).toBeInTheDocument()` → verify title text present                                          |
| 3   | `closes on ESC`                      | Interaction | Open dialog → `user.keyboard('{Escape}')` → `expect(screen.queryByRole('dialog')).not.toBeInTheDocument()`                                    |
| 4   | `closes on overlay click`            | Interaction | Open dialog → find overlay via `document.querySelector('[data-slot="dialog-overlay"]')` → `user.click(overlay)` → dialog gone                 |
| 5   | `close button (X) dismisses dialog`  | Interaction | Open dialog → `user.click(screen.getByRole('button', { name: 'Close' }))` → dialog gone                                                       |
| 6   | `data-slot on dialog-trigger`        | DOM         | `render(<TestDialog />)` → `expect(document.querySelector('[data-slot="dialog-trigger"]')).toBeInTheDocument()`                               |
| 7   | `data-slot on dialog-close`          | DOM         | Open dialog → `expect(document.querySelector('[data-slot="dialog-close"]')).toBeInTheDocument()` (finds the `DialogClose` rendered in footer) |
| 8   | `data-slot on dialog-content`        | DOM         | Open dialog → `expect(document.querySelector('[data-slot="dialog-content"]')).toBeInTheDocument()`                                            |
| 9   | `data-slot on dialog-overlay`        | DOM         | Open dialog → `expect(document.querySelector('[data-slot="dialog-overlay"]')).toBeInTheDocument()`                                            |
| 10  | `data-slot on dialog-header`         | DOM         | Open dialog → `expect(document.querySelector('[data-slot="dialog-header"]')).toBeInTheDocument()`                                             |
| 11  | `data-slot on dialog-footer`         | DOM         | Open dialog → `expect(document.querySelector('[data-slot="dialog-footer"]')).toBeInTheDocument()`                                             |
| 12  | `data-slot on dialog-title`          | DOM         | Open dialog → `expect(document.querySelector('[data-slot="dialog-title"]')).toBeInTheDocument()`                                              |
| 13  | `data-slot on dialog-description`    | DOM         | Open dialog → `expect(document.querySelector('[data-slot="dialog-description"]')).toBeInTheDocument()`                                        |
| 14  | `controlled mode`                    | State       | Render with `open={true}` → dialog visible immediately. Press ESC → `onOpenChange` spy called with `false`                                    |
| 15  | `merges custom className on content` | Styling     | Render open dialog with `contentClassName="custom-class"` → content element has `custom-class`                                                |
| 16  | `has no accessibility violations`    | A11y        | Render open dialog → `const results = await axe(container)` → `expect(results).toHaveNoViolations()`                                          |

## 6. Implementation Order

1. **Install `@radix-ui/react-dialog`** — Add to `packages/ui/package.json` dependencies, run `pnpm install`
2. **Create `dialog.types.ts`** — Define all 10 prop types
3. **Create `dialog.styles.ts`** — Define all 7 style constants
4. **Create `dialog.tsx`** — Implement all 10 named exports and type re-exports
5. **Create `dialog.test.tsx`** — Implement all 16 test cases
6. **Create `dialog.stories.tsx`** — Implement all 5 stories
7. **Modify `packages/ui/src/index.ts`** — Add Dialog exports
8. **Run verification commands** — Tests, typecheck, lint

## 7. Verification Commands

```bash
# Install new dependency
pnpm install

# Run Dialog tests only
pnpm --filter @components/ui test -- --grep "Dialog"

# Run all tests
pnpm test

# TypeScript type checking
pnpm typecheck

# ESLint
pnpm lint

# Build to verify no compilation errors
pnpm build
```

## 8. Design Deviations

**Deviation 1: `DialogTrigger` and `DialogClose` as function components instead of direct re-assignments**

- **Parent spec states**: `DialogTrigger` applies `data-slot="dialog-trigger"` and `DialogClose` applies `data-slot="dialog-close"`
- **Issue**: If these were implemented as direct re-assignments (`const DialogTrigger = DialogPrimitive.Trigger`), there would be no way to apply the `data-slot` attribute by default
- **Chosen approach**: Implement `DialogTrigger` and `DialogClose` as thin function components that wrap the Radix primitives and pass through `data-slot`, `ref`, and all other props. This is consistent with how `DialogOverlay`, `DialogTitle`, and `DialogDescription` are implemented
- **Impact**: No API change — consumers use them identically. The `data-slot` attribute is applied automatically per project conventions

**Deviation 2: `Dialog` and `DialogPortal` as direct re-assignments**

- **Parent spec states**: These have no `data-slot` and no additional props/behavior
- **Chosen approach**: Implemented as `const Dialog = DialogPrimitive.Root` and `const DialogPortal = DialogPrimitive.Portal` rather than wrapper functions, since they render no DOM elements and need no `data-slot` or className merging. This avoids unnecessary function indirection while maintaining full API compatibility

**Deviation 3: Stories Meta uses `typeof Dialog` (context provider) instead of a leaf component**

- **Button reference uses**: `Meta<typeof Button>` with `component: Button` — works because Button is a single root component
- **Dialog difference**: Dialog is a compound component where the root (`Dialog`) is a context provider wrapping `DialogPrimitive.Root`, not a visual element. There is no single leaf component whose props represent the full Dialog API
- **Chosen approach**: `Meta<typeof Dialog>` with `component: Dialog`, and `type Story = StoryObj<typeof meta>`. The `typeof meta` derivation ensures stories are typed against the meta definition. All stories use `render` functions that compose sub-components (same pattern as Card stories), since Dialog's behavior cannot be demonstrated through `args` alone
