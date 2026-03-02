# Task 1: Install `react-resizable-panels` dependency

## Objective

Add the `react-resizable-panels` third-party library as a runtime dependency for the Resizable component (Task 4 of this phase).

## Deliverables

- Add `react-resizable-panels` to `packages/ui/package.json` under `dependencies`
- Run `pnpm install` to update `pnpm-lock.yaml`
- Verify the package resolves correctly (e.g., `pnpm ls react-resizable-panels` in the `packages/ui` directory)

## Key Details

- The Resizable component (t04) wraps `react-resizable-panels` following the shadcn/ui pattern. This dependency must be installed before that component can be implemented.
- Install as a regular `dependency` (not `devDependency` or `peerDependency`) since consumer apps need it at runtime.
- Do not install any other packages — `@radix-ui/react-slot` is already installed (used by Breadcrumb and Sidebar for `asChild` support).

## Dependencies

- None within this phase. This is the first task and has no prerequisites.

## Verification

1. `react-resizable-panels` appears in `packages/ui/package.json` under `dependencies`
2. `pnpm-lock.yaml` is updated with the resolution
3. `pnpm ls react-resizable-panels --filter @components/ui` shows the package is installed
4. `pnpm typecheck` still passes (no regressions from the new dependency)
