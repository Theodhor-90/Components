# Task 2: Code Block

## Objective

Build a custom component that renders code in a `<pre>` + `<code>` wrapper with monospace font, theme-aware background, optional line numbers, optional language label, and an integrated copy-to-clipboard button.

## Deliverables

5 files in `packages/ui/src/components/code-block/`:

### 1. `code-block.types.ts`
- `CodeBlockProps` extending `React.ComponentProps<'div'>` with:
  - `children: string` (the code content)
  - Optional `showLineNumbers?: boolean` (default `false`)
  - Optional `language?: string` (display label only, no syntax highlighting)
- No CVA variant props — single visual treatment

### 2. `code-block.styles.ts`
- Plain string constant exports (no CVA):
  - `codeBlockStyles` — outer container: `relative rounded-lg bg-muted border border-border`
  - `codeBlockPreStyles` — `<pre>` element: `overflow-x-auto p-4 text-sm font-mono text-foreground`
  - `codeBlockHeaderStyles` — optional language label bar: `flex items-center justify-between px-4 py-2 border-b border-border text-xs text-muted-foreground`
  - `codeBlockLineNumberStyles` — line number gutter: `select-none pr-4 text-right text-muted-foreground/50`

### 3. `code-block.tsx`
- Root element: `<div data-slot="code-block">` wrapper
- If `language` is provided: renders a header bar with language label on left and Copy to Clipboard button on right
- If no `language`: Copy to Clipboard button positioned absolutely in top-right corner
- `<pre>` + `<code>` block renders the `children` string
- When `showLineNumbers` is `true`: splits `children` by newline, renders each line in a flex row with a line-number `<span>` and a code content `<span>`
- Copy to Clipboard component receives `children` (raw code string) as its `text` prop
- Uses `cn()` to merge className with base styles

### 4. `code-block.test.tsx`
- Mock `navigator.clipboard.writeText` as `vi.fn().mockResolvedValue(undefined)`
- Tests:
  - Smoke render with code string
  - `data-slot` attribute present
  - Ref forwarding
  - className merging
  - Renders `<pre>` and `<code>` elements
  - Displays language label when `language` prop is set
  - Renders line numbers when `showLineNumbers` is `true`
  - Does not render line numbers by default
  - Copy button copies the code content
  - Accessibility (vitest-axe)

### 5. `code-block.stories.tsx`
- CSF3 format with `tags: ['autodocs']`
- Stories: Default (short snippet), WithLanguageLabel (`language="typescript"`), WithLineNumbers, WithLineNumbersAndLanguage, LongContent (horizontal scrolling), EmptyContent

## Dependencies
- **Task 1 (Copy to Clipboard)** must be completed — Code Block composes it internally for the copy button
- Requires `@components/utils` for `cn()` helper

## Key Constraints
- No syntax highlighting — monospace `<pre>` + `<code>` only (DD-2)
- Uses Copy to Clipboard component internally, does not duplicate clipboard logic (DD-1)
- Line numbers implemented via splitting `children` string by newline and rendering explicit `<span>` elements per line (DD-7)
- Named exports only, no default exports
- React 19 ref-as-prop, no forwardRef

## Verification Criteria
1. All 5 files exist in `packages/ui/src/components/code-block/`
2. Component renders `<pre>` and `<code>` with `data-slot="code-block"`
3. Theme-aware background using `bg-muted` semantic token
4. Language label displays when `language` prop is provided
5. Line numbers render when `showLineNumbers={true}` and are hidden by default
6. Copy button copies the full code content to clipboard
7. Long content scrolls horizontally without breaking layout
8. All tests pass including vitest-axe accessibility assertions
9. Stories render correctly in Storybook with autodocs