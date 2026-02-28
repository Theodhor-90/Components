All verification commands pass. No code changes were needed — the v1 implementation was already correct.

- `packages/ui/src/components/card/card.types.ts` — unchanged; 6 prop types extending `React.ComponentProps<'div'>`
- `packages/ui/src/components/card/card.styles.ts` — unchanged; 6 variantless class-string constants
- `packages/ui/src/components/card/card.tsx` — unchanged; 6 named components with `data-slot`, `cn()`, ref-as-prop
- `packages/ui/src/components/card/card.test.tsx` — unchanged; 22 tests (smoke, composition, data-slot, styles, className merging, ref, axe a11y)
- `packages/ui/src/components/card/card.stories.tsx` — unchanged; 3 CSF3 autodocs stories (Default, WithFooter, WithForm)
- `packages/ui/src/index.ts` — unchanged; exports all 6 components and 6 prop types

**Verification results:**

- `pnpm --filter @components/ui test -- card`: 22/22 tests passed
- `pnpm test`: 53/53 tests passed (4 test files, 0 failures)
- `pnpm typecheck`: all 5 tasks passed
- `pnpm lint`: passed, 0 violations
