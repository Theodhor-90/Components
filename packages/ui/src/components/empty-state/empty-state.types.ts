export type EmptyStateProps = React.ComponentProps<'div'> & {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
};
