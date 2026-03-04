Now I have all the context I need. Let me produce the revised specification.

# Phase 2: Developer Utilities — Specification

## Goal

Build three custom utility components — Code Block, Copy to Clipboard, and Connection Status — for code display, clipboard interaction, and connectivity status indication, completing Milestone 6 and the full component library's coverage of all identified UI patterns across the five consumer applications. Each component follows the established 5-file pattern, ships with vitest-axe accessibility tests and Storybook autodocs, and requires no new external dependencies.

## Design Decisions

### DD-1: Copy to Clipboard as a standalone primitive, consumed by Code Block

Copy to Clipboard is implemented first as a self-contained button component. Code Block then composes it internally for its copy button rather than duplicating clipboard logic. This avoids code duplication and gives consumers a reusable clipboard button for contexts outside code display.

### DD-2: No syntax highlighting in Code Block

Code Block renders monospace `<pre>` + `<code>` with theme-aware background only. Syntax highlighting is a consumer concern — consumers can wrap the `children` content with a highlighting library (e.g., Prism, Shiki) if needed. This keeps the component dependency-free and focused on layout, styling, and copy functionality.

### DD-3: Clipboard API with no built-in fallback

Both Copy to Clipboard and Code Block use `navigator.clipboard.writeText()` directly. This API requires a secure context (HTTPS or localhost). No `document.execCommand('copy')` fallback is included — non-HTTPS fallback handling is the consumer's responsibility. Tests mock `navigator.clipboard` since JSDOM does not implement it.

### DD-4: Connection Status uses CVA for status-based color mapping

Connection Status maps its three states (`connected`, `connecting`, `disconnected`) to dot colors and optional animation via CVA variants rather than inline conditional classes. This keeps the styling declarative and consistent with other variant-driven components in the library (e.g., Badge, Alert).

### DD-5: Connection Status dot colors use fixed Tailwind color utilities

The status dot colors (green for connected, yellow for connecting, red for disconnected) use Tailwind's fixed color utilities (`bg-green-500`, `bg-yellow-500`, `bg-red-500`) rather than semantic tokens, because the semantic token palette (`primary`, `destructive`, etc.) does not provide green/yellow/red mapping suitable for traffic-light status indication. Dark mode variants use appropriate shade adjustments (`dark:bg-green-400`, etc.).

### DD-6: Copy to Clipboard feedback uses React state + setTimeout

The 2-second "Copied!" feedback uses a `copied` boolean state toggled by `setTimeout` with a hardcoded 2000ms duration, matching the milestone spec. The timeout is cleaned up on unmount via `useEffect` return to prevent state updates on unmounted components. No external animation library is used.

### DD-7: Code Block line numbers via explicit span elements per line

When `showLineNumbers` is `true`, the `children` string is split by newline and each line is rendered in a flex row with a line-number `<span>` and a code content `<span>`. This avoids requiring consumers to pre-format their code content and keeps the implementation straightforward with standard React rendering.

### DD-8: Task ordering — Copy to Clipboard before Code Block

Copy to Clipboard is implemented before Code Block because Code Block composes it internally. Connection Status has no dependency on the other two and is implemented last.

### DD-9: Copy to Clipboard uses plain string styles, not CVA

Copy to Clipboard is a single-presentation button with no size or variant options. Its base styling uses a plain string constant export (consistent with Skeleton, Card, and other non-variant components) rather than CVA variants. The component's focus is clipboard behavior and feedback, not visual variation.

## Tasks

### Task 1: Copy to Clipboard

**Deliverables**: 5 files in `packages/ui/src/components/copy-to-clipboard/`

- **`copy-to-clipboard.types.ts`** — `CopyToClipboardProps` extending `React.ComponentProps<'button'>` with required `text: string` prop and `asChild?: boolean` for polymorphic rendering via Radix Slot.
- **`copy-to-clipboard.styles.ts`** — `copyToClipboardStyles` plain string constant with base classes: `inline-flex items-center justify-center gap-2 rounded-md p-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer`.
- **`copy-to-clipboard.tsx`** — Implementation using `@radix-ui/react-slot` for `asChild` support. Renders a `<button>` (or Slot) with `data-slot="copy-to-clipboard"`. Internal state tracks `copied` boolean. On click: calls `navigator.clipboard.writeText(text)`, sets `copied = true`, schedules `setTimeout` to reset after 2000ms. Renders a copy icon (inline SVG) that swaps to a checkmark icon (inline SVG) when `copied` is true. Includes `aria-label` that changes from "Copy to clipboard" to "Copied" for screen reader feedback. Cleanup via `useEffect` return clears the timeout on unmount.
- **`copy-to-clipboard.test.tsx`** — Tests: smoke render, `data-slot` attribute, ref forwarding, className merging, calls `navigator.clipboard.writeText` with correct text on click, icon swaps to checkmark after click, resets to copy icon after 2000ms (use `vi.useFakeTimers`), `asChild` polymorphic rendering, accessibility (vitest-axe). Mock `navigator.clipboard.writeText` as `vi.fn().mockResolvedValue(undefined)`.
- **`copy-to-clipboard.stories.tsx`** — Stories: Default, AsChild (rendered as an anchor), WithLongText. CSF3 with `tags: ['autodocs']`.

