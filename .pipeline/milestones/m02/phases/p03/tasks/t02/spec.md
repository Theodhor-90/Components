# Task: Slider Component

## Objective

Create the complete Slider component directory (`packages/ui/src/components/slider/`) following the canonical 5-file pattern, and add public API exports to `packages/ui/src/index.ts`.

## Deliverables

- Complete `packages/ui/src/components/slider/` directory with 5 files.
- Public API exports added to `packages/ui/src/index.ts`.

## Files to Create

### 1. `packages/ui/src/components/slider/slider.types.ts`

- `SliderProps` extending `React.ComponentProps<typeof SliderPrimitive.Root>` from `@radix-ui/react-slider`.
- No additional custom props — `value`, `defaultValue`, `onValueChange`, `min`, `max`, `step`, `disabled`, `orientation`, `name` are all inherited from the Radix primitive base type.

### 2. `packages/ui/src/components/slider/slider.styles.ts`

Four CVA exports, each with **base classes only** (no configurable variants — DD-1):

- `sliderVariants`: `relative flex w-full touch-none select-none items-center`
- `sliderTrackVariants`: `relative h-2 w-full grow overflow-hidden rounded-full bg-secondary`
- `sliderRangeVariants`: `absolute h-full bg-primary`
- `sliderThumbVariants`: `block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`

### 3. `packages/ui/src/components/slider/slider.tsx`

- Single `Slider` functional component wrapping `SliderPrimitive.Root`.
- Sub-components are internal (DD-2 — not exported separately):
  - `SliderPrimitive.Track` with `cn(sliderTrackVariants())` containing `SliderPrimitive.Range` with `cn(sliderRangeVariants())`.
  - One `SliderPrimitive.Thumb` per value in the `value`/`defaultValue` array. Single number = one thumb; two-element array = range slider (two thumbs). Thumbs rendered by mapping over the current value array.
- Root element: `data-slot="slider"`, `cn(sliderVariants({ className }))`.
- React 19 `ref` as prop (no `forwardRef`).
- Named export only.

### 4. `packages/ui/src/components/slider/slider.test.tsx`

Vitest + Testing Library + vitest-axe tests covering:

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

### 5. `packages/ui/src/components/slider/slider.stories.tsx`

CSF3 stories with `tags: ['autodocs']`:

- Default (single value)
- With Default Value
- Range (two thumbs)
- Custom Min/Max/Step
- Disabled
- With Label (composing with Label component)
- Controlled

## File to Modify

### `packages/ui/src/index.ts`

Add the following exports:

```typescript
export { Slider, type SliderProps } from './components/slider/slider.js';
export {
  sliderVariants,
  sliderTrackVariants,
  sliderRangeVariants,
  sliderThumbVariants,
} from './components/slider/slider.styles.js';
```

## Key Constraints

- Follow the Button component as the canonical 5-file reference implementation.
- Use semantic tokens (`border-primary`, `bg-secondary`, `bg-primary`, `bg-background`, `ring-ring`).
- Use `cn()` for class merging.
- React 19 ref-as-prop — no `forwardRef`.
- Named exports only.

## Dependencies

- **Task t01** must be complete (`@radix-ui/react-slider` must be installed).
- Independent of Task t03 (Slider and Form can be implemented in parallel, though sequential order is recommended).

## Verification Criteria

1. `packages/ui/src/components/slider/` contains all 5 files.
2. Slider renders single thumb for single value and two thumbs for range mode.
3. Slider thumb(s) have `role="slider"` with correct `aria-valuemin`, `aria-valuemax`, `aria-valuenow`.
4. Slider supports `min`, `max`, `step`, `disabled`, and controlled/uncontrolled usage.
5. Slider keyboard: arrow keys adjust thumb value by step amount.
6. All Slider tests pass (`pnpm test`).
7. Slider renders correctly in Storybook with all stories visible under autodocs.
8. Exports are added to `packages/ui/src/index.ts`.
