import * as DialogPrimitive from '@radix-ui/react-dialog';

import { cn } from '../../lib/utils.js';
import {
  dialogCloseButtonStyles,
  dialogContentStyles,
  dialogDescriptionStyles,
  dialogFooterStyles,
  dialogHeaderStyles,
  dialogOverlayStyles,
  dialogTitleStyles,
} from './dialog.styles.js';
import type {
  DialogCloseProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogOverlayProps,
  DialogTitleProps,
  DialogTriggerProps,
} from './dialog.types.js';

export type {
  DialogCloseProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogOverlayProps,
  DialogPortalProps,
  DialogProps,
  DialogTitleProps,
  DialogTriggerProps,
} from './dialog.types.js';

export const Dialog = DialogPrimitive.Root;

export const DialogPortal = DialogPrimitive.Portal;

export function DialogTrigger({ className, ref, ...props }: DialogTriggerProps): React.JSX.Element {
  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-trigger"
      className={className}
      ref={ref}
      {...props}
    />
  );
}

export function DialogClose({ className, ref, ...props }: DialogCloseProps): React.JSX.Element {
  return (
    <DialogPrimitive.Close data-slot="dialog-close" className={className} ref={ref} {...props} />
  );
}

export function DialogOverlay({ className, ref, ...props }: DialogOverlayProps): React.JSX.Element {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(dialogOverlayStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function DialogContent({
  className,
  children,
  ref,
  ...props
}: DialogContentProps): React.JSX.Element {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(dialogContentStyles, className)}
        ref={ref}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className={dialogCloseButtonStyles}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11.25 3.75 3.75 11.25" />
            <path d="M3.75 3.75l7.5 7.5" />
          </svg>
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export function DialogHeader({ className, ref, ...props }: DialogHeaderProps): React.JSX.Element {
  return (
    <div
      data-slot="dialog-header"
      className={cn(dialogHeaderStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function DialogFooter({ className, ref, ...props }: DialogFooterProps): React.JSX.Element {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(dialogFooterStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function DialogTitle({ className, ref, ...props }: DialogTitleProps): React.JSX.Element {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(dialogTitleStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ref,
  ...props
}: DialogDescriptionProps): React.JSX.Element {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(dialogDescriptionStyles, className)}
      ref={ref}
      {...props}
    />
  );
}
