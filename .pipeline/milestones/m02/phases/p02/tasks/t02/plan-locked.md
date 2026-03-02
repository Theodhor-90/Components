Now I have everything I need. The feedback has exactly one issue: the ambiguity in Deviation 2 / Section 3.3 about how to render the checkmark vs dash icons. The fix is straightforward — commit to a single approach: destructure `checked` from props, use a ternary inside `CheckboxPrimitive.Indicator` to render dash SVG when `checked === 'indeterminate'`, else render checkmark SVG. For uncontrolled checkboxes (`checked` is undefined), the checkmark is correct since the Indicator only renders when checked.

# Task Plan: Checkbox Component

## 1. Deliverables

| #   | File                                                       | Action | Purpose                                                                           |
| --- | ---------------------------------------------------------- | ------ | --------------------------------------------------------------------------------- |
| 1   | `packages/ui/src/components/checkbox/checkbox.types.ts`    | Create | `CheckboxProps` type extending Radix `CheckboxPrimitive.Root` component props     |
| 2   | `packages/ui/src/components/checkbox/checkbox.styles.ts`   | Create | `checkboxVariants` CVA definition with base classes for the checkbox root         |
| 3   | `packages/ui/src/components/checkbox/checkbox.tsx`         | Create | Checkbox component wrapping `@radix-ui/react-checkbox` with inline SVG indicators |
| 4   | `packages/ui/src/components/checkbox/checkbox.test.tsx`    | Create | Vitest + Testing Library + vitest-axe test suite                                  |
| 5   | `packages/ui/src/components/checkbox/checkbox.stories.tsx` | Create | Storybook CSF3 stories with autodocs                                              |
| 6   | `packages/ui/src/index.ts`                                 | Modify | Add `Checkbox`, `CheckboxProps`, `checkboxVariants` exports                       |

## 2. Dependencies

### Already Installed

- `@radix-ui/react-checkbox@^1.3.2` — already present in `packages/ui/package.json` (installed by sibling task t01)
- `class-variance-authority@^0.7.1` — already present
- `@components/utils` (workspace) — provides `cn()` via `../../lib/utils.js`
- `vitest@^3.2.4`, `@testing-library/react@^16.3.2`, `@testing-library/user-event@^14.6.1`, `vitest-axe@^0.1.0` — all already in devDependencies

### Runtime Prerequisites

- Label component from Milestone 1 — needed for "With Label" story and Label integration test
- Button component — exists as canonical reference

### No New Packages Required

Task t01 has already installed all 6 Radix packages. No additional `pnpm install` is needed.

## 3. Implementation Details

### 3.1 `checkbox.types.ts`

**Purpose**: Define the `CheckboxProps` type for the Checkbox component.

**Exports**:

- `CheckboxProps`

**Interface**:

```typescript
import type { VariantProps } from 'class-variance-authority';
import type * as CheckboxPrimitive from '@radix-ui/react-checkbox';

import type { checkboxVariants } from './checkbox.styles.js';

export type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root> &
  VariantProps<typeof checkboxVariants>;
```

**Key decisions**:

- Extends `React.ComponentProps<typeof CheckboxPrimitive.Root>` — Radix provides `checked`, `defaultChecked`, `onCheckedChange`, `disabled`, `required`, `name`, `value`, `className`, `ref`, and `asChild`.
- Includes `VariantProps<typeof checkboxVariants>` intersection for consistency with the Label pattern, even though there are no configurable variants (CVA has base classes only). When CVA has no variants, `VariantProps` resolves to `{}`, so this has no runtime or type impact — it's purely for pattern uniformity.
- No additional custom props or `asChild` declaration — Radix already includes `asChild` in its base prop types.

### 3.2 `checkbox.styles.ts`

**Purpose**: Define the CVA variant function for the checkbox root element.

**Exports**:

- `checkboxVariants`

**Implementation**:

```typescript
import { cva } from 'class-variance-authority';

export const checkboxVariants = cva(
  'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground',
);
```

**Key decisions**:

