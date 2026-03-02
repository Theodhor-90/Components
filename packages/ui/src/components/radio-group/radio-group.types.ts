import type { VariantProps } from 'class-variance-authority';
import type * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

import type { radioGroupItemVariants, radioGroupVariants } from './radio-group.styles.js';

export type RadioGroupProps = React.ComponentProps<typeof RadioGroupPrimitive.Root> &
  VariantProps<typeof radioGroupVariants>;

export type RadioGroupItemProps = React.ComponentProps<typeof RadioGroupPrimitive.Item> &
  VariantProps<typeof radioGroupItemVariants>;
