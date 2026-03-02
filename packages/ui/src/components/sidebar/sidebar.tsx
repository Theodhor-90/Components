import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '../../lib/utils.js';
import { Button } from '../button/button.js';
import { ScrollArea } from '../scroll-area/scroll-area.js';
import {
  sidebarContentCollapsedStyles,
  sidebarContentInnerStyles,
  sidebarContentStyles,
  sidebarGroupLabelStyles,
  sidebarGroupStyles,
  sidebarMenuButtonActiveStyles,
  sidebarMenuButtonVariants,
  sidebarMenuItemStyles,
  sidebarMenuStyles,
  sidebarProviderStyles,
} from './sidebar.styles.js';
import type {
  SidebarContentProps,
  SidebarGroupLabelProps,
  SidebarGroupProps,
  SidebarMenuButtonProps,
  SidebarMenuItemProps,
  SidebarMenuProps,
  SidebarProviderProps,
  SidebarTriggerProps,
} from './sidebar.types.js';

export type {
  SidebarContentProps,
  SidebarGroupLabelProps,
  SidebarGroupProps,
  SidebarMenuButtonProps,
  SidebarMenuItemProps,
  SidebarMenuProps,
  SidebarProviderProps,
  SidebarTriggerProps,
} from './sidebar.types.js';

const SidebarContext = React.createContext<{
  open: boolean;
  toggleSidebar: () => void;
} | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

export function SidebarProvider({
  className,
  children,
  defaultOpen,
  open,
  onOpenChange,
  ref,
  ...props
}: SidebarProviderProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? true);
  const isControlled = open !== undefined;
  const resolvedOpen = isControlled ? open : uncontrolledOpen;

  const toggleSidebar = useCallback(() => {
    const next = !resolvedOpen;
    if (!isControlled) {
      setUncontrolledOpen(next);
    }
    onOpenChange?.(next);
  }, [resolvedOpen, isControlled, onOpenChange]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'b' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  return (
    <SidebarContext.Provider value={{ open: resolvedOpen, toggleSidebar }}>
      <div
        data-slot="sidebar-provider"
        className={cn(sidebarProviderStyles, className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function SidebarTrigger({ className, onClick, ref, ...props }: SidebarTriggerProps) {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={className}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        toggleSidebar();
      }}
      ref={ref}
      aria-label="Toggle Sidebar"
      {...props}
    >
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
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M9 3v18" />
      </svg>
    </Button>
  );
}

export function SidebarContent({ className, children, ref, ...props }: SidebarContentProps) {
  const { open } = useSidebar();
  return (
    <aside
      data-slot="sidebar-content"
      className={cn(sidebarContentStyles, !open && sidebarContentCollapsedStyles, className)}
      ref={ref}
      {...props}
    >
      <ScrollArea className={sidebarContentInnerStyles}>{children}</ScrollArea>
    </aside>
  );
}

export function SidebarGroup({ className, ref, ...props }: SidebarGroupProps) {
  return (
    <div
      data-slot="sidebar-group"
      className={cn(sidebarGroupStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function SidebarGroupLabel({
  className,
  asChild = false,
  ref,
  ...props
}: SidebarGroupLabelProps) {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      data-slot="sidebar-group-label"
      className={cn(sidebarGroupLabelStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function SidebarMenu({ className, ref, ...props }: SidebarMenuProps) {
  return (
    <ul
      data-slot="sidebar-menu"
      className={cn(sidebarMenuStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function SidebarMenuItem({ className, ref, ...props }: SidebarMenuItemProps) {
  return (
    <li
      data-slot="sidebar-menu-item"
      className={cn(sidebarMenuItemStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function SidebarMenuButton({
  className,
  asChild = false,
  variant,
  size,
  isActive = false,
  ref,
  ...props
}: SidebarMenuButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      data-slot="sidebar-menu-button"
      data-active={isActive ? '' : undefined}
      className={cn(
        sidebarMenuButtonVariants({ variant, size }),
        isActive && sidebarMenuButtonActiveStyles,
        className,
      )}
      ref={ref}
      {...props}
    />
  );
}
