import { Slot } from '@radix-ui/react-slot';

import { cn } from '../../lib/utils.js';
import { Separator } from '../separator/separator.js';
import { headerVariants } from './header.styles.js';
import type { HeaderProps } from './header.types.js';

export type { HeaderProps } from './header.types.js';

export function Header({
  className,
  actions,
  userInfo,
  asChild = false,
  children,
  ref,
  ...props
}: HeaderProps): React.JSX.Element {
  if (asChild) {
    return (
      <Slot data-slot="header" className={cn(headerVariants({ className }))} ref={ref} {...props}>
        {children}
      </Slot>
    );
  }

  return (
    <header data-slot="header" className={cn(headerVariants({ className }))} ref={ref} {...props}>
      <div className="flex flex-1 items-center">{children}</div>
      {(actions || userInfo) && (
        <div className="flex items-center gap-4">
          {actions}
          {actions && userInfo && <Separator orientation="vertical" className="h-6" />}
          {userInfo}
        </div>
      )}
    </header>
  );
}
