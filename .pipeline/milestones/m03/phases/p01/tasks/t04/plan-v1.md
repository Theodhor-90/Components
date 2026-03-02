I have enough context from the specs and codebase. Let me now produce the plan.

## 1. Deliverables

| #   | File                                                         | Purpose                                                                                                                           |
| --- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `packages/ui/src/components/accordion/accordion.types.ts`    | TypeScript types for Accordion, AccordionItem, AccordionTrigger, AccordionContent                                                 |
| 2   | `packages/ui/src/components/accordion/accordion.styles.ts`   | Static style strings for `accordionItemStyles`, `accordionTriggerStyles`, `accordionContentStyles`, `accordionContentInnerStyles` |
| 3   | `packages/ui/src/components/accordion/accordion.tsx`         | Accordion implementation: 4 sub-components built on `@radix-ui/react-accordion`                                                   |
| 4   | `packages/ui/src/components/accordion/accordion.test.tsx`    | Vitest + Testing Library + vitest-axe tests                                                                                       |
| 5   | `packages/ui/src/components/accordion/accordion.stories.tsx` | Storybook CSF3 stories with `tags: ['autodocs']`                                                                                  |
| 6   | `packages/ui/src/index.ts`                                   | Add exports for all Accordion sub-components and types                                                                            |

## 2. Dependencies

### Already installed (no action needed)

- `@radix-ui/react-accordion` — `^1.2.12` already in `packages/ui/package.json`
- `tailwindcss-animate` — `^1.0.7` already in `packages/ui/package.json`
- Accordion animation keyframes (`@keyframes accordion-down`, `@keyframes accordion-up`) and their Tailwind mappings (`--animate-accordion-down`, `--animate-accordion-up`) — already present in `packages/ui/styles/globals.css:161-195`
- `class-variance-authority`, `@components/utils` (`cn()`) — already installed

### No new packages to install

All required dependencies were installed in task t01.

## 3. Implementation Details

### 3.1 `accordion.types.ts`

**Purpose**: Define prop types for all four Accordion sub-components.

**Exports** (all as `type`):

- `AccordionProps` — Alias for `React.ComponentProps<typeof AccordionPrimitive.Root>`. This automatically supports both `type="single"` (with optional `collapsible`) and `type="multiple"` modes because Radix's `Root` component uses a discriminated union internally.
- `AccordionItemProps` — `React.ComponentProps<typeof AccordionPrimitive.Item>`
- `AccordionTriggerProps` — `React.ComponentProps<typeof AccordionPrimitive.Trigger>`
- `AccordionContentProps` — `React.ComponentProps<typeof AccordionPrimitive.Content>`

**Pattern**: Follow the exact pattern from `tabs.types.ts` — use `import type * as AccordionPrimitive from '@radix-ui/react-accordion'` and extend the Radix primitive types.

```typescript
import type * as AccordionPrimitive from '@radix-ui/react-accordion';

export type AccordionProps = React.ComponentProps<typeof AccordionPrimitive.Root>;
export type AccordionItemProps = React.ComponentProps<typeof AccordionPrimitive.Item>;
export type AccordionTriggerProps = React.ComponentProps<typeof AccordionPrimitive.Trigger>;
export type AccordionContentProps = React.ComponentProps<typeof AccordionPrimitive.Content>;
```

### 3.2 `accordion.styles.ts`

**Purpose**: Define static Tailwind class strings for each sub-component's styling.

**Exports**:

- `accordionItemStyles` — Bottom border on each item: `'border-b'`
- `accordionTriggerStyles` — Flex layout with justify-between, vertical padding, font weight, underline on hover, chevron rotation transition: `'flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180'`
- `accordionContentStyles` — Overflow hidden with accordion animation for open/close using the keyframes already in globals.css: `'overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'`
- `accordionContentInnerStyles` — Inner padding wrapper: `'pb-4 pt-0'`

No CVA is needed — Accordion has no variants beyond the `type` prop which is handled by Radix itself. All styles are static strings, following the pattern established by Tabs (`tabs.styles.ts`).

```typescript
export const accordionItemStyles = 'border-b';

export const accordionTriggerStyles =
  'flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180';

export const accordionContentStyles =
  'overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down';

export const accordionContentInnerStyles = 'pb-4 pt-0';
```

