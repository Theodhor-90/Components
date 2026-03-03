# Task: Integration Verification

## Objective

Verify all five components (Avatar, Avatar Group, Tooltip, Hover Card, Progress) work correctly together and all quality gates pass. Install required Radix dependencies and run the full verification suite.

## Deliverables

- Install new Radix dependencies in `packages/ui/package.json`: `@radix-ui/react-avatar`, `@radix-ui/react-tooltip`, `@radix-ui/react-hover-card`, `@radix-ui/react-progress`.
- Run `pnpm typecheck` — must pass with zero TypeScript errors.
- Run `pnpm test` — all Avatar, Avatar Group, Tooltip, Hover Card, and Progress tests must pass, including vitest-axe accessibility checks.
- Run `pnpm build` (if applicable) — the `@components/ui` package builds successfully with all new components included.
- Verify Storybook renders all five components correctly with all stories visible and interactive.
- Verify `packages/ui/src/index.ts` exports all new components, types, and style functions.

## Files to Modify

- `packages/ui/package.json` — Add `@radix-ui/react-avatar`, `@radix-ui/react-tooltip`, `@radix-ui/react-hover-card`, `@radix-ui/react-progress` to dependencies (if not already added during individual tasks).

## Key Verification Steps

1. **TypeScript check**: `pnpm typecheck` passes with zero errors across the entire `@components/ui` package.
2. **Test suite**: `pnpm test` passes with zero failures. All vitest-axe accessibility assertions pass.
3. **Build**: `pnpm build` succeeds with all new components included in the output.
4. **Storybook**: All five components render correctly with all stories visible, interactive, and autodocs generating documentation.
5. **Exports audit**: Verify `packages/ui/src/index.ts` contains exports for: Avatar, AvatarImage, AvatarFallback, avatarVariants, AvatarGroup, avatarGroupStyles, avatarGroupOverflowStyles, Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, HoverCard, HoverCardTrigger, HoverCardContent, Progress, progressStyles, progressIndicatorStyles, and all associated type exports.

## Dependencies

- **Tasks 1–5 must be complete** before this task can begin.

## Verification Criteria

1. `pnpm typecheck` exits with code 0.
2. `pnpm test` exits with code 0 with all phase 2 component tests passing.
3. `pnpm build` exits with code 0 (if applicable).
4. Storybook starts and renders all five component story files without errors.
5. `packages/ui/src/index.ts` contains all expected exports for Avatar, Avatar Group, Tooltip, Hover Card, and Progress.
6. All 18 exit criteria from the phase spec are satisfied.
