import type { VariantProps } from 'class-variance-authority';

import type { headerVariants } from './header.styles.js';

export type HeaderProps = React.ComponentProps<'header'> &
  VariantProps<typeof headerVariants> & {
    actions?: React.ReactNode;
    userInfo?: React.ReactNode;
    asChild?: boolean;
  };
