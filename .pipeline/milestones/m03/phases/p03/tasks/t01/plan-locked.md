Good — I can confirm that a decorative Separator (the default) uses `role="none"`. Now I have all the context needed. Let me produce the revised plan.

# Task Plan: Header Component

## 1. Deliverables

| File                                                   | Purpose                                                                                                                                                |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `packages/ui/src/components/header/header.types.ts`    | `HeaderProps` type definition extending `React.ComponentProps<'header'>` with `actions`, `userInfo`, `asChild` props and CVA `VariantProps`            |
| `packages/ui/src/components/header/header.styles.ts`   | CVA `headerVariants` with base flex layout styles; no variant dimensions                                                                               |
| `packages/ui/src/components/header/header.tsx`         | Header component implementation with three-region flexbox layout, conditional Separator, `asChild` support via Radix Slot, `data-slot="header"`        |
| `packages/ui/src/components/header/header.test.tsx`    | Vitest + Testing Library + vitest-axe tests covering smoke render, slot rendering, separator logic, asChild, data-slot, className merge, accessibility |
| `packages/ui/src/components/header/header.stories.tsx` | Storybook CSF3 stories: Default, WithActions, WithUserInfo, FullHeader, AsChild; `tags: ['autodocs']`                                                  |

## 2. Dependencies

**Already installed — no new packages required:**

- `@radix-ui/react-slot` — used for `asChild` support (already a dependency of `@components/ui`)
- `class-variance-authority` — used for `headerVariants` (already installed)
- `@components/utils` — provides `cn()` helper (already a workspace dependency)
- `Separator` component from Milestone 1 — used as the vertical divider between `actions` and `userInfo` slots (already implemented and exported)

## 3. Implementation Details

### 3.1 `header.types.ts`

**Purpose:** Define the `HeaderProps` type.

**Exports:**

- `HeaderProps`

**Interface:**

```typescript
import type { VariantProps } from 'class-variance-authority';
import type { headerVariants } from './header.styles.js';

export type HeaderProps = React.ComponentProps<'header'> &
  VariantProps<typeof headerVariants> & {
    actions?: React.ReactNode;
    userInfo?: React.ReactNode;
    asChild?: boolean;
  };
```

**Key logic:** Extends native `<header>` props (which includes `ref` in React 19). Adds three custom props: `actions` (ReactNode for action buttons in the right region), `userInfo` (ReactNode for avatar/profile display), and `asChild` (boolean for Slot composition). Includes `VariantProps` from CVA even though there are no variant dimensions — this follows the canonical pattern and ensures forward-compatibility.

### 3.2 `header.styles.ts`

**Purpose:** Define CVA base styles for the Header layout.

**Exports:**

- `headerVariants`

**Definition:**

```typescript
import { cva } from 'class-variance-authority';

export const headerVariants = cva(
  'flex items-center h-14 w-full shrink-0 gap-4 border-b border-border bg-background px-4',
);
```

**Key logic:** Base styles only — no variant dimensions. The header has a fixed height of `h-14` (3.5rem), horizontal padding `px-4`, flex layout with vertically centered items, a bottom border using the semantic `border-border` token, and `bg-background` for theme consistency. `shrink-0` prevents the header from collapsing when used in a flex parent layout (App Layout). `gap-4` provides spacing between the left and right regions. `w-full` ensures it spans the container width.

### 3.3 `header.tsx`

**Purpose:** Header component implementation.

**Exports:**

- `Header` (named function component)
- Re-export `HeaderProps` type from `header.types.js`

**Structure:**

