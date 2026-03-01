# Task 4: Sonner (Toast)

## Objective

Implement the Sonner toast integration as a shadcn/ui port wrapping the `sonner` library. Unlike the other overlay components in this phase, Sonner uses an imperative API (`toast()` function) rather than declarative JSX composition. The `Toaster` component provides a theme-aware container that maps OKLCH semantic tokens to Sonner's styling system for consistent light/dark appearance.

## Deliverables

1. Install `sonner` as a dependency in `packages/ui/package.json`
2. Create `packages/ui/src/components/sonner/` directory with 5 files
3. Export `Toaster`, `toast`, and `type ToasterProps` from `packages/ui/src/index.ts`

## Files to Create

### `packages/ui/src/components/sonner/sonner.tsx`

Two exports:

- **`Toaster`** — Wraps Sonner's `<Toaster />` component. Applies `data-slot="sonner"`. Theme detection: evaluates `typeof document !== 'undefined' && document.documentElement.classList.contains('dark')` at render time to determine `"light"` or `"dark"`. Accepts an explicit `theme` prop (`"light" | "dark" | "system"`) that overrides auto-detection when provided. Spreads `toasterThemeConfig` from `sonner.styles.ts` into the Sonner `<Toaster />` for styling. Accepts and spreads all additional Sonner `Toaster` props for consumer customization (position, duration, etc.).
- **Re-export `toast` from `sonner`** — the imperative function consumers call to trigger toasts (`toast("Message")`, `toast.success(...)`, `toast.error(...)`, etc.).

### `packages/ui/src/components/sonner/sonner.styles.ts`

Exports a `toasterThemeConfig` object with the following shape:

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

No CVA definition — Sonner manages its own variant system internally.

### `packages/ui/src/components/sonner/sonner.types.ts`

`ToasterProps` extending Sonner's `ToasterProps` type (from `sonner`). Re-exports relevant Sonner types for consumer convenience.

### `packages/ui/src/components/sonner/sonner.test.tsx`

Tests: smoke render of `Toaster`, toast appears when `toast()` is called, toast dismisses after timeout or on close, toast renders with correct theme colors (light mode), `data-slot` on toaster container, success/error/info toast variants render, accessibility (axe on toaster container).

### `packages/ui/src/components/sonner/sonner.stories.tsx`

Stories (CSF3 with `tags: ['autodocs']`): `Default` (button triggers a basic toast), `Success` (success toast), `Error` (error toast), `WithDescription` (toast with title and description), `WithAction` (toast with an action button), `Promise` (toast wrapping an async operation with loading/success/error states).

## Files to Modify

- `packages/ui/package.json` — add `sonner` to dependencies
- `packages/ui/src/index.ts` — add exports for `Toaster`, `toast`, and `type ToasterProps`

## Key Implementation Details

- **Different integration pattern**: Sonner uses an imperative `toast()` function, not declarative JSX like the Radix-based components
- Theme detection uses runtime DOM check: `document.documentElement.classList.contains('dark')`
- SSR safety: guard `document` access with `typeof document !== 'undefined'`, default to `"light"`
- Explicit `theme` prop overrides auto-detection when provided
- `toasterThemeConfig` maps OKLCH CSS custom properties (`var(--background)`, `var(--foreground)`, `var(--border)`) to Sonner's styling
- `classNames` in the config leverages Sonner's built-in `classNames` prop for Tailwind-compatible styling
- Re-export `toast` directly from `sonner` for consumer convenience
- React 19 ref-as-prop conventions apply
- Named exports only, no default exports
- Use `import type` for type-only imports

## Dependencies

- **Task 0** (Animation Infrastructure Setup) — must be completed first
- No dependency on Tasks 1-3, but benefits from the overlay conventions established by earlier tasks
- Pre-existing: `globals.css` with semantic tokens (`--background`, `--foreground`, `--border`, `--muted-foreground`, `--primary`, `--primary-foreground`, etc.)

## Verification Criteria

1. All 5 files exist in `packages/ui/src/components/sonner/`
2. `pnpm test` passes for sonner tests including vitest-axe assertions
3. `pnpm typecheck` passes with no errors
4. `Toaster` renders with `data-slot="sonner"`
5. `toast()` function triggers notifications that appear on screen
6. Toast renders with theme-appropriate colors in both light and dark mode
7. Success, error, info, and warning toast variants render correctly
8. Toasts auto-dismiss after configured duration
9. SSR-safe: no `document` errors during server-side rendering
10. All exports (`Toaster`, `toast`, `ToasterProps`) are present in `packages/ui/src/index.ts`
11. Stories render correctly in Storybook with autodocs
