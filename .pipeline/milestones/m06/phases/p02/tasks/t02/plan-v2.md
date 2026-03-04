Now I have all the context. Let me produce the revised plan.

# Task 2: Code Block — Implementation Plan

## 1. Deliverables

| # | File | Type | Purpose |
|---|------|------|---------|
| 1 | `packages/ui/src/components/code-block/code-block.types.ts` | New | `CodeBlockProps` type definition extending `React.ComponentProps<'div'>` with `children: string`, `showLineNumbers?: boolean`, `language?: string` |
| 2 | `packages/ui/src/components/code-block/code-block.styles.ts` | New | Plain string constant exports for container, pre, header, and line number styles |
| 3 | `packages/ui/src/components/code-block/code-block.tsx` | New | Component implementation composing `<pre>` + `<code>` with optional header, line numbers, and integrated CopyToClipboard button |
| 4 | `packages/ui/src/components/code-block/code-block.test.tsx` | New | Vitest + Testing Library + vitest-axe test suite |
| 5 | `packages/ui/src/components/code-block/code-block.stories.tsx` | New | Storybook CSF3 stories with autodocs |
| 6 | `packages/ui/src/index.ts` | Modified | Add `CodeBlock` and `type CodeBlockProps` exports |

## 2. Dependencies

### Internal (already available)
- `@components/utils` via `../../lib/utils.js` — `cn()` helper
- `CopyToClipboard` component from `../copy-to-clipboard/copy-to-clipboard.js` — completed in Task t01, used internally for the copy button

### External (already installed)
- No new packages required. The component is built entirely from native HTML elements (`<div>`, `<pre>`, `<code>`, `<span>`) and the existing CopyToClipboard component.

### Browser APIs
- `navigator.clipboard.writeText()` — used indirectly via CopyToClipboard. Tests mock this API since JSDOM does not implement it.

## 3. Implementation Details

### 3.1 `code-block.types.ts`

**Purpose**: Define the props interface for the CodeBlock component.

**Exports**:
- `CodeBlockProps` — type alias

**Interface**:
```typescript
export type CodeBlockProps = React.ComponentProps<'div'> & {
  /** The code content to display. */
  children: string;
  /** Show line numbers in the gutter. Defaults to false. */
  showLineNumbers?: boolean;
  /** Language label displayed in the header bar. Display only, no syntax highlighting. */
  language?: string;
};
```

No CVA `VariantProps` — Code Block has a single visual treatment.

### 3.2 `code-block.styles.ts`

**Purpose**: Export plain string constants for each visual sub-section of the component.

**Exports**:
- `codeBlockStyles` — outer `<div>` container: `'relative rounded-lg bg-muted border border-border'`
- `codeBlockPreStyles` — `<pre>` element: `'overflow-x-auto p-4 text-sm font-mono text-foreground'`
- `codeBlockHeaderStyles` — language label bar (rendered only when `language` is provided): `'flex items-center justify-between px-4 py-2 border-b border-border text-xs text-muted-foreground'`
- `codeBlockLineNumberStyles` — line number gutter per line: `'select-none pr-4 text-right text-muted-foreground/50'`

All are plain string constants (no CVA) following the same pattern as `skeleton.styles.ts` and `copy-to-clipboard.styles.ts`.

### 3.3 `code-block.tsx`

**Purpose**: Main component implementation.

**Exports**:
- `CodeBlock` — named function component
- `type CodeBlockProps` — re-exported from types file

**Key logic**:

1. Destructure props: `{ className, children, showLineNumbers = false, language, ref, ...props }`
2. Root element: `<div data-slot="code-block" className={cn(codeBlockStyles, className)} ref={ref} {...props}>`
3. **Header bar** (conditional): If `language` is truthy, render a `<div>` with `codeBlockHeaderStyles` containing:
   - A `<span>` with the `language` text on the left
   - A `<CopyToClipboard text={children} />` on the right
