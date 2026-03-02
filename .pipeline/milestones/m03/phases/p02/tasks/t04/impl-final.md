**Files created:**

- `packages/ui/src/components/resizable/resizable.types.ts` — `ResizablePanelGroupProps`, `ResizablePanelProps`, `ResizableHandleProps` (extends library types; adds `withHandle?: boolean`)
- `packages/ui/src/components/resizable/resizable.styles.ts` — Static style constants for panel group, handle, and grip indicator
- `packages/ui/src/components/resizable/resizable.tsx` — `ResizablePanelGroup`, `ResizablePanel`, `ResizableHandle` wrapping `react-resizable-panels` with `data-slot`, `cn()` class merging, and optional SVG grip indicator
- `packages/ui/src/components/resizable/resizable.test.tsx` — 10 tests: smoke render, handle between panels, withHandle SVG grip, no-grip when false, horizontal/vertical direction attributes, data-slot on all sub-components, className merging on group and handle, axe accessibility (with `aria-required-attr` excluded due to upstream library limitation)
- `packages/ui/src/components/resizable/resizable.stories.tsx` — 5 stories: Horizontal, Vertical, WithHandle, ThreePanels, NestedGroups

**Files modified:**

- `packages/ui/src/index.ts` — Added exports for `ResizablePanelGroup`, `ResizablePanel`, `ResizableHandle` and their types

**Verification:** `pnpm test` (434/434 pass), `pnpm typecheck` (0 errors), `pnpm lint` (0 errors)
