I now have everything needed. Here is the complete implementation plan:

# Task t03 Plan: Form Component

## 1. Deliverables

| File                                               | Action | Purpose                                                                                                                                                   |
| -------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/ui/src/components/form/form.types.ts`    | Create | Type definitions for all Form sub-components, context values, and the `useFormField` hook return type                                                     |
| `packages/ui/src/components/form/form.styles.ts`   | Create | CVA definitions for `FormItem`, `FormDescription`, and `FormMessage`                                                                                      |
| `packages/ui/src/components/form/form.tsx`         | Create | `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage` components + `useFormField` hook + two React contexts       |
| `packages/ui/src/components/form/form.test.tsx`    | Create | Vitest + Testing Library + vitest-axe test suite covering all sub-components, ARIA wiring, validation errors, and integration with existing form controls |
| `packages/ui/src/components/form/form.stories.tsx` | Create | Storybook CSF3 stories demonstrating Form with Input, Textarea, Checkbox, Switch, RadioGroup, Select, and Slider                                          |
| `packages/ui/src/index.ts`                         | Modify | Add Form component exports, sub-component exports, `useFormField` hook export, type exports, and CVA variant exports                                      |

## 2. Dependencies

All dependencies are already installed (completed in task t01):

- `react-hook-form` v7.71.2 — Form state management, `FormProvider`, `Controller`, `useFormContext`
- `@hookform/resolvers` v5.2.2 — `zodResolver` imported from `@hookform/resolvers/zod`
- `zod` v4.3.6 — Schema validation (note: v4 API, imported as `import { z } from 'zod'`)
- `@radix-ui/react-slot` — Already installed; used by `FormControl` to merge ARIA props onto child
- `@radix-ui/react-label` — Already installed; used by `FormLabel` via existing `Label` component

Existing components required (all built in prior phases):

- `Label` from `../label/label.js`
- `Input` from `../input/input.js` (for stories/tests)
- `Textarea` from `../textarea/textarea.js` (for stories)
- `Checkbox` from `../checkbox/checkbox.js` (for stories/tests)
- `Switch` from `../switch/switch.js` (for stories)
- `RadioGroup`, `RadioGroupItem` from `../radio-group/radio-group.js` (for stories)
- `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectValue` from `../select/select.js` (for stories/tests)
- `Slider` from `../slider/slider.js` (for stories)
- `Button` from `../button/button.js` (for form submit buttons in stories)

## 3. Implementation Details

### 3.1 `form.types.ts`

**Purpose**: Centralize all type definitions for the Form component system.

**Exports**:

```typescript
import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';
import type { Slot } from '@radix-ui/react-slot';
import type * as LabelPrimitive from '@radix-ui/react-label';

// Context value types
export type FormFieldContextValue = {
  name: string;
};

export type FormItemContextValue = {
  id: string;
};

// Component prop types
export type FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = ControllerProps<TFieldValues, TName>;

export type FormItemProps = React.ComponentProps<'div'>;

export type FormLabelProps = React.ComponentProps<typeof LabelPrimitive.Root>;

export type FormControlProps = React.ComponentProps<typeof Slot>;

export type FormDescriptionProps = React.ComponentProps<'p'>;

export type FormMessageProps = React.ComponentProps<'p'>;
```

**Key decisions**:

- `FormFieldProps` is generic over `TFieldValues` and `TName`, directly extending `ControllerProps` from react-hook-form. This preserves full type inference for the `render` prop callback.
- `FormLabelProps` extends `React.ComponentProps<typeof LabelPrimitive.Root>` (same base as `LabelProps`) rather than re-importing from our Label — this avoids a circular dependency concern and matches the exact Radix type.
- `FormControlProps` extends `React.ComponentProps<typeof Slot>` since `FormControl` renders a `Slot`.

### 3.2 `form.styles.ts`

**Purpose**: CVA definitions for the three sub-components that render styled DOM.

**Exports**:

```typescript
import { cva } from 'class-variance-authority';