### Task 2: Code Block

**Deliverables**: 5 files in `packages/ui/src/components/code-block/`

- **`code-block.types.ts`** — `CodeBlockProps` extending `React.ComponentProps<'div'>` with `children: string` (the code content), optional `showLineNumbers?: boolean` (default `false`), optional `language?: string` (display label only). No CVA variant props needed — Code Block has a single visual treatment.
- **`code-block.styles.ts`** — Plain string constant exports: `codeBlockStyles` for the outer container (`relative rounded-lg bg-muted border border-border`), `codeBlockPreStyles` for the `<pre>` element (`overflow-x-auto p-4 text-sm font-mono text-foreground`), `codeBlockHeaderStyles` for the optional language label bar (`flex items-center justify-between px-4 py-2 border-b border-border text-xs text-muted-foreground`), `codeBlockLineNumberStyles` for line number gutter (`select-none pr-4 text-right text-muted-foreground/50`).
- **`code-block.tsx`** — Implementation rendering a `<div data-slot="code-block">` wrapper. If `language` is provided, renders a header bar with the language label on the left and the Copy to Clipboard button on the right. If no `language`, the Copy to Clipboard button is positioned absolutely in the top-right corner. The `<pre>` + `<code>` block renders the `children` string. When `showLineNumbers` is `true`, splits `children` by newline and renders each line in a flex row with a line-number `<span>` and a code `<span>`. The Copy to Clipboard component receives `children` (the raw code string) as its `text` prop.
- **`code-block.test.tsx`** — Tests: smoke render with code string, `data-slot` attribute, ref forwarding, className merging, renders `<pre>` and `<code>` elements, displays language label when `language` prop is set, renders line numbers when `showLineNumbers` is `true`, does not render line numbers by default, copy button copies the code content (mock `navigator.clipboard`), accessibility (vitest-axe).
- **`code-block.stories.tsx`** — Stories: Default (short snippet), WithLanguageLabel (`language="typescript"`), WithLineNumbers, WithLineNumbersAndLanguage, LongContent (horizontal scrolling), EmptyContent. CSF3 with `tags: ['autodocs']`.

### Task 3: Connection Status

**Deliverables**: 5 files in `packages/ui/src/components/connection-status/`

- **`connection-status.types.ts`** — `ConnectionStatusProps` extending `React.ComponentProps<'div'>` with `VariantProps<typeof connectionStatusVariants>` and required `status: 'connected' | 'connecting' | 'disconnected'`. `children` is optional — if omitted, the default label for the status is displayed ("Connected", "Connecting", "Disconnected").
- **`connection-status.styles.ts`** — `connectionStatusVariants` CVA definition with a `status` variant. Base classes: `inline-flex items-center gap-2 text-sm`. Status variant maps to no extra classes on the container (color is on the dot). Separate export: `connectionStatusDotVariants` CVA with `status` variant mapping to dot-specific classes — `connected`: `bg-green-500 dark:bg-green-400`, `connecting`: `bg-yellow-500 dark:bg-yellow-400 animate-pulse`, `disconnected`: `bg-red-500 dark:bg-red-400`. Base dot classes: `size-2 rounded-full shrink-0`.
- **`connection-status.tsx`** — Implementation rendering a `<div data-slot="connection-status">` with the CVA container variant applied. Inside: a `<span data-slot="connection-status-dot">` with the dot CVA variant, followed by a `<span>` for the text label. If `children` is provided, renders `children` as the label; otherwise renders the default label string based on `status`. Includes `role="status"` and `aria-live="polite"` on the root element for screen reader announcements when status changes.
- **`connection-status.test.tsx`** — Tests: smoke render, `data-slot` attribute on root and dot, ref forwarding, className merging, renders correct default label for each status, renders custom label when children provided, applies correct color class for each status (`bg-green-500`, `bg-yellow-500`, `bg-red-500`), applies `animate-pulse` class only for `connecting` status, has `role="status"` and `aria-live="polite"`, accessibility (vitest-axe).
- **`connection-status.stories.tsx`** — Stories: Connected, Connecting, Disconnected, CustomLabel (`children="Online"`), AllStates (render function showing all three side by side). CSF3 with `tags: ['autodocs']`.

