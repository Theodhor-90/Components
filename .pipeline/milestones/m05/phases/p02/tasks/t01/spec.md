# Task: Install react-day-picker Dependency

## Objective

Install the `react-day-picker` library (latest v9.x) as a runtime dependency in the UI package so that the Calendar and Date Picker components can consume it.

## Deliverables

- Add `react-day-picker` (latest v9.x) to `dependencies` in `packages/ui/package.json`
- Run `pnpm install` to update the lockfile (`pnpm-lock.yaml`)
- Verify the package resolves correctly by running `pnpm ls react-day-picker` inside the `packages/ui` directory

## Files Modified

| File | Change |
|---|---|
| `packages/ui/package.json` | Add `react-day-picker` to `dependencies` |
| `pnpm-lock.yaml` | Updated by `pnpm install` |

## Dependencies

- None — this is the first task in the phase

## Verification Criteria

1. `react-day-picker` appears in `packages/ui/package.json` under `dependencies`
2. `pnpm ls react-day-picker` (run from `packages/ui`) shows the installed v9.x version
3. `pnpm install` completes without errors
4. No other package.json files are modified