- CVA with base classes only, no `variants` config — follows the Input/Textarea/Label pattern for components without configurable visual variants
- `peer` class enables sibling Label to react to checkbox's disabled state via `peer-disabled:` utilities
- `data-[state=checked]` and `data-[state=indeterminate]` selectors target Radix's state data attributes for checked/indeterminate visual styling
- Semantic tokens: `border-primary`, `bg-primary`, `text-primary-foreground`, `ring-ring`, `ring-offset-background`

### 3.3 `checkbox.tsx`

**Purpose**: Main component implementation wrapping Radix Checkbox primitive.

**Exports**:

- `Checkbox` (named function component)
- Re-exports `CheckboxProps` type

**Implementation**:

```typescript
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

import { cn } from '../../lib/utils.js';
import { checkboxVariants } from './checkbox.styles.js';
import type { CheckboxProps } from './checkbox.types.js';

export type { CheckboxProps } from './checkbox.types.js';

export function Checkbox({
  className,
  checked,
  ref,
  ...props
}: CheckboxProps): React.JSX.Element {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(checkboxVariants({ className }))}
      checked={checked}
      ref={ref}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        {checked === 'indeterminate' ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
```

**Icon rendering approach**: The component destructures `checked` from props and uses a ternary inside `CheckboxPrimitive.Indicator` to select the correct icon:

- When `checked === 'indeterminate'`, render a horizontal dash SVG (minus icon)
- Otherwise (including when `checked` is `true`, `false`, or `undefined`), render a checkmark SVG

This works correctly for all cases:

