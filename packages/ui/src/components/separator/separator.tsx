import * as SeparatorPrimitive from '@radix-ui/react-separator';

import { cn } from '../../lib/utils.js';
import { separatorVariants } from './separator.styles.js';
import type { SeparatorProps } from './separator.types.js';

export type { SeparatorProps } from './separator.types.js';

export function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ref,
  ...props
}: SeparatorProps): React.JSX.Element {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(separatorVariants({ orientation, className }))}
      ref={ref}
      {...props}
    />
  );
}
