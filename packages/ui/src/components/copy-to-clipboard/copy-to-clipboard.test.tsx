import { createRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CopyToClipboard } from './copy-to-clipboard.js';

const writeText = vi.fn().mockResolvedValue(undefined);

Object.defineProperty(navigator, 'clipboard', {
  value: { writeText },
  writable: true,
  configurable: true,
});

describe('CopyToClipboard', () => {
  beforeEach(() => {
    writeText.mockClear();
  });

  it('renders without crashing', () => {
    render(<CopyToClipboard text="test" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<CopyToClipboard text="test" />);
    expect(screen.getByRole('button')).toHaveAttribute('data-slot', 'copy-to-clipboard');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<CopyToClipboard text="test" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('merges custom className', () => {
    render(<CopyToClipboard text="test" className="custom-class" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('inline-flex');
  });

  it('calls navigator.clipboard.writeText with correct text on click', () => {
    render(<CopyToClipboard text="hello world" />);
    fireEvent.click(screen.getByRole('button'));
    expect(writeText).toHaveBeenCalledWith('hello world');
  });

  it('swaps to checkmark icon after click', () => {
    vi.useFakeTimers();
    render(<CopyToClipboard text="test" />);
    const button = screen.getByRole('button');

    expect(button.querySelector('polyline')).toBeNull();
    expect(button.querySelector('rect')).not.toBeNull();

    fireEvent.click(button);

    expect(button.querySelector('polyline')).not.toBeNull();
    expect(button.querySelector('rect')).toBeNull();
    vi.useRealTimers();
  });

  it('resets to copy icon after 2000ms', () => {
    vi.useFakeTimers();
    render(<CopyToClipboard text="test" />);
    const button = screen.getByRole('button');

    fireEvent.click(button);
    expect(button.querySelector('polyline')).not.toBeNull();

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(button.querySelector('polyline')).toBeNull();
    expect(button.querySelector('rect')).not.toBeNull();
    vi.useRealTimers();
  });

  it('toggles aria-label between Copy to clipboard and Copied', () => {
    vi.useFakeTimers();
    render(<CopyToClipboard text="test" />);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-label', 'Copy to clipboard');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Copied');

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(button).toHaveAttribute('aria-label', 'Copy to clipboard');
    vi.useRealTimers();
  });

  it('renders as child element when asChild is true', () => {
    render(
      <CopyToClipboard text="test" asChild>
        <a href="/test">Copy</a>
      </CopyToClipboard>,
    );
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('calls custom onClick handler', () => {
    const onClick = vi.fn();
    render(<CopyToClipboard text="test" onClick={onClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith('test');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<CopyToClipboard text="test" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
