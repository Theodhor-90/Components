I have all the context needed. Now I'll produce the complete implementation plan.

# Task Plan: Tabs Component

## 1. Deliverables

| #   | File                                               | Purpose                                                                             |
| --- | -------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 1   | `packages/ui/src/components/tabs/tabs.types.ts`    | TypeScript types for Tabs, TabsList, TabsTrigger, TabsContent                       |
| 2   | `packages/ui/src/components/tabs/tabs.styles.ts`   | Static style strings for `tabsListStyles`, `tabsTriggerStyles`, `tabsContentStyles` |
| 3   | `packages/ui/src/components/tabs/tabs.tsx`         | Tabs implementation: 4 sub-components built on `@radix-ui/react-tabs`               |
| 4   | `packages/ui/src/components/tabs/tabs.test.tsx`    | Vitest + Testing Library + vitest-axe tests                                         |
| 5   | `packages/ui/src/components/tabs/tabs.stories.tsx` | Storybook CSF3 stories with `tags: ['autodocs']`                                    |
| 6   | `packages/ui/src/index.ts`                         | Add exports for all Tabs sub-components, types                                      |

## 2. Dependencies

**Already installed — no new packages required:**

- `@radix-ui/react-tabs@^1.1.13` — already in `packages/ui/package.json` (installed in task t01)
- `class-variance-authority` — already installed
- `@components/utils` (`cn()`) — already available via `../../lib/utils.js`

**Sibling task prerequisites:**

- Task t01 (completed) — installed `@radix-ui/react-tabs`
- Task t02 (completed) — Sheet component (no dependency, but establishes compound component patterns for this phase)

## 3. Implementation Details

### 3.1 `tabs.types.ts`

**Purpose:** Define TypeScript prop types for all 4 sub-components.

**Exports:**

- `TabsProps` — extends `React.ComponentProps<typeof TabsPrimitive.Root>` (includes `value`, `defaultValue`, `onValueChange`, `dir`, `orientation`, `activationMode`)
- `TabsListProps` — extends `React.ComponentProps<typeof TabsPrimitive.List>`
- `TabsTriggerProps` — extends `React.ComponentProps<typeof TabsPrimitive.Trigger>` (includes `value`, `disabled`)
- `TabsContentProps` — extends `React.ComponentProps<typeof TabsPrimitive.Content>` (includes `value`, `forceMount`)

**Pattern:** Follow `sheet.types.ts` — use `import type * as TabsPrimitive from '@radix-ui/react-tabs'` for the type namespace.

**Implementation:**

```typescript
import type * as TabsPrimitive from '@radix-ui/react-tabs';

export type TabsProps = React.ComponentProps<typeof TabsPrimitive.Root>;
export type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List>;
export type TabsTriggerProps = React.ComponentProps<typeof TabsPrimitive.Trigger>;
export type TabsContentProps = React.ComponentProps<typeof TabsPrimitive.Content>;
```

No CVA `VariantProps` needed — Tabs has no variant/size CVA definitions (unlike Button). All styling uses static style strings.

### 3.2 `tabs.styles.ts`

**Purpose:** Define static Tailwind class strings for TabsList, TabsTrigger, and TabsContent.

**Exports:**

- `tabsListStyles` — string of Tailwind classes for the list container
- `tabsTriggerStyles` — string of Tailwind classes for individual tab triggers
- `tabsContentStyles` — string of Tailwind classes for the content panel

**Implementation:**

```typescript
export const tabsListStyles =
  'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground';

export const tabsTriggerStyles =
  'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow';

export const tabsContentStyles =
  'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
```

**Design tokens used:**

- `bg-muted`, `text-muted-foreground` — muted background for the tab list container
- `bg-background`, `text-foreground` — active tab trigger styling
- `ring-ring`, `ring-offset-background` — focus ring styling
- `rounded-lg`, `rounded-md` — border radius from `--radius` scale

No CVA is needed — Tabs has no variant dimension (no `variant` or `size` prop). This matches the shadcn/ui reference which uses plain class strings.

### 3.3 `tabs.tsx`

**Purpose:** Implement 4 sub-components wrapping `@radix-ui/react-tabs`.

**Exports:**

- `Tabs` — direct re-export of `TabsPrimitive.Root` (no wrapper needed, same as `Sheet = DialogPrimitive.Root`)
- `TabsList` — styled wrapper around `TabsPrimitive.List`
- `TabsTrigger` — styled wrapper around `TabsPrimitive.Trigger`
- `TabsContent` — styled wrapper around `TabsPrimitive.Content`
- Re-exports all types from `tabs.types.ts`

