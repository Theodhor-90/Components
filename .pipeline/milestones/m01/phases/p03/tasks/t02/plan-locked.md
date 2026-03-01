I have enough context from the existing codebase. Let me now produce the plan.

# Task 2: Visually Hidden — Implementation Plan

## 1. Deliverables

| File                                                                     | Action | Purpose                                                                                         |
| ------------------------------------------------------------------------ | ------ | ----------------------------------------------------------------------------------------------- |
| `packages/ui/src/components/visually-hidden/visually-hidden.types.ts`    | Create | TypeScript props type extending Radix VisuallyHidden Root component props                       |
| `packages/ui/src/components/visually-hidden/visually-hidden.styles.ts`   | Create | Empty const string export (Radix handles styling internally via inline styles)                  |
| `packages/ui/src/components/visually-hidden/visually-hidden.tsx`         | Create | Implementation wrapping `@radix-ui/react-visually-hidden` Root with `data-slot` and ref-as-prop |
| `packages/ui/src/components/visually-hidden/visually-hidden.test.tsx`    | Create | Vitest + Testing Library + vitest-axe tests                                                     |
| `packages/ui/src/components/visually-hidden/visually-hidden.stories.tsx` | Create | Storybook CSF3 stories with autodocs                                                            |
| `packages/ui/src/index.ts`                                               | Modify | Add exports for `VisuallyHidden` and `VisuallyHiddenProps`                                      |

## 2. Dependencies

### Already installed (by Task t00)

- `@radix-ui/react-visually-hidden` — `^1.1.0` in `packages/ui/package.json`

### No new dependencies required

All Radix packages and dev dependencies are already in place from prior tasks.

## 3. Implementation Details

### 3.1 `visually-hidden.types.ts`

**Purpose**: Define the component's props type.

**Exports**: `VisuallyHiddenProps`

**Contract**:

```typescript
import type * as VisuallyHiddenPrimitive from '@radix-ui/react-visually-hidden';

export type VisuallyHiddenProps = React.ComponentProps<typeof VisuallyHiddenPrimitive.Root>;
```

**Notes**:

- Extends `React.ComponentProps<typeof VisuallyHiddenPrimitive.Root>` which includes `ref` (React 19), `children`, `className`, and `asChild`
- No CVA `VariantProps` intersection needed since there are no variants — the component has no visual styling (Radix handles it with inline styles)
- Follows the same pattern as `DialogProps` which is a bare `React.ComponentProps<typeof Primitive.Root>` without CVA intersection

### 3.2 `visually-hidden.styles.ts`

**Purpose**: Satisfy the 5-file pattern contract.

**Exports**: `visuallyHiddenStyles`

**Contract**:

```typescript
export const visuallyHiddenStyles = '';
```

**Notes**:

- The Radix `@radix-ui/react-visually-hidden` primitive applies its own inline styles to position content off-screen for screen readers
- No Tailwind classes are needed
- The empty string const follows the same const-string pattern as Dialog's style exports, just with no content
- This const is NOT exported from `index.ts` — it is an internal implementation detail

### 3.3 `visually-hidden.tsx`

**Purpose**: Minimal wrapper around `@radix-ui/react-visually-hidden` Root.

**Exports**: `VisuallyHidden` (function component), re-export of `VisuallyHiddenProps` type

**Contract**:

```typescript
import * as VisuallyHiddenPrimitive from '@radix-ui/react-visually-hidden';

import type { VisuallyHiddenProps } from './visually-hidden.types.js';

export type { VisuallyHiddenProps } from './visually-hidden.types.js';

export function VisuallyHidden({
  ref,
  ...props
}: VisuallyHiddenProps): React.JSX.Element {
  return (
    <VisuallyHiddenPrimitive.Root
      data-slot="visually-hidden"
      ref={ref}
      {...props}
    />
  );
}
```

**Key logic**:

- Does NOT import `cn()` or `visuallyHiddenStyles` — there is nothing to merge since the Radix primitive handles all positioning via inline styles and no Tailwind classes are applied
- Applies `data-slot="visually-hidden"` on the root element
- Uses React 19 ref-as-prop (destructures `ref` from props, passes to Radix primitive)
- Passes through `asChild` and all other props via `...props` spread (the Radix primitive handles `asChild` natively)
- Named export only, no default export
- Returns `React.JSX.Element` explicitly (following project convention seen in Label, Separator, Dialog sub-components)

