import { Slot } from '@radix-ui/react-slot';

import { cn } from '../../lib/utils.js';
import { inputVariants } from './input.styles.js';
import type { InputProps } from './input.types.js';

export type { InputProps } from './input.types.js';

export function Input({
  className,
  type,
  asChild = false,
  ref,
  ...props
}: InputProps): React.JSX.Element {
  const Comp = asChild ? Slot : 'input';

  return (
    <Comp
      data-slot="input"
      type={type}
      className={cn(inputVariants({ className }))}
      ref={ref}
      {...props}
    />
  );
}
