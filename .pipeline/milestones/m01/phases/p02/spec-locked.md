# Phase 2: Overlay Primitives — Specification

## Goal

Implement the four overlay components — Dialog, Alert Dialog, Popover, and Sonner toast — that render floating content above the page surface using portal rendering, focus trapping, and dismiss behavior powered by Radix UI primitives and the Sonner library. Each component follows the canonical 5-file pattern, uses Tailwind v4 utility classes with OKLCH semantic tokens, and ships with full Vitest + vitest-axe test coverage and Storybook CSF3 autodocs. Upon completion, consumers can import these components from `@components/ui` to build modal confirmations, contextual popovers, and toast notifications across all five Portfolio applications.

## Design Decisions

### DD-1: Task ordering — Setup first, then Dialog, Alert Dialog, Popover, Sonner

Task 0 installs `tailwindcss-animate` and configures the animation keyframes in `globals.css` before any component work begins. Dialog is the first component — it introduces the Radix dialog primitive, portal rendering, focus trapping, backdrop overlay, and the compound sub-component pattern for overlays. Alert Dialog follows immediately because it shares nearly identical structure but adds `AlertDialogAction`/`AlertDialogCancel` and disables backdrop dismiss. Popover comes third as a lighter overlay without backdrop or focus trap, introducing the `side`/`align` positioning API. Sonner (toast) comes last because it wraps a third-party library (not Radix) with a different integration pattern (imperative `toast()` function rather than declarative JSX), benefiting from the overlay conventions established by the first three tasks.

### DD-2: Dialog and Alert Dialog use separate Radix packages

Although `@radix-ui/react-dialog` and `@radix-ui/react-alert-dialog` share similar APIs, they are distinct packages with different dismiss behavior semantics. Alert Dialog intentionally prevents backdrop click dismiss and requires an explicit action or cancel, making it appropriate for destructive confirmations. We install both packages separately rather than building Alert Dialog on top of Dialog, matching the shadcn/ui approach.

### DD-3: Dialog overlay uses fixed positioning with backdrop opacity

The Dialog overlay (`DialogOverlay`) renders as a `fixed inset-0` element with `bg-black/80` backdrop. It uses `data-[state=open]` and `data-[state=closed]` selectors for enter/exit animations via `tailwindcss-animate` utility classes (`animate-in`/`animate-out`, `fade-in-0`/`fade-out-0`). The same pattern applies to Alert Dialog's overlay.

### DD-4: DialogContent centers with transform-based positioning

`DialogContent` is positioned using `fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2` for precise viewport centering via CSS transforms. Open/close animations use `animate-in`/`animate-out` with `fade-in-0`/`fade-out-0` and `zoom-in-95`/`zoom-out-95` for a subtle scale transition. A close button (X icon) is rendered in the top-right corner by default.

### DD-5: Popover uses Radix's built-in positioning

Popover delegates all positioning logic to `@radix-ui/react-popover`, which uses floating-point calculations internally. `PopoverContent` exposes `side` (default `"bottom"`), `align` (default `"center"`), and `sideOffset` (default `4`) props directly from the Radix primitive. No custom positioning logic is needed.

### DD-6: Sonner integration re-exports `toast` from sonner

The Sonner component consists of a `Toaster` component that wraps Sonner's `<Toaster />` with theme-aware styling. Consumers use Sonner's `toast()` function directly — we re-export it from our module for convenience. The `Toaster` component maps OKLCH semantic tokens to Sonner's `toastOptions.style` for consistent light/dark appearance. No CVA variants are needed since Sonner handles its own variant types (success, error, info, warning) internally.

### DD-7: `asChild` support follows Radix defaults

Dialog, Alert Dialog, and Popover trigger sub-components (`DialogTrigger`, `AlertDialogTrigger`, `PopoverTrigger`) inherit `asChild` support from their underlying Radix primitives. `DialogClose`, `AlertDialogAction`, and `AlertDialogCancel` also support `asChild`. Content, header, footer, title, and description sub-components do not support `asChild` — they render fixed semantic elements matching the shadcn/ui API.

