import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '../../lib/utils.js';
import {
  sliderRangeVariants,
  sliderThumbVariants,
  sliderTrackVariants,
  sliderVariants,
} from './slider.styles.js';
import type { SliderProps } from './slider.types.js';

export type { SliderProps } from './slider.types.js';

export function Slider({
  className,
  defaultValue = [0],
  value,
  ref,
  'aria-label': ariaLabel,
  ...props
}: SliderProps): React.JSX.Element {
  const thumbCount = value ?? defaultValue;

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn(sliderVariants({ className }))}
      ref={ref}
      aria-label={ariaLabel}
      {...(value !== undefined ? { value } : { defaultValue })}
      {...props}
    >
      <SliderPrimitive.Track className={cn(sliderTrackVariants())}>
        <SliderPrimitive.Range className={cn(sliderRangeVariants())} />
      </SliderPrimitive.Track>
      {thumbCount.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className={cn(sliderThumbVariants())}
          aria-label={ariaLabel}
        />
      ))}
    </SliderPrimitive.Root>
  );
}
