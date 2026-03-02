# Task: Radio Group Component

## Objective

Implement the Radio Group component (with RadioGroupItem sub-component) as a shadcn/ui port wrapping `@radix-ui/react-radio-group`, following the project's 5-file pattern. Manages mutual exclusion between radio items with keyboard navigation.

## Deliverables

Complete `packages/ui/src/components/radio-group/` directory with all 5 files, plus public API export in `index.ts`.

## Files to Create

| File                                                             | Description                                                                                                                                                                                                                                                                                                                                        |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/ui/src/components/radio-group/radio-group.types.ts`    | Two types: `RadioGroupProps` extending `React.ComponentProps<typeof RadioGroupPrimitive.Root>`, `RadioGroupItemProps` extending `React.ComponentProps<typeof RadioGroupPrimitive.Item>`.                                                                                                                                                           |
| `packages/ui/src/components/radio-group/radio-group.styles.ts`   | Two CVA exports: `radioGroupVariants` (`grid gap-2`), `radioGroupItemVariants` (`aspect-square h-4 w-4 rounded-full border border-primary`, focus ring, disabled, checked state `data-[state=checked]:text-primary`).                                                                                                                              |
| `packages/ui/src/components/radio-group/radio-group.tsx`         | Two functional components: `RadioGroup` wraps `RadioGroupPrimitive.Root` with `data-slot="radio-group"`. `RadioGroupItem` wraps `RadioGroupPrimitive.Item` with `data-slot="radio-group-item"`, renders `RadioGroupPrimitive.Indicator` containing an inline SVG filled circle icon. React 19 ref-as-prop.                                         |
| `packages/ui/src/components/radio-group/radio-group.test.tsx`    | Vitest + Testing Library + vitest-axe tests: smoke render with multiple items, `data-slot` on both components, mutual exclusion, arrow key navigation, disabled group, disabled individual item, controlled usage, uncontrolled usage, Label per item, axe assertions with correct `role="radiogroup"` and `role="radio"`, ref forwarding on both. |
| `packages/ui/src/components/radio-group/radio-group.stories.tsx` | CSF3 stories with `tags: ['autodocs']`: Default (no selection), With Default Value, Disabled, With Labels, Horizontal Layout, Controlled.                                                                                                                                                                                                          |

## Files to Modify

| File                       | Action                                                                                                                                              |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/ui/src/index.ts` | Add exports: `RadioGroup`, `RadioGroupItem`, `RadioGroupProps` (type), `RadioGroupItemProps` (type), `radioGroupVariants`, `radioGroupItemVariants` |

## Key Implementation Details

- Compound component pattern: two components in one file
- No custom `asChild` handling — Radix provides it (DD-1)
- CVA with base classes only on both group and item (DD-2)
- Inline SVG filled circle icon inside `RadioGroupPrimitive.Indicator`
- Uses semantic tokens: `border-primary`, `text-primary`, `ring-ring`, `ring-offset-background`
- Arrow keys cycle through radio options (handled by Radix)

## Dependencies

- Task t01 (Install All Radix Dependencies) must be complete
- `@radix-ui/react-radio-group` must be installed
- Label component from Milestone 1 (for story/test composition)

## Verification Criteria

1. All 5 files exist in `packages/ui/src/components/radio-group/`
2. `pnpm test` passes for all radio group tests including vitest-axe assertions
3. `pnpm typecheck` passes with no errors
4. Radio Group enforces mutual exclusion and supports arrow key navigation
5. Both `RadioGroup` and `RadioGroupItem` exported from `packages/ui/src/index.ts`
6. Stories render correctly in Storybook with autodocs