4. **Copy button without header** (conditional): If `language` is falsy, render `<CopyToClipboard text={children} className="absolute top-2 right-2" />` positioned absolutely within the relative container.
5. **Code block**: `<pre className={cn(codeBlockPreStyles)}>` wrapping a `<code>`:
   - When `showLineNumbers` is `false`: render `{children}` directly inside `<code>`.
   - When `showLineNumbers` is `true`: split `children` by `'\n'`, compute `lines` array. Determine gutter width class using a conditional: if `lines.length >= 100` use `min-w-[4ch]`, else if `lines.length >= 10` use `min-w-[3ch]`, else use `min-w-[2ch]`. Map each line to a `<span className="flex" key={index}>` containing:
     - `<span className={cn(codeBlockLineNumberStyles, gutterWidthClass)}>{index + 1}</span>` — line number
     - `<span>{line || '\u00a0'}</span>` — code content (empty lines render non-breaking space to preserve height)

**Import structure**:
```typescript
import { cn } from '../../lib/utils.js';
import { CopyToClipboard } from '../copy-to-clipboard/copy-to-clipboard.js';
import {
  codeBlockStyles,
  codeBlockPreStyles,
  codeBlockHeaderStyles,
  codeBlockLineNumberStyles,
} from './code-block.styles.js';
import type { CodeBlockProps } from './code-block.types.js';

export type { CodeBlockProps } from './code-block.types.js';
```

### 3.4 `code-block.test.tsx`

**Purpose**: Comprehensive test suite covering rendering, features, and accessibility.

**Test setup**:
- Mock `navigator.clipboard.writeText` globally as `vi.fn().mockResolvedValue(undefined)` (same pattern as `copy-to-clipboard.test.tsx`)
- Import `createRef` from React for ref forwarding test
- Import `render`, `screen`, `fireEvent` from `@testing-library/react`
- Import `axe` from `vitest-axe`

**Tests** (all within `describe('CodeBlock', () => { ... })`):

| # | Test name | What it verifies |
|---|-----------|-----------------|
| 1 | `renders without crashing` | Render with a code string, assert `data-slot="code-block"` element exists via `data-testid` or container query |
| 2 | `has data-slot attribute` | Root element has `data-slot="code-block"` |
| 3 | `forwards ref` | Create `createRef<HTMLDivElement>()`, pass as `ref`, assert `ref.current` is `instanceof HTMLDivElement` |
| 4 | `merges custom className` | Pass `className="custom-class"`, assert root has both `custom-class` and a base class like `rounded-lg` |
| 5 | `renders pre and code elements` | Assert `container.querySelector('pre')` and `container.querySelector('code')` are not null |
| 6 | `displays language label when language prop is set` | Render with `language="typescript"`, assert text "typescript" is in the document |
| 7 | `does not render language label by default` | Render without `language`, assert no header bar with language text |
| 8 | `renders line numbers when showLineNumbers is true` | Render multi-line code with `showLineNumbers`, assert line number "1" and "2" are visible |
| 9 | `does not render line numbers by default` | Render multi-line code without `showLineNumbers`, assert no line number elements |
| 10 | `copy button copies the code content` | Click the copy button (found by `aria-label="Copy to clipboard"`), assert `navigator.clipboard.writeText` was called with the full code string |
| 11 | `has no accessibility violations` | `expect(await axe(container)).toHaveNoViolations()` |

### 3.5 `code-block.stories.tsx`

**Purpose**: Storybook stories for interactive documentation.

**Meta config**:
```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeBlock } from './code-block.js';

const meta: Meta<typeof CodeBlock> = {
  title: 'Components/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  argTypes: {
    language: { control: 'text' },
    showLineNumbers: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof CodeBlock>;
```

**Stories**:

| Story | Args / Render | Purpose |
|-------|---------------|---------|
| `Default` | `args: { children: 'const x = 42;' }` | Basic rendering with short snippet |
| `WithLanguageLabel` | `args: { children: 'const x: number = 42;\nconsole.log(x);', language: 'typescript' }` | Header bar with language label and copy button |
| `WithLineNumbers` | `args: { children: multiLineCode, showLineNumbers: true }` | Line numbers in the gutter |
| `WithLineNumbersAndLanguage` | `args: { children: multiLineCode, showLineNumbers: true, language: 'javascript' }` | Both features combined |
| `LongContent` | `args: { children: longLineCode }` | Horizontal scrolling with a very long single line |
| `EmptyContent` | `args: { children: '' }` | Edge case: empty code block |

