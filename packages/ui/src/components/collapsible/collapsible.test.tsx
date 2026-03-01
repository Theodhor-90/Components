import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible.js';

function TestCollapsible({
  open,
  defaultOpen,
  onOpenChange,
  triggerClassName,
  contentClassName,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerClassName?: string;
  contentClassName?: string;
}): React.JSX.Element {
  return (
    <Collapsible open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger className={triggerClassName}>Toggle</CollapsibleTrigger>
      <CollapsibleContent className={contentClassName}>
        <p>Collapsible content</p>
      </CollapsibleContent>
    </Collapsible>
  );
}

function expectCollapsedContent(): void {
  const content = screen.queryByText('Collapsible content');

  if (content) {
    expect(content).not.toBeVisible();
    return;
  }

  expect(content).not.toBeInTheDocument();
}

describe('Collapsible', () => {
  it('renders trigger (collapsed by default)', () => {
    render(<TestCollapsible />);

    expect(screen.getByRole('button', { name: 'Toggle' })).toBeInTheDocument();
    expectCollapsedContent();
  });

  it('toggles content visibility on trigger click', async () => {
    const user = userEvent.setup();
    render(<TestCollapsible />);

    await user.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(screen.getByText('Collapsible content')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Toggle' }));
    expectCollapsedContent();
  });

  it('defaultOpen renders content visible initially', () => {
    render(<TestCollapsible defaultOpen />);

    expect(screen.getByText('Collapsible content')).toBeVisible();
  });

  it('controlled mode (open/onOpenChange)', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<TestCollapsible open onOpenChange={onOpenChange} />);

    expect(screen.getByText('Collapsible content')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('keyboard activation (Enter/Space)', async () => {
    const user = userEvent.setup();
    render(<TestCollapsible />);

    const trigger = screen.getByRole('button', { name: 'Toggle' });
    trigger.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByText('Collapsible content')).toBeVisible();

    await user.keyboard('{Space}');
    expectCollapsedContent();
  });

  it('has data-slot attributes on trigger and content', () => {
    render(<TestCollapsible defaultOpen />);

    expect(document.querySelector('[data-slot="collapsible-trigger"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="collapsible-content"]')).toBeInTheDocument();
  });

  it('merges custom className on trigger and content', () => {
    render(
      <TestCollapsible
        defaultOpen
        triggerClassName="custom-trigger"
        contentClassName="custom-content"
      />,
    );

    expect(screen.getByRole('button', { name: 'Toggle' })).toHaveClass('custom-trigger');

    const content = document.querySelector('[data-slot="collapsible-content"]');
    if (!(content instanceof HTMLElement)) {
      throw new Error('Collapsible content is missing');
    }

    expect(content).toHaveClass('custom-content');
    expect(content).toHaveClass('overflow-hidden');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<TestCollapsible defaultOpen />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
