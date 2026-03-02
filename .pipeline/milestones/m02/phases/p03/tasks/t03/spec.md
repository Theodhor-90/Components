# Task: Form Component

## Objective

Create the complete Form component directory (`packages/ui/src/components/form/`) following the 5-file pattern, including all sub-components (Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage), the `useFormField` hook, and two React contexts. Add public API exports to `packages/ui/src/index.ts`. This is the most complex component in Milestone 2.

## Deliverables

- Complete `packages/ui/src/components/form/` directory with 5 files.
- Public API exports added to `packages/ui/src/index.ts`.

## Files to Create

### 1. `packages/ui/src/components/form/form.types.ts`

Type exports:

- `FormFieldContextValue` — `{ name: string }`
- `FormItemContextValue` — `{ id: string }`
- `FormFieldProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>` — extends `ControllerProps<TFieldValues, TName>` from react-hook-form
- `FormItemProps` — extends `React.ComponentProps<'div'>`
- `FormLabelProps` — extends `React.ComponentProps<typeof LabelPrimitive.Root>` (reuses Label's underlying Radix type)
- `FormControlProps` — extends `React.ComponentProps<typeof Slot>` (wraps the actual form control element)
- `FormDescriptionProps` — extends `React.ComponentProps<'p'>`
- `FormMessageProps` — extends `React.ComponentProps<'p'>`

### 2. `packages/ui/src/components/form/form.styles.ts`

CVA exports for sub-components that render styled DOM (DD-7):

- `formItemVariants`: `cva('space-y-2')`
- `formDescriptionVariants`: `cva('text-sm text-muted-foreground')`
- `formMessageVariants`: `cva('text-sm font-medium text-destructive')`

Note: `Form` (FormProvider) and `FormField` (Controller) have no CVA exports since they don't render styled DOM elements.

### 3. `packages/ui/src/components/form/form.tsx`

Multiple exports:

**Context definitions (DD-3):**

- `FormFieldContext = createContext<FormFieldContextValue>(...)` with appropriate default
- `FormItemContext = createContext<FormItemContextValue>(...)` with appropriate default

**`useFormField()` hook (DD-4):**

- Reads `name` from `FormFieldContext`
- Reads `id` from `FormItemContext`
- Calls `useFormContext().getFieldState(name, formState)` to get field error/validation state
- Returns `{ id, name, formItemId: \`${id}-form-item\`, formDescriptionId: \`${id}-form-item-description\`, formMessageId: \`${id}-form-item-message\`, ...fieldState }`

**`Form` (DD-5):**

- Re-export of `FormProvider` from react-hook-form. No DOM rendering, no `data-slot`, no `className` prop — purely a context provider.

**`FormField` (DD-6):**

- Wraps `Controller` from react-hook-form. Provides `FormFieldContext` with the field's `name`. Accepts `control`, `name`, and `render` props matching Controller's API.

**`FormItem`:**

- Renders `<div>` with `data-slot="form-item"` and `cn(formItemVariants({ className }))`.
- Provides `FormItemContext` with a generated `id` (using React's `useId()`).

**`FormLabel`:**

- Renders the existing `Label` component.
- Uses `useFormField()` to set `htmlFor={formItemId}` and conditionally apply `text-destructive` when field has an error.
- Applies `data-slot="form-label"`.

**`FormControl`:**

- Renders `@radix-ui/react-slot` (`Slot`) to merge props onto the actual form control child.
- Uses `useFormField()` to apply:
  - `id={formItemId}`
  - `aria-describedby` linking to description and/or error message (both IDs when error exists, just description ID otherwise)
  - `aria-invalid={!!error}`
- Applies `data-slot="form-control"`.

**`FormDescription`:**

- Renders `<p>` with `data-slot="form-description"`, `id={formDescriptionId}`, and `cn(formDescriptionVariants({ className }))`.

**`FormMessage`:**

- Renders `<p>` with `data-slot="form-message"`, `id={formMessageId}`, `cn(formMessageVariants({ className }))`, and `aria-live="polite"`.
- Displays `error?.message` if present, or falls back to `children`.
- Renders nothing if no error and no children.

### 4. `packages/ui/src/components/form/form.test.tsx`

Vitest + Testing Library + vitest-axe tests:

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

### 5. `packages/ui/src/components/form/form.stories.tsx`

CSF3 stories with `tags: ['autodocs']`:

- Simple Text Field (Input + Label + Description + FormMessage with zod `z.string().min(2)`)
- With Validation Error (pre-submitted state showing error)
- With Textarea (Textarea with max length validation)
- With Checkbox (boolean required validation)
- With Select (enum validation)
- With Radio Group (enum validation via radio options)
- With Switch (boolean field)
- Complete Form (multiple field types demonstrating a realistic form with submit handler)

## File to Modify

### `packages/ui/src/index.ts`

Add the following exports:

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

## Key Constraints

- Follow the Button component as the canonical 5-file reference, adapted for compound component pattern.
- Form (FormProvider) is a re-export, not a wrapper — no DOM rendering.
- Two React context layers (FormFieldContext, FormItemContext) are internal to the form module.
- `useFormField()` hook is exported for potential consumer use.
- Use React 19 `useId()` for generating stable IDs in FormItem.
- React 19 ref-as-prop — no `forwardRef`.
- Named exports only.
- Stories must demonstrate integration with Phase 1 (Input, Textarea) and Phase 2 (Checkbox, Switch, Radio Group, Select) components.

## Dependencies

- **Task t01** must be complete (`react-hook-form`, `@hookform/resolvers`, `zod` must be installed).
- **Milestone 1** — Label component must exist (consumed by FormLabel).
- **Phase 1 (Text Inputs)** — Input and Textarea used in Form stories and integration tests.
- **Phase 2 (Selection Controls)** — Checkbox, Switch, Radio Group, Select used in Form stories and integration tests.
- `@radix-ui/react-slot` must already be installed (required by FormControl).
- Task t02 (Slider) is independent but sequential order is recommended since Form stories can benefit from including Slider.

## Verification Criteria

1. `packages/ui/src/components/form/` contains all 5 files.
2. Form + FormField + FormItem + FormLabel + FormControl + FormDescription + FormMessage render as a connected form system.
3. FormLabel `htmlFor` links to FormControl's child `id` — clicking label focuses the input.
4. FormControl applies `aria-describedby` linking to FormDescription and FormMessage.
5. FormControl applies `aria-invalid="true"` when the field has a validation error.
6. FormMessage displays zod validation error text with `aria-live="polite"`.
7. FormLabel applies `text-destructive` styling when the field has a validation error.
8. Form stories demonstrate integration with Input, Textarea, Checkbox, Switch, Radio Group, and Select.
9. All Form tests pass (`pnpm test`).
10. Form renders correctly in Storybook with all stories visible under autodocs.
11. All sub-components and the `useFormField` hook are exported from `packages/ui/src/index.ts`.
