import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

import { cn } from '../../lib/utils.js';
import {
  scrollAreaStyles,
  scrollAreaViewportStyles,
  scrollBarHorizontalStyles,
  scrollBarStyles,
  scrollBarThumbStyles,
  scrollBarVerticalStyles,
} from './scroll-area.styles.js';
import type { ScrollAreaProps, ScrollBarProps } from './scroll-area.types.js';

export type { ScrollAreaProps, ScrollBarProps } from './scroll-area.types.js';

export function ScrollArea({
  className,
  children,
  ref,
  ...props
}: ScrollAreaProps): React.JSX.Element {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn(scrollAreaStyles, className)}
      ref={ref}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport className={scrollAreaViewportStyles}>
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

export function ScrollBar({
  className,
  orientation = 'vertical',
  ref,
  ...props
}: ScrollBarProps): React.JSX.Element {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-bar"
      orientation={orientation}
      className={cn(
        scrollBarStyles,
        orientation === 'vertical' ? scrollBarVerticalStyles : scrollBarHorizontalStyles,
        className,
      )}
      ref={ref}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className={scrollBarThumbStyles} />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}
