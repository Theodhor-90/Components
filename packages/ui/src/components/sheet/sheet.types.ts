import type { VariantProps } from 'class-variance-authority';
import type * as DialogPrimitive from '@radix-ui/react-dialog';

import type { sheetContentVariants } from './sheet.styles.js';

export type SheetProps = React.ComponentProps<typeof DialogPrimitive.Root>;
export type SheetTriggerProps = React.ComponentProps<typeof DialogPrimitive.Trigger>;
export type SheetCloseProps = React.ComponentProps<typeof DialogPrimitive.Close>;
export type SheetPortalProps = React.ComponentProps<typeof DialogPrimitive.Portal>;
export type SheetOverlayProps = React.ComponentProps<typeof DialogPrimitive.Overlay>;
export type SheetContentProps = React.ComponentProps<typeof DialogPrimitive.Content> &
  VariantProps<typeof sheetContentVariants>;
export type SheetHeaderProps = React.ComponentProps<'div'>;
export type SheetFooterProps = React.ComponentProps<'div'>;
export type SheetTitleProps = React.ComponentProps<typeof DialogPrimitive.Title>;
export type SheetDescriptionProps = React.ComponentProps<typeof DialogPrimitive.Description>;
