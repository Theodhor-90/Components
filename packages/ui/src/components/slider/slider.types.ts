import type { VariantProps } from 'class-variance-authority';
import type * as SliderPrimitive from '@radix-ui/react-slider';

import type { sliderVariants } from './slider.styles.js';

export type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> &
  VariantProps<typeof sliderVariants>;
