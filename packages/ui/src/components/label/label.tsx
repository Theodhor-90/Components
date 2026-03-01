import * as LabelPrimitive from '@radix-ui/react-label';

import { cn } from '../../lib/utils.js';
import { labelVariants } from './label.styles.js';
import type { LabelProps } from './label.types.js';

export type { LabelProps } from './label.types.js';

export function Label({ className, ref, ...props }: LabelProps): React.JSX.Element {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(labelVariants({ className }))}
      ref={ref}
      {...props}
    />
  );
}
