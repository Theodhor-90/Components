I have enough context from the codebase exploration and the master plan. Let me now produce the specification.

# Phase 3 Specification: Accessibility Primitives

## Goal

Deliver the three foundational accessibility components — Label, Visually Hidden, and Collapsible — that complete Milestone 1 and provide the infrastructure required by form controls (Milestone 2) and layout/navigation patterns (Milestone 3). Each component wraps a Radix UI primitive, follows the established 5-file pattern, and ships with full test coverage and Storybook documentation.

## Design Decisions

### DD-1: Label uses CVA for variant management (not const strings)

Label is a single-element component like Separator, not a compound component like Dialog. Following the Separator precedent, Label will use `cva()` in its `.styles.ts` file rather than the const-string pattern used by Dialog/AlertDialog. This keeps the styling composable and allows future variant additions (e.g., `required` visual indicator) without restructuring.

### DD-2: Visually Hidden has no CVA variants

Visually Hidden is a pure accessibility utility — it renders content off-screen for screen readers only. There are no visual variants. The `.styles.ts` file will export a single const string of Tailwind classes (or rely entirely on the Radix primitive's built-in behavior). The component's API is intentionally minimal: children content and standard HTML props.

### DD-3: Collapsible uses const-string styles like Dialog

Collapsible is a compound component (Root, Trigger, Content) following the same Radix wrapping pattern as Dialog and Popover. Its `.styles.ts` file will export const strings for each sub-component. CollapsibleContent will include `data-[state=open]`/`data-[state=closed]` animation classes using `tailwindcss-animate` for smooth open/close transitions, consistent with Dialog's overlay animations.

### DD-4: Collapsible supports controlled and uncontrolled modes

Following the Radix primitive API, Collapsible will expose both `open`/`onOpenChange` props (controlled) and `defaultOpen` prop (uncontrolled). This mirrors how Dialog exposes both modes and ensures Collapsible works as a building block for Sidebar (Milestone 3).

### DD-5: Label supports `asChild` via Radix primitive

The Radix `@radix-ui/react-label` primitive supports `asChild` natively. Our Label wrapper will pass through `asChild` so consumers can render custom elements while preserving label semantics — consistent with how Button handles `asChild`.

### DD-6: No `forwardRef` — React 19 ref-as-prop

All three components accept `ref` as a regular prop destructured from their props type, following the React 19 convention established by Button and every other component in the library.

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

- `packages/ui/src/components/visually-hidden/visually-hidden.tsx` — Wraps `@radix-ui/react-visually-hidden` Root. Accepts `ref`, `className`, `asChild`, children, and standard HTML props. Applies `data-slot="visually-hidden"`. Minimal wrapper — the Radix primitive handles all off-screen positioning
- `packages/ui/src/components/visually-hidden/visually-hidden.styles.ts` — Exports an empty/minimal const string (the Radix primitive applies its own inline styles for screen-reader-only rendering; no additional Tailwind styling needed)
- `packages/ui/src/components/visually-hidden/visually-hidden.types.ts` — `VisuallyHiddenProps` extending `React.ComponentProps<typeof VisuallyHiddenPrimitive.Root>`
- `packages/ui/src/components/visually-hidden/visually-hidden.test.tsx` — Tests: smoke render, content is in DOM but visually hidden (not visible to sighted users), screen reader accessible (role/text queries find the content), `data-slot="visually-hidden"` present, `asChild` renders as child element, vitest-axe accessibility check
- `packages/ui/src/components/visually-hidden/visually-hidden.stories.tsx` — Stories: Default (with explanation text), WithIconButton (icon-only button with visually hidden label — the primary use case), AsChild
- Export `VisuallyHidden` and `VisuallyHiddenProps` from `packages/ui/src/index.ts`

### Task 3: Collapsible

**Deliverables:**

- `packages/ui/src/components/collapsible/collapsible.tsx` — Wraps `@radix-ui/react-collapsible`:
  - `Collapsible` — re-exports `CollapsiblePrimitive.Root` directly (like `Dialog = DialogPrimitive.Root`)
  - `CollapsibleTrigger` — wraps `CollapsiblePrimitive.Trigger` with `data-slot="collapsible-trigger"`, `cn()` className merging, and ref forwarding
  - `CollapsibleContent` — wraps `CollapsiblePrimitive.Content` with `data-slot="collapsible-content"`, animation classes for smooth open/close transitions via `data-[state=open]`/`data-[state=closed]`, `cn()` className merging, and ref forwarding
- `packages/ui/src/components/collapsible/collapsible.styles.ts` — Const string exports:
  - `collapsibleTriggerStyles` — base trigger styles (minimal, as trigger styling is typically consumer-defined)
  - `collapsibleContentStyles` — overflow hidden + `data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up` transition classes
- `packages/ui/src/components/collapsible/collapsible.types.ts` — Types: `CollapsibleProps` (extending Root), `CollapsibleTriggerProps` (extending Trigger), `CollapsibleContentProps` (extending Content)
- `packages/ui/src/components/collapsible/collapsible.test.tsx` — Tests: smoke render (collapsed by default), toggles content visibility on trigger click, `defaultOpen` prop renders content visible initially, controlled mode (`open`/`onOpenChange`), keyboard activation (Enter/Space on trigger), `data-slot` attributes on trigger and content, custom className merging on all sub-components, vitest-axe accessibility check
- `packages/ui/src/components/collapsible/collapsible.stories.tsx` — Stories: Default (collapsed), DefaultOpen, Controlled (with React state toggle), WithMultipleItems (showing list expand pattern), animated transition demo
- Export `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`, and all associated types from `packages/ui/src/index.ts`

### Task 4: Milestone 1 completion verification

**Deliverables:**

- Run `pnpm test` across the full `packages/ui` workspace and confirm zero failures for all 13 Milestone 1 components
- Run `pnpm typecheck` across the monorepo and confirm zero errors
- Verify all 13 components render in Storybook (`pnpm storybook`) with autodocs
- Verify `packages/ui/src/index.ts` exports all 13 components, their props types, and their CVA variant functions
- Confirm the collapsible open/close animation keyframes (`collapsible-down` / `collapsible-up`) are defined in `globals.css` or `tailwind.config` (add if missing)

## Exit Criteria

1. Label, Visually Hidden, and Collapsible are implemented following the 5-file pattern (`.tsx`, `.styles.ts`, `.types.ts`, `.test.tsx`, `.stories.tsx`)
2. All three components render correctly in Storybook with all documented stories and `tags: ['autodocs']`
3. `pnpm test` passes with zero failures, including vitest-axe accessibility assertions for all three components
4. `pnpm typecheck` passes with zero errors across the monorepo
5. Label correctly associates with form inputs via `htmlFor` and shows disabled styling when paired with a disabled input via the `peer` Tailwind modifier
6. Visually Hidden content is present in the DOM and accessible to screen readers but not visible to sighted users
7. Collapsible toggles content visibility on trigger click and supports both controlled (`open`/`onOpenChange`) and uncontrolled (`defaultOpen`) modes
8. Collapsible content animates smoothly during open/close transitions
9. All three components and their associated types are exported from `packages/ui/src/index.ts`
10. All 13 Milestone 1 components pass `pnpm test` and `pnpm typecheck` (full milestone verification)

## Dependencies

### Required before this phase

- **Phase 1 (Display Primitives)** — completed. Established the 5-file pattern, CVA styling approach, and validated the development workflow with 6 non-interactive components
- **Phase 2 (Overlay Primitives)** — completed. Validated the Radix UI wrapping pattern for compound components (`@radix-ui/react-dialog`, `@radix-ui/react-alert-dialog`, `@radix-ui/react-popover`) and third-party library integration (`sonner`)
- **Existing infrastructure** — monorepo scaffolding, `cn()` utility, `globals.css` theme, Storybook configuration, Vitest + vitest-axe test setup, Button reference implementation

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
| `packages/ui/styles/globals.css`                                         | Modify (if needed) — add collapsible animation keyframes    |
