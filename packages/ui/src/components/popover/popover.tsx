import * as PopoverPrimitive from '@radix-ui/react-popover';

import { cn } from '../../lib/utils.js';
import { popoverContentStyles } from './popover.styles.js';
import type { PopoverContentProps, PopoverTriggerProps } from './popover.types.js';

export type { PopoverContentProps, PopoverProps, PopoverTriggerProps } from './popover.types.js';

export const Popover = PopoverPrimitive.Root;

export function PopoverTrigger({
  className,
  ref,
  ...props
}: PopoverTriggerProps): React.JSX.Element {
  return (
    <PopoverPrimitive.Trigger
      data-slot="popover-trigger"
      className={className}
      ref={ref}
      {...props}
    />
  );
}

export function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  ref,
  ...props
}: PopoverContentProps): React.JSX.Element {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(popoverContentStyles, className)}
        ref={ref}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}
