import * as DialogPrimitive from '@radix-ui/react-dialog';

import { cn } from '../../lib/utils.js';
import {
  sheetCloseButtonStyles,
  sheetContentVariants,
  sheetDescriptionStyles,
  sheetFooterStyles,
  sheetHeaderStyles,
  sheetOverlayStyles,
  sheetTitleStyles,
} from './sheet.styles.js';
import type {
  SheetCloseProps,
  SheetContentProps,
  SheetDescriptionProps,
  SheetFooterProps,
  SheetHeaderProps,
  SheetOverlayProps,
  SheetTitleProps,
  SheetTriggerProps,
} from './sheet.types.js';

export type {
  SheetProps,
  SheetTriggerProps,
  SheetCloseProps,
  SheetPortalProps,
  SheetOverlayProps,
  SheetContentProps,
  SheetHeaderProps,
  SheetFooterProps,
  SheetTitleProps,
  SheetDescriptionProps,
} from './sheet.types.js';

export const Sheet = DialogPrimitive.Root;

export const SheetPortal = DialogPrimitive.Portal;

export function SheetTrigger({ className, ref, ...props }: SheetTriggerProps): React.JSX.Element {
  return (
    <DialogPrimitive.Trigger data-slot="sheet-trigger" className={className} ref={ref} {...props} />
  );
}

export function SheetClose({ className, ref, ...props }: SheetCloseProps): React.JSX.Element {
  return (
    <DialogPrimitive.Close data-slot="sheet-close" className={className} ref={ref} {...props} />
  );
}

export function SheetOverlay({ className, ref, ...props }: SheetOverlayProps): React.JSX.Element {
  return (
    <DialogPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(sheetOverlayStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function SheetContent({
  side = 'right',
  className,
  children,
  ref,
  ...props
}: SheetContentProps): React.JSX.Element {
  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        data-slot="sheet-content"
        className={cn(sheetContentVariants({ side, className }))}
        ref={ref}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className={sheetCloseButtonStyles}>
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
    </SheetPortal>
  );
}

export function SheetHeader({ className, ref, ...props }: SheetHeaderProps): React.JSX.Element {
  return (
    <div
      data-slot="sheet-header"
      className={cn(sheetHeaderStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function SheetFooter({ className, ref, ...props }: SheetFooterProps): React.JSX.Element {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(sheetFooterStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function SheetTitle({ className, ref, ...props }: SheetTitleProps): React.JSX.Element {
  return (
    <DialogPrimitive.Title
      data-slot="sheet-title"
      className={cn(sheetTitleStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function SheetDescription({
  className,
  ref,
  ...props
}: SheetDescriptionProps): React.JSX.Element {
  return (
    <DialogPrimitive.Description
      data-slot="sheet-description"
      className={cn(sheetDescriptionStyles, className)}
      ref={ref}
      {...props}
    />
  );
}
