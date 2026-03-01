# Task 3: Collapsible

## Objective

Implement the Collapsible component — a shadcn port wrapping `@radix-ui/react-collapsible` — following the 5-file pattern. Collapsible is a compound component providing primitive expand/collapse toggle behavior. It is simpler than Accordion (Milestone 3) and used as a building block by the Sidebar component (Milestone 3).

## Deliverables

### Files to Create

| File                                                             | Purpose                                               |
| ---------------------------------------------------------------- | ----------------------------------------------------- |
| `packages/ui/src/components/collapsible/collapsible.tsx`         | Implementation wrapping `@radix-ui/react-collapsible` |
| `packages/ui/src/components/collapsible/collapsible.styles.ts`   | Const string exports for sub-component styles         |
| `packages/ui/src/components/collapsible/collapsible.types.ts`    | TypeScript props types for all sub-components         |
| `packages/ui/src/components/collapsible/collapsible.test.tsx`    | Vitest + Testing Library + vitest-axe tests           |
| `packages/ui/src/components/collapsible/collapsible.stories.tsx` | Storybook CSF3 stories with autodocs                  |

### Files to Modify

| File                       | Action                                                                                              |
| -------------------------- | --------------------------------------------------------------------------------------------------- |
| `packages/ui/src/index.ts` | Add exports for `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`, and all associated types |

## Implementation Details

### collapsible.tsx

Three named exports:

- **`Collapsible`** — bare re-export of `CollapsiblePrimitive.Root` (`const Collapsible = CollapsiblePrimitive.Root`). No `data-slot` on root because it is a logical provider, not a rendered element (same pattern as `Dialog = DialogPrimitive.Root`)
- **`CollapsibleTrigger`** — wraps `CollapsiblePrimitive.Trigger` with `data-slot="collapsible-trigger"`, `cn()` className merging, and ref-as-prop
- **`CollapsibleContent`** — wraps `CollapsiblePrimitive.Content` with `data-slot="collapsible-content"`, animation classes from styles, `cn()` className merging, and ref-as-prop

### collapsible.styles.ts

Const string exports (same pattern as Dialog):

- `collapsibleTriggerStyles` — empty string (`''`). The trigger has no default visual styling; consumers apply their own styles (e.g., a button with an icon)
- `collapsibleContentStyles` — `'overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-top-0 data-[state=closed]:slide-out-to-top-0'`. Uses `tailwindcss-animate` built-in utilities (already available via the plugin in `globals.css`) — no custom keyframes needed

### collapsible.types.ts

Three type exports:

- `CollapsibleProps` extending `React.ComponentProps<typeof CollapsiblePrimitive.Root>`
- `CollapsibleTriggerProps` extending `React.ComponentProps<typeof CollapsiblePrimitive.Trigger>`
- `CollapsibleContentProps` extending `React.ComponentProps<typeof CollapsiblePrimitive.Content>`

### collapsible.test.tsx

Required tests:

- Smoke render (collapsed by default)
- Toggles content visibility on trigger click
- `defaultOpen` prop renders content visible initially
- Controlled mode (`open`/`onOpenChange`) works correctly
- Keyboard activation (Enter/Space on trigger)
- `data-slot` attributes present on trigger and content
- Custom className merging on all sub-components
- vitest-axe accessibility check

### collapsible.stories.tsx

Required stories (CSF3 with `tags: ['autodocs']`):

- Default (collapsed)
- DefaultOpen
- Controlled (with React state toggle)
- WithMultipleItems (showing list expand pattern)
- Animated transition demo

## Important Notes

- Collapsible supports both controlled (`open`/`onOpenChange`) and uncontrolled (`defaultOpen`) modes — matching the Radix primitive API and the Dialog pattern
- Style const strings are NOT exported from `index.ts` — they are internal implementation details, consistent with Dialog
- The root `Collapsible` component is a bare re-export — no wrapping function needed

## Dependencies

- **Task 0** (Install Radix dependencies) must be completed first
- Uses `@radix-ui/react-collapsible` primitive
- Uses `cn()` from `@components/utils`
- Uses `tailwindcss-animate` utilities (already available in `globals.css`)
- Reference Dialog component (`packages/ui/src/components/dialog/`) for compound component pattern
- Can be implemented in parallel with Task 1 (Label) and Task 2 (Visually Hidden)

## Verification Criteria

1. All 5 files exist in `packages/ui/src/components/collapsible/`
2. `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`, and all types are exported from `packages/ui/src/index.ts`
3. Style const strings are NOT exported from `index.ts`
4. `pnpm test` passes with zero failures for collapsible tests
5. `pnpm typecheck` passes with zero errors
6. Collapsible renders correctly in Storybook with autodocs
7. Content toggles visibility on trigger click
8. `defaultOpen` prop renders content visible initially
9. Controlled mode (`open`/`onOpenChange`) works correctly
10. Keyboard activation (Enter/Space) toggles content
11. Content animates smoothly during open/close using `tailwindcss-animate` utilities
12. vitest-axe reports no accessibility violations
