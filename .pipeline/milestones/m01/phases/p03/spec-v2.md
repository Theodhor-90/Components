Now I have all the information needed. Let me produce the revised specification.

# Phase 3 Specification: Accessibility Primitives

## Goal

Deliver the three foundational accessibility components — Label, Visually Hidden, and Collapsible — that complete Milestone 1 and provide the infrastructure required by form controls (Milestone 2) and layout/navigation patterns (Milestone 3). Each component wraps a Radix UI primitive, follows the established 5-file pattern, and ships with full test coverage and Storybook documentation.

## Design Decisions

### DD-1: Label uses CVA for variant management

Label is a single-element Radix wrapper, like Separator. Following the Separator precedent, Label will use `cva()` in its `.styles.ts` file with base styles only (no variants initially). This keeps the styling approach consistent with how other single-element Radix wrappers are implemented in the library.

### DD-2: Visually Hidden has no CVA variants

Visually Hidden is a pure accessibility utility — it renders content off-screen for screen readers only. There are no visual variants. The `.styles.ts` file will export an empty const string (`export const visuallyHiddenStyles = ''`) to satisfy the 5-file pattern contract. The Radix primitive applies its own inline styles for screen-reader-only rendering, so no additional Tailwind styling is needed.

### DD-3: Collapsible uses const-string styles like Dialog

Collapsible is a compound component (Root, Trigger, Content) following the same Radix wrapping pattern as Dialog and Popover. Its `.styles.ts` file will export const strings for each sub-component. CollapsibleContent will use `tailwindcss-animate` built-in utilities (`animate-in`/`animate-out` with `slide-in-from-top-0`/`slide-out-to-top-0`) via `data-[state=open]`/`data-[state=closed]` selectors, consistent with how Dialog uses the same plugin for its overlay and content animations. No custom keyframes are needed.

### DD-4: Collapsible supports controlled and uncontrolled modes

Following the Radix primitive API, Collapsible will expose both `open`/`onOpenChange` props (controlled) and `defaultOpen` prop (uncontrolled). This mirrors how Dialog exposes both modes and ensures Collapsible works as a building block for Sidebar (Milestone 3).

### DD-5: Label supports `asChild` via Radix primitive

The Radix `@radix-ui/react-label` primitive supports `asChild` natively. Our Label wrapper will pass through `asChild` so consumers can render custom elements while preserving label semantics — consistent with how Button handles `asChild`.

### DD-6: Visually Hidden supports `asChild` via Radix primitive

The Radix `@radix-ui/react-visually-hidden` primitive supports `asChild` per the official Radix API. When `asChild` is `true`, the component does not render its own `<span>` and instead merges its visually-hidden behavior onto the child element. This is useful when a consumer needs to make an existing element visually hidden (e.g., a `<label>` that should be screen-reader-only). Our wrapper will pass through `asChild`.

### DD-7: No `forwardRef` — React 19 ref-as-prop

All three components accept `ref` as a regular prop destructured from their props type, following the React 19 convention established by Button and every other component in the library.

### DD-8: Collapsible Root is a bare re-export

Following the Dialog precedent, `Collapsible` is a bare re-export of `CollapsiblePrimitive.Root` (`const Collapsible = CollapsiblePrimitive.Root`). The root element does not need `data-slot` because it is a logical provider that does not render a visible DOM element — it manages open/closed state and provides context to its children. Only the rendered sub-components (`CollapsibleTrigger`, `CollapsibleContent`) receive `data-slot` attributes.

## Tasks

### Task 0: Install Radix dependencies

**Deliverables:**

- Install `@radix-ui/react-label`, `@radix-ui/react-visually-hidden`, and `@radix-ui/react-collapsible` as dependencies in `packages/ui/package.json`
- Verify all three packages resolve correctly and `pnpm typecheck` still passes

### Task 1: Label

**Deliverables:**

- `packages/ui/src/components/label/label.tsx` — Wraps `@radix-ui/react-label` Root. Accepts `ref`, `className`, `asChild`, and all standard `<label>` props. Applies `data-slot="label"` and merges className via `cn()` with CVA variants. Supports `peer-disabled:cursor-not-allowed peer-disabled:opacity-50` for automatic disabled styling when paired with a disabled form input
- `packages/ui/src/components/label/label.styles.ts` — CVA definition with base styles: `text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50`. No variants initially (default only)
- `packages/ui/src/components/label/label.types.ts` — `LabelProps` extending `React.ComponentProps<typeof LabelPrimitive.Root>` intersected with `VariantProps<typeof labelVariants>`
- `packages/ui/src/components/label/label.test.tsx` — Tests: smoke render, renders correct text, renders as `<label>` element, `htmlFor` attribute binding, `data-slot="label"` present, `asChild` renders as child element, custom className merging, vitest-axe accessibility check (paired with an input)
- `packages/ui/src/components/label/label.stories.tsx` — Stories: Default, WithInput (label + input pairing), Disabled (paired with disabled input showing disabled style), AsChild
- Export `Label`, `LabelProps`, and `labelVariants` from `packages/ui/src/index.ts`

