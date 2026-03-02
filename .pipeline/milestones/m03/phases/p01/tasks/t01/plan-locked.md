Now I have all the context I need. Let me produce the implementation plan.

## 1. Deliverables

| #   | File                              | Purpose                                                                                                            |
| --- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 1   | `packages/ui/package.json`        | Add `@radix-ui/react-tabs`, `@radix-ui/react-accordion`, `@radix-ui/react-scroll-area` to `dependencies`           |
| 2   | `packages/ui/styles/globals.css`  | Add `@keyframes accordion-down`, `@keyframes accordion-up`, and corresponding animation utility mappings if absent |
| 3   | `pnpm-lock.yaml` (auto-generated) | Updated lockfile after `pnpm install`                                                                              |

## 2. Dependencies

### Packages to install

| Package                       | Version               | Target                       |
| ----------------------------- | --------------------- | ---------------------------- |
| `@radix-ui/react-tabs`        | `^1.1.0` (latest 1.x) | `packages/ui` `dependencies` |
| `@radix-ui/react-accordion`   | `^1.2.0` (latest 1.x) | `packages/ui` `dependencies` |
| `@radix-ui/react-scroll-area` | `^1.2.0` (latest 1.x) | `packages/ui` `dependencies` |

### Already installed (no action)

- `@radix-ui/react-dialog` — used by Sheet in Task 2
- `@radix-ui/react-slot` — used for `asChild` pattern
- `class-variance-authority` — CVA variant management
- `tailwindcss-animate` — animation plugin for slide/fade/accordion animations
- `@components/utils` — `cn()` helper

### Prerequisites

- Milestones 1 and 2 are complete (the Button, Dialog, and all form components exist)
- Node.js ≥ 22, pnpm 9.x (already configured in root `package.json`)

## 3. Implementation Details

### 3.1 `packages/ui/package.json` — Add Radix dependencies

**Purpose**: Register the three new Radix UI packages required by Tabs (t03), Accordion (t04), and Scroll Area (t05) components in this phase.

**Changes**: Add three entries under the `dependencies` key:

```json
"@radix-ui/react-accordion": "^1.2.0",
"@radix-ui/react-scroll-area": "^1.2.0",
"@radix-ui/react-tabs": "^1.1.0",
```

These are inserted alphabetically among the existing `@radix-ui/*` entries. The exact version range should match whatever `pnpm add` resolves — the versions above are approximate targets. Use `pnpm add` from `packages/ui` to ensure the correct latest versions are pinned.

**Key constraints**:

- Add as `dependencies` (NOT `devDependencies`) — these are runtime dependencies shipped with the component library
- React 19 remains a `peerDependency` — do not add React as a direct dependency
- Do NOT reinstall already-present packages (`@radix-ui/react-dialog`, `tailwindcss-animate`, etc.)

### 3.2 `packages/ui/styles/globals.css` — Accordion animation keyframes

**Purpose**: Ensure the CSS keyframes needed for Accordion open/close height animation are defined and mapped to Tailwind utility classes.

**Verification first**: Check whether `globals.css` already contains `accordion-down` or `accordion-up` keyframe definitions. The current file content (reviewed above) does NOT contain them — the file ends after the `@layer base` block at line 174.

**Additions** (append after the existing `@layer base` block):

```css
/*
 * Accordion animation keyframes
 * Used by Accordion component for animated open/close transitions.
 * Relies on Radix's --radix-accordion-content-height CSS variable.
 */
@keyframes accordion-down {
  from {
    height: 0;
  }
  to {
    height: var(--radix-accordion-content-height);
  }
}

@keyframes accordion-up {
  from {
    height: var(--radix-accordion-content-height);
  }
  to {
    height: 0;
  }
}
```

**Tailwind utility mapping**: Since this project uses `tailwindcss-animate` (the `@plugin "tailwindcss-animate"` directive is already at line 4 of `globals.css`), the `animate-accordion-down` and `animate-accordion-up` classes need to be registered. With Tailwind CSS v4, custom animations can be registered in the `@theme inline` block. Add these entries inside the existing `@theme inline { ... }` block:

```css
--animate-accordion-down: accordion-down 0.2s ease-out;
--animate-accordion-up: accordion-up 0.2s ease-out;
```

This maps `animate-accordion-down` and `animate-accordion-up` Tailwind utility classes to the keyframes above.

