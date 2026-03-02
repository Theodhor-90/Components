import type { VariantProps } from 'class-variance-authority';
import type * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';

import type { toggleVariants } from '../toggle/toggle.styles.js';
import type { toggleGroupVariants } from './toggle-group.styles.js';

export type ToggleGroupContextType = VariantProps<typeof toggleVariants>;

export type ToggleGroupProps = React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleGroupVariants> &
  ToggleGroupContextType;

export type ToggleGroupItemProps = React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>;
