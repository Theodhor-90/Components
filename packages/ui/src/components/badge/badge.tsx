import { Slot } from '@radix-ui/react-slot';

import { cn } from '../../lib/utils.js';
import { badgeVariants } from './badge.styles.js';
import type { BadgeProps } from './badge.types.js';

export type { BadgeProps } from './badge.types.js';

export function Badge({
  className,
  variant,
  asChild = false,
  ref,
  ...props
}: BadgeProps): React.JSX.Element {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, className }))}
      ref={ref}
      {...props}
    />
  );
}
