import type { VariantProps } from 'class-variance-authority';

import type { appLayoutVariants } from './app-layout.styles.js';

export type AppLayoutProps = React.ComponentProps<'div'> &
  VariantProps<typeof appLayoutVariants> & {
    sidebar?: React.ReactNode;
    header?: React.ReactNode;
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  };