export const formItemVariants = cva('space-y-2');

export const formDescriptionVariants = cva('text-sm text-muted-foreground');

export const formMessageVariants = cva('text-sm font-medium text-destructive');
```

**Key decisions**:

- `Form` (FormProvider re-export) and `FormField` (Controller wrapper) render no DOM, so they have no CVA exports.
- `FormLabel` uses the existing `Label` component's styling; error-state `text-destructive` is applied conditionally via `cn()` in the component, not via a CVA variant.
- `FormControl` renders a `Slot` with no visual styling of its own (it only applies ARIA attributes).
- All three CVA definitions use base classes only with no variant axes, matching the pattern of Slider's CVA definitions.

### 3.3 `form.tsx`

**Purpose**: Main implementation file containing all sub-components, contexts, and the `useFormField` hook.

**Exports** (8 component/hook exports + type re-exports):

1. **`Form`** — Direct re-export: `const Form = FormProvider`. Aliased re-export of `FormProvider` from `react-hook-form`. No DOM rendering, no `data-slot`, no styling. It exists solely to provide `react-hook-form` context to descendant `FormField` components.

2. **`FormFieldContext`** — `createContext<FormFieldContextValue | undefined>(undefined)`. Internal context, not exported. Created by `FormField`, consumed by `useFormField`.

3. **`FormItemContext`** — `createContext<FormItemContextValue | undefined>(undefined)`. Internal context, not exported. Created by `FormItem`, consumed by `useFormField`.

4. **`useFormField()`** — Exported custom hook:

   ```typescript
   export function useFormField() {
     const fieldContext = useContext(FormFieldContext);
     const itemContext = useContext(FormItemContext);
     if (!fieldContext) {
       throw new Error('useFormField must be used within a <FormField>');
     }
     if (!itemContext) {
       throw new Error('useFormField must be used within a <FormItem>');
     }
     const { getFieldState, formState } = useFormContext();
     const fieldState = getFieldState(fieldContext.name, formState);
     const { id } = itemContext;
     return {
       id,
       name: fieldContext.name,
       formItemId: `${id}-form-item`,
       formDescriptionId: `${id}-form-item-description`,
       formMessageId: `${id}-form-item-message`,
       ...fieldState,
     };
   }
   ```

5. **`FormField`** — Generic component wrapping `Controller`. Provides `FormFieldContext`:

   ```typescript
   export function FormField<
     TFieldValues extends FieldValues = FieldValues,
     TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
   >({ ...props }: FormFieldProps<TFieldValues, TName>) {
     return (
       <FormFieldContext value={{ name: props.name }}>
         <Controller {...props} />
       </FormFieldContext>
     );
   }
   ```

   Note: In React 19, `createContext` returns a component that accepts `value` as a prop directly (no `.Provider` needed).

6. **`FormItem`** — Renders `<div>` with `data-slot="form-item"`, generates stable `id` via `useId()`, provides `FormItemContext`:

   ```typescript
   export function FormItem({ className, ref, ...props }: FormItemProps) {
     const id = useId();
     return (
       <FormItemContext value={{ id }}>
         <div
           data-slot="form-item"
           className={cn(formItemVariants({ className }))}
           ref={ref}
           {...props}
         />
       </FormItemContext>
     );
   }
   ```

7. **`FormLabel`** — Renders existing `Label` component with error-aware styling:

   ```typescript
   export function FormLabel({ className, ref, ...props }: FormLabelProps) {
     const { error, formItemId } = useFormField();
     return (
       <Label
         data-slot="form-label"
         className={cn(error && 'text-destructive', className)}
         htmlFor={formItemId}
         ref={ref}
         {...props}
       />
     );
   }
   ```

8. **`FormControl`** — Renders `Slot` to merge ARIA attributes onto the child form control:

   ```typescript
   export function FormControl({ ref, ...props }: FormControlProps) {
     const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
     return (
       <Slot
         data-slot="form-control"
         id={formItemId}
         aria-describedby={
           error
             ? `${formDescriptionId} ${formMessageId}`
             : formDescriptionId
         }
         aria-invalid={!!error}
         ref={ref}
         {...props}
       />
     );
   }
   ```

9. **`FormDescription`** — Renders `<p>` with description ID:

   ```typescript
   export function FormDescription({ className, ref, ...props }: FormDescriptionProps) {
     const { formDescriptionId } = useFormField();
     return (
       <p
         data-slot="form-description"
         id={formDescriptionId}
         className={cn(formDescriptionVariants({ className }))}
         ref={ref}
         {...props}
       />
     );
   }
   ```

10. **`FormMessage`** — Renders `<p>` with error message or children, returns `null` when empty:
    ```typescript
    export function FormMessage({ className, children, ref, ...props }: FormMessageProps) {
      const { error, formMessageId } = useFormField();
      const body = error ? String(error.message) : children;
      if (!body) {
        return null;
      }
      return (
        <p
          data-slot="form-message"
          id={formMessageId}
          className={cn(formMessageVariants({ className }))}
          aria-live="polite"
          ref={ref}
          {...props}
        >
          {body}
        </p>
      );
    }
    ```

**Import structure at the top of `form.tsx`**:

```typescript
import { createContext, useContext, useId } from 'react';
import { Controller, FormProvider, useFormContext } from 'react-hook-form';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '../../lib/utils.js';
import { Label } from '../label/label.js';
import { formDescriptionVariants, formItemVariants, formMessageVariants } from './form.styles.js';
import type {
  FormControlProps,
  FormDescriptionProps,
  FormFieldContextValue,
  FormFieldProps,
  FormItemContextValue,
  FormItemProps,
  FormLabelProps,
  FormMessageProps,
} from './form.types.js';
```

**Type re-exports at the top of `form.tsx`** (following the pattern from all existing components):

```typescript
export type {
  FormControlProps,
  FormDescriptionProps,
  FormFieldProps,
  FormItemProps,
  FormLabelProps,
  FormMessageProps,
} from './form.types.js';
```

### 3.4 `form.test.tsx`

**Purpose**: Comprehensive test suite covering all sub-components, context wiring, ARIA linking, validation error display, and integration with existing form controls.

**Test setup**: Each test that involves form validation creates a minimal wrapper:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
```

