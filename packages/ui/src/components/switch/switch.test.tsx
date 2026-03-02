import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Label } from '../label/label.js';
import { Switch } from './switch.js';

describe('Switch', () => {
  it('renders without crashing', () => {
    render(<Switch aria-label="Test switch" />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<Switch aria-label="Test switch" />);
    expect(screen.getByRole('switch')).toHaveAttribute('data-slot', 'switch');
  });

  it('merges custom className', () => {
    render(<Switch aria-label="Test switch" className="custom-class" />);
    expect(screen.getByRole('switch')).toHaveClass('custom-class');
  });

  it('toggles checked state on click', async () => {
    const user = userEvent.setup();
    render(<Switch aria-label="Test switch" />);

    const switchEl = screen.getByRole('switch');
    expect(switchEl).toHaveAttribute('data-state', 'unchecked');

    await user.click(switchEl);
    expect(switchEl).toHaveAttribute('data-state', 'checked');
    expect(switchEl).toHaveAttribute('aria-checked', 'true');
  });

  it('toggles state with Space key', async () => {
    const user = userEvent.setup();
    render(<Switch aria-label="Test switch" />);

    const switchEl = screen.getByRole('switch');
    switchEl.focus();
    await user.keyboard(' ');

    expect(switchEl).toHaveAttribute('data-state', 'checked');
    expect(switchEl).toHaveAttribute('aria-checked', 'true');
  });

  it('has role="switch" with correct aria-checked', () => {
    render(<Switch defaultChecked aria-label="Test switch" />);

    const switchEl = screen.getByRole('switch');
    expect(switchEl).toHaveAttribute('role', 'switch');
    expect(switchEl).toHaveAttribute('aria-checked', 'true');
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch disabled onCheckedChange={onCheckedChange} aria-label="Test switch" />);

    const switchEl = screen.getByRole('switch');
    expect(switchEl).toHaveAttribute('data-state', 'unchecked');

    await user.click(switchEl);
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(switchEl).toHaveAttribute('data-state', 'unchecked');
  });

  it('supports controlled usage', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch checked={false} onCheckedChange={onCheckedChange} aria-label="Controlled" />);

    await user.click(screen.getByRole('switch'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('supports uncontrolled usage', async () => {
    const user = userEvent.setup();
    render(<Switch defaultChecked aria-label="Uncontrolled" />);

    const switchEl = screen.getByRole('switch');
    expect(switchEl).toHaveAttribute('data-state', 'checked');
    expect(switchEl).toHaveAttribute('aria-checked', 'true');

    await user.click(switchEl);
    expect(switchEl).toHaveAttribute('data-state', 'unchecked');
    expect(switchEl).toHaveAttribute('aria-checked', 'false');
  });

  it('works with Label', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Switch id="test-switch" />
        <Label htmlFor="test-switch">Enable setting</Label>
      </div>,
    );

    await user.click(screen.getByText('Enable setting'));
    expect(screen.getByRole('switch')).toHaveAttribute('data-state', 'checked');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Switch ref={ref} aria-label="Ref switch" />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('has no accessibility violations (default)', async () => {
    const { container } = render(<Switch aria-label="Accessible switch" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no accessibility violations (checked)', async () => {
    const { container } = render(<Switch defaultChecked aria-label="Accessible switch" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
