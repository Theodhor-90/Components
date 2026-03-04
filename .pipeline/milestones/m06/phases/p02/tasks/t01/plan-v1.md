Now I have all the context needed. Let me produce the implementation plan.

# Task 1: Copy to Clipboard — Implementation Plan

## 1. Deliverables

| # | File | Purpose |
|---|------|---------|
| 1 | `packages/ui/src/components/copy-to-clipboard/copy-to-clipboard.types.ts` | Props type definition extending `React.ComponentProps<'button'>` with `text` and `asChild` |
| 2 | `packages/ui/src/components/copy-to-clipboard/copy-to-clipboard.styles.ts` | Plain string constant for base button classes (no CVA — single-presentation component) |
| 3 | `packages/ui/src/components/copy-to-clipboard/copy-to-clipboard.tsx` | Component implementation with clipboard API, icon swap, and 2-second feedback |
| 4 | `packages/ui/src/components/copy-to-clipboard/copy-to-clipboard.test.tsx` | Vitest + Testing Library + vitest-axe test suite |
| 5 | `packages/ui/src/components/copy-to-clipboard/copy-to-clipboard.stories.tsx` | Storybook CSF3 stories with autodocs |
| 6 | `packages/ui/src/index.ts` | Add `CopyToClipboard` and `type CopyToClipboardProps` exports |

## 2. Dependencies

### Already Installed (no new packages required)

- `@radix-ui/react-slot` — `asChild` polymorphic rendering
- `@components/utils` — `cn()` helper (clsx + tailwind-merge)
- `vitest`, `@testing-library/react`, `@testing-library/user-event`, `vitest-axe` — test infrastructure

### Browser APIs

- `navigator.clipboard.writeText()` — must be mocked in tests as JSDOM does not implement it

## 3. Implementation Details

### 3.1 `copy-to-clipboard.types.ts`

**Purpose**: Define the public props interface.

**Exports**:
- `CopyToClipboardProps`

**Type definition**:
```typescript
export type CopyToClipboardProps = React.ComponentProps<'button'> & {
  /** The text value to copy to the system clipboard. */
  text: string;
  /** Render as the child element instead of a <button>, merging props and behavior. */
  asChild?: boolean;
};
```

No CVA `VariantProps` needed — this is a single-presentation component (follows Skeleton pattern, not Button pattern).

### 3.2 `copy-to-clipboard.styles.ts`

**Purpose**: Export a plain string constant with base Tailwind classes.

**Exports**:
- `copyToClipboardStyles` — plain string constant

**Value**:
```typescript
export const copyToClipboardStyles =
  'inline-flex items-center justify-center gap-2 rounded-md p-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer';
```

This follows the plain string pattern used by `skeletonStyles`, `stepperItemTitleStyles`, etc. — not CVA since there are no variants.

### 3.3 `copy-to-clipboard.tsx`

**Purpose**: Implement the Copy to Clipboard component with clipboard interaction and transient feedback.

**Exports**:
- `CopyToClipboard` (named function export)
- `type CopyToClipboardProps` (re-export from types file)

**Key logic**:
1. `copied` state (boolean, initially `false`) tracks feedback display
2. `timeoutRef` using `useRef<ReturnType<typeof setTimeout> | null>(null)` to track the active timeout
3. `handleClick` function:
   - Calls `navigator.clipboard.writeText(text)`
   - Sets `copied = true`
   - Clears any existing timeout (prevents stacking)
   - Schedules `setTimeout(() => setCopied(false), 2000)`
   - Stores the timeout ID in `timeoutRef`
   - Calls the user-provided `onClick` handler if present
4. `useEffect` cleanup on unmount: clears `timeoutRef.current` if set
5. Renders `<button>` (or `Slot` when `asChild`) with:
   - `data-slot="copy-to-clipboard"`
   - `aria-label={copied ? 'Copied' : 'Copy to clipboard'}`
   - `className={cn(copyToClipboardStyles, className)}`
   - Copy icon SVG when `!copied`, checkmark icon SVG when `copied`
