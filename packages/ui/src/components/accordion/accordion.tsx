import * as AccordionPrimitive from '@radix-ui/react-accordion';

import { cn } from '../../lib/utils.js';
import {
  accordionContentInnerStyles,
  accordionContentStyles,
  accordionItemStyles,
  accordionTriggerStyles,
} from './accordion.styles.js';
import type {
  AccordionContentProps,
  AccordionItemProps,
  AccordionTriggerProps,
} from './accordion.types.js';

export type {
  AccordionProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from './accordion.types.js';

export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({ className, ref, ...props }: AccordionItemProps): React.JSX.Element {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(accordionItemStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function AccordionTrigger({
  className,
  children,
  ref,
  ...props
}: AccordionTriggerProps): React.JSX.Element {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(accordionTriggerStyles, className)}
        ref={ref}
        {...props}
      >
        {children}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 transition-transform duration-200"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ref,
  ...props
}: AccordionContentProps): React.JSX.Element {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(accordionContentStyles, className)}
      ref={ref}
      {...props}
    >
      <div className={accordionContentInnerStyles}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
