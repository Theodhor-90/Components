# Phase 2: Selection Controls

## Goal

Deliver six interactive selection components — Checkbox, Switch, Radio Group, Toggle, Toggle Group, and Select — as shadcn/ui ports wrapping their respective Radix UI primitives. These components cover all binary, single-choice, and multi-choice selection patterns needed by consumer apps. After this phase, apps can build settings pages, filter panels, and any UI requiring option selection with full keyboard navigation and accessibility.

## Deliverables

- **Checkbox** component directory (`packages/ui/src/components/checkbox/`) with all 5 files
- **Switch** component directory (`packages/ui/src/components/switch/`) with all 5 files
- **Radio Group** component directory (`packages/ui/src/components/radio-group/`) with all 5 files — includes `RadioGroupItem` sub-component
- **Toggle** component directory (`packages/ui/src/components/toggle/`) with all 5 files
- **Toggle Group** component directory (`packages/ui/src/components/toggle-group/`) with all 5 files — includes `ToggleGroupItem` sub-component
- **Select** component directory (`packages/ui/src/components/select/`) with all 5 files — includes `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectGroup`, `SelectLabel`, `SelectSeparator` sub-components
- Six new Radix dependencies installed in `packages/ui/package.json`
- Public API exports added to `packages/ui/src/index.ts` for all 6 components and their sub-components
- Storybook stories with autodocs for all components covering variants, sizes, states, and interaction patterns
- Vitest + vitest-axe accessibility tests for all components

## Technical Decisions & Constraints

- **Checkbox**: Wraps `@radix-ui/react-checkbox`. Three states: checked, unchecked, indeterminate. Renders accessible checkmark/dash indicator. Works with Label via `htmlFor` or nesting.
- **Switch**: Wraps `@radix-ui/react-switch`. Toggle on/off with thumb animation. `aria-checked` and switch role.
- **Radio Group + RadioGroupItem**: Wraps `@radix-ui/react-radio-group`. Mutual exclusion, arrow key navigation, filled circle indicator when selected.
- **Toggle**: Wraps `@radix-ui/react-toggle`. `default` and `outline` variants, `sm`/`default`/`lg` sizes. Uses `aria-pressed`.
- **Toggle Group + ToggleGroupItem**: Wraps `@radix-ui/react-toggle-group`. `type="single"` or `type="multiple"`. Inherits variant and size from group context — context propagation must be tested carefully.
- **Select + sub-components**: Wraps `@radix-ui/react-select`. Opens on click or keyboard (Space/Enter). Supports option groups with labels and separators. Closes on selection or Escape. Uses Radix Select's built-in positioning (not Popover) — test for viewport overflow and scroll container edge cases.
- **Radix dependencies to install**: `@radix-ui/react-checkbox`, `@radix-ui/react-switch`, `@radix-ui/react-radio-group`, `@radix-ui/react-toggle`, `@radix-ui/react-toggle-group`, `@radix-ui/react-select`.
- All components use semantic tokens (`border-input`, `ring-ring`, `bg-background`, etc.).
- Follow the 5-file pattern, React 19 ref-as-prop, named exports, `data-slot`, `cn()` + CVA.

## Dependencies on Prior Phases

- **Phase 1 (Text Inputs)** must be complete — establishes the M2 implementation pattern for form controls.
- **Milestone 1 complete** — Label component (needed for Checkbox/Radio Group integration) and all infrastructure must be operational.
- **Button component** as the canonical 5-file pattern reference.
