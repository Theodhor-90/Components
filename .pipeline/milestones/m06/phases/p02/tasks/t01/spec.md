# Task 1: Copy to Clipboard

## Objective

Build a custom button component that copies text to the system clipboard and provides transient visual feedback. This is the first task because Code Block (Task 2) composes this component internally.

## Deliverables

5 files in `packages/ui/src/components/copy-to-clipboard/`:

### 1. `copy-to-clipboard.types.ts`
- `CopyToClipboardProps` extending `React.ComponentProps<'button'>` with:
  - Required `text: string` prop (the value to copy)
  - `asChild?: boolean` for polymorphic rendering via Radix Slot

### 2. `copy-to-clipboard.styles.ts`
- `copyToClipboardStyles` — plain string constant (no CVA, single-presentation component)
- Base classes: `inline-flex items-center justify-center gap-2 rounded-md p-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer`

### 3. `copy-to-clipboard.tsx`
- Uses `@radix-ui/react-slot` for `asChild` support
- Root element: `<button>` (or Slot) with `data-slot="copy-to-clipboard"`
- Internal `copied` boolean state
- On click: calls `navigator.clipboard.writeText(text)`, sets `copied = true`, schedules `setTimeout` to reset after 2000ms
- Renders inline SVG copy icon that swaps to checkmark icon when `copied` is true
- `aria-label` changes from "Copy to clipboard" to "Copied" for screen reader feedback
- Cleanup via `useEffect` return clears timeout on unmount
- Uses `cn()` to merge className with base styles

### 4. `copy-to-clipboard.test.tsx`
- Mock `navigator.clipboard.writeText` as `vi.fn().mockResolvedValue(undefined)`
- Tests:
  - Smoke render
  - `data-slot` attribute present
  - Ref forwarding
  - className merging
  - Calls `navigator.clipboard.writeText` with correct text on click
  - Icon swaps to checkmark after click
  - Resets to copy icon after 2000ms (use `vi.useFakeTimers`)
  - `asChild` polymorphic rendering
  - Accessibility (vitest-axe)

### 5. `copy-to-clipboard.stories.tsx`
- CSF3 format with `tags: ['autodocs']`
- Stories: Default, AsChild (rendered as an anchor), WithLongText

## Dependencies
- No prior tasks in this phase
- Requires `@radix-ui/react-slot` (already installed)
- Requires `@components/utils` for `cn()` helper
- Requires `class-variance-authority` (already installed, though not used with CVA here)

## Key Constraints
- No CVA variants — single-presentation button, plain string styles only
- Uses `navigator.clipboard.writeText()` (requires secure context; tests must mock)
- 2-second feedback timeout is hardcoded at 2000ms
- Named exports only, no default exports
- React 19 ref-as-prop, no forwardRef

## Verification Criteria
1. All 5 files exist in `packages/ui/src/components/copy-to-clipboard/`
2. Component renders with `data-slot="copy-to-clipboard"`
3. Clicking the button copies the `text` prop value to clipboard
4. Icon swaps from copy to checkmark on click and resets after 2 seconds
5. `aria-label` toggles between "Copy to clipboard" and "Copied"
6. All tests pass including vitest-axe accessibility assertions
7. Stories render correctly in Storybook with autodocs