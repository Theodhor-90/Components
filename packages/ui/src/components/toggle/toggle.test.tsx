import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Toggle } from './toggle.js';

describe('Toggle', () => {
  it('renders without crashing', () => {
    render(<Toggle aria-label="Test toggle">Toggle</Toggle>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<Toggle aria-label="Test toggle">Toggle</Toggle>);
    expect(screen.getByRole('button')).toHaveAttribute('data-slot', 'toggle');
  });

  it('merges custom className', () => {
    render(
      <Toggle aria-label="Test toggle" className="custom-class">
        Toggle
      </Toggle>,
    );
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('renders default variant by default', () => {
    render(<Toggle aria-label="Default variant">Toggle</Toggle>);
    const toggle = screen.getByRole('button');

    expect(toggle).toHaveClass('bg-transparent');
    expect(toggle).toHaveClass('h-10');
  });

  it('renders outline variant', () => {
    render(
      <Toggle variant="outline" aria-label="Outline variant">
        Toggle
      </Toggle>,
    );
    const toggle = screen.getByRole('button');

    expect(toggle).toHaveClass('border');
    expect(toggle).toHaveClass('border-input');
  });

  it('renders sm size', () => {
    render(
      <Toggle size="sm" aria-label="Small toggle">
        Toggle
      </Toggle>,
    );
    expect(screen.getByRole('button')).toHaveClass('h-9');
  });

  it('renders lg size', () => {
    render(
      <Toggle size="lg" aria-label="Large toggle">
        Toggle
      </Toggle>,
    );
    expect(screen.getByRole('button')).toHaveClass('h-11');
  });

  it('toggles data-state on click', async () => {
    const user = userEvent.setup();
    render(<Toggle aria-label="State toggle">Toggle</Toggle>);

    const toggle = screen.getByRole('button');
    expect(toggle).toHaveAttribute('data-state', 'off');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('data-state', 'on');
  });

  it('has aria-pressed reflecting state', async () => {
    const user = userEvent.setup();
    render(<Toggle aria-label="Aria toggle">Toggle</Toggle>);

    const toggle = screen.getByRole('button');
    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <Toggle disabled onPressedChange={onPressedChange} aria-label="Disabled toggle">
        Toggle
      </Toggle>,
    );

    const toggle = screen.getByRole('button');
    await user.click(toggle);

    expect(onPressedChange).not.toHaveBeenCalled();
    expect(toggle).toHaveAttribute('data-state', 'off');
  });

  it('supports controlled usage', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <Toggle pressed={false} onPressedChange={onPressedChange} aria-label="Controlled toggle">
        Toggle
      </Toggle>,
    );

    await user.click(screen.getByRole('button'));
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it('supports uncontrolled usage', async () => {
    const user = userEvent.setup();
    render(
      <Toggle defaultPressed aria-label="Uncontrolled toggle">
        Toggle
      </Toggle>,
    );

    const toggle = screen.getByRole('button');
    expect(toggle).toHaveAttribute('data-state', 'on');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('data-state', 'off');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Toggle ref={ref} aria-label="Ref toggle">
        Toggle
      </Toggle>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('has no accessibility violations (default)', async () => {
    const { container } = render(<Toggle aria-label="Accessible toggle">Toggle</Toggle>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no accessibility violations (pressed)', async () => {
    const { container } = render(
      <Toggle defaultPressed aria-label="Accessible pressed toggle">
        Toggle
      </Toggle>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
