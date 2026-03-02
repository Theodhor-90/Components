import { createRef } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select.js';

beforeAll(() => {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }

  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {};
  }

  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = () => {};
  }

  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
});

function TestSelect({
  defaultValue,
  value,
  onValueChange,
  disabled,
  placeholder = 'Select an option...',
  triggerClassName,
  triggerRef,
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  triggerClassName?: string;
  triggerRef?: React.Ref<HTMLButtonElement>;
}): React.JSX.Element {
  return (
    <Select defaultValue={defaultValue} value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={triggerClassName}
        disabled={disabled}
        aria-label="Test select"
        ref={triggerRef}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="cherry">Cherry</SelectItem>
      </SelectContent>
    </Select>
  );
}

function TestSelectWithGroups(): React.JSX.Element {
  return (
    <Select>
      <SelectTrigger aria-label="Grouped select">
        <SelectValue placeholder="Select an option..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Vegetables</SelectLabel>
          <SelectItem value="carrot">Carrot</SelectItem>
          <SelectItem value="broccoli">Broccoli</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

describe('Select', () => {
  it('renders trigger', () => {
    render(<TestSelect />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('has data-slot on SelectTrigger', () => {
    render(<TestSelect />);

    expect(screen.getByRole('combobox')).toHaveAttribute('data-slot', 'select-trigger');
  });

  it('has data-slot on SelectContent', async () => {
    const user = userEvent.setup();
    render(<TestSelect />);

    await user.click(screen.getByRole('combobox'));

    expect(document.querySelector('[data-slot="select-content"]')).toBeInTheDocument();
  });

  it('has data-slot on SelectItem', async () => {
    const user = userEvent.setup();
    render(<TestSelect />);

    await user.click(screen.getByRole('combobox'));

    const options = screen.getAllByRole('option');
    options.forEach((option) => {
      expect(option).toHaveAttribute('data-slot', 'select-item');
    });
  });

  it('has data-slot on SelectGroup', async () => {
    const user = userEvent.setup();
    render(<TestSelectWithGroups />);

    await user.click(screen.getByRole('combobox'));

    expect(document.querySelector('[data-slot="select-group"]')).toBeInTheDocument();
  });

  it('has data-slot on SelectLabel', async () => {
    const user = userEvent.setup();
    render(<TestSelectWithGroups />);

    await user.click(screen.getByRole('combobox'));

    expect(document.querySelector('[data-slot="select-label"]')).toBeInTheDocument();
  });

  it('has data-slot on SelectSeparator', async () => {
    const user = userEvent.setup();
    render(<TestSelectWithGroups />);

    await user.click(screen.getByRole('combobox'));

    expect(document.querySelector('[data-slot="select-separator"]')).toBeInTheDocument();
  });

  it('opens on trigger click', async () => {
    const user = userEvent.setup();
    render(<TestSelect />);

    await user.click(screen.getByRole('combobox'));

    expect(await screen.findByRole('listbox')).toBeInTheDocument();
  });

  it('opens with keyboard', async () => {
    const user = userEvent.setup();
    render(<TestSelect />);

    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await user.keyboard('{Enter}');

    if (!screen.queryByRole('listbox')) {
      await user.keyboard('{ArrowDown}');
    }

    expect(await screen.findByRole('listbox')).toBeInTheDocument();
  });

  it('selecting item updates displayed value', async () => {
    const user = userEvent.setup();
    render(<TestSelect />);

    const trigger = screen.getByRole('combobox');

    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: 'Banana' }));

    await waitFor(() => {
      expect(trigger).toHaveTextContent('Banana');
    });
  });

  it('selecting item closes dropdown', async () => {
    const user = userEvent.setup();
    render(<TestSelect />);

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Cherry' }));

    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  it('groups with labels render', async () => {
    const user = userEvent.setup();
    render(<TestSelectWithGroups />);

    await user.click(screen.getByRole('combobox'));

    expect(screen.getByText('Fruits')).toBeInTheDocument();
    expect(screen.getByText('Vegetables')).toBeInTheDocument();
  });

  it('separators render', async () => {
    const user = userEvent.setup();
    render(<TestSelectWithGroups />);

    await user.click(screen.getByRole('combobox'));

    expect(document.querySelector('[data-slot="select-separator"]')).toBeInTheDocument();
  });

  it('disabled trigger does not open', async () => {
    const user = userEvent.setup();
    render(<TestSelect disabled />);

    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeDisabled();

    await user.click(trigger);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('disabled item is not selectable', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Select value="apple" onValueChange={onValueChange}>
        <SelectTrigger aria-label="Disabled item select">
          <SelectValue placeholder="Select an option..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana" disabled>
            Banana
          </SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
        </SelectContent>
      </Select>,
    );

    const trigger = screen.getByRole('combobox');

    await user.click(trigger);
    fireEvent.click(screen.getByRole('option', { name: 'Banana' }));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(trigger).toHaveTextContent('Apple');
  });

  it('displays placeholder text when no value selected', () => {
    render(<TestSelect placeholder="Pick something" />);

    expect(screen.getByRole('combobox')).toHaveTextContent('Pick something');
  });

  it('supports controlled usage', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(<TestSelect value="apple" onValueChange={onValueChange} />);

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Cherry' }));

    expect(onValueChange).toHaveBeenCalledWith('cherry');
  });

  it('supports uncontrolled usage', async () => {
    const user = userEvent.setup();
    render(<TestSelect defaultValue="apple" />);

    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveTextContent('Apple');

    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: 'Banana' }));

    await waitFor(() => {
      expect(trigger).toHaveTextContent('Banana');
    });
  });

  it('merges custom className on trigger', () => {
    render(<TestSelect triggerClassName="custom-trigger" />);

    expect(screen.getByRole('combobox')).toHaveClass('custom-trigger');
  });

  it('forwards ref on SelectTrigger', () => {
    const ref = createRef<HTMLButtonElement>();

    render(<TestSelect triggerRef={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('has no accessibility violations (closed)', async () => {
    const { container } = render(<TestSelect />);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no accessibility violations (open)', async () => {
    const user = userEvent.setup();
    const { container } = render(<TestSelect />);

    await user.click(screen.getByRole('combobox'));

    expect(await axe(container)).toHaveNoViolations();
  });
});
