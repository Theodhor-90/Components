import type * as DialogPrimitive from '@radix-ui/react-dialog';

export type DialogProps = React.ComponentProps<typeof DialogPrimitive.Root>;

export type DialogTriggerProps = React.ComponentProps<typeof DialogPrimitive.Trigger>;

export type DialogPortalProps = React.ComponentProps<typeof DialogPrimitive.Portal>;

export type DialogOverlayProps = React.ComponentProps<typeof DialogPrimitive.Overlay>;

export type DialogContentProps = React.ComponentProps<typeof DialogPrimitive.Content>;

export type DialogHeaderProps = React.ComponentProps<'div'>;

export type DialogFooterProps = React.ComponentProps<'div'>;

export type DialogTitleProps = React.ComponentProps<typeof DialogPrimitive.Title>;

export type DialogDescriptionProps = React.ComponentProps<typeof DialogPrimitive.Description>;

export type DialogCloseProps = React.ComponentProps<typeof DialogPrimitive.Close>;