### 3.3 `accordion.tsx`

**Purpose**: Implement 4 sub-components wrapping `@radix-ui/react-accordion`.

**Imports**:

- `* as AccordionPrimitive from '@radix-ui/react-accordion'`
- `cn` from `../../lib/utils.js`
- All style strings from `./accordion.styles.js`
- All types from `./accordion.types.js`

**Sub-components**:

1. **`Accordion`** — Direct re-export of `AccordionPrimitive.Root` (same pattern as `Tabs = TabsPrimitive.Root`). No wrapping needed because the Root component needs no styling or data-slot.

2. **`AccordionItem`** — Wraps `AccordionPrimitive.Item`. Applies `data-slot="accordion-item"`, merges `accordionItemStyles` with custom className via `cn()`. Destructures `{ className, ref, ...props }`.

3. **`AccordionTrigger`** — Wraps `AccordionPrimitive.Header` + `AccordionPrimitive.Trigger`. The Header wraps the Trigger to provide proper heading semantics. The Trigger itself has `data-slot="accordion-trigger"`, merges `accordionTriggerStyles` with custom className, and includes an inline ChevronDown SVG that rotates 180° when open (via the CSS selector in `accordionTriggerStyles`). Destructures `{ className, children, ref, ...props }`.

   The inline SVG:

   ```jsx
   <svg
     xmlns="http://www.w3.org/2000/svg"
     width="16"
     height="16"
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     strokeWidth="2"
     strokeLinecap="round"
     strokeLinejoin="round"
     className="shrink-0 transition-transform duration-200"
   >
     <path d="m6 9 6 6 6-6" />
   </svg>
   ```

4. **`AccordionContent`** — Wraps `AccordionPrimitive.Content`. Applies `data-slot="accordion-content"`, merges `accordionContentStyles` with custom className. Contains an inner `<div>` with `accordionContentInnerStyles` for padding (the outer div handles the animated height, the inner div handles padding to prevent layout jank during animation). Destructures `{ className, children, ref, ...props }`.

**Complete implementation**:

```typescript
import * as AccordionPrimitive from '@radix-ui/react-accordion';

import { cn } from '../../lib/utils.js';
import {
  accordionContentInnerStyles,
  accordionContentStyles,
  accordionItemStyles,
  accordionTriggerStyles,
} from './accordion.styles.js';
import type {
  AccordionContentProps,
  AccordionItemProps,
  AccordionTriggerProps,
} from './accordion.types.js';

export type {
  AccordionProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from './accordion.types.js';

export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({
  className,
  ref,
  ...props
}: AccordionItemProps): React.JSX.Element {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(accordionItemStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function AccordionTrigger({
  className,
  children,
  ref,
  ...props
}: AccordionTriggerProps): React.JSX.Element {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(accordionTriggerStyles, className)}
        ref={ref}
        {...props}
      >
        {children}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 transition-transform duration-200"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ref,
  ...props
}: AccordionContentProps): React.JSX.Element {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(accordionContentStyles, className)}
      ref={ref}
      {...props}
    >
      <div className={accordionContentInnerStyles}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
```

### 3.4 `accordion.test.tsx`

**Purpose**: Comprehensive tests covering all behaviors.

**Test setup**: Use a `TestAccordion` helper component (following the pattern from `sheet.test.tsx` and `tabs.test.tsx`) that renders a 3-item accordion with configurable props.

```typescript
function TestAccordion({
  type = 'single',
  collapsible,
  defaultValue,
  classNames,
}: {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: string | string[];
  classNames?: {
    item?: string;
    trigger?: string;
    content?: string;
  };
}): React.JSX.Element;
```

The helper renders:

- `<Accordion type={type} collapsible={collapsible} defaultValue={defaultValue}>`
- Three `AccordionItem` with values `"item-1"`, `"item-2"`, `"item-3"`
- Each with `AccordionTrigger` labeled `"Section 1"`, `"Section 2"`, `"Section 3"`
- Each with `AccordionContent` containing `"Content 1"`, `"Content 2"`, `"Content 3"`

