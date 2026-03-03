import * as HoverCardPrimitive from '@radix-ui/react-hover-card';

import { cn } from '../../lib/utils.js';
import { hoverCardContentStyles } from './hover-card.styles.js';
import type { HoverCardContentProps, HoverCardTriggerProps } from './hover-card.types.js';

export type {
  HoverCardContentProps,
  HoverCardProps,
  HoverCardTriggerProps,
} from './hover-card.types.js';

export const HoverCard = HoverCardPrimitive.Root;

export function HoverCardTrigger({
  className,
  ref,
  ...props
}: HoverCardTriggerProps): React.JSX.Element {
  return (
    <HoverCardPrimitive.Trigger
      data-slot="hover-card-trigger"
      className={className}
      ref={ref}
      {...props}
    />
  );
}

export function HoverCardContent({
  className,
  align = 'center',
  sideOffset = 4,
  ref,
  ...props
}: HoverCardContentProps): React.JSX.Element {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(hoverCardContentStyles, className)}
        ref={ref}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}