### Task 2: Visually Hidden

**Deliverables:**

- `packages/ui/src/components/visually-hidden/visually-hidden.tsx` — Wraps `@radix-ui/react-visually-hidden` Root. Accepts `ref`, `className`, `asChild`, children, and standard HTML props. Applies `data-slot="visually-hidden"`. Minimal wrapper — the Radix primitive handles all off-screen positioning via inline styles
- `packages/ui/src/components/visually-hidden/visually-hidden.styles.ts` — Exports `export const visuallyHiddenStyles = ''` (the Radix primitive applies its own inline styles for screen-reader-only rendering; no additional Tailwind styling is needed; the empty const satisfies the 5-file pattern contract)
- `packages/ui/src/components/visually-hidden/visually-hidden.types.ts` — `VisuallyHiddenProps` extending `React.ComponentProps<typeof VisuallyHiddenPrimitive.Root>`
- `packages/ui/src/components/visually-hidden/visually-hidden.test.tsx` — Tests: smoke render, content is in DOM but visually hidden (not visible to sighted users), screen reader accessible (role/text queries find the content), `data-slot="visually-hidden"` present, `asChild` renders as child element (renders child `<span>` instead of its own `<span>`, merging visually-hidden behavior onto the child), vitest-axe accessibility check
- `packages/ui/src/components/visually-hidden/visually-hidden.stories.tsx` — Stories: Default (with explanation text), WithIconButton (icon-only button with visually hidden label — the primary use case), AsChild (demonstrating `asChild` merging onto a child `<span>`)
- Export `VisuallyHidden` and `VisuallyHiddenProps` from `packages/ui/src/index.ts`. The `visuallyHiddenStyles` const is NOT exported from `index.ts` — it is an internal implementation detail, consistent with how Dialog's style const strings are not exported

### Task 3: Collapsible

**Deliverables:**

- `packages/ui/src/components/collapsible/collapsible.tsx` — Wraps `@radix-ui/react-collapsible`:
  - `Collapsible` — bare re-export of `CollapsiblePrimitive.Root` (`const Collapsible = CollapsiblePrimitive.Root`). No `data-slot` on root because it is a logical provider, not a rendered element (same pattern as `Dialog = DialogPrimitive.Root`)
  - `CollapsibleTrigger` — wraps `CollapsiblePrimitive.Trigger` with `data-slot="collapsible-trigger"`, `cn()` className merging, and ref-as-prop
  - `CollapsibleContent` — wraps `CollapsiblePrimitive.Content` with `data-slot="collapsible-content"`, animation classes, `cn()` className merging, and ref-as-prop
- `packages/ui/src/components/collapsible/collapsible.styles.ts` — Const string exports:
  - `collapsibleTriggerStyles` — empty string (`''`). The trigger has no default visual styling; consumers apply their own styles (e.g., a button with an icon)
  - `collapsibleContentStyles` — `'overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-top-0 data-[state=closed]:slide-out-to-top-0'`. Uses `tailwindcss-animate` built-in utilities (already available via the plugin in `globals.css`) — no custom keyframes needed
- `packages/ui/src/components/collapsible/collapsible.types.ts` — Types: `CollapsibleProps` (extending `CollapsiblePrimitive.Root`), `CollapsibleTriggerProps` (extending `CollapsiblePrimitive.Trigger`), `CollapsibleContentProps` (extending `CollapsiblePrimitive.Content`)
- `packages/ui/src/components/collapsible/collapsible.test.tsx` — Tests: smoke render (collapsed by default), toggles content visibility on trigger click, `defaultOpen` prop renders content visible initially, controlled mode (`open`/`onOpenChange`), keyboard activation (Enter/Space on trigger), `data-slot` attributes on trigger and content, custom className merging on all sub-components, vitest-axe accessibility check
- `packages/ui/src/components/collapsible/collapsible.stories.tsx` — Stories: Default (collapsed), DefaultOpen, Controlled (with React state toggle), WithMultipleItems (showing list expand pattern), animated transition demo
- Export `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`, and all associated types from `packages/ui/src/index.ts`. Style const strings are NOT exported — they are internal implementation details, consistent with Dialog

