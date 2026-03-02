Now I have all the context needed. Here is the complete implementation plan:

# Task Plan: Install All Radix Dependencies (m02/p02/t01)

## 1. Deliverables

| #   | File                       | Action | Purpose                                   |
| --- | -------------------------- | ------ | ----------------------------------------- |
| 1   | `packages/ui/package.json` | Modify | Add 6 Radix UI packages to `dependencies` |

No other files are created or modified by this task.

## 2. Dependencies

### Prerequisites

- **Milestone 1 complete** — monorepo build pipeline operational, existing Radix packages installed
- **Phase 1 (Text Inputs) complete** — Input and Textarea implemented and exported (already done on current branch)
- **pnpm 9** available as the package manager

### Packages to Install

All six packages go into `dependencies` (not `devDependencies`) in `packages/ui/package.json`:

| Package                        | Purpose                         |
| ------------------------------ | ------------------------------- |
| `@radix-ui/react-checkbox`     | Checkbox component (Task 2)     |
| `@radix-ui/react-switch`       | Switch component (Task 3)       |
| `@radix-ui/react-radio-group`  | Radio Group component (Task 4)  |
| `@radix-ui/react-toggle`       | Toggle component (Task 5)       |
| `@radix-ui/react-toggle-group` | Toggle Group component (Task 6) |
| `@radix-ui/react-select`       | Select component (Task 7)       |

### Version Alignment

The existing `packages/ui/package.json` already contains these Radix packages with version ranges:

- `@radix-ui/react-alert-dialog`: `^1.1.15`
- `@radix-ui/react-collapsible`: `^1.1.12`
- `@radix-ui/react-dialog`: `^1.1.15`
- `@radix-ui/react-label`: `^2.1.8`
- `@radix-ui/react-popover`: `^1.1.15`
- `@radix-ui/react-separator`: `^1.1.8`
- `@radix-ui/react-slot`: `^1.2.4`
- `@radix-ui/react-visually-hidden`: `^1.2.4`

The new packages should be installed at their latest stable versions compatible with React 19. All `@radix-ui/*` packages with `^1.x` version ranges are published from the same Radix monorepo and are designed to work together. The `pnpm add` command will resolve the latest compatible versions automatically.

## 3. Implementation Details

### Single Deliverable: `packages/ui/package.json`

**Purpose**: Add runtime Radix UI dependencies needed by all six selection control components in Phase 2.

**Approach**: Run a single `pnpm add` command from the `packages/ui` directory to install all six packages at once. This:

1. Adds the packages to `dependencies` in `packages/ui/package.json`
2. Updates the `pnpm-lock.yaml` lockfile at the monorepo root
3. Downloads and links the packages in `node_modules`

**Key constraint**: All packages must land in `dependencies` (not `devDependencies`), because they are runtime dependencies imported by component source code that ships to consumers.

**Expected result in `package.json`**: Six new entries in the `dependencies` object, alphabetically sorted alongside existing Radix packages. The exact resolved versions will depend on what's latest at install time, but they will follow the `^x.y.z` caret range convention already established.

## 4. API Contracts

N/A — This task installs dependencies only. No code is created or modified beyond `package.json`.

## 5. Test Plan

This task has no component code to test. Verification is purely structural:

| #   | Check                                         | How                                                        |
| --- | --------------------------------------------- | ---------------------------------------------------------- |
| 1   | All 6 packages present in `dependencies`      | Inspect `packages/ui/package.json`                         |
| 2   | No packages accidentally in `devDependencies` | Inspect `packages/ui/package.json`                         |
| 3   | Install succeeds without errors               | `pnpm install` exits with code 0                           |
| 4   | Type checking still passes                    | `pnpm typecheck` exits with code 0                         |
| 5   | Existing tests still pass                     | `pnpm test` exits with code 0                              |
| 6   | Versions are compatible with React 19         | Confirmed by successful typecheck (React 19 is a peer dep) |

## 6. Implementation Order

1. **Install all 6 Radix packages** in a single `pnpm add` command from the `packages/ui` directory
2. **Verify `package.json`** — confirm all 6 packages appear under `dependencies`
3. **Run `pnpm typecheck`** — confirm no type errors introduced
4. **Run `pnpm test`** — confirm existing tests still pass

## 7. Verification Commands

```bash
# Step 1: Install all 6 Radix packages (run from packages/ui/)
cd packages/ui && pnpm add @radix-ui/react-checkbox @radix-ui/react-switch @radix-ui/react-radio-group @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-select

# Step 2: Verify packages are in dependencies (not devDependencies)
node -e "const pkg = require('./packages/ui/package.json'); const deps = ['@radix-ui/react-checkbox','@radix-ui/react-switch','@radix-ui/react-radio-group','@radix-ui/react-toggle','@radix-ui/react-toggle-group','@radix-ui/react-select']; const missing = deps.filter(d => !pkg.dependencies[d]); if (missing.length) { console.error('Missing:', missing); process.exit(1); } else { console.log('All 6 Radix packages present in dependencies'); }"

# Step 3: Type checking
pnpm typecheck

# Step 4: Existing tests
pnpm test
```

## 8. Design Deviations

None.
