import type * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import type { VariantProps } from 'class-variance-authority';

import type { contextMenuItemVariants, contextMenuLabelVariants } from './context-menu.styles.js';

export type ContextMenuProps = React.ComponentProps<typeof ContextMenuPrimitive.Root>;
export type ContextMenuTriggerProps = React.ComponentProps<typeof ContextMenuPrimitive.Trigger>;
export type ContextMenuPortalProps = React.ComponentProps<typeof ContextMenuPrimitive.Portal>;
export type ContextMenuContentProps = React.ComponentProps<typeof ContextMenuPrimitive.Content>;
export type ContextMenuGroupProps = React.ComponentProps<typeof ContextMenuPrimitive.Group>;
export type ContextMenuItemProps = React.ComponentProps<typeof ContextMenuPrimitive.Item> &
  VariantProps<typeof contextMenuItemVariants>;
export type ContextMenuCheckboxItemProps = React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>;
export type ContextMenuRadioItemProps = React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>;
export type ContextMenuRadioGroupProps = React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>;
export type ContextMenuLabelProps = React.ComponentProps<typeof ContextMenuPrimitive.Label> &
  VariantProps<typeof contextMenuLabelVariants>;
export type ContextMenuSeparatorProps = React.ComponentProps<typeof ContextMenuPrimitive.Separator>;
export type ContextMenuSubProps = React.ComponentProps<typeof ContextMenuPrimitive.Sub>;
export type ContextMenuSubTriggerProps = React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
  inset?: boolean;
};
export type ContextMenuSubContentProps = React.ComponentProps<typeof ContextMenuPrimitive.SubContent>;
export type ContextMenuShortcutProps = React.ComponentProps<'span'>;
