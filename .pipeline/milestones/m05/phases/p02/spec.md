## Phase 2: Calendar & Date Pickers

### Goal

Build the calendar primitive and two date/time picker components that compose it with Popover for user-friendly temporal input. These components enable consumer apps to implement date selection (single, range, multiple), formatted date display triggers, and hour/minute time selection.

### Deliverables

1. **Calendar** — shadcn port wrapping `react-day-picker`. Supports three selection modes via `mode` prop: `single`, `range`, `multiple`. Theme-integrated styling using OKLCH semantic tokens. Navigation between months via chevron buttons. Accepts `selected`, `onSelect`, `disabled` (dates or date ranges), and standard `react-day-picker` props.

2. **Date Picker** — shadcn-pattern composing Popover + Calendar + Button. The trigger Button displays the formatted selected date (or placeholder text when empty). Clicking the trigger opens a Popover containing a Calendar in single-selection mode. Selecting a date closes the popover and updates the trigger display. Supports controlled and uncontrolled usage.

3. **Time Picker** — custom component. Popover containing hour and minute inputs in HH:mm (24-hour) format. Hour input: 00–23. Minute input: 00–59. Composes the Select component from Milestone 2 for both hour and minute fields. Supports keyboard navigation between hour and minute fields. Supports controlled and uncontrolled usage via `value` / `onChange` props.

### Technical Decisions & Constraints

- Each component follows the 5-file pattern: `{name}.tsx`, `{name}.styles.ts`, `{name}.types.ts`, `{name}.test.tsx`, `{name}.stories.tsx`
- New dependency to install: `react-day-picker`
- Calendar must integrate `react-day-picker` styling with the project's OKLCH semantic tokens (not use react-day-picker's default CSS)
- Date Picker is a composed pattern (not a Radix primitive wrapper) — it assembles Popover, Calendar, and Button
- Time Picker uses Select (from Milestone 2) for hour/minute dropdowns, not raw `<input type="number">`
- All components and their prop types and CVA variant functions must be exported from `packages/ui/src/index.ts`
- Tests must include vitest-axe accessibility assertions; stories must use CSF3 with `tags: ['autodocs']`

### Dependencies on Prior Phases

- **Milestone 1 (Foundation)** — Popover (used by Date Picker, Time Picker)
- **Milestone 2 (Form Controls)** — Button (used by Date Picker trigger and Calendar navigation), Select (composed by Time Picker for hour and minute inputs)
- **Milestone 5, Phase 1 (Menus)** — No direct dependency, but both phases share the same milestone context
