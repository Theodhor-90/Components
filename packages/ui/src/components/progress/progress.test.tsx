import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Progress } from './progress.js';

describe('Progress', () => {
  it('renders without crashing', () => {
    render(<Progress value={60} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders indicator with translateX(-100%) for value=0', () => {
    render(<Progress value={0} />);

    const indicator = document.querySelector('[data-slot="progress-indicator"]');

    expect(indicator).toHaveStyle({ transform: 'translateX(-100%)' });
  });

  it('renders indicator with translateX(-50%) for value=50', () => {
    render(<Progress value={50} />);

    const indicator = document.querySelector('[data-slot="progress-indicator"]');

    expect(indicator).toHaveStyle({ transform: 'translateX(-50%)' });
  });

  it('renders indicator with translateX(0%) for value=100', () => {
    render(<Progress value={100} />);

    const indicator = document.querySelector('[data-slot="progress-indicator"]');

    expect(indicator).toHaveStyle({ transform: 'translateX(-0%)' });
  });

  it('treats undefined value as 0%', () => {
    render(<Progress />);

    const indicator = document.querySelector('[data-slot="progress-indicator"]');

    expect(indicator).toHaveStyle({ transform: 'translateX(-100%)' });
  });

  it('has data-slot="progress" on root', () => {
    render(<Progress value={60} />);

    expect(screen.getByRole('progressbar')).toHaveAttribute('data-slot', 'progress');
  });

  it('has data-slot="progress-indicator" on indicator', () => {
    render(<Progress value={60} />);

    expect(document.querySelector('[data-slot="progress-indicator"]')).toBeInTheDocument();
  });

  it('merges custom className on root', () => {
    render(<Progress value={60} className="custom-class" />);

    const root = screen.getByRole('progressbar');

    expect(root).toHaveClass('custom-class');
    expect(root).toHaveClass('rounded-full');
  });

  it('forwards ref to root element', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Progress value={60} ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute('data-slot', 'progress');
  });

  it('sets aria-valuenow to the value', () => {
    render(<Progress value={75} />);

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
  });

  it('sets aria-valuemin and aria-valuemax', () => {
    render(<Progress value={50} />);

    const root = screen.getByRole('progressbar');

    expect(root).toHaveAttribute('aria-valuemin', '0');
    expect(root).toHaveAttribute('aria-valuemax', '100');
  });

  it('has role="progressbar"', () => {
    render(<Progress value={60} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Progress value={60} aria-label="Progress" />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
