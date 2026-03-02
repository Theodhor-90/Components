# Phase 1: Text Inputs

## Goal

Deliver the two foundational text input components — Input and Textarea — as shadcn/ui ports adapted to the project's 5-file pattern. These native HTML element wrappers provide the styled, accessible text entry primitives that all subsequent form controls and composed inputs build upon. After this phase, consumer apps can render styled text fields with error states, disabled states, and controlled/uncontrolled usage.

## Deliverables

- **Input** component directory (`packages/ui/src/components/input/`) with all 5 files (`.tsx`, `.styles.ts`, `.types.ts`, `.test.tsx`, `.stories.tsx`)
- **Textarea** component directory (`packages/ui/src/components/textarea/`) with all 5 files
- Public API exports added to `packages/ui/src/index.ts` for both components
- Storybook stories with autodocs covering all variants, states, and input types
- Vitest + vitest-axe accessibility tests for both components

## Technical Decisions & Constraints

- **Input**: Styled `<input>` element supporting all HTML input types (`text`, `password`, `email`, `number`, `search`, `tel`, `url`, `file`, etc.). Error state communicated via `aria-invalid` attribute. Uses semantic tokens: `border-input`, `ring-ring`, `bg-background`, `text-foreground`, `placeholder:text-muted-foreground`. Must support both controlled (`value` + `onChange`) and uncontrolled usage.
- **Textarea**: Styled `<textarea>` with consistent styling matching Input. Supports an optional `autoResize` boolean prop (default `false`) that enables the textarea to grow with its content. The specific resize mechanism (CSS `field-sizing: content` vs. JavaScript `scrollHeight` measurement) is an implementation decision for the implementer. Supports `aria-invalid` for error state, `disabled` state, and controlled/uncontrolled usage.
- **No Radix dependencies** — both components wrap native HTML elements.
- Follow the canonical Button component as the 5-file pattern reference.
- React 19 ref-as-prop convention (no `forwardRef`).
- Named exports only, `data-slot` on root elements, `cn()` for class merging with CVA variants.

## Dependencies on Prior Phases

- **Milestone 1 must be complete** — the existing infrastructure (monorepo build pipeline, Vitest, Storybook 8.5, `cn()` utility, CVA, Tailwind v4, OKLCH token system) and foundation components must be operational.
- **Button component** must exist as the canonical 5-file pattern template.
- No dependencies on other M2 phases — this is the first phase of the milestone.
