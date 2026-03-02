import type { VariantProps } from 'class-variance-authority';

import type { sidebarMenuButtonVariants } from './sidebar.styles.js';

export type SidebarProviderProps = React.ComponentProps<'div'> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export type SidebarTriggerProps = React.ComponentProps<'button'>;

export type SidebarContentProps = React.ComponentProps<'div'>;

export type SidebarGroupProps = React.ComponentProps<'div'>;

export type SidebarGroupLabelProps = React.ComponentProps<'div'> & {
  asChild?: boolean;
};

export type SidebarMenuProps = React.ComponentProps<'ul'>;

export type SidebarMenuItemProps = React.ComponentProps<'li'>;

export type SidebarMenuButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof sidebarMenuButtonVariants> & {
    asChild?: boolean;
    isActive?: boolean;
  };
