Now I have all the context. Let me synthesize the definitive specification.

# Milestone 2: Form Controls

## Goal

Deliver all form input components — text inputs, selection controls, range sliders, and a composable Form wrapper — so that consumer apps (Task Manager, Chess, Orchestrator, Iteration Engine, Scheduler) can build complete, accessible, validated forms. After this milestone, apps can build login forms, settings pages, filter interfaces, and any UI requiring user data entry with client-side validation and accessible error reporting.

## Scope

### In Scope

- **10 components** across 10 directories, implemented as shadcn/ui ports adapted to the 5-file pattern (`.tsx`, `.styles.ts`, `.types.ts`, `.test.tsx`, `.stories.tsx`): Input, Textarea, Checkbox, Switch, Radio Group, Toggle, Toggle Group, Select, Slider, Form
- Radix UI primitives for interactive controls (Checkbox, Switch, Radio Group, Toggle, Toggle Group, Select, Slider)
- `react-hook-form` + `zod` integration for the Form component
- `@hookform/resolvers` as a required dependency for the Form component — this package provides `zodResolver`, the standard adapter that connects zod schemas to react-hook-form's validation interface. The master plan's tech stack lists "react-hook-form + zod" for the Form pattern; `@hookform/resolvers` is the bridge package that makes this integration work and is a direct dependency of shadcn/ui's Form implementation.
- Controlled and uncontrolled usage for all stateful inputs
- Full keyboard navigation and ARIA attributes for every component
- Vitest + vitest-axe accessibility tests and Storybook autodocs stories
- Public API exports from `packages/ui/src/index.ts`
- New Radix dependencies added to `packages/ui/package.json`

### Out of Scope

- Composed inputs that build on form controls (Combobox, Date Picker, Color Picker — Milestone 5)
- Search Input (Milestone 4)
- Layout, navigation, or application shell components (Milestone 3)
- Custom theme tokens beyond what already exists in `globals.css`
- Form-level state management patterns (app-level concern)
- Server-side validation or API integration

### Component Count Clarification

The master plan seed spec states "11 components" in exit criterion #1. The actual enumeration yields 10 top-level component directories: Input, Textarea, Checkbox, Switch, Radio Group, Toggle, Toggle Group, Select, Slider, Form. Sub-components (RadioGroupItem, ToggleGroupItem, SelectTrigger, FormField, etc.) live within their parent's directory and do not count as separate components. The correct count is **10 components**.

## Phases

### Phase 1: Text Inputs (2 components)

**Input** — shadcn/ui port. Styled `<input>` element supporting all HTML input types (`text`, `password`, `email`, `number`, `search`, `tel`, `url`, `file`, etc.). Error state communicated via `aria-invalid` attribute. Supports `disabled` state. Uses semantic tokens `border-input`, `ring-ring`, `bg-background`, `text-foreground`, `placeholder:text-muted-foreground`. Supports both controlled (`value` + `onChange`) and uncontrolled usage.

**Textarea** — shadcn/ui port. Styled `<textarea>` element with consistent styling matching Input. Supports an optional `autoResize` boolean prop (default `false`) that enables the textarea to grow with its content. The specific resize mechanism (CSS `field-sizing: content` vs. JavaScript `scrollHeight` measurement) is an implementation decision — the implementer should choose based on browser support requirements of the consumer apps. Supports `aria-invalid` for error state, `disabled` state, and controlled/uncontrolled usage.

**Radix dependencies**: None (these are native HTML elements).

### Phase 2: Selection Controls (6 components)

**Checkbox** — shadcn/ui port wrapping `@radix-ui/react-checkbox`. Supports three states: checked, unchecked, and indeterminate. Renders accessible checkmark/dash indicator. Works with Label via `htmlFor` or nesting.

**Switch** — shadcn/ui port wrapping `@radix-ui/react-switch`. Toggle between on/off states with thumb animation. Accessible as a switch role with `aria-checked`.

**Radio Group** with **RadioGroupItem** — shadcn/ui port wrapping `@radix-ui/react-radio-group`. Manages mutual exclusion between radio items. Supports keyboard navigation (arrow keys cycle through options). Each item renders a filled circle indicator when selected.

**Toggle** — shadcn/ui port wrapping `@radix-ui/react-toggle`. Pressed/unpressed state with `default` and `outline` variants plus `sm`, `default`, `lg` sizes. Uses `aria-pressed` for accessibility.

**Toggle Group** with **ToggleGroupItem** — shadcn/ui port wrapping `@radix-ui/react-toggle-group`. Wraps multiple Toggle items with `type="single"` (one active at a time) or `type="multiple"` (any combination). Inherits variant and size from group context.

