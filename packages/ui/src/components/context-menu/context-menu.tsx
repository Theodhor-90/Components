import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';

import { cn } from '../../lib/utils.js';
import {
  contextMenuCheckboxItemStyles,
  contextMenuContentStyles,
  contextMenuItemVariants,
  contextMenuLabelVariants,
  contextMenuRadioItemStyles,
  contextMenuSeparatorStyles,
  contextMenuShortcutStyles,
  contextMenuSubContentStyles,
  contextMenuSubTriggerStyles,
} from './context-menu.styles.js';
import type {
  ContextMenuCheckboxItemProps,
  ContextMenuContentProps,
  ContextMenuItemProps,
  ContextMenuLabelProps,
  ContextMenuRadioItemProps,
  ContextMenuSeparatorProps,
  ContextMenuShortcutProps,
  ContextMenuSubContentProps,
  ContextMenuSubTriggerProps,
  ContextMenuTriggerProps,
} from './context-menu.types.js';

export type {
  ContextMenuCheckboxItemProps,
  ContextMenuContentProps,
  ContextMenuGroupProps,
  ContextMenuItemProps,
  ContextMenuLabelProps,
  ContextMenuPortalProps,
  ContextMenuProps,
  ContextMenuRadioGroupProps,
  ContextMenuRadioItemProps,
  ContextMenuSeparatorProps,
  ContextMenuShortcutProps,
  ContextMenuSubContentProps,
  ContextMenuSubProps,
  ContextMenuSubTriggerProps,
  ContextMenuTriggerProps,
} from './context-menu.types.js';

export const ContextMenu = ContextMenuPrimitive.Root;

export function ContextMenuTrigger({
  className,
  ref,
  ...props
}: ContextMenuTriggerProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.Trigger
      data-slot="context-menu-trigger"
      className={cn(className)}
      ref={ref}
      {...props}
    />
  );
}

export const ContextMenuPortal = ContextMenuPrimitive.Portal;

export function ContextMenuContent({
  className,
  alignOffset = -4,
  ref,
  ...props
}: ContextMenuContentProps): React.JSX.Element {
  return (
    <ContextMenuPortal>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        alignOffset={alignOffset}
        className={cn(contextMenuContentStyles, className)}
        ref={ref}
        {...props}
      />
    </ContextMenuPortal>
  );
}

export const ContextMenuGroup = ContextMenuPrimitive.Group;

export function ContextMenuItem({
  className,
  variant,
  inset,
  ref,
  ...props
}: ContextMenuItemProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      className={cn(contextMenuItemVariants({ variant, inset, className }))}
      ref={ref}
      {...props}
    />
  );
}

export function ContextMenuCheckboxItem({
  className,
  children,
  ref,
  ...props
}: ContextMenuCheckboxItemProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      className={cn(contextMenuCheckboxItemStyles, className)}
      ref={ref}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
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
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}

export function ContextMenuRadioItem({
  className,
  children,
  ref,
  ...props
}: ContextMenuRadioItemProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      className={cn(contextMenuRadioItemStyles, className)}
      ref={ref}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
          >
            <circle cx="7.5" cy="7.5" r="3.5" fill="currentColor" />
          </svg>
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}

export const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

export function ContextMenuLabel({
  className,
  inset,
  ref,
  ...props
}: ContextMenuLabelProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.Label
      data-slot="context-menu-label"
      className={cn(contextMenuLabelVariants({ inset, className }))}
      ref={ref}
      {...props}
    />
  );
}

export function ContextMenuSeparator({
  className,
  ref,
  ...props
}: ContextMenuSeparatorProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn(contextMenuSeparatorStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export const ContextMenuSub = ContextMenuPrimitive.Sub;

export function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ref,
  ...props
}: ContextMenuSubTriggerProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.SubTrigger
      data-slot="context-menu-sub-trigger"
      className={cn(contextMenuSubTriggerStyles, inset && 'pl-8', className)}
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
    </ContextMenuPrimitive.SubTrigger>
  );
}

export function ContextMenuSubContent({
  className,
  ref,
  ...props
}: ContextMenuSubContentProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.SubContent
      data-slot="context-menu-sub-content"
      className={cn(contextMenuSubContentStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function ContextMenuShortcut({
  className,
  ref,
  ...props
}: ContextMenuShortcutProps): React.JSX.Element {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(contextMenuShortcutStyles, className)}
      ref={ref}
      {...props}
    />
  );
}
