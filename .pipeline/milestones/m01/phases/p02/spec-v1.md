Now I have all the context needed. Let me produce the Phase 2 specification.

# Phase 2: Overlay Primitives — Specification

## Goal

Implement the four overlay components — Dialog, Alert Dialog, Popover, and Sonner toast — that render floating content above the page surface using portal rendering, focus trapping, and dismiss behavior powered by Radix UI primitives and the Sonner library. Each component follows the canonical 5-file pattern, uses Tailwind v4 utility classes with OKLCH semantic tokens, and ships with full Vitest + vitest-axe test coverage and Storybook CSF3 autodocs. Upon completion, consumers can import these components from `@components/ui` to build modal confirmations, contextual popovers, and toast notifications across all five Portfolio applications.

## Design Decisions

### DD-1: Task ordering — Dialog first, Sonner last

Dialog is the foundation overlay — it introduces the Radix dialog primitive, portal rendering, focus trapping, backdrop overlay, and the compound sub-component pattern for overlays. Alert Dialog follows immediately because it shares nearly identical structure but adds `AlertDialogAction`/`AlertDialogCancel` and disables backdrop dismiss. Popover comes third as a lighter overlay without backdrop or focus trap, introducing the `side`/`align` positioning API. Sonner (toast) comes last because it wraps a third-party library (not Radix) with a different integration pattern (imperative `toast()` function rather than declarative JSX), benefiting from the overlay conventions established by the first three tasks.

### DD-2: Dialog and Alert Dialog use separate Radix packages

Although `@radix-ui/react-dialog` and `@radix-ui/react-alert-dialog` share similar APIs, they are distinct packages with different dismiss behavior semantics. Alert Dialog intentionally prevents backdrop click dismiss and requires an explicit action or cancel, making it appropriate for destructive confirmations. We install both packages separately rather than building Alert Dialog on top of Dialog, matching the shadcn/ui approach.

### DD-3: Dialog overlay uses fixed positioning with backdrop blur

The Dialog overlay (`DialogOverlay`) renders as a `fixed inset-0` element with `bg-black/80` backdrop and optional `backdrop-blur` for visual depth. It uses `data-[state=open]` and `data-[state=closed]` selectors for enter/exit animations via Tailwind's `animate-in`/`animate-out` utilities. The same pattern applies to Alert Dialog's overlay.

### DD-4: DialogContent centers with flexbox, not transforms

Following the shadcn/ui approach, `DialogContent` is positioned using `fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2` for precise viewport centering. Open/close animations use Tailwind `animate-in`/`animate-out` with `fade-in-0`/`fade-out-0` and `zoom-in-95`/`zoom-out-95` for a subtle scale transition. A close button (X icon) is rendered in the top-right corner by default.

### DD-5: Popover uses Radix's built-in positioning

Popover delegates all positioning logic to `@radix-ui/react-popover`, which uses floating-point calculations internally. `PopoverContent` exposes `side` (default `"bottom"`), `align` (default `"center"`), and `sideOffset` (default `4`) props directly from the Radix primitive. No custom positioning logic is needed.

### DD-6: Sonner integration re-exports `toast` from sonner

The Sonner component consists of a `Toaster` component that wraps Sonner's `<Toaster />` with theme-aware styling. Consumers use Sonner's `toast()` function directly — we re-export it from our module for convenience. The `Toaster` reads the current theme context and maps our OKLCH semantic tokens to Sonner's `toastOptions.style` for consistent light/dark appearance. No CVA variants are needed since Sonner handles its own variant types (success, error, info, warning) internally.

### DD-7: `asChild` support follows Radix defaults

Dialog, Alert Dialog, and Popover trigger sub-components (`DialogTrigger`, `AlertDialogTrigger`, `PopoverTrigger`) inherit `asChild` support from their underlying Radix primitives. `DialogClose`, `AlertDialogAction`, and `AlertDialogCancel` also support `asChild`. Content, header, footer, title, and description sub-components do not support `asChild` — they render fixed semantic elements matching the shadcn/ui API.

### DD-8: Sonner styles file exports theme configuration, not CVA

