## Task: Install Radix dependencies

### Objective

Install the required Radix UI packages and verify that accordion animation keyframes are present in the global stylesheet.

### Deliverables

1. Install `@radix-ui/react-tabs`, `@radix-ui/react-accordion`, and `@radix-ui/react-scroll-area` as dependencies in `packages/ui/package.json`
2. Verify accordion animation keyframes exist in `packages/ui/styles/globals.css`:
   - `@keyframes accordion-down` — animates from `height: 0` to `height: var(--radix-accordion-content-height)`
   - `@keyframes accordion-up` — reverse of above
   - Corresponding `animate-accordion-down` / `animate-accordion-up` utility mappings
   - If absent, add them
3. Run `pnpm typecheck` to confirm no regressions

### Files to Create or Modify

- `packages/ui/package.json` — add three new dependencies
- `packages/ui/styles/globals.css` — add accordion keyframes if missing

### Key Constraints

- Dependencies go under `dependencies` (not devDependencies) in `packages/ui/package.json`
- React 19 remains a `peerDependency`
- `@radix-ui/react-dialog` is already installed from Milestone 1; do NOT reinstall it
- `tailwindcss-animate` is already installed; do NOT reinstall it
- Run `pnpm install` from the workspace root after modifying package.json

### Dependencies

- None (this is the first task in the phase)

### Verification

1. `pnpm typecheck` passes with zero errors
2. `@radix-ui/react-tabs`, `@radix-ui/react-accordion`, `@radix-ui/react-scroll-area` appear in `packages/ui/package.json` dependencies
3. `packages/ui/styles/globals.css` contains `@keyframes accordion-down` and `@keyframes accordion-up` definitions
4. `pnpm install` completes without errors (lockfile updated)