### DD-8: Sonner styles file exports a typed theme configuration object

Since Sonner manages its own internal styling and variant system, the `sonner.styles.ts` file exports a `toasterThemeConfig` object with the following shape:

```ts
export const toasterThemeConfig = {
  toastOptions: {
    style: {
      background: 'var(--background)',
      color: 'var(--foreground)',
      border: '1px solid var(--border)',
    },
    classNames: {
      toast: 'group border-border',
      description: 'text-muted-foreground',
      actionButton: 'bg-primary text-primary-foreground',
      cancelButton: 'bg-muted text-muted-foreground',
    },
  },
} as const;
```

This configuration is spread into the `<Toaster />` wrapper to apply our semantic tokens. The `classNames` approach leverages Sonner's built-in `classNames` prop for Tailwind-compatible styling, while `style` provides CSS custom property fallbacks for elements Sonner renders internally.

### DD-9: Animation infrastructure via `tailwindcss-animate`

Dialog, Alert Dialog, and Popover animations use `animate-in`/`animate-out` utility classes provided by the `tailwindcss-animate` package. This package must be installed as a dependency in `packages/ui/package.json` and imported in `globals.css` via `@plugin "tailwindcss-animate"` (Tailwind v4 plugin syntax). This setup is handled in Task 0 before any component work begins.

### DD-10: Dialog close icon uses explicit inline SVG

The close button (X) rendered inside `DialogContent` uses the following inline SVG, matching the shadcn/ui reference implementation:

```tsx
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
```

The SVG is 15x15 pixels with 1.5px stroke width, using `currentColor` to inherit the text color. This avoids adding a dependency on `lucide-react` or any icon library. The close button wrapper applies `absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground`.

### DD-11: Portal sub-components are pure pass-throughs

`DialogPortal` and `AlertDialogPortal` are thin pass-through wrappers around their respective Radix primitives. They add no additional props, behavior, or `data-slot` attributes — they exist solely to provide a named export that matches the shadcn/ui API surface. Their types are direct aliases: `type DialogPortalProps = React.ComponentProps<typeof DialogPrimitive.Portal>`.

### DD-12: Sonner theme detection via runtime DOM check

The `Toaster` component detects the current theme using `document.documentElement.classList.contains('dark')` at render time, defaulting to `"light"` when the `.dark` class is absent. It also accepts an explicit `theme` prop (`"light" | "dark" | "system"`) that takes precedence when provided. The implementation uses a simple expression in the component body — no effect or observer is needed because Sonner's own `<Toaster />` re-renders when its props change, and the theme detection runs on each render. For SSR, the component defaults to `"light"` when `document` is not available (guarded by `typeof document !== 'undefined'`).

### DD-13: Alert Dialog imports `buttonVariants` from Button's styles file

Alert Dialog's `AlertDialogAction` and `AlertDialogCancel` sub-components import `buttonVariants` using the relative path `import { buttonVariants } from '../button/button.styles.js'`. This follows the project convention of no barrel files within packages and directly references the Button component's styles module. `AlertDialogAction` uses `buttonVariants()` (default variant), and `AlertDialogCancel` uses `buttonVariants({ variant: 'outline' })`.

## Tasks

### Task 0: Animation Infrastructure Setup

**Deliverables:**

- Install `tailwindcss-animate` as a dependency in `packages/ui/package.json`
- Add `@plugin "tailwindcss-animate";` to `packages/ui/styles/globals.css` after the `@import 'tailwindcss';` line and before the `@source` directive
- Verify that `animate-in`, `animate-out`, `fade-in-0`, `fade-out-0`, `zoom-in-95`, `zoom-out-95`, `slide-in-from-top-2`, `slide-in-from-bottom-2`, `slide-in-from-left-2`, `slide-in-from-right-2` utility classes are available by confirming the plugin loads without errors (`pnpm build` in `packages/ui/`)

