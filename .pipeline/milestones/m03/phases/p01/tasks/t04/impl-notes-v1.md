- **`packages/ui/src/components/accordion/accordion.types.ts`** — Created. Exports `AccordionProps`, `AccordionItemProps`, `AccordionTriggerProps`, `AccordionContentProps` extending Radix primitive types.
- **`packages/ui/src/components/accordion/accordion.styles.ts`** — Created. Exports `accordionItemStyles`, `accordionTriggerStyles`, `accordionContentStyles`, `accordionContentInnerStyles` as static strings.
- **`packages/ui/src/components/accordion/accordion.tsx`** — Created. Implements `Accordion` (re-export of Root), `AccordionItem`, `AccordionTrigger` (with Header wrapper and inline chevron SVG), `AccordionContent` (with inner padding div). All sub-components have `data-slot` attributes.
- **`packages/ui/src/components/accordion/accordion.test.tsx`** — Created. 14 tests: smoke render, single mode exclusivity, multiple mode, collapsible toggle, non-collapsible persistence, animation classes, Enter/Space keyboard toggle, ArrowDown/ArrowUp navigation, defaultValue, data-slot attributes, className merging, axe accessibility.
- **`packages/ui/src/components/accordion/accordion.stories.tsx`** — Created. 5 CSF3 stories: Single, Multiple, Collapsible, WithNestedContent, DefaultOpen. Meta includes `tags: ['autodocs']`.
- **`packages/ui/src/index.ts`** — Modified. Added Accordion exports (4 components + 4 types) after Tabs exports.

Verification: 14/14 tests pass, 388/388 full suite pass, `pnpm typecheck` clean, `pnpm build` successful.
