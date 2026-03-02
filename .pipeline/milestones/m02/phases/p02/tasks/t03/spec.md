# Task: Switch Component

## Objective

Implement the Switch component as a shadcn/ui port wrapping `@radix-ui/react-switch`, following the project's 5-file pattern. Toggle between on/off states with animated thumb.

## Deliverables

Complete `packages/ui/src/components/switch/` directory with all 5 files, plus public API export in `index.ts`.

## Files to Create

| File                                                   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/ui/src/components/switch/switch.types.ts`    | `SwitchProps` extending `React.ComponentProps<typeof SwitchPrimitive.Root>`. No additional custom props.                                                                                                                                                                                                                                                                                                                                                 |
| `packages/ui/src/components/switch/switch.styles.ts`   | Two CVA exports: `switchVariants` for the root track (`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent`, focus ring, transition, disabled, checked/unchecked bg states), and `switchThumbVariants` for the thumb (`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0`). |
| `packages/ui/src/components/switch/switch.tsx`         | Functional component wrapping `SwitchPrimitive.Root` with `SwitchPrimitive.Thumb` inside. Root applies `data-slot="switch"`, `cn(switchVariants({ className }))`. Thumb applies `cn(switchThumbVariants())`. React 19 ref-as-prop.                                                                                                                                                                                                                       |
| `packages/ui/src/components/switch/switch.test.tsx`    | Vitest + Testing Library + vitest-axe tests: smoke render, `data-slot`, custom className, click toggles, Space key toggles, `role="switch"` with correct `aria-checked`, disabled state, controlled usage, uncontrolled usage, Label integration, axe assertions, ref forwarding.                                                                                                                                                                        |
| `packages/ui/src/components/switch/switch.stories.tsx` | CSF3 stories with `tags: ['autodocs']`: Default (off), Checked (on), Disabled, Disabled Checked, With Label, Controlled.                                                                                                                                                                                                                                                                                                                                 |

## Files to Modify

| File                       | Action                                                        |
| -------------------------- | ------------------------------------------------------------- |
| `packages/ui/src/index.ts` | Add exports: `Switch`, `SwitchProps` (type), `switchVariants` |

## Key Implementation Details

- No custom `asChild` handling needed — Radix provides it (DD-1)
- CVA with base classes only (DD-2)
- Two separate CVA exports for root track and thumb
- Thumb animation via `transition-transform` with `translate-x-5` / `translate-x-0`
- Uses semantic tokens: `bg-primary`, `bg-input`, `bg-background`, `ring-ring`, `ring-offset-background`
- Accessible as `role="switch"` with `aria-checked`

## Dependencies

- Task t01 (Install All Radix Dependencies) must be complete
- `@radix-ui/react-switch` must be installed
- Label component from Milestone 1 (for story/test composition)

## Verification Criteria

1. All 5 files exist in `packages/ui/src/components/switch/`
2. `pnpm test` passes for all switch tests including vitest-axe assertions
3. `pnpm typecheck` passes with no errors
4. Switch toggles on click and keyboard (Space) with `role="switch"` and correct `aria-checked`
5. Component exported from `packages/ui/src/index.ts`
6. Stories render correctly in Storybook with autodocs
