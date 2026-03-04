import { cva } from 'class-variance-authority';

export const timelineItemDotVariants = cva(
  'mt-1.5 h-3 w-3 shrink-0 rounded-full',
  {
    variants: {
      status: {
        default: 'bg-primary',
        error: 'bg-destructive',
        warning: 'bg-accent',
      },
    },
    defaultVariants: {
      status: 'default',
    },
  },
);

export const timelineContainerStyles = 'flex flex-col';

export const timelineItemStyles = 'flex gap-3';

export const timelineItemDotColumnStyles = 'flex flex-col items-center';

export const timelineItemContentStyles = 'pb-6';

export const timelineItemTitleStyles = 'text-sm font-medium';

export const timelineItemTimestampStyles = 'text-xs text-muted-foreground';

export const timelineItemBodyStyles = 'mt-2 text-sm text-muted-foreground';

export const timelineItemConnectorStyles = 'w-0.5 flex-1 bg-border';
