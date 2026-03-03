import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './command.js';

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

function TestCommand(): React.JSX.Element {
  return (
    <Command>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem value="calendar">Calendar</CommandItem>
          <CommandItem value="search">Search</CommandItem>
          <CommandItem value="settings">Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

function TestCommandFull({ onSelect }: { onSelect?: (value: string) => void }): React.JSX.Element {
  return (
    <Command>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem value="calendar" onSelect={onSelect}>
            Calendar
            <CommandShortcut>⌘C</CommandShortcut>
          </CommandItem>
          <CommandItem value="search" onSelect={onSelect}>
            Search
            <CommandShortcut>⌘K</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem value="profile" onSelect={onSelect}>
            Profile
          </CommandItem>
          <CommandItem value="billing" onSelect={onSelect}>
            Billing
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

function TestCommandDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}): React.JSX.Element {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem value="calendar">Calendar</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

describe('Command', () => {
  it('renders without crashing', () => {
    render(<TestCommand />);

    expect(document.querySelector('[data-slot="command"]')).toBeInTheDocument();
  });

  it('filters items by typing in input', async () => {
    const user = userEvent.setup();
    render(<TestCommand />);

    await user.type(screen.getByPlaceholderText('Type a command or search...'), 'cal');

    await waitFor(() => {
      expect(screen.getByText('Calendar')).toBeVisible();
      expect(screen.getByText('Search')).not.toBeVisible();
      expect(screen.getByText('Settings')).not.toBeVisible();
    });
  });

  it('navigates items with arrow keys', async () => {
    const user = userEvent.setup();
    render(<TestCommand />);

    await user.click(screen.getByPlaceholderText('Type a command or search...'));
    await user.keyboard('{ArrowDown}');

    const firstItem = screen.getByText('Calendar').closest('[data-slot="command-item"]');

    expect(firstItem).toHaveAttribute('data-selected', 'true');
  });

  it('selects item with Enter', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<TestCommandFull onSelect={onSelect} />);

    await user.click(screen.getByPlaceholderText('Type a command or search...'));
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(onSelect).toHaveBeenCalledWith('calendar');
  });

  it('shows CommandEmpty when no items match', async () => {
    const user = userEvent.setup();
    render(<TestCommand />);

    await user.type(screen.getByPlaceholderText('Type a command or search...'), 'xyz');

    await waitFor(() => {
      expect(screen.getByText('No results found.')).toBeVisible();
    });
  });

  it('renders CommandGroup with heading', () => {
    render(<TestCommand />);

    expect(screen.getByText('Suggestions')).toBeInTheDocument();
  });

  it('renders CommandSeparator', () => {
    render(
      <Command>
        <CommandList>
          <CommandGroup heading="Suggestions">
            <CommandItem>Item</CommandItem>
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </Command>,
    );

    expect(document.querySelector('[data-slot="command-separator"]')).toBeInTheDocument();
  });

  it('renders CommandShortcut', () => {
    render(
      <Command>
        <CommandList>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              Open
              <CommandShortcut>⌘K</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>,
    );

    expect(screen.getByText('⌘K')).toBeInTheDocument();
  });

  it('opens CommandDialog when open is true', () => {
    render(<TestCommandDialog open />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('calls onOpenChange with false when Escape is pressed in CommandDialog', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<TestCommandDialog open onOpenChange={onOpenChange} />);

    await user.click(screen.getByPlaceholderText('Type a command or search...'));
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('applies data-slot attributes to sub-components', async () => {
    const user = userEvent.setup();
    render(<TestCommandFull />);

    await user.type(screen.getByPlaceholderText('Type a command or search...'), 'zzz');

    expect(document.querySelector('[data-slot="command"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="command-input"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="command-list"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="command-group"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="command-item"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="command-empty"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="command-separator"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="command-shortcut"]')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(<Command className="custom-class" />);

    expect(document.querySelector('[data-slot="command"]')).toHaveClass('custom-class');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<TestCommand />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
