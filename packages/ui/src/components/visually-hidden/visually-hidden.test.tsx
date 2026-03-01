import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { VisuallyHidden } from './visually-hidden.js';

describe('VisuallyHidden', () => {
  it('renders with default props', () => {
    render(<VisuallyHidden>Hidden text</VisuallyHidden>);
    expect(screen.getByText('Hidden text')).toBeInTheDocument();
  });

  it('content is visually hidden with inline styles', () => {
    render(<VisuallyHidden>SR only</VisuallyHidden>);
    const hiddenContent = screen.getByText('SR only');
    const style = hiddenContent.getAttribute('style');

    expect(style).not.toBeNull();
    expect(style).toContain('position');
    expect(style).toContain('absolute');
    expect(style).toContain('overflow');
    expect(style).toContain('hidden');
  });

  it('screen reader accessible via text query', () => {
    render(<VisuallyHidden>Screen reader text</VisuallyHidden>);
    expect(screen.getByText('Screen reader text')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<VisuallyHidden>Slot test</VisuallyHidden>);
    expect(screen.getByText('Slot test')).toHaveAttribute('data-slot', 'visually-hidden');
  });

  it('renders as child element with asChild', () => {
    render(
      <VisuallyHidden asChild>
        <span data-testid="custom">Custom</span>
      </VisuallyHidden>,
    );

    const customElement = screen.getByTestId('custom');
    expect(customElement).toBeInTheDocument();
    expect(customElement.tagName).toBe('SPAN');
    expect(customElement).toHaveAttribute('data-slot', 'visually-hidden');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <button type="button">
        <VisuallyHidden>Click me</VisuallyHidden>
        <svg aria-hidden="true" viewBox="0 0 10 10">
          <circle cx="5" cy="5" r="5" />
        </svg>
      </button>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