Since Sonner manages its own internal styling and variant system (success/error/info/warning toasts), the `sonner.styles.ts` file exports a theme configuration object that maps our semantic tokens to Sonner's styling API rather than a CVA variant definition. This configuration object is consumed by the `Toaster` component to ensure visual consistency with the rest of the library.

### DD-9: Animation keyframes via Tailwind v4

Dialog, Alert Dialog, and Popover animations use Tailwind CSS `animate-in`/`animate-out` utility classes paired with `tailwindcss-animate` keyframes. These classes are applied conditionally based on Radix's `data-[state=open]` and `data-[state=closed]` data attributes. The `tailwindcss-animate` plugin should already be available via the existing Tailwind v4 configuration; if not, it must be installed as a dev dependency.

### DD-10: Dialog close icon uses inline SVG

The close button (X) rendered inside `DialogContent` uses an inline SVG rather than importing from an icon library. This avoids adding a dependency on `lucide-react` or similar. The SVG is a simple 15x15 cross matching the shadcn/ui reference. If `lucide-react` is already installed or added later, this can be swapped, but the initial implementation avoids the dependency.

## Tasks

### Task 1: Dialog

**Deliverables:**

- Install `@radix-ui/react-dialog` as a dependency in `packages/ui/package.json`
- Create `packages/ui/src/components/dialog/` directory with 5 files:
  - `dialog.tsx` — Eight named exports wrapping `@radix-ui/react-dialog` primitives:
    - `Dialog` — wraps `DialogPrimitive.Root`. Controlled via `open`/`onOpenChange` props. No DOM output (context provider only). `data-slot="dialog"` is not applicable (no rendered element).
    - `DialogTrigger` — wraps `DialogPrimitive.Trigger`. Applies `data-slot="dialog-trigger"`. Supports `asChild`.
    - `DialogPortal` — wraps `DialogPrimitive.Portal`. Renders children into a portal outside the DOM tree.
    - `DialogOverlay` — wraps `DialogPrimitive.Overlay`. Applies `data-slot="dialog-overlay"`. Classes: `fixed inset-0 z-50 bg-black/80` with `data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0`.
    - `DialogContent` — wraps `DialogPrimitive.Content`. Renders inside `DialogPortal` + `DialogOverlay`. Applies `data-slot="dialog-content"`. Classes: `fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200` with open/close animations. Includes a `DialogPrimitive.Close` button in the top-right corner with an inline SVG X icon and `<span className="sr-only">Close</span>`.
    - `DialogHeader` — plain `<div>` with `data-slot="dialog-header"`. Classes: `flex flex-col space-y-1.5 text-center sm:text-left`.
    - `DialogFooter` — plain `<div>` with `data-slot="dialog-footer"`. Classes: `flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2`.
    - `DialogTitle` — wraps `DialogPrimitive.Title`. Applies `data-slot="dialog-title"`. Classes: `text-lg font-semibold leading-none tracking-tight`.
    - `DialogDescription` — wraps `DialogPrimitive.Description`. Applies `data-slot="dialog-description"`. Classes: `text-sm text-muted-foreground`.
    - `DialogClose` — wraps `DialogPrimitive.Close`. Applies `data-slot="dialog-close"`. Supports `asChild`.
  - `dialog.styles.ts` — Style constants for each sub-component (overlay, content, header, footer, title, description, close button). No CVA variants needed — Dialog has no variant prop.
  - `dialog.types.ts` — Props types for each sub-component: `DialogProps` (extends `React.ComponentProps<typeof DialogPrimitive.Root>`), `DialogTriggerProps`, `DialogPortalProps`, `DialogOverlayProps`, `DialogContentProps`, `DialogHeaderProps` (extends `React.ComponentProps<'div'>`), `DialogFooterProps` (extends `React.ComponentProps<'div'>`), `DialogTitleProps`, `DialogDescriptionProps`, `DialogCloseProps`.
  - `dialog.test.tsx` — Tests: smoke render (trigger + content), opens on trigger click, closes on ESC, closes on overlay click, close button (X) dismisses dialog, `data-slot` on content/overlay/header/footer/title/description, focus trap (focus stays inside dialog when tabbing), `aria-describedby` and `aria-labelledby` linking, controlled mode (`open`/`onOpenChange`), custom className on each sub-component, accessibility (axe).
  - `dialog.stories.tsx` — Stories: `Default` (trigger button + dialog with title, description, and close button), `WithForm` (dialog containing form inputs and submit/cancel buttons in footer), `Controlled` (externally controlled open state), `LongContent` (scrollable dialog content), `CustomClose` (custom close button using `DialogClose` with `asChild`).
