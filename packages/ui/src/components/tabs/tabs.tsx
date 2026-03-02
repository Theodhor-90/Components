import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '../../lib/utils.js';
import { tabsContentStyles, tabsListStyles, tabsTriggerStyles } from './tabs.styles.js';
import type { TabsContentProps, TabsListProps, TabsTriggerProps } from './tabs.types.js';

export type { TabsProps, TabsListProps, TabsTriggerProps, TabsContentProps } from './tabs.types.js';

export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ref, ...props }: TabsListProps): React.JSX.Element {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(tabsListStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ref, ...props }: TabsTriggerProps): React.JSX.Element {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(tabsTriggerStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function TabsContent({ className, ref, ...props }: TabsContentProps): React.JSX.Element {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(tabsContentStyles, className)}
      ref={ref}
      {...props}
    />
  );
}
