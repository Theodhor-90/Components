Now I have all the context needed. Let me produce the complete implementation plan.

## 1. Deliverables

| # | File | Action | Purpose |
|---|------|--------|---------|
| 1 | `packages/ui/src/components/color-picker/color-picker.types.ts` | Create | `ColorPickerProps` type definition with controlled/uncontrolled value props |
| 2 | `packages/ui/src/components/color-picker/color-picker.styles.ts` | Create | Plain string style constants for trigger, popover, palette grid, swatches, hex input, and preview |
| 3 | `packages/ui/src/components/color-picker/color-picker.tsx` | Create | Color Picker implementation composing Popover + Button + Input with palette grid, hex input, and preview swatch |
| 4 | `packages/ui/src/components/color-picker/color-picker.test.tsx` | Create | Vitest + Testing Library + vitest-axe test suite |
| 5 | `packages/ui/src/components/color-picker/color-picker.stories.tsx` | Create | Storybook CSF3 stories with autodocs |
| 6 | `packages/ui/src/index.ts` | Modify | Add exports for `ColorPicker` and `ColorPickerProps` |

## 2. Dependencies

### Prior milestones (already complete)

- **Milestone 1** — `Popover`, `PopoverTrigger`, `PopoverContent` from `../popover/popover.js`
- **Milestone 2** — `Button` from `../button/button.js`, `Input` from `../input/input.js`

### Shared hooks

- `useControllableState` from `@components/hooks` — accepts `{ prop, defaultProp, onChange }` parameters

### No new npm packages required

All needed packages (`@radix-ui/react-popover`, `class-variance-authority`, `clsx`, `tailwind-merge`) are already installed.

## 3. Implementation Details

### 3.1 `color-picker.types.ts`

**Purpose**: Define the `ColorPickerProps` type.

**Exports**: `ColorPickerProps` (type)

**Interface**:
```typescript
export type ColorPickerProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
};
```

All color values are hex strings including `#` prefix (e.g., `"#ef4444"`). The `placeholder` defaults to `"Pick a color"` at the component level (not in the type).

### 3.2 `color-picker.styles.ts`

**Purpose**: Plain string constants for all Color Picker sub-element styles.

**Exports**: Named string constants.

```typescript
export const colorPickerTriggerStyles = 'w-[200px] justify-start text-left font-normal gap-2';

export const colorPickerPlaceholderStyles = 'text-muted-foreground';

export const colorPickerContentStyles = 'w-[280px] p-3';

export const colorPickerPaletteStyles = 'grid grid-cols-8 gap-1';

export const colorPickerSwatchStyles =
  'h-6 w-6 rounded-md border border-border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

export const colorPickerSwatchActiveStyles =
  'h-6 w-6 rounded-md border-2 border-ring cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

export const colorPickerInputWrapperStyles = 'mt-3 flex items-center gap-2';

export const colorPickerHashStyles = 'text-sm text-muted-foreground';

export const colorPickerHexInputStyles = 'h-8 flex-1 font-mono text-sm uppercase';

export const colorPickerPreviewStyles =
  'h-8 w-8 shrink-0 rounded-md border border-border';

export const colorPickerTriggerSwatchStyles =
  'h-4 w-4 shrink-0 rounded-sm border border-border';
```

### 3.3 `color-picker.tsx`

**Purpose**: The Color Picker component implementation.

**Exports**: `ColorPicker` (function component), re-export of `ColorPickerProps` type.

**Key logic**:

1. **State management**: Uses `useControllableState<string | undefined>` with `{ prop: value, defaultProp: defaultValue, onChange: onValueChange }`. An additional `useState<boolean>(false)` manages the popover open state.

2. **Palette colors**: A module-level constant array `PALETTE_COLORS` containing 22 objects with `{ name: string; hex: string }` for each Tailwind shade-500 color:
   - slate=#64748b, gray=#6b7280, zinc=#71717a, neutral=#737373, stone=#78716c, red=#ef4444, orange=#f97316, amber=#f59e0b, yellow=#eab308, lime=#84cc16, green=#22c55e, emerald=#10b981, teal=#14b8a6, cyan=#06b6d4, sky=#0ea5e9, blue=#3b82f6, indigo=#6366f1, violet=#8b5cf6, purple=#a855f7, fuchsia=#d946ef, pink=#ec4899, rose=#f43f5e

