# Task 2: Alert Dialog

## Objective

Implement the Alert Dialog compound component as a shadcn/ui port wrapping `@radix-ui/react-alert-dialog`. Structurally similar to Dialog but with critical behavioral differences: it does **not** close on backdrop click and requires an explicit Action or Cancel to dismiss, making it appropriate for destructive confirmations. Uses `buttonVariants` from the Button component for Action/Cancel styling.

## Deliverables

1. Install `@radix-ui/react-alert-dialog` as a dependency in `packages/ui/package.json`
2. Create `packages/ui/src/components/alert-dialog/` directory with 5 files
3. Export all sub-components and their prop types from `packages/ui/src/index.ts`

## Files to Create

### `packages/ui/src/components/alert-dialog/alert-dialog.tsx`

Eleven named exports wrapping `@radix-ui/react-alert-dialog` primitives:

- **`AlertDialog`** — wraps `AlertDialogPrimitive.Root`. Context provider, no DOM output, no `data-slot`.
- **`AlertDialogTrigger`** — wraps `AlertDialogPrimitive.Trigger`. `data-slot="alert-dialog-trigger"`. Supports `asChild`.
- **`AlertDialogPortal`** — wraps `AlertDialogPrimitive.Portal`. Pure pass-through, no additional props or `data-slot`.
- **`AlertDialogOverlay`** — wraps `AlertDialogPrimitive.Overlay`. `data-slot="alert-dialog-overlay"`. Same styling as `DialogOverlay`.
- **`AlertDialogContent`** — wraps `AlertDialogPrimitive.Content`. Renders inside `AlertDialogPortal` + `AlertDialogOverlay`. `data-slot="alert-dialog-content"`. Same centering and animation as `DialogContent` but **no** default close button (X) — dismiss requires explicit Action or Cancel.
- **`AlertDialogHeader`** — plain `<div>` with `data-slot="alert-dialog-header"`. Same styling as `DialogHeader`.
- **`AlertDialogFooter`** — plain `<div>` with `data-slot="alert-dialog-footer"`. Same styling as `DialogFooter`.
- **`AlertDialogTitle`** — wraps `AlertDialogPrimitive.Title`. `data-slot="alert-dialog-title"`.
- **`AlertDialogDescription`** — wraps `AlertDialogPrimitive.Description`. `data-slot="alert-dialog-description"`.
- **`AlertDialogAction`** — wraps `AlertDialogPrimitive.Action`. `data-slot="alert-dialog-action"`. Supports `asChild`. Styled with `buttonVariants()` (default variant) imported from `'../button/button.styles.js'`.
- **`AlertDialogCancel`** — wraps `AlertDialogPrimitive.Cancel`. `data-slot="alert-dialog-cancel"`. Supports `asChild`. Styled with `buttonVariants({ variant: "outline" })` imported from `'../button/button.styles.js'`, plus `mt-2 sm:mt-0`.

### `packages/ui/src/components/alert-dialog/alert-dialog.styles.ts`

Style constants for each sub-component. Shares most styling with Dialog. Action and Cancel styles reference `buttonVariants` from `'../button/button.styles.js'`.

### `packages/ui/src/components/alert-dialog/alert-dialog.types.ts`

Props types for each sub-component following the same pattern as Dialog but using `AlertDialogPrimitive` types. Includes `AlertDialogPortalProps` (alias for `React.ComponentProps<typeof AlertDialogPrimitive.Portal>`), `AlertDialogActionProps`, and `AlertDialogCancelProps`.

### `packages/ui/src/components/alert-dialog/alert-dialog.test.tsx`

Tests: smoke render, opens on trigger click, does **not** close on overlay click (critical behavioral difference from Dialog), closes on Cancel click, Action triggers `onOpenChange(false)`, ESC closes the dialog, focus trap, `aria-describedby` and `aria-labelledby` linking, `data-slot` on each sub-component, controlled mode, custom className on each sub-component, Action and Cancel render with correct button styling, accessibility (axe).

### `packages/ui/src/components/alert-dialog/alert-dialog.stories.tsx`

Stories (CSF3 with `tags: ['autodocs']`): `Default` (confirmation dialog with "Are you sure?" pattern), `Destructive` (delete confirmation with destructive action button), `Controlled` (externally controlled), `WithDescription` (detailed description text).

## Files to Modify

- `packages/ui/package.json` — add `@radix-ui/react-alert-dialog` to dependencies
- `packages/ui/src/index.ts` — add exports for all Alert Dialog sub-components and types

## Key Implementation Details

- **Critical difference from Dialog**: Alert Dialog does NOT close on backdrop click and has NO close button (X). Dismiss requires explicit Action or Cancel.
- `AlertDialogAction` imports `buttonVariants` from `'../button/button.styles.js'` — uses default variant
- `AlertDialogCancel` imports `buttonVariants` from `'../button/button.styles.js'` — uses `{ variant: "outline" }` plus `mt-2 sm:mt-0`
- Shares animation classes with Dialog (`tailwindcss-animate`)
- React 19 ref-as-prop — do not use `forwardRef`
- Use `cn()` helper from `../../lib/utils.js`
- Named exports only, no default exports
- Use `import type` for type-only imports
- `AlertDialogPortal` is a pure pass-through

## Dependencies

- **Task 0** (Animation Infrastructure Setup) — animation classes must be available
- **Task 1** (Dialog) — not a code dependency, but establishes the overlay compound component pattern that Alert Dialog mirrors. Shares styling patterns.
- Pre-existing: Button component (`buttonVariants` import), `cn()` helper, `globals.css` tokens

## Verification Criteria

1. All 5 files exist in `packages/ui/src/components/alert-dialog/`
2. `pnpm test` passes for alert-dialog tests including vitest-axe assertions
3. `pnpm typecheck` passes with no errors
4. Alert Dialog opens on trigger click, traps focus, closes on ESC
5. Alert Dialog does **not** close on backdrop click (critical test)
6. Action and Cancel buttons render with correct button variant styling
7. All sub-components apply correct `data-slot` attributes
8. All exports are present in `packages/ui/src/index.ts`
9. Stories render correctly in Storybook with autodocs
