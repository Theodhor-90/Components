# Task 2: Visually Hidden

## Objective

Implement the Visually Hidden component — a custom utility wrapping `@radix-ui/react-visually-hidden` — following the 5-file pattern. Visually Hidden renders content that is invisible visually but available to screen readers, used for icon-only buttons and drag handles.

## Deliverables

### Files to Create

| File                                                                     | Purpose                                                        |
| ------------------------------------------------------------------------ | -------------------------------------------------------------- |
| `packages/ui/src/components/visually-hidden/visually-hidden.tsx`         | Implementation wrapping `@radix-ui/react-visually-hidden` Root |
| `packages/ui/src/components/visually-hidden/visually-hidden.styles.ts`   | Empty const string (Radix handles styling)                     |
| `packages/ui/src/components/visually-hidden/visually-hidden.types.ts`    | TypeScript props type                                          |
| `packages/ui/src/components/visually-hidden/visually-hidden.test.tsx`    | Vitest + Testing Library + vitest-axe tests                    |
| `packages/ui/src/components/visually-hidden/visually-hidden.stories.tsx` | Storybook CSF3 stories with autodocs                           |

### Files to Modify

| File                       | Action                                                     |
| -------------------------- | ---------------------------------------------------------- |
| `packages/ui/src/index.ts` | Add exports for `VisuallyHidden` and `VisuallyHiddenProps` |

## Implementation Details

### visually-hidden.tsx

- Wrap `@radix-ui/react-visually-hidden` Root primitive
- Accept `ref`, `className`, `asChild`, children, and standard HTML props
- Apply `data-slot="visually-hidden"`
- Minimal wrapper — the Radix primitive handles all off-screen positioning via inline styles
- React 19 ref-as-prop — no `forwardRef`
- Named export only

### visually-hidden.styles.ts

- Export `export const visuallyHiddenStyles = ''`
- The Radix primitive applies its own inline styles for screen-reader-only rendering
- No additional Tailwind styling is needed
- The empty const satisfies the 5-file pattern contract

### visually-hidden.types.ts

- `VisuallyHiddenProps` extending `React.ComponentProps<typeof VisuallyHiddenPrimitive.Root>`

### visually-hidden.test.tsx

Required tests:

- Smoke render
- Content is in DOM but visually hidden (not visible to sighted users)
- Screen reader accessible (role/text queries find the content)
- `data-slot="visually-hidden"` present
- `asChild` renders as child element (renders child `<span>` instead of its own `<span>`, merging visually-hidden behavior onto the child)
- vitest-axe accessibility check

### visually-hidden.stories.tsx

Required stories (CSF3 with `tags: ['autodocs']`):

- Default (with explanation text)
- WithIconButton (icon-only button with visually hidden label — the primary use case)
- AsChild (demonstrating `asChild` merging onto a child `<span>`)

## Important Notes

- The `visuallyHiddenStyles` const is NOT exported from `index.ts` — it is an internal implementation detail, consistent with how Dialog's style const strings are not exported
- Only `VisuallyHidden` and `VisuallyHiddenProps` are exported from `index.ts`

## Dependencies

- **Task 0** (Install Radix dependencies) must be completed first
- Uses `@radix-ui/react-visually-hidden` primitive
- Reference the Button component as the canonical 5-file pattern example
- Can be implemented in parallel with Task 1 (Label) and Task 3 (Collapsible)

## Verification Criteria

1. All 5 files exist in `packages/ui/src/components/visually-hidden/`
2. `VisuallyHidden` and `VisuallyHiddenProps` are exported from `packages/ui/src/index.ts`
3. `visuallyHiddenStyles` is NOT exported from `index.ts`
4. `pnpm test` passes with zero failures for visually-hidden tests
5. `pnpm typecheck` passes with zero errors
6. Visually Hidden renders correctly in Storybook with autodocs
7. Content wrapped in Visually Hidden is present in the DOM and accessible to screen readers
8. Content wrapped in Visually Hidden is not visible to sighted users
9. `asChild` correctly merges visually-hidden behavior onto the child element
10. vitest-axe reports no accessibility violations
