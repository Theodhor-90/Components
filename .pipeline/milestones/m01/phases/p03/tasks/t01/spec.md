# Task 1: Label

## Objective

Implement the Label component — a shadcn port wrapping `@radix-ui/react-label` — following the established 5-file pattern. Label provides accessible form labels with `htmlFor` binding and automatic disabled styling when paired with a disabled form input. It will be used extensively by Form, Input, Checkbox, Switch, and other form controls in Milestone 2.

## Deliverables

### Files to Create

| File                                                 | Purpose                                              |
| ---------------------------------------------------- | ---------------------------------------------------- |
| `packages/ui/src/components/label/label.tsx`         | Implementation wrapping `@radix-ui/react-label` Root |
| `packages/ui/src/components/label/label.styles.ts`   | CVA definition with base styles                      |
| `packages/ui/src/components/label/label.types.ts`    | TypeScript props type                                |
| `packages/ui/src/components/label/label.test.tsx`    | Vitest + Testing Library + vitest-axe tests          |
| `packages/ui/src/components/label/label.stories.tsx` | Storybook CSF3 stories with autodocs                 |

### Files to Modify

| File                       | Action                                                     |
| -------------------------- | ---------------------------------------------------------- |
| `packages/ui/src/index.ts` | Add exports for `Label`, `LabelProps`, and `labelVariants` |

## Implementation Details

### label.tsx

- Wrap `@radix-ui/react-label` Root primitive
- Accept `ref`, `className`, `asChild`, and all standard `<label>` props
- Apply `data-slot="label"` on the root element
- Merge className via `cn()` with CVA variants
- Support `peer-disabled:cursor-not-allowed peer-disabled:opacity-50` for automatic disabled styling when paired with a disabled form input
- React 19 ref-as-prop — no `forwardRef`
- Named export only

### label.styles.ts

- CVA definition with base styles: `text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50`
- No variants initially (default only)
- Export as `labelVariants`

### label.types.ts

- `LabelProps` extending `React.ComponentProps<typeof LabelPrimitive.Root>` intersected with `VariantProps<typeof labelVariants>`

### label.test.tsx

Required tests:

- Smoke render
- Renders correct text
- Renders as `<label>` element
- `htmlFor` attribute binding
- `data-slot="label"` present
- `asChild` renders as child element
- Custom className merging
- vitest-axe accessibility check (paired with an input)

### label.stories.tsx

Required stories (CSF3 with `tags: ['autodocs']`):

- Default
- WithInput (label + input pairing)
- Disabled (paired with disabled input showing disabled style)
- AsChild

## Dependencies

- **Task 0** (Install Radix dependencies) must be completed first
- Uses `@radix-ui/react-label` primitive
- Uses `cn()` from `@components/utils`
- Uses CVA for variant management
- Reference the Button component (`packages/ui/src/components/button/`) as the canonical 5-file pattern example

## Verification Criteria

1. All 5 files exist in `packages/ui/src/components/label/`
2. `Label`, `LabelProps`, and `labelVariants` are exported from `packages/ui/src/index.ts`
3. `pnpm test` passes with zero failures for label tests
4. `pnpm typecheck` passes with zero errors
5. Label renders correctly in Storybook with autodocs
6. Label correctly associates with form inputs via `htmlFor`
7. Label shows disabled styling when paired with a disabled input via the `peer` Tailwind modifier
8. `asChild` renders the child element while preserving label semantics
9. vitest-axe reports no accessibility violations
