import { createContext, useContext } from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';

import { cn } from '../../lib/utils.js';
import { toggleVariants } from '../toggle/toggle.styles.js';
import { toggleGroupVariants } from './toggle-group.styles.js';
import type {
  ToggleGroupContextType,
  ToggleGroupItemProps,
  ToggleGroupProps,
} from './toggle-group.types.js';

export type { ToggleGroupItemProps, ToggleGroupProps } from './toggle-group.types.js';

const ToggleGroupContext = createContext<ToggleGroupContextType>({});

export function ToggleGroup({
  className,
  variant,
  size,
  ref,
  ...props
}: ToggleGroupProps): React.JSX.Element {
  return (
    <ToggleGroupContext.Provider value={{ variant, size }}>
      <ToggleGroupPrimitive.Root
        data-slot="toggle-group"
        className={cn(toggleGroupVariants({ className }))}
        ref={ref}
        {...props}
      />
    </ToggleGroupContext.Provider>
  );
}

export function ToggleGroupItem({
  className,
  variant,
  size,
  ref,
  ...props
}: ToggleGroupItemProps): React.JSX.Element {
  const context = useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        toggleVariants({
          variant: variant ?? context.variant,
          size: size ?? context.size,
          className,
        }),
      )}
      ref={ref}
      {...props}
    />
  );
}
