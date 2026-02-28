# Milestone 2: Form Controls

## Goal

Deliver all form input components so consumer apps can build complete, accessible, validated forms. After this milestone, apps can build login forms, settings pages, and filter interfaces.

## Phases

### Phase 1: Text Inputs

Input (shadcn port, styled `<input>` supporting all HTML input types with error state via `aria-invalid`), Textarea (shadcn port, styled `<textarea>` with optional auto-resize behavior).

### Phase 2: Selection Controls

Checkbox (shadcn port wrapping `@radix-ui/react-checkbox` with indeterminate state), Switch (shadcn port wrapping `@radix-ui/react-switch`), Radio Group with RadioGroupItem (shadcn port wrapping `@radix-ui/react-radio-group`), Toggle (shadcn port wrapping `@radix-ui/react-toggle` with default/outline variants), Toggle Group with ToggleGroupItem (shadcn port wrapping `@radix-ui/react-toggle-group` with single/multiple selection modes), Select with SelectTrigger, SelectContent, SelectItem, SelectGroup, SelectLabel, SelectSeparator (shadcn port wrapping `@radix-ui/react-select`).

### Phase 3: Range & Form

Slider (shadcn port wrapping `@radix-ui/react-slider` with single and range modes), Form with FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage (shadcn port composing react-hook-form `Controller` + `@radix-ui/react-label` + zod validation; provides form context for error message display and `aria-describedby` linking).

## Exit Criteria

1. All 11 components render correctly in Storybook with all variants and states documented
2. `pnpm test` passes with vitest-axe accessibility assertions for every component
3. `pnpm typecheck` passes with no errors
4. Input and Textarea support controlled and uncontrolled usage
5. Checkbox supports checked, unchecked, and indeterminate states
6. Select opens on click and keyboard, supports option groups, and closes on selection
7. Toggle Group enforces single or multiple selection based on `type` prop
8. Form component correctly displays validation errors from zod schemas and links error messages to inputs via `aria-describedby`
9. All components use semantic tokens (`border-input`, `ring-ring`, `bg-background`, etc.)
10. All components are exported from `packages/ui/src/index.ts`
