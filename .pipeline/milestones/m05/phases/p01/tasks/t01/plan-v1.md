Now I have a complete understanding of the project structure, conventions, and patterns. Let me produce the implementation plan.

# Task 1: Install Dependencies — Implementation Plan

## 1. Deliverables

| File | Purpose |
| --- | --- |
| `packages/ui/package.json` | Add `@radix-ui/react-dropdown-menu`, `@radix-ui/react-context-menu`, and `cmdk` to the `dependencies` object |
| `pnpm-lock.yaml` | Automatically updated by `pnpm install` with resolved versions and integrity hashes for the three new packages and their transitive dependencies |

No new files are created. Only existing files are modified.

## 2. Dependencies

### Prerequisites

- pnpm 9 must be available (already configured in the monorepo)
- Node.js and the existing monorepo setup must be functional (`pnpm install` must have been run at least once previously)
- No prior milestone tasks are required — this is the first task in Phase 1 of Milestone 5

### Packages to Install

| Package | Target Version | Constraint | Rationale |
| --- | --- | --- | --- |
| `@radix-ui/react-dropdown-menu` | latest stable (^1.x) | Must be compatible with React 19 peer dependency | Required by the Dropdown Menu component (Task 2) |
| `@radix-ui/react-context-menu` | latest stable (^1.x) | Must be compatible with React 19 peer dependency | Required by the Context Menu component (Task 3) |
| `cmdk` | latest stable (^1.x) | Must be v1.x — the version shadcn/ui targets | Required by the Command component (Task 4) |

All three are runtime `dependencies` (not `devDependencies`), consistent with how other Radix primitives are declared in the existing `packages/ui/package.json`.

## 3. Implementation Details

### 3.1 `packages/ui/package.json`

**Purpose**: Declare the three new runtime dependencies so that downstream component tasks can import their primitives.

**Changes**: Add three entries to the `dependencies` object. The entries should be inserted in alphabetical order within the existing dependency list, maintaining the established formatting convention (double-quoted keys, `^` semver prefix for version ranges).

After modification, the relevant section of `dependencies` will contain (among existing entries):

```json
{
  "dependencies": {
    ...
    "@radix-ui/react-context-menu": "^1.2.11",
    ...
    "@radix-ui/react-dropdown-menu": "^2.1.11",
    ...
    "cmdk": "^1.1.1",
    ...
  }
}
```

> **Note**: The exact patch versions shown above are illustrative. The actual versions will be whatever `pnpm add` resolves as the latest stable release at installation time. The `^` prefix allows compatible updates.

**Key rules**:
- These are `dependencies`, not `devDependencies` — they are runtime requirements for components that import their primitives
- React 19 remains a `peerDependency` and must not be modified
- No other fields in `package.json` should be changed

### 3.2 `pnpm-lock.yaml`

**Purpose**: Lock the resolved dependency graph for deterministic installs.

**Changes**: Automatically updated by `pnpm install`. No manual editing. The lockfile will gain entries for the three new packages and any transitive dependencies they pull in.

## 4. API Contracts

N/A — this task installs dependencies only. No component API surface is introduced.

## 5. Test Plan

This task has no new code to unit test. Verification is performed via CLI commands that confirm the packages are correctly resolved and that existing functionality is not broken.

### 5.1 Package Resolution Verification

- **What**: Confirm each of the three packages resolves to the correct major version
- **How**: Run `pnpm ls <package>` in the `packages/ui` directory for each package
- **Pass criteria**: Each command outputs a version matching the expected major (v1.x for `@radix-ui/react-context-menu` and `cmdk`; v2.x for `@radix-ui/react-dropdown-menu`)

### 5.2 No Type Regressions

- **What**: Confirm that adding the new dependencies does not introduce TypeScript type conflicts
- **How**: Run `pnpm typecheck` at the monorepo root
- **Pass criteria**: Exit code 0, no new type errors

### 5.3 No Test Regressions

- **What**: Confirm that existing tests still pass after the dependency installation
- **How**: Run `pnpm test` at the monorepo root
- **Pass criteria**: Exit code 0, all existing tests pass

## 6. Implementation Order

1. **Install packages**: Run `pnpm add @radix-ui/react-dropdown-menu @radix-ui/react-context-menu cmdk --filter @components/ui` from the monorepo root. This modifies `packages/ui/package.json` and `pnpm-lock.yaml` in a single operation.
2. **Verify resolution**: Run `pnpm ls @radix-ui/react-dropdown-menu @radix-ui/react-context-menu cmdk --filter @components/ui` to confirm all three packages resolved correctly and `cmdk` is v1.x.
3. **Verify no regressions**: Run `pnpm typecheck` and `pnpm test` to confirm no type conflicts or test failures were introduced.

## 7. Verification Commands

```bash
# Step 1: Install the three dependencies into @components/ui
pnpm add @radix-ui/react-dropdown-menu @radix-ui/react-context-menu cmdk --filter @components/ui

# Step 2: Verify all three packages resolved correctly
pnpm ls @radix-ui/react-dropdown-menu --filter @components/ui
pnpm ls @radix-ui/react-context-menu --filter @components/ui
pnpm ls cmdk --filter @components/ui

# Step 3: Verify cmdk is v1.x (not v0.x)
# The output of the above `pnpm ls cmdk` should show version 1.x.x

# Step 4: Verify no type regressions
pnpm typecheck

# Step 5: Verify no test regressions
pnpm test
```

## 8. Design Deviations

None.