### Task 1: Dialog

**Deliverables:**

- Install `@radix-ui/react-dialog` as a dependency in `packages/ui/package.json`
- Create `packages/ui/src/components/dialog/` directory with 5 files:
  - `dialog.tsx` — Ten named exports wrapping `@radix-ui/react-dialog` primitives:
    - `Dialog` — wraps `DialogPrimitive.Root`. Controlled via `open`/`onOpenChange` props. No DOM output (context provider only). No `data-slot` (no rendered element).
    - `DialogTrigger` — wraps `DialogPrimitive.Trigger`. Applies `data-slot="dialog-trigger"`. Supports `asChild`.
    - `DialogPortal` — wraps `DialogPrimitive.Portal`. Pure pass-through, no additional props or `data-slot`. Exists for API surface parity with shadcn/ui.
    - `DialogOverlay` — wraps `DialogPrimitive.Overlay`. Applies `data-slot="dialog-overlay"`. Classes: `fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0`.
    - `DialogContent` — wraps `DialogPrimitive.Content`. Renders inside `DialogPortal` + `DialogOverlay`. Applies `data-slot="dialog-content"`. Classes: `fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg`. Includes a `DialogPrimitive.Close` button in the top-right corner with the inline SVG X icon specified in DD-10 and `<span className="sr-only">Close</span>`. Close button classes: `absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground`.
    - `DialogHeader` — plain `<div>` with `data-slot="dialog-header"`. Classes: `flex flex-col space-y-1.5 text-center sm:text-left`.
    - `DialogFooter` — plain `<div>` with `data-slot="dialog-footer"`. Classes: `flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2`.
    - `DialogTitle` — wraps `DialogPrimitive.Title`. Applies `data-slot="dialog-title"`. Classes: `text-lg font-semibold leading-none tracking-tight`.
    - `DialogDescription` — wraps `DialogPrimitive.Description`. Applies `data-slot="dialog-description"`. Classes: `text-sm text-muted-foreground`.
    - `DialogClose` — wraps `DialogPrimitive.Close`. Applies `data-slot="dialog-close"`. Supports `asChild`.
  - `dialog.styles.ts` — Style constants for each sub-component (overlay, content, header, footer, title, description, close button). No CVA variants needed — Dialog has no variant prop.
  - `dialog.types.ts` — Props types for each sub-component: `DialogProps` (extends `React.ComponentProps<typeof DialogPrimitive.Root>`), `DialogTriggerProps`, `DialogPortalProps` (alias for `React.ComponentProps<typeof DialogPrimitive.Portal>`), `DialogOverlayProps`, `DialogContentProps`, `DialogHeaderProps` (extends `React.ComponentProps<'div'>`), `DialogFooterProps` (extends `React.ComponentProps<'div'>`), `DialogTitleProps`, `DialogDescriptionProps`, `DialogCloseProps`.
  - `dialog.test.tsx` — Tests: smoke render (trigger + content), opens on trigger click, closes on ESC, closes on overlay click, close button (X) dismisses dialog, `data-slot` on content/overlay/header/footer/title/description, focus trap (focus stays inside dialog when tabbing), `aria-describedby` and `aria-labelledby` linking, controlled mode (`open`/`onOpenChange`), custom className on each sub-component, accessibility (axe).
  - `dialog.stories.tsx` — Stories: `Default` (trigger button + dialog with title, description, and close button), `WithForm` (dialog containing form inputs and submit/cancel buttons in footer), `Controlled` (externally controlled open state), `LongContent` (scrollable dialog content), `CustomClose` (custom close button using `DialogClose` with `asChild`).
- Export all sub-components and their prop types from `packages/ui/src/index.ts`

### Task 2: Alert Dialog

**Deliverables:**

