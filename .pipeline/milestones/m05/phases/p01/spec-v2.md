Now I have all the context. The feedback has a single issue: Design Decision #4 presents two mutually exclusive approaches for destructive menu item styling (data-attribute vs CVA variant prop) and needs to commit to one. The recommendation is to use a CVA `variant` prop with `"default" | "destructive"` values, matching the established library pattern.

# Phase 1: Menus — Detailed Specification

## Goal

Deliver three menu and command palette components — Dropdown Menu, Context Menu, and Command — that wrap Radix UI and cmdk primitives following the established shadcn/ui port approach with the 5-file component pattern, providing consumer apps with nested dropdown menus, right-click context menus, and a filterable command palette with dialog integration.

## Design Decisions

### 1. Shared Styling Across Dropdown Menu and Context Menu

Dropdown Menu and Context Menu share nearly identical visual styling (content panels, menu items, separators, labels, checkbox items, radio items, sub-menu triggers). Rather than duplicating CVA definitions, each component will define its own styles file independently to maintain the strict 5-file pattern, but both will use the same Tailwind utility classes and semantic tokens. This keeps each component self-contained while ensuring visual consistency.

**Rationale:** The 5-file pattern requires each component to own its styles. Introducing a shared styles module would break the convention and add coupling. The duplication is minimal (CVA config objects) and keeps each component independently comprehensible.

### 2. CommandDialog Composes Existing Dialog

The `CommandDialog` sub-component will import and compose the `Dialog` and `DialogContent` components from Milestone 1 rather than re-implementing dialog behavior. The Command component is rendered inside DialogContent, inheriting all focus-trapping, ESC-to-close, and overlay behavior.

**Rationale:** Avoids duplicating accessible dialog behavior. The shadcn/ui reference does the same — CommandDialog is a thin composition layer.

### 3. cmdk Version Selection

Use `cmdk` v1.x (latest stable). The v1 API uses `<Command>` as the root with `<Command.Input>`, `<Command.List>`, etc. Our wrapper will re-export these as flat named exports (`CommandInput`, `CommandList`, etc.) following shadcn/ui conventions.

**Rationale:** cmdk v1 is the version shadcn/ui targets. It provides built-in filtering, keyboard navigation, and accessibility out of the box.

### 4. Destructive Menu Item Styling via CVA Variant Prop

Menu items (`DropdownMenuItem`, `ContextMenuItem`) will support a `variant` prop with `"default" | "destructive"` values, managed through CVA. The `"default"` variant applies standard item styling. The `"destructive"` variant applies `text-destructive` color with `focus:bg-destructive/10 focus:text-destructive` for the focused state, using the semantic `destructive` token consistent with Button, Alert, and Badge destructive variants in the library. The CVA definition lives in each component's `.styles.ts` file. The `defaultVariants` sets `variant: "default"`.

Additionally, menu items support an `inset` boolean prop that adds left padding to align text with items that have icons, matching the shadcn/ui API.

**Rationale:** Using a CVA `variant` prop follows the established pattern across the library (Button, Alert, Badge all use CVA variant props for destructive styling). This keeps the API consistent and the styles co-located in the `.styles.ts` file where all other CVA definitions live.

### 5. Sub-component Export Strategy

All sub-components for each menu are exported as named exports from the main component file (`dropdown-menu.tsx`, `context-menu.tsx`, `command.tsx`). Types for each sub-component are co-exported. The CVA variants function is exported from the styles file.

**Rationale:** Matches the compound component pattern established by Dialog, Card, Accordion, and other existing components in the library.

## Tasks

### Task 1: Install Dependencies

**Deliverables:**

- Install `@radix-ui/react-dropdown-menu`, `@radix-ui/react-context-menu`, and `cmdk` as dependencies in `packages/ui/package.json`
- Run `pnpm install` to update the lockfile
- Verify all three packages resolve correctly with `pnpm ls` in the `packages/ui` directory

### Task 2: Dropdown Menu Component

**Deliverables:**

