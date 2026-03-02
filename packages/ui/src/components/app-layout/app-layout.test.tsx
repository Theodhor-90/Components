import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { useMediaQuery } from '@components/hooks';

import { SidebarTrigger } from '../sidebar/sidebar.js';
import { AppLayout } from './app-layout.js';

vi.mock('@components/hooks', () => ({
  useMediaQuery: vi.fn(),
}));

const mockedUseMediaQuery = vi.mocked(useMediaQuery);

describe('AppLayout', () => {
  it('renders with default props', () => {
    mockedUseMediaQuery.mockReturnValue(true);
    render(<AppLayout>Content</AppLayout>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    mockedUseMediaQuery.mockReturnValue(true);
    render(<AppLayout>Content</AppLayout>);
    expect(document.querySelector('[data-slot="app-layout"]')).toBeInTheDocument();
  });

  it('renders sidebar content on desktop', () => {
    mockedUseMediaQuery.mockReturnValue(true);
    render(<AppLayout sidebar={<nav data-testid="sidebar-nav">Nav</nav>}>Content</AppLayout>);
    expect(screen.getByTestId('sidebar-nav')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="sidebar-content"]')).toBeInTheDocument();
  });

  it('renders sidebar in Sheet on mobile', () => {
    mockedUseMediaQuery.mockReturnValue(false);
    render(<AppLayout sidebar={<nav data-testid="sidebar-nav">Nav</nav>}>Content</AppLayout>);
    expect(document.querySelector('[data-slot="sheet-content"]')).toBeInTheDocument();
  });

  it('renders header when provided', () => {
    mockedUseMediaQuery.mockReturnValue(true);
    render(<AppLayout header={<header data-testid="app-header">Title</header>}>Content</AppLayout>);
    expect(screen.getByTestId('app-header')).toBeInTheDocument();
  });

  it('renders children in scrollable area', () => {
    mockedUseMediaQuery.mockReturnValue(true);
    render(
      <AppLayout>
        <div data-testid="main-content">Main</div>
      </AppLayout>,
    );
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="scroll-area"]')).toBeInTheDocument();
  });

  it('passes defaultOpen to SidebarProvider', () => {
    mockedUseMediaQuery.mockReturnValue(true);
    render(
      <AppLayout defaultOpen={false} sidebar={<nav>Nav</nav>}>
        Content
      </AppLayout>,
    );
    const sidebarContent = document.querySelector('[data-slot="sidebar-content"]');
    expect(sidebarContent).toHaveClass('w-0');
  });

  it('supports controlled sidebar state', async () => {
    mockedUseMediaQuery.mockReturnValue(true);
    const user = userEvent.setup();
    const onOpenChangeSpy = vi.fn();
    render(
      <AppLayout
        open={false}
        onOpenChange={onOpenChangeSpy}
        sidebar={<nav>Nav</nav>}
        header={<SidebarTrigger data-testid="toggle" />}
      >
        Content
      </AppLayout>,
    );
    const sidebarContent = document.querySelector('[data-slot="sidebar-content"]');
    expect(sidebarContent).toHaveClass('w-0');

    await user.click(screen.getByTestId('toggle'));
    expect(onOpenChangeSpy).toHaveBeenCalledWith(true);
  });

  it('merges custom className', () => {
    mockedUseMediaQuery.mockReturnValue(true);
    render(<AppLayout className="custom-class">Content</AppLayout>);
    const root = document.querySelector('[data-slot="app-layout"]');
    expect(root).toHaveClass('custom-class');
    expect(root).toHaveClass('flex');
  });

  it('has no accessibility violations', async () => {
    mockedUseMediaQuery.mockReturnValue(true);
    const { container } = render(
      <AppLayout
        sidebar={<nav aria-label="Main navigation">Nav</nav>}
        header={<header>Title</header>}
      >
        <main>Content</main>
      </AppLayout>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
