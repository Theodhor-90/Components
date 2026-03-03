Now I have all the context I need. Let me produce the complete, standalone plan document.

# Task 4: Command Component — Implementation Plan

## 1. Overview

Implement the Command component as a shadcn/ui port wrapping `cmdk` v1.x, following the 5-file component pattern. The component provides a filterable command palette with grouped items, keyboard navigation, and a `CommandDialog` variant that composes the existing Dialog component from Milestone 1. This is the third and final component of Phase 1 (Menus).

## 2. Dependencies

### Already Available

- `cmdk` v1.1.1 — installed in Task t01
- `Dialog`, `DialogContent` — from `packages/ui/src/components/dialog/` (Milestone 1)
- `cn()` utility — from `packages/ui/src/lib/utils.js`
- `class-variance-authority` — installed in project setup
- Vitest + Testing Library + vitest-axe — test infrastructure
- Storybook 8.5 — documentation infrastructure

### Prior Sibling Tasks (completed)

- **t01**: `cmdk` dependency installed
- **t02**: Dropdown Menu component (establishes menu component patterns)
- **t03**: Context Menu component (mirrors Dropdown Menu patterns)

## 3. File Manifest

All files in `packages/ui/src/components/command/`:

| File | Purpose |
| --- | --- |
| `command.types.ts` | TypeScript prop types for all 9 sub-components |
| `command.styles.ts` | Style constants and CVA definitions for all styled sub-components |
| `command.tsx` | Implementation wrapping `cmdk` — exports 9 named sub-components plus re-exports of all types |
| `command.test.tsx` | Vitest + Testing Library + vitest-axe test suite |
| `command.stories.tsx` | Storybook CSF3 stories with autodocs |

### Modified Files

| File | Change |
| --- | --- |
| `packages/ui/src/index.ts` | Add exports for all Command sub-components, types, and style exports |

## 4. Design Decisions

### 4.1 cmdk v1 Sub-component Re-export Strategy

cmdk v1 exposes sub-components as properties on the `Command` root (e.g., `Command.Input`, `Command.List`). Following the shadcn/ui convention, we re-export these as flat named exports: `CommandInput`, `CommandList`, etc. Each wrapper adds `data-slot`, `ref` forwarding, and `cn()` class merging.

### 4.2 CommandDialog Composes Existing Dialog

`CommandDialog` imports `Dialog` and `DialogContent` from `../dialog/dialog.js` and renders Command inside DialogContent. This reuses all accessible dialog behavior (focus trapping, ESC-to-close, overlay). The close button from `DialogContent` is not rendered inside `CommandDialog` — instead, we render a custom `DialogContent` without the default close button by using `DialogPrimitive.Content` directly with `DialogOverlay`, matching the shadcn/ui approach where CommandDialog uses a simplified dialog layout. However, to maintain consistency with our existing Dialog component and avoid re-implementing overlay logic, we will import `Dialog` (Root) from the dialog component and compose `DialogPrimitive.Content` with `DialogOverlay` from the dialog component to avoid the close button that `DialogContent` automatically adds.

**Revised approach**: `CommandDialog` will import `Dialog` and `DialogContent` from the existing dialog component. The `DialogContent` includes a close button, which is acceptable and consistent with dialog behavior. The `Command` component rendered inside will have a custom class that removes the default padding and gap from `DialogContent` via the `className` prop override. This is simpler and reuses the existing dialog component directly.

### 4.3 Search Icon as Inline SVG

`CommandInput` renders a search/magnifying-glass icon to the left of the input field. Following the project convention (seen in dropdown-menu.tsx which uses inline SVGs for check, radio dot, and chevron icons), we use an inline SVG rather than importing from a third-party icon library.

### 4.4 Styles Approach

Most sub-components use plain string style constants (not CVA) because they have no variants. The exception would be `CommandItem` if it needed variants, but per the shadcn/ui reference, Command sub-components do not have variant props. All styles are plain string constants exported from `command.styles.ts`.

## 5. File-by-File Specification

### 5.1 `command.types.ts`

