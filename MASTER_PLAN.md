# Master Plan — @components/ui

## 1. Product Overview

A shared React component library providing the full set of UI primitives, form controls, layout
components, and domain patterns needed across all Portfolio applications. The library follows
shadcn/ui architecture — each component is a direct port or adaptation of the shadcn/ui reference
implementation, built on Radix UI primitives with Tailwind CSS v4 styling and CVA variant management.

### Target Consumers

Five sibling applications consume this library:

- **Task Manager** — Kanban task board (React 19, Tailwind)
- **Chess** — Real-time multiplayer chess (React 19, Redux, inline styles migrating to Tailwind)
- **Orchestrator** — AI pipeline dashboard (React 18, Tailwind dark theme)
- **Iteration Engine** — CLI pipeline (no UI yet; future monitoring dashboard)
- **Scheduler** — Employee scheduling platform (planned; React, Tailwind, Redux)

### Core Principles

- **Port, don't invent.** Start from the shadcn/ui source for every component that has one. Adapt
  to our 5-file pattern and React 19 conventions, but preserve the same API surface and behavior.
- **Radix underneath.** Interactive components use Radix UI primitives for accessibility, focus
  management, and keyboard navigation out of the box.
- **Tailwind v4 + OKLCH tokens.** All styling uses Tailwind utility classes mapped to semantic CSS
  custom properties in OKLCH color space. No inline styles, no CSS modules.
- **Test everything.** Every component ships with Vitest tests including axe-core accessibility
  assertions and Storybook stories with autodocs.

---

## 2. Tech Stack

| Layer            | Technology                            | Notes                                               |
| ---------------- | ------------------------------------- | --------------------------------------------------- |
| Framework        | React 19                              | ref-as-prop, no forwardRef                          |
| Styling          | Tailwind CSS v4                       | `@tailwindcss/vite` plugin, `@theme inline` mapping |
| Tokens           | OKLCH CSS custom properties           | Light/dark via `.dark` class on `<html>`            |
| Variants         | class-variance-authority (CVA)        | Type-safe Tailwind variant management               |
| Primitives       | Radix UI                              | Accessible behavior for interactive components      |
| Composition      | `@radix-ui/react-slot`                | `asChild` prop pattern for polymorphic rendering    |
| Class merging    | clsx + tailwind-merge                 | Via `cn()` helper in `@components/utils`            |
| Toast            | Sonner                                | shadcn/ui's toast solution (not Radix Toast)        |
| Form validation  | react-hook-form + zod                 | shadcn/ui's Form pattern                            |
| Command palette  | cmdk                                  | shadcn/ui's Command component foundation            |
| Calendar         | react-day-picker                      | shadcn/ui's Calendar/DatePicker foundation          |
| Resizable panels | react-resizable-panels                | shadcn/ui's Resizable component foundation          |
| Testing          | Vitest + Testing Library + vitest-axe | Unit, interaction, and accessibility tests          |
| Documentation    | Storybook 8.5                         | CSF3 format with autodocs and theme switching       |
| Build            | TypeScript `tsc --build`              | Tree-shakeable ESM output                           |
| Monorepo         | Turborepo + pnpm 9                    | Build order: tokens → utils → hooks → ui            |
| Linting          | ESLint + Prettier                     | Shared config in `@components/eslint-config`        |
| Git hooks        | Husky + lint-staged                   | Pre-commit: ESLint fix + Prettier                   |

---

## 3. Architecture

### 3.1 Monorepo Structure