The `multiLineCode` and `longLineCode` are defined as module-level constants for reuse.

### 3.6 `packages/ui/src/index.ts` (modification)

Add after the existing CopyToClipboard exports:
```typescript
export { CodeBlock, type CodeBlockProps } from './components/code-block/code-block.js';
```

Only the component and its prop type are exported. The internal style string constants (`codeBlockStyles`, `codeBlockPreStyles`, `codeBlockHeaderStyles`, `codeBlockLineNumberStyles`) are implementation details and are not part of the public API.

## 4. API Contracts

### CodeBlock Component

**Input (props)**:
```typescript
type CodeBlockProps = React.ComponentProps<'div'> & {
  children: string;
  showLineNumbers?: boolean; // default: false
  language?: string;
};
```

**Usage examples**:
```tsx
// Minimal
<CodeBlock>{'const x = 42;'}</CodeBlock>

// With language label
<CodeBlock language="typescript">{'const x: number = 42;'}</CodeBlock>

// With line numbers
<CodeBlock showLineNumbers>{'line 1\nline 2\nline 3'}</CodeBlock>

// Full-featured
<CodeBlock language="javascript" showLineNumbers>
  {'function hello() {\n  console.log("Hello!");\n}'}
</CodeBlock>

// With custom className
<CodeBlock className="my-8">{'npm install @components/ui'}</CodeBlock>
```

**Output (rendered HTML structure)**:

With `language` provided:
```html
<div data-slot="code-block" class="relative rounded-lg bg-muted border border-border">
  <div class="flex items-center justify-between px-4 py-2 border-b border-border text-xs text-muted-foreground">
    <span>typescript</span>
    <button data-slot="copy-to-clipboard" aria-label="Copy to clipboard">...</button>
  </div>
  <pre class="overflow-x-auto p-4 text-sm font-mono text-foreground">
    <code>const x: number = 42;</code>
  </pre>
</div>
```

Without `language`:
```html
<div data-slot="code-block" class="relative rounded-lg bg-muted border border-border">
  <button data-slot="copy-to-clipboard" class="absolute top-2 right-2 ..." aria-label="Copy to clipboard">...</button>
  <pre class="overflow-x-auto p-4 text-sm font-mono text-foreground">
    <code>const x = 42;</code>
  </pre>
</div>
```

With `showLineNumbers` (e.g., 3-line code block):
```html
<pre ...>
  <code>
    <span class="flex">
      <span class="select-none pr-4 text-right text-muted-foreground/50 min-w-[2ch]">1</span>
      <span>line 1</span>
    </span>
    <span class="flex">
      <span class="select-none pr-4 text-right text-muted-foreground/50 min-w-[2ch]">2</span>
      <span>line 2</span>
    </span>
    <span class="flex">
      <span class="select-none pr-4 text-right text-muted-foreground/50 min-w-[2ch]">3</span>
      <span>line 3</span>
    </span>
  </code>
</pre>
```

## 5. Test Plan

### Test Environment
- **Runner**: Vitest (via `pnpm test` or `pnpm --filter @components/ui test`)
- **DOM**: JSDOM
- **Libraries**: `@testing-library/react`, `vitest-axe`
- **Mocks**: `navigator.clipboard.writeText` mocked as `vi.fn().mockResolvedValue(undefined)` at module scope

### Test Setup
```typescript
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CodeBlock } from './code-block.js';

const writeText = vi.fn().mockResolvedValue(undefined);
Object.defineProperty(navigator, 'clipboard', {
  value: { writeText },
  writable: true,
  configurable: true,
});
```

### Per-Test Specification

