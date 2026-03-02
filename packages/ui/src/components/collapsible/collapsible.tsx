import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

import { cn } from '../../lib/utils.js';
import { collapsibleContentStyles, collapsibleTriggerStyles } from './collapsible.styles.js';
import type { CollapsibleContentProps, CollapsibleTriggerProps } from './collapsible.types.js';

export type {
  CollapsibleContentProps,
  CollapsibleProps,
  CollapsibleTriggerProps,
} from './collapsible.types.js';

export const Collapsible = CollapsiblePrimitive.Root;

export function CollapsibleTrigger({
  className,
  onKeyDown,
  ref,
  ...props
}: CollapsibleTriggerProps): React.JSX.Element {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>): void => {
    onKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    const isEnterKey = event.key === 'Enter';
    const isSpaceKey =
      event.key === ' ' ||
      event.key === 'Spacebar' ||
      event.key === 'Space' ||
      event.code === 'Space';

    if (!isEnterKey && !isSpaceKey) {
      return;
    }

    if (event.currentTarget.disabled) {
      return;
    }

    event.preventDefault();
    event.currentTarget.click();
  };

  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapsible-trigger"
      className={cn(collapsibleTriggerStyles, className)}
      onKeyDown={handleKeyDown}
      ref={ref}
      {...props}
    />
  );
}

export function CollapsibleContent({
  className,
  ref,
  ...props
}: CollapsibleContentProps): React.JSX.Element {
  return (
    <CollapsiblePrimitive.Content
      data-slot="collapsible-content"
      className={cn(collapsibleContentStyles, className)}
      ref={ref}
      {...props}
    />
  );
}
