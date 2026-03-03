import type { Command as CommandPrimitive } from 'cmdk';

import type { DialogProps } from '../dialog/dialog.types.js';

export type CommandProps = React.ComponentProps<typeof CommandPrimitive>;

export type CommandDialogProps = DialogProps;

export type CommandInputProps = React.ComponentProps<typeof CommandPrimitive.Input>;

export type CommandListProps = React.ComponentProps<typeof CommandPrimitive.List>;

export type CommandEmptyProps = React.ComponentProps<typeof CommandPrimitive.Empty>;

export type CommandGroupProps = React.ComponentProps<typeof CommandPrimitive.Group>;

export type CommandItemProps = React.ComponentProps<typeof CommandPrimitive.Item>;

export type CommandSeparatorProps = React.ComponentProps<typeof CommandPrimitive.Separator>;

export type CommandShortcutProps = React.ComponentProps<'span'>;