- Export all sub-components and their prop types from `packages/ui/src/index.ts`

### Task 2: Alert Dialog

**Deliverables:**

- Install `@radix-ui/react-alert-dialog` as a dependency in `packages/ui/package.json`
- Create `packages/ui/src/components/alert-dialog/` directory with 5 files:
  - `alert-dialog.tsx` — Nine named exports wrapping `@radix-ui/react-alert-dialog` primitives:
    - `AlertDialog` — wraps `AlertDialogPrimitive.Root`. Context provider, no DOM output.
    - `AlertDialogTrigger` — wraps `AlertDialogPrimitive.Trigger`. Applies `data-slot="alert-dialog-trigger"`. Supports `asChild`.
    - `AlertDialogPortal` — wraps `AlertDialogPrimitive.Portal`.
    - `AlertDialogOverlay` — wraps `AlertDialogPrimitive.Overlay`. Applies `data-slot="alert-dialog-overlay"`. Same styling as `DialogOverlay`.
    - `AlertDialogContent` — wraps `AlertDialogPrimitive.Content`. Renders inside `AlertDialogPortal` + `AlertDialogOverlay`. Applies `data-slot="alert-dialog-content"`. Same centering and animation as `DialogContent` but **no** default close button (X) — dismiss requires explicit Action or Cancel.
    - `AlertDialogHeader` — plain `<div>` with `data-slot="alert-dialog-header"`. Same styling as `DialogHeader`.
    - `AlertDialogFooter` — plain `<div>` with `data-slot="alert-dialog-footer"`. Same styling as `DialogFooter`.
    - `AlertDialogTitle` — wraps `AlertDialogPrimitive.Title`. Applies `data-slot="alert-dialog-title"`.
    - `AlertDialogDescription` — wraps `AlertDialogPrimitive.Description`. Applies `data-slot="alert-dialog-description"`.
    - `AlertDialogAction` — wraps `AlertDialogPrimitive.Action`. Applies `data-slot="alert-dialog-action"`. Supports `asChild`. Styled with `buttonVariants()` default appearance.
    - `AlertDialogCancel` — wraps `AlertDialogPrimitive.Cancel`. Applies `data-slot="alert-dialog-cancel"`. Supports `asChild`. Styled with `buttonVariants({ variant: "outline" })` and `mt-2 sm:mt-0`.
  - `alert-dialog.styles.ts` — Style constants for each sub-component. Shares most styling with Dialog. Action and Cancel styles import `buttonVariants` from the Button component.
  - `alert-dialog.types.ts` — Props types for each sub-component following the same pattern as Dialog types but using `AlertDialogPrimitive` types. Includes `AlertDialogActionProps` and `AlertDialogCancelProps` instead of `DialogCloseProps`.
  - `alert-dialog.test.tsx` — Tests: smoke render, opens on trigger click, does **not** close on overlay click (critical behavioral difference from Dialog), closes on Cancel click, Action triggers `onOpenChange(false)`, ESC closes the dialog, focus trap, `aria-describedby` and `aria-labelledby` linking, `data-slot` on each sub-component, controlled mode, custom className on each sub-component, Action and Cancel render with correct button styling, accessibility (axe).
  - `alert-dialog.stories.tsx` — Stories: `Default` (confirmation dialog with "Are you sure?" pattern), `Destructive` (delete confirmation with destructive action button), `Controlled` (externally controlled), `WithDescription` (detailed description text).
- Export all sub-components and their prop types from `packages/ui/src/index.ts`

### Task 3: Popover

**Deliverables:**

