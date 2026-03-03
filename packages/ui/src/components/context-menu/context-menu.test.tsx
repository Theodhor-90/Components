import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from './context-menu.js';
import type {
  ContextMenuCheckboxItemProps,
  ContextMenuRadioGroupProps,
} from './context-menu.types.js';

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

function TestContextMenu({
  onSelect,
  itemClassName,
  contentClassName,
}: {
  onSelect?: () => void;
  itemClassName?: string;
  contentClassName?: string;
}): React.JSX.Element {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent className={contentClassName}>
        <ContextMenuLabel>Options</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem className={itemClassName} onSelect={onSelect}>
          Edit
        </ContextMenuItem>
        <ContextMenuItem>Copy</ContextMenuItem>
        <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function TestContextMenuFull({
  onCheckedChange,
  onValueChange,
}: {
  onCheckedChange?: ContextMenuCheckboxItemProps['onCheckedChange'];
  onValueChange?: ContextMenuRadioGroupProps['onValueChange'];
}): React.JSX.Element {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel inset>Options</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem inset>Edit</ContextMenuItem>
        <ContextMenuItem>
          Copy
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuCheckboxItem checked={false} onCheckedChange={onCheckedChange}>
          Show toolbar
        </ContextMenuCheckboxItem>
        <ContextMenuRadioGroup onValueChange={onValueChange}>
          <ContextMenuRadioItem value="light">Light</ContextMenuRadioItem>
          <ContextMenuRadioItem value="dark">Dark</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
        <ContextMenuSub>
          <ContextMenuSubTrigger>More</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Sub Item</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

describe('ContextMenu', () => {
  async function openContextMenu(): Promise<void> {
    fireEvent.contextMenu(screen.getByText('Right-click here'));
    await screen.findByRole('menu');
  }

  it('renders trigger area', () => {
    render(<TestContextMenu />);

    expect(screen.getByText('Right-click here')).toBeInTheDocument();
  });

  it('opens on right-click', async () => {
    render(<TestContextMenu />);

    await openContextMenu();

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('item selection fires onSelect', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<TestContextMenu onSelect={onSelect} />);

    await openContextMenu();
    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));

    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('closes after item selection', async () => {
    const user = userEvent.setup();
    render(<TestContextMenu />);

    await openContextMenu();
    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('keyboard navigation with arrow keys', async () => {
    const user = userEvent.setup();
    render(<TestContextMenu />);

    await openContextMenu();

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
    render(<TestContextMenu onSelect={onSelect} />);

    await openContextMenu();

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
    render(<TestContextMenu />);

    await openContextMenu();
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('checkbox item toggles checked state', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<TestContextMenuFull onCheckedChange={onCheckedChange} />);

    await openContextMenu();
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Show toolbar' }));

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('radio item group exclusivity', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TestContextMenuFull onValueChange={onValueChange} />);

    await openContextMenu();
    await user.click(screen.getByRole('menuitemradio', { name: 'Dark' }));

    expect(onValueChange).toHaveBeenCalledWith('dark');
  });

  it('sub-menu renders on hover', async () => {
    const user = userEvent.setup();
    render(<TestContextMenuFull />);

    await openContextMenu();
    await user.hover(screen.getByRole('menuitem', { name: 'More' }));

    expect(await screen.findByRole('menuitem', { name: 'Sub Item' })).toBeInTheDocument();
  });

  it('sub-menu renders with keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<TestContextMenuFull />);

    await openContextMenu();

    const subTrigger = screen.getByRole('menuitem', { name: 'More' });

    for (let i = 0; i < 10 && subTrigger !== document.activeElement; i += 1) {
      await user.keyboard('{ArrowDown}');
    }

    expect(subTrigger).toHaveFocus();

    await user.keyboard('{ArrowRight}');

    expect(await screen.findByRole('menuitem', { name: 'Sub Item' })).toBeInTheDocument();
  });

  it('inset variant adds padding', async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Right-click here</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem inset>Inset Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );

    await openContextMenu();

    expect(screen.getByRole('menuitem', { name: 'Inset Item' })).toHaveClass('pl-8');
  });

  it('destructive variant applies correct styles', async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Right-click here</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );

    await openContextMenu();

    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveClass('text-destructive');
  });

  it('data-slot on trigger', () => {
    render(<TestContextMenu />);

    expect(document.querySelector('[data-slot="context-menu-trigger"]')).toBeInTheDocument();
  });

  it('data-slot on content', async () => {
    render(<TestContextMenu />);

    await openContextMenu();

    expect(document.querySelector('[data-slot="context-menu-content"]')).toBeInTheDocument();
  });

  it('data-slot on item', async () => {
    render(<TestContextMenu />);

    await openContextMenu();

    expect(document.querySelector('[data-slot="context-menu-item"]')).toBeInTheDocument();
  });

  it('data-slot on separator', async () => {
    render(<TestContextMenu />);

    await openContextMenu();

    expect(document.querySelector('[data-slot="context-menu-separator"]')).toBeInTheDocument();
  });

  it('data-slot on label', async () => {
    render(<TestContextMenu />);

    await openContextMenu();

    expect(document.querySelector('[data-slot="context-menu-label"]')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<TestContextMenu />);

    await openContextMenu();

    expect(await axe(container)).toHaveNoViolations();
  });
});
