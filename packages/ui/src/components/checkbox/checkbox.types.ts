import type { VariantProps } from 'class-variance-authority';
import type * as CheckboxPrimitive from '@radix-ui/react-checkbox';

import type { checkboxVariants } from './checkbox.styles.js';

export type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root> &
  VariantProps<typeof checkboxVariants>;
