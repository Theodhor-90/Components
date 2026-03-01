import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Popover, PopoverContent, PopoverTrigger } from './popover.js';

function TestPopover({
  contentClassName,
  triggerClassName,
  align,
  sideOffset,
}: {
  contentClassName?: string;
  triggerClassName?: string;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}): React.JSX.Element {
  return (
    <Popover>
      <PopoverTrigger className={triggerClassName}>Open Popover</PopoverTrigger>
      <PopoverContent
        className={contentClassName}
        align={align}
        sideOffset={sideOffset}
        aria-label="Popover"
      >
        <p>Popover content</p>
      </PopoverContent>
    </Popover>
  );
}

describe('Popover', () => {
  it('renders trigger button', () => {
    render(<TestPopover />);

    expect(screen.getByRole('button', { name: 'Open Popover' })).toBeInTheDocument();
  });

  it('opens on trigger click', async () => {
    const user = userEvent.setup();
    render(<TestPopover />);

    await user.click(screen.getByRole('button', { name: 'Open Popover' }));

    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });

  it('closes on outside click', async () => {
    const user = userEvent.setup();
    render(<TestPopover />);

    await user.click(screen.getByRole('button', { name: 'Open Popover' }));
    await user.click(document.body);

    await waitFor(() => {
      expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
    });
  });

  it('closes on ESC', async () => {
    const user = userEvent.setup();
    render(<TestPopover />);

    await user.click(screen.getByRole('button', { name: 'Open Popover' }));
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
    });
  });

  it('data-slot on popover-trigger', () => {
    render(<TestPopover />);

    expect(document.querySelector('[data-slot="popover-trigger"]')).toBeInTheDocument();
  });

  it('data-slot on popover-content', async () => {
    const user = userEvent.setup();
    render(<TestPopover />);

    await user.click(screen.getByRole('button', { name: 'Open Popover' }));

    expect(document.querySelector('[data-slot="popover-content"]')).toBeInTheDocument();
  });

  it('applies default sideOffset', async () => {
    const user = userEvent.setup();
    render(<TestPopover />);

    await user.click(screen.getByRole('button', { name: 'Open Popover' }));

    expect(document.querySelector('[data-slot="popover-content"]')).toHaveAttribute('data-side');
  });

  it('merges custom className on content', async () => {
    const user = userEvent.setup();
    render(<TestPopover contentClassName="custom-content-class" />);

    await user.click(screen.getByRole('button', { name: 'Open Popover' }));

    expect(document.querySelector('[data-slot="popover-content"]')).toHaveClass(
      'custom-content-class',
    );
  });

  it('merges custom className on trigger', () => {
    render(<TestPopover triggerClassName="custom-trigger-class" />);

    expect(screen.getByRole('button', { name: 'Open Popover' })).toHaveClass(
      'custom-trigger-class',
    );
  });

  it('has no accessibility violations', async () => {
    const user = userEvent.setup();
    render(<TestPopover />);

    await user.click(screen.getByRole('button', { name: 'Open Popover' }));

    const results = await axe(document.body);

    expect(results).toHaveNoViolations();
  });
});