**Key logic per sub-component:**

**`Tabs`:**

```typescript
export const Tabs = TabsPrimitive.Root;
```

Direct assignment, no wrapping — Radix Root provides `value`/`defaultValue`/`onValueChange` for controlled/uncontrolled modes natively. No `data-slot` on Root (same pattern as `Sheet = DialogPrimitive.Root` and `Dialog = DialogPrimitive.Root`).

**`TabsList`:**

```typescript
export function TabsList({ className, ref, ...props }: TabsListProps): React.JSX.Element {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(tabsListStyles, className)}
      ref={ref}
      {...props}
    />
  );
}
```

**`TabsTrigger`:**

```typescript
export function TabsTrigger({ className, ref, ...props }: TabsTriggerProps): React.JSX.Element {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(tabsTriggerStyles, className)}
      ref={ref}
      {...props}
    />
  );
}
```

**`TabsContent`:**

```typescript
export function TabsContent({ className, ref, ...props }: TabsContentProps): React.JSX.Element {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(tabsContentStyles, className)}
      ref={ref}
      {...props}
    />
  );
}
```

**Patterns followed:**

- Import `* as TabsPrimitive from '@radix-ui/react-tabs'`
- Import `cn` from `../../lib/utils.js`
- Import styles from `./tabs.styles.js`
- Import types using `import type` from `./tabs.types.js`
- Re-export types at top (`export type { ... } from './tabs.types.js'`)
- `data-slot` attribute on every rendered sub-component (`tabs-list`, `tabs-trigger`, `tabs-content`)
- No `data-slot` on `Tabs` (Root) — consistent with Dialog/Sheet pattern where Root is a direct re-export
- React 19 ref-as-prop (no forwardRef)
- Named exports only
- Return type annotation `React.JSX.Element`
- Destructure `{ className, ref, ...props }` pattern

### 3.4 `tabs.test.tsx`

**Purpose:** Comprehensive tests for the Tabs component.

**Test setup:** Uses `@testing-library/react`, `@testing-library/user-event`, `vitest-axe`, and `vitest`. Same imports as `sheet.test.tsx`.

**Helper component:**

```typescript
function TestTabs({
  defaultValue,
  value,
  onValueChange,
  classNames,
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  classNames?: {
    list?: string;
    trigger?: string;
    content?: string;
  };
}): React.JSX.Element {
  return (
    <Tabs defaultValue={defaultValue ?? 'tab1'} value={value} onValueChange={onValueChange}>
      <TabsList className={classNames?.list}>
        <TabsTrigger value="tab1" className={classNames?.trigger}>Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3" disabled>Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" className={classNames?.content}>Content 1</TabsContent>
      <TabsContent value="tab2">Content 2</TabsContent>
      <TabsContent value="tab3">Content 3</TabsContent>
    </Tabs>
  );
}
```

**Tests (13 tests):**

1. **`renders with default tab selected`** — Render `<TestTabs />` with `defaultValue="tab1"`. Assert `screen.getByText('Content 1')` is in the document and `screen.getByRole('tab', { name: 'Tab 1' })` has `data-state="active"`.

2. **`switches tabs via click`** — `userEvent.setup()`, click on "Tab 2" trigger. Assert "Content 2" is visible and "Content 1" is not visible.

3. **`keyboard navigation — arrow right moves focus to next trigger`** — Focus on Tab 1 trigger, press `{ArrowRight}`. Assert Tab 2 trigger has focus. Press `{ArrowRight}` again — assert Tab 3 trigger is skipped if disabled or focused depending on Radix behavior (Radix arrow keys do move to disabled tabs but they cannot be activated). Verify the focus moved correctly.

4. **`keyboard navigation — arrow left wraps from first to last`** — Focus Tab 1 trigger, press `{ArrowLeft}`. Assert focus wraps to last non-disabled trigger or last trigger (Radix wraps by default).

5. **`keyboard activation — Space/Enter activates a focused trigger`** — Focus Tab 2 trigger via arrow key, press `{Enter}`. Assert "Content 2" becomes visible.

