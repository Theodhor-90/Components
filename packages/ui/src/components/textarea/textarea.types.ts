import type { VariantProps } from 'class-variance-authority';

import type { textareaVariants } from './textarea.styles.js';

export type TextareaProps = React.ComponentProps<'textarea'> &
  VariantProps<typeof textareaVariants> & {
    asChild?: boolean;
    autoResize?: boolean;
  };
