# Phase 3: Range & Form

## Goal

Deliver the Slider component for numeric range input and the Form component that composes react-hook-form, zod validation, and Radix Label into a complete form management system. The Form component is the capstone of this milestone — it ties together all previously built form controls with validation, error display, and accessible `aria-describedby` linking. After this phase, consumer apps can build fully validated, accessible forms with any combination of the M2 input components.

## Deliverables

- **Slider** component directory (`packages/ui/src/components/slider/`) with all 5 files
- **Form** component directory (`packages/ui/src/components/form/`) with all 5 files — includes `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage` sub-components
- Radix dependency installed: `@radix-ui/react-slider`
- Third-party dependencies installed: `react-hook-form`, `zod`, `@hookform/resolvers`
- Public API exports added to `packages/ui/src/index.ts` for both components and all Form sub-components
- Storybook stories with autodocs for both components — Slider stories covering single/range modes; Form stories demonstrating complete form with validation
- Vitest + vitest-axe accessibility tests for both components

## Technical Decisions & Constraints

- **Slider**: Wraps `@radix-ui/react-slider`. Supports single-value and range (two-thumb) modes. Renders track, filled range, and draggable thumb(s). Keyboard accessible (arrow keys adjust value by step). Supports `min`, `max`, `step`, `disabled`, and controlled/uncontrolled usage. Two-thumb range mode requires careful handling of thumb overlap, min/max constraints per thumb, and accessible labeling of each thumb independently.
- **Form + sub-components**: shadcn/ui port composing `react-hook-form` Controller + Label + zod validation. This is the most complex component in the milestone due to multiple layers of React context:
  - **FormField** connects react-hook-form's `Controller` to form context
  - **FormItem** groups label, control, description, and error message
  - **FormLabel** renders the M1 Label component with automatic error styling
  - **FormControl** applies `aria-describedby` linking control to description and error message
  - **FormDescription** renders helper text below the control
  - **FormMessage** renders zod validation errors with `aria-live="polite"` for screen reader announcements
- **`@hookform/resolvers`** is required as the bridge between react-hook-form and zod (provides `zodResolver`).
- **Risk: Form complexity** — incorrect context wiring could cause silent failures in error display or `aria-describedby` linking. Must study shadcn/ui Form source carefully and test with multiple zod schema shapes.
- **Risk: Dependency version conflicts** — `react-hook-form`, `@hookform/resolvers`, and `zod` introduce new peer dependency chains. Must verify React 19 compatibility before installation.
- All components use semantic tokens and follow the 5-file pattern, React 19 ref-as-prop, named exports, `data-slot`, `cn()` + CVA.

## Dependencies on Prior Phases

- **Phase 1 (Text Inputs)** — Input and Textarea are the primary controls used inside Form demonstrations and testing.
- **Phase 2 (Selection Controls)** — Checkbox, Switch, Radio Group, Select, etc. are used as form controls within Form. The Form component's tests and stories should demonstrate integration with Phase 2 components.
- **Milestone 1 complete** — Label component is directly consumed by FormLabel. All infrastructure must be operational.
