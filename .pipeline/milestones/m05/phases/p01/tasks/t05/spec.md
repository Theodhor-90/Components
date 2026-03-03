# Task 5: Integration Verification

## Objective

Verify that all three menu/command components (Dropdown Menu, Context Menu, Command) integrate correctly with the monorepo build pipeline, pass all quality checks, and are properly exported from the package.

## Deliverables

- Run `pnpm typecheck` across the entire monorepo — must complete with zero TypeScript errors
- Run `pnpm test` across the entire monorepo — all tests must pass, including all new menu component tests and all pre-existing tests
- Run `pnpm build` — must succeed with all new components included in the build output
- Verify all new exports are accessible from `@components/ui` by checking the built output or import resolution
- Verify Storybook builds or renders all new stories (via `pnpm storybook` build check)

## Checks

| Check      | Command                                       | Expected Result                                                                               |
| ---------- | --------------------------------------------- | --------------------------------------------------------------------------------------------- |
| TypeScript | `pnpm typecheck`                              | Exit code 0, no errors                                                                        |
| Tests      | `pnpm test`                                   | All tests pass, zero failures                                                                 |
| Build      | `pnpm build`                                  | Successful build output                                                                       |
| Exports    | Inspect `packages/ui/src/index.ts`            | All Dropdown Menu, Context Menu, and Command sub-components, types, and variants are exported |
| Storybook  | `pnpm build-storybook` or manual verification | All 19 new stories (7 + 6 + 6) render correctly                                               |

## Dependencies

- **Task 2** (t02): Dropdown Menu component must be complete
- **Task 3** (t03): Context Menu component must be complete
- **Task 4** (t04): Command component must be complete

## Verification

1. `pnpm typecheck` exits with code 0
2. `pnpm test` exits with code 0 with all tests passing
3. `pnpm build` exits with code 0
4. `packages/ui/src/index.ts` exports all sub-components from all three new components
5. No pre-existing tests have been broken by the new additions
6. Phase exit criteria from the spec are fully satisfied:
   - Dropdown Menu supports nested sub-menus, checkbox items, radio items with group exclusivity, and keyboard navigation
   - Context Menu opens on right-click at cursor position with the same item types as Dropdown Menu
   - Command filters items in real time, supports arrow-key/Enter/Escape navigation, and CommandDialog composes Dialog
   - DropdownMenuItem and ContextMenuItem support `variant` prop with `"default" | "destructive"` values via CVA
   - All sub-components include `data-slot` attributes