**Note on type handling**: Radix's AccordionPrimitive.Root uses a discriminated union for props based on the `type` prop. When `type="single"`, `defaultValue` is a `string`; when `type="multiple"`, `defaultValue` is `string[]`. The `TestAccordion` helper should use conditional rendering or type assertions to handle this. The simplest approach: render two separate `<Accordion>` variants based on the `type` prop to satisfy TypeScript.

**Test cases** (14 tests):

1. **`renders without crashing`** — Smoke test: render with `type="single"` and `collapsible`, verify the triggers are present.
2. **`single mode: opening one item closes others`** — Render with `type="single"`, `collapsible`. Click Section 1 to open, verify Content 1 visible. Click Section 2, verify Content 2 visible and Content 1 hidden.
3. **`multiple mode: multiple items open simultaneously`** — Render with `type="multiple"`. Click Section 1, then click Section 2. Verify both Content 1 and Content 2 are visible.
4. **`collapsible single mode: re-clicking closes the open item`** — Render with `type="single"`, `collapsible`. Click Section 1 to open, click Section 1 again, verify Content 1 is hidden.
5. **`non-collapsible single mode: re-clicking does not close the item`** — Render with `type="single"` (no `collapsible`). Click Section 1 to open, click Section 1 again, verify Content 1 is still visible.
6. **`content has animation classes`** — Render with `type="single"`, `collapsible`, click Section 1 to open. Query the `[data-slot="accordion-content"]` element and verify it contains `animate-accordion-down` in its class list (verifying the open animation class is applied).
7. **`keyboard Enter toggles an item`** — Render with `type="single"`, `collapsible`. Focus Section 1 trigger, press Enter, verify Content 1 visible. Press Enter again, verify Content 1 hidden.
8. **`keyboard Space toggles an item`** — Same as above but with Space key.
9. **`keyboard ArrowDown moves focus to next trigger`** — Focus Section 1, press ArrowDown, verify Section 2 has focus.
10. **`keyboard ArrowUp moves focus to previous trigger`** — Focus Section 2, press ArrowUp, verify Section 1 has focus.
11. **`defaultValue opens item initially`** — Render with `type="single"`, `collapsible`, `defaultValue="item-2"`. Verify Content 2 is visible without clicking.
12. **`data-slot attributes`** — Render with an open item. Verify `[data-slot="accordion-item"]`, `[data-slot="accordion-trigger"]`, and `[data-slot="accordion-content"]` are present.
13. **`merges custom className`** — Render with custom classNames for item, trigger, content. Verify each has the custom class.
14. **`has no accessibility violations`** — Render with `type="single"`, `collapsible`, run `axe()`, assert `toHaveNoViolations()`.

### 3.5 `accordion.stories.tsx`

**Purpose**: Storybook CSF3 stories covering all modes and edge cases.

**Meta**:

```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;
```

**Stories** (5):

1. **`Single`** — 3 accordion items with `type="single"` and `collapsible`. Default value `"item-1"`. Each item has a question as trigger and an answer paragraph as content.

2. **`Multiple`** — 3 accordion items with `type="multiple"` and `defaultValue={["item-1", "item-2"]}`. Shows multiple items open at once.

3. **`Collapsible`** — `type="single"` with `collapsible` prop. No default value. All items start closed. Demonstrates that clicking an open item closes it.

4. **`WithNestedContent`** — Items containing rich content (lists, bold text, links) inside AccordionContent to demonstrate layout flexibility.

5. **`DefaultOpen`** — `type="single"` with `collapsible` and `defaultValue="item-2"`. Shows that the second item opens by default.

### 3.6 `packages/ui/src/index.ts` (modification)

Add the following exports after the existing Tabs exports (line 212):

```typescript
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  type AccordionProps,
  type AccordionItemProps,
  type AccordionTriggerProps,
  type AccordionContentProps,
} from './components/accordion/accordion.js';
```

No CVA variant export is needed since Accordion uses static style strings, not CVA.

## 4. API Contracts

### Accordion (Root)

```tsx
// Single mode (only one item open at a time)
<Accordion type="single" collapsible defaultValue="item-1">
  <AccordionItem value="item-1">
    <AccordionTrigger>Section Title</AccordionTrigger>
    <AccordionContent>Section content</AccordionContent>
  </AccordionItem>
</Accordion>

// Multiple mode (multiple items open simultaneously)
<Accordion type="multiple" defaultValue={["item-1", "item-2"]}>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section Title</AccordionTrigger>
    <AccordionContent>Section content</AccordionContent>
  </AccordionItem>
</Accordion>
```

