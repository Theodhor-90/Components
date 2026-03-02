All verification passed. Summary:

- **`packages/ui/src/index.ts`** — no changes needed; lines 273–276 already contain correct exports for `Header`, `HeaderProps`, `headerVariants`, `AppLayout`, `AppLayoutProps`, `appLayoutVariants` (added by t01/t02)
- **`pnpm typecheck`** — passed, 0 errors
- **`pnpm test`** — 455 tests passed across 33 files (including Header 11 tests)
- **`pnpm build`** — clean build, all 6 tasks successful
- **`dist/index.js`** — contains `Header`, `headerVariants`, `AppLayout`, `appLayoutVariants` exports
- **`dist/index.d.ts`** — contains `Header`, `HeaderProps`, `headerVariants`, `AppLayout`, `AppLayoutProps`, `appLayoutVariants` type declarations
