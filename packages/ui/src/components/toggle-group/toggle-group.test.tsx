import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { ToggleGroup, ToggleGroupItem } from './toggle-group.js';

describe('ToggleGroup', () => {
  it('renders without crashing', () => {
    render(
      <ToggleGroup type="single" aria-label="Text formatting">
        <ToggleGroupItem value="bold" aria-label="Bold">
          Bold
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          Italic
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          Underline
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('has data-slot on ToggleGroup', () => {
    render(
      <ToggleGroup type="single" aria-label="Text formatting">
        <ToggleGroupItem value="bold" aria-label="Bold">
          Bold
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    expect(screen.getByRole('group')).toHaveAttribute('data-slot', 'toggle-group');
  });

  it('has data-slot on ToggleGroupItem', () => {
    render(
      <ToggleGroup type="single" aria-label="Text formatting">
        <ToggleGroupItem value="bold" aria-label="Bold">
          Bold
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          Italic
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    const items = screen.getAllByRole('radio');
    items.forEach((item) => {
      expect(item).toHaveAttribute('data-slot', 'toggle-group-item');
    });
  });

  it('merges custom className on ToggleGroup', () => {
    render(
      <ToggleGroup type="single" className="custom-group" aria-label="Text formatting">
        <ToggleGroupItem value="bold" aria-label="Bold">
          Bold
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    expect(screen.getByRole('group')).toHaveClass('custom-group');
  });

  it('merges custom className on ToggleGroupItem', () => {
    render(
      <ToggleGroup type="single" aria-label="Text formatting">
        <ToggleGroupItem value="bold" className="custom-item" aria-label="Bold">
          Bold
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    expect(screen.getByRole('radio', { name: 'Bold' })).toHaveClass('custom-item');
  });

  it('type="single" allows only one active item', async () => {
    const user = userEvent.setup();
    render(
      <ToggleGroup type="single" aria-label="Text formatting">
        <ToggleGroupItem value="a" aria-label="Option A">
          A
        </ToggleGroupItem>
        <ToggleGroupItem value="b" aria-label="Option B">
          B
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    const itemA = screen.getByRole('radio', { name: 'Option A' });
    const itemB = screen.getByRole('radio', { name: 'Option B' });

    await user.click(itemA);
    expect(itemA).toHaveAttribute('data-state', 'on');

    await user.click(itemB);
    expect(itemB).toHaveAttribute('data-state', 'on');
    expect(itemA).toHaveAttribute('data-state', 'off');
  });

  it('type="multiple" allows multiple active items', async () => {
    const user = userEvent.setup();
    render(
      <ToggleGroup type="multiple" aria-label="Text formatting">
        <ToggleGroupItem value="a" aria-label="Option A">
          A
        </ToggleGroupItem>
        <ToggleGroupItem value="b" aria-label="Option B">
          B
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    const itemA = screen.getByRole('button', { name: 'Option A' });
    const itemB = screen.getByRole('button', { name: 'Option B' });

    await user.click(itemA);
    await user.click(itemB);

    expect(itemA).toHaveAttribute('data-state', 'on');
    expect(itemB).toHaveAttribute('data-state', 'on');
  });

  it('navigates between items with arrow keys', async () => {
    const user = userEvent.setup();
    render(
      <ToggleGroup type="single" defaultValue="a" aria-label="Text formatting">
        <ToggleGroupItem value="a" aria-label="Option A">
          A
        </ToggleGroupItem>
        <ToggleGroupItem value="b" aria-label="Option B">
          B
        </ToggleGroupItem>
        <ToggleGroupItem value="c" aria-label="Option C">
          C
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    const itemA = screen.getByRole('radio', { name: 'Option A' });
    const itemB = screen.getByRole('radio', { name: 'Option B' });

    itemA.focus();
    await user.keyboard('{ArrowRight}');

    expect(itemB).toHaveFocus();
    expect(itemA).toHaveAttribute('data-state', 'on');
    expect(itemB).toHaveAttribute('data-state', 'off');
  });

  it('items inherit variant from group context', () => {
    render(
      <ToggleGroup type="single" variant="outline" aria-label="Text formatting">
        <ToggleGroupItem value="a" aria-label="Option A">
          A
        </ToggleGroupItem>
        <ToggleGroupItem value="b" aria-label="Option B">
          B
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    const itemA = screen.getByRole('radio', { name: 'Option A' });
    const itemB = screen.getByRole('radio', { name: 'Option B' });

    expect(itemA).toHaveClass('border');
    expect(itemA).toHaveClass('border-input');
    expect(itemB).toHaveClass('border');
    expect(itemB).toHaveClass('border-input');
  });

  it('items inherit size from group context', () => {
    render(
      <ToggleGroup type="single" size="sm" aria-label="Text formatting">
        <ToggleGroupItem value="a" aria-label="Option A">
          A
        </ToggleGroupItem>
        <ToggleGroupItem value="b" aria-label="Option B">
          B
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    const itemA = screen.getByRole('radio', { name: 'Option A' });
    const itemB = screen.getByRole('radio', { name: 'Option B' });

    expect(itemA).toHaveClass('h-9');
    expect(itemB).toHaveClass('h-9');
  });

  it('item-level variant overrides group context', () => {
    render(
      <ToggleGroup type="single" variant="default" aria-label="Text formatting">
        <ToggleGroupItem value="a" aria-label="Option A">
          A
        </ToggleGroupItem>
        <ToggleGroupItem value="b" variant="outline" aria-label="Option B">
          B
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    expect(screen.getByRole('radio', { name: 'Option B' })).toHaveClass('border');
  });

  it('disabled group prevents toggling', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ToggleGroup
        type="single"
        disabled
        onValueChange={onValueChange}
        aria-label="Text formatting"
      >
        <ToggleGroupItem value="a" aria-label="Option A">
          A
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    const itemA = screen.getByRole('radio', { name: 'Option A' });
    await user.click(itemA);

    expect(onValueChange).not.toHaveBeenCalled();
    expect(itemA).toHaveAttribute('data-state', 'off');
  });

  it('supports controlled usage (single)', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ToggleGroup
        type="single"
        value="a"
        onValueChange={onValueChange}
        aria-label="Text formatting"
      >
        <ToggleGroupItem value="a" aria-label="Option A">
          A
        </ToggleGroupItem>
        <ToggleGroupItem value="b" aria-label="Option B">
          B
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    await user.click(screen.getByRole('radio', { name: 'Option B' }));
    expect(onValueChange).toHaveBeenCalledWith('b');
  });

  it('supports uncontrolled usage (single)', async () => {
    const user = userEvent.setup();
    render(
      <ToggleGroup type="single" defaultValue="a" aria-label="Text formatting">
        <ToggleGroupItem value="a" aria-label="Option A">
          A
        </ToggleGroupItem>
        <ToggleGroupItem value="b" aria-label="Option B">
          B
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    const itemA = screen.getByRole('radio', { name: 'Option A' });
    const itemB = screen.getByRole('radio', { name: 'Option B' });

    expect(itemA).toHaveAttribute('data-state', 'on');

    await user.click(itemB);
    expect(itemB).toHaveAttribute('data-state', 'on');
    expect(itemA).toHaveAttribute('data-state', 'off');
  });

  it('forwards ref on ToggleGroup', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ToggleGroup ref={ref} type="single" aria-label="Text formatting">
        <ToggleGroupItem value="a" aria-label="Option A">
          A
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('forwards ref on ToggleGroupItem', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <ToggleGroup type="single" aria-label="Text formatting">
        <ToggleGroupItem ref={ref} value="a" aria-label="Option A">
          A
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ToggleGroup type="single" aria-label="Text formatting">
        <ToggleGroupItem value="bold" aria-label="Bold">
          Bold
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          Italic
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          Underline
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