- `packages/ui/src/components/dropdown-menu/dropdown-menu.tsx` — Implementation wrapping `@radix-ui/react-dropdown-menu`. Exports: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioItem`, `DropdownMenuRadioGroup`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`, `DropdownMenuPortal`, `DropdownMenuShortcut`. Each sub-component includes `data-slot` attribute, accepts `ref` as prop (React 19), uses `cn()` for class merging, and supports `className` override.
- `packages/ui/src/components/dropdown-menu/dropdown-menu.styles.ts` — CVA definitions for `DropdownMenuContent` (positioning, background, border, shadow, animation), `DropdownMenuItem` (base styles + `variant: { default, destructive }` + `inset: { true, false }`), `DropdownMenuCheckboxItem`, `DropdownMenuRadioItem`, `DropdownMenuLabel` (base + `inset: { true, false }`), `DropdownMenuSeparator`, `DropdownMenuSubTrigger`.
- `packages/ui/src/components/dropdown-menu/dropdown-menu.types.ts` — Props types for all sub-components extending the corresponding Radix primitive props + CVA `VariantProps`.
- `packages/ui/src/components/dropdown-menu/dropdown-menu.test.tsx` — Tests covering: smoke render, opening on trigger click, item selection callback, checkbox item toggle, radio item group exclusivity, sub-menu opening on hover/keyboard, keyboard navigation (arrow keys, Enter, Escape), inset variant rendering, destructive variant rendering, `data-slot` presence, vitest-axe accessibility.
- `packages/ui/src/components/dropdown-menu/dropdown-menu.stories.tsx` — CSF3 stories with autodocs: Default, WithCheckboxItems, WithRadioGroup, WithSubMenu, WithShortcuts, WithInsetItems, Destructive.
- Export all sub-components, types, and variants from `packages/ui/src/index.ts`.

### Task 3: Context Menu Component

**Deliverables:**

- `packages/ui/src/components/context-menu/context-menu.tsx` — Implementation wrapping `@radix-ui/react-context-menu`. Exports: `ContextMenu`, `ContextMenuTrigger`, `ContextMenuContent`, `ContextMenuItem`, `ContextMenuCheckboxItem`, `ContextMenuRadioItem`, `ContextMenuRadioGroup`, `ContextMenuLabel`, `ContextMenuSeparator`, `ContextMenuSub`, `ContextMenuSubTrigger`, `ContextMenuSubContent`, `ContextMenuPortal`, `ContextMenuShortcut`. Same styling approach as Dropdown Menu but using the context-menu Radix primitive (right-click trigger).
- `packages/ui/src/components/context-menu/context-menu.styles.ts` — CVA definitions mirroring Dropdown Menu's visual styles, including `variant: { default, destructive }` and `inset: { true, false }` on `ContextMenuItem`.
- `packages/ui/src/components/context-menu/context-menu.types.ts` — Props types extending Radix context-menu primitive props.
- `packages/ui/src/components/context-menu/context-menu.test.tsx` — Tests covering: smoke render, opening on right-click (contextmenu event), item selection, checkbox/radio item behavior, sub-menu support, keyboard navigation, destructive variant rendering, `data-slot` presence, vitest-axe accessibility.
- `packages/ui/src/components/context-menu/context-menu.stories.tsx` — CSF3 stories with autodocs: Default, WithCheckboxItems, WithRadioGroup, WithSubMenu, WithShortcuts, WithInsetItems.
- Export all sub-components, types, and variants from `packages/ui/src/index.ts`.

### Task 4: Command Component

**Deliverables:**

