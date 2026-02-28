import type { VariantProps } from 'class-variance-authority';

import type { badgeVariants } from './badge.styles.js';

export type BadgeProps = React.ComponentProps<'div'> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
  };
