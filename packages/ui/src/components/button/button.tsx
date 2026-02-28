import { Slot } from '@radix-ui/react-slot';

import { cn } from '../../lib/utils.js';
import { buttonVariants } from './button.styles.js';
import type { ButtonProps } from './button.types.js';

export type { ButtonProps } from './button.types.js';

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ref,
  ...props
}: ButtonProps): React.JSX.Element {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
}