```typescript
import type { Command as CommandPrimitive } from 'cmdk';

import type { DialogProps } from '../dialog/dialog.js';

export type CommandProps = React.ComponentProps<typeof CommandPrimitive>;

export type CommandDialogProps = DialogProps;

export type CommandInputProps = React.ComponentProps<typeof CommandPrimitive.Input>;

export type CommandListProps = React.ComponentProps<typeof CommandPrimitive.List>;

export type CommandEmptyProps = React.ComponentProps<typeof CommandPrimitive.Empty>;

export type CommandGroupProps = React.ComponentProps<typeof CommandPrimitive.Group>;

export type CommandItemProps = React.ComponentProps<typeof CommandPrimitive.Item>;

export type CommandSeparatorProps = React.ComponentProps<typeof CommandPrimitive.Separator>;

export type CommandShortcutProps = React.ComponentProps<'span'>;
```

**Key details:**
- `CommandProps` extends `React.ComponentProps<typeof CommandPrimitive>` — the cmdk root component
- `CommandDialogProps` extends `DialogProps` from the existing dialog component (which is `React.ComponentProps<typeof DialogPrimitive.Root>`) — this passes through `open`, `onOpenChange`, and other Dialog root props
- `CommandInputProps`, `CommandListProps`, `CommandEmptyProps`, `CommandGroupProps`, `CommandItemProps`, `CommandSeparatorProps` each extend `React.ComponentProps` of their corresponding cmdk sub-component
- `CommandShortcutProps` extends `React.ComponentProps<'span'>` — this is a simple styled span, not a cmdk primitive

### 5.2 `command.styles.ts`

```typescript
export const commandStyles =
  'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground';

export const commandInputWrapperStyles =
  'flex items-center border-b px-3';

export const commandInputIconStyles =
  'mr-2 h-4 w-4 shrink-0 opacity-50';

export const commandInputStyles =
  'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50';

export const commandListStyles =
  'max-h-[300px] overflow-y-auto overflow-x-hidden';

export const commandEmptyStyles =
  'py-6 text-center text-sm';

export const commandGroupStyles =
  'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground';

export const commandItemStyles =
  'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0';

export const commandSeparatorStyles =
  '-mx-1 h-px bg-border';

export const commandShortcutStyles =
  'ml-auto text-xs tracking-widest text-muted-foreground';

export const commandDialogContentStyles =
  'overflow-hidden p-0';

export const commandDialogCommandStyles =
  '[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5';
```

**Key details:**
- All exports are plain string constants — no CVA is needed since Command sub-components have no variant props
- `commandStyles`: root container with `bg-popover` and `text-popover-foreground` semantic tokens
- `commandInputStyles`: transparent background input, inherits popover text color
- `commandItemStyles`: uses `data-[selected=true]` and `data-[disabled=true]` attribute selectors (cmdk uses data attributes for state)
- `commandGroupStyles`: styles the group heading via `[cmdk-group-heading]` attribute selector
- `commandDialogContentStyles`: overrides DialogContent default padding to `p-0`
- `commandDialogCommandStyles`: adjusts sizing for the dialog variant (larger input, larger items)

### 5.3 `command.tsx`

```typescript
import { Command as CommandPrimitive } from 'cmdk';

import { cn } from '../../lib/utils.js';
import { Dialog, DialogContent } from '../dialog/dialog.js';
import {
  commandDialogCommandStyles,
  commandDialogContentStyles,
  commandEmptyStyles,
  commandGroupStyles,
  commandInputIconStyles,
  commandInputStyles,
  commandInputWrapperStyles,
  commandItemStyles,
  commandListStyles,
  commandSeparatorStyles,
  commandShortcutStyles,
  commandStyles,
} from './command.styles.js';
import type {
  CommandDialogProps,
  CommandEmptyProps,
  CommandGroupProps,
  CommandInputProps,
  CommandItemProps,
  CommandListProps,
  CommandSeparatorProps,
  CommandShortcutProps,
} from './command.types.js';

export type {
  CommandDialogProps,
  CommandEmptyProps,
  CommandGroupProps,
  CommandInputProps,
  CommandItemProps,
  CommandListProps,
  CommandProps,
  CommandSeparatorProps,
  CommandShortcutProps,
} from './command.types.js';

function Command({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>): React.JSX.Element {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(commandStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

function CommandDialog({
  children,
  ...props
}: CommandDialogProps): React.JSX.Element {
  return (
    <Dialog {...props}>
      <DialogContent className={commandDialogContentStyles}>
        <Command className={commandDialogCommandStyles}>
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({
  className,
  ref,
  ...props
}: CommandInputProps): React.JSX.Element {
  return (
    <div data-slot="command-input-wrapper" className={commandInputWrapperStyles} cmdk-input-wrapper="">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        className={commandInputIconStyles}
      >
        <path
          d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(commandInputStyles, className)}
        ref={ref}
        {...props}
      />
    </div>
  );
}

function CommandList({
  className,
  ref,
  ...props
}: CommandListProps): React.JSX.Element {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(commandListStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

function CommandEmpty({
  className,
  ref,
  ...props
}: CommandEmptyProps): React.JSX.Element {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn(commandEmptyStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ref,
  ...props
}: CommandGroupProps): React.JSX.Element {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(commandGroupStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

function CommandItem({
  className,
  ref,
  ...props
}: CommandItemProps): React.JSX.Element {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(commandItemStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

function CommandSeparator({
  className,
  ref,
  ...props
}: CommandSeparatorProps): React.JSX.Element {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn(commandSeparatorStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

function CommandShortcut({
  className,
  ref,
  ...props
}: CommandShortcutProps): React.JSX.Element {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(commandShortcutStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
```