```typescript
import { Slot } from '@radix-ui/react-slot';

import { cn } from '../../lib/utils.js';
import { Separator } from '../separator/separator.js';
import { headerVariants } from './header.styles.js';
import type { HeaderProps } from './header.types.js';

export type { HeaderProps } from './header.types.js';

export function Header({
  className,
  actions,
  userInfo,
  asChild = false,
  children,
  ref,
  ...props
}: HeaderProps): React.JSX.Element {
  const Comp = asChild ? Slot : 'header';
  return (
    <Comp
      data-slot="header"
      className={cn(headerVariants({ className }))}
      ref={ref}
      {...props}
    >
      <div className="flex flex-1 items-center">{children}</div>
      {(actions || userInfo) && (
        <div className="flex items-center gap-4">
          {actions}
          {actions && userInfo && (
            <Separator orientation="vertical" className="h-6" />
          )}
          {userInfo}
        </div>
      )}
    </Comp>
  );
}
```

**Key logic:**

1. **Root element:** Uses `Comp` which is either `<header>` or Radix `Slot` (when `asChild` is true). The root always gets `data-slot="header"` and the CVA base styles merged with any user-provided `className` via `cn()`.

2. **Left region:** A `<div>` wrapping `children` with `flex flex-1 items-center` — `flex-1` makes the left region take up all available space, pushing the right region to the far right.

3. **Right region:** Only rendered when `actions` or `userInfo` is provided. A `<div>` with `flex items-center gap-4` containing the `actions` node, an optional `Separator`, and the `userInfo` node.

4. **Separator logic:** The `Separator` component (from Milestone 1) with `orientation="vertical"` is rendered **only** when both `actions` and `userInfo` are present. The `className="h-6"` constrains its height to a visually appropriate size rather than full-height.

5. **Ref handling:** React 19 ref-as-prop — destructured directly from props, no `forwardRef`.

6. **Import note:** `Separator` is imported from the sibling component directory (`../separator/separator.js`), not from `index.ts`, to avoid circular dependency risk and follow the existing internal import pattern.

### 3.4 `header.test.tsx`

**Purpose:** Comprehensive tests for the Header component.

**Test cases (11 tests):**

1. **`renders with default props`** — Render `<Header>Title</Header>`, assert `role="banner"` element exists (native `<header>` has implicit banner role) and contains "Title" text.

2. **`has data-slot attribute`** — Render Header, assert `data-slot="header"` is present on the root element.

3. **`renders children in the left region`** — Render `<Header><span data-testid="title">My App</span></Header>`, assert the title span is in the document.

4. **`renders actions slot`** — Render `<Header actions={<button>Save</button>}>Title</Header>`, assert the Save button is in the document.

5. **`renders userInfo slot`** — Render `<Header userInfo={<span>John</span>}>Title</Header>`, assert "John" text is in the document.

6. **`renders Separator when both actions and userInfo are provided`** — Render with both `actions` and `userInfo` props. Assert a `role="none"` element exists (decorative Separator renders with `role="none"` from Radix).

7. **`does not render Separator when only actions is provided`** — Render with only `actions`. Assert no `role="none"` element exists.

8. **`does not render Separator when only userInfo is provided`** — Render with only `userInfo`. Assert no `role="none"` element exists.

9. **`merges custom className`** — Render with `className="custom-class"`, assert the root element has both `custom-class` and the base CVA class (e.g., `bg-background`).

10. **`renders as child element when asChild is true`** — Render `<Header asChild><div data-testid="custom">Content</div></Header>`. Assert the custom div has `data-slot="header"` and the root is a `<div>`, not a `<header>`.

11. **`has no accessibility violations`** — Render `<Header>App Title</Header>`, run `axe()`, assert no violations.

### 3.5 `header.stories.tsx`

**Purpose:** Storybook documentation with autodocs.

**Meta config:**

```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Header } from './header.js';

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  tags: ['autodocs'],
  argTypes: {
    asChild: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;
```

**Stories:**

1. **`Default`** — Simple header with just a text title as `children`. `args: { children: 'My Application' }`.

2. **`WithActions`** — Header with children and `actions` prop containing two Button components (e.g., "Settings" and "New Item"). Uses a `render` function to compose Button imports.

3. **`WithUserInfo`** — Header with children and `userInfo` prop showing a user name span. Uses a `render` function.

