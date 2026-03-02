import * as TogglePrimitive from '@radix-ui/react-toggle';

import { cn } from '../../lib/utils.js';
import { toggleVariants } from './toggle.styles.js';
import type { ToggleProps } from './toggle.types.js';

export type { ToggleProps } from './toggle.types.js';

export function Toggle({
  className,
  variant,
  size,
  ref,
  ...props
}: ToggleProps): React.JSX.Element {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
}