- Install `@radix-ui/react-alert-dialog` as a dependency in `packages/ui/package.json`
- Create `packages/ui/src/components/alert-dialog/` directory with 5 files:
  - `alert-dialog.tsx` — Eleven named exports wrapping `@radix-ui/react-alert-dialog` primitives:
    - `AlertDialog` — wraps `AlertDialogPrimitive.Root`. Context provider, no DOM output. No `data-slot`.
    - `AlertDialogTrigger` — wraps `AlertDialogPrimitive.Trigger`. Applies `data-slot="alert-dialog-trigger"`. Supports `asChild`.
    - `AlertDialogPortal` — wraps `AlertDialogPrimitive.Portal`. Pure pass-through, no additional props or `data-slot`. Exists for API surface parity with shadcn/ui.
    - `AlertDialogOverlay` — wraps `AlertDialogPrimitive.Overlay`. Applies `data-slot="alert-dialog-overlay"`. Same styling as `DialogOverlay`.
    - `AlertDialogContent` — wraps `AlertDialogPrimitive.Content`. Renders inside `AlertDialogPortal` + `AlertDialogOverlay`. Applies `data-slot="alert-dialog-content"`. Same centering and animation as `DialogContent` but **no** default close button (X) — dismiss requires explicit Action or Cancel.
    - `AlertDialogHeader` — plain `<div>` with `data-slot="alert-dialog-header"`. Same styling as `DialogHeader`.
    - `AlertDialogFooter` — plain `<div>` with `data-slot="alert-dialog-footer"`. Same styling as `DialogFooter`.
    - `AlertDialogTitle` — wraps `AlertDialogPrimitive.Title`. Applies `data-slot="alert-dialog-title"`.
    - `AlertDialogDescription` — wraps `AlertDialogPrimitive.Description`. Applies `data-slot="alert-dialog-description"`.
    - `AlertDialogAction` — wraps `AlertDialogPrimitive.Action`. Applies `data-slot="alert-dialog-action"`. Supports `asChild`. Styled with `buttonVariants()` (default variant) imported from `'../button/button.styles.js'`.
    - `AlertDialogCancel` — wraps `AlertDialogPrimitive.Cancel`. Applies `data-slot="alert-dialog-cancel"`. Supports `asChild`. Styled with `buttonVariants({ variant: "outline" })` imported from `'../button/button.styles.js'`, plus `mt-2 sm:mt-0`.
  - `alert-dialog.styles.ts` — Style constants for each sub-component. Shares most styling with Dialog. Action and Cancel styles reference `buttonVariants` from `'../button/button.styles.js'`.
  - `alert-dialog.types.ts` — Props types for each sub-component following the same pattern as Dialog types but using `AlertDialogPrimitive` types. Includes `AlertDialogPortalProps` (alias for `React.ComponentProps<typeof AlertDialogPrimitive.Portal>`), `AlertDialogActionProps`, and `AlertDialogCancelProps` instead of `DialogCloseProps`.
  - `alert-dialog.test.tsx` — Tests: smoke render, opens on trigger click, does **not** close on overlay click (critical behavioral difference from Dialog), closes on Cancel click, Action triggers `onOpenChange(false)`, ESC closes the dialog, focus trap, `aria-describedby` and `aria-labelledby` linking, `data-slot` on each sub-component, controlled mode, custom className on each sub-component, Action and Cancel render with correct button styling, accessibility (axe).
  - `alert-dialog.stories.tsx` — Stories: `Default` (confirmation dialog with "Are you sure?" pattern), `Destructive` (delete confirmation with destructive action button), `Controlled` (externally controlled), `WithDescription` (detailed description text).
- Export all sub-components and their prop types from `packages/ui/src/index.ts`

### Task 3: Popover

**Deliverables:**