```
Components/
├── apps/
│   ├── docs/                    # Storybook documentation site
│   │   └── .storybook/         # Storybook config (imports globals.css, Tailwind vite plugin)
│   └── playground/              # Vite dev app for integration testing
├── packages/
│   ├── ui/                      # Core component library (@components/ui)
│   │   ├── src/
│   │   │   ├── components/      # One directory per component
│   │   │   │   └── button/      # Reference implementation (5 files)
│   │   │   ├── lib/
│   │   │   │   └── utils.ts     # cn() helper (re-exports from @components/utils)
│   │   │   └── index.ts         # Public API — explicit named exports
│   │   └── styles/
│   │       └── globals.css      # Tailwind v4 theme + OKLCH CSS custom properties
│   ├── tokens/                  # Design tokens (@components/tokens)
│   │   └── tokens/
│   │       ├── primitive/       # colors.json, spacing.json, radius.json, typography.json
│   │       └── semantic/        # light.json, dark.json
│   ├── hooks/                   # Shared React hooks (@components/hooks)
│   │   └── src/
│   │       ├── use-controllable-state.ts
│   │       └── use-media-query.ts
│   ├── utils/                   # Shared utilities (@components/utils)
│   │   └── src/
│   │       └── cn.ts            # clsx + tailwind-merge
│   ├── tsconfig/                # Shared TypeScript configs
│   └── eslint-config/           # Shared ESLint flat config
├── package.json                 # Root workspace config (pnpm + Turbo)
└── MASTER_PLAN.md               # This file
```

### 3.2 Component File Pattern

Every component lives in its own directory under `packages/ui/src/components/{name}/` and consists
of exactly 5 files:

| File                 | Purpose                                                                     |
| -------------------- | --------------------------------------------------------------------------- |
| `{name}.tsx`         | Implementation: Radix primitive + Slot/asChild + `data-slot` + `cn()`       |
| `{name}.styles.ts`   | CVA variant definitions with `defaultVariants`                              |
| `{name}.types.ts`    | Props extending `React.ComponentProps<'element'>` + CVA `VariantProps`      |
| `{name}.test.tsx`    | Vitest + Testing Library + vitest-axe (smoke, variants, interactions, a11y) |
| `{name}.stories.tsx` | Storybook CSF3 with `tags: ['autodocs']`, one story per variant/size        |

The Button component (`src/components/button/`) is the canonical reference. Study all 5 files
before creating any new component.

### 3.3 Component Implementation Rules

- Extend `React.ComponentProps<'element'>` for props (includes `ref` in React 19)
- Use `asChild` + Radix `Slot` for polymorphic rendering on leaf components
- Include `data-slot="{name}"` on the root element
- Use `cn()` to merge className with CVA variants
- Support both controlled and uncontrolled modes for stateful components
- Use `import type` for type-only imports
- Named exports only — no default exports

### 3.4 Compound Components

Components with multiple parts (Dialog, Card, Table, etc.) export sub-components as named exports
from the same file. For example, Card exports `Card`, `CardHeader`, `CardContent`, `CardFooter`,
`CardTitle`, `CardDescription`. Each sub-component gets its own `data-slot` value.

### 3.5 Public API

Every component and its types are re-exported from `packages/ui/src/index.ts`. CVA variant
functions (e.g., `buttonVariants`) are also exported so consumers can compose variants.

### 3.6 shadcn/ui Adaptation Approach

For each component that exists in shadcn/ui:

1. Read the shadcn/ui source at `https://ui.shadcn.com/docs/components/{name}`
2. Port the implementation, preserving the component API (props, sub-components, behavior)
3. Adapt to our conventions: 5-file split, React 19 ref-as-prop, OKLCH tokens, vitest-axe tests
4. Add Storybook stories covering all variants and interaction states

For components that have no shadcn equivalent (marked "custom" in the roadmap), design the API
to feel consistent with the rest of the library.

---

## 4. Theme System

### 4.1 CSS Custom Properties

Defined in `packages/ui/styles/globals.css`. Light theme on `:root`, dark theme on `.dark`.
All colors use OKLCH color space.

**Semantic tokens available:**

