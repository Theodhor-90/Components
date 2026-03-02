# Task: Install All Radix Dependencies

## Objective

Install all six Radix UI packages required by Phase 2 (Selection Controls) into `packages/ui/package.json` in a single step, before any component implementation begins.

## Deliverables

All six Radix packages added to `dependencies` in `packages/ui/package.json`:

- `@radix-ui/react-checkbox`
- `@radix-ui/react-switch`
- `@radix-ui/react-radio-group`
- `@radix-ui/react-toggle`
- `@radix-ui/react-toggle-group`
- `@radix-ui/react-select`

## Key Implementation Details

- Version ranges must align with the existing `@radix-ui/*` packages already in the project (e.g., `react-dialog`, `react-popover`, `react-label` from Milestone 1)
- All packages go under `dependencies` (not `devDependencies`) in `packages/ui/package.json`
- Install via a single `pnpm install` command from the `packages/ui` directory
- All packages must be compatible with React 19 (the project's framework version)

## Files to Modify

| File                       | Action                            |
| -------------------------- | --------------------------------- |
| `packages/ui/package.json` | Modify — add 6 Radix dependencies |

## Dependencies

- None within this phase (this is the first task)
- Milestone 1 must be complete (monorepo build pipeline operational)

## Verification Criteria

1. All 6 packages appear in `packages/ui/package.json` under `dependencies`
2. `pnpm install` completes without errors
3. Version ranges align with existing `@radix-ui/*` packages in the project
4. `pnpm typecheck` still passes after installation
