import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { EmptyState } from './empty-state.js';

describe('EmptyState', () => {
  it('renders with only required title prop', () => {
    render(<EmptyState title="Empty" />);

    expect(screen.getByRole('heading', { name: 'Empty' })).toBeInTheDocument();
  });

  it('has data-slot="empty-state" on root', () => {
    const { container } = render(<EmptyState title="Title" />);

    expect(container.querySelector('[data-slot="empty-state"]')).toBeInTheDocument();
  });

  it('renders icon when icon prop is provided', () => {
    const { container } = render(<EmptyState title="Title" icon={<svg data-testid="test-icon" />} />);

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="empty-state-icon"]')).toBeInTheDocument();
  });

  it('does not render icon wrapper when icon is absent', () => {
    const { container } = render(<EmptyState title="Title" />);

    expect(container.querySelector('[data-slot="empty-state-icon"]')).toBeNull();
  });

  it('renders description when provided', () => {
    const { container } = render(<EmptyState title="Title" description="Description" />);

    const description = screen.getByText('Description');

    expect(description).toBeInTheDocument();
    expect(description.tagName).toBe('P');
    expect(container.querySelector('[data-slot="empty-state-description"]')).toBeInTheDocument();
  });

  it('does not render description when absent', () => {
    const { container } = render(<EmptyState title="Title" />);

    expect(container.querySelector('[data-slot="empty-state-description"]')).toBeNull();
  });

  it('renders action when provided', () => {
    const { container } = render(<EmptyState title="Title" action={<button>Go</button>} />);

    expect(screen.getByRole('button', { name: 'Go' })).toBeInTheDocument();
    expect(container.querySelector('[data-slot="empty-state-action"]')).toBeInTheDocument();
  });

  it('does not render action wrapper when action is absent', () => {
    const { container } = render(<EmptyState title="Title" />);

    expect(container.querySelector('[data-slot="empty-state-action"]')).toBeNull();
  });

  it('merges custom className onto root', () => {
    const { container } = render(<EmptyState title="Title" className="custom-class" />);

    const root = container.querySelector('[data-slot="empty-state"]');

    expect(root).toHaveClass('custom-class');
    expect(root).toHaveClass('flex');
    expect(root).toHaveClass('flex-col');
  });

  it('forwards ref to root div', () => {
    const ref = createRef<HTMLDivElement>();

    render(<EmptyState title="Title" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute('data-slot', 'empty-state');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <EmptyState
        icon={
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M3 6h18v12H3z" />
          </svg>
        }
        title="No items"
        description="Create your first item to get started."
        action={<button>Create item</button>}
      />,
    );

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