A reusable test helper renders a `Form` with a single field:

```typescript
function TestForm({
  schema,
  defaultValues,
  children,
  onSubmit = () => {},
}: {
  schema: z.ZodType;
  defaultValues: Record<string, unknown>;
  children: React.ReactNode;
  onSubmit?: (values: unknown) => void;
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {children}
        <button type="submit">Submit</button>
      </form>
    </Form>
  );
}
```

**Test cases** (16 tests):

1. **Smoke render**: `TestForm` with a single text `FormField` + `Input` renders without crashing
2. **FormItem `data-slot`**: `FormItem` renders `<div>` with `data-slot="form-item"`
3. **FormLabel `htmlFor` linking**: `FormLabel` renders with `htmlFor` matching the `FormControl` child's `id`
4. **FormControl `aria-describedby`**: `FormControl` applies `aria-describedby` containing the `FormDescription`'s `id`
5. **FormDescription `id` matches**: `FormDescription` renders `<p>` with `id` that matches the `aria-describedby` on `FormControl`
6. **FormMessage empty when no error**: `FormMessage` renders nothing (returns `null`) when no validation error exists
7. **Validation error displays**: Submitting an empty required field causes `FormMessage` to display the zod error text
8. **FormMessage `aria-live`**: `FormMessage` has `aria-live="polite"` attribute when rendered
9. **FormLabel error styling**: `FormLabel` applies `text-destructive` class when field has a validation error
10. **FormControl `aria-invalid`**: `FormControl` applies `aria-invalid="true"` when field has error
11. **`aria-describedby` includes both IDs on error**: When error is present, `FormControl`'s `aria-describedby` includes both the description ID and the message ID
12. **FormMessage children fallback**: `FormMessage` displays `children` when no error exists but children are provided
13. **Integration with Input**: Form wrapping `Input` with `z.string().min(2)` validation — submit empty → error shown, enter valid → error clears
14. **Integration with Checkbox**: Form wrapping `Checkbox` with `z.boolean()` validation — renders and validates
15. **Multiple fields**: Form with two `FormField`s, each independently validated, showing that error on one doesn't affect the other
16. **Accessibility (axe)**: `axe` assertions on a form with description and without validation errors, and a second `axe` assertion on a form in error state

