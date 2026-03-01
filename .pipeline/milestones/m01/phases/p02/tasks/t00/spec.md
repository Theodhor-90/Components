# Task 0: Animation Infrastructure Setup

## Objective

Install and configure `tailwindcss-animate` to provide animation utility classes (`animate-in`, `animate-out`, `fade-in-0`, `fade-out-0`, `zoom-in-95`, `zoom-out-95`, `slide-in-from-*`) required by the Dialog, Alert Dialog, and Popover components in subsequent tasks.

## Deliverables

1. Install `tailwindcss-animate` as a dependency in `packages/ui/package.json`
2. Add `@plugin "tailwindcss-animate";` to `packages/ui/styles/globals.css` after the `@import 'tailwindcss';` line and before the `@source` directive
3. Verify that the plugin loads without errors by running `pnpm build` in `packages/ui/`

## Files to Modify

- `packages/ui/package.json` — add `tailwindcss-animate` to `dependencies`
- `packages/ui/styles/globals.css` — add `@plugin "tailwindcss-animate";` (Tailwind v4 plugin syntax)

## Key Implementation Details

- Tailwind v4 uses `@plugin` syntax (not the `plugins` array in a config file)
- The `@plugin` directive must appear after `@import 'tailwindcss';` and before the `@source` directive in `globals.css`
- The following utility classes must be available after setup: `animate-in`, `animate-out`, `fade-in-0`, `fade-out-0`, `zoom-in-95`, `zoom-out-95`, `slide-in-from-top-2`, `slide-in-from-bottom-2`, `slide-in-from-left-2`, `slide-in-from-right-2`

## Dependencies

- None (this is the first task in the phase)

## Verification Criteria

1. `tailwindcss-animate` appears in `packages/ui/package.json` dependencies
2. `@plugin "tailwindcss-animate";` is present in `globals.css` at the correct position
3. `pnpm build` in `packages/ui/` completes without errors
4. The animation utility classes are available for use in subsequent component implementations
