import type { VariantProps } from 'class-variance-authority';

import type { stepperVariants } from './stepper.styles.js';

export type StepperContextType = {
  orientation: 'horizontal' | 'vertical';
};

export type StepperProps = React.ComponentProps<'div'> &
  VariantProps<typeof stepperVariants>;

export type StepperItemProps = React.ComponentProps<'div'> & {
  status: 'pending' | 'active' | 'completed' | 'error';
  title: string;
  description?: string;
};

/** @internal Used by Stepper to inject last-item detection. Not part of the public API. */
export type StepperItemInternalProps = StepperItemProps & {
  isLast?: boolean;
};