6. **`controlled mode with value/onValueChange`** — Render with `value="tab1"` and `onValueChange` spy. Click Tab 2. Assert `onValueChange` was called with `"tab2"`. Assert "Content 1" remains visible (controlled — parent didn't update value).

7. **`uncontrolled mode with defaultValue`** — Render with `defaultValue="tab2"`. Assert "Content 2" is visible. Click Tab 1. Assert "Content 1" is now visible.

8. **`only active TabsContent is visible`** — Render with `defaultValue="tab1"`. Assert `screen.getByText('Content 1')` is in the document. Assert `screen.queryByText('Content 2')` is not in the document (Radix unmounts inactive content by default).

9. **`disabled trigger cannot be activated`** — Click on Tab 3 (disabled). Assert "Content 3" is not shown, "Content 1" remains visible.

10. **`data-slot on tabs-list`** — Assert `document.querySelector('[data-slot="tabs-list"]')` is in the document.

11. **`data-slot on tabs-trigger`** — Assert `document.querySelector('[data-slot="tabs-trigger"]')` is in the document.

12. **`data-slot on tabs-content`** — Assert `document.querySelector('[data-slot="tabs-content"]')` is in the document.

13. **`merges custom className`** — Render with custom `classNames`. Assert each element contains its respective custom class.

14. **`has no accessibility violations`** — Render `<TestTabs />`. Run `axe(container)`. Assert `toHaveNoViolations()`.

### 3.5 `tabs.stories.tsx`

**Purpose:** Interactive Storybook documentation with CSF3 format.

**Meta configuration:**

```typescript
const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
};
```

**Stories (5 total):**

1. **`Default`** — 3 tabs ("Account", "Password", "Settings") each with descriptive content. Uses `defaultValue="account"`. Renders `Tabs > TabsList > TabsTrigger × 3` + `TabsContent × 3`.

2. **`Controlled`** — Uses React `useState` to demonstrate controlled `value`/`onValueChange`. Shows current active tab value in a paragraph below the tabs.

3. **`ManyTabs`** — 8 tabs to demonstrate overflow/wrapping behavior. Tab labels: Tab 1 through Tab 8.

4. **`WithDisabledTab`** — 3 tabs where the middle tab has `disabled` prop. Demonstrates that clicking the disabled tab does nothing.

5. **`WithIcons`** — 3 tabs where each trigger contains an inline SVG icon + text label. Uses simple SVG icons (a circle, a square, a triangle) to avoid icon library dependency.

**Pattern followed:** Same as `sheet.stories.tsx` — import from `./tabs.js`, `render` function for complex stories, `Meta` and `StoryObj` types from `@storybook/react-vite`.

### 3.6 `packages/ui/src/index.ts`

**Purpose:** Add public API exports for all Tabs sub-components and their types.

**New lines to append (after the existing Sheet exports):**

```typescript
export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  type TabsProps,
  type TabsListProps,
  type TabsTriggerProps,
  type TabsContentProps,
} from './components/tabs/tabs.js';
```

No CVA variant export needed — Tabs uses static style strings (not CVA functions), and exporting internal style strings is not part of the public API since there's no variant composition use case for consumers.

## 4. API Contracts

### Consumer Usage — Uncontrolled

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@components/ui';

<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account settings here.</TabsContent>
  <TabsContent value="password">Change password here.</TabsContent>
</Tabs>;
```

### Consumer Usage — Controlled

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@components/ui';

const [activeTab, setActiveTab] = useState('account');

<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account settings here.</TabsContent>
  <TabsContent value="password">Change password here.</TabsContent>
</Tabs>;
```

### Props API Surface

| Component     | Key Props                                                                                                                                                                                            | Source                      |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `Tabs`        | `defaultValue?: string`, `value?: string`, `onValueChange?: (value: string) => void`, `orientation?: 'horizontal' \| 'vertical'`, `dir?: 'ltr' \| 'rtl'`, `activationMode?: 'automatic' \| 'manual'` | Radix TabsPrimitive.Root    |
| `TabsList`    | `className?: string`, `ref?: React.Ref<HTMLDivElement>`, `loop?: boolean`                                                                                                                            | Radix TabsPrimitive.List    |
| `TabsTrigger` | `value: string`, `disabled?: boolean`, `className?: string`, `ref?: React.Ref<HTMLButtonElement>`                                                                                                    | Radix TabsPrimitive.Trigger |
| `TabsContent` | `value: string`, `forceMount?: true`, `className?: string`, `ref?: React.Ref<HTMLDivElement>`                                                                                                        | Radix TabsPrimitive.Content |

## 5. Test Plan

### Test Environment

- **Runner:** Vitest with jsdom environment
- **Setup file:** `src/test-setup.ts` (already configured)
- **Libraries:** `@testing-library/react`, `@testing-library/user-event`, `vitest-axe`
- **File:** `packages/ui/src/components/tabs/tabs.test.tsx`

### Test Helper

A `TestTabs` wrapper component rendering 3 tabs (Tab 1, Tab 2, Tab 3 disabled) with corresponding content panels. Accepts optional `defaultValue`, `value`, `onValueChange`, and `classNames` props for test customization.

### Per-Test Specification

| #   | Test Name                         | Setup                                                   | Action                                        | Assertion                                                       |
| --- | --------------------------------- | ------------------------------------------------------- | --------------------------------------------- | --------------------------------------------------------------- |
| 1   | renders with default tab selected | `render(<TestTabs />)`                                  | None                                          | Tab 1 trigger has `data-state="active"`, "Content 1" visible    |
| 2   | switches tabs via click           | `render(<TestTabs />)`, setup userEvent                 | Click "Tab 2"                                 | "Content 2" visible, "Content 1" not in document                |
| 3   | keyboard arrow right moves focus  | `render(<TestTabs />)`                                  | Focus Tab 1, press ArrowRight                 | Tab 2 trigger has focus                                         |
| 4   | keyboard arrow left wraps         | `render(<TestTabs />)`                                  | Focus Tab 1, press ArrowLeft                  | Last trigger has focus (wrap)                                   |
| 5   | Enter activates focused trigger   | `render(<TestTabs />)`                                  | Focus Tab 1, ArrowRight to Tab 2, press Enter | "Content 2" visible                                             |
| 6   | controlled mode                   | `render(<TestTabs value="tab1" onValueChange={spy} />)` | Click Tab 2                                   | `onValueChange` called with `"tab2"`, "Content 1" still visible |
| 7   | uncontrolled mode                 | `render(<TestTabs defaultValue="tab2" />)`              | Click Tab 1                                   | "Content 1" visible                                             |
| 8   | only active content visible       | `render(<TestTabs />)`                                  | None                                          | "Content 1" present, "Content 2" absent                         |
| 9   | disabled trigger                  | `render(<TestTabs />)`                                  | Click Tab 3 (disabled)                        | "Content 3" not visible, Tab 1 still active                     |
| 10  | data-slot tabs-list               | `render(<TestTabs />)`                                  | None                                          | `[data-slot="tabs-list"]` exists                                |
| 11  | data-slot tabs-trigger            | `render(<TestTabs />)`                                  | None                                          | `[data-slot="tabs-trigger"]` exists                             |
| 12  | data-slot tabs-content            | `render(<TestTabs />)`                                  | None                                          | `[data-slot="tabs-content"]` exists                             |
| 13  | merges custom className           | `render(<TestTabs classNames={...} />)`                 | None                                          | Custom classes present on list, trigger, content                |
| 14  | no accessibility violations       | `render(<TestTabs />)`                                  | `axe(container)`                              | `toHaveNoViolations()`                                          |

## 6. Implementation Order

1. **`tabs.types.ts`** — Define all prop types first. No dependencies on other Tabs files.

2. **`tabs.styles.ts`** — Define static style strings. No dependencies on other Tabs files.

3. **`tabs.tsx`** — Implement all 4 sub-components. Depends on types and styles files.

4. **`tabs.test.tsx`** — Write all 14 tests. Depends on the implementation file.

5. **`tabs.stories.tsx`** — Write all 5 stories. Depends on the implementation file.

6. **`packages/ui/src/index.ts`** — Add exports for Tabs. Depends on implementation file existing.

7. **Verification** — Run `pnpm test`, `pnpm typecheck` to confirm correctness.

## 7. Verification Commands

```bash
# Run Tabs tests only
pnpm --filter @components/ui test -- --run src/components/tabs/tabs.test.tsx

# Run full test suite to check for regressions
pnpm test

# TypeScript type checking
pnpm typecheck

# Build to verify ESM output
pnpm build

# Lint check
pnpm lint
```

## 8. Design Deviations

**No CVA variant export for Tabs.**

- **Parent spec states:** "CVA variant functions (e.g., buttonVariants) are also exported so consumers can compose variants" (MASTER_PLAN.md §3.5)
- **Why deviation is appropriate:** Tabs has no variant dimension — there is no `variant` or `size` prop. The styles are static class strings, not CVA functions. The Sheet component (sibling t02) exports `sheetContentVariants` because it has a `side` CVA variant. Tabs styling is fixed, so there is no `tabsVariants` CVA function to export. This matches the shadcn/ui reference implementation where Tabs uses plain class strings.
- **Alternative:** Exporting the raw style strings (`tabsListStyles`, etc.) is not useful to consumers — they would use the components directly, not compose their own wrappers from raw class strings.

No other deviations needed.
