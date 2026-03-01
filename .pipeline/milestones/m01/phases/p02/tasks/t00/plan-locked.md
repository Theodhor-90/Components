I now have all the context I need. Let me also quickly check if there's a `@source` directive in globals.css — based on my reading, there isn't one, so I need to determine the correct placement for the `@plugin` directive.

Now I have all the information needed. Here's the complete implementation plan:

# Task 0: Animation Infrastructure Setup — Implementation Plan

## 1. Deliverables

| #   | File                             | Action | Purpose                                                                            |
| --- | -------------------------------- | ------ | ---------------------------------------------------------------------------------- |
| 1   | `packages/ui/package.json`       | Modify | Add `tailwindcss-animate` to `dependencies`                                        |
| 2   | `packages/ui/styles/globals.css` | Modify | Add `@plugin "tailwindcss-animate";` directive to enable animation utility classes |

## 2. Dependencies

### To install

- **`tailwindcss-animate`** — Tailwind CSS plugin providing `animate-in`, `animate-out`, `fade-in-*`, `fade-out-*`, `zoom-in-*`, `zoom-out-*`, `slide-in-from-*`, and `slide-out-to-*` utility classes. Required by Dialog, Alert Dialog, and Popover components in Tasks 1–3.

### Pre-existing (no action needed)

- `tailwindcss` `^4.0.0` (already in `devDependencies`)
- `pnpm` workspace and Turborepo build pipeline
- `tsc --build` configured as the build script

## 3. Implementation Details

### 3.1 `packages/ui/package.json`

**Purpose**: Register `tailwindcss-animate` as a runtime dependency so that Tailwind can resolve the plugin at build time.

**Change**: Add `"tailwindcss-animate": "^1.0.7"` to the `dependencies` object. It goes in `dependencies` (not `devDependencies`) because it is a Tailwind plugin that must be resolvable at build time by consuming applications that import `globals.css`.

The resulting `dependencies` section will be:

```json
"dependencies": {
  "@components/utils": "workspace:*",
  "@radix-ui/react-separator": "^1.1.0",
  "@radix-ui/react-slot": "^1.1.0",
  "class-variance-authority": "^0.7.1",
  "tailwindcss-animate": "^1.0.7"
}
```

### 3.2 `packages/ui/styles/globals.css`

**Purpose**: Activate the `tailwindcss-animate` plugin using Tailwind v4's `@plugin` syntax so that animation utility classes become available in all component stylesheets.

**Change**: Insert `@plugin "tailwindcss-animate";` on line 2, immediately after `@import 'tailwindcss';` (line 1) and before the `:root` rule (line 8). The task spec says to place it "after the `@import 'tailwindcss';` line and before the `@source` directive." There is no `@source` directive in the current file, so it goes between `@import 'tailwindcss';` and the `:root` block.

The top of the file will read:

```css
@import 'tailwindcss';

@plugin "tailwindcss-animate";

/*
 * Design Tokens — Light Theme
 * ...
```

**Key notes**:

- Tailwind v4 uses `@plugin "package-name";` syntax, not a `plugins` array in a config file.
- The `@plugin` directive must reference the npm package name exactly as installed.
- No additional configuration options are needed — the plugin's defaults provide all required utility classes.

### Utility classes made available

After setup, the following classes will be usable in component files:

| Class                    | Purpose                             |
| ------------------------ | ----------------------------------- |
| `animate-in`             | Entry animation composition trigger |
| `animate-out`            | Exit animation composition trigger  |
| `fade-in-0`              | Fade from 0% opacity (entry)        |
| `fade-out-0`             | Fade to 0% opacity (exit)           |
| `zoom-in-95`             | Scale from 95% (entry)              |
| `zoom-out-95`            | Scale to 95% (exit)                 |
| `slide-in-from-top-2`    | Slide from top by 0.5rem (entry)    |
| `slide-in-from-bottom-2` | Slide from bottom by 0.5rem (entry) |
| `slide-in-from-left-2`   | Slide from left by 0.5rem (entry)   |
| `slide-in-from-right-2`  | Slide from right by 0.5rem (entry)  |

These classes are composed using Tailwind's `data-[state=open]:` and `data-[state=closed]:` variants to animate Radix UI component state transitions.

## 4. API Contracts

N/A — This task modifies configuration files only. No component API, exports, or interfaces are created.

## 5. Test Plan

This task has no dedicated test files. Verification is done through build commands:

### 5.1 Build verification

- **What**: Run `pnpm build` in `packages/ui/` to confirm the Tailwind v4 plugin loads without errors during TypeScript compilation.
- **Pass criteria**: Command exits with code 0 and no error output mentioning `tailwindcss-animate`.

### 5.2 Install verification

- **What**: Confirm `tailwindcss-animate` is listed in `node_modules` and resolvable.
- **Pass criteria**: `pnpm ls tailwindcss-animate --filter @components/ui` shows the package in the dependency tree.

### 5.3 Plugin load verification

- **What**: Confirm the plugin directive is syntactically valid by ensuring Storybook can start (Storybook consumes `globals.css` with the Tailwind Vite plugin).
- **Pass criteria**: `pnpm storybook` starts without CSS processing errors (manual check, not required for CI gate).

### 5.4 Existing test regression

- **What**: Run `pnpm test` from the repository root to confirm no existing tests break.
- **Pass criteria**: All existing tests pass with zero failures.

## 6. Implementation Order

1. **Install the package**: Run `pnpm add tailwindcss-animate --filter @components/ui` from the repository root. This updates `packages/ui/package.json` and the lockfile.
2. **Update `globals.css`**: Add `@plugin "tailwindcss-animate";` on a new line after `@import 'tailwindcss';`, with a blank line separating it from the existing comment block.
3. **Verify the build**: Run `pnpm build --filter @components/ui` to confirm the plugin loads without errors.
4. **Run existing tests**: Run `pnpm test --filter @components/ui` to confirm no regressions.

## 7. Verification Commands

```bash
# 1. Install the dependency
pnpm add tailwindcss-animate --filter @components/ui

# 2. Verify it appears in package.json dependencies
grep "tailwindcss-animate" packages/ui/package.json

# 3. Verify the @plugin directive is in globals.css
grep '@plugin "tailwindcss-animate"' packages/ui/styles/globals.css

# 4. Build the package (confirms plugin loads without errors)
pnpm build --filter @components/ui

# 5. Run existing tests (no regressions)
pnpm test --filter @components/ui

# 6. Type check the monorepo
pnpm typecheck
```

## 8. Design Deviations

None.