4. **`FullHeader`** — Header with all three slots populated: children (title), actions (buttons), and userInfo (user avatar/name). Demonstrates the vertical Separator appearing between actions and userInfo. Uses a `render` function.

5. **`AsChild`** — Header with `asChild` rendering as a `<div>` instead of `<header>`. `render` function wraps content in `<Header asChild><div>...</div></Header>`.

## 4. API Contracts

### Header Component

**Input (Props):**

```typescript
type HeaderProps = React.ComponentProps<'header'> &
  VariantProps<typeof headerVariants> & {
    actions?: React.ReactNode; // Rendered in the right region (action buttons)
    userInfo?: React.ReactNode; // Rendered after actions with a Separator divider
    asChild?: boolean; // Replace root <header> with child element via Slot
  };
```

**Output (Rendered DOM):**

```html
<!-- Default: <Header actions={<button>Save</button>} userInfo={<span>John</span>}>My App</Header> -->
<header
  data-slot="header"
  class="flex items-center h-14 w-full shrink-0 gap-4 border-b border-border bg-background px-4"
>
  <div class="flex flex-1 items-center">My App</div>
  <div class="flex items-center gap-4">
    <button>Save</button>
    <div data-slot="separator" role="none" class="shrink-0 bg-border h-6 w-px"></div>
    <span>John</span>
  </div>
</header>

<!-- Without userInfo: <Header actions={<button>Save</button>}>My App</Header> -->
<header data-slot="header" class="...">
  <div class="flex flex-1 items-center">My App</div>
  <div class="flex items-center gap-4">
    <button>Save</button>
    <!-- No Separator rendered -->
  </div>
</header>

<!-- Minimal: <Header>My App</Header> -->
<header data-slot="header" class="...">
  <div class="flex flex-1 items-center">My App</div>
  <!-- No right region rendered -->
</header>
```

**Exported symbols from `@components/ui`:**

- `Header` — React component function
- `HeaderProps` — TypeScript type (type-only export)
- `headerVariants` — CVA function for style composition

**Note:** Exports to `packages/ui/src/index.ts` are not part of this task. They will be added in Task 3 (Exports and Integration Verification) as specified in the phase spec.

## 5. Test Plan

### Test Setup

- **Framework:** Vitest + `@testing-library/react` + `@testing-library/user-event` + `vitest-axe`
- **File:** `packages/ui/src/components/header/header.test.tsx`
- **Run command:** `pnpm test` (runs all tests) or `pnpm --filter @components/ui test` (ui package only)
- **Import pattern:** Follow existing test files — import `render`, `screen` from `@testing-library/react`, `axe` from `vitest-axe`, `describe`/`expect`/`it` from `vitest`

### Per-Test Specification

| #   | Test Name                                                       | Setup                                                                                    | Assertion                                                                 |
| --- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 1   | `renders with default props`                                    | `render(<Header>Title</Header>)`                                                         | `screen.getByRole('banner')` is in the document and contains "Title"      |
| 2   | `has data-slot attribute`                                       | `render(<Header>Title</Header>)`                                                         | `screen.getByRole('banner')` has attribute `data-slot="header"`           |
| 3   | `renders children in the left region`                           | `render(<Header><span data-testid="title">My App</span></Header>)`                       | `screen.getByTestId('title')` is in the document                          |
| 4   | `renders actions slot`                                          | `render(<Header actions={<button>Save</button>}>Title</Header>)`                         | `screen.getByRole('button', { name: 'Save' })` is in the document         |
| 5   | `renders userInfo slot`                                         | `render(<Header userInfo={<span>John</span>}>Title</Header>)`                            | `screen.getByText('John')` is in the document                             |
| 6   | `renders Separator when both actions and userInfo are provided` | `render(<Header actions={<button>Act</button>} userInfo={<span>User</span>}>T</Header>)` | `screen.getByRole('none')` exists (Radix decorative separator role)       |
| 7   | `does not render Separator when only actions is provided`       | `render(<Header actions={<button>Act</button>}>T</Header>)`                              | `screen.queryByRole('none')` is `null`                                    |
| 8   | `does not render Separator when only userInfo is provided`      | `render(<Header userInfo={<span>User</span>}>T</Header>)`                                | `screen.queryByRole('none')` is `null`                                    |
| 9   | `merges custom className`                                       | `render(<Header className="custom-class">T</Header>)`                                    | `screen.getByRole('banner')` has class `custom-class` and `bg-background` |
| 10  | `renders as child element when asChild is true`                 | `render(<Header asChild><div data-testid="custom">Content</div></Header>)`               | `screen.getByTestId('custom')` has `data-slot="header"` and tag is `DIV`  |
| 11  | `has no accessibility violations`                               | `const { container } = render(<Header>App Title</Header>)`                               | `expect(await axe(container)).toHaveNoViolations()`                       |

