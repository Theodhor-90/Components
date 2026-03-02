import { cva } from 'class-variance-authority';

export const sidebarProviderStyles = 'flex min-h-svh w-full';

export const sidebarContentStyles =
  'flex h-full w-64 flex-col bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border transition-[width] duration-200 ease-linear';

export const sidebarContentCollapsedStyles = 'w-0 overflow-hidden border-r-0';

export const sidebarContentInnerStyles = 'flex min-h-0 flex-1 flex-col';

export const sidebarGroupStyles = 'flex w-full min-w-0 flex-col gap-2 p-2';

export const sidebarGroupLabelStyles =
  'flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70';

export const sidebarMenuStyles = 'flex w-full min-w-0 flex-col gap-1';

export const sidebarMenuItemStyles = 'group/menu-item relative';

export const sidebarMenuButtonVariants = cva(
  'flex w-full items-center gap-2 overflow-hidden rounded-md px-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: '',
        outline:
          'bg-sidebar-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:shadow-[0_0_0_1px_var(--sidebar-accent)]',
      },
      size: {
        sm: 'h-7 text-xs',
        default: 'h-8',
        lg: 'h-12 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export const sidebarMenuButtonActiveStyles =
  'bg-sidebar-primary text-sidebar-primary-foreground font-medium hover:bg-sidebar-primary hover:text-sidebar-primary-foreground';
