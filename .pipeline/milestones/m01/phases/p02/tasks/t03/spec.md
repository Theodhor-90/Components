# Task 3: Popover

## Objective

Implement the Popover compound component as a shadcn/ui port wrapping `@radix-ui/react-popover`. A lighter overlay compared to Dialog — no backdrop, no focus trap — that positions floating content relative to its trigger using Radix's built-in positioning engine with configurable `side`, `align`, and `sideOffset` props.

## Deliverables

1. Install `@radix-ui/react-popover` as a dependency in `packages/ui/package.json`
2. Create `packages/ui/src/components/popover/` directory with 5 files
3. Export `Popover`, `PopoverTrigger`, `PopoverContent`, and their prop types from `packages/ui/src/index.ts`

## Files to Create

### `packages/ui/src/components/popover/popover.tsx`

Three named exports wrapping `@radix-ui/react-popover` primitives:

- **`Popover`** — wraps `PopoverPrimitive.Root`. Context provider, no DOM output, no `data-slot`.
- **`PopoverTrigger`** — wraps `PopoverPrimitive.Trigger`. `data-slot="popover-trigger"`. Supports `asChild`.
- **`PopoverContent`** — wraps `PopoverPrimitive.Content`. Renders inside a `PopoverPrimitive.Portal`. `data-slot="popover-content"`. Props: `align` (default `"center"`), `sideOffset` (default `4`), `side`, `className`, `ref`. Classes: `z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`.

### `packages/ui/src/components/popover/popover.styles.ts`

Style constant for `PopoverContent`. No CVA variants — Popover has no variant prop.

### `packages/ui/src/components/popover/popover.types.ts`

`PopoverProps` (extends `React.ComponentProps<typeof PopoverPrimitive.Root>`), `PopoverTriggerProps` (extends `React.ComponentProps<typeof PopoverPrimitive.Trigger>`), `PopoverContentProps` (extends `React.ComponentProps<typeof PopoverPrimitive.Content>`).

### `packages/ui/src/components/popover/popover.test.tsx`

Tests: smoke render (trigger + content), opens on trigger click, closes on outside click, closes on ESC, `data-slot` on trigger and content, `sideOffset` default, custom `align` prop, custom className on content, popover content is portaled (not inside trigger DOM), accessibility (axe).

### `packages/ui/src/components/popover/popover.stories.tsx`

Stories (CSF3 with `tags: ['autodocs']`): `Default` (popover with simple text content), `WithForm` (popover containing input fields), `Positioning` (demonstrating `side` and `align` combinations), `AsChildTrigger` (custom trigger element).

## Files to Modify

- `packages/ui/package.json` — add `@radix-ui/react-popover` to dependencies
- `packages/ui/src/index.ts` — add exports for Popover components and types

## Key Implementation Details

- Popover uses Radix's built-in positioning (floating-point calculations) — no custom positioning logic needed
- `PopoverContent` renders inside a `PopoverPrimitive.Portal` for proper layering
- Default props: `align="center"`, `sideOffset={4}`
- Side-specific slide animations: `data-[side=bottom]:slide-in-from-top-2`, etc.
- No backdrop overlay (unlike Dialog)
- No focus trap (unlike Dialog)
- React 19 ref-as-prop — do not use `forwardRef`
- Use `cn()` helper from `../../lib/utils.js`
- Named exports only, no default exports
- Use `import type` for type-only imports

## Dependencies

- **Task 0** (Animation Infrastructure Setup) — animation classes must be available
- No dependency on Task 1 or Task 2, but benefits from the overlay patterns established there

## Verification Criteria

1. All 5 files exist in `packages/ui/src/components/popover/`
2. `pnpm test` passes for popover tests including vitest-axe assertions
3. `pnpm typecheck` passes with no errors
4. Popover opens on trigger click, positions content relative to trigger
5. Popover closes on outside click and ESC
6. `side`, `align`, and `sideOffset` props work correctly
7. Content is rendered in a portal (not inside trigger DOM tree)
8. `data-slot` attributes are correctly applied
9. All exports are present in `packages/ui/src/index.ts`
10. Stories render correctly in Storybook with autodocs