### Props (inherited from Radix)

| Component          | Key Props                 | Type                                     | Description                                |
| ------------------ | ------------------------- | ---------------------------------------- | ------------------------------------------ |
| `Accordion`        | `type`                    | `"single" \| "multiple"`                 | Selection mode                             |
| `Accordion`        | `collapsible`             | `boolean`                                | Allow closing all items (single mode only) |
| `Accordion`        | `defaultValue`            | `string \| string[]`                     | Initially open item(s)                     |
| `Accordion`        | `value` / `onValueChange` | `string \| string[]` / `(value) => void` | Controlled mode                            |
| `AccordionItem`    | `value`                   | `string`                                 | Unique item identifier (required)          |
| `AccordionItem`    | `disabled`                | `boolean`                                | Disable the item                           |
| `AccordionTrigger` | `className`               | `string`                                 | Custom classes merged via `cn()`           |
| `AccordionContent` | `className`               | `string`                                 | Custom classes merged via `cn()`           |

All sub-components also accept `ref` (React 19 ref-as-prop) and spread remaining HTML props.

## 5. Test Plan

### Test Setup

- Framework: Vitest + `@testing-library/react` + `@testing-library/user-event` + `vitest-axe`
- Import pattern: `import { render, screen } from '@testing-library/react'`
- User events: `const user = userEvent.setup()` before each interaction
- Accessibility: `import { axe } from 'vitest-axe'`

### Test Helper

A `TestAccordion` component that handles the Radix discriminated union type constraint. Since `type="single"` expects `defaultValue: string` and `type="multiple"` expects `defaultValue: string[]`, the helper conditionally renders the appropriate variant:

```typescript
function TestAccordion({
  type = 'single',
  collapsible,
  defaultValue,
  classNames,
}: {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: string | string[];
  classNames?: { item?: string; trigger?: string; content?: string };
}): React.JSX.Element {
  const items = (
    <>
      <AccordionItem value="item-1" className={classNames?.item}>
        <AccordionTrigger className={classNames?.trigger}>Section 1</AccordionTrigger>
        <AccordionContent className={classNames?.content}>Content 1</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Section 2</AccordionTrigger>
        <AccordionContent>Content 2</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Section 3</AccordionTrigger>
        <AccordionContent>Content 3</AccordionContent>
      </AccordionItem>
    </>
  );

  if (type === 'multiple') {
    return (
      <Accordion type="multiple" defaultValue={defaultValue as string[]}>
        {items}
      </Accordion>
    );
  }

  return (
    <Accordion type="single" collapsible={collapsible} defaultValue={defaultValue as string}>
      {items}
    </Accordion>
  );
}
```

### Per-Test Specification

