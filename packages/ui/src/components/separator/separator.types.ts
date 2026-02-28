import type { VariantProps } from 'class-variance-authority';
import type * as SeparatorPrimitive from '@radix-ui/react-separator';

import type { separatorVariants } from './separator.styles.js';

export type SeparatorProps = React.ComponentProps<typeof SeparatorPrimitive.Root> &
  VariantProps<typeof separatorVariants>;
