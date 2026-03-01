All verification commands pass. Here's the summary:

- **`packages/ui/package.json`** — `@radix-ui/react-popover` added to dependencies; removed erroneous `tslib` dependency added by v2
- **`packages/ui/src/components/popover/popover.types.ts`** — unchanged; `PopoverProps`, `PopoverTriggerProps`, `PopoverContentProps` type aliases
- **`packages/ui/src/components/popover/popover.styles.ts`** — unchanged; `popoverContentStyles` Tailwind class constant
- **`packages/ui/src/components/popover/popover.tsx`** — cleaned up: removed unnecessary type cast on `PopoverTriggerPrimitive`; 3 exports (`Popover`, `PopoverTrigger`, `PopoverContent`) with `data-slot`, portal, and type re-exports
- **`packages/ui/src/components/popover/popover.test.tsx`** — rewritten to match locked plan's 10 tests exactly (removed extra portal test from v2, kept plan-specified tests)
- **`packages/ui/src/components/popover/popover.stories.tsx`** — updated `Positioning` story to use `.map()` pattern per plan; updated `AsChildTrigger` to use `<span>` per plan
- **`packages/ui/src/index.ts`** — exports `Popover`, `PopoverTrigger`, `PopoverContent`, and all 3 prop types
- **`packages/ui/src/components/dialog/dialog.test.tsx`** — fixed pre-existing bug: trigger query uses `data-slot` selector instead of `getByRole` (trigger is `aria-hidden` when dialog is open)
- **`packages/ui/src/components/alert-dialog/alert-dialog.test.tsx`** — fixed same pre-existing bug as dialog tests
