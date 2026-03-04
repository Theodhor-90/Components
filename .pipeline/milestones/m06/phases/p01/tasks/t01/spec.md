## Objective

Build the Stepper custom compound component following the project's 5-file pattern. Stepper visualizes sequential step progress with support for horizontal and vertical orientations and four status states.

## Files to Create

| File | Purpose |
|------|--------|
| `packages/ui/src/components/stepper/stepper.tsx` | Component implementation |
| `packages/ui/src/components/stepper/stepper.types.ts` | Type definitions |
| `packages/ui/src/components/stepper/stepper.styles.ts` | CVA variant definitions |
| `packages/ui/src/components/stepper/stepper.test.tsx` | Test suite |
| `packages/ui/src/components/stepper/stepper.stories.tsx` | Storybook stories |

## Implementation Details

### Architecture
- **Compound component with React Context.** `Stepper` container accepts an `orientation` prop and provides it to children through `StepperContext`. `StepperItem` reads orientation from context — consumers set orientation once on the root `Stepper`.
- **Last-item detection via `Children.toArray()` + `cloneElement()`.** The `Stepper` container iterates children and injects `isLast` on the final child. `isLast` is an internal-only prop (annotated `@internal` in JSDoc), never set by consumers.
- **Connecting lines are part of `StepperItem`.** Each item (except the last) renders a connecting line after its icon. Completed items show a solid primary-colored line; all other statuses show a muted dashed line.
- **Status icons are inline SVGs** (circle for pending, filled circle for active, checkmark for completed, X for error), wrapped in `<span aria-hidden="true">` since status is conveyed via `aria-current="step"` on the active item and sr-only text.
- **No `asChild` support.** Stepper and StepperItem render as semantic `<div>` elements.

### Types (`stepper.types.ts`)
- `StepperContextType` — `{ orientation: 'horizontal' | 'vertical' }`
- `StepperProps` — extends `React.ComponentProps<'div'>` with `orientation` variant prop (defaults to `'horizontal'`), integrated with CVA `VariantProps`
- `StepperItemProps` — extends `React.ComponentProps<'div'>` with required `status` (`'pending' | 'active' | 'completed' | 'error'`), required `title` (string), optional `description` (string)
- `StepperItemInternalProps` — extends `StepperItemProps` with `isLast` (boolean), annotated `@internal`

### Styles (`stepper.styles.ts`)
- `stepperVariants` — CVA with orientation: `horizontal` → `flex-row`, `vertical` → `flex-col`
- `stepperItemVariants` — CVA with status-based icon and line coloring
- Plain string exports for sub-element styles (title, description, connector line, icon container)

### Component (`stepper.tsx`)
- `StepperContext` — React Context providing `{ orientation }`
- `Stepper` — wraps children in `StepperContext.Provider`, injects `isLast` on final child
- `StepperItem` — reads orientation from context, renders status icon + connecting line + title + optional description
- `data-slot="stepper"` on root, `data-slot="stepper-item"` on items
- `aria-current="step"` on the active step item
- Horizontal layout: icon beside text, line extends horizontally
- Vertical layout: icon above text, line extends vertically

### Tests (`stepper.test.tsx`)
- Smoke render (horizontal default)
- Vertical orientation render
- All four status states render correct icons
- Connecting lines render between items (not after last)
- Completed step shows distinct line style
- Title and description render
- Custom className merging
- `data-slot` attributes present
- Ref forwarding
- `aria-current="step"` on active item
- Orientation flows through context (set once on Stepper, applied to all StepperItems)
- vitest-axe accessibility assertions for both orientations

### Stories (`stepper.stories.tsx`)
- CSF3 format with `tags: ['autodocs']`
- Stories: Horizontal (default), Vertical, AllStatuses, WithDescriptions, ThreeStepProgress (realistic: steps 1–2 completed, step 3 active, step 4 pending), SingleStep, ErrorState

## Dependencies
- No prior tasks within this phase
- Uses `cn()` from `@components/utils`, `class-variance-authority` for CVA — both already installed
- No new external dependencies

## Verification Criteria
1. All 5 files exist under `packages/ui/src/components/stepper/`
2. Stepper renders in both horizontal and vertical orientations with correct flexbox layout
3. StepperItem renders correct status icon for each of the four states
4. Connecting lines appear between items but not after the last item
5. Completed steps show visually distinct connecting lines
6. Active StepperItem has `aria-current="step"`
7. Orientation is set once on Stepper and flows to all children via context
8. `isLast` is never part of the public API
9. `data-slot` attributes are present on all elements
10. All tests pass including vitest-axe accessibility assertions