### 3.4 `visually-hidden.test.tsx`

**Purpose**: Test suite covering smoke render, DOM presence, screen reader accessibility, `data-slot`, `asChild`, and vitest-axe.

**Imports**: `render`, `screen` from `@testing-library/react`; `axe` from `vitest-axe`; `describe`, `expect`, `it` from `vitest`; `VisuallyHidden` from `./visually-hidden.js`

**Tests** (6 test cases):

1. **`renders with default props`** — Render `<VisuallyHidden>Hidden text</VisuallyHidden>`, assert `screen.getByText('Hidden text')` is in the document. This proves the content is in the DOM.

2. **`content is visually hidden with inline styles`** — Render `<VisuallyHidden>SR only</VisuallyHidden>`, query the element and assert it has the Radix inline styles that make it visually hidden (the element should have specific style properties like `position: absolute`, `width: 1px`, `height: 1px`, `overflow: hidden`, etc., or we can check `data-slot` is present and element exists). Specifically: get the element via `screen.getByText('SR only')`, check that the element's computed style includes clipping/positioning that removes it from visual flow. A pragmatic approach: assert the element has `style` attribute containing position-related values (Radix applies inline styles directly).

3. **`screen reader accessible via text query`** — Render `<VisuallyHidden>Screen reader text</VisuallyHidden>`, assert `screen.getByText('Screen reader text')` succeeds. This proves the content is accessible to assistive technology (Testing Library queries mimic screen reader behavior).

4. **`has data-slot attribute`** — Render `<VisuallyHidden>Slot test</VisuallyHidden>`, assert `screen.getByText('Slot test')` has attribute `data-slot` equal to `"visually-hidden"`.

5. **`renders as child element with asChild`** — Render `<VisuallyHidden asChild><span data-testid="custom">Custom</span></VisuallyHidden>`, assert the `data-testid="custom"` element is in the document, has tag `SPAN`, and has `data-slot="visually-hidden"`.

6. **`has no accessibility violations`** — Render `<button><VisuallyHidden>Click me</VisuallyHidden><svg aria-hidden="true"><circle cx="5" cy="5" r="5" /></svg></button>` (icon-only button pattern with visually hidden label), run `axe(container)`, assert no violations.

### 3.5 `visually-hidden.stories.tsx`

**Purpose**: Storybook CSF3 stories with autodocs demonstrating the component's use cases.

**Meta**:

```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';
import { VisuallyHidden } from './visually-hidden.js';

const meta: Meta<typeof VisuallyHidden> = {
  title: 'Components/VisuallyHidden',
  component: VisuallyHidden,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VisuallyHidden>;
```

**Stories** (3 stories):

1. **`Default`** — Simple usage with explanation text. Renders `<VisuallyHidden>This text is only visible to screen readers</VisuallyHidden>` alongside a visible `<p>` explaining what's happening (so sighted Storybook readers understand the component). Uses a `render` function to show both the component and a visible explanatory paragraph.

2. **`WithIconButton`** — Primary use case: icon-only button with an accessible label. Renders a `<button>` containing an inline SVG icon and `<VisuallyHidden>Delete item</VisuallyHidden>`. Demonstrates how sighted users see only the icon while screen readers announce "Delete item".

3. **`AsChild`** — Demonstrates `asChild` prop. Renders `<VisuallyHidden asChild><span>Merged onto span</span></VisuallyHidden>` alongside a visible explanation paragraph.

### 3.6 `index.ts` modification

**Purpose**: Export `VisuallyHidden` and `VisuallyHiddenProps` from the package public API.

**Addition** (appended after the existing Label exports):

```typescript
export {
  VisuallyHidden,
  type VisuallyHiddenProps,
} from './components/visually-hidden/visually-hidden.js';
```

