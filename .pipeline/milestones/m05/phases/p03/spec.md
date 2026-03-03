## Phase 3: Combobox & Color Picker

### Goal

Build two composed input components that combine Popover with specialized selection interfaces — a searchable select (Combobox) and a color selection control (Color Picker). These complete Milestone 5's goal of delivering all higher-level composed input controls.

### Deliverables

1. **Combobox** — shadcn-pattern composing Popover + Command for searchable single/multi select with create-option support. Uses Command's built-in filtering for client-side search. Supports both single-value and multi-value selection modes. Filters options as the user types.

2. **Color Picker** — custom component. Popover containing a grid of preset color swatches (the Tailwind color families — slate, gray, zinc, neutral, stone, red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose — at shade 500), a hex color text input with `#` prefix, and a live preview swatch showing the current color. The preview swatch updates in real time as the hex input value changes.

### Technical Decisions & Constraints

- Each component follows the 5-file pattern: `{name}.tsx`, `{name}.styles.ts`, `{name}.types.ts`, `{name}.test.tsx`, `{name}.stories.tsx`
- No new dependencies required — Popover (`@radix-ui/react-popover`) and Command (`cmdk`) are already available from Milestone 1 and Phase 1 of this milestone respectively
- Combobox is a composed pattern (not a Radix primitive wrapper) — it assembles Popover and Command
- Color Picker uses the Input component from Milestone 2 for the hex text input
- Color Picker palette uses hardcoded Tailwind color values at shade 500, not dynamic theme tokens
- All components and their prop types and CVA variant functions must be exported from `packages/ui/src/index.ts`
- Tests must include vitest-axe accessibility assertions; stories must use CSF3 with `tags: ['autodocs']`

### Dependencies on Prior Phases

- **Milestone 1 (Foundation)** — Popover (used by both Combobox and Color Picker)
- **Milestone 2 (Form Controls)** — Input (used by Color Picker hex input)
- **Milestone 5, Phase 1 (Menus)** — Command component (used by Combobox for filtering and keyboard navigation)
