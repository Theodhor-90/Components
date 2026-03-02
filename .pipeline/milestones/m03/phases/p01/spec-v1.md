Now I have complete context. Let me produce the phase specification.

# Phase 1: Content Containers — Detailed Specification

## Goal

Implement four container components — Sheet, Tabs, Accordion, and Scroll Area — that manage content visibility, scrolling, and panel organization, providing the foundational structural elements upon which navigation and application shell components in later phases will be built. Each component is a shadcn/ui port built on Radix UI primitives, follows the 5-file pattern, and ships with full Storybook documentation and vitest-axe accessibility tests.

## Design Decisions

### Sheet reuses `@radix-ui/react-dialog`

Sheet is architecturally a Dialog variant — it uses the same portal, overlay, focus-trap, and ESC-to-close behavior but positions its content panel at a screen edge instead of center. The `@radix-ui/react-dialog` package is already installed from Milestone 1's Dialog component. Sheet will import it independently and apply slide-in positioning via CVA `side` variants (`top`, `right`, `bottom`, `left`). The overlay will use the same semi-transparent backdrop pattern established by Dialog.

### CVA side variants for Sheet

The `sheetContentVariants` CVA definition will encode four `side` variants controlling both the fixed position (`inset-x-0 top-0`, `inset-y-0 right-0`, etc.) and the corresponding CSS slide-in animation direction. The `side` prop defaults to `"right"` to match shadcn/ui behavior. Animation uses `data-[state=open]` / `data-[state=closed]` selectors with `tailwindcss-animate` classes (`slide-in-from-right`, `slide-in-from-left`, etc.).

### Accordion height animation

Accordion open/close animation uses Radix's built-in `--radix-accordion-content-height` CSS variable. The content wrapper transitions from `h-0 overflow-hidden` to `h-[var(--radix-accordion-content-height)]` using `tailwindcss-animate`'s `animate-accordion-down` / `animate-accordion-up` keyframes. These keyframes must be verified in `globals.css` — if absent, they will be added during the Accordion task.

### Scroll Area scrollbar styling

