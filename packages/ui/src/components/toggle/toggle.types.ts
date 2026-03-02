import type { VariantProps } from 'class-variance-authority';
import type * as TogglePrimitive from '@radix-ui/react-toggle';

import type { toggleVariants } from './toggle.styles.js';

export type ToggleProps = React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>;