### 3.5 `form.stories.tsx`

**Purpose**: Demonstrate the Form component with all previously built form controls.

**Meta**:

```typescript
const meta: Meta = {
  title: 'Components/Form',
  tags: ['autodocs'],
};
```

Note: The `meta` does not use `component: Form` because `Form` is a context provider (re-export of `FormProvider`) with no renderable element or meaningful props for autodocs to introspect. Instead, the stories themselves demonstrate the full pattern.

**Stories** (8):

1. **SimpleTextField** — `Input` + `FormLabel` + `FormDescription` + `FormMessage` with `z.string().min(2, { message: 'Must be at least 2 characters.' })`
2. **WithValidationError** — Same as SimpleTextField but uses `form.trigger()` in a `useEffect` to immediately show error state
3. **WithTextarea** — `Textarea` with `z.string().max(200, { message: 'Max 200 characters.' })`
4. **WithCheckbox** — `Checkbox` with `z.boolean().refine((v) => v, { message: 'You must accept.' })`
5. **WithSelect** — `Select`/`SelectTrigger`/`SelectContent`/`SelectItem` with `z.enum(['apple', 'banana', 'cherry'])`
6. **WithRadioGroup** — `RadioGroup`/`RadioGroupItem` with `z.enum(['light', 'dark', 'system'])`
7. **WithSwitch** — `Switch` with `z.boolean()`
8. **CompleteForm** — Multiple field types (Input for name, Input for email with `z.string().email()`, Textarea for bio, Select for role, Checkbox for terms) with a submit handler that logs values to console

Each story wraps its content in a self-contained render function that calls `useForm` with `zodResolver` and renders the full `Form` → `form` → `FormField` → `FormItem` → `FormLabel` + `FormControl` + `FormDescription` + `FormMessage` pattern.

### 3.6 `index.ts` modifications

Add these export blocks at the end of the file:

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
  type FormFieldProps,
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

## 4. API Contracts

### `Form` (FormProvider re-export)

Accepts all props from `react-hook-form`'s `FormProvider` — primarily the return value of `useForm()` spread as props:

```tsx
const form = useForm({ resolver: zodResolver(schema), defaultValues });
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>{/* FormFields */}</form>
</Form>;
```

### `FormField`

