## Phase 3: Application Shell

### Goal

Implement two custom components — Header and App Layout — that compose the Sidebar, header bar, and a scrollable main content area into a complete, responsive application shell, giving consumer apps a consistent top-level layout structure.

### Deliverables

- **Header** — custom component providing a top bar layout with a title slot (left), action button slots (right), and user info area. Uses `data-slot="header"`.
- **App Layout** — custom component that composes Sidebar + Header + a scrollable main content area with responsive behavior (sidebar collapses on small viewports). Provides a consistent layout structure across consumer apps.

Each component follows the 5-file pattern (`*.tsx`, `*.styles.ts`, `*.types.ts`, `*.test.tsx`, `*.stories.tsx`). All components must be exported from `packages/ui/src/index.ts`.

### Technical Decisions & Constraints

- Both components are **custom** (no shadcn/ui equivalent) — the API should be designed to feel consistent with the rest of the library.
- Header is a purely presentational layout component using slots (title, actions, user info) — no Radix primitives needed.
- App Layout composes the Sidebar from Phase 2 and the Header from this phase. It should provide responsive behavior where the sidebar collapses automatically on small viewports.
- No new design tokens are needed — all styling uses existing OKLCH semantic tokens including `sidebar-*` tokens.
- Follow React 19 conventions: ref-as-prop (no forwardRef), `data-slot` attributes, `cn()` for class merging.
- Storybook stories use CSF3 format with `tags: ['autodocs']`.
- Tests include vitest-axe accessibility assertions.

### Exit Criteria (phase-specific)

1. Both components render correctly in Storybook with all variants documented
2. `pnpm test` passes with vitest-axe accessibility assertions for every component
3. `pnpm typecheck` passes with no errors
4. App Layout renders sidebar, header, and content in the correct positions
5. App Layout sidebar collapses on small viewports

### Dependencies

- **Phase 1 (Content Containers)** — Scroll Area may be used for the scrollable content area within App Layout.
- **Phase 2 (Navigation)** — Sidebar component must be complete, as App Layout composes it directly.
- **Milestone 1** — provides Button (used for Header action slots) and the foundational infrastructure.
