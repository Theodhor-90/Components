import { cn } from '../../lib/utils.js';
import { spinnerVariants } from './spinner.styles.js';
import type { SpinnerProps } from './spinner.types.js';

export type { SpinnerProps } from './spinner.types.js';

export function Spinner({
  className,
  size,
  'aria-label': ariaLabel,
  ref,
  ...props
}: SpinnerProps): React.JSX.Element {
  const hasExplicitAriaLabel = ariaLabel !== undefined;

  return (
    <span data-slot="spinner" role="status" aria-label={ariaLabel}>
      <svg
        className={cn(spinnerVariants({ size, className }))}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        ref={ref}
        {...props}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          strokeDasharray="20 44"
          strokeLinecap="round"
        />
      </svg>
      {hasExplicitAriaLabel ? null : <span className="sr-only">Loading</span>}
    </span>
  );
}