| #   | Test Name                                         | Setup                                                                          | Action                                 | Assertion                                                                                                        |
| --- | ------------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 1   | renders without crashing                          | `render(<TestAccordion collapsible />)`                                        | None                                   | 3 trigger buttons present via `getAllByRole('button')`                                                           |
| 2   | single mode: opening one item closes others       | `render(<TestAccordion collapsible />)`                                        | Click Section 1, then click Section 2  | Content 2 visible, Content 1 not visible                                                                         |
| 3   | multiple mode: multiple items open simultaneously | `render(<TestAccordion type="multiple" />)`                                    | Click Section 1, then click Section 2  | Both Content 1 and Content 2 visible                                                                             |
| 4   | collapsible single: re-click closes item          | `render(<TestAccordion collapsible />)`                                        | Click Section 1, click Section 1 again | Content 1 not visible                                                                                            |
| 5   | non-collapsible single: re-click keeps item open  | `render(<TestAccordion />)`                                                    | Click Section 1, click Section 1 again | Content 1 still visible                                                                                          |
| 6   | content has animation classes                     | `render(<TestAccordion collapsible />)`                                        | Click Section 1 to open                | `[data-slot="accordion-content"]` has class containing `animate-accordion`                                       |
| 7   | keyboard Enter toggles item                       | `render(<TestAccordion collapsible />)`                                        | Tab to Section 1, press Enter          | Content 1 visible; press Enter again → Content 1 hidden                                                          |
| 8   | keyboard Space toggles item                       | `render(<TestAccordion collapsible />)`                                        | Tab to Section 1, press Space          | Content 1 visible                                                                                                |
| 9   | ArrowDown moves focus to next trigger             | `render(<TestAccordion collapsible />)`                                        | Click Section 1, press ArrowDown       | Section 2 trigger has focus                                                                                      |
| 10  | ArrowUp moves focus to previous trigger           | `render(<TestAccordion collapsible />)`                                        | Click Section 2, press ArrowUp         | Section 1 trigger has focus                                                                                      |
| 11  | defaultValue opens item initially                 | `render(<TestAccordion collapsible defaultValue="item-2" />)`                  | None                                   | Content 2 visible without interaction                                                                            |
| 12  | data-slot attributes                              | `render(<TestAccordion collapsible defaultValue="item-1" />)`                  | None                                   | `[data-slot="accordion-item"]`, `[data-slot="accordion-trigger"]`, `[data-slot="accordion-content"]` all present |
| 13  | merges custom className                           | `render(<TestAccordion collapsible defaultValue="item-1" classNames={...} />)` | None                                   | Each element has its custom class                                                                                |
| 14  | has no accessibility violations                   | `render(<TestAccordion collapsible />)`                                        | Run `axe(container)`                   | `toHaveNoViolations()`                                                                                           |

## 6. Implementation Order

1. **`accordion.types.ts`** — Define all type exports first. No dependencies on other files.

2. **`accordion.styles.ts`** — Define all style string exports. No dependencies on other files.

3. **`accordion.tsx`** — Implement all 4 sub-components. Depends on types and styles files.

4. **`accordion.test.tsx`** — Write all 14 tests. Depends on the implementation.

5. **`accordion.stories.tsx`** — Write all 5 stories. Depends on the implementation.

6. **`packages/ui/src/index.ts`** — Add Accordion exports after existing Tabs exports.

## 7. Verification Commands

```bash
# Run Accordion tests only
pnpm --filter @components/ui test -- accordion

# Run full test suite to check for regressions
pnpm test

# Type-check all packages
pnpm typecheck

# Build all packages
pnpm build

# Verify exports are present in index.ts (quick check)
grep -n "Accordion" packages/ui/src/index.ts

# Launch Storybook to visually verify (manual step)
pnpm storybook
```

## 8. Design Deviations

**Deviation 1: No CVA for Accordion styles**

- **Parent spec requires**: The phase spec mentions `accordionTriggerStyles` and `accordionContentStyles` as style strings, but the component AGENTS.md checklist says "CVA variants with defaultVariants" for `.styles.ts` files.
- **Why static strings are correct**: Accordion has no visual variants — there is no `variant` or `size` prop. The only mode variation (`type="single"` vs `type="multiple"`) is handled by Radix internally, not via styling. Using CVA for zero-variant styles adds unnecessary complexity.
- **Alternative chosen**: Export plain string constants (same pattern as `tabs.styles.ts` which uses `tabsListStyles`, `tabsTriggerStyles`, `tabsContentStyles` as static strings without CVA). This is consistent with the established convention for components that have no visual variants.

**Deviation 2: `AccordionPrimitive.Header` wrapper in AccordionTrigger**

- **Parent spec requires**: The task spec says AccordionTrigger wraps `AccordionPrimitive.Trigger` with an embedded SVG.
- **Why a Header wrapper is needed**: Radix Accordion's `Trigger` must be rendered inside an `AccordionPrimitive.Header` component to produce the correct `<h3>` heading semantics in the DOM. Without the Header, the trigger renders without a heading element, which breaks accessibility (screen readers won't recognize accordion sections as headings). The shadcn/ui reference implementation also wraps the Trigger in a Header.
- **Alternative chosen**: Wrap `AccordionPrimitive.Trigger` inside `AccordionPrimitive.Header className="flex"` within the `AccordionTrigger` component. The Header gets `className="flex"` to maintain the flex layout. The `data-slot` goes on the Trigger, not the Header.
