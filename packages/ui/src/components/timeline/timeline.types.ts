export type TimelineProps = React.ComponentProps<'div'>;

export type TimelineItemProps = React.ComponentProps<'div'> & {
  title: string;
  timestamp?: string;
  status?: 'default' | 'error' | 'warning';
};

/** @internal Used by Timeline to inject last-item detection. Not part of the public API. */
export type TimelineItemInternalProps = TimelineItemProps & {
  isLast?: boolean;
};
