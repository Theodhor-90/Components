import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Spinner } from './spinner.js';

describe('Spinner', () => {
  it('renders without crashing', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has role="status" on the root element', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner.tagName.toLowerCase()).toBe('span');
  });

  it('renders a default sr-only loading label', () => {
    render(<Spinner />);
    const loadingLabel = screen.getByText('Loading');
    expect(loadingLabel).toHaveClass('sr-only');
  });

  it('omits the sr-only loading label when aria-label is provided', () => {
    render(<Spinner aria-label="Saving" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', 'Saving');
    expect(screen.queryByText('Loading')).not.toBeInTheDocument();
  });

  it('applies default size (md) classes', () => {
    render(<Spinner />);
    const svg = screen.getByRole('status').querySelector('svg');
    if (!svg) {
      throw new Error('Expected spinner to render an svg element');
    }
    expect(svg).toHaveClass('h-6', 'w-6');
  });

  it('applies sm size classes', () => {
    render(<Spinner size="sm" />);
    const svg = screen.getByRole('status').querySelector('svg');
    if (!svg) {
      throw new Error('Expected spinner to render an svg element');
    }
    expect(svg).toHaveClass('h-4', 'w-4');
  });

  it('applies lg size classes', () => {
    render(<Spinner size="lg" />);
    const svg = screen.getByRole('status').querySelector('svg');
    if (!svg) {
      throw new Error('Expected spinner to render an svg element');
    }
    expect(svg).toHaveClass('h-8', 'w-8');
  });

  it('applies animate-spin class', () => {
    render(<Spinner />);
    const svg = screen.getByRole('status').querySelector('svg');
    if (!svg) {
      throw new Error('Expected spinner to render an svg element');
    }
    expect(svg).toHaveClass('animate-spin');
  });

  it('merges custom className', () => {
    render(<Spinner className="text-primary" />);
    const svg = screen.getByRole('status').querySelector('svg');
    if (!svg) {
      throw new Error('Expected spinner to render an svg element');
    }
    expect(svg).toHaveClass('text-primary');
  });

  it('has data-slot attribute', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveAttribute('data-slot', 'spinner');
  });

  it('uses currentColor for stroke', () => {
    render(<Spinner />);
    const circle = screen.getByRole('status').querySelector('circle');
    if (!circle) {
      throw new Error('Expected spinner to render a circle element');
    }
    expect(circle).toHaveAttribute('stroke', 'currentColor');
  });

  it('uses stroke-dasharray for arc', () => {
    render(<Spinner />);
    const circle = screen.getByRole('status').querySelector('circle');
    if (!circle) {
      throw new Error('Expected spinner to render a circle element');
    }
    expect(circle).toHaveAttribute('stroke-dasharray');
  });

  it('forwards ref to svg element', () => {
    const ref = createRef<SVGSVGElement>();
    render(<Spinner ref={ref} />);
    expect(ref.current).toBeInstanceOf(SVGSVGElement);
    expect(ref.current?.tagName.toLowerCase()).toBe('svg');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Spinner />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
