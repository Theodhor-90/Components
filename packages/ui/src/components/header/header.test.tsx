import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Header } from './header.js';

describe('Header', () => {
  it('renders with default props', () => {
    render(<Header>Title</Header>);
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent('Title');
  });

  it('has data-slot attribute', () => {
    render(<Header>Title</Header>);
    expect(screen.getByRole('banner')).toHaveAttribute('data-slot', 'header');
  });

  it('renders children in the left region', () => {
    render(
      <Header>
        <span data-testid="title">My App</span>
      </Header>,
    );
    expect(screen.getByTestId('title')).toBeInTheDocument();
  });

  it('renders actions slot', () => {
    render(<Header actions={<button>Save</button>}>Title</Header>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('renders userInfo slot', () => {
    render(<Header userInfo={<span>John</span>}>Title</Header>);
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('renders Separator when both actions and userInfo are provided', () => {
    render(
      <Header actions={<button>Act</button>} userInfo={<span>User</span>}>
        T
      </Header>,
    );
    expect(screen.getByRole('none')).toBeInTheDocument();
  });

  it('does not render Separator when only actions is provided', () => {
    render(<Header actions={<button>Act</button>}>T</Header>);
    expect(screen.queryByRole('none')).not.toBeInTheDocument();
  });

  it('does not render Separator when only userInfo is provided', () => {
    render(<Header userInfo={<span>User</span>}>T</Header>);
    expect(screen.queryByRole('none')).not.toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(<Header className="custom-class">T</Header>);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('custom-class');
    expect(header).toHaveClass('bg-background');
  });

  it('renders as child element when asChild is true', () => {
    render(
      <Header asChild>
        <div data-testid="custom">Content</div>
      </Header>,
    );
    const el = screen.getByTestId('custom');
    expect(el).toHaveAttribute('data-slot', 'header');
    expect(el.tagName).toBe('DIV');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Header>App Title</Header>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
