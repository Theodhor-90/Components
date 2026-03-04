import { Children, cloneElement, createContext, isValidElement, useContext } from 'react';

import { cn } from '../../lib/utils.js';
import {
  stepperConnectorCompletedStyles,
  stepperConnectorPendingStyles,
  stepperItemDescriptionStyles,
  stepperItemTitleStyles,
  stepperItemVariants,
  stepperVariants,
} from './stepper.styles.js';
import type { StepperContextType, StepperItemInternalProps, StepperProps } from './stepper.types.js';

export type { StepperItemProps, StepperProps } from './stepper.types.js';

const StepperContext = createContext<StepperContextType>({ orientation: 'horizontal' });

export function Stepper({ className, orientation, children, ref, ...props }: StepperProps): React.JSX.Element {
  const childArray = Children.toArray(children);
  const lastIndex = childArray.length - 1;

  return (
    <StepperContext.Provider value={{ orientation: orientation ?? 'horizontal' }}>
      <div
        data-slot="stepper"
        className={cn(stepperVariants({ orientation, className }))}
        ref={ref}
        {...props}
      >
        {childArray.map((child, index) =>
          isValidElement(child) && index === lastIndex
            ? cloneElement(child as React.ReactElement<StepperItemInternalProps>, { isLast: true })
            : child,
        )}
      </div>
    </StepperContext.Provider>
  );
}

function StatusIcon({ status }: { status: StepperItemInternalProps['status'] }): React.JSX.Element {
  switch (status) {
    case 'completed':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <polyline points="2.5,7 5.5,10 11.5,4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'error':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <line x1="3.5" y1="3.5" x2="10.5" y2="10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="10.5" y1="3.5" x2="3.5" y2="10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'active':
      return (
        <svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="5" cy="5" r="5" fill="currentColor" />
        </svg>
      );
    case 'pending':
    default:
      return (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
  }
}

export function StepperItem({
  className,
  status,
  title,
  description,
  isLast = false,
  ref,
  ...props
}: StepperItemInternalProps): React.JSX.Element {
  const { orientation } = useContext(StepperContext);
  const connectorStyles = status === 'completed' ? stepperConnectorCompletedStyles : stepperConnectorPendingStyles;

  if (orientation === 'vertical') {
    return (
      <div
        data-slot="stepper-item"
        className={cn('flex flex-row gap-3', className)}
        ref={ref}
        aria-current={status === 'active' ? 'step' : undefined}
        {...props}
      >
        <div className="flex flex-col items-center">
          <div className={cn(stepperItemVariants({ status }))}>
            <StatusIcon status={status} />
          </div>
          {!isLast && <div className={cn('w-0.5 flex-1 my-1', connectorStyles)} />}
        </div>
        <div className="pb-6">
          <p className={stepperItemTitleStyles}>{title}</p>
          {description && <p className={stepperItemDescriptionStyles}>{description}</p>}
          <span className="sr-only">{status}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      data-slot="stepper-item"
      className={cn('flex flex-1 flex-col items-center gap-2', className)}
      ref={ref}
      aria-current={status === 'active' ? 'step' : undefined}
      {...props}
    >
      <div className="flex w-full items-center">
        <div className={cn(stepperItemVariants({ status }))}>
          <StatusIcon status={status} />
        </div>
        {!isLast && <div className={cn('mx-2 h-0.5 flex-1', connectorStyles)} />}
      </div>
      <div className="text-center">
        <p className={stepperItemTitleStyles}>{title}</p>
        {description && <p className={stepperItemDescriptionStyles}>{description}</p>}
        <span className="sr-only">{status}</span>
      </div>
    </div>
  );
}
