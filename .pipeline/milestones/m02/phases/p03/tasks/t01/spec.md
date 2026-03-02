# Task: Install Dependencies

## Objective

Install all new packages required by Phase 3 (Range & Form) into `packages/ui/package.json` under `dependencies`.

## Deliverables

- All four packages added to `packages/ui/package.json` `dependencies` and resolved in the workspace lockfile.

## Packages to Install

| Package                  | Purpose                                                                          |
| ------------------------ | -------------------------------------------------------------------------------- |
| `@radix-ui/react-slider` | Radix primitive for the Slider component                                         |
| `react-hook-form`        | Form state management library for Form component                                 |
| `@hookform/resolvers`    | Bridge package providing `zodResolver` to connect zod schemas to react-hook-form |
| `zod`                    | Schema validation library for Form component validation                          |

## Files to Modify

- `packages/ui/package.json` — add all four packages under `dependencies`

## Implementation Details

- All packages go under `dependencies` (not `peerDependencies`), following shadcn/ui convention (DD-8 from phase spec).
- Verify React 19 compatibility for all packages before installation.
- Run `pnpm install` from the workspace root to resolve dependencies across the monorepo.
- Ensure no peer dependency warnings or version conflicts are introduced.

## Dependencies

- None within this phase. This is the first task and must complete before Tasks 2–3.

## Verification Criteria

1. `packages/ui/package.json` lists `@radix-ui/react-slider`, `react-hook-form`, `@hookform/resolvers`, and `zod` under `dependencies`.
2. `pnpm install` completes without errors or unresolved peer dependency warnings.
3. `pnpm typecheck` still passes after installation (no breakage to existing code).
4. `pnpm test` still passes after installation (no breakage to existing tests).