3. **Hex validation**: A helper function `isValidHexChar` using regex `/^[0-9a-fA-F]{0,6}$/` is applied in an `onChange` handler on the hex input. On each keystroke, if the new value (without `#`) matches the regex, the component calls `setColor('#' + newValue)`. If not, the input rejects the character (the handler does not update state).

4. **Trigger**: Renders a `Button` (variant `"outline"`) via `PopoverTrigger asChild`. Shows a small swatch `<span>` with inline `backgroundColor` set to the current color value, plus hex text. When no value is selected, shows `<span className={colorPickerPlaceholderStyles}>{placeholder ?? 'Pick a color'}</span>`.

5. **Popover content**: Contains:
   - A `<div>` grid of 22 `<button>` elements (one per palette color), each with inline `backgroundColor` and an `aria-label` of the color name. Clicking a swatch calls `setColor(hex)`. The currently-selected swatch gets `colorPickerSwatchActiveStyles` instead of `colorPickerSwatchStyles`.
   - A `<div>` row containing: a `<span>#</span>` label, an `<Input>` for hex entry (displays the value without the `#` prefix), and a preview swatch `<span>` with inline `backgroundColor`.

6. **Root element**: The `Button` trigger gets `data-slot="color-picker"`.

7. **Disabled state**: Passed to the trigger `Button` via `disabled` prop, which prevents the popover from opening.