**Note on `tailwindcss-animate`**: The `tailwindcss-animate` plugin provides utilities like `animate-in`, `animate-out`, `fade-in-0`, `fade-out-0`, `slide-in-from-right`, etc. that are already used by Dialog. However, accordion-specific keyframes (`accordion-down`/`accordion-up`) are NOT part of `tailwindcss-animate` and must be defined manually, which is the standard shadcn/ui approach.

## 4. API Contracts

N/A — This task installs dependencies and adds CSS keyframes. It does not introduce any component API surface. The installed packages will be consumed by subsequent tasks (t02–t05) which define their own API contracts.

## 5. Test Plan

### What to test

This task has no component code to unit test. Verification is done via toolchain checks:

| Check                      | Method                                                                                                       | Expected result                                                                |
| -------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Dependencies installed     | `pnpm ls @radix-ui/react-tabs @radix-ui/react-accordion @radix-ui/react-scroll-area --filter @components/ui` | All three packages listed with resolved versions                               |
| No type regressions        | `pnpm typecheck`                                                                                             | Zero errors across all packages                                                |
| No test regressions        | `pnpm test`                                                                                                  | All existing tests pass (zero failures)                                        |
| Keyframes present in CSS   | Inspect `packages/ui/styles/globals.css`                                                                     | Contains `@keyframes accordion-down` and `@keyframes accordion-up` definitions |
| Animation utilities mapped | Inspect `@theme inline` block in `globals.css`                                                               | Contains `--animate-accordion-down` and `--animate-accordion-up` entries       |
| Build succeeds             | `pnpm build`                                                                                                 | Clean build, zero errors, zero warnings                                        |

### Test setup

No new test setup required. Existing Vitest + jsdom configuration at `packages/ui/vitest.config.ts` is unaffected.

## 6. Implementation Order

1. **Install Radix packages** — Run `pnpm add @radix-ui/react-tabs @radix-ui/react-accordion @radix-ui/react-scroll-area --filter @components/ui` from the workspace root. This modifies `packages/ui/package.json` and updates `pnpm-lock.yaml`.

2. **Add accordion keyframes to `globals.css`** — Append the `@keyframes accordion-down` and `@keyframes accordion-up` definitions after the existing `@layer base` block. Add `--animate-accordion-down` and `--animate-accordion-up` entries inside the `@theme inline` block.

3. **Run `pnpm install`** — Ensure the lockfile is consistent (should already be done by `pnpm add`, but confirm).

4. **Run verification commands** — Execute `pnpm typecheck`, `pnpm test`, and `pnpm build` to confirm no regressions.

## 7. Verification Commands

```bash
# 1. Install dependencies (run from workspace root)
pnpm add @radix-ui/react-tabs @radix-ui/react-accordion @radix-ui/react-scroll-area --filter @components/ui

# 2. Verify packages appear in package.json dependencies
pnpm ls @radix-ui/react-tabs @radix-ui/react-accordion @radix-ui/react-scroll-area --filter @components/ui

# 3. Type check — zero errors
pnpm typecheck

# 4. Run all existing tests — zero failures
pnpm test

# 5. Build all packages — clean build
pnpm build

# 6. Verify keyframes exist in globals.css
grep -c "accordion-down" packages/ui/styles/globals.css
# Expected output: 2 or more (keyframe definition + theme mapping)

grep -c "accordion-up" packages/ui/styles/globals.css
# Expected output: 2 or more (keyframe definition + theme mapping)
```

## 8. Design Deviations

**Deviation 1: Tailwind v4 animation utility registration**

- **Parent spec requires**: "Corresponding `animate-accordion-down` / `animate-accordion-up` utility mappings" — but does not specify the mechanism.
- **Issue**: In Tailwind CSS v4, the `@theme inline` block is the correct way to register custom animation utilities. The older approach of extending a Tailwind config file (`tailwind.config.js`) does not apply in v4, which uses CSS-first configuration via `@theme`. The `tailwindcss-animate` plugin handles its own animation set (fade, slide, zoom, spin) but does NOT include accordion-specific keyframes.
- **Alternative chosen**: Register `--animate-accordion-down` and `--animate-accordion-up` inside the existing `@theme inline` block in `globals.css`. This produces the `animate-accordion-down` and `animate-accordion-up` Tailwind utility classes that the Accordion component's styles will reference (e.g., `data-[state=open]:animate-accordion-down`). This is the standard Tailwind v4 approach and matches how the radius and color tokens are already registered in this file.