| Token                                        | Tailwind class                                  | Usage                            |
| -------------------------------------------- | ----------------------------------------------- | -------------------------------- |
| `--background` / `--foreground`              | `bg-background`, `text-foreground`              | Page background and default text |
| `--card` / `--card-foreground`               | `bg-card`, `text-card-foreground`               | Card surfaces                    |
| `--popover` / `--popover-foreground`         | `bg-popover`, `text-popover-foreground`         | Popover/dropdown surfaces        |
| `--primary` / `--primary-foreground`         | `bg-primary`, `text-primary-foreground`         | Primary actions                  |
| `--secondary` / `--secondary-foreground`     | `bg-secondary`, `text-secondary-foreground`     | Secondary actions                |
| `--muted` / `--muted-foreground`             | `bg-muted`, `text-muted-foreground`             | Disabled / helper text           |
| `--accent` / `--accent-foreground`           | `bg-accent`, `text-accent-foreground`           | Hover highlights                 |
| `--destructive` / `--destructive-foreground` | `bg-destructive`, `text-destructive-foreground` | Danger/delete                    |
| `--border`                                   | `border-border`                                 | Default borders                  |
| `--input`                                    | `border-input`                                  | Form input borders               |
| `--ring`                                     | `ring-ring`                                     | Focus rings                      |
| `--sidebar-*`                                | `bg-sidebar-*`                                  | Sidebar-specific tokens          |

### 4.2 Radius Scale

Derived from `--radius: 0.625rem`:

| Token         | Tailwind     | Value                       |
| ------------- | ------------ | --------------------------- |
| `--radius-sm` | `rounded-sm` | `calc(var(--radius) - 4px)` |
| `--radius-md` | `rounded-md` | `calc(var(--radius) - 2px)` |
| `--radius-lg` | `rounded-lg` | `var(--radius)`             |
| `--radius-xl` | `rounded-xl` | `calc(var(--radius) + 4px)` |

---

## 5. Component Inventory

55 components organized by implementation phase. Source indicates whether the component is a
direct shadcn/ui port (`shadcn`), a shadcn-documented pattern (`shadcn-pattern`), or has no
shadcn equivalent (`custom`).

See `packages/ui/COMPONENT_ROADMAP.md` for the full table with per-project usage mapping.

### Summary by Source

- **39 components** — direct shadcn/ui ports
- **2 components** — shadcn-pattern (Combobox, Date Picker)
- **14 components** — custom (Spinner, Visually Hidden, App Layout, Header, Avatar Group,
  Empty State, Search Input, Time Picker, Color Picker, Stepper, Code Block, Copy to Clipboard,
  Connection Status, Timeline)

---

## 6. Milestones

### Milestone 1: Foundation — Primitives & Feedback

**Goal**: Deliver the core building blocks that every other component and every consumer app
depends on. After this milestone, apps can build basic pages with cards, badges, alerts, dialogs,
toasts, and popovers.

**Phases**:

1. **Display Primitives** — Separator (shadcn port), Badge (shadcn port with default/secondary/
   destructive/outline variants), Card with sub-components CardHeader, CardContent, CardFooter,
   CardTitle, CardDescription (shadcn port), Skeleton (shadcn port, `animate-pulse` div), Spinner
   (custom, animated SVG in sm/md/lg sizes), Alert with AlertTitle and AlertDescription (shadcn
   port with default/destructive variants).
2. **Overlay Primitives** — Dialog with DialogTrigger, DialogContent, DialogHeader, DialogFooter,
   DialogTitle, DialogDescription, DialogClose (shadcn port wrapping `@radix-ui/react-dialog`),
   Alert Dialog with matching sub-components (shadcn port wrapping `@radix-ui/react-alert-dialog`),
   Popover with PopoverTrigger and PopoverContent (shadcn port wrapping `@radix-ui/react-popover`),
   Sonner toast integration (shadcn port wrapping `sonner` library, theme-aware styling).
3. **Accessibility Primitives** — Label (shadcn port wrapping `@radix-ui/react-label`), Visually
   Hidden (custom utility wrapping `@radix-ui/react-visually-hidden`), Collapsible with
   CollapsibleTrigger and CollapsibleContent (shadcn port wrapping `@radix-ui/react-collapsible`).

**Exit Criteria**:

1. All 13 components render correctly in Storybook with all variants documented
2. `pnpm test` passes with vitest-axe accessibility assertions for every component
3. `pnpm typecheck` passes with no errors
4. Dialog and Alert Dialog correctly trap focus and support ESC to close
5. Popover positions content relative to its trigger and closes on outside click
6. Sonner toast renders with theme-appropriate colors in both light and dark mode
7. All components are exported from `packages/ui/src/index.ts`

