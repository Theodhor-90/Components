import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Label } from '../label/label.js';
import { Checkbox } from './checkbox.js';

describe('Checkbox', () => {
  it('renders without crashing', () => {
    render(<Checkbox aria-label="Test checkbox" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<Checkbox aria-label="Test checkbox" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-slot', 'checkbox');
  });

  it('merges custom className', () => {
    render(<Checkbox aria-label="Test checkbox" className="custom-class" />);
    expect(screen.getByRole('checkbox')).toHaveClass('custom-class');
  });

  it('toggles checked state on click', async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="Test checkbox" />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');

    await user.click(checkbox);
    expect(checkbox).toHaveAttribute('data-state', 'checked');
    expect(checkbox).toBeChecked();
  });

  it('supports indeterminate state', () => {
    render(<Checkbox checked="indeterminate" aria-label="Test checkbox" />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('data-state', 'indeterminate');
    expect(document.querySelector('path[d="M5 12h14"]')).toBeInTheDocument();
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox disabled onCheckedChange={onCheckedChange} aria-label="Test checkbox" />);

    await user.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('supports controlled usage', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox checked={false} onCheckedChange={onCheckedChange} aria-label="Controlled" />);

    await user.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('supports uncontrolled usage', async () => {
    const user = userEvent.setup();
    render(<Checkbox defaultChecked aria-label="Uncontrolled" />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('works with Label', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Checkbox id="test-cb" />
        <Label htmlFor="test-cb">Accept</Label>
      </div>,
    );

    await user.click(screen.getByText('Accept'));
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Checkbox ref={ref} aria-label="Ref checkbox" />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('has no accessibility violations (default)', async () => {
    const { container } = render(<Checkbox aria-label="Accessible checkbox" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no accessibility violations (checked)', async () => {
    const { container } = render(<Checkbox defaultChecked aria-label="Accessible checkbox" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no accessibility violations (indeterminate)', async () => {
    const { container } = render(
      <Checkbox checked="indeterminate" aria-label="Accessible checkbox" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
