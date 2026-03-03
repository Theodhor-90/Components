import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu.js';
import type {
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioGroupProps,
} from './dropdown-menu.types.js';

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

function TestDropdownMenu({
  onSelect,
  itemClassName,
  contentClassName,
}: {
  onSelect?: () => void;
  itemClassName?: string;
  contentClassName?: string;
}): React.JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
      <DropdownMenuContent className={contentClassName}>
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className={itemClassName} onSelect={onSelect}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>Copy</DropdownMenuItem>
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TestDropdownMenuFull({
  onCheckedChange,
  onValueChange,
}: {
  onCheckedChange?: DropdownMenuCheckboxItemProps['onCheckedChange'];
  onValueChange?: DropdownMenuRadioGroupProps['onValueChange'];
}): React.JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel inset>Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem inset>Edit</DropdownMenuItem>
        <DropdownMenuItem>
          Copy
          <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuCheckboxItem checked={false} onCheckedChange={onCheckedChange}>
          Show toolbar
        </DropdownMenuCheckboxItem>
        <DropdownMenuRadioGroup onValueChange={onValueChange}>
          <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Sub Item</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe('DropdownMenu', () => {
  it('renders trigger button', () => {
    render(<TestDropdownMenu />);

    expect(screen.getByRole('button', { name: 'Actions' })).toBeInTheDocument();
  });

  it('opens on trigger click', async () => {
    const user = userEvent.setup();
    render(<TestDropdownMenu />);

    await user.click(screen.getByRole('button', { name: 'Actions' }));

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('item selection fires onSelect', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<TestDropdownMenu onSelect={onSelect} />);

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));

    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('closes after item selection', async () => {
    const user = userEvent.setup();
    render(<TestDropdownMenu />);

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('keyboard navigation with arrow keys', async () => {
    const user = userEvent.setup();
    render(<TestDropdownMenu />);

    await user.click(screen.getByRole('button', { name: 'Actions' }));

    const editItem = screen.getByRole('menuitem', { name: 'Edit' });
    const copyItem = screen.getByRole('menuitem', { name: 'Copy' });

    if (editItem === document.activeElement) {
      await user.keyboard('{ArrowDown}');
      expect(copyItem).toHaveFocus();
      return;
    }

    await user.keyboard('{ArrowDown}');
    expect(editItem).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(copyItem).toHaveFocus();
  });

  it('keyboard Enter selects focused item', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<TestDropdownMenu onSelect={onSelect} />);

    await user.click(screen.getByRole('button', { name: 'Actions' }));

    const editItem = screen.getByRole('menuitem', { name: 'Edit' });

    if (editItem !== document.activeElement) {
      await user.keyboard('{ArrowDown}');
    }

    expect(editItem).toHaveFocus();

    await user.keyboard('{Enter}');

    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    render(<TestDropdownMenu />);

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('checkbox item toggles checked state', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<TestDropdownMenuFull onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Show toolbar' }));

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('radio item group exclusivity', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TestDropdownMenuFull onValueChange={onValueChange} />);

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.click(screen.getByRole('menuitemradio', { name: 'Dark' }));

    expect(onValueChange).toHaveBeenCalledWith('dark');
  });

  it('sub-menu renders on hover', async () => {
    const user = userEvent.setup();
    render(<TestDropdownMenuFull />);

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.hover(screen.getByRole('menuitem', { name: 'More' }));

    expect(await screen.findByRole('menuitem', { name: 'Sub Item' })).toBeInTheDocument();
  });

  it('sub-menu renders with keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<TestDropdownMenuFull />);

    await user.click(screen.getByRole('button', { name: 'Actions' }));

    const subTrigger = screen.getByRole('menuitem', { name: 'More' });

    for (let i = 0; i < 10 && subTrigger !== document.activeElement; i += 1) {
      await user.keyboard('{ArrowDown}');
    }

    expect(subTrigger).toHaveFocus();

    await user.keyboard('{ArrowRight}');

    expect(await screen.findByRole('menuitem', { name: 'Sub Item' })).toBeInTheDocument();
  });

  it('inset variant adds padding', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem inset>Inset Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    expect(screen.getByRole('menuitem', { name: 'Inset Item' })).toHaveClass('pl-8');
  });

  it('destructive variant applies correct styles', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveClass('text-destructive');
  });

  it('data-slot on trigger', () => {
    render(<TestDropdownMenu />);

    expect(document.querySelector('[data-slot="dropdown-menu-trigger"]')).toBeInTheDocument();
  });

  it('data-slot on content', async () => {
    const user = userEvent.setup();
    render(<TestDropdownMenu />);

    await user.click(screen.getByRole('button', { name: 'Actions' }));

    expect(document.querySelector('[data-slot="dropdown-menu-content"]')).toBeInTheDocument();
  });

  it('data-slot on item', async () => {
    const user = userEvent.setup();
    render(<TestDropdownMenu />);

    await user.click(screen.getByRole('button', { name: 'Actions' }));

    expect(document.querySelector('[data-slot="dropdown-menu-item"]')).toBeInTheDocument();
  });

  it('data-slot on separator', async () => {
    const user = userEvent.setup();
    render(<TestDropdownMenu />);

    await user.click(screen.getByRole('button', { name: 'Actions' }));

    expect(document.querySelector('[data-slot="dropdown-menu-separator"]')).toBeInTheDocument();
  });

  it('data-slot on label', async () => {
    const user = userEvent.setup();
    render(<TestDropdownMenu />);

    await user.click(screen.getByRole('button', { name: 'Actions' }));

    expect(document.querySelector('[data-slot="dropdown-menu-label"]')).toBeInTheDocument();
  });

  it('merges custom className on content', async () => {
    const user = userEvent.setup();
    render(<TestDropdownMenu contentClassName="custom-class" />);

    await user.click(screen.getByRole('button', { name: 'Actions' }));

    expect(document.querySelector('[data-slot="dropdown-menu-content"]')).toHaveClass('custom-class');
  });

  it('has no accessibility violations', async () => {
    const user = userEvent.setup();
    const { container } = render(<TestDropdownMenu />);

    await user.click(screen.getByRole('button', { name: 'Actions' }));

    expect(await axe(container)).toHaveNoViolations();
  });
});
