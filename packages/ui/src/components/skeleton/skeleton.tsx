import { cn } from '../../lib/utils.js';
import { skeletonStyles } from './skeleton.styles.js';
import type { SkeletonProps } from './skeleton.types.js';

export type { SkeletonProps } from './skeleton.types.js';

export function Skeleton({ className, ref, ...props }: SkeletonProps): React.JSX.Element {
  return (
    <div data-slot="skeleton" className={cn(skeletonStyles, className)} ref={ref} {...props} />
  );
}
