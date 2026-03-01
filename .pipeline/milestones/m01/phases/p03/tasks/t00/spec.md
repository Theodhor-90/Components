# Task 0: Install Radix dependencies

## Objective

Install the three Radix UI packages required by Phase 3 (Accessibility Primitives) as dependencies in the `packages/ui` workspace package.

## Deliverables

- Install `@radix-ui/react-label`, `@radix-ui/react-visually-hidden`, and `@radix-ui/react-collapsible` as runtime dependencies in `packages/ui/package.json`
- Verify all three packages resolve correctly (imports work without errors)
- Verify `pnpm typecheck` still passes with zero errors across the monorepo

## Files to Modify

| File                       | Action                            |
| -------------------------- | --------------------------------- |
| `packages/ui/package.json` | Modify — add 3 Radix dependencies |

## Implementation Details

- Use `pnpm add` from the `packages/ui` workspace to install:
  - `@radix-ui/react-label`
  - `@radix-ui/react-visually-hidden`
  - `@radix-ui/react-collapsible`
- These are runtime dependencies (not devDependencies)
- React 19 remains a `peerDependency` — do not modify the peer dependency configuration

## Dependencies

- None within this phase — this is the first task and must be completed before Tasks 1–3

## Verification Criteria

1. `packages/ui/package.json` lists all three packages under `dependencies`
2. `pnpm install` completes without errors
3. `pnpm typecheck` passes with zero errors
4. Each package can be imported in a TypeScript file without resolution errors
