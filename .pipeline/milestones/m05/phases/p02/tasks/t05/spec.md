# Task: Integration Verification

## Objective

Verify that all Phase 2 components (Calendar, Date Picker, Time Picker) integrate correctly across the monorepo — type checking, tests, builds, exports, and Storybook all pass without errors.

## Deliverables

1. Run `pnpm typecheck` across the monorepo — zero TypeScript errors
2. Run `pnpm test` across the monorepo — all tests pass including new Calendar, Date Picker, and Time Picker tests
3. Run `pnpm build` — successful build with all new components included in output
4. Verify all new exports are accessible from `@components/ui` by checking the built output
5. Verify Storybook renders all new stories with `pnpm storybook` (manual check or build)

## Files to Verify (no new files created)

| Check | Command | Expected |
|---|---|---|
| TypeScript | `pnpm typecheck` | Zero errors |
| Tests | `pnpm test` | All pass, including vitest-axe |
| Build | `pnpm build` | Success, new components in output |
| Exports | Inspect `packages/ui/src/index.ts` | Calendar, CalendarProps, DatePicker, DatePickerProps, TimePicker, TimePickerProps all exported |
| Storybook | `pnpm storybook` or `pnpm build-storybook` | All new stories render |

## Dependencies

- **Tasks t01–t04** must all be complete

## Verification Criteria

1. `pnpm typecheck` exits with code 0
2. `pnpm test` exits with code 0 with all tests passing
3. `pnpm build` exits with code 0
4. `packages/ui/src/index.ts` exports: `Calendar`, `CalendarProps`, `DatePicker`, `DatePickerProps`, `TimePicker`, `TimePickerProps`
5. Built output includes calendar, date-picker, and time-picker component files
6. Storybook builds or renders without errors for all new stories

## Phase 2 Exit Criteria Checklist

This task confirms all phase-level exit criteria are met:

- [ ] All 3 components (Calendar, Date Picker, Time Picker) render correctly in Storybook with all variants and states documented via autodocs
- [ ] `pnpm test` passes with zero failures, including vitest-axe accessibility assertions for all 3 components
- [ ] `pnpm typecheck` passes with no TypeScript errors across the monorepo
- [ ] Calendar renders navigable month views with inline SVG chevron buttons and supports single-date, date-range, and multiple-date selection via the `mode` prop
- [ ] Calendar styling uses OKLCH semantic tokens with no react-day-picker default CSS imported
- [ ] Calendar uses react-day-picker v9 API with correct `classNames` keys and `Chevron` component override
- [ ] Date Picker displays formatted selected date in trigger and opens/closes Calendar Popover on click
- [ ] Date Picker supports both controlled and uncontrolled usage
- [ ] Time Picker renders two Select inputs for hour (00–23) and minute (00–59) inside a Popover
- [ ] Time Picker supports both controlled and uncontrolled usage
- [ ] All icons are inline SVGs — no icon library dependency introduced
- [ ] All 3 components include `data-slot` attributes
- [ ] All components, prop types, and style exports are exported from `packages/ui/src/index.ts`