| # | Test | Arrange | Act | Assert |
|---|------|---------|-----|--------|
| 1 | Smoke render | `render(<CodeBlock>{'code'}</CodeBlock>)` | — | Element with `data-slot="code-block"` is in the document |
| 2 | data-slot attribute | `render(<CodeBlock>{'code'}</CodeBlock>)` | Query by `[data-slot="code-block"]` | Attribute value equals `"code-block"` |
| 3 | Ref forwarding | Create `createRef<HTMLDivElement>()`, pass to CodeBlock | — | `ref.current instanceof HTMLDivElement` is true |
| 4 | className merging | `render(<CodeBlock className="custom">{'code'}</CodeBlock>)` | — | Root has both `"custom"` and `"rounded-lg"` classes |
| 5 | Renders pre and code | `render(<CodeBlock>{'code'}</CodeBlock>)` | — | `container.querySelector('pre')` and `container.querySelector('code')` are not null |
| 6 | Language label displayed | `render(<CodeBlock language="typescript">{'code'}</CodeBlock>)` | — | `screen.getByText('typescript')` is in the document |
| 7 | No language label by default | `render(<CodeBlock>{'code'}</CodeBlock>)` | — | No element containing header bar text |
| 8 | Line numbers rendered | `render(<CodeBlock showLineNumbers>{'a\nb'}</CodeBlock>)` | — | `screen.getByText('1')` and `screen.getByText('2')` are in the document |
| 9 | No line numbers by default | `render(<CodeBlock>{'a\nb'}</CodeBlock>)` | — | No line number elements (query for the line number style class returns empty) |
| 10 | Copy button works | `render(<CodeBlock>{'hello'}</CodeBlock>)` | `fireEvent.click(screen.getByLabelText('Copy to clipboard'))` | `writeText` called with `'hello'` |
| 11 | Accessibility | `render(<CodeBlock>{'code'}</CodeBlock>)` | `await axe(container)` | No violations |

## 6. Implementation Order

1. **`code-block.types.ts`** — Define `CodeBlockProps`. No dependencies on other new files.
2. **`code-block.styles.ts`** — Define all four style string constants. No dependencies on other new files.
3. **`code-block.tsx`** — Implement the component. Depends on types, styles, and the existing CopyToClipboard component from the sibling task.
4. **`code-block.test.tsx`** — Write and run the test suite. Depends on the component implementation.
5. **`code-block.stories.tsx`** — Write Storybook stories. Depends on the component implementation.
6. **`packages/ui/src/index.ts`** — Add `CodeBlock` and `type CodeBlockProps` exports to the public API.

## 7. Verification Commands

```bash
# Run CodeBlock tests only
pnpm --filter @components/ui test -- code-block

# Run full test suite
pnpm test

# Type-check the entire monorepo
pnpm typecheck

# Lint the ui package
pnpm --filter @components/ui lint

# Launch Storybook (manual visual verification)
pnpm storybook
```

## 8. Design Deviations

**Deviation 1: Line number gutter width via Tailwind arbitrary value classes**

- **Parent spec requires**: Splitting `children` by newline and rendering each line in a flex row with a line-number `<span>` and a code content `<span>`.
- **Issue**: The spec does not address consistent gutter width for varying line counts (e.g., single-digit vs. double-digit line numbers).
- **Alternative chosen**: The line number `<span>` uses Tailwind arbitrary value classes selected by a conditional based on total line count: `min-w-[2ch]` for 1–9 lines, `min-w-[3ch]` for 10–99 lines, `min-w-[4ch]` for 100+ lines. This is computed at render time from the `children` string (which is static per render) and applied via `cn()`. No inline styles are used — the approach complies with the AGENTS.md rule "Never use inline styles instead of Tailwind classes."

**Deviation 2: Empty line preservation in line number mode**

- **Parent spec requires**: Splitting `children` by `'\n'` and rendering spans.
- **Issue**: Empty lines from the split produce empty strings that would collapse to zero height.
- **Alternative chosen**: Empty lines render a `'\u00a0'` (non-breaking space) to preserve their visual height in the rendered output. This ensures the line count matches the actual code content.