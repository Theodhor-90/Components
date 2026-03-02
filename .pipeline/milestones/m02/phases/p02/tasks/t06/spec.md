# Task: Toggle Group Component

## Objective

Implement the Toggle Group component (with ToggleGroupItem sub-component) as a shadcn/ui port wrapping `@radix-ui/react-toggle-group`, following the project's 5-file pattern. Supports single and multiple selection modes with variant/size propagation via React context.

## Deliverables

Complete `packages/ui/src/components/toggle-group/` directory with all 5 files, plus public API export in `index.ts`.

## Files to Create

| File                                                               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `packages/ui/src/components/toggle-group/toggle-group.types.ts`    | Three exports: `ToggleGroupContext` type (`{ variant: ToggleProps['variant']; size: ToggleProps['size'] }`), `ToggleGroupProps` extending `React.ComponentProps<typeof ToggleGroupPrimitive.Root>` with optional `variant` and `size` (typed from `VariantProps<typeof toggleVariants>`), `ToggleGroupItemProps` extending `React.ComponentProps<typeof ToggleGroupPrimitive.Item>` with optional `variant` and `size`.                                                                                                                                                        |
| `packages/ui/src/components/toggle-group/toggle-group.styles.ts`   | `toggleGroupVariants` CVA with base classes only: `flex items-center justify-center gap-1`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `packages/ui/src/components/toggle-group/toggle-group.tsx`         | Two functional components plus context. `ToggleGroupContext`: React context created with `createContext` holding `{ variant, size }`. `ToggleGroup`: wraps `ToggleGroupPrimitive.Root`, provides context with group's `variant` and `size`, applies `data-slot="toggle-group"`, `cn(toggleGroupVariants({ className }))`. `ToggleGroupItem`: wraps `ToggleGroupPrimitive.Item`, reads variant/size from context (direct props override), applies `data-slot="toggle-group-item"`, reuses `toggleVariants` from `../toggle/toggle.styles.js` for styling. React 19 ref-as-prop. |
| `packages/ui/src/components/toggle-group/toggle-group.test.tsx`    | Vitest + Testing Library + vitest-axe tests: smoke render, `data-slot` on both components, `type="single"` mutual exclusion, `type="multiple"` multi-select, context propagation (items inherit variant/size from group), context override (item-level props override group), disabled group, keyboard navigation, controlled usage, uncontrolled usage, axe assertions, ref forwarding on both.                                                                                                                                                                               |
| `packages/ui/src/components/toggle-group/toggle-group.stories.tsx` | CSF3 stories with `tags: ['autodocs']`: Single Selection, Multiple Selection, Outline Variant, Small Size, Large Size, Disabled, With Icons, Default Value, Controlled.                                                                                                                                                                                                                                                                                                                                                                                                        |

## Files to Modify

| File                       | Action                                                                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `packages/ui/src/index.ts` | Add exports: `ToggleGroup`, `ToggleGroupItem`, `ToggleGroupProps` (type), `ToggleGroupItemProps` (type), `toggleGroupVariants` |

## Key Implementation Details

- **Depends on Task t05 (Toggle)** — `ToggleGroupItem` imports and reuses `toggleVariants` from `../toggle/toggle.styles.js`
- React context pattern for variant/size propagation (DD-3): group provides context, items consume it, direct props override context values
- No custom `asChild` handling — Radix provides it (DD-1)
- CVA with base classes only for the group container (DD-2)
- `type="single"` enforces one active at a time; `type="multiple"` allows any combination
- Uses semantic tokens via `toggleVariants` (inherited from Toggle component)

## Dependencies

- Task t01 (Install All Radix Dependencies) must be complete
- **Task t05 (Toggle) must be complete** — ToggleGroupItem reuses `toggleVariants`
- `@radix-ui/react-toggle-group` must be installed

## Verification Criteria

1. All 5 files exist in `packages/ui/src/components/toggle-group/`
2. `pnpm test` passes for all toggle group tests including vitest-axe assertions
3. `pnpm typecheck` passes with no errors
4. Toggle Group enforces single or multiple selection based on `type` prop
5. Items inherit variant/size from group context, and direct props override context
6. Both `ToggleGroup` and `ToggleGroupItem` exported from `packages/ui/src/index.ts`
7. Stories render correctly in Storybook with autodocs
