I have all the context needed from the codebase itself, the phase spec, and the task spec. Let me now produce the implementation plan.

# Task t02: Slider Component — Implementation Plan

## 1. Deliverables

| File                                                   | Action | Purpose                                                                                      |
| ------------------------------------------------------ | ------ | -------------------------------------------------------------------------------------------- |
| `packages/ui/src/components/slider/slider.types.ts`    | Create | `SliderProps` type extending Radix Slider Root props + CVA `VariantProps`                    |
| `packages/ui/src/components/slider/slider.styles.ts`   | Create | CVA base-class definitions for root, track, range, and thumb sub-elements                    |
| `packages/ui/src/components/slider/slider.tsx`         | Create | Slider component wrapping `@radix-ui/react-slider` with internal track/range/thumb rendering |
| `packages/ui/src/components/slider/slider.test.tsx`    | Create | Vitest + Testing Library + vitest-axe test suite                                             |
| `packages/ui/src/components/slider/slider.stories.tsx` | Create | Storybook CSF3 stories with `tags: ['autodocs']`                                             |
| `packages/ui/src/index.ts`                             | Modify | Add Slider component, type, and CVA variant exports                                          |

## 2. Dependencies

### Already Installed (by sibling task t01)

- `@radix-ui/react-slider` — `^1.3.6` in `packages/ui/package.json`

### Pre-existing Infrastructure

- `class-variance-authority` — CVA for variant definitions
- `@components/utils` — `cn()` helper (clsx + tailwind-merge)
- Vitest + `@testing-library/react` + `@testing-library/user-event` + `vitest-axe` — test infrastructure
- `@storybook/react-vite` — Storybook types
- Label component — used in the "With Label" story

No new packages need to be installed.

## 3. Implementation Details

### 3.1 `slider.types.ts`

**Purpose**: Define the `SliderProps` type.

**Exports**:

- `SliderProps` — intersection of `React.ComponentProps<typeof SliderPrimitive.Root>` and `VariantProps<typeof sliderVariants>`

**Pattern**: Follows the exact same pattern as `checkbox.types.ts` and `switch.types.ts` — extends the Radix primitive Root's component props and intersects with CVA VariantProps. No additional custom props are needed since all configuration (`value`, `defaultValue`, `onValueChange`, `min`, `max`, `step`, `disabled`, `orientation`, `name`) is inherited from the Radix primitive.

```typescript
import type { VariantProps } from 'class-variance-authority';
import type * as SliderPrimitive from '@radix-ui/react-slider';

import type { sliderVariants } from './slider.styles.js';

export type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> &
  VariantProps<typeof sliderVariants>;
```

### 3.2 `slider.styles.ts`

**Purpose**: Define CVA variant exports for the slider root and its internal sub-elements.

**Exports**:

- `sliderVariants` — base classes for the Root element
- `sliderTrackVariants` — base classes for Track
- `sliderRangeVariants` — base classes for Range (filled portion)
- `sliderThumbVariants` — base classes for Thumb(s)

No configurable variants (no `variant` or `size` props) — base classes only per DD-1 in the phase spec. Follows the same pattern as `switchVariants` / `switchThumbVariants`.

```typescript
import { cva } from 'class-variance-authority';

export const sliderVariants = cva('relative flex w-full touch-none select-none items-center');

export const sliderTrackVariants = cva(
  'relative h-2 w-full grow overflow-hidden rounded-full bg-secondary',
);

export const sliderRangeVariants = cva('absolute h-full bg-primary');

export const sliderThumbVariants = cva(
  'block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
);
```

### 3.3 `slider.tsx`

**Purpose**: Main Slider component implementation.

**Exports**:

- `Slider` — named function component
- Re-exports `SliderProps` type from types file

**Key Implementation Details**:

