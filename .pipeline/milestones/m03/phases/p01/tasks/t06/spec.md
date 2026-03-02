## Task: Integration verification

### Objective

Verify that all four new components (Sheet, Tabs, Accordion, Scroll Area) work correctly together, pass all quality checks, and are properly exported from the package.

### Deliverables

1. Run `pnpm typecheck` — zero errors across all packages
2. Run `pnpm test` — all tests pass including vitest-axe assertions for all four new components
3. Run `pnpm build` — clean build with no warnings
4. Verify all new exports are accessible from `@components/ui` by checking `packages/ui/src/index.ts` contains all sub-components and types:
   - Sheet: Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, sheetContentVariants, and all corresponding Props types
   - Tabs: Tabs, TabsList, TabsTrigger, TabsContent, and all corresponding Props types
   - Accordion: Accordion, AccordionItem, AccordionTrigger, AccordionContent, and all corresponding Props types
   - Scroll Area: ScrollArea, ScrollBar, and all corresponding Props types
5. Verify Storybook renders all four components with autodocs

### Files to Verify

- `packages/ui/src/index.ts` — all exports present
- `packages/ui/src/components/sheet/` — all 5 files present and correct
- `packages/ui/src/components/tabs/` — all 5 files present and correct
- `packages/ui/src/components/accordion/` — all 5 files present and correct
- `packages/ui/src/components/scroll-area/` — all 5 files present and correct

### Key Constraints

- All commands must pass with zero errors/failures
- No test may be skipped or marked as todo
- Build output must be clean (no warnings)

### Dependencies

- Tasks t01 through t05 must all be completed

### Verification

1. `pnpm typecheck` exits with code 0
2. `pnpm test` exits with code 0 and all tests pass
3. `pnpm build` exits with code 0 with no warnings
4. `packages/ui/src/index.ts` contains export lines for all 4 component directories
5. Storybook loads without errors and shows autodocs for Sheet, Tabs, Accordion, and Scroll Area
