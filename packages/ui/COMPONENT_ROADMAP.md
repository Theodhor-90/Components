# Component Roadmap — @components/ui

Full inventory of planned UI components for the shared component library.

## Implementation

Components are implemented via the **Iteration Engine** (sibling repository). Each phase below
maps to an Iteration Engine milestone. The engine scaffolds phases and tasks from this plan,
then runs iterative draft → challenge → refine cycles to produce locked specs and implementations.

## Conventions

- **shadcn/ui** is the primary source. Components that exist in shadcn/ui are ported and adapted
  to this monorepo's patterns (React 19 ref-as-prop, CVA variants, 5-file structure, OKLCH tokens).
- **Radix UI** primitives provide accessible behavior. shadcn components already use Radix under
  the hood — we follow the same primitive mappings.
- Components marked **Custom** have no shadcn equivalent and are built from scratch.
- The Button component (`src/components/button/`) is the canonical reference for the 5-file pattern.

### Source legend

| Tag              | Meaning                                                                        |
| ---------------- | ------------------------------------------------------------------------------ |
| `shadcn`         | Direct port from shadcn/ui, adapted to our conventions                         |
| `shadcn-pattern` | shadcn documents a pattern/recipe for this but it's not a standalone component |
| `custom`         | No shadcn equivalent; built from scratch                                       |

### Project legend

**TM** = Task Manager, **CH** = Chess, **OR** = Orchestrator, **IE** = Iteration Engine, **SC** = Scheduler

---

## Phase 1 — Foundation

Core primitives and form controls that unblock nearly every other component and page.

### 1.1 Primitives

| #   | Component           | Source   | Radix Primitive         | Description                                                                              | Used By        |
| --- | ------------------- | -------- | ----------------------- | ---------------------------------------------------------------------------------------- | -------------- |
| 1   | **Button**          | `shadcn` | `react-slot`            | Action trigger with variant/size system                                                  | TM CH OR IE SC |
| 2   | **Separator**       | `shadcn` | `react-separator`       | Horizontal or vertical visual divider                                                    | TM CH OR IE SC |
| 3   | **Label**           | `shadcn` | `react-label`           | Accessible form label with `htmlFor` binding                                             | TM CH OR SC    |
| 4   | **Popover**         | `shadcn` | `react-popover`         | Floating content anchored to a trigger; foundation for DatePicker, ColorPicker, Combobox | TM OR SC       |
| 5   | **Collapsible**     | `shadcn` | `react-collapsible`     | Primitive expand/collapse toggle (simpler than Accordion)                                | OR IE          |
| 6   | **Visually Hidden** | `custom` | `react-visually-hidden` | Screen-reader-only content for icon buttons and drag handles                             | TM CH OR SC    |

### 1.2 Form Controls

| #   | Component        | Source   | Radix Primitive      | Description                                                                                    | Used By        |
| --- | ---------------- | -------- | -------------------- | ---------------------------------------------------------------------------------------------- | -------------- |
| 7   | **Input**        | `shadcn` | —                    | Text, email, password, number input with error/disabled states                                 | TM CH OR IE SC |
| 8   | **Textarea**     | `shadcn` | —                    | Multi-line text input with auto-resize option                                                  | TM OR IE SC    |
| 9   | **Select**       | `shadcn` | `react-select`       | Single-value dropdown with option groups                                                       | TM OR SC       |
| 10  | **Checkbox**     | `shadcn` | `react-checkbox`     | Checkable input with indeterminate state                                                       | TM SC          |
| 11  | **Switch**       | `shadcn` | `react-switch`       | Boolean on/off toggle for settings                                                             | OR IE SC       |
| 12  | **Radio Group**  | `shadcn` | `react-radio-group`  | Mutually exclusive option set                                                                  | CH SC          |
| 13  | **Toggle**       | `shadcn` | `react-toggle`       | Pressed/unpressed state button                                                                 | TM OR SC       |
| 14  | **Toggle Group** | `shadcn` | `react-toggle-group` | Group of toggles with single/multi selection                                                   | CH OR SC       |
| 15  | **Slider**       | `shadcn` | `react-slider`       | Range input for numeric values                                                                 | SC OR IE       |
| 16  | **Form**         | `shadcn` | —                    | Form wrapper integrating react-hook-form + zod validation with Label, Input, and error display | TM CH OR SC    |

### 1.3 Feedback

| #   | Component          | Source   | Radix Primitive      | Description                                                                         | Used By        |
| --- | ------------------ | -------- | -------------------- | ----------------------------------------------------------------------------------- | -------------- |
| 17  | **Dialog**         | `shadcn` | `react-dialog`       | Centered overlay with focus trap and backdrop                                       | TM CH OR IE SC |
| 18  | **Alert Dialog**   | `shadcn` | `react-alert-dialog` | Destructive-action confirmation with cancel/confirm                                 | TM CH OR SC    |
| 19  | **Sonner (Toast)** | `shadcn` | Sonner lib           | Non-blocking notification that auto-dismisses (shadcn uses Sonner, not Radix Toast) | CH OR SC       |
| 20  | **Alert**          | `shadcn` | —                    | Inline status message: info, success, warning, error with icon                      | TM CH OR IE SC |
| 21  | **Badge**          | `shadcn` | —                    | Small status/count label with color variants                                        | TM OR IE SC    |
| 22  | **Card**           | `shadcn` | —                    | Bordered container with Header, Content, Footer sub-components                      | TM CH OR IE SC |
| 23  | **Skeleton**       | `shadcn` | —                    | Placeholder loading shapes for content areas                                        | TM CH OR SC    |
| 24  | **Spinner**        | `custom` | —                    | Animated loading indicator in sm/md/lg sizes                                        | TM CH OR IE SC |