- `packages/ui/src/components/command/command.tsx` — Implementation wrapping `cmdk`. Exports: `Command`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem`, `CommandSeparator`, `CommandShortcut`, `CommandDialog`. `CommandDialog` composes `Dialog` and `DialogContent` from the existing dialog component. Each sub-component includes `data-slot`, accepts `ref`, uses `cn()`.
- `packages/ui/src/components/command/command.styles.ts` — CVA definitions for `Command` (root container), `CommandInput` (search input with icon), `CommandList` (scrollable list area), `CommandItem` (interactive item with selected state), `CommandGroup` (labeled group), `CommandSeparator`, `CommandShortcut` (right-aligned shortcut text).
- `packages/ui/src/components/command/command.types.ts` — Props types. `CommandProps` extends `React.ComponentProps<typeof CommandPrimitive>`. `CommandDialogProps` extends `DialogProps`. Other sub-component props extend their cmdk counterparts.
- `packages/ui/src/components/command/command.test.tsx` — Tests covering: smoke render, filtering items by typing in input, keyboard navigation (arrow keys highlight items, Enter selects), CommandEmpty shown when no matches, CommandGroup labeling, CommandDialog opens/closes as dialog, CommandSeparator renders, `data-slot` presence, vitest-axe accessibility.
- `packages/ui/src/components/command/command.stories.tsx` — CSF3 stories with autodocs: Default, WithGroups, WithShortcuts, Empty, InDialog, WithIcons.
- Export all sub-components, types, and variants from `packages/ui/src/index.ts`.

### Task 5: Integration Verification

**Deliverables:**

- Run `pnpm typecheck` across the monorepo — zero errors
- Run `pnpm test` across the monorepo — all tests pass including new menu component tests
- Run `pnpm build` — successful build with all new components included in output
- Verify all new exports are accessible from `@components/ui` by checking the built output
- Verify Storybook renders all new stories with `pnpm storybook` (manual check or build)

## Exit Criteria

1. All 3 components (Dropdown Menu, Context Menu, Command) and their sub-components render correctly in Storybook with autodocs
2. `pnpm test` passes with zero failures, including vitest-axe accessibility assertions for all 3 components
3. `pnpm typecheck` passes with no TypeScript errors across the monorepo
4. Dropdown Menu opens on trigger click, supports nested sub-menus, checkbox items, radio items with group exclusivity, and keyboard navigation
5. Context Menu opens on right-click at cursor position and supports the same item types as Dropdown Menu
6. Command filters items in real time as the user types in CommandInput, supports arrow-key navigation with Enter to select, and Escape closes CommandDialog
7. CommandDialog correctly composes the existing Dialog component with focus trapping and overlay
8. `DropdownMenuItem` and `ContextMenuItem` support a `variant` prop with `"default" | "destructive"` values via CVA, where destructive items render with `text-destructive` styling
9. All sub-components include `data-slot` attributes following established naming convention
10. All components, sub-component types, and CVA variant functions are exported from `packages/ui/src/index.ts`

## Dependencies

### Prior Milestones (must be complete)

- **Milestone 1: Foundation** — Dialog component (composed by CommandDialog), Popover component (available but not directly used in this phase)
- **Milestone 2: Form Controls** — Not directly required for this phase
- **Milestone 3: Layout & Navigation** — Not required for this phase
- **Milestone 4: Data Display** — Not required for this phase

### Infrastructure (must exist)

- `packages/ui/src/lib/utils.ts` — `cn()` helper
- `packages/ui/styles/globals.css` — OKLCH semantic tokens
- Vitest + Testing Library + vitest-axe test infrastructure
- Storybook 8.5 with CSF3 and autodocs support

### External Libraries (to be installed in Task 1)

| Package                         | Used By                |
| ------------------------------- | ---------------------- |
| `@radix-ui/react-dropdown-menu` | Dropdown Menu          |
| `@radix-ui/react-context-menu`  | Context Menu           |
| `cmdk`                          | Command, CommandDialog |

## Artifacts

### Created

| Artifact                                                             | Description                                      |
| -------------------------------------------------------------------- | ------------------------------------------------ |
| `packages/ui/src/components/dropdown-menu/dropdown-menu.tsx`         | Dropdown Menu implementation (14 sub-components) |
| `packages/ui/src/components/dropdown-menu/dropdown-menu.styles.ts`   | CVA variant definitions                          |
| `packages/ui/src/components/dropdown-menu/dropdown-menu.types.ts`    | TypeScript prop types                            |
| `packages/ui/src/components/dropdown-menu/dropdown-menu.test.tsx`    | Test suite                                       |
| `packages/ui/src/components/dropdown-menu/dropdown-menu.stories.tsx` | Storybook stories                                |
| `packages/ui/src/components/context-menu/context-menu.tsx`           | Context Menu implementation (14 sub-components)  |
| `packages/ui/src/components/context-menu/context-menu.styles.ts`     | CVA variant definitions                          |
| `packages/ui/src/components/context-menu/context-menu.types.ts`      | TypeScript prop types                            |
| `packages/ui/src/components/context-menu/context-menu.test.tsx`      | Test suite                                       |
| `packages/ui/src/components/context-menu/context-menu.stories.tsx`   | Storybook stories                                |
| `packages/ui/src/components/command/command.tsx`                     | Command implementation (9 sub-components)        |
| `packages/ui/src/components/command/command.styles.ts`               | CVA variant definitions                          |
| `packages/ui/src/components/command/command.types.ts`                | TypeScript prop types                            |
| `packages/ui/src/components/command/command.test.tsx`                | Test suite                                       |
| `packages/ui/src/components/command/command.stories.tsx`             | Storybook stories                                |

### Modified

| Artifact                   | Change                                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------------------ |
| `packages/ui/package.json` | Add `@radix-ui/react-dropdown-menu`, `@radix-ui/react-context-menu`, `cmdk` to dependencies      |
| `packages/ui/src/index.ts` | Add exports for all Dropdown Menu, Context Menu, and Command sub-components, types, and variants |
| `pnpm-lock.yaml`           | Updated with new dependency resolutions                                                          |
