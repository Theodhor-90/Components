import { useMediaQuery } from '@components/hooks';

import { cn } from '../../lib/utils.js';
import { ScrollArea } from '../scroll-area/scroll-area.js';
import { Sheet, SheetContent } from '../sheet/sheet.js';
import { SidebarContent, SidebarProvider, useSidebar } from '../sidebar/sidebar.js';
import { appLayoutVariants } from './app-layout.styles.js';
import type { AppLayoutProps } from './app-layout.types.js';

export type { AppLayoutProps } from './app-layout.types.js';

export function AppLayout({
  className,
  sidebar,
  header,
  children,
  defaultOpen,
  open,
  onOpenChange,
  ref,
  ...props
}: AppLayoutProps): React.JSX.Element {
  return (
    <SidebarProvider defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
      <AppLayoutInner className={className} sidebar={sidebar} header={header} ref={ref} {...props}>
        {children}
      </AppLayoutInner>
    </SidebarProvider>
  );
}

function AppLayoutInner({
  className,
  sidebar,
  header,
  children,
  ref,
  ...props
}: Omit<AppLayoutProps, 'defaultOpen' | 'open' | 'onOpenChange'>): React.JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { open, toggleSidebar } = useSidebar();

  return (
    <div
      data-slot="app-layout"
      className={cn(appLayoutVariants({ className }))}
      ref={ref}
      {...props}
    >
      {isDesktop ? (
        <SidebarContent>{sidebar}</SidebarContent>
      ) : (
        <Sheet
          open={open}
          onOpenChange={(sheetOpen) => {
            if (sheetOpen !== open) toggleSidebar();
          }}
        >
          <SheetContent side="left" className="w-64 p-0">
            {sidebar}
          </SheetContent>
        </Sheet>
      )}
      <div className="flex flex-1 flex-col overflow-hidden">
        {header}
        <ScrollArea className="flex-1">{children}</ScrollArea>
      </div>
    </div>
  );
}
