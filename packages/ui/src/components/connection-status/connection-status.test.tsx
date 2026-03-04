import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { ConnectionStatus } from './connection-status.js';

describe('ConnectionStatus', () => {
  it('renders without crashing', () => {
    const { container } = render(<ConnectionStatus status="connected" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('has data-slot attribute on root', () => {
    render(<ConnectionStatus status="connected" />);
    expect(screen.getByRole('status')).toHaveAttribute('data-slot', 'connection-status');
  });

  it('has data-slot attribute on dot', () => {
    const { container } = render(<ConnectionStatus status="connected" />);
    const dot = container.querySelector('[data-slot="connection-status-dot"]');
    expect(dot).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ConnectionStatus status="connected" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges custom className', () => {
    render(<ConnectionStatus status="connected" className="custom-class" />);
    const root = screen.getByRole('status');
    expect(root).toHaveClass('custom-class');
    expect(root).toHaveClass('inline-flex');
  });

  it('renders default label for connected', () => {
    render(<ConnectionStatus status="connected" />);
    expect(screen.getByText('Connected')).toBeInTheDocument();
  });

  it('renders default label for connecting', () => {
    render(<ConnectionStatus status="connecting" />);
    expect(screen.getByText('Connecting')).toBeInTheDocument();
  });

  it('renders default label for disconnected', () => {
    render(<ConnectionStatus status="disconnected" />);
    expect(screen.getByText('Disconnected')).toBeInTheDocument();
  });

  it('renders custom label when children provided', () => {
    render(<ConnectionStatus status="connected">Online</ConnectionStatus>);
    expect(screen.getByText('Online')).toBeInTheDocument();
    expect(screen.queryByText('Connected')).not.toBeInTheDocument();
  });

  it('applies correct color class for each status', () => {
    const { container: c1 } = render(<ConnectionStatus status="connected" />);
    expect(c1.querySelector('[data-slot="connection-status-dot"]')).toHaveClass('bg-green-500');

    const { container: c2 } = render(<ConnectionStatus status="connecting" />);
    expect(c2.querySelector('[data-slot="connection-status-dot"]')).toHaveClass('bg-yellow-500');

    const { container: c3 } = render(<ConnectionStatus status="disconnected" />);
    expect(c3.querySelector('[data-slot="connection-status-dot"]')).toHaveClass('bg-red-500');
  });

  it('applies animate-pulse only for connecting', () => {
    const { container: c1 } = render(<ConnectionStatus status="connecting" />);
    expect(c1.querySelector('[data-slot="connection-status-dot"]')).toHaveClass('animate-pulse');

    const { container: c2 } = render(<ConnectionStatus status="connected" />);
    expect(c2.querySelector('[data-slot="connection-status-dot"]')).not.toHaveClass('animate-pulse');

    const { container: c3 } = render(<ConnectionStatus status="disconnected" />);
    expect(c3.querySelector('[data-slot="connection-status-dot"]')).not.toHaveClass('animate-pulse');
  });

  it('has role="status" and aria-live="polite"', () => {
    render(<ConnectionStatus status="connected" />);
    const root = screen.getByRole('status');
    expect(root).toHaveAttribute('aria-live', 'polite');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ConnectionStatus status="connected" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