**Key implementation details:**

- **`Command`**: Wraps `CommandPrimitive` (cmdk root). Applies `commandStyles` for container styling. Includes `data-slot="command"`.
- **`CommandDialog`**: Composes `Dialog` (root) and `DialogContent` from the existing dialog component. Passes all `DialogProps` through to `Dialog`. Renders `Command` inside `DialogContent`. Uses `commandDialogContentStyles` to override `DialogContent` padding to `p-0`. Uses `commandDialogCommandStyles` to adjust item/input sizing for the larger dialog context. The `DialogContent` close button is inherited — consistent with standard dialog behavior.
- **`CommandInput`**: Wraps `CommandPrimitive.Input` inside a wrapper div with a search icon SVG. The wrapper div has `cmdk-input-wrapper=""` attribute for targeting in `commandDialogCommandStyles`. Search icon is an inline SVG (magnifying glass from Radix Icons).
- **`CommandList`**: Wraps `CommandPrimitive.List` with max-height and overflow scrolling.
- **`CommandEmpty`**: Wraps `CommandPrimitive.Empty` — displayed when no items match the filter.
- **`CommandGroup`**: Wraps `CommandPrimitive.Group` — renders a labeled group with heading styles via `[cmdk-group-heading]` selector.
- **`CommandItem`**: Wraps `CommandPrimitive.Item` — interactive item with selected/disabled states using data attributes.
- **`CommandSeparator`**: Wraps `CommandPrimitive.Separator` — horizontal divider between groups.
- **`CommandShortcut`**: Plain `<span>` (not a cmdk primitive) for right-aligned keyboard shortcut text within items.
- All sub-components accept `ref` as a prop (React 19 ref-as-prop pattern — no `forwardRef`).
- All sub-components use `cn()` to merge default styles with consumer `className` overrides.
- All sub-components include `data-slot` attributes.
- Named exports only — no default exports.