```tsx
<FormField
  control={form.control}
  name="username" // keyof TFieldValues
  render={({ field }) => (
    <FormItem>
      <FormLabel>Username</FormLabel>
      <FormControl>
        <Input placeholder="Enter username" {...field} />
      </FormControl>
      <FormDescription>Your public display name.</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

**Input**: `control` (from `useForm`), `name` (field path string), `render` (receives `{ field, fieldState, formState }`)
**Output**: Renders the `render` prop's return value within `FormFieldContext`

### `useFormField()` return type

```typescript
{
  id: string;               // useId()-generated base ID
  name: string;             // field name from FormFieldContext
  formItemId: string;       // `${id}-form-item` — used as the control's `id` and label's `htmlFor`
  formDescriptionId: string; // `${id}-form-item-description`
  formMessageId: string;    // `${id}-form-item-message`
  invalid: boolean;
  isDirty: boolean;
  isTouched: boolean;
  isValidating: boolean;
  error?: FieldError;       // from react-hook-form
}
```

### Complete usage example

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  username: z.string().min(2, { message: 'At least 2 characters.' }),
});

function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { username: '' },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

## 5. Test Plan

### Test Environment

- **Runner**: Vitest (via `pnpm test` which runs `vitest run`)
- **DOM**: jsdom (configured in `vitest.config.ts`)
- **Libraries**: `@testing-library/react`, `@testing-library/user-event`, `vitest-axe`
- **Setup**: `src/test-setup.ts` already includes `ResizeObserver` stub, pointer capture stubs, and `vitest-axe/matchers`

### Test Helper

A `TestForm` wrapper component used across tests to avoid boilerplate:

```typescript
function TestForm({
  schema,
  defaultValues,
  children,
  onSubmit = () => {},
}: {
  schema: z.ZodType;
  defaultValues: Record<string, unknown>;
  children: React.ReactNode;
  onSubmit?: (values: unknown) => void;
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {children}
        <button type="submit">Submit</button>
      </form>
    </Form>
  );
}
```

### Per-Test Specification

| #   | Test Name                                     | Setup                                                                   | Action                                                               | Assertion                                                                       |
| --- | --------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 1   | Smoke render                                  | `TestForm` with `z.object({ name: z.string() })`, `FormField` + `Input` | Render                                                               | `screen.getByRole('textbox')` exists                                            |
| 2   | FormItem applies `data-slot`                  | Same                                                                    | Render                                                               | Element with `data-slot="form-item"` exists                                     |
| 3   | FormLabel `htmlFor` links to control          | Same, with `FormLabel` text "Name"                                      | Render                                                               | `screen.getByLabelText('Name')` returns the input (verifies htmlFor→id linking) |
| 4   | FormControl `aria-describedby`                | Same, with `FormDescription` text "Enter name"                          | Render                                                               | Input's `aria-describedby` includes description element's `id`                  |
| 5   | FormDescription `id` matches                  | Same                                                                    | Render                                                               | `FormDescription`'s `id` matches the id referenced in `aria-describedby`        |
| 6   | FormMessage empty when no error               | Same, with `<FormMessage />`                                            | Render                                                               | No element with `data-slot="form-message"` exists                               |
| 7   | Validation error displays                     | `z.object({ name: z.string().min(2) })`, default `""`                   | Click submit, `await waitFor`                                        | `FormMessage` text contains error message                                       |
| 8   | FormMessage `aria-live`                       | Same as #7                                                              | Click submit                                                         | Element with `data-slot="form-message"` has `aria-live="polite"`                |
| 9   | FormLabel error styling                       | Same as #7                                                              | Click submit                                                         | Label element has class `text-destructive`                                      |
| 10  | FormControl `aria-invalid` on error           | Same as #7                                                              | Click submit                                                         | Input has `aria-invalid="true"`                                                 |
| 11  | `aria-describedby` includes both IDs on error | Same as #7, with both `FormDescription` and `FormMessage`               | Click submit                                                         | Input's `aria-describedby` contains both description ID and message ID          |
| 12  | FormMessage children fallback                 | `FormMessage` with children "Custom message", no error                  | Render                                                               | Element displays "Custom message"                                               |
| 13  | Integration with Input                        | `z.object({ email: z.string().email() })`, `FormField` + `Input`        | Submit empty → error shown; type valid email → submit → error clears | Error message appears then disappears                                           |
| 14  | Integration with Checkbox                     | `z.object({ accept: z.boolean() })`, `FormField` + `Checkbox`           | Render                                                               | Checkbox renders within form context                                            |
| 15  | Multiple fields                               | Two `FormField`s with independent `z.string().min(1)` schemas           | Submit with one field empty                                          | Only the empty field's `FormMessage` shows error                                |
| 16  | Accessibility (axe) — no errors               | Full form with description, no validation errors                        | `axe(container)`                                                     | No violations                                                                   |
| 17  | Accessibility (axe) — with errors             | Full form after triggering validation error                             | `axe(container)`                                                     | No violations                                                                   |

## 6. Implementation Order

1. **`form.types.ts`** — Define all types first. No dependencies on other form files.

2. **`form.styles.ts`** — Define CVA variants. No dependencies on other form files. Can be done in parallel with step 1.

3. **`form.tsx`** — Implement all components and the `useFormField` hook. Depends on types from step 1 and styles from step 2. This is the core implementation.

4. **`form.test.tsx`** — Write the full test suite. Depends on the working implementation from step 3. Run tests to verify correctness.

5. **`form.stories.tsx`** — Write all Storybook stories. Depends on the working implementation from step 3. Can be done in parallel with step 4.

6. **`index.ts`** — Add all exports. Depends on step 3 being complete so exports resolve. Do this last to confirm export names match actual implementations.

## 7. Verification Commands

```bash
# Run all tests in the ui package (includes form tests)
pnpm --filter @components/ui test

