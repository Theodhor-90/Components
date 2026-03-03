# Task 4: Command Component

## Objective

Implement the Command component as a shadcn/ui port wrapping the `cmdk` library (v1.x), following the 5-file component pattern. The component provides a filterable command palette with grouped items, keyboard navigation, and a dialog variant (`CommandDialog`) that composes the existing Dialog component from Milestone 1.

## Deliverables

### 5 Component Files

All files in `packages/ui/src/components/command/`:

1. **`command.tsx`** — Implementation wrapping `cmdk`. Named exports: `Command`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem`, `CommandSeparator`, `CommandShortcut`, `CommandDialog`. Key implementation details:
   - `Command` wraps `cmdk`'s `<Command>` root component
   - cmdk v1 sub-components (`Command.Input`, `Command.List`, etc.) are re-exported as flat named exports (`CommandInput`, `CommandList`, etc.) following shadcn/ui conventions
   - `CommandDialog` imports and composes `Dialog` and `DialogContent` from the existing dialog component (`packages/ui/src/components/dialog/`). Renders Command inside DialogContent, inheriting focus-trapping, ESC-to-close, and overlay behavior
   - `CommandInput` includes a search icon (lucide `Search`)
   - `CommandShortcut` is a styled `<span>` for right-aligned keyboard shortcut display
   - Each sub-component includes `data-slot` attribute, accepts `ref`, uses `cn()`

2. **`command.styles.ts`** — CVA definitions for:
   - `Command`: root container (rounded border, background)
   - `CommandInput`: search input with icon (border-bottom, padding)
   - `CommandList`: scrollable list area (max-height, overflow)
   - `CommandItem`: interactive item with selected state (cursor, hover/selected background)
   - `CommandGroup`: labeled group (padding, heading styles)
   - `CommandSeparator`: horizontal divider
   - `CommandShortcut`: right-aligned shortcut text (muted foreground, small text)

3. **`command.types.ts`** — Props types:
   - `CommandProps` extends `React.ComponentProps<typeof CommandPrimitive>`
   - `CommandDialogProps` extends `DialogProps` from the existing dialog component
   - Other sub-component props extend their cmdk counterparts

4. **`command.test.tsx`** — Tests covering:
   - Smoke render
   - Filtering items by typing in CommandInput
   - Keyboard navigation (arrow keys highlight items, Enter selects)
   - `CommandEmpty` shown when no items match the filter
   - `CommandGroup` rendering with label
   - `CommandDialog` opens and closes as a dialog (ESC to close)
   - `CommandSeparator` renders
   - `data-slot` presence on sub-components
   - vitest-axe accessibility assertions

5. **`command.stories.tsx`** — CSF3 stories with `tags: ['autodocs']`:
   - Default, WithGroups, WithShortcuts, Empty, InDialog, WithIcons

### Index Export

- Add all sub-components, types, and variant functions to `packages/ui/src/index.ts`

## Design Decisions

- `CommandDialog` composes existing Dialog/DialogContent rather than re-implementing dialog behavior (matches shadcn/ui approach)
- cmdk v1.x API is used; sub-components are re-exported as flat named exports
- Built-in cmdk filtering is used (no custom filter implementation needed)

## Dependencies

- **Task 1** (t01): `cmdk` must be installed
- **Milestone 1**: Dialog component (composed by CommandDialog)
- **Prior milestones**: `cn()` utility, OKLCH semantic tokens, test infrastructure, Storybook

## Verification

1. All tests in `command.test.tsx` pass via `pnpm test`
2. `pnpm typecheck` passes with no errors
3. Storybook renders all 6 stories correctly
4. Typing in CommandInput filters the visible items in real time
5. Arrow keys navigate between items, Enter selects, Escape closes CommandDialog
6. `CommandEmpty` displays when no items match the search query
7. `CommandDialog` correctly inherits Dialog's focus trapping and overlay
8. All sub-components are accessible via `import { Command, ... } from '@components/ui'`
9. vitest-axe reports no accessibility violations
