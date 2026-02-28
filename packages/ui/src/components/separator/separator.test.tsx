import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Separator } from './separator.js';

describe('Separator', () => {
  it('renders with default props', () => {
    render(<Separator />);
    // Decorative separators get role="none" from Radix
    expect(screen.getByRole('none')).toBeInTheDocument();
  });

  it('renders as horizontal by default', () => {
    render(<Separator data-testid="sep" />);
    const el = screen.getByTestId('sep');
    expect(el).toHaveClass('h-px');
    expect(el).toHaveClass('w-full');
  });

  it('renders as vertical when orientation is vertical', () => {
    render(<Separator orientation="vertical" data-testid="sep" />);
    const el = screen.getByTestId('sep');
    expect(el).toHaveClass('h-full');
    expect(el).toHaveClass('w-px');
  });

  it('has role="separator" when not decorative', () => {
    render(<Separator decorative={false} />);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('has aria-orientation when vertical and non-decorative', () => {
    render(<Separator orientation="vertical" decorative={false} />);
    const el = screen.getByRole('separator');
    expect(el).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('merges custom className', () => {
    render(<Separator className="my-4" data-testid="sep" />);
    const el = screen.getByTestId('sep');
    expect(el).toHaveClass('my-4');
    expect(el).toHaveClass('bg-border');
  });

  it('has data-slot attribute', () => {
    render(<Separator data-testid="sep" />);
    expect(screen.getByTestId('sep')).toHaveAttribute('data-slot', 'separator');
  });

  it('renders as child element when asChild is true', () => {
    render(
      <Separator asChild>
        <hr data-testid="sep" />
      </Separator>,
    );
    const el = screen.getByTestId('sep');
    expect(el.tagName).toBe('HR');
    expect(el).toHaveClass('shrink-0');
    expect(el).toHaveAttribute('data-slot', 'separator');
  });

  it('supports click and keyboard interaction via asChild', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Separator asChild>
        <button type="button" onClick={onClick}>
          Trigger
        </button>
      </Separator>,
    );

    const button = screen.getByText('Trigger');
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);

    button.focus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <div>
        <p>Above</p>
        <Separator />
        <p>Below</p>
      </div>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
