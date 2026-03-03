import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '../../lib/utils.js';
import { progressIndicatorStyles, progressStyles } from './progress.styles.js';
import type { ProgressProps } from './progress.types.js';

export type { ProgressProps } from './progress.types.js';

export function Progress({ className, value, ref, ...props }: ProgressProps): React.JSX.Element {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(progressStyles, className)}
      ref={ref}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(progressIndicatorStyles)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
