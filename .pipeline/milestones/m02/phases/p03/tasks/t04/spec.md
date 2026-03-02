# Task: Storybook & Integration Verification

## Objective

Verify that both Slider and Form components render correctly in Storybook, all tests pass, typecheck succeeds, and Form stories demonstrate integration with all previously built Phase 1 and Phase 2 components.

## Deliverables

- All Slider and Form tests passing.
- TypeScript type-checking passing with no errors.
- All Storybook stories rendering correctly with autodocs.
- Form integration with Phase 1 and Phase 2 components verified.

## Verification Steps

### 1. Run Tests

- Run `pnpm test` across the `@components/ui` package.
- All Slider tests must pass, including vitest-axe accessibility assertions.
- All Form tests must pass, including vitest-axe accessibility assertions and integration tests with Input, Checkbox, and Select.
- No regressions in existing component tests from Milestone 1, Phase 1, or Phase 2.

### 2. Run Typecheck

- Run `pnpm typecheck` across the `@components/ui` package.
- No type errors in the package.
- Verify that the new exports in `index.ts` resolve correctly.

### 3. Verify Storybook

- Run Storybook and confirm all stories render for both Slider and Form.
- Verify autodocs pages generate correctly for both components.
- Slider stories: Default, With Default Value, Range, Custom Min/Max/Step, Disabled, With Label, Controlled.
- Form stories: Simple Text Field, With Validation Error, With Textarea, With Checkbox, With Select, With Radio Group, With Switch, Complete Form.

### 4. Integration Checks

- Form stories must demonstrate working integration with previously built components: Input, Textarea, Checkbox, Switch, Radio Group, Select.
- Verify that submitting forms triggers zod validation and error messages display correctly.
- Verify that `aria-describedby`, `aria-invalid`, and `htmlFor` linking works end-to-end.

### 5. Fix Any Issues

- If any tests fail, type errors are found, or Storybook stories don't render, fix the issues in the relevant component files.
- Re-run verification steps after fixes.

## Files Potentially Modified

- Any of the files created in Tasks t02 and t03 if fixes are needed.
- `packages/ui/src/index.ts` if export issues are found.

## Dependencies

- **Task t01** (Install Dependencies) must be complete.
- **Task t02** (Slider Component) must be complete.
- **Task t03** (Form Component) must be complete.

## Verification Criteria

1. `pnpm test` passes with zero failures across all Slider and Form tests.
2. `pnpm typecheck` passes with no errors in the `@components/ui` package.
3. All Slider stories render in Storybook with autodocs.
4. All Form stories render in Storybook with autodocs.
5. Form stories demonstrate integration with Input, Textarea, Checkbox, Switch, Radio Group, and Select.
6. No regressions in existing component tests from previous milestones/phases.
7. All milestone 2 phase 3 exit criteria are satisfied:
   - Slider: single/range modes, keyboard control, ARIA attributes, semantic tokens.
   - Form: context wiring, `aria-describedby` linking, `aria-invalid`, `aria-live="polite"`, `text-destructive` error styling.
   - Both components exported from `packages/ui/src/index.ts`.
