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
  ref,
  ...props
}: CollapsibleTriggerProps): React.JSX.Element {
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapsible-trigger"
      className={cn(collapsibleTriggerStyles, className)}
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
