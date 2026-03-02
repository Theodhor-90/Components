# Task: Toggle Component

## Objective

Implement the Toggle component as a shadcn/ui port wrapping `@radix-ui/react-toggle`, following the project's 5-file pattern. Supports pressed/unpressed state with `default` and `outline` variants and `sm`, `default`, `lg` sizes.

## Deliverables

Complete `packages/ui/src/components/toggle/` directory with all 5 files, plus public API export in `index.ts`.

## Files to Create

| File                                                   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/ui/src/components/toggle/toggle.types.ts`    | `ToggleProps` extending `React.ComponentProps<typeof TogglePrimitive.Root>` intersected with `VariantProps<typeof toggleVariants>`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `packages/ui/src/components/toggle/toggle.styles.ts`   | `toggleVariants` CVA definition with configurable variants. Base classes: `inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground`. Variant `variant`: `default` (empty string), `outline` (`border border-input bg-transparent hover:bg-accent hover:text-accent-foreground`). Variant `size`: `default` (`h-10 px-3`), `sm` (`h-9 px-2.5`), `lg` (`h-11 px-5`). DefaultVariants: `{ variant: 'default', size: 'default' }`. |
| `packages/ui/src/components/toggle/toggle.tsx`         | Functional component wrapping `TogglePrimitive.Root`. Destructures `variant`, `size`, `className`. Applies `data-slot="toggle"`, `cn(toggleVariants({ variant, size, className }))`. React 19 ref-as-prop.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `packages/ui/src/components/toggle/toggle.test.tsx`    | Vitest + Testing Library + vitest-axe tests: smoke render, `data-slot`, default variant, outline variant with border, all three sizes, click toggles `data-state`, `aria-pressed` reflecting state, disabled, controlled usage, uncontrolled usage, custom className, axe assertions, ref forwarding.                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `packages/ui/src/components/toggle/toggle.stories.tsx` | CSF3 stories with `tags: ['autodocs']`: Default, Outline, Small, Large, Pressed, Disabled, With Icon, Controlled.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

## Files to Modify

| File                       | Action                                                        |
| -------------------------- | ------------------------------------------------------------- |
| `packages/ui/src/index.ts` | Add exports: `Toggle`, `ToggleProps` (type), `toggleVariants` |

## Key Implementation Details

- **This is a critical dependency for Task t06 (Toggle Group)** — `toggleVariants` from this component's styles file is reused by `ToggleGroupItem`
- No custom `asChild` handling — Radix provides it (DD-1)
- This is one of the components with configurable visual variants (unlike the base-classes-only pattern used by Checkbox/Switch/Radio Group)
- Uses `VariantProps` from CVA for type-safe variant props
- Uses semantic tokens: `bg-muted`, `text-muted-foreground`, `bg-accent`, `text-accent-foreground`, `border-input`, `ring-ring`, `ring-offset-background`
- Accessible via `aria-pressed`

## Dependencies

- Task t01 (Install All Radix Dependencies) must be complete
- `@radix-ui/react-toggle` must be installed

## Verification Criteria

1. All 5 files exist in `packages/ui/src/components/toggle/`
2. `pnpm test` passes for all toggle tests including vitest-axe assertions
3. `pnpm typecheck` passes with no errors
4. Toggle renders `default` and `outline` variants at all three sizes with correct `aria-pressed`
5. `toggleVariants` is exported and reusable by Toggle Group
6. Component exported from `packages/ui/src/index.ts`
7. Stories render correctly in Storybook with autodocs
