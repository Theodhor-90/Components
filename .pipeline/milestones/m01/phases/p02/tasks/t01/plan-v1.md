Now I have all the context I need. Let me produce the implementation plan.

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

**Purpose**: Export string constants containing Tailwind utility classes for each sub-component. No CVA — Dialog has no variant props.

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

**Exports**:

1. **`Dialog`** — Direct re-assignment of `DialogPrimitive.Root`. Context provider only, no DOM output, no `data-slot`. Implementation: `const Dialog = DialogPrimitive.Root;`

2. **`DialogTrigger`** — Direct re-assignment of `DialogPrimitive.Trigger`. Implementation: `const DialogTrigger = DialogPrimitive.Trigger;`

3. **`DialogPortal`** — Direct re-assignment of `DialogPrimitive.Portal`. Pure pass-through. Implementation: `const DialogPortal = DialogPrimitive.Portal;`

4. **`DialogClose`** — Direct re-assignment of `DialogPrimitive.Close`. Implementation: `const DialogClose = DialogPrimitive.Close;`

5. **`DialogOverlay`** — Function component wrapping `DialogPrimitive.Overlay`:

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

6. **`DialogContent`** — Function component wrapping `DialogPrimitive.Content`, rendered inside `DialogPortal` + `DialogOverlay`. Includes default close button with inline SVG X icon and sr-only "Close" label:

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

7. **`DialogHeader`** — Plain `<div>` function component:

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

8. **`DialogFooter`** — Plain `<div>` function component, same pattern as `DialogHeader` with `data-slot="dialog-footer"` and `dialogFooterStyles`.

9. **`DialogTitle`** — Function component wrapping `DialogPrimitive.Title` with `data-slot="dialog-title"` and `dialogTitleStyles`.

10. **`DialogDescription`** — Function component wrapping `DialogPrimitive.Description` with `data-slot="dialog-description"` and `dialogDescriptionStyles`.

**Re-exports**: All 10 types are re-exported: `export type { DialogProps, DialogTriggerProps, ... } from './dialog.types.js';`

**Key implementation notes**:

- `Dialog`, `DialogTrigger`, `DialogPortal`, `DialogClose` are direct re-assignments (`const X = DialogPrimitive.X;`) since they need no className merging or `data-slot` (except DialogClose which gets `data-slot` — see below).
- Actually, per the task spec, `DialogTrigger` should have `data-slot="dialog-trigger"` and `DialogClose` should have `data-slot="dialog-close"`. These must be function components that wrap the primitives and add the `data-slot`. However, `Dialog` and `DialogPortal` have no `data-slot` and can be direct re-assignments.
- Return type annotation: `React.JSX.Element` on function components (following Button pattern).

**Corrected approach for DialogTrigger and DialogClose**:

```tsx
function DialogTrigger({ className, ref, ...props }: DialogTriggerProps) {
  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-trigger"
      ref={ref}
      className={className}
      {...props}
    />
  );
}

function DialogClose({ className, ref, ...props }: DialogCloseProps) {
  return (
    <DialogPrimitive.Close data-slot="dialog-close" ref={ref} className={className} {...props} />
  );
}
```

For `Dialog` and `DialogPortal` (no `data-slot`, no styling):

```ts
const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
```

### 3.4 `dialog.test.tsx`

**Purpose**: Full test coverage for the Dialog component.

**Imports**:

- `render`, `screen`, `within` from `@testing-library/react`
- `userEvent` from `@testing-library/user-event`
- `axe` from `vitest-axe`
- `describe`, `expect`, `it`, `vi` from `vitest`
- All Dialog exports from `./dialog.js`

**Test helper**: A reusable `TestDialog` wrapper:

```tsx
function TestDialog({
  open,
  onOpenChange,
  ...contentProps
}: { open?: boolean; onOpenChange?: (open: boolean) => void } & Record<string, unknown>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger>Open Dialog</DialogTrigger>
      <DialogContent {...contentProps}>
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

| #   | Test name                            | What it verifies                                                                                              |
| --- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| 1   | `renders trigger button`             | Smoke render — `DialogTrigger` renders a button with text "Open Dialog"                                       |
| 2   | `opens on trigger click`             | Click trigger → dialog content appears with title "Test Title"                                                |
| 3   | `closes on ESC`                      | Open dialog → press Escape → content disappears                                                               |
| 4   | `closes on overlay click`            | Open dialog → click overlay → content disappears                                                              |
| 5   | `close button (X) dismisses dialog`  | Open dialog → click the close button (sr-only "Close") → content disappears                                   |
| 6   | `data-slot on dialog-content`        | Open dialog → `data-slot="dialog-content"` present on content element                                         |
| 7   | `data-slot on dialog-overlay`        | Open dialog → `data-slot="dialog-overlay"` present on overlay element                                         |
| 8   | `data-slot on dialog-header`         | Open dialog → `data-slot="dialog-header"` present                                                             |
| 9   | `data-slot on dialog-footer`         | Open dialog → `data-slot="dialog-footer"` present                                                             |
| 10  | `data-slot on dialog-title`          | Open dialog → `data-slot="dialog-title"` present                                                              |
| 11  | `data-slot on dialog-description`    | Open dialog → `data-slot="dialog-description"` present                                                        |
| 12  | `controlled mode`                    | Render with `open={true}` and `onOpenChange` spy → content visible → ESC → `onOpenChange` called with `false` |
| 13  | `merges custom className on content` | Pass `className="custom-class"` to `DialogContent` → class is present on the content element                  |
| 14  | `has no accessibility violations`    | Render open dialog → `axe(container)` → no violations                                                         |

**Key testing notes**:

- Radix Dialog renders content in a portal. Use `screen.getByRole('dialog')` to find the dialog content when open.
- Overlay click: target the overlay element via `data-slot="dialog-overlay"` and use `userEvent.click`.
- Close button: use `screen.getByRole('button', { name: 'Close' })` to find the sr-only labeled close button.
- For `axe` tests, render the dialog in an open (controlled) state so the dialog content is in the DOM.
- Use `waitFor` or check `queryByRole('dialog')` to verify the dialog has closed after dismiss actions.

### 3.5 `dialog.stories.tsx`

**Purpose**: Storybook CSF3 stories with autodocs covering all Dialog usage patterns.

**Meta configuration**:

```ts
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Components/Dialog',
  tags: ['autodocs'],
};
export default meta;
```

**Stories**:

1. **`Default`** — Trigger button opens a dialog with title, description, and X close button. No additional footer actions.

2. **`WithForm`** — Dialog containing a form with labeled input fields and Submit/Cancel buttons in `DialogFooter`. Cancel uses `DialogClose asChild` wrapping a `Button variant="outline"`. Submit is a plain `Button`.

3. **`Controlled`** — Uses React `useState` to control `open` state externally. Renders an external "Open" button and the `open`/`onOpenChange` props. Also shows an external "Close" button that sets state to false.

4. **`LongContent`** — Dialog with a large amount of text content to demonstrate scrollable behavior. The content overflows the viewport height.

5. **`CustomClose`** — Uses `DialogClose` with `asChild` wrapping a custom `Button` to demonstrate polymorphic close behavior.

**Story implementation pattern**: Each story uses a `render` function that composes the Dialog sub-components. CSF3 `StoryObj` type is used without component binding since Dialog is a compound component with no single root.

### 3.6 `index.ts` modifications

Add the following block after the existing Alert exports:

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

No CVA variant export is needed — Dialog has no CVA definitions.

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

| #    | Test Name                            | Type        | Implementation                                                                                                                                                                                                   |
| ---- | ------------------------------------ | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | `renders trigger button`             | Smoke       | `render(<TestDialog />)` → `expect(screen.getByRole('button', { name: 'Open Dialog' })).toBeInTheDocument()`                                                                                                     |
| 2    | `opens on trigger click`             | Interaction | Click trigger → `expect(screen.getByRole('dialog')).toBeInTheDocument()` → verify title text present                                                                                                             |
| 3    | `closes on ESC`                      | Interaction | Open dialog → `user.keyboard('{Escape}')` → `expect(screen.queryByRole('dialog')).not.toBeInTheDocument()`                                                                                                       |
| 4    | `closes on overlay click`            | Interaction | Open dialog → find overlay via `document.querySelector('[data-slot="dialog-overlay"]')` → `user.click(overlay)` → dialog gone                                                                                    |
| 5    | `close button (X) dismisses dialog`  | Interaction | Open dialog → `user.click(screen.getByRole('button', { name: 'Close' }))` → dialog gone                                                                                                                          |
| 6-11 | `data-slot on {sub-component}`       | DOM         | Open dialog → `expect(document.querySelector('[data-slot="{value}"]')).toBeInTheDocument()` for each: `dialog-content`, `dialog-overlay`, `dialog-header`, `dialog-footer`, `dialog-title`, `dialog-description` |
| 12   | `controlled mode`                    | State       | Render with `open={true}` → dialog visible immediately. Press ESC → `onOpenChange` spy called with `false`                                                                                                       |
| 13   | `merges custom className on content` | Styling     | Render open dialog with `className="custom-class"` on `DialogContent` → content element has `custom-class`                                                                                                       |
| 14   | `has no accessibility violations`    | A11y        | Render open dialog → `const results = await axe(container)` → `expect(results).toHaveNoViolations()`                                                                                                             |

## 6. Implementation Order

1. **Install `@radix-ui/react-dialog`** — Add to `packages/ui/package.json` dependencies, run `pnpm install`
2. **Create `dialog.types.ts`** — Define all 10 prop types
3. **Create `dialog.styles.ts`** — Define all style constants
4. **Create `dialog.tsx`** — Implement all 10 named exports and type re-exports
5. **Create `dialog.test.tsx`** — Implement all 14 test cases
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
