Now I have all the context. Let me produce the revised plan addressing both feedback issues:

1. **Correctness**: Replace `pnpm build-storybook` / `pnpm --filter @components/docs build-storybook` with `pnpm --filter @components/docs build` (which runs `storybook build`)
2. **Ambiguity**: Remove specific test counts from section 3.2 and verify "all tests pass" instead

## 1. Deliverables

This task creates **no new files** and **modifies no existing files**. It is a verification-only task that confirms all Phase 2 components (Calendar, Date Picker, Time Picker) — implemented in tasks t01–t04 — integrate correctly across the monorepo.

| # | Artifact | Purpose |
|---|----------|---------|
| 1 | `pnpm typecheck` pass | Confirm zero TypeScript errors across the monorepo |
| 2 | `pnpm test` pass | Confirm all tests pass, including Calendar, Date Picker, and Time Picker vitest-axe assertions |
| 3 | `pnpm build` pass | Confirm successful build with all new components in output |
| 4 | Export verification | Confirm `Calendar`, `CalendarProps`, `DatePicker`, `DatePickerProps`, `TimePicker`, `TimePickerProps` are exported from `packages/ui/src/index.ts` |
| 5 | Build output verification | Confirm `calendar`, `date-picker`, `time-picker` component files exist in `packages/ui/dist/` |
| 6 | Storybook build pass | Confirm Storybook builds without errors for all new stories |

## 2. Dependencies

### Prior Tasks (must be complete)

- **t01**: `react-day-picker` installed in `packages/ui/package.json` and lockfile updated
- **t02**: Calendar component — all 5 files created, exported from `index.ts`
- **t03**: Date Picker component — all 5 files created, exported from `index.ts`
- **t04**: Time Picker component — all 5 files created, exported from `index.ts`

### Infrastructure (must exist)

- Turborepo build pipeline configured in `turbo.json`
- Vitest test runner configured in `packages/ui/`
- TypeScript project references configured for `tsc --build`
- Storybook 8.5 configured in `apps/docs/`

### External Libraries (already installed by t01)

| Package | Version | Status |
|---------|---------|--------|
| `react-day-picker` | ^9 | Installed in `packages/ui/package.json` |

## 3. Implementation Details

### 3.1 TypeScript Type Checking

Run `pnpm typecheck` from the workspace root. This invokes `turbo run typecheck`, which runs `tsc --noEmit` in each package.

**Expected outcome**: Exit code 0 with zero TypeScript errors.

**What this validates**:
- `CalendarProps` correctly extends `React.ComponentProps<typeof DayPicker>` (calendar.types.ts)
- `DatePickerProps` type is consistent with the component's destructured props (date-picker.types.ts)
- `TimePickerProps` type is consistent with the component's destructured props (time-picker.types.ts)
- All imports between components resolve correctly (e.g., `Calendar` imported by `DatePicker`, `Select` imported by `TimePicker`)
- The `@components/hooks` dependency (`useControllableState`) used by DatePicker and TimePicker resolves correctly
- All `index.ts` exports reference valid module paths (`.js` extensions for ESM)

