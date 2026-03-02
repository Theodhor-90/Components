import * as SelectPrimitive from '@radix-ui/react-select';

import { cn } from '../../lib/utils.js';
import {
  selectContentVariants,
  selectItemVariants,
  selectLabelVariants,
  selectScrollButtonVariants,
  selectSeparatorVariants,
  selectTriggerVariants,
} from './select.styles.js';
import type {
  SelectContentProps,
  SelectGroupProps,
  SelectItemProps,
  SelectLabelProps,
  SelectSeparatorProps,
  SelectTriggerProps,
} from './select.types.js';

export type {
  SelectContentProps,
  SelectGroupProps,
  SelectItemProps,
  SelectLabelProps,
  SelectProps,
  SelectSeparatorProps,
  SelectTriggerProps,
  SelectValueProps,
} from './select.types.js';

export const Select = SelectPrimitive.Root;

export function SelectGroup({ className, ref, ...props }: SelectGroupProps): React.JSX.Element {
  return (
    <SelectPrimitive.Group data-slot="select-group" className={className} ref={ref} {...props} />
  );
}

export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({
  className,
  children,
  ref,
  ...props
}: SelectTriggerProps): React.JSX.Element {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(selectTriggerVariants({ className }))}
      ref={ref}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          className="opacity-50"
        >
          <path
            d="M4.93179 5.43179C5.10813 5.25545 5.39399 5.25545 5.57033 5.43179L7.5 7.36146L9.42967 5.43179C9.60601 5.25545 9.89187 5.25545 10.0682 5.43179C10.2446 5.60813 10.2446 5.89399 10.0682 6.07033L7.81928 8.31928C7.64294 8.49562 7.35706 8.49562 7.18072 8.31928L4.93179 6.07033C4.75545 5.89399 4.75545 5.60813 4.93179 5.43179Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </svg>
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectScrollUpButton({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>): React.JSX.Element {
  return (
    <SelectPrimitive.ScrollUpButton
      className={cn(selectScrollButtonVariants({ className }))}
      ref={ref}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
      >
        <path
          d="M7.50005 4.92127L12.1953 9.61653C12.4286 9.84984 12.8068 9.84984 13.0401 9.61653C13.2734 9.38322 13.2734 9.005 13.0401 8.77169L7.92445 3.65609C7.69114 3.42278 7.31296 3.42278 7.07965 3.65609L1.96395 8.77169C1.73064 9.005 1.73064 9.38322 1.96395 9.61653C2.19726 9.84984 2.57543 9.84984 2.80875 9.61653L7.50005 4.92127Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>): React.JSX.Element {
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn(selectScrollButtonVariants({ className }))}
      ref={ref}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
      >
        <path
          d="M7.50005 10.0787L12.1953 5.38347C12.4286 5.15016 12.8068 5.15016 13.0401 5.38347C13.2734 5.61678 13.2734 5.995 13.0401 6.22831L7.92445 11.3439C7.69114 11.5772 7.31296 11.5772 7.07965 11.3439L1.96395 6.22831C1.73064 5.995 1.73064 5.61678 1.96395 5.38347C2.19726 5.15016 2.57543 5.15016 2.80875 5.38347L7.50005 10.0787Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    </SelectPrimitive.ScrollDownButton>
  );
}

export function SelectContent({
  className,
  children,
  position = 'popper',
  ref,
  ...props
}: SelectContentProps): React.JSX.Element {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          selectContentVariants(),
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          className,
        )}
        position={position}
        ref={ref}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            position === 'popper' &&
              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({
  className,
  children,
  ref,
  ...props
}: SelectItemProps): React.JSX.Element {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(selectItemVariants({ className }))}
      ref={ref}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
          >
            <path
              d="M11.4669 3.72684C11.6073 3.86724 11.6073 4.09485 11.4669 4.23525L6.34687 9.35525C6.20647 9.49565 5.97886 9.49565 5.83846 9.35525L3.53346 7.05025C3.39306 6.90985 3.39306 6.68224 3.53346 6.54184C3.67386 6.40144 3.90147 6.40144 4.04187 6.54184L6.09267 8.59264L10.9585 3.72684C11.0989 3.58645 11.3265 3.58645 11.4669 3.72684Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

export function SelectLabel({ className, ref, ...props }: SelectLabelProps): React.JSX.Element {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(selectLabelVariants({ className }))}
      ref={ref}
      {...props}
    />
  );
}

export function SelectSeparator({
  className,
  ref,
  ...props
}: SelectSeparatorProps): React.JSX.Element {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(selectSeparatorVariants({ className }))}
      ref={ref}
      {...props}
    />
  );
}
