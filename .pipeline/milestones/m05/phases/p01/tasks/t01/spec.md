# Task 1: Install Dependencies

## Objective

Install the three external libraries required by the Menus phase so that all subsequent component tasks can import their Radix UI and cmdk primitives.

## Deliverables

- Install `@radix-ui/react-dropdown-menu`, `@radix-ui/react-context-menu`, and `cmdk` as runtime dependencies in `packages/ui/package.json`
- Run `pnpm install` to update `pnpm-lock.yaml`
- Verify all three packages resolve correctly by running `pnpm ls` inside `packages/ui`

## Files Modified

| File                       | Change                                     |
| -------------------------- | ------------------------------------------ |
| `packages/ui/package.json` | Add three new entries under `dependencies` |
| `pnpm-lock.yaml`           | Updated automatically by pnpm              |

## Constraints

- Use latest stable versions of each package
- `cmdk` must be v1.x (the version shadcn/ui targets)
- All three are runtime `dependencies`, not `devDependencies`
- React 19 remains a `peerDependency` — do not change it

## Dependencies

- None (first task in the phase)

## Verification

1. `pnpm ls @radix-ui/react-dropdown-menu` in `packages/ui` shows the installed version
2. `pnpm ls @radix-ui/react-context-menu` in `packages/ui` shows the installed version
3. `pnpm ls cmdk` in `packages/ui` shows the installed version (v1.x)
4. `pnpm install` exits with code 0 (no resolution errors)
5. `pnpm typecheck` still passes after installation (no type conflicts introduced)