---

## Phase 2 — Layout

Application shell and structural navigation components.

| #   | Component       | Source   | Radix Primitive     | Description                                                                | Used By     |
| --- | --------------- | -------- | ------------------- | -------------------------------------------------------------------------- | ----------- |
| 25  | **Sheet**       | `shadcn` | `react-dialog`      | Slide-out panel from edge (left/right/top/bottom)                          | TM OR SC    |
| 26  | **Tabs**        | `shadcn` | `react-tabs`        | Tabbed content switcher                                                    | TM OR SC    |
| 27  | **Accordion**   | `shadcn` | `react-accordion`   | Multi-section collapsible (builds on Collapsible)                          | OR IE SC    |
| 28  | **Scroll Area** | `shadcn` | `react-scroll-area` | Custom scrollable region with styled scrollbar                             | TM CH OR SC |
| 29  | **Breadcrumb**  | `shadcn` | —                   | Hierarchical navigation path with separator                                | OR SC       |
| 30  | **Sidebar**     | `shadcn` | —                   | Collapsible vertical navigation panel (shadcn's sidebar component)         | TM OR IE SC |
| 31  | **Resizable**   | `shadcn` | —                   | Split-pane layout with drag-to-resize handle (uses react-resizable-panels) | CH OR TM    |
| 32  | **App Layout**  | `custom` | —                   | Shell composing Sidebar + Header + scrollable content area                 | TM OR IE SC |
| 33  | **Header**      | `custom` | —                   | Top bar with title slot, user info, and action buttons                     | TM CH OR SC |

---

## Phase 3 — Data Display

Components for presenting structured data and user identity.

| #   | Component        | Source   | Radix Primitive    | Description                                              | Used By     |
| --- | ---------------- | -------- | ------------------ | -------------------------------------------------------- | ----------- |
| 34  | **Table**        | `shadcn` | —                  | Styled table with header, body, row, cell sub-components | CH SC OR    |
| 35  | **Pagination**   | `shadcn` | —                  | Page navigation with prev/next and page numbers          | SC CH       |
| 36  | **Avatar**       | `shadcn` | `react-avatar`     | User image with initials fallback                        | TM CH OR SC |
| 37  | **Tooltip**      | `shadcn` | `react-tooltip`    | Hover hint anchored to a trigger element                 | OR IE SC    |
| 38  | **Hover Card**   | `shadcn` | `react-hover-card` | Rich preview on hover (user profiles, task summaries)    | TM SC       |
| 39  | **Progress**     | `shadcn` | `react-progress`   | Determinate bar for multi-step processes                 | OR IE SC    |
| 40  | **Avatar Group** | `custom` | —                  | Stacked overlapping avatars for multi-user display       | TM SC       |
| 41  | **Empty State**  | `custom` | —                  | Placeholder with icon, message, and CTA button           | TM OR SC    |
| 42  | **Search Input** | `custom` | —                  | Input with search icon and clear button                  | TM SC       |

---

## Phase 4 — Menus & Composed Inputs

Higher-level controls composed from Phase 1 primitives.

| #   | Component         | Source           | Radix Primitive       | Description                                                 | Used By     |
| --- | ----------------- | ---------------- | --------------------- | ----------------------------------------------------------- | ----------- |
| 43  | **Dropdown Menu** | `shadcn`         | `react-dropdown-menu` | Action menu triggered by button (edit, delete, etc.)        | TM CH OR SC |
| 44  | **Context Menu**  | `shadcn`         | `react-context-menu`  | Right-click action menu                                     | TM SC       |
| 45  | **Command**       | `shadcn`         | cmdk lib              | Command palette / searchable list (foundation for Combobox) | SC TM OR    |
| 46  | **Combobox**      | `shadcn-pattern` | Popover + Command     | Searchable select for large option lists                    | SC TM OR    |
| 47  | **Calendar**      | `shadcn`         | react-day-picker      | Standalone month grid component                             | SC TM       |
| 48  | **Date Picker**   | `shadcn-pattern` | Popover + Calendar    | Calendar-based date/range selector                          | TM SC       |
| 49  | **Time Picker**   | `custom`         | Popover               | HH:mm time input with dropdown                              | SC TM       |
| 50  | **Color Picker**  | `custom`         | Popover               | Palette + hex input for color selection                     | TM SC       |

---

## Phase 5 — Domain Patterns

Reusable patterns extracted from project-specific needs. No shadcn equivalents exist.

| #   | Component             | Source   | Description                                                | Used By  |
| --- | --------------------- | -------- | ---------------------------------------------------------- | -------- |
| 51  | **Stepper**           | `custom` | Vertical/horizontal step progress with status icons        | OR IE    |
| 52  | **Code Block**        | `custom` | Monospace content viewer with optional syntax highlighting | OR IE    |
| 53  | **Copy to Clipboard** | `custom` | Button that copies text with "Copied!" feedback            | CH OR IE |
| 54  | **Connection Status** | `custom` | Colored dot + label for WebSocket/live state               | CH OR    |
| 55  | **Timeline**          | `custom` | Vertical sequence of events with timestamps and status     | OR IE    |

---

## Status

| #     | Component                         | Status   |
| ----- | --------------------------------- | -------- |
| 1     | Button                            | **Done** |
| 2–24  | Phase 1 — Foundation              | Pending  |
| 25–33 | Phase 2 — Layout                  | Pending  |
| 34–42 | Phase 3 — Data Display            | Pending  |
| 43–50 | Phase 4 — Menus & Composed Inputs | Pending  |
| 51–55 | Phase 5 — Domain Patterns         | Pending  |
