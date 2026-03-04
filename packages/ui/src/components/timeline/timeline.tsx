import { Children, cloneElement, isValidElement } from 'react';

import { cn } from '../../lib/utils.js';
import {
  timelineContainerStyles,
  timelineItemBodyStyles,
  timelineItemConnectorStyles,
  timelineItemContentStyles,
  timelineItemDotColumnStyles,
  timelineItemDotVariants,
  timelineItemStyles,
  timelineItemTimestampStyles,
  timelineItemTitleStyles,
} from './timeline.styles.js';
import type { TimelineItemInternalProps, TimelineProps } from './timeline.types.js';

export type { TimelineItemProps, TimelineProps } from './timeline.types.js';

export function Timeline({ className, children, ref, ...props }: TimelineProps): React.JSX.Element {
  const childArray = Children.toArray(children);
  const lastIndex = childArray.length - 1;

  return (
    <div
      data-slot="timeline"
      className={cn(timelineContainerStyles, className)}
      ref={ref}
      {...props}
    >
      {childArray.map((child, index) =>
        isValidElement(child) && index === lastIndex
          ? cloneElement(child as React.ReactElement<TimelineItemInternalProps>, { isLast: true })
          : child,
      )}
    </div>
  );
}

export function TimelineItem({
  className,
  status = 'default',
  title,
  timestamp,
  isLast = false,
  children,
  ref,
  ...props
}: TimelineItemInternalProps): React.JSX.Element {
  return (
    <div
      data-slot="timeline-item"
      className={cn(timelineItemStyles, className)}
      ref={ref}
      {...props}
    >
      <div className={timelineItemDotColumnStyles}>
        <div className={cn(timelineItemDotVariants({ status }))} />
        {!isLast && <div className={timelineItemConnectorStyles} />}
      </div>
      <div className={timelineItemContentStyles}>
        <p className={timelineItemTitleStyles}>{title}</p>
        {timestamp && <p className={timelineItemTimestampStyles}>{timestamp}</p>}
        {children && <div className={timelineItemBodyStyles}>{children}</div>}
      </div>
    </div>
  );
}