### Task 4: Public API Exports & Integration Verification

**Deliverables**:

- Add all three components and their types to `packages/ui/src/index.ts`:
  - `CopyToClipboard`, `type CopyToClipboardProps`
  - `CodeBlock`, `type CodeBlockProps`
  - `ConnectionStatus`, `type ConnectionStatusProps`, `connectionStatusVariants`, `connectionStatusDotVariants`
- Verify `pnpm typecheck` passes with no errors
- Verify `pnpm test` passes with zero failures
- Verify all three components render correctly in Storybook (`pnpm storybook`)

## Exit Criteria

1. All 15 files exist following the 5-file pattern: `copy-to-clipboard/` (5 files), `code-block/` (5 files), `connection-status/` (5 files)
2. `pnpm typecheck` passes with no TypeScript errors across the monorepo
3. `pnpm test` passes with zero failures, including vitest-axe accessibility assertions for all three components
4. Copy to Clipboard calls `navigator.clipboard.writeText()` with the provided `text` on click, swaps to a checkmark icon, and resets after 2 seconds
5. Code Block renders `<pre>` + `<code>` with monospace font and theme-aware background, displays optional line numbers, shows an optional language label, and integrates Copy to Clipboard for its copy button
6. Connection Status displays the correct dot color (green/yellow/red) and label for each of its three states, with `animate-pulse` on the `connecting` dot
7. Connection Status has `role="status"` and `aria-live="polite"` for screen reader announcements
8. All components, prop types, and CVA variant functions are exported from `packages/ui/src/index.ts`
9. All three components render correctly in Storybook with all variants documented via autodocs

## Dependencies

### Prior Phases

- **Milestone 6, Phase 1** (Process Visualization) — must be complete. Stepper and Timeline are implemented and tested.

### Prior Milestones

- **Milestone 1** (Foundation) — Button component exists and informs Copy to Clipboard's styling approach.
- **Milestones 1–5** — Establish the 5-file pattern, testing conventions, Storybook configuration, and `cn()` / CVA infrastructure that all three components depend on.

### Internal Packages

- `@components/utils` — `cn()` helper (clsx + tailwind-merge)
- `class-variance-authority` — CVA variant definitions
- `@radix-ui/react-slot` — `asChild` support for Copy to Clipboard

### External Libraries

No new external dependencies required. All three components are custom implementations using only packages already installed in the monorepo.

### Browser APIs

- `navigator.clipboard.writeText()` — used by Copy to Clipboard and (via composition) Code Block. Requires secure context. Tests mock this API.

## Artifacts

| Artifact | Type | Description |
|---|---|---|
| `packages/ui/src/components/copy-to-clipboard/copy-to-clipboard.tsx` | New | Component implementation |
| `packages/ui/src/components/copy-to-clipboard/copy-to-clipboard.types.ts` | New | Props type definitions |
| `packages/ui/src/components/copy-to-clipboard/copy-to-clipboard.styles.ts` | New | Plain string style constant |
| `packages/ui/src/components/copy-to-clipboard/copy-to-clipboard.test.tsx` | New | Vitest + vitest-axe tests |
| `packages/ui/src/components/copy-to-clipboard/copy-to-clipboard.stories.tsx` | New | Storybook CSF3 stories |
| `packages/ui/src/components/code-block/code-block.tsx` | New | Component implementation |
| `packages/ui/src/components/code-block/code-block.types.ts` | New | Props type definitions |
| `packages/ui/src/components/code-block/code-block.styles.ts` | New | Style constant exports |
| `packages/ui/src/components/code-block/code-block.test.tsx` | New | Vitest + vitest-axe tests |
| `packages/ui/src/components/code-block/code-block.stories.tsx` | New | Storybook CSF3 stories |
| `packages/ui/src/components/connection-status/connection-status.tsx` | New | Component implementation |
| `packages/ui/src/components/connection-status/connection-status.types.ts` | New | Props type definitions |
| `packages/ui/src/components/connection-status/connection-status.styles.ts` | New | CVA variant definitions |
| `packages/ui/src/components/connection-status/connection-status.test.tsx` | New | Vitest + vitest-axe tests |
| `packages/ui/src/components/connection-status/connection-status.stories.tsx` | New | Storybook CSF3 stories |
| `packages/ui/src/index.ts` | Modified | Add exports for all three components |