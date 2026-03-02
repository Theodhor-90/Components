## Task: Accordion component

### Objective

Implement the Accordion component — a shadcn/ui port wrapping `@radix-ui/react-accordion` with animated open/close transitions, supporting both `type="single"` (with optional `collapsible`) and `type="multiple"` modes.

### Deliverables

Create the 5-file component directory at `packages/ui/src/components/accordion/`:

1. **`accordion.types.ts`** — Types for Accordion, AccordionItem, AccordionTrigger, AccordionContent. `AccordionProps` uses a discriminated union or Radix's own types to support both `type="single"` (with `collapsible` option) and `type="multiple"` modes.

2. **`accordion.styles.ts`** — `accordionItemStyles` (border-bottom), `accordionTriggerStyles` (flex with justify-between, py-4, font-medium, chevron rotation via `[&[data-state=open]>svg]:rotate-180` transition), `accordionContentStyles` (overflow-hidden, animated height via `data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up`, inner padding).

3. **`accordion.tsx`** — Sub-components:
   - Accordion (re-export of `AccordionPrimitive.Root`)
   - AccordionItem (styled item with border)
   - AccordionTrigger (styled trigger with an embedded inline ChevronDown SVG: `<svg>` element with `width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"` and `<path d="m6 9 6 6 6-6"/>`, rotating 180° on open via CSS transition)
   - AccordionContent (animated content wrapper with inner div for padding)
   - Each sub-component has a `data-slot` attribute

4. **`accordion.test.tsx`** — Tests: smoke render, single mode (opening one item closes others), multiple mode (multiple items open simultaneously), collapsible single mode (re-clicking closes the open item), animated height transition (content has correct animation classes), keyboard navigation (Enter/Space to toggle, arrow keys between triggers), custom className merging, data-slot attributes, vitest-axe accessibility check.

5. **`accordion.stories.tsx`** — CSF3 stories: Single (one at a time), Multiple (multiple open), Collapsible (single that can fully close), WithNestedContent (rich content inside items), DefaultOpen (item open by default). Meta includes `tags: ['autodocs']`.

Add exports to `packages/ui/src/index.ts`.

### Key Constraints

- Animation uses Radix's built-in `--radix-accordion-content-height` CSS variable with `animate-accordion-down` / `animate-accordion-up` keyframes (verified/added in Task t01)
- Icons use inline SVGs — no icon library (project convention)
- Uses existing semantic token `border-border` for item borders
- Use `cn()` for className merging
- Named exports only, no default exports
- React 19 ref-as-prop (no forwardRef)

### Dependencies

- Task t01 (Radix dependencies installed — `@radix-ui/react-accordion`; accordion animation keyframes verified in globals.css)

### Verification

1. All test cases in `accordion.test.tsx` pass
2. vitest-axe reports no accessibility violations
3. Storybook renders all 5 stories with autodocs
4. Single mode: opening one item closes the previously open item
5. Multiple mode: multiple items can be open simultaneously
6. Collapsible mode: clicking an open item closes it
7. Chevron rotates 180° when item is open
8. `pnpm typecheck` passes
9. All exports present in `packages/ui/src/index.ts`
