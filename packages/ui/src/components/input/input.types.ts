import type { VariantProps } from 'class-variance-authority';

import type { inputVariants } from './input.styles.js';

export type InputProps = React.ComponentProps<'input'> &
  VariantProps<typeof inputVariants> & {
    asChild?: boolean;
  };
