I now have a complete understanding of the codebase. Let me produce the implementation plan.

# Task 1 Implementation Plan: Install Dependencies

## 1. Deliverables

| File                       | Action        | Purpose                                                                                             |
| -------------------------- | ------------- | --------------------------------------------------------------------------------------------------- |
| `packages/ui/package.json` | Modify        | Add `@radix-ui/react-slider`, `react-hook-form`, `@hookform/resolvers`, and `zod` to `dependencies` |
| `pnpm-lock.yaml`           | Auto-modified | Lockfile updated by `pnpm install`                                                                  |

## 2. Dependencies

**Prerequisites:**

- The monorepo workspace is operational with `pnpm@9.15.4` and Node.js >= 22
- All Milestone 1 and Phase 1/Phase 2 components are already implemented and exported
- Existing `packages/ui/package.json` already lists Radix and other dependencies — the new packages extend this list

**Packages to install:**

| Package                  | Purpose                                                                                   | Target Section |
| ------------------------ | ----------------------------------------------------------------------------------------- | -------------- |
| `@radix-ui/react-slider` | Radix primitive for the Slider component (Task 2)                                         | `dependencies` |
| `react-hook-form`        | Form state management library for the Form component (Task 3)                             | `dependencies` |
| `@hookform/resolvers`    | Bridge package providing `zodResolver` to connect zod schemas to react-hook-form (Task 3) | `dependencies` |
| `zod`                    | Schema validation library for Form component validation (Task 3)                          | `dependencies` |

All packages go under `dependencies` (not `peerDependencies`), following the shadcn/ui convention established in the phase spec (DD-8). This is consistent with how other Radix packages (`@radix-ui/react-checkbox`, `@radix-ui/react-switch`, etc.) and third-party libraries (`sonner`) are already listed in the existing `package.json`.

## 3. Implementation Details

### 3.1 `packages/ui/package.json` — Add Dependencies

**Current state of `dependencies`:**

```json
{
  "dependencies": {
    "@components/utils": "workspace:*",
    "@radix-ui/react-alert-dialog": "^1.1.15",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-collapsible": "^1.1.12",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-popover": "^1.1.15",
    "@radix-ui/react-radio-group": "^1.3.2",
    "@radix-ui/react-select": "^2.2.4",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-switch": "^1.2.2",
    "@radix-ui/react-toggle": "^1.1.9",
    "@radix-ui/react-toggle-group": "^1.1.10",
    "@radix-ui/react-visually-hidden": "^1.2.4",
    "class-variance-authority": "^0.7.1",
    "sonner": "^2.0.7",
    "tailwindcss-animate": "^1.0.7"
  }
}
```

**Entries to add** (inserted in alphabetical order within the existing list):

```json
"@hookform/resolvers": "^5.0.1",
"@radix-ui/react-slider": "^1.3.4",
"react-hook-form": "^7.57.0",
"zod": "^3.25.42"
```

**Alphabetical placement:**

- `@hookform/resolvers` — after `@components/utils`, before `@radix-ui/react-alert-dialog`
- `@radix-ui/react-slider` — after `@radix-ui/react-select`, before `@radix-ui/react-slot`
- `react-hook-form` — after `class-variance-authority`, before `sonner`
- `zod` — after `tailwindcss-animate` (last entry)

**Version selection rationale:**

- Use `^` (caret) ranges consistent with all existing dependencies in the file
- The exact minor/patch versions should be resolved by pnpm at install time — the implementer should use `pnpm add` which automatically picks the latest compatible version and writes the correct range

### 3.2 Installation Command

Run from the workspace root:

```bash
pnpm --filter @components/ui add @radix-ui/react-slider react-hook-form @hookform/resolvers zod
```

This command:

1. Adds all four packages to `packages/ui/package.json` under `dependencies`
2. Resolves versions against the existing workspace constraints
3. Updates `pnpm-lock.yaml` with the resolved dependency tree
4. Installs the packages into `node_modules`

**Why `pnpm add` instead of manual editing:** Using `pnpm add` ensures the lockfile is updated atomically with the `package.json` change and that the resolved versions are compatible with the existing dependency tree (particularly React 19 as a peer dependency).

### 3.3 React 19 Compatibility Verification

After installation, confirm no peer dependency warnings for React 19:

- `@radix-ui/react-slider` — Radix UI v1.x supports React 19 (same as all other Radix packages already installed)
- `react-hook-form` v7 — supports React 19 since v7.54+
- `@hookform/resolvers` v5 — peer depends on `react-hook-form` v7, no React peer dep
- `zod` — no React dependency at all (pure validation library)

## 4. API Contracts

N/A — This task installs packages only; no new API surface is introduced.

## 5. Test Plan

No new test files are created in this task. Verification is limited to confirming that existing tests and typechecking continue to pass after the new dependencies are added.

### Test 1: Existing tests remain green

- **What**: All existing component tests must pass unchanged
- **Command**: `pnpm --filter @components/ui test`
- **Expected**: All tests pass with zero failures

### Test 2: Typecheck remains clean

- **What**: TypeScript compilation must succeed with no new errors
- **Command**: `pnpm --filter @components/ui typecheck`
- **Expected**: Exit code 0, no type errors

### Test 3: Package resolution is valid

- **What**: The installed packages resolve correctly and have no unmet peer dependencies
- **Command**: `pnpm ls --filter @components/ui --depth 0` (verify all four packages are listed)
- **Expected**: `@radix-ui/react-slider`, `react-hook-form`, `@hookform/resolvers`, and `zod` appear in the dependency list

### Test 4: Import smoke test

- **What**: The installed packages can be imported by TypeScript without module resolution errors
- **Verification**: Run `pnpm --filter @components/ui typecheck` after installation — if module resolution fails for any new package, typecheck would surface it
- **Expected**: No "Cannot find module" errors

## 6. Implementation Order

1. **Run `pnpm --filter @components/ui add @radix-ui/react-slider react-hook-form @hookform/resolvers zod`** from the workspace root — this performs the entire task in one command (modifies `package.json`, updates lockfile, installs packages)
2. **Review `packages/ui/package.json`** — verify all four packages appear under `dependencies` in the expected alphabetical positions
3. **Run `pnpm --filter @components/ui typecheck`** — confirm no type errors introduced
4. **Run `pnpm --filter @components/ui test`** — confirm all existing tests still pass

## 7. Verification Commands

```bash
# 1. Install the four new dependencies
pnpm --filter @components/ui add @radix-ui/react-slider react-hook-form @hookform/resolvers zod

# 2. Verify packages are in package.json
grep -E '"@radix-ui/react-slider"|"react-hook-form"|"@hookform/resolvers"|"zod"' packages/ui/package.json

# 3. Verify no typecheck regressions
pnpm --filter @components/ui typecheck

# 4. Verify no test regressions
pnpm --filter @components/ui test

# 5. Verify dependency resolution (no unmet peer deps)
pnpm ls --filter @components/ui @radix-ui/react-slider react-hook-form @hookform/resolvers zod
```

## 8. Design Deviations

None.