6. Inline SVG icons (no external icon library dependency):
   - **Copy icon**: Two overlapping rectangles (clipboard/document icon), `aria-hidden="true"`
   - **Checkmark icon**: Simple polyline check, `aria-hidden="true"`

**Component signature** (React 19 ref-as-prop pattern):
```typescript
export function CopyToClipboard({
  className,
  text,
  asChild = false,
  onClick,
  ref,
  ...props
}: CopyToClipboardProps): React.JSX.Element
```

### 3.4 `copy-to-clipboard.test.tsx`

**Purpose**: Comprehensive test suite covering smoke, behavior, a11y.

**Test setup**:
- Mock `navigator.clipboard.writeText` as `vi.fn().mockResolvedValue(undefined)` in `beforeEach`
- Use `vi.useFakeTimers()` for timeout-related tests, `vi.useRealTimers()` in cleanup

**Tests**:

| Test | Description |
|------|-------------|
| smoke render | Renders a button element without crashing |
| `data-slot` attribute | Root element has `data-slot="copy-to-clipboard"` |
| ref forwarding | `createRef<HTMLButtonElement>()` is populated with the DOM element |
| className merging | Custom `className` is merged with base styles via `cn()` |
| clipboard write | Clicking calls `navigator.clipboard.writeText(text)` with the correct text value |
| icon swap after click | After click, the checkmark SVG is rendered (query by SVG content change) |
| reset after 2000ms | After advancing timers by 2000ms, the copy icon is restored |
| aria-label toggle | `aria-label` is `"Copy to clipboard"` initially, `"Copied"` after click, back after 2000ms |
| `asChild` rendering | With `asChild` and a child `<a>`, renders an anchor instead of a button |
| custom onClick | User-provided `onClick` handler is also called on click |
| accessibility | `axe(container)` has no violations |

### 3.5 `copy-to-clipboard.stories.tsx`

**Purpose**: Storybook CSF3 stories for visual documentation.

**Meta config**:
- `title: 'Components/CopyToClipboard'`
- `component: CopyToClipboard`
- `tags: ['autodocs']`
- `argTypes`: `text` as text control

**Stories**:

| Story | Args/Render |
|-------|-------------|
| `Default` | `text: "Hello, World!"` |
| `AsChild` | `asChild: true`, render with child `<a href="#">Copy link</a>` |
| `WithLongText` | `text` set to a multi-line code snippet string |

## 4. API Contracts

### CopyToClipboardProps

```typescript
type CopyToClipboardProps = React.ComponentProps<'button'> & {
  text: string;       // Required — the string to write to clipboard
  asChild?: boolean;  // Optional — render as child element via Radix Slot
};
```

### Component Usage

```tsx
// Basic usage
<CopyToClipboard text="npm install @components/ui" />

// With custom className
<CopyToClipboard text="some text" className="absolute top-2 right-2" />

// Polymorphic with asChild
<CopyToClipboard text="some text" asChild>
  <a href="#">Copy link</a>
</CopyToClipboard>
```

### Rendered Output (default state)

```html
<button
  data-slot="copy-to-clipboard"
  aria-label="Copy to clipboard"
  class="inline-flex items-center justify-center gap-2 rounded-md p-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
>
  <svg aria-hidden="true"><!-- copy icon --></svg>
</button>
```

### Rendered Output (copied state)

```html
<button
  data-slot="copy-to-clipboard"
  aria-label="Copied"
  class="..."
>
  <svg aria-hidden="true"><!-- checkmark icon --></svg>
</button>
```

## 5. Test Plan

### Test Setup

