All 35 Phase 2 component tests pass across all 3 test files.

- `packages/ui/src/index.ts` — Removed `copyToClipboardStyles` export (line 465). All other Phase 2 exports remain: `CopyToClipboard`, `CopyToClipboardProps`, `CodeBlock`, `CodeBlockProps`, `ConnectionStatus`, `ConnectionStatusProps`, `connectionStatusVariants`, `connectionStatusDotVariants`.
- `pnpm typecheck` — passes (0 errors)
- `pnpm test` — 55 test files, 782 tests, 0 failures