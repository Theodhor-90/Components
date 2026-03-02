I now have all the context needed. Let me produce the comprehensive Phase 3 specification.

# Phase 3: Range & Form — Detailed Specification

## Goal

Deliver the **Slider** component for numeric range input and the **Form** component system that composes `react-hook-form`, `zod` validation, and the existing Label primitive into a complete form management solution. The Form component is the capstone of Milestone 2 — it ties together all previously built form controls (Input, Textarea, Checkbox, Switch, Radio Group, Toggle, Toggle Group, Select) with schema-driven validation, accessible error display, and automatic `aria-describedby` linking. After this phase, consumer apps can build fully validated, accessible forms using any combination of M2 input components.

---

## Design Decisions

### DD-1: Slider CVA — Base Classes Only, No Visual Variants

Like most Radix-wrapped components in this library, Slider does not define configurable visual variants (`variant` or `size` props). The shadcn/ui Slider is a single-style component — all visual states derive from the Radix primitive's `data-*` attributes and disabled state. The `sliderVariants`, `sliderTrackVariants`, `sliderRangeVariants`, and `sliderThumbVariants` CVA exports each hold base classes only, keeping the pattern consistent with Checkbox, Switch, and other Phase 2 components.

### DD-2: Slider Sub-Components Are Internal

Unlike Select (which exports multiple sub-components for consumer composition), Slider's track, range, and thumb elements are implementation details. The public API is a single `Slider` component that renders its own `SliderPrimitive.Track`, `SliderPrimitive.Range`, and `SliderPrimitive.Thumb` internally. The number of thumbs is derived from the `value`/`defaultValue` array length — a single number produces one thumb, a two-element array produces a range slider. This matches the shadcn/ui approach.

### DD-3: Form Uses React Context for Field State Propagation

The Form component system uses two React context layers following the shadcn/ui pattern:

1. **`FormFieldContext`** — created by `FormField`, provides the field `name` to child components. This connects to `react-hook-form`'s `useFormContext()` to retrieve field state (error, isDirty, etc.).
2. **`FormItemContext`** — created by `FormItem`, provides a generated `id` that is used to derive consistent `id`, `aria-describedby`, and `aria-invalid` attributes across `FormLabel`, `FormControl`, `FormDescription`, and `FormMessage`.

Both contexts are defined within the form component files, not as shared utilities.

### DD-4: `useFormField` Custom Hook

A `useFormField()` hook (exported from the form component file) encapsulates the context reading logic. It reads from both `FormFieldContext` and `FormItemContext`, calls `useFormContext().getFieldState()` to retrieve the current field's error/validation state, and returns a structured object with computed `id`, `formItemId`, `formDescriptionId`, `formMessageId`, and field state. This hook is used internally by `FormLabel`, `FormControl`, `FormDescription`, and `FormMessage`.

### DD-5: Form Component Is a Re-export, Not a Wrapper

Following shadcn/ui, the `Form` component itself is a direct re-export of `react-hook-form`'s `FormProvider`. It does not render any DOM element or apply any styling. Its sole purpose is to provide form context to descendant components. This means the Form component has no CVA styles, no `data-slot`, and no `className` prop — it is purely a context provider.

### DD-6: FormField Wraps react-hook-form Controller

`FormField` wraps `react-hook-form`'s `Controller` component, providing the field's `name` through `FormFieldContext`. It accepts `control`, `name`, and `render` props matching Controller's API. The `render` prop receives the standard `{ field, fieldState, formState }` argument from Controller.

### DD-7: Styles File Pattern for Form

Since most Form sub-components are structural (context providers, ARIA wiring) rather than visual, the `form.styles.ts` file will contain minimal CVA definitions:

- `formItemVariants` — base layout: `space-y-2`
- `formLabelVariants` — no base classes (Label's own styles are sufficient); error-state styling (`text-destructive`) is applied conditionally in the component via `cn()`
- `formDescriptionVariants` — `text-sm text-muted-foreground`
- `formMessageVariants` — `text-sm font-medium text-destructive`

`Form` (FormProvider) and `FormField` (Controller) have no CVA exports since they don't render styled DOM elements.

### DD-8: Dependencies as Regular Dependencies

`react-hook-form`, `zod`, and `@hookform/resolvers` are added to `packages/ui/package.json` under `dependencies` (not `peerDependencies`). While a case could be made for peer dependencies (letting consumers control versions), the shadcn/ui approach bundles these directly. Since consumer apps import the Form component from `@components/ui`, they inherit these transitive dependencies without needing to install them separately. `@radix-ui/react-slider` follows the same pattern as existing Radix dependencies.

---

## Tasks

### Task 1: Install Dependencies

**Deliverables**: All new packages installed in `packages/ui/package.json`.

**Packages to install**:

- `@radix-ui/react-slider` — Radix primitive for the Slider component
- `react-hook-form` — Form state management library
- `@hookform/resolvers` — Bridge package providing `zodResolver`
- `zod` — Schema validation library

All packages are added to `dependencies` in `packages/ui/package.json`. Verify React 19 compatibility for all packages before installation. Run `pnpm install` from the workspace root to resolve dependencies.

---

### Task 2: Slider Component

**Deliverables**: Complete `packages/ui/src/components/slider/` directory with all 5 files, plus public API export.

**Files to create**:

1. **`slider.types.ts`** — `SliderProps` extending `React.ComponentProps<typeof SliderPrimitive.Root>`. No additional custom props — `value`, `defaultValue`, `onValueChange`, `min`, `max`, `step`, `disabled`, `orientation`, `name` are all provided by the Radix primitive's base type.

2. **`slider.styles.ts`** — Four CVA exports, each with base classes only:
   - `sliderVariants`: `relative flex w-full touch-none select-none items-center` (plus `data-[orientation=vertical]:h-full data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col` for vertical orientation if supported, though shadcn/ui only styles horizontal)
   - `sliderTrackVariants`: `relative h-2 w-full grow overflow-hidden rounded-full bg-secondary`
   - `sliderRangeVariants`: `absolute h-full bg-primary`
   - `sliderThumbVariants`: `block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`

3. **`slider.tsx`** — Single `Slider` functional component wrapping `SliderPrimitive.Root`. Internally renders:
   - `SliderPrimitive.Track` with `cn(sliderTrackVariants())` containing `SliderPrimitive.Range` with `cn(sliderRangeVariants())`
   - One `SliderPrimitive.Thumb` per value in the `value`/`defaultValue` array. For the default single-value case, renders one thumb. For range mode (array with 2 values), renders two thumbs. The thumbs are rendered by mapping over the current value array.
   - Root element applies `data-slot="slider"` and `cn(sliderVariants({ className }))`. React 19 `ref` as prop.

4. **`slider.test.tsx`** — Vitest + Testing Library + vitest-axe tests:
   - Smoke render
   - Applies `data-slot="slider"`
   - Supports custom `className`
   - Renders single thumb for single value
   - Renders two thumbs for range mode (`defaultValue={[25, 75]}`)
   - Has `role="slider"` on thumb(s)
   - Thumb has correct `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
   - Supports `min`, `max`, `step` props
   - Disabled state: thumbs not interactive
   - Controlled usage (`value` + `onValueChange`)
   - Uncontrolled usage (`defaultValue`)
   - Accessibility: `axe` assertions on single and range modes
   - Ref forwarding

5. **`slider.stories.tsx`** — CSF3 stories with `tags: ['autodocs']`:
   - Default (single value)
   - With Default Value
   - Range (two thumbs)
   - Custom Min/Max/Step
   - Disabled
   - With Label (composing with Label component)
   - Controlled

**Export to add to `packages/ui/src/index.ts`**:

```typescript
export { Slider, type SliderProps } from './components/slider/slider.js';
export {
  sliderVariants,
  sliderTrackVariants,
  sliderRangeVariants,
  sliderThumbVariants,
} from './components/slider/slider.styles.js';
```

---

### Task 3: Form Component

**Deliverables**: Complete `packages/ui/src/components/form/` directory with all 5 files, plus public API export. This is the most complex component in Milestone 2.

**Files to create**:

1. **`form.types.ts`** — Type exports:
   - `FormFieldContextValue` — `{ name: string }`
   - `FormItemContextValue` — `{ id: string }`
   - `FormFieldProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>` — extends `ControllerProps<TFieldValues, TName>` from react-hook-form
   - `FormItemProps` — extends `React.ComponentProps<'div'>`
   - `FormLabelProps` — extends `React.ComponentProps<typeof LabelPrimitive.Root>` (reuses Label's underlying Radix type)
   - `FormControlProps` — extends `React.ComponentProps<typeof Slot>` (wraps the actual form control element)
   - `FormDescriptionProps` — extends `React.ComponentProps<'p'>`
   - `FormMessageProps` — extends `React.ComponentProps<'p'>`

2. **`form.styles.ts`** — CVA exports for sub-components that render styled DOM:
   - `formItemVariants`: `cva('space-y-2')`
   - `formDescriptionVariants`: `cva('text-sm text-muted-foreground')`
   - `formMessageVariants`: `cva('text-sm font-medium text-destructive')`

3. **`form.tsx`** — Multiple exports:
   - **Context definitions**:
     - `FormFieldContext = createContext<FormFieldContextValue>(...)` with appropriate default
     - `FormItemContext = createContext<FormItemContextValue>(...)` with appropriate default
   - **`useFormField()`** — Custom hook that:
     - Reads `name` from `FormFieldContext`
     - Reads `id` from `FormItemContext`
     - Calls `useFormContext().getFieldState(name, formState)` to get field error/validation state
     - Returns `{ id, name, formItemId: \`\${id}-form-item\`, formDescriptionId: \`\${id}-form-item-description\`, formMessageId: \`\${id}-form-item-message\`, ...fieldState }`
   - **`Form`** — Re-export of `FormProvider` from react-hook-form. No DOM rendering, no `data-slot`.
   - **`FormField`** — Wraps `Controller` from react-hook-form. Provides `FormFieldContext` with the field's `name`. Renders Controller's `render` prop.
   - **`FormItem`** — Renders a `<div>` with `data-slot="form-item"` and `cn(formItemVariants({ className }))`. Provides `FormItemContext` with a generated `id` (using React's `useId()`).
   - **`FormLabel`** — Renders the existing `Label` component. Reads from `useFormField()` to set `htmlFor={formItemId}` and conditionally apply `text-destructive` when the field has an error. Applies `data-slot="form-label"`.
   - **`FormControl`** — Renders `@radix-ui/react-slot` (`Slot`) to merge props onto the actual form control child. Uses `useFormField()` to apply:
     - `id={formItemId}`
     - `aria-describedby` linking to description and/or error message (both IDs when error exists, just description ID otherwise)
     - `aria-invalid={!!error}`
     - Applies `data-slot="form-control"`.
   - **`FormDescription`** — Renders a `<p>` with `data-slot="form-description"`, `id={formDescriptionId}`, and `cn(formDescriptionVariants({ className }))`.
   - **`FormMessage`** — Renders a `<p>` with `data-slot="form-message"`, `id={formMessageId}`, `cn(formMessageVariants({ className }))`, and `aria-live="polite"`. Displays `error?.message` if present, or falls back to `children`. Renders nothing if no error and no children.

4. **`form.test.tsx`** — Vitest + Testing Library + vitest-axe tests:
   - Smoke render: Form with a single text field renders without crashing
   - FormItem applies `data-slot="form-item"`
   - FormLabel renders Label with correct `htmlFor` linking to FormControl's child
   - FormControl applies `aria-describedby` linking to description
   - FormDescription renders with correct `id` matching `aria-describedby`
   - FormMessage displays nothing when no error
   - Validation error: submitting an empty required field displays error message in FormMessage
   - FormMessage applies `aria-live="polite"` for screen reader announcement
   - Error state: FormLabel applies `text-destructive` class when field has error
   - Error state: FormControl applies `aria-invalid="true"` when field has error
   - `aria-describedby` includes both description and message IDs when error is present
   - Integration with Input: Form wrapping Input with zod validation
   - Integration with Checkbox: Form wrapping Checkbox with zod boolean validation
   - Integration with Select: Form wrapping Select with zod enum validation
   - Multiple fields: Form with multiple FormFields each independently validated
   - Accessibility: `axe` assertions on form with and without validation errors

5. **`form.stories.tsx`** — CSF3 stories with `tags: ['autodocs']`:
   - Simple Text Field (Input + Label + Description + FormMessage with zod `z.string().min(2)`)
   - With Validation Error (pre-submitted state showing error)
   - With Textarea (Textarea with max length validation)
   - With Checkbox (boolean required validation)
   - With Select (enum validation)
   - With Radio Group (enum validation via radio options)
   - With Switch (boolean field)
   - Complete Form (multiple field types demonstrating a realistic form with submit handler)

**Export to add to `packages/ui/src/index.ts`**:

```typescript
export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
  type FormItemProps,
  type FormLabelProps,
  type FormControlProps,
  type FormDescriptionProps,
  type FormMessageProps,
} from './components/form/form.js';
export {
  formItemVariants,
  formDescriptionVariants,
  formMessageVariants,
} from './components/form/form.styles.js';
```

---

### Task 4: Storybook & Integration Verification

**Deliverables**: Verify both components render correctly in Storybook, all tests pass, and typecheck succeeds.

- Run `pnpm test` across the `@components/ui` package — all Slider and Form tests must pass, including vitest-axe accessibility assertions
- Run `pnpm typecheck` — no type errors in the package
- Verify Storybook renders all stories for both Slider and Form with autodocs
- Verify Form stories demonstrate integration with previously built Phase 1 and Phase 2 components (Input, Textarea, Checkbox, Switch, Radio Group, Select)

---

## Exit Criteria

1. `packages/ui/src/components/slider/` contains all 5 files following the component file pattern
2. `packages/ui/src/components/form/` contains all 5 files following the component file pattern
3. `@radix-ui/react-slider`, `react-hook-form`, `@hookform/resolvers`, and `zod` are installed in `packages/ui/package.json` under `dependencies`
4. `pnpm test` passes — all Slider and Form tests green, including vitest-axe accessibility assertions
5. `pnpm typecheck` passes with no errors in the `@components/ui` package
6. Slider renders single thumb for single value and two thumbs for range mode (`defaultValue={[25, 75]}`)
7. Slider thumb(s) have `role="slider"` with correct `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
8. Slider supports `min`, `max`, `step`, `disabled`, and controlled/uncontrolled usage
9. Slider keyboard: arrow keys adjust thumb value by step amount
10. Form + FormField + FormItem + FormLabel + FormControl + FormDescription + FormMessage render as a connected form system
11. FormLabel `htmlFor` links to FormControl's child `id` — clicking label focuses the input
12. FormControl applies `aria-describedby` linking to FormDescription and FormMessage
13. FormControl applies `aria-invalid="true"` when the field has a validation error
14. FormMessage displays zod validation error text with `aria-live="polite"`
15. FormLabel applies `text-destructive` styling when the field has a validation error
16. Form stories demonstrate integration with Input, Textarea, Checkbox, Switch, Radio Group, and Select
17. Both components render correctly in Storybook with all stories visible under autodocs
18. Both components and all Form sub-components are exported from `packages/ui/src/index.ts`

---

## Dependencies

1. **Phase 1 (Text Inputs) complete** — Input and Textarea are primary controls used in Form demonstrations and testing
2. **Phase 2 (Selection Controls) complete** — Checkbox, Switch, Radio Group, Select are used as form controls within Form stories and integration tests
3. **Milestone 1 complete** — Label component is directly consumed by FormLabel; all infrastructure (monorepo build, Vitest, Storybook, `cn()`, CVA, Tailwind v4, OKLCH tokens) must be operational
4. **`@radix-ui/react-slot`** — already installed, required by FormControl for prop merging onto child elements
5. **Button component** — exists as the canonical 5-file pattern reference
6. **Task 1 before Tasks 2–3** — dependencies must be installed before components can import from them
7. **Task 2 is independent of Task 3** — Slider and Form can be implemented in parallel, but Task 3's stories benefit from Task 2 (Slider inside a Form), so sequential order is recommended

---

## Artifacts

| Artifact                                               | Action | Description                                                                                                    |
| ------------------------------------------------------ | ------ | -------------------------------------------------------------------------------------------------------------- |
| `packages/ui/package.json`                             | Modify | Add `@radix-ui/react-slider`, `react-hook-form`, `@hookform/resolvers`, `zod` to dependencies                  |
| `packages/ui/src/components/slider/slider.tsx`         | Create | Slider component wrapping Radix Slider primitive                                                               |
| `packages/ui/src/components/slider/slider.styles.ts`   | Create | CVA base classes for slider, track, range, thumb                                                               |
| `packages/ui/src/components/slider/slider.types.ts`    | Create | SliderProps type definition                                                                                    |
| `packages/ui/src/components/slider/slider.test.tsx`    | Create | Vitest + vitest-axe test suite                                                                                 |
| `packages/ui/src/components/slider/slider.stories.tsx` | Create | Storybook CSF3 stories with autodocs                                                                           |
| `packages/ui/src/components/form/form.tsx`             | Create | Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage + contexts + useFormField hook |
| `packages/ui/src/components/form/form.styles.ts`       | Create | CVA definitions for FormItem, FormDescription, FormMessage                                                     |
| `packages/ui/src/components/form/form.types.ts`        | Create | Type definitions for all Form sub-components and contexts                                                      |
| `packages/ui/src/components/form/form.test.tsx`        | Create | Vitest + vitest-axe test suite with integration tests                                                          |
| `packages/ui/src/components/form/form.stories.tsx`     | Create | Storybook CSF3 stories demonstrating full form patterns                                                        |
| `packages/ui/src/index.ts`                             | Modify | Add Slider and Form exports                                                                                    |
