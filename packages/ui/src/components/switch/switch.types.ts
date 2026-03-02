import type { VariantProps } from 'class-variance-authority';
import type * as SwitchPrimitive from '@radix-ui/react-switch';

import type { switchVariants } from './switch.styles.js';

export type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root> &
  VariantProps<typeof switchVariants>;
