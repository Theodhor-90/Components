import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { Combobox } from './combobox.js';

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

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

describe('Combobox', () => {
  it('renders without crashing', () => {
    render(<Combobox options={options} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders default placeholder when no value', () => {
    render(<Combobox options={options} />);
    expect(screen.getByText('Select...')).toBeInTheDocument();
    expect(screen.getByText('Select...')).toHaveClass('text-muted-foreground');
  });

  it('opens popover on trigger click', async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} />);

    await user.click(screen.getByRole('combobox'));

    expect(document.querySelector('[data-slot="command"]')).toBeInTheDocument();
  });

  it('filters options as user types', async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} />);

    await user.click(screen.getByRole('combobox'));
    await user.type(screen.getByPlaceholderText('Search...'), 'app');

    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeVisible();
      expect(screen.queryByText('Banana')).not.toBeInTheDocument();
      expect(screen.queryByText('Cherry')).not.toBeInTheDocument();
    });
  });

  it('selects an option and closes popover', async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} />);

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText('Banana'));

    await waitFor(() => {
      expect(document.querySelector('[data-slot="command"]')).not.toBeInTheDocument();
    });
    expect(screen.getByRole('combobox')).toHaveTextContent('Banana');
  });

  it('displays selected option label in trigger', () => {
    render(<Combobox options={options} defaultValue="banana" />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Banana');
  });

  it('supports controlled mode', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Combobox options={options} value="apple" onValueChange={onValueChange} />);

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText('Banana'));

    expect(onValueChange).toHaveBeenCalledWith('banana');
    expect(screen.getByRole('combobox')).toHaveTextContent('Apple');
  });

  it('supports uncontrolled mode', () => {
    render(<Combobox options={options} defaultValue="cherry" />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Cherry');
  });

  it('disabled state prevents opening', async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} disabled />);

    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeDisabled();

    await user.click(trigger);
    expect(document.querySelector('[data-slot="command"]')).not.toBeInTheDocument();
  });

  it('renders custom placeholder', () => {
    render(<Combobox options={options} placeholder="Choose fruit..." />);
    expect(screen.getByText('Choose fruit...')).toBeInTheDocument();
  });

  it('passes custom searchPlaceholder to CommandInput', async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} searchPlaceholder="Find..." />);

    await user.click(screen.getByRole('combobox'));
    expect(screen.getByPlaceholderText('Find...')).toBeInTheDocument();
  });

  it('shows custom emptyMessage when no matches', async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} emptyMessage="Nothing here" />);

    await user.click(screen.getByRole('combobox'));
    await user.type(screen.getByPlaceholderText('Search...'), 'xyz');

    await waitFor(() => {
      expect(screen.getByText('Nothing here')).toBeVisible();
    });
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Combobox options={options} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Combobox multi-select', () => {
  it('multi-select toggles items', async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} mode="multiple" />);

    await user.click(screen.getByRole('combobox'));

    const appleItem = screen.getByRole('option', { name: /Apple/ });
    await user.click(appleItem);

    await waitFor(() => {
      const checkIcons = document.querySelectorAll('[data-slot="command-item"] svg');
      const appleCheck = checkIcons[0];
      expect(appleCheck).toHaveClass('ml-auto h-4 w-4');
      expect(appleCheck).not.toHaveClass('opacity-0');
    });

    const appleItemAgain = screen.getByRole('option', { name: /Apple/ });
    await user.click(appleItemAgain);

    await waitFor(() => {
      const checkIcons = document.querySelectorAll('[data-slot="command-item"] svg');
      const appleCheck = checkIcons[0];
      expect(appleCheck).toHaveClass('opacity-0');
    });
  });

  it('multi-select trigger shows single label for one selection', () => {
    render(<Combobox options={options} mode="multiple" defaultValue={['apple']} />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Apple');
  });

  it('multi-select trigger shows count for multiple selections', () => {
    render(<Combobox options={options} mode="multiple" defaultValue={['apple', 'banana']} />);
    expect(screen.getByRole('combobox')).toHaveTextContent('2 selected');
  });

  it('multi-select popover stays open after selection', async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} mode="multiple" />);

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: /Apple/ }));

    expect(document.querySelector('[data-slot="command"]')).toBeInTheDocument();
  });

  it('multi-select onValueChange fires with array', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Combobox options={options} mode="multiple" onValueChange={onValueChange} />);

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: /Apple/ }));

    expect(onValueChange).toHaveBeenCalledWith(['apple']);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Combobox options={options} mode="multiple" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Combobox create-option', () => {
  it('create-option appears for unmatched input', async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} onCreateOption={vi.fn()} />);

    await user.click(screen.getByRole('combobox'));
    await user.type(screen.getByPlaceholderText('Search...'), 'Mango');

    await waitFor(() => {
      expect(screen.getByText('Create Mango')).toBeVisible();
    });
  });

  it('create-option callback fires with typed value', async () => {
    const user = userEvent.setup();
    const onCreateOption = vi.fn();
    render(<Combobox options={options} onCreateOption={onCreateOption} />);

    await user.click(screen.getByRole('combobox'));
    await user.type(screen.getByPlaceholderText('Search...'), 'Mango');

    await waitFor(() => {
      expect(screen.getByText('Create Mango')).toBeVisible();
    });

    await user.click(screen.getByText('Create Mango'));

    expect(onCreateOption).toHaveBeenCalledWith('Mango');
  });

  it('create-option hidden when options match', async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} onCreateOption={vi.fn()} />);

    await user.click(screen.getByRole('combobox'));
    await user.type(screen.getByPlaceholderText('Search...'), 'Apple');

    await waitFor(() => {
      expect(screen.queryByText('Create Apple')).not.toBeInTheDocument();
    });
  });

  it('create-option not shown when onCreateOption not provided', async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} />);

    await user.click(screen.getByRole('combobox'));
    await user.type(screen.getByPlaceholderText('Search...'), 'xyz');

    await waitFor(() => {
      expect(screen.queryByText('Create xyz')).not.toBeInTheDocument();
    });
  });

  it('create-option clears search after creation', async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} onCreateOption={vi.fn()} />);

    await user.click(screen.getByRole('combobox'));
    const searchInput = screen.getByPlaceholderText('Search...');
    await user.type(searchInput, 'Mango');

    await waitFor(() => {
      expect(screen.getByText('Create Mango')).toBeVisible();
    });

    await user.click(screen.getByText('Create Mango'));

    await waitFor(() => {
      expect(searchInput).toHaveValue('');
    });
  });

  it('multi-select with create-option works together', async () => {
    const user = userEvent.setup();
    const onCreateOption = vi.fn();
    render(<Combobox options={options} mode="multiple" onCreateOption={onCreateOption} />);

    await user.click(screen.getByRole('combobox'));
    await user.type(screen.getByPlaceholderText('Search...'), 'Mango');

    await waitFor(() => {
      expect(screen.getByText('Create Mango')).toBeVisible();
    });

    await user.click(screen.getByText('Create Mango'));

    expect(onCreateOption).toHaveBeenCalledWith('Mango');
  });
});