### 5.4 `command.test.tsx`

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './command.js';
```

**Test cases (13 tests):**

1. **Smoke render** — renders Command with input, list, group, and items without crashing
2. **Filters items by typing** — type text in CommandInput, verify matching items remain visible and non-matching items are hidden
3. **Keyboard navigation: arrow keys** — arrow down/up highlights items, verify focus/selection moves between items
4. **Keyboard navigation: Enter selects** — press Enter on a highlighted item, verify `onSelect` callback fires
5. **CommandEmpty shown when no matches** — type a query that matches no items, verify CommandEmpty content is displayed
6. **CommandGroup renders with heading label** — render a group with `heading` prop, verify the heading text is in the document
7. **CommandSeparator renders** — render a separator between groups, verify separator element exists via `data-slot="command-separator"`
8. **CommandShortcut renders** — render a shortcut inside an item, verify shortcut text is visible
9. **CommandDialog opens and closes** — render CommandDialog with `open={true}`, verify dialog content is visible; change to `open={false}`, verify it is removed
10. **CommandDialog closes on Escape** — render open CommandDialog, press Escape, verify `onOpenChange` is called with `false`
11. **data-slot presence** — verify `data-slot` attributes on: `command`, `command-input`, `command-list`, `command-group`, `command-item`, `command-empty`, `command-separator`, `command-shortcut`
12. **Custom className merging** — pass a custom className to Command and CommandInput, verify the custom class is present alongside default styles
13. **Accessibility (vitest-axe)** — render a full Command with input, groups, and items, run `axe()`, verify no violations

**Test fixtures:**

- `TestCommand` — basic Command with CommandInput, CommandList, a CommandGroup with 3 CommandItems, and CommandEmpty
- `TestCommandFull` — Command with multiple groups, separators, shortcuts, and an onSelect handler
- `TestCommandDialog` — CommandDialog wrapper with open/onOpenChange props for dialog tests

**Setup (beforeAll):**

```typescript
beforeAll(() => {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {};
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = () => {};
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
});
```

This matches the `beforeAll` polyfill pattern used in `dropdown-menu.test.tsx` and `context-menu.test.tsx` to handle missing DOM APIs in the jsdom test environment.

### 5.5 `command.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';
```

**Meta configuration:**

```typescript
const meta: Meta<typeof Command> = {
  title: 'Components/Command',
  component: Command,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;
```

**Stories (6 stories):**

1. **Default** — Basic Command with CommandInput, CommandList, CommandEmpty, one CommandGroup with 3 items. Demonstrates typing-to-filter and basic item selection.

2. **WithGroups** — Command with multiple CommandGroups (e.g., "Suggestions" and "Settings") separated by CommandSeparator. Each group has a `heading` prop and 2-3 items.

3. **WithShortcuts** — Command items that each include a CommandShortcut span showing keyboard shortcuts (e.g., `⌘K`, `⌘S`, `⌘P`).

4. **Empty** — Command where CommandEmpty message is immediately visible (e.g., pre-populated input with a no-match query) showing the "No results found." empty state.

5. **InDialog** — `CommandDialog` story with a Button trigger that toggles dialog open state. Uses `useState` for open/onOpenChange. Demonstrates the command palette in a modal dialog overlay.

6. **WithIcons** — Command items that include inline SVG icons to the left of the item text, demonstrating the icon + text + shortcut layout pattern.

### 5.6 `packages/ui/src/index.ts` Additions

Append the following export block:

```typescript
export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  type CommandDialogProps,
  type CommandEmptyProps,
  type CommandGroupProps,
  type CommandInputProps,
  type CommandItemProps,
  type CommandListProps,
  type CommandProps,
  type CommandSeparatorProps,
  type CommandShortcutProps,
} from './components/command/command.js';
export {
  commandDialogCommandStyles,
  commandDialogContentStyles,
  commandEmptyStyles,
  commandGroupStyles,
  commandInputStyles,
  commandInputWrapperStyles,
  commandItemStyles,
  commandListStyles,
  commandSeparatorStyles,
  commandShortcutStyles,
  commandStyles,
} from './components/command/command.styles.js';
```

## 6. Verification Checklist

1. All tests in `command.test.tsx` pass via `pnpm test`
2. `pnpm typecheck` passes with no errors across the monorepo
3. Storybook renders all 6 stories correctly via `pnpm storybook`
4. Typing in CommandInput filters visible items in real time
5. Arrow keys navigate between items, Enter selects, Escape closes CommandDialog
6. `CommandEmpty` displays when no items match the search query
7. `CommandDialog` correctly inherits Dialog's focus trapping and overlay
8. All sub-components include `data-slot` attributes following `kebab-case` naming
9. All sub-components are accessible via `import { Command, ... } from '@components/ui'`
10. vitest-axe reports no accessibility violations

## 7. Implementation Order

1. `command.types.ts` — define all prop types first
2. `command.styles.ts` — define all style constants
3. `command.tsx` — implement all 9 sub-components
4. `command.test.tsx` — write and run tests
5. `command.stories.tsx` — write Storybook stories
6. Update `packages/ui/src/index.ts` — add all exports
7. Run `pnpm typecheck` and `pnpm test` — verify everything passes

## 8. Design Deviations

None. This implementation follows the task spec, phase spec, and milestone spec exactly. All sub-components match the shadcn/ui reference. The 5-file pattern is maintained. `CommandDialog` composes the existing Dialog component as specified.