Scroll Area replaces the browser's native scrollbar with Radix's custom scrollbar primitives. Scrollbar thumb uses `bg-border` (matching the theme's border color) with `rounded-full` for a pill shape. The scrollbar track is transparent. Both vertical and horizontal orientations are supported via the `orientation` prop on `ScrollBar`.

### New Radix dependencies

Three new packages must be installed: `@radix-ui/react-tabs`, `@radix-ui/react-accordion`, `@radix-ui/react-scroll-area`. These are added to `packages/ui/package.json` under `dependencies`.

### No new design tokens

All four components use the existing OKLCH semantic tokens defined in `globals.css`. Sheet uses `bg-background`, `border-border`, and overlay backdrop. Tabs uses `bg-muted`, `text-muted-foreground`, `bg-background`. Accordion uses `border-border`. Scroll Area uses `bg-border` for thumb.

## Tasks

### Task 1: Install Radix dependencies

**Deliverables:**

- Install `@radix-ui/react-tabs`, `@radix-ui/react-accordion`, and `@radix-ui/react-scroll-area` in `packages/ui`
- Verify accordion animation keyframes exist in `globals.css` (`animate-accordion-down`, `animate-accordion-up`); if absent, add the `@keyframes accordion-down` (from `height: 0` to `height: var(--radix-accordion-content-height)`) and `@keyframes accordion-up` (reverse) definitions plus the corresponding `animate-accordion-down` / `animate-accordion-up` utility mappings
- Run `pnpm typecheck` to confirm no regressions

### Task 2: Sheet component

**Deliverables:**

- `packages/ui/src/components/sheet/sheet.types.ts` — Types for Sheet, SheetTrigger, SheetClose, SheetContent (with `side` prop typed as `"top" | "right" | "bottom" | "left"`), SheetHeader, SheetFooter, SheetTitle, SheetDescription. `SheetContentProps` extends `React.ComponentProps<typeof DialogPrimitive.Content>` combined with `VariantProps<typeof sheetContentVariants>`.
- `packages/ui/src/components/sheet/sheet.styles.ts` — `sheetOverlayStyles` (fixed inset-0, semi-transparent backdrop with fade animation), `sheetContentVariants` CVA with `side` variant encoding edge positioning and slide animation per side, plus static style strings for `sheetHeaderStyles`, `sheetFooterStyles`, `sheetTitleStyles`, `sheetDescriptionStyles`.
- `packages/ui/src/components/sheet/sheet.tsx` — Sheet (re-export of `DialogPrimitive.Root`), SheetTrigger (re-export of `DialogPrimitive.Trigger`), SheetClose (re-export of `DialogPrimitive.Close`), SheetPortal (re-export of `DialogPrimitive.Portal`), SheetOverlay (styled overlay with fade animation), SheetContent (wraps Portal + Overlay + Primitive.Content with side variant styling and embedded close button with X icon), SheetHeader, SheetFooter, SheetTitle (wraps `DialogPrimitive.Title`), SheetDescription (wraps `DialogPrimitive.Description`). Every sub-component has a `data-slot` attribute.
- `packages/ui/src/components/sheet/sheet.test.tsx` — Tests covering: smoke render, rendering from each side (top/right/bottom/left), overlay presence, close on ESC, close on overlay click, SheetTitle and SheetDescription rendering, focus trapping within SheetContent, custom className merging, data-slot attributes, vitest-axe accessibility check.
- `packages/ui/src/components/sheet/sheet.stories.tsx` — CSF3 stories: Default (right side), Left, Top, Bottom, WithForm (form inside sheet), WithLongContent (scrollable sheet content). Meta includes `tags: ['autodocs']`.
- Exports added to `packages/ui/src/index.ts` for all sub-components, their types, and `sheetContentVariants`.

### Task 3: Tabs component

**Deliverables:**

- `packages/ui/src/components/tabs/tabs.types.ts` — Types for Tabs, TabsList, TabsTrigger, TabsContent. `TabsProps` extends `React.ComponentProps<typeof TabsPrimitive.Root>`. `TabsTriggerProps` extends `React.ComponentProps<typeof TabsPrimitive.Trigger>`.
- `packages/ui/src/components/tabs/tabs.styles.ts` — `tabsListStyles` (inline-flex with muted background, rounded, padding), `tabsTriggerStyles` (inline-flex items-center, rounded-md, transition, `data-[state=active]` styling with bg-background and shadow), `tabsContentStyles` (margin-top, focus-visible ring).
- `packages/ui/src/components/tabs/tabs.tsx` — Tabs (re-export of `TabsPrimitive.Root`), TabsList (styled list container), TabsTrigger (styled trigger with active state), TabsContent (styled content panel). Each sub-component has a `data-slot` attribute. Supports controlled (`value`/`onValueChange`) and uncontrolled (`defaultValue`) modes via Radix's built-in API.
- `packages/ui/src/components/tabs/tabs.test.tsx` — Tests covering: smoke render with default tab selected, switching tabs via click, keyboard navigation (arrow keys between triggers, Enter/Space to activate), controlled mode with `value`/`onValueChange`, uncontrolled mode with `defaultValue`, only active TabsContent is visible, custom className merging, data-slot attributes, vitest-axe accessibility check.
- `packages/ui/src/components/tabs/tabs.stories.tsx` — CSF3 stories: Default (3 tabs with content), Controlled, ManyTabs (overflow behavior), WithDisabledTab, WithIcons (tabs with icon + label). Meta includes `tags: ['autodocs']`.
- Exports added to `packages/ui/src/index.ts`.

### Task 4: Accordion component

**Deliverables:**

- `packages/ui/src/components/accordion/accordion.types.ts` — Types for Accordion, AccordionItem, AccordionTrigger, AccordionContent. `AccordionProps` uses a discriminated union or Radix's own types to support both `type="single"` (with `collapsible` option) and `type="multiple"` modes.
- `packages/ui/src/components/accordion/accordion.styles.ts` — `accordionItemStyles` (border-bottom), `accordionTriggerStyles` (flex with justify-between, py-4, font-medium, chevron-down icon rotation via `[&[data-state=open]>svg]:rotate-180` transition), `accordionContentStyles` (overflow-hidden, animated height via `data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up`, inner padding).
- `packages/ui/src/components/accordion/accordion.tsx` — Accordion (re-export of `AccordionPrimitive.Root`), AccordionItem (styled item with border), AccordionTrigger (styled trigger with embedded ChevronDown icon that rotates on open), AccordionContent (animated content wrapper with inner div for padding). Each sub-component has a `data-slot` attribute.
- `packages/ui/src/components/accordion/accordion.test.tsx` — Tests covering: smoke render, single mode (opening one item closes others), multiple mode (multiple items open simultaneously), collapsible single mode (re-clicking closes the open item), animated height transition (content has correct animation classes), keyboard navigation (Enter/Space to toggle, arrow keys between triggers), custom className merging, data-slot attributes, vitest-axe accessibility check.
- `packages/ui/src/components/accordion/accordion.stories.tsx` — CSF3 stories: Single (one at a time), Multiple (multiple open), Collapsible (single that can fully close), WithNestedContent (rich content inside items), DefaultOpen (item open by default). Meta includes `tags: ['autodocs']`.
- Exports added to `packages/ui/src/index.ts`.

### Task 5: Scroll Area component

**Deliverables:**

- `packages/ui/src/components/scroll-area/scroll-area.types.ts` — Types for ScrollArea and ScrollBar. `ScrollAreaProps` extends `React.ComponentProps<typeof ScrollAreaPrimitive.Root>`. `ScrollBarProps` extends `React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>` with `orientation` defaulting to `"vertical"`.
- `packages/ui/src/components/scroll-area/scroll-area.styles.ts` — `scrollAreaStyles` (relative, overflow-hidden), `scrollAreaViewportStyles` (h-full, w-full, rounded-inherit), `scrollBarStyles` (flex, touch-none, select-none, transition-colors, with orientation-specific sizing: vertical gets `h-full w-2.5 border-l border-l-transparent p-px`, horizontal gets `h-2.5 flex-col border-t border-t-transparent p-px`), `scrollBarThumbStyles` (relative, flex-1, rounded-full, bg-border).
- `packages/ui/src/components/scroll-area/scroll-area.tsx` — ScrollArea (wraps `ScrollAreaPrimitive.Root` + `ScrollAreaPrimitive.Viewport` + default vertical `ScrollBar` + `ScrollAreaPrimitive.Corner`), ScrollBar (wraps `ScrollAreaPrimitive.Scrollbar` + `ScrollAreaPrimitive.Thumb` with orientation-aware styling). Each sub-component has a `data-slot` attribute.
- `packages/ui/src/components/scroll-area/scroll-area.test.tsx` — Tests covering: smoke render, renders with overflowing content, vertical scrollbar visibility, horizontal scrollbar when `type="always"` and horizontal ScrollBar is added, custom className merging, data-slot attributes, vitest-axe accessibility check.
- `packages/ui/src/components/scroll-area/scroll-area.stories.tsx` — CSF3 stories: Vertical (tall content list), Horizontal (wide content), BothDirections (both scrollbars), WithTags (horizontal tag list), CustomHeight (fixed height container). Meta includes `tags: ['autodocs']`.
- Exports added to `packages/ui/src/index.ts`.

### Task 6: Integration verification

**Deliverables:**

- Run `pnpm typecheck` — zero errors across all packages
- Run `pnpm test` — all tests pass including vitest-axe assertions for all four new components
- Run `pnpm build` — clean build with no warnings
- Verify all new exports are accessible from `@components/ui` by checking `packages/ui/src/index.ts` contains all sub-components and types
- Verify Storybook renders all four components with autodocs

## Exit Criteria

1. All 4 components (Sheet, Tabs, Accordion, Scroll Area) render correctly in Storybook with all variants documented via autodocs
2. `pnpm test` passes with vitest-axe accessibility assertions for every component (zero test failures)
3. `pnpm typecheck` passes with no errors
4. Sheet slides in from the correct edge based on `side` prop (top, right, bottom, left) with overlay backdrop and close-on-ESC behavior
5. Tabs support controlled and uncontrolled modes with keyboard navigation between triggers
6. Accordion animates open/close using CSS height transitions and supports both `type="single"` and `type="multiple"` modes
7. Scroll Area renders custom-styled scrollbars (vertical and horizontal) that match the theme using `bg-border` for thumb color
8. All sub-components across all 4 components are exported from `packages/ui/src/index.ts` with their corresponding type exports and CVA variant exports

## Dependencies

1. **Milestone 1 complete** — provides the monorepo infrastructure (Turborepo, pnpm workspaces, Storybook, Vitest, TypeScript build pipeline), the `cn()` utility, and the Button component (used by Sheet's embedded close button)
2. **Milestone 2 complete** — provides form controls that may be composed inside Sheet and Tabs content areas
3. **`@radix-ui/react-dialog`** — already installed from Milestone 1; reused by Sheet
4. **`@radix-ui/react-slot`** — already installed; used by sub-components supporting `asChild`
5. **`tailwindcss-animate`** — already installed; provides animation utilities for Sheet slide-in and Accordion height transitions
6. **`lucide-react`** — already installed (used by Dialog's close button); needed for Sheet's close X icon and Accordion's ChevronDown icon
7. No dependency on Phase 2 or Phase 3 within this milestone

## Artifacts

| Artifact                                  | Type              | Description                                                                                                          |
| ----------------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| `packages/ui/src/components/sheet/`       | New directory     | 5 files: sheet.tsx, sheet.styles.ts, sheet.types.ts, sheet.test.tsx, sheet.stories.tsx                               |
| `packages/ui/src/components/tabs/`        | New directory     | 5 files: tabs.tsx, tabs.styles.ts, tabs.types.ts, tabs.test.tsx, tabs.stories.tsx                                    |
| `packages/ui/src/components/accordion/`   | New directory     | 5 files: accordion.tsx, accordion.styles.ts, accordion.types.ts, accordion.test.tsx, accordion.stories.tsx           |
| `packages/ui/src/components/scroll-area/` | New directory     | 5 files: scroll-area.tsx, scroll-area.styles.ts, scroll-area.types.ts, scroll-area.test.tsx, scroll-area.stories.tsx |
| `packages/ui/src/index.ts`                | Modified          | New exports for all Sheet, Tabs, Accordion, and Scroll Area sub-components, types, and variant functions             |
| `packages/ui/package.json`                | Modified          | New dependencies: `@radix-ui/react-tabs`, `@radix-ui/react-accordion`, `@radix-ui/react-scroll-area`                 |
| `packages/ui/styles/globals.css`          | Possibly modified | Accordion animation keyframes if not already present                                                                 |