- **Framework**: Vitest + @testing-library/react + @testing-library/user-event + vitest-axe
- **Mocking**: `navigator.clipboard.writeText` mocked as `vi.fn().mockResolvedValue(undefined)` in `beforeEach`
- **Timers**: `vi.useFakeTimers()` for tests verifying the 2-second reset; `vi.useRealTimers()` in `afterEach`
- **Import style**: `import { createRef } from 'react'` for ref tests, following Skeleton test pattern

### Per-Test Specifications

1. **Smoke render**: `render(<CopyToClipboard text="test" />)` → assert `screen.getByRole('button')` is in the document

2. **`data-slot` attribute**: Assert `screen.getByRole('button')` has `getAttribute('data-slot') === 'copy-to-clipboard'`

3. **Ref forwarding**: Create `createRef<HTMLButtonElement>()`, pass to component, assert `ref.current` is `instanceof HTMLButtonElement`

4. **className merging**: Pass `className="custom-class"` → assert button has both `custom-class` and a base class like `inline-flex`

5. **Clipboard write on click**: `await user.click(button)` → assert `navigator.clipboard.writeText` called with `"test"`

6. **Icon swaps to checkmark after click**: After click, query for the checkmark SVG (polyline element) inside the button

7. **Resets after 2000ms**: After click, `vi.advanceTimersByTime(2000)` → assert copy icon is back (no polyline, has rect or path for copy icon)

8. **aria-label toggle**: Assert `aria-label="Copy to clipboard"` initially → click → assert `aria-label="Copied"` → advance 2000ms → assert `aria-label="Copy to clipboard"`

9. **asChild polymorphic rendering**: Render with `asChild` wrapping `<a href="/test">Copy</a>` → assert `screen.getByRole('link')` exists

10. **Custom onClick handler**: Pass `onClick={vi.fn()}` → click → assert both `onClick` and `navigator.clipboard.writeText` were called

11. **Accessibility**: `const results = await axe(container)` → `expect(results).toHaveNoViolations()`

## 6. Implementation Order

1. **`copy-to-clipboard.types.ts`** — Define `CopyToClipboardProps` type. No dependencies.

2. **`copy-to-clipboard.styles.ts`** — Define `copyToClipboardStyles` string constant. No dependencies.

3. **`copy-to-clipboard.tsx`** — Implement the component. Depends on types and styles files.

4. **`copy-to-clipboard.test.tsx`** — Write tests. Depends on the component implementation.

5. **`copy-to-clipboard.stories.tsx`** — Write Storybook stories. Depends on the component implementation.

6. **`packages/ui/src/index.ts`** — Add export lines for `CopyToClipboard`, `type CopyToClipboardProps`, and `copyToClipboardStyles`.

## 7. Verification Commands

```bash
# Run only Copy to Clipboard tests
pnpm --filter @components/ui test -- --run src/components/copy-to-clipboard/copy-to-clipboard.test.tsx

# Run full test suite
pnpm test

# TypeScript type check across the monorepo
pnpm typecheck

# Lint the ui package
pnpm --filter @components/ui lint
```

## 8. Design Deviations

**Deviation 1: `copyToClipboardStyles` export from styles file**

- **Parent spec says**: styles file exports `copyToClipboardStyles` plain string constant
- **Issue**: The phase spec mentions `class-variance-authority` as a dependency for Copy to Clipboard but DD-9 explicitly states "not CVA". However, the `index.ts` export pattern in the codebase exports variant functions from `.styles.js` files (e.g., `buttonVariants`, `spinnerVariants`). For non-CVA components like Skeleton, the styles file exports a plain string and the string is **not** re-exported from `index.ts`. For Copy to Clipboard, we follow the Skeleton precedent: export `copyToClipboardStyles` from the styles file but also add it to `index.ts` for consistency with the phase spec's artifacts table which lists it as a deliverable.
- **Resolution**: Export `copyToClipboardStyles` from `index.ts` to match phase spec expectations, following the pattern established by `emptyStateStyles`, `progressStyles`, etc. which are non-CVA plain strings exported from `index.ts`.

None other.