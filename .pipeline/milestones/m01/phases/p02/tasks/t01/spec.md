# Task 1: Dialog

## Objective

Implement the Dialog compound component as a shadcn/ui port wrapping `@radix-ui/react-dialog`, with portal rendering, focus trapping, backdrop overlay, ESC-to-close, and open/close animations. The component follows the canonical 5-file pattern.

## Deliverables

1. Install `@radix-ui/react-dialog` as a dependency in `packages/ui/package.json`
2. Create `packages/ui/src/components/dialog/` directory with 5 files
3. Export all sub-components and their prop types from `packages/ui/src/index.ts`

## Files to Create

### `packages/ui/src/components/dialog/dialog.tsx`

Ten named exports wrapping `@radix-ui/react-dialog` primitives:

- **`Dialog`** — wraps `DialogPrimitive.Root`. Controlled via `open`/`onOpenChange` props. Context provider only, no DOM output, no `data-slot`.
- **`DialogTrigger`** — wraps `DialogPrimitive.Trigger`. `data-slot="dialog-trigger"`. Supports `asChild`.
- **`DialogPortal`** — wraps `DialogPrimitive.Portal`. Pure pass-through, no additional props or `data-slot`. Exists for API parity with shadcn/ui.
- **`DialogOverlay`** — wraps `DialogPrimitive.Overlay`. `data-slot="dialog-overlay"`. Classes: `fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0`.
- **`DialogContent`** — wraps `DialogPrimitive.Content`. Renders inside `DialogPortal` + `DialogOverlay`. `data-slot="dialog-content"`. Classes: `fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg`. Includes a `DialogPrimitive.Close` button in the top-right corner with inline SVG X icon (15x15px, 1.5px stroke, `currentColor`). Close button classes: `absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground`. Includes `<span className="sr-only">Close</span>`.
- **`DialogHeader`** — plain `<div>` with `data-slot="dialog-header"`. Classes: `flex flex-col space-y-1.5 text-center sm:text-left`.
- **`DialogFooter`** — plain `<div>` with `data-slot="dialog-footer"`. Classes: `flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2`.
- **`DialogTitle`** — wraps `DialogPrimitive.Title`. `data-slot="dialog-title"`. Classes: `text-lg font-semibold leading-none tracking-tight`.
- **`DialogDescription`** — wraps `DialogPrimitive.Description`. `data-slot="dialog-description"`. Classes: `text-sm text-muted-foreground`.
- **`DialogClose`** — wraps `DialogPrimitive.Close`. `data-slot="dialog-close"`. Supports `asChild`.

### `packages/ui/src/components/dialog/dialog.styles.ts`

Style constants for each sub-component (overlay, content, header, footer, title, description, close button). No CVA variants — Dialog has no variant prop.

### `packages/ui/src/components/dialog/dialog.types.ts`

Props types for each sub-component: `DialogProps`, `DialogTriggerProps`, `DialogPortalProps` (alias for `React.ComponentProps<typeof DialogPrimitive.Portal>`), `DialogOverlayProps`, `DialogContentProps`, `DialogHeaderProps` (extends `React.ComponentProps<'div'>`), `DialogFooterProps` (extends `React.ComponentProps<'div'>`), `DialogTitleProps`, `DialogDescriptionProps`, `DialogCloseProps`.

### `packages/ui/src/components/dialog/dialog.test.tsx`

Tests: smoke render (trigger + content), opens on trigger click, closes on ESC, closes on overlay click, close button (X) dismisses dialog, `data-slot` on content/overlay/header/footer/title/description, focus trap (focus stays inside dialog when tabbing), `aria-describedby` and `aria-labelledby` linking, controlled mode (`open`/`onOpenChange`), custom className on each sub-component, accessibility (axe).

### `packages/ui/src/components/dialog/dialog.stories.tsx`

Stories (CSF3 with `tags: ['autodocs']`): `Default` (trigger button + dialog with title, description, and close button), `WithForm` (dialog containing form inputs and submit/cancel buttons in footer), `Controlled` (externally controlled open state), `LongContent` (scrollable dialog content), `CustomClose` (custom close button using `DialogClose` with `asChild`).

## Files to Modify

- `packages/ui/package.json` — add `@radix-ui/react-dialog` to dependencies
- `packages/ui/src/index.ts` — add exports for all Dialog sub-components and types

## Key Implementation Details

- React 19 ref-as-prop — do not use `forwardRef`
- Use `cn()` helper from `../../lib/utils.js` for className merging
- Named exports only, no default exports
- Use `import type` for type-only imports
- The inline SVG X icon is 15x15px with 1.5px stroke width (see DD-10 in phase spec)
- `DialogPortal` is a pure pass-through — no additional logic or styling
- Animations use `tailwindcss-animate` utility classes configured in Task 0

## Dependencies

- **Task 0** (Animation Infrastructure Setup) — must be completed first for animation classes
- Pre-existing: Button reference component (for pattern reference), `cn()` helper, `globals.css` tokens

## Verification Criteria

1. All 5 files exist in `packages/ui/src/components/dialog/`
2. `pnpm test` passes for dialog tests including vitest-axe assertions
3. `pnpm typecheck` passes with no errors
4. Dialog opens on trigger click, traps focus, closes on ESC, closes on backdrop click, closes via X button
5. Open/close animations render (fade + scale) using `tailwindcss-animate` classes
6. All sub-components apply correct `data-slot` attributes
7. All exports are present in `packages/ui/src/index.ts`
8. Stories render correctly in Storybook with autodocs
