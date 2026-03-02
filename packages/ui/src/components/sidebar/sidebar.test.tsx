import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from './sidebar.js';
import type { SidebarProviderProps } from './sidebar.types.js';

function TestSidebar(props: Partial<SidebarProviderProps>) {
  return (
    <SidebarProvider {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>Settings</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <main className="flex-1">
        <SidebarTrigger />
        <p>Main content</p>
      </main>
    </SidebarProvider>
  );
}

describe('Sidebar', () => {
  it('renders sidebar with content', () => {
    render(<TestSidebar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('toggles collapse state on SidebarTrigger click', async () => {
    const user = userEvent.setup();
    render(<TestSidebar />);

    const trigger = screen.getByLabelText('Toggle Sidebar');
    const aside = document.querySelector('[data-slot="sidebar-content"]')!;

    expect(aside).not.toHaveClass('w-0');
    await user.click(trigger);
    expect(aside).toHaveClass('w-0');
  });

  it('keyboard shortcut Cmd+B toggles sidebar', () => {
    render(<TestSidebar />);
    const aside = document.querySelector('[data-slot="sidebar-content"]')!;

    expect(aside).not.toHaveClass('w-0');

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'b', metaKey: true, bubbles: true }),
      );
    });
    expect(aside).toHaveClass('w-0');

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'b', metaKey: true, bubbles: true }),
      );
    });
    expect(aside).not.toHaveClass('w-0');
  });

  it('keyboard shortcut Ctrl+B toggles sidebar', () => {
    render(<TestSidebar />);
    const aside = document.querySelector('[data-slot="sidebar-content"]')!;

    expect(aside).not.toHaveClass('w-0');

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'b', ctrlKey: true, bubbles: true }),
      );
    });
    expect(aside).toHaveClass('w-0');
  });

  it('menu button renders active state via data-active', () => {
    render(
      <SidebarProvider>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>Active</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </SidebarProvider>,
    );

    const button = screen.getByText('Active');
    expect(button).toHaveAttribute('data-active', '');
    expect(button).toHaveClass('bg-sidebar-primary');
  });

  it('menu button applies variant classes', () => {
    render(
      <SidebarProvider>
        <SidebarContent>
          <SidebarMenuButton variant="outline">Outline</SidebarMenuButton>
        </SidebarContent>
      </SidebarProvider>,
    );

    const button = screen.getByText('Outline');
    expect(button.className).toMatch(/shadow-/);
  });

  it('menu button applies size classes', () => {
    render(
      <SidebarProvider>
        <SidebarContent>
          <SidebarMenuButton size="lg">Large</SidebarMenuButton>
        </SidebarContent>
      </SidebarProvider>,
    );

    const button = screen.getByText('Large');
    expect(button).toHaveClass('h-12');
  });

  it('SidebarMenuButton asChild renders custom element', () => {
    render(
      <SidebarProvider>
        <SidebarContent>
          <SidebarMenuButton asChild>
            <a href="/dashboard">Dashboard</a>
          </SidebarMenuButton>
        </SidebarContent>
      </SidebarProvider>,
    );

    const link = screen.getByRole('link', { name: 'Dashboard' });
    expect(link).toHaveAttribute('data-slot', 'sidebar-menu-button');
  });

  it('SidebarGroupLabel asChild renders custom element', () => {
    render(
      <SidebarProvider>
        <SidebarContent>
          <SidebarGroupLabel asChild>
            <h3>Navigation</h3>
          </SidebarGroupLabel>
        </SidebarContent>
      </SidebarProvider>,
    );

    const heading = screen.getByRole('heading', { name: 'Navigation' });
    expect(heading).toHaveAttribute('data-slot', 'sidebar-group-label');
  });

  it('useSidebar provides context', () => {
    function Consumer() {
      const { open } = useSidebar();
      return <span>{String(open)}</span>;
    }

    render(
      <SidebarProvider>
        <Consumer />
      </SidebarProvider>,
    );

    expect(screen.getByText('true')).toBeInTheDocument();
  });

  it('useSidebar throws outside SidebarProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    function Consumer() {
      useSidebar();
      return null;
    }

    expect(() => render(<Consumer />)).toThrow('useSidebar must be used within a SidebarProvider');

    consoleSpy.mockRestore();
  });

  it('data-slot attributes present on all sub-components', () => {
    render(<TestSidebar />);

    expect(document.querySelector('[data-slot="sidebar-provider"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="sidebar-trigger"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="sidebar-content"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="sidebar-group"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="sidebar-group-label"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="sidebar-menu"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="sidebar-menu-item"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="sidebar-menu-button"]')).toBeInTheDocument();
  });

  it('className merging works', () => {
    render(
      <SidebarProvider className="custom-provider">
        <SidebarContent className="custom-content">
          <SidebarMenuButton className="custom-button">Test</SidebarMenuButton>
        </SidebarContent>
      </SidebarProvider>,
    );

    const provider = document.querySelector('[data-slot="sidebar-provider"]')!;
    expect(provider).toHaveClass('custom-provider');
    expect(provider).toHaveClass('flex');

    const content = document.querySelector('[data-slot="sidebar-content"]')!;
    expect(content).toHaveClass('custom-content');
    expect(content).toHaveClass('bg-sidebar-background');

    const button = screen.getByText('Test');
    expect(button).toHaveClass('custom-button');
  });

  it('controlled mode with open and onOpenChange', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(<TestSidebar open={true} onOpenChange={onOpenChange} />);

    const trigger = screen.getByLabelText('Toggle Sidebar');
    await user.click(trigger);

    expect(onOpenChange).toHaveBeenCalledWith(false);

    const aside = document.querySelector('[data-slot="sidebar-content"]')!;
    expect(aside).not.toHaveClass('w-0');
  });

  it('sidebar uses sidebar-* token classes', () => {
    render(<TestSidebar />);

    const aside = document.querySelector('[data-slot="sidebar-content"]')!;
    expect(aside).toHaveClass('bg-sidebar-background');
    expect(aside).toHaveClass('text-sidebar-foreground');
    expect(aside).toHaveClass('border-sidebar-border');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<TestSidebar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