1. Import `@radix-ui/react-slider` as `SliderPrimitive` (namespace import, consistent with Checkbox/Switch/Select)
2. Destructure `className`, `defaultValue`, `ref`, and spread `...props` from `SliderProps`
3. Render `SliderPrimitive.Root` as the root element with `data-slot="slider"` and `cn(sliderVariants({ className }))`
4. Inside Root, render `SliderPrimitive.Track` containing `SliderPrimitive.Range`
5. **Thumb rendering**: Determine the number of thumbs from `props.value ?? defaultValue ?? [0]` — map over the values array to render one `SliderPrimitive.Thumb` per value. This allows single-value (one thumb) and range (two thumbs) modes. Each thumb gets `cn(sliderThumbVariants())`.
6. React 19 `ref` as prop on Root — no `forwardRef`
7. Pass `defaultValue` explicitly to Root (since it was destructured)

```typescript
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '../../lib/utils.js';
import {
  sliderRangeVariants,
  sliderThumbVariants,
  sliderTrackVariants,
  sliderVariants,
} from './slider.styles.js';
import type { SliderProps } from './slider.types.js';

export type { SliderProps } from './slider.types.js';

export function Slider({
  className,
  defaultValue = [0],
  ref,
  ...props
}: SliderProps): React.JSX.Element {
  const values = props.value ?? defaultValue;

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn(sliderVariants({ className }))}
      defaultValue={defaultValue}
      ref={ref}
      {...props}
    >
      <SliderPrimitive.Track className={cn(sliderTrackVariants())}>
        <SliderPrimitive.Range className={cn(sliderRangeVariants())} />
      </SliderPrimitive.Track>
      {values.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className={cn(sliderThumbVariants())}
        />
      ))}
    </SliderPrimitive.Root>
  );
}
```

### 3.4 `slider.test.tsx`

**Purpose**: Comprehensive test suite covering smoke rendering, ARIA attributes, controlled/uncontrolled modes, range mode, disabled state, ref forwarding, and accessibility.

**Test Categories** (14 tests):

1. **Smoke render** — renders without crashing, has `role="slider"` on thumb
2. **data-slot** — root element has `data-slot="slider"`
3. **Custom className** — merges custom className onto root
4. **Single thumb** — renders exactly one thumb for single `defaultValue`
5. **Range mode** — renders two thumbs for `defaultValue={[25, 75]}`
6. **ARIA attributes** — thumb has correct `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
7. **Custom min/max/step** — respects custom `min`, `max`, `step` props on ARIA attributes
8. **Disabled state** — disabled prop applies `data-disabled` attribute
9. **Controlled usage** — `value` + `onValueChange` callback fires on interaction
10. **Uncontrolled usage** — `defaultValue` sets initial value
11. **Ref forwarding** — `createRef` receives the DOM element
12. **Accessibility (single)** — `axe` has no violations on single-thumb slider
13. **Accessibility (range)** — `axe` has no violations on range slider
14. **Accessibility (with label)** — `axe` has no violations when composed with Label via `aria-label`

**Test Setup**: Each slider test wraps with `aria-label` to avoid axe label violations (Radix Slider thumb renders as `role="slider"` which requires an accessible name).

### 3.5 `slider.stories.tsx`

**Purpose**: Storybook documentation with interactive examples.

**Stories** (7 stories):

1. **Default** — single thumb at position 0, shows basic usage
2. **WithDefaultValue** — `defaultValue={[50]}`, pre-positioned thumb
3. **Range** — `defaultValue={[25, 75]}`, two-thumb range slider
4. **CustomMinMaxStep** — `min={0}`, `max={10}`, `step={2}`, `defaultValue={[4]}`
5. **Disabled** — `disabled={true}`, `defaultValue={[50]}`
6. **WithLabel** — composes Slider with `Label` component, demonstrating label association via `aria-label` or wrapping
7. **Controlled** — uses `useState` to demonstrate controlled value + display

**Meta configuration**:

- `title: 'Components/Slider'`
- `component: Slider`
- `tags: ['autodocs']`
- `argTypes` for interactive controls where applicable

### 3.6 `packages/ui/src/index.ts` (modification)

**Add exports** at the end of the file:

```typescript
export { Slider, type SliderProps } from './components/slider/slider.js';
export {
  sliderVariants,
  sliderTrackVariants,
  sliderRangeVariants,
  sliderThumbVariants,
} from './components/slider/slider.styles.js';
```

## 4. API Contracts

### SliderProps (Input)

```typescript
type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> &
  VariantProps<typeof sliderVariants>;