**NOT exported**: `visuallyHiddenStyles` — it is an internal implementation detail with no consumer value (it's an empty string), consistent with how Dialog's const string styles are not exported from `index.ts`.

## 4. API Contracts

### Component API

```typescript
// Props (from Radix VisuallyHidden.Root)
interface VisuallyHiddenProps {
  children?: React.ReactNode;
  asChild?: boolean; // When true, merges visually-hidden behavior onto child element
  ref?: React.Ref<HTMLElement>;
  className?: string;
  // ...all standard HTML span attributes
}
```

### Usage Examples

```tsx
// Basic: screen-reader-only text
<VisuallyHidden>Accessible label</VisuallyHidden>

// Icon-only button with accessible name
<button>
  <SearchIcon aria-hidden="true" />
  <VisuallyHidden>Search</VisuallyHidden>
</button>

// asChild: merge onto existing element
<VisuallyHidden asChild>
  <label htmlFor="name">Name field</label>
</VisuallyHidden>
```

### Public Exports from `@components/ui`

```typescript
export {
  VisuallyHidden,
  type VisuallyHiddenProps,
} from './components/visually-hidden/visually-hidden.js';
```

## 5. Test Plan

### Test Setup

- Framework: Vitest with jsdom environment
- Libraries: `@testing-library/react` for rendering and queries, `vitest-axe` for accessibility
- No `userEvent` needed — VisuallyHidden has no interactive behavior
- No mock setup required

### Test Specification

| #   | Test Name                                       | Setup                                                                                                                            | Assertion                                                                                                                                   |
| --- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `renders with default props`                    | `render(<VisuallyHidden>Hidden text</VisuallyHidden>)`                                                                           | `screen.getByText('Hidden text')` is in the document                                                                                        |
| 2   | `content is visually hidden with inline styles` | `render(<VisuallyHidden>SR only</VisuallyHidden>)`                                                                               | Element retrieved via `getByText` has inline `style` attribute containing positioning rules (e.g., `position: absolute`) that Radix applies |
| 3   | `screen reader accessible via text query`       | `render(<VisuallyHidden>Screen reader text</VisuallyHidden>)`                                                                    | `screen.getByText('Screen reader text')` succeeds (Testing Library's text query mimics assistive technology access)                         |
| 4   | `has data-slot attribute`                       | `render(<VisuallyHidden>Slot test</VisuallyHidden>)`                                                                             | Element has `data-slot="visually-hidden"`                                                                                                   |
| 5   | `renders as child element with asChild`         | `render(<VisuallyHidden asChild><span data-testid="custom">Custom</span></VisuallyHidden>)`                                      | Element with `data-testid="custom"` has tagName `SPAN` and `data-slot="visually-hidden"`                                                    |
| 6   | `has no accessibility violations`               | `render(<button><VisuallyHidden>Click me</VisuallyHidden><svg aria-hidden="true"><circle cx="5" cy="5" r="5" /></svg></button>)` | `axe(container)` reports no violations                                                                                                      |

## 6. Implementation Order

1. **`visually-hidden.types.ts`** — Create the props type first (no dependencies on other new files)
2. **`visually-hidden.styles.ts`** — Create the empty styles const (no dependencies)
3. **`visually-hidden.tsx`** — Create the component implementation (depends on types file)
4. **`visually-hidden.test.tsx`** — Create tests (depends on component implementation)
5. **`visually-hidden.stories.tsx`** — Create Storybook stories (depends on component implementation)
6. **`index.ts`** — Add exports for `VisuallyHidden` and `VisuallyHiddenProps`
7. **Verify** — Run `pnpm test` and `pnpm typecheck` to confirm everything passes

## 7. Verification Commands

```bash
# Run all visually-hidden tests
pnpm --filter @components/ui test -- --run visually-hidden

# Run full test suite (verify no regressions)
pnpm test

# TypeScript type checking across monorepo
pnpm typecheck

# Verify exports resolve (quick smoke check)
pnpm --filter @components/ui build
```

## 8. Design Deviations

**Deviation 1: No `cn()` import or className merging in the component**

- **Parent spec states**: "Accepts `ref`, `className`, `asChild`, children, and standard HTML props"
- **Why this is adjusted**: The Radix `@radix-ui/react-visually-hidden` primitive applies inline styles to achieve screen-reader-only positioning. There are no Tailwind classes to merge via `cn()`. The `className` prop is still accepted (via `...props` spread) and passed through to the Radix primitive, but there is no `cn()` call because there is no base class string to merge with. This matches the task spec's own note: "Minimal wrapper — the Radix primitive handles all off-screen positioning via inline styles."
- **Alternative chosen**: Spread all props (including `className`) directly to the Radix primitive without `cn()` wrapping. The `className` prop will still work if a consumer passes one — it just won't be merged with any base styles because there are none.

None other.
