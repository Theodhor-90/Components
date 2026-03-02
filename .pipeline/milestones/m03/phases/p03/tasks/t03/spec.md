# Task: Exports and Integration Verification

## Objective

Add Header and App Layout exports to the public API barrel file and verify that the entire build pipeline (typecheck, tests, build, Storybook) passes cleanly.

## Deliverables

### 1. Update `packages/ui/src/index.ts`

Add the following exports following the existing pattern (`export { Component, type ComponentProps } from './components/{name}/{name}.js'`):

- `Header`, `type HeaderProps`, `headerVariants` from `./components/header/header.js`
- `AppLayout`, `type AppLayoutProps`, `appLayoutVariants` from `./components/app-layout/app-layout.js`

### 2. Run Verification Commands

- **`pnpm typecheck`** — must pass with no errors across the entire monorepo
- **`pnpm test`** — all tests must pass, including the new Header and App Layout tests, with vitest-axe accessibility assertions
- **`pnpm build`** — must produce clean build output with no errors
- **Storybook verification** — confirm both Header and App Layout components render correctly in Storybook with all stories and autodocs

## Dependencies

- **Task t01 (Header)**: Header component files must exist and be complete
- **Task t02 (App Layout)**: App Layout component files must exist and be complete

## Files to Modify

- `packages/ui/src/index.ts` — add export lines for Header and AppLayout

## Implementation Constraints

- Follow the existing export pattern in `index.ts` exactly — study current exports for Button, Sidebar, etc.
- Use `.js` extension in import paths (TypeScript ESM build convention)
- Named exports only
- Use `type` keyword for type-only exports: `type HeaderProps`, `type AppLayoutProps`

## Verification Criteria

1. `Header`, `HeaderProps`, and `headerVariants` are importable from `@components/ui`
2. `AppLayout`, `AppLayoutProps`, and `appLayoutVariants` are importable from `@components/ui`
3. `pnpm typecheck` passes with zero errors
4. `pnpm test` passes with all tests green (including vitest-axe for both new components)
5. `pnpm build` succeeds with clean output
6. Both components render correctly in Storybook with autodocs