```

**Key props inherited from Radix Slider.Root**:

| Prop            | Type                         | Default        | Description                   |
| --------------- | ---------------------------- | -------------- | ----------------------------- |
| `defaultValue`  | `number[]`                   | `[0]`          | Initial uncontrolled value(s) |
| `value`         | `number[]`                   | —              | Controlled value(s)           |
| `onValueChange` | `(value: number[]) => void`  | —              | Callback on value change      |
| `onValueCommit` | `(value: number[]) => void`  | —              | Callback on pointer-up/key-up |
| `min`           | `number`                     | `0`            | Minimum value                 |
| `max`           | `number`                     | `100`          | Maximum value                 |
| `step`          | `number`                     | `1`            | Step increment                |
| `disabled`      | `boolean`                    | `false`        | Disables interaction          |
| `orientation`   | `'horizontal' \| 'vertical'` | `'horizontal'` | Slider orientation            |
| `name`          | `string`                     | —              | Form field name               |
| `className`     | `string`                     | —              | Additional CSS classes        |
| `ref`           | `React.Ref`                  | —              | Forwarded ref                 |

**Usage Examples**:

```tsx
// Single value (one thumb)
<Slider defaultValue={[50]} max={100} step={1} />

// Range (two thumbs)
<Slider defaultValue={[25, 75]} max={100} step={5} />

// Controlled
const [value, setValue] = useState([50]);
<Slider value={value} onValueChange={setValue} />

// Disabled
<Slider defaultValue={[30]} disabled />

// With label
<div>
  <Label htmlFor="volume">Volume</Label>
  <Slider id="volume" defaultValue={[50]} aria-label="Volume" />