- Install `@radix-ui/react-popover` as a dependency in `packages/ui/package.json`
- Create `packages/ui/src/components/popover/` directory with 5 files:
  - `popover.tsx` — Three named exports wrapping `@radix-ui/react-popover` primitives:
    - `Popover` — wraps `PopoverPrimitive.Root`. Context provider, no DOM output.
    - `PopoverTrigger` — wraps `PopoverPrimitive.Trigger`. Applies `data-slot="popover-trigger"`. Supports `asChild`.
    - `PopoverContent` — wraps `PopoverPrimitive.Content`. Renders inside a `PopoverPrimitive.Portal`. Applies `data-slot="popover-content"`. Props: `align` (default `"center"`), `sideOffset` (default `4`), `side`, `className`, `ref`. Classes: `z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none` with open/close animations: `data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95` plus side-aware slide animations (`data-[side=bottom]:slide-in-from-top-2`, etc.).
  - `popover.styles.ts` — Style constant for `PopoverContent`. No CVA variants — Popover has no variant prop.
  - `popover.types.ts` — `PopoverProps` (extends `React.ComponentProps<typeof PopoverPrimitive.Root>`), `PopoverTriggerProps` (extends `React.ComponentProps<typeof PopoverPrimitive.Trigger>`), `PopoverContentProps` (extends `React.ComponentProps<typeof PopoverPrimitive.Content>`).
  - `popover.test.tsx` — Tests: smoke render (trigger + content), opens on trigger click, closes on outside click, closes on ESC, `data-slot` on trigger and content, `sideOffset` default, custom `align` prop, custom className on content, popover content is portaled (not inside trigger DOM), accessibility (axe).
  - `popover.stories.tsx` — Stories: `Default` (popover with simple text content), `WithForm` (popover containing input fields), `Positioning` (demonstrating `side` and `align` combinations), `AsChildTrigger` (custom trigger element).
- Export `Popover`, `PopoverTrigger`, `PopoverContent`, and their prop types from `packages/ui/src/index.ts`

### Task 4: Sonner (Toast)

**Deliverables:**

- Install `sonner` as a dependency in `packages/ui/package.json`
- Create `packages/ui/src/components/sonner/` directory with 5 files:
  - `sonner.tsx` — Two exports:
    - `Toaster` — Wraps Sonner's `<Toaster />` component. Applies `data-slot="sonner"`. Configures theme-aware styling by mapping semantic tokens (`--background`, `--foreground`, `--primary`, `--destructive`, `--border`, `--muted`, `--muted-foreground`) to Sonner's `toastOptions.style`. Accepts and spreads all Sonner `Toaster` props for consumer customization (position, duration, etc.). Detects current theme via checking for `.dark` class on `<html>` or accepts explicit `theme` prop.
    - Re-export `toast` from `sonner` — the imperative function consumers call to trigger toasts (`toast("Message")`, `toast.success(...)`, `toast.error(...)`, etc.).
  - `sonner.styles.ts` — Exports a theme configuration object mapping semantic CSS custom properties to Sonner's style format. Includes light and dark variants. No CVA definition.
  - `sonner.types.ts` — `ToasterProps` extending Sonner's `ToasterProps` type (from `sonner`). Re-exports relevant Sonner types for consumer convenience.
  - `sonner.test.tsx` — Tests: smoke render of `Toaster`, toast appears when `toast()` is called, toast dismisses after timeout or on close, toast renders with correct theme colors (light mode), `data-slot` on toaster container, success/error/info toast variants render, accessibility (axe on toaster container).
  - `sonner.stories.tsx` — Stories: `Default` (button triggers a basic toast), `Success` (success toast), `Error` (error toast), `WithDescription` (toast with title and description), `WithAction` (toast with an action button), `Promise` (toast wrapping an async operation with loading/success/error states).
- Export `Toaster`, `toast`, and `type ToasterProps` from `packages/ui/src/index.ts`

## Exit Criteria