## 6. Implementation Order

1. **`header.styles.ts`** — Create CVA base styles first since types and implementation depend on it. No dependencies on other new files.

2. **`header.types.ts`** — Define `HeaderProps` type, importing `VariantProps` from CVA and `headerVariants` from the styles file. Must be created after styles since it references `typeof headerVariants`.

3. **`header.tsx`** — Implement the Header component, importing from styles, types, `cn()`, `Separator`, and `Slot`. This is the core implementation that wires together the three-region layout and conditional Separator logic.

4. **`header.test.tsx`** — Write all tests. Run to validate the implementation. Tests can only be written after the component exists.

5. **`header.stories.tsx`** — Write Storybook stories. These depend on the component being implemented and working correctly.

## 7. Verification Commands

```bash
# 1. Type check — ensure no type errors across the entire monorepo
pnpm typecheck

# 2. Run all tests — ensures Header tests pass along with existing tests
pnpm test

# 3. Run only the Header test file for faster iteration during development
pnpm --filter @components/ui exec vitest run src/components/header/header.test.tsx

# 4. Build the UI package — verify clean build output
pnpm build

# 5. Verify exports are correctly set up (quick TypeScript compilation check)
pnpm --filter @components/ui exec tsc --noEmit
```

## 8. Design Deviations

### Deviation 1: Internal import for Separator instead of self-referencing package import

**What the phase spec implies:** The Separator is listed as a dependency from Milestone 1, suggesting it would be imported from the public API.

**Why that approach is problematic:** Importing `Separator` from `../../index.ts` (or `@components/ui`) within the same package would create a circular dependency, since `index.ts` re-exports everything including Header itself. The existing codebase pattern for internal component composition (e.g., Sheet imports from Radix directly, not via index) uses relative imports between component directories.

**Alternative chosen:** Import `Separator` directly from its source file: `import { Separator } from '../separator/separator.js'`. This follows the established pattern for intra-package imports and avoids circular dependencies.

### Deviation 2: Separator height constrained to `h-6` instead of `h-full`

**What the phase spec states:** "a `Separator` component with `orientation="vertical"` is rendered between them" — no specific height mentioned.

**Why using default `h-full` is problematic:** The Separator's default vertical style is `h-full w-px`. In a flex container with `items-center`, `h-full` computes to 0 height (since the parent's height is determined by content, not explicit sizing). Even when it does render, `h-full` would stretch the full 3.5rem header height, which looks visually heavy.

**Alternative chosen:** Apply `className="h-6"` to the Separator to give it a fixed 1.5rem height, which visually centers within the `h-14` header and matches common header divider patterns. This is a styling override, not a behavioral change — the Separator component's `cn()` merging handles this correctly via tailwind-merge.

### Deviation 3: No index.ts exports in this task

**What the phase spec assigns:** The phase spec's Task 1 deliverables list the 5 component files only. Export additions to `packages/ui/src/index.ts` are explicitly assigned to Task 3 ("Exports and Integration Verification").

**What this plan does:** This plan does not modify `index.ts`. The `Header`, `type HeaderProps`, and `headerVariants` exports will be added in Task 3 as specified by the phase spec.
