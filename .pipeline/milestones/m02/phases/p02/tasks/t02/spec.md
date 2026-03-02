# Task: Checkbox Component

## Objective

Implement the Checkbox component as a shadcn/ui port wrapping `@radix-ui/react-checkbox`, following the project's 5-file pattern. Supports checked, unchecked, and indeterminate states with inline SVG indicators.

## Deliverables

Complete `packages/ui/src/components/checkbox/` directory with all 5 files, plus public API export in `index.ts`.

## Files to Create

| File                                                       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/ui/src/components/checkbox/checkbox.types.ts`    | `CheckboxProps` extending `React.ComponentProps<typeof CheckboxPrimitive.Root>`. No additional custom props beyond what Radix provides (`checked`, `defaultChecked`, `onCheckedChange`, `disabled`, `required`, `name`, `value`).                                                                                                                                                                                                                                                                                                                          |
| `packages/ui/src/components/checkbox/checkbox.styles.ts`   | `checkboxVariants` CVA definition with base classes only: `peer h-4 w-4 shrink-0 rounded-sm`, border (`border border-primary`), focus ring (`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background`), disabled (`disabled:cursor-not-allowed disabled:opacity-50`), checked state (`data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground`), indeterminate state (`data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground`). |
| `packages/ui/src/components/checkbox/checkbox.tsx`         | Functional component wrapping `CheckboxPrimitive.Root`. Applies `data-slot="checkbox"`, `cn(checkboxVariants({ className }))`. Renders `CheckboxPrimitive.Indicator` with inline SVG checkmark icon (checked) and dash icon (indeterminate). React 19 ref-as-prop (no forwardRef).                                                                                                                                                                                                                                                                         |
| `packages/ui/src/components/checkbox/checkbox.test.tsx`    | Vitest + Testing Library + vitest-axe tests: smoke render, `data-slot`, custom className, click toggles state, indeterminate state with dash indicator, disabled state, controlled usage, uncontrolled usage, Label integration, axe assertions on all states, ref forwarding.                                                                                                                                                                                                                                                                             |
| `packages/ui/src/components/checkbox/checkbox.stories.tsx` | CSF3 stories with `tags: ['autodocs']`: Default, Checked, Indeterminate, Disabled, Disabled Checked, With Label, Controlled.                                                                                                                                                                                                                                                                                                                                                                                                                               |

## Files to Modify

| File                       | Action                                                              |
| -------------------------- | ------------------------------------------------------------------- |
| `packages/ui/src/index.ts` | Add exports: `Checkbox`, `CheckboxProps` (type), `checkboxVariants` |

## Key Implementation Details

- No custom `asChild` handling needed — Radix primitives already include `asChild` in their base prop types (DD-1)
- CVA with base classes only, no configurable variants (DD-2)
- Inline SVG icons for checked (checkmark) and indeterminate (dash) states — no icon library dependency (DD-4)
- Icons render inside `CheckboxPrimitive.Indicator` which handles show/hide based on state
- Uses semantic tokens: `border-primary`, `bg-primary`, `text-primary-foreground`, `ring-ring`, `ring-offset-background`

## Dependencies

- Task t01 (Install All Radix Dependencies) must be complete
- `@radix-ui/react-checkbox` must be installed
- Label component from Milestone 1 (for story/test composition)

## Verification Criteria

1. All 5 files exist in `packages/ui/src/components/checkbox/`
2. `pnpm test` passes for all checkbox tests including vitest-axe assertions
3. `pnpm typecheck` passes with no errors
4. Checkbox supports checked, unchecked, and indeterminate states with correct visual indicators
5. Component exported from `packages/ui/src/index.ts`
6. Stories render correctly in Storybook with autodocs
