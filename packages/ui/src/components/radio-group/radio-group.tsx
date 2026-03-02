import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

import { cn } from '../../lib/utils.js';
import { radioGroupItemVariants, radioGroupVariants } from './radio-group.styles.js';
import type { RadioGroupItemProps, RadioGroupProps } from './radio-group.types.js';

export type { RadioGroupItemProps, RadioGroupProps } from './radio-group.types.js';

export function RadioGroup({ className, ref, ...props }: RadioGroupProps): React.JSX.Element {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn(radioGroupVariants({ className }))}
      ref={ref}
      {...props}
    />
  );
}

export function RadioGroupItem({
  className,
  ref,
  ...props
}: RadioGroupItemProps): React.JSX.Element {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(radioGroupItemVariants({ className }))}
      ref={ref}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="currentColor"
        >
          <circle cx="4" cy="4" r="4" />
        </svg>
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}
