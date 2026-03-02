Now I have everything I need. Let me look at what the form stories include for Slider integration and check if there's a `Slider` import in form stories — it's not present. The task spec says to verify Form stories demonstrate integration with Slider too. Let me check if there's a `WithSlider` story missing from the form stories.

Looking at the form stories, there is no `WithSlider` story — the phase spec Task 3 mentions "Storybook CSF3 stories demonstrating Form with Input, Textarea, Checkbox, Switch, RadioGroup, Select, and Slider." This is relevant for Task 4.

Now I have full context. Here's the specification:

# Task 4: Storybook & Integration Verification

## 1. Deliverables

| File                                               | Action             | Purpose                                                                                                                                                                                                                     |
| -------------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/ui/src/components/form/form.stories.tsx` | Modify             | Add missing `WithSlider` story demonstrating Form + Slider integration with zod validation                                                                                                                                  |
| `packages/ui/src/components/form/form.test.tsx`    | Modify             | Add integration test for Form + Select (currently missing — the existing "integrates with Checkbox" test exists, but Select integration test is specified in the phase spec and absent), and Form + Slider integration test |
| Any Slider/Form source files                       | Modify (if needed) | Fix any issues discovered during test/typecheck/Storybook verification                                                                                                                                                      |

## 2. Dependencies

- **Task t01** (Install Dependencies) — complete: `@radix-ui/react-slider`, `react-hook-form`, `@hookform/resolvers`, `zod` are installed.
- **Task t02** (Slider Component) — complete: all 5 Slider files exist and are exported.
- **Task t03** (Form Component) — complete: all 5 Form files exist and are exported.
- **All Phase 1 and Phase 2 components** — complete: Input, Textarea, Checkbox, Switch, RadioGroup, Toggle, ToggleGroup, Select are implemented.
- No new packages need to be installed.

## 3. Implementation Details

### 3.1 `form.stories.tsx` — Add `WithSlider` Story

**Purpose**: The phase spec (Task 3) specifies that Form stories should demonstrate integration with "Input, Textarea, Checkbox, Switch, RadioGroup, Select, and Slider." The current stories cover all except Slider. A `WithSlider` story is needed.

**Exports**: `WithSlider` (named story export)

**Key logic**:

- Create a `WithSliderDemo` render function following the existing story pattern.
- Use a zod schema with `z.array(z.number()).length(1)` or `z.number().min(0).max(100)` — noting that Slider's `onValueChange` returns `number[]`, so the form field value must be `number[]`.
- Wrap Slider with `FormField` → `FormItem` → `FormLabel` + `FormControl` + `FormDescription` + `FormMessage`.
- Since Slider uses `value`/`onValueChange` (not the standard `input` event), the FormField render prop must explicitly pass `field.value` to `value` and `field.onChange` to `onValueChange`, similar to how Checkbox uses `checked`/`onCheckedChange`.
- Display current value in the description or as supplementary text.

**Implementation**:

```typescript
function WithSliderDemo() {
  const schema = z.object({
    volume: z.array(z.number().min(0).max(100)),
  });
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { volume: [50] },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="space-y-4">
        <FormField
          control={form.control}
          name="volume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Volume</FormLabel>
              <FormControl>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormDescription>Adjust the volume level.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export const WithSlider: Story = {
  render: () => <WithSliderDemo />,
};
```

The `Slider` import must be added to the imports block:

```typescript
import { Slider } from '../slider/slider.js';
```

### 3.2 `form.test.tsx` — Add Integration Tests

**Purpose**: The phase spec's test plan calls for "Integration with Select: Form wrapping Select with zod enum validation" and integration with Slider. The existing tests cover Input and Checkbox integration but not Select or Slider.

**New test: "integrates with Select"**

```typescript
it('integrates with Select', async () => {
  const user = userEvent.setup();
  const fruitSchema = z.object({
    fruit: z.enum(['apple', 'banana', 'cherry'], { message: 'Please select a fruit.' }),
  });
  render(
    <TestForm schema={fruitSchema} defaultValues={{ fruit: '' }}>
      <FormField
        name="fruit"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fruit</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="cherry">Cherry</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </TestForm>,
  );
  expect(screen.getByRole('combobox')).toBeInTheDocument();
});
```

The Select, SelectContent, SelectItem, SelectTrigger, SelectValue imports must be added.

**New test: "integrates with Slider"**

```typescript
it('integrates with Slider', () => {
  const sliderSchema = z.object({ volume: z.array(z.number()) });
  render(
    <TestForm schema={sliderSchema} defaultValues={{ volume: [50] }}>
      <FormField
        name="volume"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Volume</FormLabel>
            <FormControl>
              <Slider
                min={0}
                max={100}
                step={1}
                value={field.value}
                onValueChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </TestForm>,
  );
  expect(screen.getByRole('slider')).toBeInTheDocument();
});
```

The Slider import must be added.

### 3.3 Verification & Fix Pass

**Purpose**: Run the full test suite, typecheck, and visually verify Storybook to catch any issues from t02/t03.

**Steps**:

1. Run `pnpm --filter @components/ui test` — all tests must pass including vitest-axe.
2. Run `pnpm --filter @components/ui typecheck` — no type errors.
3. Run `pnpm storybook` (or `pnpm --filter @components/docs storybook`) — visually verify all Slider and Form stories render.
4. If any failures are found, fix the relevant source files and re-run.

## 4. API Contracts

N/A — This task adds stories and tests, not new component APIs.

## 5. Test Plan

### Test Setup

The existing test infrastructure is already in place:

- Vitest with jsdom environment
- `@testing-library/react` and `@testing-library/user-event`
- `vitest-axe` for accessibility assertions
- `TestForm` helper component already defined in `form.test.tsx`

### New Tests in `form.test.tsx`

| Test                     | Description                                            | Assertion                                         |
| ------------------------ | ------------------------------------------------------ | ------------------------------------------------- |
| `integrates with Select` | Renders Form wrapping Select with zod enum validation  | `screen.getByRole('combobox')` is in the document |
| `integrates with Slider` | Renders Form wrapping Slider with zod array validation | `screen.getByRole('slider')` is in the document   |

### Existing Tests (must continue passing)

All 17 existing tests in `form.test.tsx` and all 13 existing tests in `slider.test.tsx` must continue to pass without modification. All tests from Phase 1, Phase 2, and Milestone 1 must not regress.

### Full Test Suite Verification

Run `pnpm --filter @components/ui test` to execute all component tests including:

- All Slider tests (smoke, data-slot, className, single/range thumbs, ARIA, min/max/step, disabled, controlled, uncontrolled, keyboard, ref, a11y)
- All Form tests (smoke, data-slot, label linking, aria-describedby, FormMessage, validation errors, aria-live, text-destructive, aria-invalid, combined describedby IDs, children fallback, Input integration, Checkbox integration, Select integration, Slider integration, multi-field validation, a11y clean, a11y with errors)

## 6. Implementation Order

1. **Add imports to `form.test.tsx`** — Add `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue` from `../select/select.js` and `Slider` from `../slider/slider.js`.
2. **Add "integrates with Select" test** to `form.test.tsx`.
3. **Add "integrates with Slider" test** to `form.test.tsx`.
4. **Add `Slider` import to `form.stories.tsx`** — `import { Slider } from '../slider/slider.js';`
5. **Add `WithSliderDemo` function and `WithSlider` story** to `form.stories.tsx`, placed after `WithSwitch` and before `CompleteForm`.
6. **Run `pnpm --filter @components/ui test`** — verify all tests pass.
7. **Run `pnpm --filter @components/ui typecheck`** — verify no type errors.
8. **Visually verify Storybook** — confirm all Slider and Form stories render with autodocs.
9. **Fix any issues** discovered in steps 6–8 by modifying the relevant source files, then re-run verification.

## 7. Verification Commands

```bash
# Run all tests in the ui package
pnpm --filter @components/ui test

# Run only Slider tests
pnpm --filter @components/ui test -- --testPathPattern=slider

# Run only Form tests
pnpm --filter @components/ui test -- --testPathPattern=form

# TypeScript type checking
pnpm --filter @components/ui typecheck

# Run full monorepo typecheck (catches cross-package issues)
pnpm typecheck

# Launch Storybook for visual verification
pnpm storybook
```

## 8. Design Deviations

**Deviation 1: Select integration test uses smoke assertion only**

- **Parent spec requires**: "Integration with Select: Form wrapping Select with zod enum validation" — implying full submit + validation error flow.
- **Why this is adjusted**: Radix Select renders its dropdown content in a portal and uses complex positioning that is difficult to interact with reliably in jsdom. `userEvent.click` on a SelectTrigger does not reliably open the dropdown in jsdom (it relies on pointer events and Radix's internal pointer tracking). The existing `form.stories.tsx` already has a `WithSelect` story that demonstrates the full validation flow interactively in Storybook.
- **Alternative chosen**: The integration test verifies that Form + Select renders correctly together (the `combobox` role element exists, ARIA wiring is applied). This confirms the structural integration works. Full interactive validation is covered by the Storybook story and can be verified with E2E tests if needed. This follows the same pattern as the existing "integrates with Checkbox" test, which also tests rendering without full validation flow.

**Deviation 2: Slider integration test uses smoke assertion only**

- **Parent spec requires**: Integration test for Form + Slider.
- **Why this is adjusted**: Slider thumb interaction via `userEvent` in jsdom is unreliable (requires pointer drag simulation). The existing `slider.test.tsx` already covers keyboard interaction and value changes thoroughly. The Form integration test verifies structural wiring (Slider renders within Form context, ARIA attributes are applied).
- **Alternative chosen**: Smoke render test confirming `role="slider"` exists within the Form context. Full interactive validation is covered by the `WithSlider` Storybook story.
