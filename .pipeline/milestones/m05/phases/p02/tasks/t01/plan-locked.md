I now have all the information needed. Here is the complete implementation plan:

# Task Plan: Install react-day-picker Dependency

## 1. Deliverables

| # | File / Artifact | Purpose |
|---|---|---|
| 1 | `packages/ui/package.json` | Add `react-day-picker` (latest v9.x) to `dependencies` |
| 2 | `pnpm-lock.yaml` | Updated lockfile after `pnpm install` |

No new files are created. This task modifies two existing files.

## 2. Dependencies

### Prerequisites

- pnpm 9.x (already installed — `packageManager: "pnpm@9.15.4"` in root `package.json`)
- Node.js >= 22 (already required by root `package.json`)

### External Package to Install

| Package | Target Version | Purpose |
|---|---|---|
| `react-day-picker` | `^9` (latest v9.x) | Foundation library for the Calendar component (Task 2) and Date Picker component (Task 3) in this phase |

### No Other Dependencies

- `react-day-picker` v9 has no required peer dependencies beyond `react` and `react-dom`, which are already declared as `peerDependencies` in `packages/ui/package.json`
- No CSS imports are needed — the Calendar component (Task 2) will apply styling via the `classNames` prop using Tailwind utility classes

## 3. Implementation Details

### 3.1 Modify `packages/ui/package.json`

**Purpose:** Declare `react-day-picker` as a runtime dependency so the Calendar and Date Picker components can import from it.

**Change:** Add one line to the `dependencies` object:

```json
"react-day-picker": "^9"
```

**Placement:** Insert alphabetically within the existing `dependencies` block — after `"react-hook-form"` and before `"react-resizable-panels"`.

The resulting `dependencies` section will include:

```json
{
  "dependencies": {
    ...
    "react-hook-form": "^7.71.2",
    "react-day-picker": "^9",
    "react-resizable-panels": "^2.1.7",
    ...
  }
}
```

**Exports/interfaces:** N/A — this is a package metadata change, not code.

### 3.2 Update `pnpm-lock.yaml`

**Purpose:** Lock the resolved version of `react-day-picker` and all its transitive dependencies.

**Change:** Automatically updated by running `pnpm install` from the repository root.

**Key logic:** No manual edits. The lockfile update is a side effect of the `pnpm install` command after modifying `package.json`.

## 4. API Contracts

N/A — This task installs a dependency. No application code, component API, or module exports are created or modified.

## 5. Test Plan

This task has no code to unit test. Verification is done via the following checks:

### 5.1 Dependency Resolution Check

**What to test:** `react-day-picker` resolves correctly within the `packages/ui` workspace.

**How:** Run `pnpm ls react-day-picker --filter @components/ui`. Expect output showing `react-day-picker` at a v9.x version.

### 5.2 No Regression Check

**What to test:** Installing the new dependency does not break existing tests or type checking.

**How:**
1. Run `pnpm test --filter @components/ui` — all existing component tests must pass
2. Run `pnpm typecheck --filter @components/ui` — no TypeScript errors introduced

### 5.3 Import Smoke Check

**What to test:** The `DayPicker` component can be imported from `react-day-picker` in the `packages/ui` context.

**How:** Run a Node.js one-liner from the `packages/ui` directory:
```bash
node -e "import('react-day-picker').then(m => { console.log('DayPicker:', typeof m.DayPicker); process.exit(typeof m.DayPicker === 'function' ? 0 : 1); })"
```
Expected output: `DayPicker: function` with exit code 0.

### 5.4 No Other Package.json Modified

**What to test:** Only `packages/ui/package.json` was modified, no other workspace `package.json` files were changed.

**How:** `git diff --name-only -- '*/package.json'` should show only `packages/ui/package.json`.

## 6. Implementation Order

1. **Edit `packages/ui/package.json`** — Add `"react-day-picker": "^9"` to the `dependencies` object, positioned alphabetically after `"react-hook-form"`.

2. **Run `pnpm install`** — Execute from the repository root (`/Users/theodhor/Desktop/Portfolio/Components`) to resolve the new dependency and update `pnpm-lock.yaml`.

3. **Verify installation** — Run `pnpm ls react-day-picker --filter @components/ui` to confirm the package resolved to a v9.x version.

4. **Run existing tests** — Run `pnpm test --filter @components/ui` to confirm no regressions.

5. **Run type check** — Run `pnpm typecheck --filter @components/ui` to confirm no TypeScript errors.

## 7. Verification Commands

All commands run from the repository root (`/Users/theodhor/Desktop/Portfolio/Components`):

```bash
# 1. Install the new dependency
pnpm install

# 2. Verify react-day-picker is installed at v9.x in the ui package
pnpm ls react-day-picker --filter @components/ui

# 3. Verify the DayPicker export is importable
cd packages/ui && node -e "import('react-day-picker').then(m => { console.log('DayPicker:', typeof m.DayPicker); process.exit(typeof m.DayPicker === 'function' ? 0 : 1); })" && cd ../..

# 4. Verify no existing tests are broken
pnpm test --filter @components/ui

# 5. Verify no TypeScript errors introduced
pnpm typecheck --filter @components/ui

# 6. Verify only packages/ui/package.json was modified (among package.json files)
git diff --name-only -- '*/package.json'
```

## 8. Design Deviations

None.