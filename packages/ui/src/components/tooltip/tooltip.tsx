import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '../../lib/utils.js';
import { tooltipContentStyles } from './tooltip.styles.js';
import type { TooltipContentProps, TooltipTriggerProps } from './tooltip.types.js';

export type {
  TooltipContentProps,
  TooltipProps,
  TooltipProviderProps,
  TooltipTriggerProps,
} from './tooltip.types.js';

export const TooltipProvider = TooltipPrimitive.Provider;

export const Tooltip = TooltipPrimitive.Root;

export function TooltipTrigger({
  className,
  ref,
  ...props
}: TooltipTriggerProps): React.JSX.Element {
  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      className={className}
      ref={ref}
      {...props}
    />
  );
}

export function TooltipContent({
  className,
  sideOffset = 4,
  ref,
  ...props
}: TooltipContentProps): React.JSX.Element {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(tooltipContentStyles, className)}
        ref={ref}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
}
