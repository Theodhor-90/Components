import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog.js';

type TestAlertDialogClassNames = {
  trigger?: string;
  content?: string;
  header?: string;
  footer?: string;
  title?: string;
  description?: string;
  action?: string;
  cancel?: string;
};

function TestAlertDialog({
  open,
  onOpenChange,
  classNames,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  classNames?: TestAlertDialogClassNames;
}): React.JSX.Element {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger className={classNames?.trigger}>Open Alert</AlertDialogTrigger>
      <AlertDialogContent className={classNames?.content}>
        <AlertDialogHeader className={classNames?.header}>
          <AlertDialogTitle className={classNames?.title}>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription className={classNames?.description}>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={classNames?.footer}>
          <AlertDialogCancel className={classNames?.cancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction className={classNames?.action}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

describe('AlertDialog', () => {
  it('renders trigger button', () => {
    render(<TestAlertDialog />);

    expect(screen.getByRole('button', { name: 'Open Alert' })).toBeInTheDocument();
  });

  it('opens on trigger click', async () => {
    const user = userEvent.setup();
    render(<TestAlertDialog />);

    await user.click(screen.getByRole('button', { name: 'Open Alert' }));

    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('supports asChild composition for Trigger, Action, and Cancel', async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button type="button">Open Alert</button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <button type="button">Cancel</button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <button type="button">Continue</button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );

    await user.click(screen.getByRole('button', { name: 'Open Alert' }));

    expect(screen.getByRole('button', { name: 'Continue' })).toHaveAttribute(
      'data-slot',
      'alert-dialog-action',
    );
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveAttribute(
      'data-slot',
      'alert-dialog-cancel',
    );

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  });

  it('does not close on overlay click', async () => {
    const user = userEvent.setup();
    render(<TestAlertDialog />);

    await user.click(screen.getByRole('button', { name: 'Open Alert' }));

    const overlay = document.querySelector('[data-slot="alert-dialog-overlay"]');
    expect(overlay).toBeInTheDocument();

    if (!(overlay instanceof HTMLElement)) {
      throw new Error('AlertDialog overlay is missing');
    }

    await user.click(overlay);

    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('closes on Cancel click', async () => {
    const user = userEvent.setup();
    render(<TestAlertDialog />);

    await user.click(screen.getByRole('button', { name: 'Open Alert' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  });

  it('Action triggers onOpenChange(false)', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<TestAlertDialog onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole('button', { name: 'Open Alert' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes on ESC', async () => {
    const user = userEvent.setup();
    render(<TestAlertDialog />);

    await user.click(screen.getByRole('button', { name: 'Open Alert' }));
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  });

  it('traps focus within the dialog', async () => {
    const user = userEvent.setup();
    render(<TestAlertDialog open />);

    const dialog = screen.getByRole('alertdialog');
    const trigger = screen.getByRole('button', { name: 'Open Alert' });

    for (let iteration = 0; iteration < 8; iteration += 1) {
      await user.tab();

      expect(trigger).not.toHaveFocus();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
  });

  it('sets aria-labelledby and aria-describedby links', async () => {
    const user = userEvent.setup();
    render(<TestAlertDialog />);

    await user.click(screen.getByRole('button', { name: 'Open Alert' }));

    const dialog = screen.getByRole('alertdialog');
    const title = screen.getByText('Are you sure?');
    const description = screen.getByText('This action cannot be undone.');

    const labelledBy = dialog.getAttribute('aria-labelledby');
    const describedBy = dialog.getAttribute('aria-describedby');

    expect(labelledBy).not.toBeNull();
    expect(describedBy).not.toBeNull();

    if (!labelledBy || !describedBy) {
      throw new Error('AlertDialog ARIA linkage is missing');
    }

    expect(title).toHaveAttribute('id', labelledBy);
    expect(description).toHaveAttribute('id', describedBy);
  });

  it('data-slot on alert-dialog-trigger', () => {
    render(<TestAlertDialog />);

    expect(document.querySelector('[data-slot="alert-dialog-trigger"]')).toBeInTheDocument();
  });

  it('data-slot on alert-dialog-content', async () => {
    const user = userEvent.setup();
    render(<TestAlertDialog />);

    await user.click(screen.getByRole('button', { name: 'Open Alert' }));

    expect(document.querySelector('[data-slot="alert-dialog-content"]')).toBeInTheDocument();
  });

  it('data-slot on alert-dialog-overlay', async () => {
    const user = userEvent.setup();
    render(<TestAlertDialog />);

    await user.click(screen.getByRole('button', { name: 'Open Alert' }));

    expect(document.querySelector('[data-slot="alert-dialog-overlay"]')).toBeInTheDocument();
  });

  it('data-slot on alert-dialog-header', async () => {
    const user = userEvent.setup();
    render(<TestAlertDialog />);

    await user.click(screen.getByRole('button', { name: 'Open Alert' }));

    expect(document.querySelector('[data-slot="alert-dialog-header"]')).toBeInTheDocument();
  });

  it('data-slot on alert-dialog-footer', async () => {
    const user = userEvent.setup();
    render(<TestAlertDialog />);

    await user.click(screen.getByRole('button', { name: 'Open Alert' }));

    expect(document.querySelector('[data-slot="alert-dialog-footer"]')).toBeInTheDocument();
  });

  it('data-slot on alert-dialog-title', async () => {
    const user = userEvent.setup();
    render(<TestAlertDialog />);

    await user.click(screen.getByRole('button', { name: 'Open Alert' }));

    expect(document.querySelector('[data-slot="alert-dialog-title"]')).toBeInTheDocument();
  });

  it('data-slot on alert-dialog-description', async () => {
    const user = userEvent.setup();
    render(<TestAlertDialog />);

    await user.click(screen.getByRole('button', { name: 'Open Alert' }));

    expect(document.querySelector('[data-slot="alert-dialog-description"]')).toBeInTheDocument();
  });

  it('data-slot on alert-dialog-action', async () => {
    const user = userEvent.setup();
    render(<TestAlertDialog />);

    await user.click(screen.getByRole('button', { name: 'Open Alert' }));

    expect(document.querySelector('[data-slot="alert-dialog-action"]')).toBeInTheDocument();
  });

  it('data-slot on alert-dialog-cancel', async () => {
    const user = userEvent.setup();
    render(<TestAlertDialog />);

    await user.click(screen.getByRole('button', { name: 'Open Alert' }));

    expect(document.querySelector('[data-slot="alert-dialog-cancel"]')).toBeInTheDocument();
  });

  it('controlled mode', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<TestAlertDialog open onOpenChange={onOpenChange} />);

    expect(screen.getByRole('alertdialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('merges custom className on all sub-components', () => {
    render(
      <TestAlertDialog
        open
        classNames={{
          trigger: 'custom-trigger-class',
          content: 'custom-content-class',
          header: 'custom-header-class',
          footer: 'custom-footer-class',
          title: 'custom-title-class',
          description: 'custom-description-class',
          action: 'custom-action-class',
          cancel: 'custom-cancel-class',
        }}
      />,
    );

    expect(screen.getByRole('button', { name: 'Open Alert' })).toHaveClass('custom-trigger-class');
    expect(screen.getByRole('alertdialog')).toHaveClass('custom-content-class');
    expect(document.querySelector('[data-slot="alert-dialog-header"]')).toHaveClass(
      'custom-header-class',
    );
    expect(document.querySelector('[data-slot="alert-dialog-footer"]')).toHaveClass(
      'custom-footer-class',
    );
    expect(document.querySelector('[data-slot="alert-dialog-title"]')).toHaveClass(
      'custom-title-class',
    );
    expect(document.querySelector('[data-slot="alert-dialog-description"]')).toHaveClass(
      'custom-description-class',
    );
    expect(document.querySelector('[data-slot="alert-dialog-action"]')).toHaveClass(
      'custom-action-class',
    );
    expect(document.querySelector('[data-slot="alert-dialog-cancel"]')).toHaveClass(
      'custom-cancel-class',
    );
  });

  it('merges custom className on overlay', () => {
    render(
      <AlertDialog open>
        <AlertDialogPortal>
          <AlertDialogOverlay className="custom-overlay-class" />
        </AlertDialogPortal>
      </AlertDialog>,
    );

    expect(document.querySelector('[data-slot="alert-dialog-overlay"]')).toHaveClass(
      'custom-overlay-class',
    );
  });

  it('Action renders with button default variant styling', () => {
    render(<TestAlertDialog open />);

    const action = document.querySelector('[data-slot="alert-dialog-action"]');
    expect(action).toHaveClass('bg-primary');
  });

  it('Cancel renders with button outline variant styling', () => {
    render(<TestAlertDialog open />);

    const cancel = document.querySelector('[data-slot="alert-dialog-cancel"]');
    expect(cancel).toHaveClass('border', 'bg-background');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<TestAlertDialog open />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
