import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Label } from '../label/label.js';
import { RadioGroup, RadioGroupItem } from './radio-group.js';

describe('RadioGroup', () => {
  it('renders without crashing', () => {
    render(
      <RadioGroup aria-label="Test group">
        <RadioGroupItem value="option-a" aria-label="Option A" />
        <RadioGroupItem value="option-b" aria-label="Option B" />
        <RadioGroupItem value="option-c" aria-label="Option C" />
      </RadioGroup>,
    );

    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('has data-slot on RadioGroup', () => {
    render(
      <RadioGroup aria-label="Test group">
        <RadioGroupItem value="option-a" aria-label="Option A" />
        <RadioGroupItem value="option-b" aria-label="Option B" />
        <RadioGroupItem value="option-c" aria-label="Option C" />
      </RadioGroup>,
    );

    expect(screen.getByRole('radiogroup')).toHaveAttribute('data-slot', 'radio-group');
  });

  it('has data-slot on RadioGroupItem', () => {
    render(
      <RadioGroup aria-label="Test group">
        <RadioGroupItem value="option-a" aria-label="Option A" />
        <RadioGroupItem value="option-b" aria-label="Option B" />
        <RadioGroupItem value="option-c" aria-label="Option C" />
      </RadioGroup>,
    );

    const radios = screen.getAllByRole('radio');
    radios.forEach((radio) => {
      expect(radio).toHaveAttribute('data-slot', 'radio-group-item');
    });
  });

  it('merges custom className on RadioGroup', () => {
    render(
      <RadioGroup className="custom-group" aria-label="Test group">
        <RadioGroupItem value="option-a" aria-label="Option A" />
      </RadioGroup>,
    );

    expect(screen.getByRole('radiogroup')).toHaveClass('custom-group');
  });

  it('merges custom className on RadioGroupItem', () => {
    render(
      <RadioGroup aria-label="Test group">
        <RadioGroupItem value="option-a" className="custom-item" aria-label="Option A" />
      </RadioGroup>,
    );

    expect(screen.getByRole('radio')).toHaveClass('custom-item');
  });

  it('selects item on click (mutual exclusion)', async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup aria-label="Test group">
        <RadioGroupItem value="option-a" aria-label="Option A" />
        <RadioGroupItem value="option-b" aria-label="Option B" />
        <RadioGroupItem value="option-c" aria-label="Option C" />
      </RadioGroup>,
    );

    const optionA = screen.getByRole('radio', { name: 'Option A' });
    const optionB = screen.getByRole('radio', { name: 'Option B' });

    await user.click(optionA);
    await user.click(optionB);

    expect(optionA).toHaveAttribute('data-state', 'unchecked');
    expect(optionB).toHaveAttribute('data-state', 'checked');
  });

  it('navigates with arrow keys', async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup aria-label="Test group" defaultValue="option-a">
        <RadioGroupItem value="option-a" aria-label="Option A" />
        <RadioGroupItem value="option-b" aria-label="Option B" />
        <RadioGroupItem value="option-c" aria-label="Option C" />
      </RadioGroup>,
    );

    const optionA = screen.getByRole('radio', { name: 'Option A' });
    const optionB = screen.getByRole('radio', { name: 'Option B' });

    optionA.focus();
    await user.keyboard('{ArrowDown}');

    expect(optionB).toHaveFocus();
  });

  it('does not select when group is disabled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup disabled onValueChange={onValueChange} aria-label="Test group">
        <RadioGroupItem value="option-a" aria-label="Option A" />
        <RadioGroupItem value="option-b" aria-label="Option B" />
      </RadioGroup>,
    );

    const optionA = screen.getByRole('radio', { name: 'Option A' });
    await user.click(optionA);

    expect(optionA).toHaveAttribute('data-state', 'unchecked');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('does not select disabled individual item', async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup aria-label="Test group">
        <RadioGroupItem value="option-a" aria-label="Option A" />
        <RadioGroupItem value="option-b" disabled aria-label="Option B" />
        <RadioGroupItem value="option-c" aria-label="Option C" />
      </RadioGroup>,
    );

    const optionA = screen.getByRole('radio', { name: 'Option A' });
    const optionB = screen.getByRole('radio', { name: 'Option B' });

    await user.click(optionB);
    expect(optionB).toHaveAttribute('data-state', 'unchecked');

    await user.click(optionA);
    expect(optionA).toHaveAttribute('data-state', 'checked');
  });

  it('supports controlled usage', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup value="option-a" onValueChange={onValueChange} aria-label="Controlled group">
        <RadioGroupItem value="option-a" aria-label="Option A" />
        <RadioGroupItem value="option-b" aria-label="Option B" />
      </RadioGroup>,
    );

    await user.click(screen.getByRole('radio', { name: 'Option B' }));
    expect(onValueChange).toHaveBeenCalledWith('option-b');
  });

  it('supports uncontrolled usage', async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup defaultValue="option-b" aria-label="Uncontrolled group">
        <RadioGroupItem value="option-a" aria-label="Option A" />
        <RadioGroupItem value="option-b" aria-label="Option B" />
        <RadioGroupItem value="option-c" aria-label="Option C" />
      </RadioGroup>,
    );

    const optionB = screen.getByRole('radio', { name: 'Option B' });
    const optionC = screen.getByRole('radio', { name: 'Option C' });

    expect(optionB).toHaveAttribute('data-state', 'checked');

    await user.click(optionC);
    expect(optionC).toHaveAttribute('data-state', 'checked');
  });

  it('works with Label', async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup aria-label="Group with labels">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="option-a" id="option-a" />
          <Label htmlFor="option-a">Option A</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="option-b" id="option-b" />
          <Label htmlFor="option-b">Option B</Label>
        </div>
      </RadioGroup>,
    );

    await user.click(screen.getByText('Option A'));
    expect(screen.getByRole('radio', { name: 'Option A' })).toHaveAttribute(
      'data-state',
      'checked',
    );
  });

  it('forwards ref on RadioGroup', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <RadioGroup ref={ref} aria-label="Ref group">
        <RadioGroupItem value="option-a" aria-label="Option A" />
      </RadioGroup>,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('forwards ref on RadioGroupItem', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <RadioGroup aria-label="Ref item group">
        <RadioGroupItem ref={ref} value="option-a" aria-label="Option A" />
      </RadioGroup>,
    );

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('has no accessibility violations (default)', async () => {
    const { container } = render(
      <RadioGroup aria-label="Accessible group">
        <RadioGroupItem value="option-a" aria-label="Option A" />
        <RadioGroupItem value="option-b" aria-label="Option B" />
        <RadioGroupItem value="option-c" aria-label="Option C" />
      </RadioGroup>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no accessibility violations (checked)', async () => {
    const { container } = render(
      <RadioGroup defaultValue="option-b" aria-label="Accessible checked group">
        <RadioGroupItem value="option-a" aria-label="Option A" />
        <RadioGroupItem value="option-b" aria-label="Option B" />
        <RadioGroupItem value="option-c" aria-label="Option C" />
      </RadioGroup>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