**Select** with **SelectTrigger**, **SelectContent**, **SelectItem**, **SelectGroup**, **SelectLabel**, **SelectSeparator** — shadcn/ui port wrapping `@radix-ui/react-select`. Opens a styled dropdown on click or keyboard (Space/Enter). Supports option groups with labels and separators. Closes on selection or Escape.

**Radix dependencies**: `@radix-ui/react-checkbox`, `@radix-ui/react-switch`, `@radix-ui/react-radio-group`, `@radix-ui/react-toggle`, `@radix-ui/react-toggle-group`, `@radix-ui/react-select`.

### Phase 3: Range & Form (2 components)

**Slider** — shadcn/ui port wrapping `@radix-ui/react-slider`. Supports single-value and range (two-thumb) modes. Renders track, filled range, and draggable thumb(s). Keyboard accessible (arrow keys adjust value by step). Supports `min`, `max`, `step`, `disabled`, and controlled/uncontrolled usage.

**Form** with **FormField**, **FormItem**, **FormLabel**, **FormControl**, **FormDescription**, **FormMessage** — shadcn/ui port composing `react-hook-form` Controller + Label + zod validation. FormField connects react-hook-form's `Controller` to form context. FormItem groups label, control, description, and error message. FormLabel renders Label with automatic error styling. FormControl applies `aria-describedby` linking control to description and error message. FormDescription renders helper text. FormMessage renders zod validation errors with `aria-live="polite"` for screen reader announcements.

**Radix dependencies**: `@radix-ui/react-slider`.
**Third-party dependencies**: `react-hook-form`, `zod`, `@hookform/resolvers`.

## Exit Criteria

1. All 10 components (Input, Textarea, Checkbox, Switch, Radio Group, Toggle, Toggle Group, Select, Slider, Form) render correctly in Storybook with all variants and states documented
2. `pnpm test` passes with vitest-axe accessibility assertions for every component
3. `pnpm typecheck` passes with no errors across the `@components/ui` package
4. Input and Textarea support controlled (`value` + `onChange`) and uncontrolled (default value) usage
5. Input and Textarea display error styling when `aria-invalid="true"` is set
6. Textarea `autoResize` prop enables content-driven sizing
7. Checkbox supports checked, unchecked, and indeterminate states with correct visual indicators
8. Switch toggles state on click and keyboard (Space) with thumb animation
9. Radio Group supports keyboard navigation (arrow keys) with mutual exclusion
10. Select opens on click and keyboard, supports option groups with labels, and closes on selection or Escape
11. Toggle Group enforces single or multiple selection based on `type` prop
12. Slider supports single-value and range (two-thumb) modes with keyboard control
13. Form component correctly displays validation errors from zod schemas and links error messages to inputs via `aria-describedby`
14. All components use semantic tokens (`border-input`, `ring-ring`, `bg-background`, `text-foreground`, etc.)
15. All components are exported from `packages/ui/src/index.ts`

## Dependencies

1. **Milestone 1 complete** — Label component (used by Form) and all foundation primitives must be implemented and exported
2. **Existing infrastructure** — Monorepo build pipeline (`tsc --build`), Vitest test runner, Storybook 8.5, `cn()` utility, CVA, Tailwind v4, and OKLCH token system must be operational
3. **Radix UI packages** — `@radix-ui/react-checkbox`, `@radix-ui/react-switch`, `@radix-ui/react-radio-group`, `@radix-ui/react-toggle`, `@radix-ui/react-toggle-group`, `@radix-ui/react-select`, `@radix-ui/react-slider` must be installed
4. **Form ecosystem** — `react-hook-form`, `@hookform/resolvers`, and `zod` must be installed for the Form component
5. **Reference component** — Button component (canonical 5-file pattern) must exist as the implementation template

## Risks

1. **Form component complexity** — The Form component composes react-hook-form, zod, and Radix Label with multiple layers of React context. Incorrect context wiring could cause silent failures in error message display or `aria-describedby` linking. Mitigation: study the shadcn/ui Form source carefully and test with multiple zod schema shapes.
2. **Select positioning edge cases** — Radix Select uses its own built-in positioning engine (not Popover). Content may overflow viewport or clip inside scroll containers. Mitigation: test in Storybook with constrained containers and verify scroll behavior.
3. **Toggle Group context propagation** — Toggle Group must pass variant and size down to ToggleGroupItem children via context. Incorrect context setup could cause items to ignore group-level props. Mitigation: test both single and multiple modes with explicit and inherited variant/size.
4. **Slider range mode** — Two-thumb range mode requires careful handling of thumb overlap, min/max constraints per thumb, and accessible labeling of each thumb. Mitigation: test with overlapping values and verify keyboard behavior for each thumb independently.
5. **Dependency version conflicts** — Adding `react-hook-form`, `@hookform/resolvers`, and `zod` introduces new peer dependency chains. Version mismatches with React 19 could cause runtime errors. Mitigation: verify React 19 compatibility before installation and pin compatible versions.
