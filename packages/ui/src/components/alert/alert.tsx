import { cn } from '../../lib/utils.js';
import { alertDescriptionStyles, alertTitleStyles, alertVariants } from './alert.styles.js';
import type { AlertDescriptionProps, AlertProps, AlertTitleProps } from './alert.types.js';

export type { AlertDescriptionProps, AlertProps, AlertTitleProps } from './alert.types.js';

export function Alert({ className, variant, ref, ...props }: AlertProps): React.JSX.Element {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant, className }))}
      ref={ref}
      {...props}
    />
  );
}

export function AlertTitle({
  className,
  ref,
  children,
  ...props
}: AlertTitleProps): React.JSX.Element {
  return (
    <h5 data-slot="alert-title" className={cn(alertTitleStyles, className)} ref={ref} {...props}>
      {children}
    </h5>
  );
}

export function AlertDescription({
  className,
  ref,
  ...props
}: AlertDescriptionProps): React.JSX.Element {
  return (
    <div
      data-slot="alert-description"
      className={cn(alertDescriptionStyles, className)}
      ref={ref}
      {...props}
    />
  );
}