# Run only form tests
pnpm --filter @components/ui test -- src/components/form/form.test.tsx

# TypeScript type checking
pnpm --filter @components/ui typecheck

# Lint check
pnpm --filter @components/ui lint

# Full monorepo type check
pnpm typecheck

# Build the ui package (verifies exports resolve)
pnpm --filter @components/ui build

# Launch Storybook to visually verify stories
pnpm storybook
```

## 8. Design Deviations

### Deviation 1: Context uses React 19 `createContext` as component (no `.Provider`)

**Parent spec requires**: The phase spec mentions "FormFieldContext" and "FormItemContext" as React context layers but does not specify the rendering pattern.

**Issue**: In React 19, `createContext` returns an object that can be used directly as a JSX component with a `value` prop (`<MyContext value={...}>`), eliminating the need for `.Provider`. All existing components in this codebase target React 19.

**Alternative chosen**: Use `<FormFieldContext value={{ name: props.name }}>` directly rather than `<FormFieldContext.Provider value={{ name: props.name }}>`. This is correct for React 19 and consistent with the project's React 19 conventions.

### Deviation 2: Slider variant exports in `index.ts` — only `sliderVariants` exported by t02

**Parent spec requires**: The phase spec's export block for Slider in `index.ts` lists `sliderVariants`, `sliderTrackVariants`, `sliderRangeVariants`, and `sliderThumbVariants`.

**Current state**: Task t02 only exported `sliderVariants` from `index.ts` (the track, range, and thumb variants are not exported). Since this task (t03) concerns the Form component, not Slider, and the Slider is already working and exported, this deviation is noted but not acted upon — it is outside t03's scope.

### Deviation 3: `FormFieldProps` not re-exported as a type from `index.ts`

**Parent spec requires**: The phase spec lists `FormFieldProps` among the type exports.

**Issue**: `FormFieldProps` is a generic type (`FormFieldProps<TFieldValues, TName>`) with constrained type parameters that extend `FieldValues` and `FieldPath<TFieldValues>` from `react-hook-form`. Re-exporting this type is valid and useful — consumers who want to type-annotate their own wrappers around `FormField` will need it. The plan includes this export. However, if it causes type resolution issues (because the generic constraints reference `react-hook-form` types that may not be directly accessible to consumers), the export will be kept but documented as requiring `react-hook-form` types to use.

**Alternative**: Export it as planned. The types from `react-hook-form` are transitive dependencies and TypeScript will resolve them through declaration files. No deviation needed; this note is for awareness.

None of the above constitute changes to the component's behavior or API — they are all implementation-level adaptations to the project's React 19 + current dependency versions.