### Milestone 2: Form Controls

**Goal**: Deliver all form input components so consumer apps can build complete, accessible,
validated forms. After this milestone, apps can build login forms, settings pages, and filter
interfaces.

**Phases**:

1. **Text Inputs** — Input (shadcn port, styled `<input>` supporting all HTML input types with
   error state via `aria-invalid`), Textarea (shadcn port, styled `<textarea>` with optional
   auto-resize behavior).
2. **Selection Controls** — Checkbox (shadcn port wrapping `@radix-ui/react-checkbox` with
   indeterminate state), Switch (shadcn port wrapping `@radix-ui/react-switch`), Radio Group
   with RadioGroupItem (shadcn port wrapping `@radix-ui/react-radio-group`), Toggle (shadcn port
   wrapping `@radix-ui/react-toggle` with default/outline variants), Toggle Group with
   ToggleGroupItem (shadcn port wrapping `@radix-ui/react-toggle-group` with single/multiple
   selection modes), Select with SelectTrigger, SelectContent, SelectItem, SelectGroup,
   SelectLabel, SelectSeparator (shadcn port wrapping `@radix-ui/react-select`).
3. **Range & Form** — Slider (shadcn port wrapping `@radix-ui/react-slider` with single and range
   modes), Form with FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage
   (shadcn port composing react-hook-form `Controller` + `@radix-ui/react-label` + zod validation;
   provides form context for error message display and `aria-describedby` linking).

**Exit Criteria**:

1. All 11 components render correctly in Storybook with all variants and states documented
2. `pnpm test` passes with vitest-axe accessibility assertions for every component
3. `pnpm typecheck` passes with no errors
4. Input and Textarea support controlled and uncontrolled usage
5. Checkbox supports checked, unchecked, and indeterminate states
6. Select opens on click and keyboard, supports option groups, and closes on selection
7. Toggle Group enforces single or multiple selection based on `type` prop
8. Form component correctly displays validation errors from zod schemas and links error
   messages to inputs via `aria-describedby`
9. All components use semantic tokens (`border-input`, `ring-ring`, `bg-background`, etc.)
10. All components are exported from `packages/ui/src/index.ts`

### Milestone 3: Layout & Navigation

**Goal**: Deliver the structural components for building full application shells with navigation,
collapsible panels, and responsive layouts. After this milestone, consumer apps can assemble
complete page layouts.

**Phases**:

1. **Content Containers** — Sheet with SheetTrigger, SheetContent, SheetHeader, SheetFooter,
   SheetTitle, SheetDescription, SheetClose (shadcn port using `@radix-ui/react-dialog` with
   side variants: top/right/bottom/left), Tabs with TabsList, TabsTrigger, TabsContent (shadcn
   port wrapping `@radix-ui/react-tabs`), Accordion with AccordionItem, AccordionTrigger,
   AccordionContent (shadcn port wrapping `@radix-ui/react-accordion` with single/multiple
   modes and animated open/close), Scroll Area with ScrollBar (shadcn port wrapping
   `@radix-ui/react-scroll-area` with vertical and horizontal scrollbar variants).
2. **Navigation** — Breadcrumb with BreadcrumbList, BreadcrumbItem, BreadcrumbLink,
   BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis (shadcn port), Sidebar with
   SidebarProvider, SidebarTrigger, SidebarContent, SidebarGroup, SidebarGroupLabel,
   SidebarMenu, SidebarMenuItem, SidebarMenuButton (shadcn port with collapsible behavior
   using `sidebar-*` tokens), Resizable with ResizablePanelGroup, ResizablePanel,
   ResizableHandle (shadcn port wrapping `react-resizable-panels`).
3. **Application Shell** — App Layout (custom, composes Sidebar + Header + scrollable content
   area with responsive behavior), Header (custom, top bar with title slot, user info area,
   and action button slots).

**Exit Criteria**:

