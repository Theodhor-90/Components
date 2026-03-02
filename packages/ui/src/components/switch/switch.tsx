import * as SwitchPrimitive from '@radix-ui/react-switch';

import { cn } from '../../lib/utils.js';
import { switchThumbVariants, switchVariants } from './switch.styles.js';
import type { SwitchProps } from './switch.types.js';

export type { SwitchProps } from './switch.types.js';

export function Switch({ className, ref, ...props }: SwitchProps): React.JSX.Element {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(switchVariants({ className }))}
      ref={ref}
      {...props}
    >
      <SwitchPrimitive.Thumb className={cn(switchThumbVariants())} />
    </SwitchPrimitive.Root>
  );
}
