import { createRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card.js';

function TestHoverCard({
  contentClassName,
  triggerClassName,
  align,
  sideOffset,
  openDelay = 0,
}: {
  contentClassName?: string;
  triggerClassName?: string;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  openDelay?: number;
}): React.JSX.Element {
  return (
    <HoverCard openDelay={openDelay}>
      <HoverCardTrigger className={triggerClassName}>Hover me</HoverCardTrigger>
      <HoverCardContent className={contentClassName} align={align} sideOffset={sideOffset}>
        Hover card content
      </HoverCardContent>
    </HoverCard>
  );
}

describe('HoverCard', () => {
  it('renders trigger', () => {
    render(<TestHoverCard />);

    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('content is hidden by default', () => {
    render(<TestHoverCard />);

    expect(screen.queryByText('Hover card content')).not.toBeInTheDocument();
  });

  it('shows on hover', async () => {
    const user = userEvent.setup();
    render(<TestHoverCard />);

    await user.hover(screen.getByText('Hover me'));

    await waitFor(() => {
      expect(screen.getByText('Hover card content')).toBeInTheDocument();
    });
  });

  it('hides on pointer leave', async () => {
    const user = userEvent.setup();
    render(<TestHoverCard />);

    const trigger = screen.getByText('Hover me');

    await user.hover(trigger);

    await waitFor(() => {
      expect(screen.getByText('Hover card content')).toBeInTheDocument();
    });

    await user.unhover(trigger);

    await waitFor(() => {
      expect(screen.queryByText('Hover card content')).not.toBeInTheDocument();
    });
  });

  it('has data-slot on trigger', () => {
    render(<TestHoverCard />);

    expect(screen.getByText('Hover me')).toHaveAttribute('data-slot', 'hover-card-trigger');
  });

  it('has data-slot on content', async () => {
    const user = userEvent.setup();
    render(<TestHoverCard />);

    await user.hover(screen.getByText('Hover me'));

    await waitFor(() => {
      expect(document.querySelector('[data-slot="hover-card-content"]')).toBeInTheDocument();
    });
  });

  it('merges custom className on content', async () => {
    const user = userEvent.setup();
    render(<TestHoverCard contentClassName="custom-content-class" />);

    await user.hover(screen.getByText('Hover me'));

    await waitFor(() => {
      expect(document.querySelector('[data-slot="hover-card-content"]')).toHaveClass(
        'custom-content-class',
      );
      expect(document.querySelector('[data-slot="hover-card-content"]')).toHaveClass('rounded-md');
    });
  });

  it('merges custom className on trigger', () => {
    render(<TestHoverCard triggerClassName="custom-trigger-class" />);

    expect(screen.getByText('Hover me')).toHaveClass('custom-trigger-class');
  });

  it('applies default align and sideOffset values', async () => {
    const user = userEvent.setup();
    render(<TestHoverCard />);

    await user.hover(screen.getByText('Hover me'));

    await waitFor(() => {
      expect(document.querySelector('[data-slot="hover-card-content"]')).toHaveAttribute(
        'data-align',
        'center',
      );
      expect(document.querySelector('[data-slot="hover-card-content"]')).toHaveAttribute(
        'data-side',
      );
    });
  });

  it('renders rich content', async () => {
    const user = userEvent.setup();
    render(
      <HoverCard openDelay={0}>
        <HoverCardTrigger>Hover me</HoverCardTrigger>
        <HoverCardContent>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">Name</h4>
            <p className="text-sm text-muted-foreground">Description text</p>
          </div>
        </HoverCardContent>
      </HoverCard>,
    );

    await user.hover(screen.getByText('Hover me'));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Name' })).toBeInTheDocument();
      expect(screen.getByText('Description text')).toBeInTheDocument();
    });
  });

  it('forwards ref to HoverCardContent element', async () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <HoverCard defaultOpen>
        <HoverCardTrigger>Hover me</HoverCardTrigger>
        <HoverCardContent ref={ref}>Hover card content</HoverCardContent>
      </HoverCard>,
    );

    await waitFor(() => {
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    expect(ref.current).toHaveAttribute('data-slot', 'hover-card-content');
  });

  it('has no accessibility violations', async () => {
    const user = userEvent.setup();
    const { container } = render(<TestHoverCard />);

    await user.hover(screen.getByText('Hover me'));

    await waitFor(() => {
      expect(screen.getByText('Hover card content')).toBeInTheDocument();
    });

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