1. All 9 components render correctly in Storybook with all variants documented
2. `pnpm test` passes with vitest-axe accessibility assertions for every component
3. `pnpm typecheck` passes with no errors
4. Sheet slides in from the correct edge based on `side` prop
5. Accordion animates open/close and supports single and multiple open sections
6. Scroll Area renders custom scrollbars that match the theme
7. Sidebar collapses and expands with keyboard shortcut support
8. Resizable panels support drag-to-resize with keyboard fallback
9. App Layout renders sidebar, header, and content in the correct positions
10. All components are exported from `packages/ui/src/index.ts`

### Milestone 4: Data Display

**Goal**: Deliver components for presenting tabular data, user identity, inline hints, and
empty/loading states. After this milestone, consumer apps can build data-rich pages.

**Phases**:

1. **Tables & Pagination** — Table with TableHeader, TableBody, TableRow, TableHead, TableCell,
   TableCaption, TableFooter (shadcn port, styled native `<table>` elements), Pagination with
   PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext,
   PaginationEllipsis (shadcn port, nav element with button links).
2. **Identity & Hints** — Avatar with AvatarImage and AvatarFallback (shadcn port wrapping
   `@radix-ui/react-avatar` with image loading fallback to initials), Avatar Group (custom,
   stacked overlapping Avatars with configurable max visible and `+N` overflow indicator),
   Tooltip with TooltipTrigger, TooltipContent, TooltipProvider (shadcn port wrapping
   `@radix-ui/react-tooltip`), Hover Card with HoverCardTrigger and HoverCardContent (shadcn
   port wrapping `@radix-ui/react-hover-card`), Progress (shadcn port wrapping
   `@radix-ui/react-progress` with animated fill).
3. **States & Search** — Empty State (custom, centered layout with icon slot, title, description,
   and optional CTA button), Search Input (custom, Input variant with search icon prefix and
   clear button suffix; emits `onSearch` on Enter and `onClear` on clear).

**Exit Criteria**:

1. All 10 components render correctly in Storybook with all variants documented
2. `pnpm test` passes with vitest-axe accessibility assertions for every component
3. `pnpm typecheck` passes with no errors
4. Table renders accessible `<table>` markup with proper `<thead>`/`<tbody>` structure
5. Avatar falls back to initials when image fails to load
6. Avatar Group correctly stacks avatars and shows overflow count
7. Tooltip appears on hover/focus with configurable delay
8. Progress bar animates from 0 to the given value
9. Search Input clears value and refocuses on clear button click
10. All components are exported from `packages/ui/src/index.ts`

### Milestone 5: Menus & Composed Inputs

**Goal**: Deliver action menus and higher-level composed input controls that build on Popover,
Command, and Calendar primitives. After this milestone, consumer apps can build dropdown menus,
searchable selects, and date/time/color pickers.

**Phases**:

1. **Menus** — Dropdown Menu with DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
   DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuRadioGroup, DropdownMenuLabel,
   DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent
   (shadcn port wrapping `@radix-ui/react-dropdown-menu`), Context Menu with matching
   sub-components (shadcn port wrapping `@radix-ui/react-context-menu`), Command with
   CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator,
   CommandDialog (shadcn port wrapping `cmdk` library).
2. **Calendar & Date Pickers** — Calendar (shadcn port wrapping `react-day-picker` with
   single/range/multiple selection modes, theme-integrated styling), Date Picker (shadcn-pattern
   composing Popover + Calendar + Button trigger with formatted date display), Time Picker
   (custom, Popover with hour/minute select inputs in HH:mm format, keyboard navigation).
3. **Combobox & Color Picker** — Combobox (shadcn-pattern composing Popover + Command for
   searchable single/multi select with create option support), Color Picker (custom, Popover
   with color palette grid + hex input + preview swatch).

**Exit Criteria**:

