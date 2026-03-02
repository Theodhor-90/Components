# Task: Select Component

## Objective

Implement the Select compound component as a shadcn/ui port wrapping `@radix-ui/react-select`, following the project's 5-file pattern. Includes SelectTrigger, SelectContent, SelectItem, SelectGroup, SelectLabel, and SelectSeparator sub-components. Supports option groups, keyboard navigation, and animated open/close.

## Deliverables

Complete `packages/ui/src/components/select/` directory with all 5 files, plus public API export in `index.ts`.

## Files to Create

| File                                                   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/ui/src/components/select/select.types.ts`    | Type exports for all public sub-components: `SelectProps` (Root), `SelectTriggerProps`, `SelectContentProps` (with optional `position?: 'popper' \| 'item-aligned'`, defaults to `'popper'`), `SelectItemProps`, `SelectGroupProps`, `SelectLabelProps`, `SelectSeparatorProps`.                                                                                                                                                                                                                                                                                                                                  |
| `packages/ui/src/components/select/select.styles.ts`   | CVA exports with base classes only, one per sub-component: `selectTriggerVariants` (flex layout, h-10, border-input, focus ring, disabled), `selectContentVariants` (z-50, rounded-md, border, bg-popover, shadow, open/close animation classes from `tailwindcss-animate`), `selectItemVariants` (flex, rounded-sm, focus:bg-accent, disabled), `selectLabelVariants` (font-semibold), `selectSeparatorVariants` (h-px, bg-muted), `selectScrollButtonVariants` (flex center). Popper-specific positioning classes applied conditionally in `.tsx` (translate offsets on Content, viewport sizing via CSS vars). |
| `packages/ui/src/components/select/select.tsx`         | Multiple functional components: `Select` (thin wrapper/re-export of Root with `data-slot`), `SelectGroup` (with `data-slot`), `SelectTrigger` (with `data-slot`, chevron-down SVG, internally renders `SelectPrimitive.Value`), `SelectContent` (Portal + Content, conditional popper classes, internal scroll buttons with chevron SVGs, Viewport wrapper), `SelectItem` (with `data-slot`, checkmark indicator SVG, ItemText), `SelectLabel` (with `data-slot`), `SelectSeparator` (with `data-slot`). React 19 ref-as-prop.                                                                                    |
| `packages/ui/src/components/select/select.test.tsx`    | Vitest + Testing Library + vitest-axe tests: smoke render, `data-slot` on all sub-components, opens on trigger click, keyboard (Space/Enter opens, arrows navigate, Enter selects, Escape closes), selecting updates displayed value and closes, option groups with labels, separators, disabled trigger, disabled item, placeholder text, controlled usage, uncontrolled usage, axe assertions with correct `role="combobox"` on trigger, ref forwarding on SelectTrigger.                                                                                                                                       |
| `packages/ui/src/components/select/select.stories.tsx` | CSF3 stories with `tags: ['autodocs']`: Default, With Placeholder, With Default Value, With Groups (grouped options with labels and separators), Disabled, Disabled Item, With Label, Scrollable (many items), Controlled.                                                                                                                                                                                                                                                                                                                                                                                        |

## Files to Modify

| File                       | Action                                                                                                                                                                                                           |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/ui/src/index.ts` | Add exports: `Select`, `SelectGroup`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectLabel`, `SelectSeparator`, plus all corresponding type exports (no `SelectValue` — it is internal to SelectTrigger) |

## Key Implementation Details

- Most complex component in this phase — compound component with 7 public exports
- `SelectValue` is NOT exported as public API — it is used internally by `SelectTrigger` (DD-5)
- `SelectScrollUpButton` and `SelectScrollDownButton` are internal to `SelectContent` (DD-5)
- Animation uses `tailwindcss-animate` classes (`animate-in`, `animate-out`, `fade-in-0`, `zoom-in-95`, `slide-in-from-*`) — plugin already installed and configured (DD-7)
- Popper position classes conditionally applied when `position="popper"` (default) — includes translate offsets on Content and viewport sizing via `--radix-select-trigger-height`/`--radix-select-trigger-width` CSS custom properties
- No custom `asChild` handling — Radix provides it (DD-1)
- Multiple CVA exports in single styles file, one per sub-component (DD-2 exception for compound components)
- Inline SVG icons: chevron-down (trigger), chevron-up/chevron-down (scroll buttons), checkmark (selected item indicator)
- Uses semantic tokens: `border-input`, `bg-background`, `bg-popover`, `text-popover-foreground`, `bg-accent`, `text-accent-foreground`, `bg-muted`, `text-muted-foreground`, `ring-ring`, `ring-offset-background`

## Dependencies

- Task t01 (Install All Radix Dependencies) must be complete
- `@radix-ui/react-select` must be installed
- `tailwindcss-animate` already installed and configured
- Label component from Milestone 1 (for story composition)

## Verification Criteria

1. All 5 files exist in `packages/ui/src/components/select/`
2. `pnpm test` passes for all select tests including vitest-axe assertions
3. `pnpm typecheck` passes with no errors
4. Select opens on click and keyboard (Space/Enter), supports option groups with labels and separators, closes on selection or Escape
5. Selected value displays in trigger
6. All 7 public sub-components exported from `packages/ui/src/index.ts`
7. Stories render correctly in Storybook with autodocs
8. Open/close animations work correctly