</div>
```

## 5. Test Plan

### Test Setup

- **Framework**: Vitest with jsdom environment
- **Libraries**: `@testing-library/react`, `@testing-library/user-event`, `vitest-axe`
- **Config**: Uses existing `vitest.config.ts` and `src/test-setup.ts`
- **Imports**: `createRef` from `react`, `render`/`screen` from testing-library, `userEvent`, `axe` from vitest-axe, `describe`/`expect`/`it`/`vi` from vitest
- **Component imports**: `Slider` from `./slider.js`, `Label` from `../label/label.js`

### Test Specifications

| #   | Test Name                               | Setup                                                                                 | Action           | Assertion                                                                  |
| --- | --------------------------------------- | ------------------------------------------------------------------------------------- | ---------------- | -------------------------------------------------------------------------- |
| 1   | renders without crashing                | `render(<Slider aria-label="Test" />)`                                                | —                | `screen.getByRole('slider')` is in document                                |
| 2   | has data-slot attribute                 | `render(<Slider aria-label="Test" />)`                                                | —                | Root element (parent of slider role) has `data-slot="slider"`              |
| 3   | merges custom className                 | `render(<Slider aria-label="Test" className="custom-class" />)`                       | —                | Root element has class `custom-class`                                      |
| 4   | renders single thumb for single value   | `render(<Slider defaultValue={[50]} aria-label="Test" />)`                            | —                | `screen.getAllByRole('slider')` has length 1                               |
| 5   | renders two thumbs for range mode       | `render(<Slider defaultValue={[25, 75]} aria-label="Test" />)`                        | —                | `screen.getAllByRole('slider')` has length 2                               |
| 6   | thumb has correct ARIA value attributes | `render(<Slider defaultValue={[50]} aria-label="Test" />)`                            | —                | Thumb has `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-valuenow="50"` |
| 7   | supports custom min, max, step          | `render(<Slider min={10} max={50} step={5} defaultValue={[20]} aria-label="Test" />)` | —                | Thumb has `aria-valuemin="10"`, `aria-valuemax="50"`, `aria-valuenow="20"` |
| 8   | disabled state                          | `render(<Slider disabled defaultValue={[50]} aria-label="Test" />)`                   | —                | Root element has `data-disabled` attribute                                 |
| 9   | controlled usage                        | `render(<Slider value={[30]} onValueChange={onValueChange} aria-label="Test" />)`     | —                | Thumb has `aria-valuenow="30"`, callback prop is wired                     |
| 10  | uncontrolled usage                      | `render(<Slider defaultValue={[40]} aria-label="Test" />)`                            | —                | Thumb has `aria-valuenow="40"`                                             |
| 11  | forwards ref                            | `render(<Slider ref={ref} aria-label="Test" />)`                                      | —                | `ref.current` is an instance of `HTMLSpanElement`                          |
| 12  | has no a11y violations (single)         | `render(<Slider defaultValue={[50]} aria-label="Slider" />)`                          | `axe(container)` | No violations                                                              |
| 13  | has no a11y violations (range)          | `render(<Slider defaultValue={[25, 75]} aria-label="Range" />)`                       | `axe(container)` | No violations                                                              |
| 14  | has no a11y violations (with label)     | Render with Label + `htmlFor`                                                         | `axe(container)` | No violations                                                              |

## 6. Implementation Order

1. **`slider.types.ts`** — Define `SliderProps` type. No dependencies on other slider files.
2. **`slider.styles.ts`** — Define CVA exports. No dependencies on other slider files.
3. **`slider.tsx`** — Implement component. Depends on types and styles files.
4. **`slider.test.tsx`** — Write test suite. Depends on component implementation.
5. **`slider.stories.tsx`** — Write Storybook stories. Depends on component implementation.
6. **`packages/ui/src/index.ts`** — Add Slider exports. Depends on component and styles files existing.

## 7. Verification Commands

```bash
# Run Slider tests only
pnpm --filter @components/ui test -- --run src/components/slider/slider.test.tsx

# Run all tests in the ui package
pnpm --filter @components/ui test

# TypeScript type checking
pnpm --filter @components/ui typecheck

# Lint the slider files
pnpm --filter @components/ui lint

# Build the package to verify exports compile
pnpm --filter @components/ui build
```

## 8. Design Deviations

### Deviation 1: `defaultValue` default parameter

**Parent spec requires**: The task spec states "One `SliderPrimitive.Thumb` per value in the `value`/`defaultValue` array. Single number = one thumb; two-element array = range slider (two thumbs). Thumbs rendered by mapping over the current value array."

**Problem**: When neither `value` nor `defaultValue` is provided, the computed `values` variable would be `undefined`, and mapping would fail. The Radix Slider primitive internally defaults to `[0]` but does not expose its internal state for rendering.

**Alternative chosen**: Default `defaultValue` to `[0]` in the function parameter destructuring: `defaultValue = [0]`. This ensures the thumb mapping always has an array to iterate over. The `values` computation becomes `const values = props.value ?? defaultValue`, which is always a valid `number[]`. This matches the shadcn/ui approach where the component ensures a fallback value for thumb rendering.

### Deviation 2: No `asChild` prop

**Component creation guide suggests**: The AGENTS.md component creation guide template includes `asChild` as a standard prop.

**Why not applicable**: The Slider component wraps `@radix-ui/react-slider` Root, which does not support the `asChild` pattern (unlike Button which wraps a native `<button>`). Radix Slider Root is a composite component that renders its own internal structure (track, range, thumbs). The `asChild` pattern is only appropriate for leaf components that render a single element. This follows the same approach as Checkbox and Switch, which also do not expose `asChild`.
