import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

import { cn } from '../../lib/utils.js';
import {
  alertDialogActionStyles,
  alertDialogCancelStyles,
  alertDialogContentStyles,
  alertDialogDescriptionStyles,
  alertDialogFooterStyles,
  alertDialogHeaderStyles,
  alertDialogOverlayStyles,
  alertDialogTitleStyles,
} from './alert-dialog.styles.js';
import type {
  AlertDialogActionProps,
  AlertDialogCancelProps,
  AlertDialogContentProps,
  AlertDialogDescriptionProps,
  AlertDialogFooterProps,
  AlertDialogHeaderProps,
  AlertDialogOverlayProps,
  AlertDialogTitleProps,
  AlertDialogTriggerProps,
} from './alert-dialog.types.js';

export type {
  AlertDialogActionProps,
  AlertDialogCancelProps,
  AlertDialogContentProps,
  AlertDialogDescriptionProps,
  AlertDialogFooterProps,
  AlertDialogHeaderProps,
  AlertDialogOverlayProps,
  AlertDialogPortalProps,
  AlertDialogProps,
  AlertDialogTitleProps,
  AlertDialogTriggerProps,
} from './alert-dialog.types.js';

export const AlertDialog = AlertDialogPrimitive.Root;

export const AlertDialogPortal = AlertDialogPrimitive.Portal;

export function AlertDialogTrigger({
  className,
  ref,
  ...props
}: AlertDialogTriggerProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Trigger
      data-slot="alert-dialog-trigger"
      className={className}
      ref={ref}
      {...props}
    />
  );
}

export function AlertDialogOverlay({
  className,
  ref,
  ...props
}: AlertDialogOverlayProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(alertDialogOverlayStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function AlertDialogContent({
  className,
  children,
  ref,
  ...props
}: AlertDialogContentProps): React.JSX.Element {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(alertDialogContentStyles, className)}
        ref={ref}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  );
}

export function AlertDialogHeader({
  className,
  ref,
  ...props
}: AlertDialogHeaderProps): React.JSX.Element {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(alertDialogHeaderStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function AlertDialogFooter({
  className,
  ref,
  ...props
}: AlertDialogFooterProps): React.JSX.Element {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(alertDialogFooterStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function AlertDialogTitle({
  className,
  ref,
  ...props
}: AlertDialogTitleProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn(alertDialogTitleStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function AlertDialogDescription({
  className,
  ref,
  ...props
}: AlertDialogDescriptionProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(alertDialogDescriptionStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function AlertDialogAction({
  className,
  ref,
  ...props
}: AlertDialogActionProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Action
      data-slot="alert-dialog-action"
      className={cn(alertDialogActionStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function AlertDialogCancel({
  className,
  ref,
  ...props
}: AlertDialogCancelProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Cancel
      data-slot="alert-dialog-cancel"
      className={cn(alertDialogCancelStyles, className)}
      ref={ref}
      {...props}
    />
  );
}