### Task 4: Milestone 1 completion verification

**Deliverables:**

- Run `pnpm test` across the full `packages/ui` workspace and confirm zero failures for all 13 Milestone 1 components
- Run `pnpm typecheck` across the monorepo and confirm zero errors
- Verify all 13 components render in Storybook (`pnpm storybook`) with autodocs
- Verify `packages/ui/src/index.ts` exports all 13 components, their props types, and their CVA variant functions (where applicable)

## Exit Criteria

1. Label, Visually Hidden, and Collapsible are implemented following the 5-file pattern (`.tsx`, `.styles.ts`, `.types.ts`, `.test.tsx`, `.stories.tsx`)
2. All three components render correctly in Storybook with all documented stories and `tags: ['autodocs']`
3. `pnpm test` passes with zero failures, including vitest-axe accessibility assertions for all three components
4. `pnpm typecheck` passes with zero errors across the monorepo
5. Label correctly associates with form inputs via `htmlFor` and shows disabled styling when paired with a disabled input via the `peer` Tailwind modifier
6. Visually Hidden content is present in the DOM and accessible to screen readers but not visible to sighted users
7. Collapsible toggles content visibility on trigger click and supports both controlled (`open`/`onOpenChange`) and uncontrolled (`defaultOpen`) modes
8. Collapsible content animates smoothly during open/close transitions using `tailwindcss-animate` built-in utilities
9. All three components and their associated types are exported from `packages/ui/src/index.ts`
10. All 13 Milestone 1 components pass `pnpm test` and `pnpm typecheck` (full milestone verification)

## Dependencies

### Required before this phase

- **Phase 1 (Display Primitives)** — completed. Established the 5-file pattern, CVA styling approach, and validated the development workflow with 6 non-interactive components
- **Phase 2 (Overlay Primitives)** — completed. Validated the Radix UI wrapping pattern for compound components (`@radix-ui/react-dialog`, `@radix-ui/react-alert-dialog`, `@radix-ui/react-popover`) and third-party library integration (`sonner`)
- **Existing infrastructure** — monorepo scaffolding, `cn()` utility, `globals.css` theme (including `tailwindcss-animate` plugin), Storybook configuration, Vitest + vitest-axe test setup, Button reference implementation

### New dependencies to install

- `@radix-ui/react-label` — Radix primitive for accessible labels
- `@radix-ui/react-visually-hidden` — Radix primitive for screen-reader-only content
- `@radix-ui/react-collapsible` — Radix primitive for expand/collapse behavior

## Artifacts

| Artifact                                                                 | Action                                                      |
| ------------------------------------------------------------------------ | ----------------------------------------------------------- |
| `packages/ui/src/components/label/label.tsx`                             | Create                                                      |
| `packages/ui/src/components/label/label.styles.ts`                       | Create                                                      |
| `packages/ui/src/components/label/label.types.ts`                        | Create                                                      |
| `packages/ui/src/components/label/label.test.tsx`                        | Create                                                      |
| `packages/ui/src/components/label/label.stories.tsx`                     | Create                                                      |
| `packages/ui/src/components/visually-hidden/visually-hidden.tsx`         | Create                                                      |
| `packages/ui/src/components/visually-hidden/visually-hidden.styles.ts`   | Create                                                      |
| `packages/ui/src/components/visually-hidden/visually-hidden.types.ts`    | Create                                                      |
| `packages/ui/src/components/visually-hidden/visually-hidden.test.tsx`    | Create                                                      |
| `packages/ui/src/components/visually-hidden/visually-hidden.stories.tsx` | Create                                                      |
| `packages/ui/src/components/collapsible/collapsible.tsx`                 | Create                                                      |
| `packages/ui/src/components/collapsible/collapsible.styles.ts`           | Create                                                      |
| `packages/ui/src/components/collapsible/collapsible.types.ts`            | Create                                                      |
| `packages/ui/src/components/collapsible/collapsible.test.tsx`            | Create                                                      |
| `packages/ui/src/components/collapsible/collapsible.stories.tsx`         | Create                                                      |
| `packages/ui/src/index.ts`                                               | Modify — add exports for Label, VisuallyHidden, Collapsible |
| `packages/ui/package.json`                                               | Modify — add 3 Radix dependencies                           |