**Component skeleton**:
```typescript
import { useState } from 'react';
import { useControllableState } from '@components/hooks';

import { cn } from '../../lib/utils.js';
import { Button } from '../button/button.js';
import { Input } from '../input/input.js';
import { Popover, PopoverContent, PopoverTrigger } from '../popover/popover.js';
import {
  colorPickerContentStyles,
  colorPickerHashStyles,
  colorPickerHexInputStyles,
  colorPickerInputWrapperStyles,
  colorPickerPaletteStyles,
  colorPickerPlaceholderStyles,
  colorPickerPreviewStyles,
  colorPickerSwatchActiveStyles,
  colorPickerSwatchStyles,
  colorPickerTriggerStyles,
  colorPickerTriggerSwatchStyles,
} from './color-picker.styles.js';
import type { ColorPickerProps } from './color-picker.types.js';

export type { ColorPickerProps } from './color-picker.types.js';

const PALETTE_COLORS = [
  { name: 'slate', hex: '#64748b' },
  { name: 'gray', hex: '#6b7280' },
  // ... all 22 colors
] as const;

const HEX_REGEX = /^[0-9a-fA-F]{0,6}$/;

export function ColorPicker({
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled,
  placeholder,
  className,
  ref,
}: ColorPickerProps): React.JSX.Element {
  const [open, setOpen] = useState(false);

  const [color, setColor] = useControllableState<string | undefined>({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  const hexWithoutHash = color ? color.replace('#', '') : '';

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (HEX_REGEX.test(raw)) {
      setColor(`#${raw}`);
    }
  };

  const handleSwatchClick = (hex: string) => {
    setColor(hex);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          data-slot="color-picker"
          variant="outline"
          className={cn(colorPickerTriggerStyles, className)}
          disabled={disabled}
          ref={ref}
        >
          {color ? (
            <>
              <span
                className={colorPickerTriggerSwatchStyles}
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
              {color}
            </>
          ) : (
            <span className={colorPickerPlaceholderStyles}>
              {placeholder ?? 'Pick a color'}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={colorPickerContentStyles} align="start">
        <div className={colorPickerPaletteStyles}>
          {PALETTE_COLORS.map((swatch) => (
            <button
              key={swatch.name}
              type="button"
              className={
                color === swatch.hex
                  ? colorPickerSwatchActiveStyles
                  : colorPickerSwatchStyles
              }
              style={{ backgroundColor: swatch.hex }}
              aria-label={swatch.name}
              onClick={() => handleSwatchClick(swatch.hex)}
            />
          ))}
        </div>
        <div className={colorPickerInputWrapperStyles}>
          <span className={colorPickerHashStyles}>#</span>
          <Input
            className={colorPickerHexInputStyles}
            value={hexWithoutHash}
            onChange={handleHexChange}
            maxLength={6}
            placeholder="000000"
          />
          <span
            className={colorPickerPreviewStyles}
            style={{ backgroundColor: color ?? 'transparent' }}
            aria-hidden="true"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

### 3.4 `color-picker.test.tsx`

**Purpose**: Comprehensive test suite.

**Test setup**:
- Import `render`, `screen`, `waitFor` from `@testing-library/react`
- Import `userEvent` from `@testing-library/user-event`
- Import `axe` from `vitest-axe`
- Import `describe`, `expect`, `it`, `vi` from `vitest`
- A `beforeAll` block adding `Element.prototype.hasPointerCapture`, `setPointerCapture`, `releasePointerCapture`, `scrollIntoView` polyfills (matching the Combobox test pattern, needed for Radix Popover in jsdom)

**Tests** (see section 5 for full specification).

### 3.5 `color-picker.stories.tsx`

**Purpose**: Storybook stories covering all key states.

**Exports**: `default` (meta), `Default`, `WithDefaultValue`, `Controlled`, `Disabled` stories.

**Structure**:
```typescript
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { ColorPicker } from './color-picker.js';

function ControlledColorPicker(): React.JSX.Element {
  const [value, setValue] = useState<string | undefined>('#3b82f6');
  return <ColorPicker value={value} onValueChange={setValue} />;
}

const meta: Meta<typeof ColorPicker> = {
  title: 'Components/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const Default: Story = {
  args: {},
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: '#ef4444',
  },
};

export const Controlled: Story = {
  render: () => <ControlledColorPicker />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
```

### 3.6 `index.ts` modification

**Purpose**: Add public API exports for Color Picker.

**Change**: Append the following line after the existing Combobox exports (after line 449):

```typescript
export { ColorPicker, type ColorPickerProps } from './components/color-picker/color-picker.js';
```

## 4. API Contracts

### `ColorPicker` component

**Props** (`ColorPickerProps`):

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Controlled hex color value including `#` prefix (e.g., `"#ef4444"`) |
| `defaultValue` | `string` | — | Initial value for uncontrolled mode |
| `onValueChange` | `(value: string) => void` | — | Callback fired when the color changes |
| `disabled` | `boolean` | `false` | Prevents opening the popover |
| `placeholder` | `string` | `"Pick a color"` | Text shown when no color is selected |
| `className` | `string` | — | Additional CSS classes for the trigger button |
| `ref` | `React.Ref<HTMLButtonElement>` | — | Ref forwarded to the trigger button |

**Usage example — uncontrolled**:
```tsx
<ColorPicker defaultValue="#3b82f6" onValueChange={(hex) => console.log(hex)} />
```

**Usage example — controlled**:
```tsx
const [color, setColor] = useState('#ef4444');
<ColorPicker value={color} onValueChange={setColor} />
```

## 5. Test Plan

### Test setup

- `@testing-library/react` for rendering
- `@testing-library/user-event` for interaction simulation
- `vitest-axe` for accessibility assertions
- `beforeAll` block polyfilling `hasPointerCapture`, `setPointerCapture`, `releasePointerCapture`, `scrollIntoView` on `Element.prototype` (required for Radix Popover in jsdom)

### Test specifications

| # | Test Name | Description | Setup | Assertion |
|---|-----------|-------------|-------|-----------|
| 1 | renders without crashing | Smoke render test | `render(<ColorPicker />)` | `screen.getByRole('button')` is in the document |
| 2 | renders default placeholder when no value | Verify placeholder text | `render(<ColorPicker />)` | `screen.getByText('Pick a color')` exists and has class `text-muted-foreground` |
| 3 | opens popover on trigger click | Click trigger opens palette | Click the trigger button | `document.querySelector('[data-slot="popover-content"]')` is in the document |
| 4 | clicking preset swatch sets value | Select from palette | Open popover, click swatch with `aria-label="red"` | Trigger button contains text `#ef4444` |
| 5 | hex input updates value in real time | Type hex value | Open popover, clear hex input, type `ff0000` | Trigger updates; preview swatch has `backgroundColor: #ff0000` |
| 6 | hex input rejects invalid characters | Validation test | Open popover, type `gg` into hex input | Input value remains unchanged (does not contain `g`) |
| 7 | preview swatch reflects current value | Preview updates with color | Render with `defaultValue="#3b82f6"`, open popover | Preview swatch span has `style.backgroundColor` matching `#3b82f6` (or equivalent rgb) |
| 8 | trigger shows selected color swatch and hex text | Trigger display | Render with `defaultValue="#ef4444"` | Trigger contains text `#ef4444` and a child span with `style.backgroundColor` |
| 9 | controlled mode works | External control | Render with `value="#ef4444"` and `onValueChange` spy, click a different swatch | `onValueChange` called with new hex; trigger still shows `#ef4444` (controlled) |
| 10 | uncontrolled mode works | Default value | Render with `defaultValue="#3b82f6"` | Trigger displays `#3b82f6` |
| 11 | disabled state prevents opening | Disabled prop | Render with `disabled`, click trigger | Trigger is disabled; popover does not appear |
| 12 | palette swatches are focusable buttons | Keyboard accessibility | Open popover | All swatches are `<button>` elements (query `button[aria-label]` inside popover content) |
| 13 | has data-slot attribute | Slot identifier | `render(<ColorPicker />)` | `document.querySelector('[data-slot="color-picker"]')` is in the document |
| 14 | has no accessibility violations | axe-core scan | `render(<ColorPicker />)` | `axe(container)` has no violations |

## 6. Implementation Order

1. **`color-picker.types.ts`** — Define `ColorPickerProps` type. No dependencies on other files.

2. **`color-picker.styles.ts`** — Define all style string constants. No dependencies on other files.

3. **`color-picker.tsx`** — Implement the component. Depends on types (step 1), styles (step 2), and existing components (`Button`, `Input`, `Popover`, `useControllableState`).

4. **`color-picker.test.tsx`** — Write the test suite. Depends on the component (step 3).

5. **`color-picker.stories.tsx`** — Write Storybook stories. Depends on the component (step 3).

6. **`packages/ui/src/index.ts`** — Add `ColorPicker` and `ColorPickerProps` exports. Depends on the component (step 3).

## 7. Verification Commands

```bash
# Type check the entire monorepo
pnpm typecheck

# Run all tests (includes color-picker tests and all existing component tests)
pnpm test

# Run only color-picker tests in isolation
pnpm --filter @components/ui test -- --run src/components/color-picker/color-picker.test.tsx

# Lint all files
pnpm lint

# Verify exports are correct (should show ColorPicker in output)
grep -n 'ColorPicker' packages/ui/src/index.ts
```

## 8. Design Deviations

**Deviation 1: Hex input uses native `<Input>` onChange instead of controlled character-by-character filtering**

- **Parent spec requires**: "Validates against `/^[0-9a-fA-F]{0,6}$/` on each keystroke, rejecting invalid characters."
- **Why direct keystroke interception is problematic**: Using `onKeyDown` to prevent keystrokes would conflict with the controlled input pattern and break copy-paste scenarios. It would also require handling meta keys, arrow keys, backspace, etc.
- **Alternative chosen**: The `onChange` handler reads the full input value, tests it against the regex, and only calls `setColor` if the value passes validation. Invalid characters are effectively rejected because state is not updated, and since the `Input` is controlled via its `value` prop, the displayed text reverts to the last valid state. This approach handles paste, keyboard, and programmatic changes uniformly.

**Deviation 2: No CVA usage in styles file**

- **AGENTS.md component pattern suggests**: CVA variant definitions in `.styles.ts` files.
- **Why CVA is unnecessary**: The Color Picker has no visual variants (no `variant` or `size` props). All style constants are static strings. This matches the pattern already established by Date Picker, Time Picker, Combobox, and other composed components in the codebase that use plain string exports when no CVA variants are needed.
- **Alternative chosen**: Plain `export const` string constants, consistent with sibling components.