- Install `@radix-ui/react-popover` as a dependency in `packages/ui/package.json`
- Create `packages/ui/src/components/popover/` directory with 5 files:
  - `popover.tsx` — Three named exports wrapping `@radix-ui/react-popover` primitives:
    - `Popover` — wraps `PopoverPrimitive.Root`. Context provider, no DOM output. No `data-slot`.
    - `PopoverTrigger` — wraps `PopoverPrimitive.Trigger`. Applies `data-slot="popover-trigger"`. Supports `asChild`.
    - `PopoverContent` — wraps `PopoverPrimitive.Content`. Renders inside a `PopoverPrimitive.Portal`. Applies `data-slot="popover-content"`. Props: `align` (default `"center"`), `sideOffset` (default `4`), `side`, `className`, `ref`. Classes: `z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`.
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
    - `Toaster` — Wraps Sonner's `<Toaster />` component. Applies `data-slot="sonner"`. Theme detection: evaluates `typeof document !== 'undefined' && document.documentElement.classList.contains('dark')` at render time to determine `"light"` or `"dark"`. Accepts an explicit `theme` prop (`"light" | "dark" | "system"`) that overrides auto-detection when provided. Spreads `toasterThemeConfig` from `sonner.styles.ts` into the Sonner `<Toaster />` for styling. Accepts and spreads all additional Sonner `Toaster` props for consumer customization (position, duration, etc.).
    - Re-export `toast` from `sonner` — the imperative function consumers call to trigger toasts (`toast("Message")`, `toast.success(...)`, `toast.error(...)`, etc.).
  - `sonner.styles.ts` — Exports a `toasterThemeConfig` object with the shape specified in DD-8. Contains `toastOptions.style` mapping CSS custom properties (`var(--background)`, `var(--foreground)`, `var(--border)`) and `toastOptions.classNames` mapping Tailwind utility classes for toast sub-elements. No CVA definition.
  - `sonner.types.ts` — `ToasterProps` extending Sonner's `ToasterProps` type (from `sonner`). Re-exports relevant Sonner types for consumer convenience.
  - `sonner.test.tsx` — Tests: smoke render of `Toaster`, toast appears when `toast()` is called, toast dismisses after timeout or on close, toast renders with correct theme colors (light mode), `data-slot` on toaster container, success/error/info toast variants render, accessibility (axe on toaster container).
  - `sonner.stories.tsx` — Stories: `Default` (button triggers a basic toast), `Success` (success toast), `Error` (error toast), `WithDescription` (toast with title and description), `WithAction` (toast with an action button), `Promise` (toast wrapping an async operation with loading/success/error states).
- Export `Toaster`, `toast`, and `type ToasterProps` from `packages/ui/src/index.ts`

## Exit Criteria

1. `tailwindcss-animate` is installed and configured in `globals.css` via `@plugin "tailwindcss-animate"`, providing `animate-in`/`animate-out` and related utility classes.
2. All four component directories exist under `packages/ui/src/components/` (`dialog/`, `alert-dialog/`, `popover/`, `sonner/`) each containing exactly 5 files following the `{name}.tsx`, `{name}.styles.ts`, `{name}.types.ts`, `{name}.test.tsx`, `{name}.stories.tsx` pattern.
3. `pnpm test` passes with zero failures, including vitest-axe accessibility assertions for all four components.
4. `pnpm typecheck` passes with zero TypeScript errors across the monorepo.
5. All components render correctly in Storybook (`pnpm storybook`) with all variants and states documented via CSF3 stories with `tags: ['autodocs']`.
6. Dialog opens on trigger click, traps focus within the overlay, closes on ESC, closes on backdrop click, and closes via the X button.
7. Alert Dialog opens on trigger click, traps focus within the overlay, closes on ESC, does **not** close on backdrop click, and requires explicit Action or Cancel to dismiss.
8. Popover opens on trigger click, positions content relative to its trigger with correct `side`/`align`/`sideOffset` behavior, closes on outside click, and closes on ESC.
9. Sonner `Toaster` renders theme-aware toasts in both light and dark mode. The `toast()` function triggers notifications with success, error, info, and warning variants. Toasts auto-dismiss after the configured duration.
10. Dialog and Alert Dialog render open/close animations (fade + scale) using `tailwindcss-animate` utility classes.
11. All sub-components apply correct `data-slot` attributes matching their component names. Portal sub-components (`DialogPortal`, `AlertDialogPortal`) are pass-throughs with no `data-slot`.
12. All components, sub-components, their associated types, and utility exports (`toast`) are exported from `packages/ui/src/index.ts`.
13. No new ESLint or Prettier violations are introduced (verified by `pnpm lint`).

