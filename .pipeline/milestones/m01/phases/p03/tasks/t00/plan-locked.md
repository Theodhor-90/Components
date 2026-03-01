Now I have a thorough understanding of the codebase patterns. Let me produce the implementation plan.

# Task 0 Plan: Install Radix Dependencies

## 1. Deliverables

| File                       | Action        | Purpose                                                                                                             |
| -------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------- |
| `packages/ui/package.json` | Modify        | Add `@radix-ui/react-label`, `@radix-ui/react-visually-hidden`, and `@radix-ui/react-collapsible` to `dependencies` |
| `pnpm-lock.yaml`           | Auto-modified | Lock file updated by `pnpm add`                                                                                     |

## 2. Dependencies

**Packages to install** (runtime dependencies in `packages/ui`):

- `@radix-ui/react-label` — Radix primitive for accessible `<label>` elements with `htmlFor` binding
- `@radix-ui/react-visually-hidden` — Radix primitive that renders content off-screen for screen readers only
- `@radix-ui/react-collapsible` — Radix primitive for expand/collapse toggle behavior

**Pre-existing infrastructure** (no changes needed):

- pnpm 9 workspace with `packages/ui` as a workspace package
- React 19 as a `peerDependency` in `packages/ui/package.json`
- TypeScript strict mode with `tsc --noEmit` typecheck script
- Existing Radix dependencies already in `packages/ui/package.json`: `@radix-ui/react-alert-dialog`, `@radix-ui/react-dialog`, `@radix-ui/react-popover`, `@radix-ui/react-separator`, `@radix-ui/react-slot`

## 3. Implementation Details

### `packages/ui/package.json`

**Purpose:** Register the three new Radix UI packages as runtime dependencies so that Tasks 1–3 of Phase 3 can import and wrap them.

**Changes:** The `dependencies` object will gain three new entries. The exact versions will be determined by `pnpm add` (latest compatible versions at install time), following the `^` semver range convention used by the existing Radix dependencies (e.g., `"@radix-ui/react-separator": "^1.1.8"`).

Expected additions to the `dependencies` section:

```json
{
  "@radix-ui/react-collapsible": "^1.1.x",
  "@radix-ui/react-label": "^2.1.x",
  "@radix-ui/react-visually-hidden": "^1.1.x"
}
```

(Exact patch versions will be whatever `pnpm add` resolves to.)

**Key constraints:**

- These are `dependencies`, not `devDependencies` — they are runtime requirements consumed by the published package
- `peerDependencies` (React 19) must NOT be modified
- The packages must be added using `pnpm add` from within the `packages/ui` workspace to ensure proper workspace resolution
- No other fields in `package.json` should change

## 4. API Contracts

N/A — This task only installs dependencies. No new component APIs are introduced.

## 5. Test Plan

This task has no new test files. Verification is purely structural:

| Check                                 | Method                                        | Expected Result                                                                                                            |
| ------------------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Dependencies listed in `package.json` | Read `packages/ui/package.json` after install | `@radix-ui/react-label`, `@radix-ui/react-visually-hidden`, `@radix-ui/react-collapsible` all present under `dependencies` |
| Package resolution                    | `pnpm install` exit code                      | Exit code 0, no resolution errors                                                                                          |
| Type checking passes                  | `pnpm typecheck`                              | Exit code 0, zero errors across monorepo                                                                                   |
| Existing tests still pass             | `pnpm test`                                   | All existing tests pass (no regressions from new dependencies)                                                             |
| Import resolution                     | Temporary TypeScript import check             | Each package can be imported in a `.ts` file without resolution errors (verified via typecheck)                            |

## 6. Implementation Order

1. **Install the three packages** — Run `pnpm add @radix-ui/react-label @radix-ui/react-visually-hidden @radix-ui/react-collapsible` from the `packages/ui` workspace directory (using `--filter @components/ui` or by running from within `packages/ui/`)
2. **Verify `package.json` updated** — Confirm all three packages appear under `dependencies` with `^` semver ranges
3. **Run `pnpm typecheck`** — Ensure zero TypeScript errors across the monorepo, confirming the packages resolve correctly and don't introduce type conflicts
4. **Run `pnpm test`** — Ensure all existing tests still pass (no regressions)

## 7. Verification Commands

```bash
# Step 1: Install the three Radix dependencies in the ui workspace
pnpm --filter @components/ui add @radix-ui/react-label @radix-ui/react-visually-hidden @radix-ui/react-collapsible

# Step 2: Verify package.json contains the new dependencies
node -e "
const pkg = require('./packages/ui/package.json');
const deps = ['@radix-ui/react-label', '@radix-ui/react-visually-hidden', '@radix-ui/react-collapsible'];
const missing = deps.filter(d => !pkg.dependencies[d]);
if (missing.length > 0) { console.error('Missing:', missing); process.exit(1); }
console.log('All dependencies present.');
"

# Step 3: TypeScript type checking passes
pnpm typecheck

# Step 4: Existing tests still pass
pnpm test
```

## 8. Design Deviations

None.
