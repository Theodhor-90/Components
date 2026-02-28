import type { VariantProps } from 'class-variance-authority';

import type { buttonVariants } from './button.styles.js';

export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** Render as the child element instead of a <button>, merging props and behavior. */
    asChild?: boolean;
  };