- **Controlled checked** (`checked={true}`): Indicator renders, ternary falls to else branch → checkmark
- **Controlled indeterminate** (`checked="indeterminate"`): Indicator renders, ternary matches → dash
- **Uncontrolled** (`defaultChecked` or no initial state): `checked` prop is `undefined`, ternary falls to else branch → checkmark. This is correct because `CheckboxPrimitive.Indicator` only mounts its children when the checkbox is in a checked or indeterminate state — and for uncontrolled checkboxes, the only active state that shows the Indicator is "checked" (the consumer cannot set `defaultChecked="indeterminate"` since Radix's `defaultChecked` only accepts `boolean`)

**Other key points**:

- SVG icons are inline (no icon library dependency) — consistent with Dialog's close icon pattern
- React 19 `ref` as prop — no `forwardRef`
- No custom `asChild` handling — Radix Root already includes it via the spread `...props`
- `data-slot="checkbox"` on the root element

### 3.4 `checkbox.test.tsx`

**Purpose**: Comprehensive test suite covering all checkbox behaviors.

**Test setup**: Uses `@testing-library/react`, `@testing-library/user-event`, `vitest-axe`, and `vitest`. Test environment is jsdom (configured in `vitest.config.ts`).

**Test specifications**:

| #   | Test Name                                       | What It Verifies                                                          |
| --- | ----------------------------------------------- | ------------------------------------------------------------------------- |
| 1   | renders without crashing                        | Smoke test — checkbox renders a checkbox role element                     |
| 2   | has data-slot attribute                         | Root element has `data-slot="checkbox"`                                   |
| 3   | merges custom className                         | Custom `className` prop is applied alongside CVA classes                  |
| 4   | toggles on click                                | Clicking changes `data-state` from `unchecked` to `checked`               |
| 5   | renders indeterminate state                     | When `checked="indeterminate"`, checkbox has `data-state="indeterminate"` |
| 6   | does not toggle when disabled                   | Disabled checkbox does not respond to click                               |
| 7   | supports controlled usage                       | `checked` + `onCheckedChange` props control state externally              |
| 8   | supports uncontrolled usage                     | `defaultChecked` sets initial state, internal state updates on click      |
| 9   | works with Label                                | Clicking an associated `<Label htmlFor="...">` toggles the checkbox       |
| 10  | forwards ref                                    | `ref` prop receives the underlying DOM element                            |
| 11  | has no accessibility violations (default)       | `axe(container)` passes on unchecked state                                |
| 12  | has no accessibility violations (checked)       | `axe(container)` passes on checked state                                  |
| 13  | has no accessibility violations (indeterminate) | `axe(container)` passes on indeterminate state                            |

**Implementation notes**:

- Query checkbox via `screen.getByRole('checkbox')` — Radix renders the correct ARIA role
- For the Label integration test, render a `<Label htmlFor="test-cb">` with `<Checkbox id="test-cb" />` and verify clicking the label toggles the checkbox
- For controlled test, render with `checked={false}` and `onCheckedChange={vi.fn()}`, click, verify the callback fires with `true`
- For accessibility tests, wrap checkbox in a `<label>` or provide `aria-label` to avoid "form elements must have labels" violations
- Use `createRef` from React for ref forwarding test (consistent with Input test pattern)

### 3.5 `checkbox.stories.tsx`

**Purpose**: Storybook stories for visual documentation and interactive testing.

**Stories**:

| #   | Story Name      | Configuration                                                                |
| --- | --------------- | ---------------------------------------------------------------------------- |
| 1   | Default         | Unchecked, with `aria-label`                                                 |
| 2   | Checked         | `defaultChecked: true`                                                       |
| 3   | Indeterminate   | `checked: 'indeterminate'` (controlled to maintain indeterminate state)      |
| 4   | Disabled        | `disabled: true`                                                             |
| 5   | DisabledChecked | `disabled: true, defaultChecked: true`                                       |
| 6   | WithLabel       | Renders with `<Label>` component, using `htmlFor` linkage                    |
| 7   | Controlled      | Uses `render` function with React `useState` to demonstrate controlled usage |

**Implementation pattern**:

```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from '../label/label.js';
import { Checkbox } from './checkbox.js';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'select',
      options: [true, false, 'indeterminate'],
    },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;
```

- Use `export default meta` for the meta object (consistent with all existing stories)
- WithLabel story uses a `render` function to compose Checkbox + Label in a flex container
- Controlled story uses a `render` function with `useState` hook

### 3.6 `index.ts` Modification

**Current last lines** (lines 107-108):

```typescript
export { Textarea, type TextareaProps } from './components/textarea/textarea.js';
export { textareaVariants } from './components/textarea/textarea.styles.js';
```

**Lines to append**:

```typescript
export { Checkbox, type CheckboxProps } from './components/checkbox/checkbox.js';
export { checkboxVariants } from './components/checkbox/checkbox.styles.js';
```

## 4. API Contracts

### Component Props

**CheckboxProps** (extends `React.ComponentProps<typeof CheckboxPrimitive.Root>` & `VariantProps<typeof checkboxVariants>`):

| Prop              | Type                                            | Default | Description                                     |
| ----------------- | ----------------------------------------------- | ------- | ----------------------------------------------- |
| `checked`         | `boolean \| 'indeterminate'`                    | —       | Controlled checked state                        |
| `defaultChecked`  | `boolean`                                       | —       | Initial checked state (uncontrolled)            |
| `onCheckedChange` | `(checked: boolean \| 'indeterminate') => void` | —       | Callback on state change                        |
| `disabled`        | `boolean`                                       | `false` | Disables interaction                            |
| `required`        | `boolean`                                       | `false` | Makes the checkbox required for form validation |
| `name`            | `string`                                        | —       | Name attribute for form submission              |
| `value`           | `string`                                        | `'on'`  | Value attribute for form submission             |
| `className`       | `string`                                        | —       | Additional CSS classes                          |
| `ref`             | `React.Ref<HTMLButtonElement>`                  | —       | Ref to the underlying button element            |
| `asChild`         | `boolean`                                       | `false` | Render as child element (inherited from Radix)  |

All props are inherited from Radix — no custom additions.

### Usage Examples

**Basic uncontrolled**:

```tsx
<Checkbox id="terms" aria-label="Accept terms" />
```

**With Label**:

```tsx
<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>
```

**Controlled**:

```tsx
const [checked, setChecked] = useState<boolean | 'indeterminate'>(false);
<Checkbox checked={checked} onCheckedChange={setChecked} aria-label="Toggle" />;
```

**Indeterminate**:

```tsx
<Checkbox checked="indeterminate" onCheckedChange={handleChange} aria-label="Select all" />
```

### Exports from `@components/ui`

```typescript
export { Checkbox, type CheckboxProps } from './components/checkbox/checkbox.js';
export { checkboxVariants } from './components/checkbox/checkbox.styles.js';
```

## 5. Test Plan

### Test Setup

- **Framework**: Vitest with jsdom environment (configured in `packages/ui/vitest.config.ts`)
- **Setup file**: `src/test-setup.ts` (loaded automatically)
- **Libraries**: `@testing-library/react`, `@testing-library/user-event`, `vitest-axe`
- **Run command**: `pnpm --filter @components/ui test` or `pnpm test` from `packages/ui/`

### Test Specifications

#### Test 1: Smoke render

```typescript
it('renders without crashing', () => {
  render(<Checkbox aria-label="Test" />);
  expect(screen.getByRole('checkbox')).toBeInTheDocument();
});
```

#### Test 2: data-slot attribute

```typescript
it('has data-slot attribute', () => {
  render(<Checkbox aria-label="Test" />);
  expect(screen.getByRole('checkbox')).toHaveAttribute('data-slot', 'checkbox');
});
```

#### Test 3: Custom className

```typescript
it('merges custom className', () => {
  render(<Checkbox aria-label="Test" className="custom-class" />);
  expect(screen.getByRole('checkbox')).toHaveClass('custom-class');
});
```

#### Test 4: Click toggles state

```typescript
it('toggles checked state on click', async () => {
  const user = userEvent.setup();
  render(<Checkbox aria-label="Test" />);
  const checkbox = screen.getByRole('checkbox');

  expect(checkbox).not.toBeChecked();
  await user.click(checkbox);
  expect(checkbox).toBeChecked();
});
```

#### Test 5: Indeterminate state

```typescript
it('supports indeterminate state', () => {
  render(<Checkbox checked="indeterminate" aria-label="Test" />);
  const checkbox = screen.getByRole('checkbox');
  expect(checkbox).toHaveAttribute('data-state', 'indeterminate');
});
```

#### Test 6: Disabled state

```typescript
it('does not toggle when disabled', async () => {
  const user = userEvent.setup();
  const onCheckedChange = vi.fn();
  render(<Checkbox disabled onCheckedChange={onCheckedChange} aria-label="Test" />);

  await user.click(screen.getByRole('checkbox'));
  expect(onCheckedChange).not.toHaveBeenCalled();
});
```

#### Test 7: Controlled usage

```typescript
it('supports controlled usage', async () => {
  const user = userEvent.setup();
  const onCheckedChange = vi.fn();
  render(<Checkbox checked={false} onCheckedChange={onCheckedChange} aria-label="Test" />);

  await user.click(screen.getByRole('checkbox'));
  expect(onCheckedChange).toHaveBeenCalledWith(true);
});
```

#### Test 8: Uncontrolled usage

```typescript
it('supports uncontrolled usage', async () => {
  const user = userEvent.setup();
  render(<Checkbox defaultChecked aria-label="Test" />);

  const checkbox = screen.getByRole('checkbox');
  expect(checkbox).toBeChecked();

  await user.click(checkbox);
  expect(checkbox).not.toBeChecked();
});
```

#### Test 9: Label integration

```typescript
it('works with Label', async () => {
  const user = userEvent.setup();
  render(
    <div>
      <Checkbox id="test-cb" />
      <Label htmlFor="test-cb">Accept</Label>
    </div>,
  );

  await user.click(screen.getByText('Accept'));
  expect(screen.getByRole('checkbox')).toBeChecked();
});
```

#### Test 10: Ref forwarding

```typescript
it('forwards ref', () => {
  const ref = createRef<HTMLButtonElement>();
  render(<Checkbox ref={ref} aria-label="Test" />);
  expect(ref.current).toBeInstanceOf(HTMLButtonElement);
});
```

#### Test 11–13: Accessibility (3 tests)

```typescript
it('has no accessibility violations (default)', async () => {
  const { container } = render(<Checkbox aria-label="Test checkbox" />);
  expect(await axe(container)).toHaveNoViolations();
});

it('has no accessibility violations (checked)', async () => {
  const { container } = render(<Checkbox defaultChecked aria-label="Test checkbox" />);
  expect(await axe(container)).toHaveNoViolations();
});

it('has no accessibility violations (indeterminate)', async () => {
  const { container } = render(<Checkbox checked="indeterminate" aria-label="Test checkbox" />);
  expect(await axe(container)).toHaveNoViolations();
});
```

## 6. Implementation Order

1. **`checkbox.types.ts`** — Define `CheckboxProps` type. No dependencies on other new files.

2. **`checkbox.styles.ts`** — Define `checkboxVariants` CVA export. No dependencies on other new files.

3. **`checkbox.tsx`** — Implement the component. Depends on `checkbox.types.ts` and `checkbox.styles.ts`. Imports `cn` from `../../lib/utils.js`, `CheckboxPrimitive` from `@radix-ui/react-checkbox`.

4. **`checkbox.test.tsx`** — Write the full test suite. Depends on `checkbox.tsx` being complete. Also imports `Label` from `../label/label.js` for the integration test.

5. **`checkbox.stories.tsx`** — Write all Storybook stories. Depends on `checkbox.tsx`. Also imports `Label` for the "WithLabel" story.

6. **`packages/ui/src/index.ts`** — Append the Checkbox and checkboxVariants exports. Do this last after the component files are created and tests pass.

## 7. Verification Commands

```bash
# Run checkbox tests only
pnpm --filter @components/ui exec vitest run src/components/checkbox/checkbox.test.tsx

# Run all tests to ensure no regressions
pnpm --filter @components/ui test

# Type-check the entire ui package
pnpm --filter @components/ui typecheck

# Verify exports compile correctly (build the package)
pnpm --filter @components/ui build

# Verify the export is accessible (quick import check)
node -e "import('@components/ui').then(m => console.log('Checkbox' in m ? 'OK' : 'MISSING'))"
```

## 8. Design Deviations

### Deviation 1: Types file — `VariantProps` intersection

**Parent spec (phase spec, DD-2)** requires CVA with base classes only for components without configurable variants, and the types file pattern from the AGENTS component guide shows `VariantProps<typeof variants>` intersection.

**Issue**: The Label component (the closest precedent for a Radix-wrapped component with CVA base-classes-only) includes `VariantProps<typeof labelVariants>` in its type definition. However, when CVA has no variants, `VariantProps` resolves to an empty object type `{}`, making the intersection technically unnecessary.

**Decision**: Include the `VariantProps` intersection for consistency with the Label pattern. This adds no runtime cost and keeps the type definition pattern uniform across all components, making it trivial to add variants later without restructuring the type.

### Deviation 2: Indicator icon rendering — ternary on `checked` prop

**Parent spec (task spec)** states: "Renders `CheckboxPrimitive.Indicator` with inline SVG checkmark icon (checked) and dash icon (indeterminate)." The spec does not prescribe the specific rendering mechanism.

**Decision**: Destructure `checked` from props and use a ternary expression inside `CheckboxPrimitive.Indicator` to select the correct icon:

- When `checked === 'indeterminate'` → render the dash (horizontal line) SVG
- Otherwise → render the checkmark SVG

This approach matches shadcn/ui's actual implementation and works correctly for all usage patterns:

- **Controlled checked** (`checked={true}`): `checked !== 'indeterminate'`, so the ternary renders the checkmark. The Indicator is visible because the state is checked.
- **Controlled indeterminate** (`checked="indeterminate"`): ternary matches, renders the dash. The Indicator is visible because the state is indeterminate.
- **Uncontrolled** (`defaultChecked` or no prop): `checked` is `undefined`, which is not `=== 'indeterminate'`, so the ternary renders the checkmark. This is correct because for uncontrolled checkboxes, the only active state that makes the Indicator visible is "checked" — Radix's `defaultChecked` prop only accepts `boolean`, so an uncontrolled checkbox cannot start in the indeterminate state.
