## Phase 1: Content Containers

### Goal

Implement four container components that manage content visibility, scrolling, and panel organization — Sheet, Tabs, Accordion, and Scroll Area — providing the foundational structural elements that content and navigation will be built upon.

### Deliverables

- **Sheet** — shadcn port using `@radix-ui/react-dialog` with `side` variants (top, right, bottom, left). Sub-components: SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, SheetClose. Content slides in from the specified edge with overlay backdrop.
- **Tabs** — shadcn port wrapping `@radix-ui/react-tabs`. Sub-components: TabsList, TabsTrigger, TabsContent. Supports controlled and uncontrolled modes.
- **Accordion** — shadcn port wrapping `@radix-ui/react-accordion` with `type="single"` and `type="multiple"` modes. Sub-components: AccordionItem, AccordionTrigger, AccordionContent. Animated open/close transitions via CSS height animation.
- **Scroll Area** — shadcn port wrapping `@radix-ui/react-scroll-area`. Sub-components: ScrollArea, ScrollBar. Supports vertical and horizontal scrollbar variants with theme-matched custom scrollbar styling.

Each component follows the 5-file pattern (`*.tsx`, `*.styles.ts`, `*.types.ts`, `*.test.tsx`, `*.stories.tsx`). All components must be exported from `packages/ui/src/index.ts`.

### Technical Decisions & Constraints

- Sheet reuses `@radix-ui/react-dialog` (already installed from Milestone 1) — it is a dialog variant that slides in from an edge rather than centering.
- New Radix packages to install: `@radix-ui/react-tabs`, `@radix-ui/react-accordion`, `@radix-ui/react-scroll-area`.
- All styling uses Tailwind v4 utility classes with OKLCH semantic tokens from `globals.css`. No new tokens are needed.
- Accordion animation uses CSS height transitions (animate from 0 to auto height).
- Follow React 19 conventions: ref-as-prop (no forwardRef), `data-slot` attributes, `cn()` for class merging.
- Storybook stories use CSF3 format with `tags: ['autodocs']`.
- Tests include vitest-axe accessibility assertions.

### Exit Criteria (phase-specific)

1. All 4 components render correctly in Storybook with all variants documented
2. `pnpm test` passes with vitest-axe accessibility assertions for every component
3. `pnpm typecheck` passes with no errors
4. Sheet slides in from the correct edge based on `side` prop
5. Accordion animates open/close and supports single and multiple open sections
6. Scroll Area renders custom scrollbars that match the theme

### Dependencies

- **Milestone 1 complete** — provides the monorepo infrastructure (Turborepo, pnpm, Storybook, Vitest, build pipeline) and the Button component (used by Sheet close button).
- **Milestone 2 complete** — provides form controls.
- `@radix-ui/react-dialog` is already installed (Sheet reuses it).
- No dependency on other phases within this milestone.
