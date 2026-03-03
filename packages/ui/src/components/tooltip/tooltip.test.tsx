import { createRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip.js';

function TestTooltip({
  contentClassName,
  sideOffset,
  delayDuration = 0,
}: {
  contentClassName?: string;
  sideOffset?: number;
  delayDuration?: number;
}): React.JSX.Element {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent className={contentClassName} sideOffset={sideOffset}>
          Tooltip text
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

describe('Tooltip', () => {
  it('renders trigger', () => {
    render(<TestTooltip />);

    expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument();
  });

  it('content is hidden by default', () => {
    render(<TestTooltip />);

    expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
  });

  it('shows on hover', async () => {
    const user = userEvent.setup();
    render(<TestTooltip />);

    await user.hover(screen.getByRole('button', { name: 'Hover me' }));

    await waitFor(() => {
      expect(screen.getByText('Tooltip text')).toBeInTheDocument();
    });
  });

  it('hides on pointer leave', async () => {
    const user = userEvent.setup();
    render(<TestTooltip />);

    const trigger = screen.getByRole('button', { name: 'Hover me' });

    await user.hover(trigger);

    await waitFor(() => {
      expect(screen.getByText('Tooltip text')).toBeInTheDocument();
    });

    await user.unhover(trigger);

    await waitFor(() => {
      expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
    });
  });

  it('has data-slot on trigger', () => {
    render(<TestTooltip />);

    expect(screen.getByRole('button', { name: 'Hover me' })).toHaveAttribute(
      'data-slot',
      'tooltip-trigger',
    );
  });

  it('has data-slot on content', async () => {
    const user = userEvent.setup();
    render(<TestTooltip />);

    await user.hover(screen.getByRole('button', { name: 'Hover me' }));

    await waitFor(() => {
      expect(document.querySelector('[data-slot="tooltip-content"]')).toBeInTheDocument();
    });
  });

  it('merges custom className on content', async () => {
    const user = userEvent.setup();
    render(<TestTooltip contentClassName="custom-content-class" />);

    await user.hover(screen.getByRole('button', { name: 'Hover me' }));

    await waitFor(() => {
      expect(document.querySelector('[data-slot="tooltip-content"]')).toHaveClass(
        'custom-content-class',
      );
      expect(document.querySelector('[data-slot="tooltip-content"]')).toHaveClass('rounded-md');
    });
  });

  it('default sideOffset is active', async () => {
    const user = userEvent.setup();
    render(<TestTooltip />);

    await user.hover(screen.getByRole('button', { name: 'Hover me' }));

    await waitFor(() => {
      expect(document.querySelector('[data-slot="tooltip-content"]')).toHaveAttribute('data-side');
    });
  });

  it('forwards ref to TooltipContent element', async () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip defaultOpen>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent ref={ref}>Tooltip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    await waitFor(() => {
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    expect(ref.current).toHaveAttribute('data-slot', 'tooltip-content');
  });

  it('has no accessibility violations', async () => {
    const user = userEvent.setup();
    render(<TestTooltip />);

    await user.hover(screen.getByRole('button', { name: 'Hover me' }));

    await waitFor(() => {
      expect(screen.getByText('Tooltip text')).toBeInTheDocument();
    });

    const results = await axe(document.body);

    expect(results).toHaveNoViolations();
  });
});