1. All 10 components render correctly in Storybook with all variants documented
2. `pnpm test` passes with vitest-axe accessibility assertions for every component
3. `pnpm typecheck` passes with no errors
4. Dropdown Menu supports nested sub-menus, checkbox items, and radio items
5. Context Menu opens on right-click with correct positioning
6. Command supports keyboard navigation (arrow keys, Enter, Escape) and filtering
7. Calendar supports single date, date range, and multiple date selection
8. Date Picker displays selected date in trigger and opens calendar popover
9. Combobox filters options as user types and supports both single and multi selection
10. Color Picker updates preview swatch in real time as hex value changes
11. All components are exported from `packages/ui/src/index.ts`

### Milestone 6: Domain Patterns

**Goal**: Deliver reusable patterns extracted from sibling project needs that don't exist in
shadcn/ui. After this milestone, the component library covers all identified UI patterns across
the five consumer applications.

**Phases**:

1. **Process Visualization** — Stepper with StepperItem (custom, vertical or horizontal step
   progress with pending/active/completed/error status icons, connecting lines, and optional
   description per step), Timeline with TimelineItem (custom, vertical sequence of events with
   timestamp, status dot, title, and optional content body).
2. **Developer Utilities** — Code Block (custom, `<pre>` + `<code>` wrapper with monospace
   font, optional line numbers, copy-to-clipboard button, and theme-aware background), Copy to
   Clipboard (custom, button that writes text to clipboard and shows "Copied!" feedback for 2
   seconds with checkmark icon swap), Connection Status (custom, colored status dot + text label
   with connected/connecting/disconnected states; green/yellow/red color coding).

**Exit Criteria**:

1. All 5 components render correctly in Storybook with all variants documented
2. `pnpm test` passes with vitest-axe accessibility assertions for every component
3. `pnpm typecheck` passes with no errors
4. Stepper correctly renders horizontal and vertical orientations with all status states
5. Timeline renders items in chronological order with connected status dots
6. Code Block copies content to clipboard on button click
7. Copy to Clipboard shows transient "Copied!" feedback that resets after timeout
8. Connection Status displays correct color for each state
9. All components are exported from `packages/ui/src/index.ts`

---

## 7. Conventions

### 7.1 Code Style

- TypeScript strict mode everywhere
- ES modules (import/export, no require)
- Functional components with hooks (no class components)
- Named exports only (no default exports)
- No barrel files within packages
- `import type` for type-only imports
- React 19 ref-as-prop — never use `forwardRef`
- No `any` type — use `unknown` and narrow

### 7.2 Naming

- Files: kebab-case (`alert-dialog.tsx`, `scroll-area.styles.ts`)
- Components: PascalCase (`AlertDialog`, `ScrollArea`)
- Types: PascalCase with Props suffix (`AlertDialogProps`)
- CVA exports: camelCase with Variants suffix (`alertDialogVariants`)
- Directories: kebab-case matching the component name (`alert-dialog/`)
- Data attributes: kebab-case (`data-slot="alert-dialog"`)

### 7.3 Testing

- Every component has a co-located `.test.tsx` file
- Required test categories: smoke render, variant rendering, user interactions, keyboard
  navigation, asChild composition, accessibility (vitest-axe)
- Use `@testing-library/user-event` for interaction tests (not `fireEvent`)
- Run with `pnpm test` (Vitest)

### 7.4 Stories

- CSF3 format with `Meta` and `StoryObj` types
- Always include `tags: ['autodocs']` in meta
- One story per variant, one per size, plus disabled and asChild stories
- Stories file is the interactive documentation — cover edge cases
- Run with `pnpm storybook`

### 7.5 Dependencies

- Radix UI primitives: add per-component as needed (e.g., `@radix-ui/react-dialog`)
- Third-party libraries (sonner, cmdk, react-day-picker, react-resizable-panels, react-hook-form,
  zod): add only when the component that requires them is implemented
- All runtime dependencies go in `packages/ui/package.json` under `dependencies`
- React 19 remains a `peerDependency`

### 7.6 Exports

- Every new component must be added to `packages/ui/src/index.ts`
- Export the component function(s), props type(s), and CVA variants function
- Follow existing pattern: `export { Component, type ComponentProps } from './components/{name}/{name}.js'`