## Dependencies

### Pre-existing (must be in place before this phase starts)

- **Monorepo scaffolding** — pnpm workspace, Turborepo build pipeline, shared `tsconfig` and `eslint-config` packages
- **Button reference component** — canonical 5-file implementation in `packages/ui/src/components/button/`; `buttonVariants` from `packages/ui/src/components/button/button.styles.ts` is imported by Alert Dialog's Action and Cancel sub-components
- **Phase 1 (Display Primitives)** — No direct component dependency, but Phase 1 establishes the working 5-file pattern, validates the build/test/storybook pipeline, and provides confidence in the conventions. The overlay components are more complex (Radix wrappers with portals, focus management, animations) and benefit from the simpler display components being completed first.
- **`@components/utils`** — `cn()` helper (clsx + tailwind-merge), imported as `../../lib/utils.js`
- **`@components/tokens`** — OKLCH design tokens and semantic theme definitions
- **`globals.css`** — complete light/dark theme with all semantic CSS custom properties including `--background`, `--foreground`, `--popover`, `--popover-foreground`, `--border`, `--muted`, `--muted-foreground`, `--primary`, `--destructive`
- **Storybook 8.5** — configured in `apps/docs/` with `@storybook/react-vite`, accessibility addon, and theme switching
- **Vitest + Testing Library + vitest-axe** — test infrastructure configured in `packages/ui/`
- **`@radix-ui/react-slot`** — already installed (used by Button for `asChild`)
- **`class-variance-authority`** — already installed (used by Button for variant management)

### To be installed

- **`tailwindcss-animate`** — required by Task 0 (animation infrastructure for `animate-in`/`animate-out` utility classes used by Dialog, Alert Dialog, and Popover)
- **`@radix-ui/react-dialog`** — required by Task 1 (Dialog component)
- **`@radix-ui/react-alert-dialog`** — required by Task 2 (Alert Dialog component)
- **`@radix-ui/react-popover`** — required by Task 3 (Popover component)
- **`sonner`** — required by Task 4 (Sonner toast component)

### External references

- shadcn/ui source code and documentation for Dialog, Alert Dialog, Popover, and Sonner component API surfaces and behavior

## Artifacts

| Artifact                                   | Type                | Description                                                                                                                                    |
| ------------------------------------------ | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/ui/styles/globals.css`           | Modified file       | `@plugin "tailwindcss-animate"` added for animation utility classes                                                                            |
| `packages/ui/package.json`                 | Modified file       | `tailwindcss-animate`, `@radix-ui/react-dialog`, `@radix-ui/react-alert-dialog`, `@radix-ui/react-popover`, and `sonner` added to dependencies |
| `packages/ui/src/components/dialog/`       | Directory (5 files) | Dialog compound component implementation                                                                                                       |
| `packages/ui/src/components/alert-dialog/` | Directory (5 files) | Alert Dialog compound component implementation                                                                                                 |
| `packages/ui/src/components/popover/`      | Directory (5 files) | Popover compound component implementation                                                                                                      |
| `packages/ui/src/components/sonner/`       | Directory (5 files) | Sonner toast integration implementation                                                                                                        |
| `packages/ui/src/index.ts`                 | Modified file       | Updated with exports for all 4 components, sub-components, types, and `toast` function                                                         |