**If it fails**: Inspect the errors. Common issues:
- Mismatched prop types between the component signature and the types file
- Missing `.js` extensions on import paths (required for ESM)
- `react-day-picker` types not found (indicates t01 didn't complete correctly)
- `useControllableState` generic type parameter issues

### 3.2 Test Suite

Run `pnpm test` from the workspace root. This invokes `turbo run test`, which runs `vitest run` in each package.

**Expected outcome**: Exit code 0 with all tests passing, including the test suites for the three new components (`calendar.test.tsx`, `date-picker.test.tsx`, `time-picker.test.tsx`). The only requirement is zero failures — specific test counts may vary based on actual implementation in prior tasks.

**What this validates**:
- All three new test files execute successfully
- vitest-axe accessibility assertions pass for Calendar, Date Picker, and Time Picker
- No regressions in existing tests from prior milestones

**If tests fail**: Common issues:
- `Element.prototype.hasPointerCapture` not polyfilled — needed for Radix Select in jsdom (time-picker.test.tsx has this in `beforeAll`)
- `scrollIntoView` not available in jsdom — same polyfill pattern
- `axe` violations from missing accessible names or ARIA attributes
- Async timing issues with popover open/close — verify `waitFor` usage

### 3.3 Build

Run `pnpm build` from the workspace root. This invokes `turbo run build`, which runs `tsc --build` in each package following the dependency order: tokens → utils → hooks → ui.

**Expected outcome**: Exit code 0 with `packages/ui/dist/` containing compiled output.

**What to verify in build output**:
- `packages/ui/dist/components/calendar/calendar.js` exists
- `packages/ui/dist/components/calendar/calendar.d.ts` exists
- `packages/ui/dist/components/date-picker/date-picker.js` exists
- `packages/ui/dist/components/date-picker/date-picker.d.ts` exists
- `packages/ui/dist/components/time-picker/time-picker.js` exists
- `packages/ui/dist/components/time-picker/time-picker.d.ts` exists
- `packages/ui/dist/index.js` includes re-exports for all three components
- `packages/ui/dist/index.d.ts` includes type exports for all three components

**If it fails**: Common issues:
- `.styles.ts` or `.types.ts` files not included in `tsconfig.json` `include` pattern
- Import paths missing `.js` extension
- Files not in the correct directory structure

### 3.4 Export Verification

Inspect `packages/ui/src/index.ts` to confirm the following exports exist:

```
export { Calendar, type CalendarProps } from './components/calendar/calendar.js';
export { DatePicker, type DatePickerProps } from './components/date-picker/date-picker.js';
export { TimePicker, type TimePickerProps } from './components/time-picker/time-picker.js';
```

### 3.5 Storybook Build Verification

Run the Storybook build via `pnpm --filter @components/docs build`. The `@components/docs` package's `build` script runs `storybook build`, which compiles all stories into static output.

**Expected outcome**: Build completes without errors.

**Stories to verify are included**:
- `Components/Calendar` — all Calendar stories from `calendar.stories.tsx`
- `Components/DatePicker` — all Date Picker stories from `date-picker.stories.tsx`
- `Components/TimePicker` — all Time Picker stories from `time-picker.stories.tsx`

## 4. API Contracts

N/A — This is a verification-only task. No new APIs are introduced.

## 5. Test Plan

This task **runs** existing tests rather than creating new ones. The test plan is the verification itself:

### 5.1 Typecheck Verification
- **What**: Run `pnpm typecheck` from workspace root
- **Expected**: Exit code 0, zero errors
- **Confirms**: All type definitions, imports, and exports are correctly configured

### 5.2 Test Suite Verification
- **What**: Run `pnpm test` from workspace root
- **Expected**: Exit code 0, all tests pass with zero failures
- **Confirms**: Calendar, Date Picker, and Time Picker test suites all pass including vitest-axe accessibility assertions

### 5.3 Build Verification
- **What**: Run `pnpm build` from workspace root
- **Expected**: Exit code 0, dist/ directory populated
- **Confirms**: TypeScript compilation succeeds, all component files are emitted

### 5.4 Build Output Spot Check
- **What**: Verify compiled files exist in `packages/ui/dist/`
- **Expected**: `.js` and `.d.ts` files for calendar, date-picker, time-picker
- **Confirms**: Build output includes all new components

### 5.5 Storybook Build Verification
- **What**: Run `pnpm --filter @components/docs build` from workspace root
- **Expected**: Build completes without errors
- **Confirms**: All new stories compile and can be rendered

## 6. Implementation Order

1. **Run `pnpm typecheck`** — This is the fastest check and catches type errors before investing time in tests or builds. If this fails, fix type issues first.

2. **Run `pnpm test`** — Run the full test suite. Pay attention to the three new test files specifically. If tests fail, diagnose and fix before proceeding.

3. **Run `pnpm build`** — Run the full build. This confirms `tsc --build` succeeds and emits all compiled output.

4. **Verify build output** — Spot-check that `packages/ui/dist/` contains the expected files for calendar, date-picker, and time-picker (both `.js` and `.d.ts`).

5. **Verify exports in `index.ts`** — Confirm `Calendar`, `CalendarProps`, `DatePicker`, `DatePickerProps`, `TimePicker`, `TimePickerProps` are all exported.

6. **Run Storybook build** — Run `pnpm --filter @components/docs build` to confirm all stories compile.

7. **Report results** — Summarize pass/fail status for each verification step.

## 7. Verification Commands

```bash
# Step 1: Type checking (from workspace root)
pnpm typecheck

# Step 2: Run all tests
pnpm test

# Step 3: Build all packages
pnpm build

# Step 4: Verify build output exists for new components
ls packages/ui/dist/components/calendar/
ls packages/ui/dist/components/date-picker/
ls packages/ui/dist/components/time-picker/

# Step 5: Verify exports in compiled index
grep -E "Calendar|DatePicker|TimePicker" packages/ui/dist/index.d.ts

# Step 6: Build Storybook
pnpm --filter @components/docs build
```

**Notes on commands**:
- All commands should be run from the workspace root (`/Users/theodhor/Desktop/Portfolio/Components/`)
- `pnpm typecheck` invokes `turbo run typecheck` per the root `package.json`
- `pnpm test` invokes `turbo run test` per the root `package.json`
- `pnpm build` invokes `turbo run build` per the root `package.json`
- The Storybook app is at `apps/docs/` with package name `@components/docs`; its `build` script runs `storybook build`

## 8. Design Deviations

None.

## 9. Phase 2 Exit Criteria Checklist

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