1. All four component directories exist under `packages/ui/src/components/` (`dialog/`, `alert-dialog/`, `popover/`, `sonner/`) each containing exactly 5 files following the `{name}.tsx`, `{name}.styles.ts`, `{name}.types.ts`, `{name}.test.tsx`, `{name}.stories.tsx` pattern.
2. `pnpm test` passes with zero failures, including vitest-axe accessibility assertions for all four components.
3. `pnpm typecheck` passes with zero TypeScript errors across the monorepo.
4. All components render correctly in Storybook (`pnpm storybook`) with all variants and states documented via CSF3 stories with `tags: ['autodocs']`.
5. Dialog opens on trigger click, traps focus within the overlay, closes on ESC, closes on backdrop click, and closes via the X button.
6. Alert Dialog opens on trigger click, traps focus within the overlay, closes on ESC, does **not** close on backdrop click, and requires explicit Action or Cancel to dismiss.
7. Popover opens on trigger click, positions content relative to its trigger with correct `side`/`align`/`sideOffset` behavior, closes on outside click, and closes on ESC.
8. Sonner `Toaster` renders theme-aware toasts in both light and dark mode. The `toast()` function triggers notifications with success, error, info, and warning variants. Toasts auto-dismiss after the configured duration.
9. Dialog and Alert Dialog render open/close animations (fade + scale) using Tailwind `animate-in`/`animate-out` utilities.
10. All sub-components apply correct `data-slot` attributes matching their component names.
11. All components, sub-components, their associated types, and utility exports (`toast`) are exported from `packages/ui/src/index.ts`.
12. No new ESLint or Prettier violations are introduced (verified by `pnpm lint`).

## Dependencies

### Pre-existing (must be in place before this phase starts)

- **Monorepo scaffolding** — pnpm workspace, Turborepo build pipeline, shared `tsconfig` and `eslint-config` packages
- **Button reference component** — canonical 5-file implementation in `packages/ui/src/components/button/` serving as the template for all new components; `buttonVariants` used by Alert Dialog's Action and Cancel sub-components
- **Phase 1 (Display Primitives)** — No direct component dependency, but Phase 1 establishes the working 5-file pattern, validates the build/test/storybook pipeline, and provides confidence in the conventions. The overlay components are more complex (Radix wrappers with portals, focus management, animations) and benefit from the simpler display components being completed first.
- **`@components/utils`** — `cn()` helper (clsx + tailwind-merge), imported as `../../lib/utils.js`
- **`@components/tokens`** — OKLCH design tokens and semantic theme definitions
- **`globals.css`** — complete light/dark theme with all semantic CSS custom properties including `--background`, `--foreground`, `--popover`, `--popover-foreground`, `--border`, `--muted`, `--muted-foreground`, `--primary`, `--destructive`
- **Storybook 8.5** — configured in `apps/docs/` with `@storybook/react-vite`, accessibility addon, and theme switching
- **Vitest + Testing Library + vitest-axe** — test infrastructure configured in `packages/ui/`
- **`@radix-ui/react-slot`** — already installed (used by Button for `asChild`)
- **`class-variance-authority`** — already installed (used by Button for variant management)
- **`tailwindcss-animate`** — must be available for `animate-in`/`animate-out` utility classes used by Dialog, Alert Dialog, and Popover animations; verify it is installed or install as a dev dependency

### To be installed

- **`@radix-ui/react-dialog`** — required by Task 1 (Dialog component)
- **`@radix-ui/react-alert-dialog`** — required by Task 2 (Alert Dialog component)
- **`@radix-ui/react-popover`** — required by Task 3 (Popover component)
- **`sonner`** — required by Task 4 (Sonner toast component)

### External references

- shadcn/ui source code and documentation for Dialog, Alert Dialog, Popover, and Sonner component API surfaces and behavior

## Artifacts

| Artifact                                   | Type                | Description                                                                                                             |
| ------------------------------------------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `packages/ui/src/components/dialog/`       | Directory (5 files) | Dialog compound component implementation                                                                                |
| `packages/ui/src/components/alert-dialog/` | Directory (5 files) | Alert Dialog compound component implementation                                                                          |
| `packages/ui/src/components/popover/`      | Directory (5 files) | Popover compound component implementation                                                                               |
| `packages/ui/src/components/sonner/`       | Directory (5 files) | Sonner toast integration implementation                                                                                 |
| `packages/ui/src/index.ts`                 | Modified file       | Updated with exports for all 4 components, sub-components, types, and `toast` function                                  |
| `packages/ui/package.json`                 | Modified file       | `@radix-ui/react-dialog`, `@radix-ui/react-alert-dialog`, `@radix-ui/react-popover`, and `sonner` added to dependencies |
