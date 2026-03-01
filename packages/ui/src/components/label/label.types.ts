import type { VariantProps } from 'class-variance-authority';
import type * as LabelPrimitive from '@radix-ui/react-label';

import type { labelVariants } from './label.styles.js';

export type LabelProps = React.ComponentProps<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants>;
