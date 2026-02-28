import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Badge } from './badge.js';

describe('Badge', () => {
  it('renders with default props', () => {
    render(<Badge>Status</Badge>);
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('applies default variant classes', () => {
    render(<Badge data-testid="badge">Default</Badge>);
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('bg-primary');
    expect(badge).toHaveClass('text-primary-foreground');
  });

  it('applies secondary variant classes', () => {
    render(
      <Badge variant="secondary" data-testid="badge">
        Secondary
      </Badge>,
    );
    expect(screen.getByTestId('badge')).toHaveClass('bg-secondary');
  });

  it('applies destructive variant classes', () => {
    render(
      <Badge variant="destructive" data-testid="badge">
        Destructive
      </Badge>,
    );
    expect(screen.getByTestId('badge')).toHaveClass('bg-destructive');
  });

  it('applies outline variant classes', () => {
    render(
      <Badge variant="outline" data-testid="badge">
        Outline
      </Badge>,
    );
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('text-foreground');
    expect(badge).not.toHaveClass('border-transparent');
  });

  it('renders as child element when asChild is true', () => {
    render(
      <Badge asChild>
        <a href="/test">Link badge</a>
      </Badge>,
    );
    const link = screen.getByRole('link', { name: 'Link badge' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/test');
    expect(link).toHaveAttribute('data-slot', 'badge');
    expect(link).toHaveClass('inline-flex');
  });

  it('handles click events when rendered as an interactive child', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Badge asChild>
        <button type="button" onClick={onClick}>
          Clickable badge
        </button>
      </Badge>,
    );

    await user.click(screen.getByRole('button', { name: 'Clickable badge' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('supports keyboard activation when rendered as an interactive child', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Badge asChild>
        <button type="button" onClick={onClick}>
          Keyboard badge
        </button>
      </Badge>,
    );

    const button = screen.getByRole('button', { name: 'Keyboard badge' });
    button.focus();
    await user.keyboard('{Enter}');

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('merges custom className', () => {
    render(
      <Badge className="custom-class" data-testid="badge">
        Styled
      </Badge>,
    );
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('custom-class');
    expect(badge).toHaveClass('inline-flex');
  });

  it('has data-slot attribute', () => {
    render(<Badge data-testid="badge">Slotted</Badge>);
    expect(screen.getByTestId('badge')).toHaveAttribute('data-slot', 'badge');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Badge>Accessible</Badge>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
