import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from './dialog.js';

type TestDialogClassNames = {
  trigger?: string;
  content?: string;
  header?: string;
  footer?: string;
  title?: string;
  description?: string;
  close?: string;
};

function TestDialog({
  open,
  onOpenChange,
  classNames,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  classNames?: TestDialogClassNames;
}): React.JSX.Element {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger className={classNames?.trigger}>Open Dialog</DialogTrigger>
      <DialogContent className={classNames?.content}>
        <DialogHeader className={classNames?.header}>
          <DialogTitle className={classNames?.title}>Test Title</DialogTitle>
          <DialogDescription className={classNames?.description}>
            Test Description
          </DialogDescription>
        </DialogHeader>
        <div>Dialog body</div>
        <DialogFooter className={classNames?.footer}>
          <DialogClose className={classNames?.close}>Cancel</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe('Dialog', () => {
  it('renders trigger button', () => {
    render(<TestDialog />);

    expect(screen.getByRole('button', { name: 'Open Dialog' })).toBeInTheDocument();
  });

  it('opens on trigger click', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('closes on ESC', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('closes on overlay click', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));

    const overlay = document.querySelector('[data-slot="dialog-overlay"]');
    expect(overlay).toBeInTheDocument();

    if (!(overlay instanceof HTMLElement)) {
      throw new Error('Dialog overlay is missing');
    }

    await user.click(overlay);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('close button (X) dismisses dialog', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
    await user.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('traps focus within the dialog', async () => {
    const user = userEvent.setup();
    render(<TestDialog open />);

    const dialog = screen.getByRole('dialog');
    const trigger = screen.getByRole('button', { name: 'Open Dialog' });

    for (let iteration = 0; iteration < 8; iteration += 1) {
      await user.tab();

      expect(trigger).not.toHaveFocus();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
  });

  it('data-slot on dialog-trigger', () => {
    render(<TestDialog />);

    expect(document.querySelector('[data-slot="dialog-trigger"]')).toBeInTheDocument();
  });

  it('data-slot on dialog-close', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));

    expect(document.querySelector('[data-slot="dialog-close"]')).toBeInTheDocument();
  });

  it('data-slot on dialog-content', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));

    expect(document.querySelector('[data-slot="dialog-content"]')).toBeInTheDocument();
  });

  it('data-slot on dialog-overlay', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));

    expect(document.querySelector('[data-slot="dialog-overlay"]')).toBeInTheDocument();
  });

  it('data-slot on dialog-header', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));

    expect(document.querySelector('[data-slot="dialog-header"]')).toBeInTheDocument();
  });

  it('data-slot on dialog-footer', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));

    expect(document.querySelector('[data-slot="dialog-footer"]')).toBeInTheDocument();
  });

  it('data-slot on dialog-title', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));

    expect(document.querySelector('[data-slot="dialog-title"]')).toBeInTheDocument();
  });

  it('data-slot on dialog-description', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));

    expect(document.querySelector('[data-slot="dialog-description"]')).toBeInTheDocument();
  });

  it('controlled mode', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<TestDialog open onOpenChange={onOpenChange} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('sets aria-labelledby and aria-describedby links', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));

    const dialog = screen.getByRole('dialog');
    const title = screen.getByText('Test Title');
    const description = screen.getByText('Test Description');

    const labelledBy = dialog.getAttribute('aria-labelledby');
    const describedBy = dialog.getAttribute('aria-describedby');

    expect(labelledBy).not.toBeNull();
    expect(describedBy).not.toBeNull();

    if (!labelledBy || !describedBy) {
      throw new Error('Dialog ARIA linkage is missing');
    }

    expect(title).toHaveAttribute('id', labelledBy);
    expect(description).toHaveAttribute('id', describedBy);
  });

  it('merges custom className on trigger, content, header, footer, title, description, and close', () => {
    render(
      <TestDialog
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

    expect(screen.getByRole('button', { name: 'Open Dialog' })).toHaveClass('custom-trigger-class');
    expect(screen.getByRole('dialog')).toHaveClass('custom-content-class');
    expect(document.querySelector('[data-slot="dialog-header"]')).toHaveClass(
      'custom-header-class',
    );
    expect(document.querySelector('[data-slot="dialog-footer"]')).toHaveClass(
      'custom-footer-class',
    );
    expect(document.querySelector('[data-slot="dialog-title"]')).toHaveClass('custom-title-class');
    expect(document.querySelector('[data-slot="dialog-description"]')).toHaveClass(
      'custom-description-class',
    );
    expect(document.querySelector('[data-slot="dialog-close"]')).toHaveClass('custom-close-class');
  });

  it('merges custom className on overlay', () => {
    render(
      <Dialog open>
        <DialogPortal>
          <DialogOverlay className="custom-overlay-class" />
        </DialogPortal>
      </Dialog>,
    );

    expect(document.querySelector('[data-slot="dialog-overlay"]')).toHaveClass(
      'custom-overlay-class',
    );
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<TestDialog open />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
