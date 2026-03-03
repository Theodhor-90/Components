import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

import { cn } from '../../lib/utils.js';
import {
  dropdownMenuCheckboxItemStyles,
  dropdownMenuContentStyles,
  dropdownMenuItemVariants,
  dropdownMenuLabelVariants,
  dropdownMenuRadioItemStyles,
  dropdownMenuSeparatorStyles,
  dropdownMenuShortcutStyles,
  dropdownMenuSubContentStyles,
  dropdownMenuSubTriggerStyles,
} from './dropdown-menu.styles.js';
import type {
  DropdownMenuCheckboxItemProps,
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuLabelProps,
  DropdownMenuRadioItemProps,
  DropdownMenuSeparatorProps,
  DropdownMenuShortcutProps,
  DropdownMenuSubContentProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuTriggerProps,
} from './dropdown-menu.types.js';

export type {
  DropdownMenuCheckboxItemProps,
  DropdownMenuContentProps,
  DropdownMenuGroupProps,
  DropdownMenuItemProps,
  DropdownMenuLabelProps,
  DropdownMenuPortalProps,
  DropdownMenuProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuSeparatorProps,
  DropdownMenuShortcutProps,
  DropdownMenuSubContentProps,
  DropdownMenuSubProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuTriggerProps,
} from './dropdown-menu.types.js';

export const DropdownMenu = DropdownMenuPrimitive.Root;

export function DropdownMenuTrigger({
  className,
  ref,
  ...props
}: DropdownMenuTriggerProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      className={cn(className)}
      ref={ref}
      {...props}
    />
  );
}

export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

export function DropdownMenuContent({
  className,
  sideOffset = 4,
  ref,
  ...props
}: DropdownMenuContentProps): React.JSX.Element {
  return (
    <DropdownMenuPortal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(dropdownMenuContentStyles, className)}
        ref={ref}
        {...props}
      />
    </DropdownMenuPortal>
  );
}

export const DropdownMenuGroup = DropdownMenuPrimitive.Group;

export function DropdownMenuItem({
  className,
  variant,
  inset,
  ref,
  ...props
}: DropdownMenuItemProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={cn(dropdownMenuItemVariants({ variant, inset, className }))}
      ref={ref}
      {...props}
    />
  );
}

export function DropdownMenuCheckboxItem({
  className,
  children,
  ref,
  ...props
}: DropdownMenuCheckboxItemProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(dropdownMenuCheckboxItemStyles, className)}
      ref={ref}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
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
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

export function DropdownMenuRadioItem({
  className,
  children,
  ref,
  ...props
}: DropdownMenuRadioItemProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(dropdownMenuRadioItemStyles, className)}
      ref={ref}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
          >
            <circle cx="7.5" cy="7.5" r="3.5" fill="currentColor" />
          </svg>
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

export function DropdownMenuLabel({
  className,
  inset,
  ref,
  ...props
}: DropdownMenuLabelProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      className={cn(dropdownMenuLabelVariants({ inset, className }))}
      ref={ref}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({
  className,
  ref,
  ...props
}: DropdownMenuSeparatorProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn(dropdownMenuSeparatorStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export const DropdownMenuSub = DropdownMenuPrimitive.Sub;

export function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ref,
  ...props
}: DropdownMenuSubTriggerProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      className={cn(dropdownMenuSubTriggerStyles, inset && 'pl-8', className)}
      ref={ref}
      {...props}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        className="ml-auto"
      >
        <path
          d="M6.1584 3.13555C6.01196 2.98911 5.77452 2.98911 5.62807 3.13555C5.48163 3.282 5.48163 3.51943 5.62807 3.66588L9.46219 7.5L5.62807 11.3341C5.48163 11.4806 5.48163 11.718 5.62807 11.8644C5.77452 12.0109 6.01196 12.0109 6.1584 11.8644L10.257 7.76585C10.4034 7.6194 10.4034 7.38197 10.257 7.23552L6.1584 3.13555Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    </DropdownMenuPrimitive.SubTrigger>
  );
}

export function DropdownMenuSubContent({
  className,
  ref,
  ...props
}: DropdownMenuSubContentProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(dropdownMenuSubContentStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function DropdownMenuShortcut({
  className,
  ref,
  ...props
}: DropdownMenuShortcutProps): React.JSX.Element {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(dropdownMenuShortcutStyles, className)}
      ref={ref}
      {...props}
    />
  );
}
