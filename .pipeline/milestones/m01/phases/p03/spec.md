## Phase 3: Accessibility Primitives

### Goal

Implement the three components that provide foundational accessibility infrastructure — Label, Visually Hidden, and Collapsible. These are used extensively by form controls and interactive patterns in later milestones (Milestone 2: Form Controls, Milestone 3: Layout & Navigation).

### Deliverables

1. **Label** — shadcn port wrapping `@radix-ui/react-label`. Accessible form label with `htmlFor` binding. Used extensively by Form, Input, Checkbox, Switch, and other form controls in Milestone 2.
2. **Visually Hidden** — custom utility wrapping `@radix-ui/react-visually-hidden`. Renders content that is invisible visually but available to screen readers. Used for icon-only buttons and drag handles.
3. **Collapsible** — shadcn port wrapping `@radix-ui/react-collapsible`. Compound component with `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`. Primitive expand/collapse toggle. Simpler than Accordion (Milestone 3) and used as a building block by the Sidebar component (Milestone 3).

Each component must follow the 5-file pattern: `{name}.tsx`, `{name}.styles.ts`, `{name}.types.ts`, `{name}.test.tsx`, `{name}.stories.tsx`. Each component must be added to `packages/ui/src/index.ts`.

### Technical Decisions & Constraints

- All components follow the Button reference implementation's 5-file pattern
- React 19 conventions: ref-as-prop (no forwardRef), named exports only
- Use `data-slot="{name}"` on root elements; compound components use per-sub-component data-slot values
- Styling via Tailwind v4 utility classes with OKLCH semantic tokens from `globals.css`
- CVA for variant management; `cn()` for className merging
- `asChild` + Radix `Slot` for polymorphic rendering on leaf components
- Label provides `htmlFor` binding — critical for form accessibility in Milestone 2
- Visually Hidden is a custom component wrapping `@radix-ui/react-visually-hidden` — design API to be consistent with the library
- Collapsible is a building block for Sidebar (Milestone 3) and simpler than Accordion (Milestone 3)
- New dependencies to install: `@radix-ui/react-label`, `@radix-ui/react-visually-hidden`, `@radix-ui/react-collapsible`
- Tests must include vitest-axe accessibility assertions
- Stories must use CSF3 format with `tags: ['autodocs']`

### Dependencies on Prior Phases

- **Phase 1 (Display Primitives)** — Establishes the 5-file pattern and validates the development workflow.
- **Phase 2 (Overlay Primitives)** — No direct component dependency, but Phase 2 validates the Radix wrapping pattern that is reused here for Label, Visually Hidden, and Collapsible.

After Phase 3, all 13 components in Milestone 1 are complete. The milestone exit criteria require all 13 components to pass `pnpm test`, `pnpm typecheck`, and render correctly in Storybook.
