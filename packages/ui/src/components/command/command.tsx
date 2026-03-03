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

function CommandDialog({ children, ...props }: CommandDialogProps): React.JSX.Element {
  return (
    <Dialog {...props}>
      <DialogContent className={commandDialogContentStyles}>
        <Command className={commandDialogCommandStyles}>{children}</Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({ className, ref, ...props }: CommandInputProps): React.JSX.Element {
  return (
    <div
      data-slot="command-input-wrapper"
      className={commandInputWrapperStyles}
      cmdk-input-wrapper=""
    >
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

function CommandList({ className, ref, ...props }: CommandListProps): React.JSX.Element {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(commandListStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

function CommandEmpty({ className, ref, ...props }: CommandEmptyProps): React.JSX.Element {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn(commandEmptyStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

function CommandGroup({ className, ref, ...props }: CommandGroupProps): React.JSX.Element {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(commandGroupStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

function CommandItem({ className, ref, ...props }: CommandItemProps): React.JSX.Element {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(commandItemStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

function CommandSeparator({ className, ref, ...props }: CommandSeparatorProps): React.JSX.Element {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn(commandSeparatorStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

function CommandShortcut({ className, ref, ...props }: CommandShortcutProps): React.JSX.Element {
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
