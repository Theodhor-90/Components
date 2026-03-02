import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet.js';

function TestSheet({
  open,
  onOpenChange,
  side,
  classNames,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: 'top' | 'right' | 'bottom' | 'left';
  classNames?: {
    trigger?: string;
    content?: string;
    header?: string;
    footer?: string;
    title?: string;
    description?: string;
    close?: string;
  };
}): React.JSX.Element {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger className={classNames?.trigger}>Open Sheet</SheetTrigger>
      <SheetContent side={side} className={classNames?.content}>
        <SheetHeader className={classNames?.header}>
          <SheetTitle className={classNames?.title}>Sheet Title</SheetTitle>
          <SheetDescription className={classNames?.description}>Sheet Description</SheetDescription>
        </SheetHeader>
        <div>Sheet body</div>
        <SheetFooter className={classNames?.footer}>
          <SheetClose className={classNames?.close}>Done</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

describe('Sheet', () => {
  it('renders trigger button', () => {
    render(<TestSheet />);

    expect(screen.getByRole('button', { name: 'Open Sheet' })).toBeInTheDocument();
  });

  it('opens on trigger click', async () => {
    const user = userEvent.setup();
    render(<TestSheet />);

    await user.click(screen.getByRole('button', { name: 'Open Sheet' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Sheet Title')).toBeInTheDocument();
  });

  it('defaults to right side', async () => {
    const user = userEvent.setup();
    render(<TestSheet />);

    await user.click(screen.getByRole('button', { name: 'Open Sheet' }));

    const content = document.querySelector('[data-slot="sheet-content"]');
    expect(content).toHaveClass('inset-y-0');
    expect(content).toHaveClass('right-0');
  });

  it('renders from top side', async () => {
    const user = userEvent.setup();
    render(<TestSheet side="top" />);

    await user.click(screen.getByRole('button', { name: 'Open Sheet' }));

    const content = document.querySelector('[data-slot="sheet-content"]');
    expect(content).toHaveClass('inset-x-0');
    expect(content).toHaveClass('top-0');
  });

  it('renders from bottom side', async () => {
    const user = userEvent.setup();
    render(<TestSheet side="bottom" />);

    await user.click(screen.getByRole('button', { name: 'Open Sheet' }));

    const content = document.querySelector('[data-slot="sheet-content"]');
    expect(content).toHaveClass('inset-x-0');
    expect(content).toHaveClass('bottom-0');
  });

  it('renders from left side', async () => {
    const user = userEvent.setup();
    render(<TestSheet side="left" />);

    await user.click(screen.getByRole('button', { name: 'Open Sheet' }));

    const content = document.querySelector('[data-slot="sheet-content"]');
    expect(content).toHaveClass('inset-y-0');
    expect(content).toHaveClass('left-0');
  });

  it('closes on ESC', async () => {
    const user = userEvent.setup();
    render(<TestSheet />);

    await user.click(screen.getByRole('button', { name: 'Open Sheet' }));
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('closes on overlay click', async () => {
    const user = userEvent.setup();
    render(<TestSheet />);

    await user.click(screen.getByRole('button', { name: 'Open Sheet' }));

    const overlay = document.querySelector('[data-slot="sheet-overlay"]');
    expect(overlay).toBeInTheDocument();

    if (!(overlay instanceof HTMLElement)) {
      throw new Error('Sheet overlay is missing');
    }

    await user.click(overlay);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('close button (X) dismisses sheet', async () => {
    const user = userEvent.setup();
    render(<TestSheet />);

    await user.click(screen.getByRole('button', { name: 'Open Sheet' }));
    await user.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('renders SheetTitle and SheetDescription', async () => {
    const user = userEvent.setup();
    render(<TestSheet />);

    await user.click(screen.getByRole('button', { name: 'Open Sheet' }));

    expect(screen.getByText('Sheet Title')).toBeInTheDocument();
    expect(screen.getByText('Sheet Description')).toBeInTheDocument();
  });

  it('traps focus within the sheet', async () => {
    const user = userEvent.setup();
    render(<TestSheet open />);

    const dialog = screen.getByRole('dialog');
    const trigger = document.querySelector('[data-slot="sheet-trigger"]');

    expect(trigger).toBeInTheDocument();

    if (!(trigger instanceof HTMLElement)) {
      throw new Error('Sheet trigger is missing');
    }

    for (let iteration = 0; iteration < 8; iteration += 1) {
      await user.tab();

      expect(trigger).not.toHaveFocus();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
  });

  it('controlled mode', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<TestSheet open onOpenChange={onOpenChange} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('data-slot on sheet-trigger', () => {
    render(<TestSheet />);

    expect(document.querySelector('[data-slot="sheet-trigger"]')).toBeInTheDocument();
  });

  it('data-slot on sheet-content', async () => {
    const user = userEvent.setup();
    render(<TestSheet />);

    await user.click(screen.getByRole('button', { name: 'Open Sheet' }));

    expect(document.querySelector('[data-slot="sheet-content"]')).toBeInTheDocument();
  });

  it('data-slot on sheet-overlay', async () => {
    const user = userEvent.setup();
    render(<TestSheet />);

    await user.click(screen.getByRole('button', { name: 'Open Sheet' }));

    expect(document.querySelector('[data-slot="sheet-overlay"]')).toBeInTheDocument();
  });

  it('data-slot on sheet-header', async () => {
    const user = userEvent.setup();
    render(<TestSheet />);

    await user.click(screen.getByRole('button', { name: 'Open Sheet' }));

    expect(document.querySelector('[data-slot="sheet-header"]')).toBeInTheDocument();
  });

  it('data-slot on sheet-footer', async () => {
    const user = userEvent.setup();
    render(<TestSheet />);

    await user.click(screen.getByRole('button', { name: 'Open Sheet' }));

    expect(document.querySelector('[data-slot="sheet-footer"]')).toBeInTheDocument();
  });

  it('data-slot on sheet-title', async () => {
    const user = userEvent.setup();
    render(<TestSheet />);

    await user.click(screen.getByRole('button', { name: 'Open Sheet' }));

    expect(document.querySelector('[data-slot="sheet-title"]')).toBeInTheDocument();
  });

  it('data-slot on sheet-description', async () => {
    const user = userEvent.setup();
    render(<TestSheet />);

    await user.click(screen.getByRole('button', { name: 'Open Sheet' }));

    expect(document.querySelector('[data-slot="sheet-description"]')).toBeInTheDocument();
  });

  it('data-slot on sheet-close', async () => {
    const user = userEvent.setup();
    render(<TestSheet />);

    await user.click(screen.getByRole('button', { name: 'Open Sheet' }));

    expect(document.querySelector('[data-slot="sheet-close"]')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(
      <TestSheet
        open
        classNames={{
          trigger: 'custom-trigger-class',
          content: 'custom-content-class',
          header: 'custom-header-class',
          footer: 'custom-footer-class',
          title: 'custom-title-class',
          description: 'custom-description-class',
          close: 'custom-close-class',
        }}
      />,
    );

    expect(document.querySelector('[data-slot="sheet-trigger"]')).toHaveClass(
      'custom-trigger-class',
    );
    expect(screen.getByRole('dialog')).toHaveClass('custom-content-class');
    expect(document.querySelector('[data-slot="sheet-header"]')).toHaveClass('custom-header-class');
    expect(document.querySelector('[data-slot="sheet-footer"]')).toHaveClass('custom-footer-class');
    expect(document.querySelector('[data-slot="sheet-title"]')).toHaveClass('custom-title-class');
    expect(document.querySelector('[data-slot="sheet-description"]')).toHaveClass(
      'custom-description-class',
    );
    expect(document.querySelector('[data-slot="sheet-close"]')).toHaveClass('custom-close-class');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<TestSheet open />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
