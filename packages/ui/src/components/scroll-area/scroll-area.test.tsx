import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { cn } from '../../lib/utils.js';
import { ScrollArea, ScrollBar } from './scroll-area.js';

function TestScrollArea({
  className,
  type,
  horizontal,
}: {
  className?: string;
  type?: 'auto' | 'always' | 'scroll' | 'hover';
  horizontal?: boolean;
}): React.JSX.Element {
  return (
    <ScrollArea className={cn('h-72 w-48', className)} type={type}>
      <div className="p-4">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="text-sm">
            Item {i + 1}
          </div>
        ))}
      </div>
      {horizontal && <ScrollBar orientation="horizontal" />}
    </ScrollArea>
  );
}

describe('ScrollArea', () => {
  it('renders without crashing', () => {
    render(<TestScrollArea />);

    expect(document.querySelector('[data-slot="scroll-area"]')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(<TestScrollArea />);

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 50')).toBeInTheDocument();
  });

  it('renders vertical scrollbar by default', () => {
    render(<TestScrollArea type="always" />);

    const scrollBar = document.querySelector('[data-slot="scroll-bar"]');
    expect(scrollBar).toBeInTheDocument();
    expect(scrollBar).toHaveAttribute('data-orientation', 'vertical');
  });

  it('renders horizontal scrollbar when added', () => {
    render(<TestScrollArea horizontal type="always" />);

    const scrollBars = document.querySelectorAll('[data-slot="scroll-bar"]');
    const horizontalBar = Array.from(scrollBars).find(
      (el) => el.getAttribute('data-orientation') === 'horizontal',
    );
    expect(horizontalBar).toBeInTheDocument();
  });

  it('data-slot on scroll-area', () => {
    render(<TestScrollArea />);

    expect(document.querySelector('[data-slot="scroll-area"]')).toBeInTheDocument();
  });

  it('data-slot on scroll-bar', () => {
    render(<TestScrollArea type="always" />);

    expect(document.querySelector('[data-slot="scroll-bar"]')).toBeInTheDocument();
  });

  it('merges custom className on ScrollArea', () => {
    render(<TestScrollArea className="custom-scroll-class" />);

    expect(document.querySelector('[data-slot="scroll-area"]')).toHaveClass('custom-scroll-class');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<TestScrollArea />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
