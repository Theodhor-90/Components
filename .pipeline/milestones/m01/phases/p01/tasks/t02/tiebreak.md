All verification commands pass:

- `pnpm --filter @components/ui test -- --run` — 31/31 tests pass (11 badge tests)
- `pnpm --filter @components/ui typecheck` — clean
- `pnpm --filter @components/ui lint` — clean
- `pnpm --filter @components/ui build` — clean

The v2 implementation was already correct — both reviews were blocked by sandbox EPERM restrictions preventing test/build execution, not by actual code issues.

**Files (no changes needed — all files verified correct as-is):**

- `packages/ui/src/components/badge/badge.styles.ts` — CVA with 4 variants (`default`, `secondary`, `destructive`, `outline`) + base classes
- `packages/ui/src/components/badge/badge.types.ts` — `BadgeProps` = `ComponentProps<'div'> & VariantProps & { asChild?: boolean }`
- `packages/ui/src/components/badge/badge.tsx` — `Badge` component with Slot/asChild, `data-slot="badge"`, `cn()` + `badgeVariants`
- `packages/ui/src/components/badge/badge.test.tsx` — 11 tests: 9 from plan + 2 interaction tests (click + keyboard via asChild button)
- `packages/ui/src/components/badge/badge.stories.tsx` — CSF3 autodocs, 5 stories (`Default`, `Secondary`, `Destructive`, `Outline`, `AsChild`)
- `packages/ui/src/index.ts` — exports `Badge`, `type BadgeProps`, `badgeVariants`
