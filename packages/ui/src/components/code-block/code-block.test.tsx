import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CodeBlock } from './code-block.js';

const writeText = vi.fn().mockResolvedValue(undefined);

Object.defineProperty(navigator, 'clipboard', {
  value: { writeText },
  writable: true,
  configurable: true,
});

describe('CodeBlock', () => {
  beforeEach(() => {
    writeText.mockClear();
  });

  it('renders without crashing', () => {
    const { container } = render(<CodeBlock>{'code'}</CodeBlock>);
    expect(container.querySelector('[data-slot="code-block"]')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    const { container } = render(<CodeBlock>{'code'}</CodeBlock>);
    expect(container.querySelector('[data-slot="code-block"]')).toHaveAttribute(
      'data-slot',
      'code-block',
    );
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<CodeBlock ref={ref}>{'code'}</CodeBlock>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges custom className', () => {
    const { container } = render(<CodeBlock className="custom-class">{'code'}</CodeBlock>);
    const root = container.querySelector('[data-slot="code-block"]');
    expect(root).toHaveClass('custom-class');
    expect(root).toHaveClass('rounded-lg');
  });

  it('renders pre and code elements', () => {
    const { container } = render(<CodeBlock>{'code'}</CodeBlock>);
    expect(container.querySelector('pre')).not.toBeNull();
    expect(container.querySelector('code')).not.toBeNull();
  });

  it('displays language label when language prop is set', () => {
    render(<CodeBlock language="typescript">{'code'}</CodeBlock>);
    expect(screen.getByText('typescript')).toBeInTheDocument();
  });

  it('does not render language label by default', () => {
    const { container } = render(<CodeBlock>{'code'}</CodeBlock>);
    const header = container.querySelector(
      '.flex.items-center.justify-between.px-4.py-2.border-b',
    );
    expect(header).toBeNull();
  });

  it('renders line numbers when showLineNumbers is true', () => {
    render(<CodeBlock showLineNumbers>{'a\nb'}</CodeBlock>);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('does not render line numbers by default', () => {
    const { container } = render(<CodeBlock>{'a\nb'}</CodeBlock>);
    const lineNumbers = container.querySelectorAll('.select-none');
    expect(lineNumbers.length).toBe(0);
  });

  it('copy button copies the code content', () => {
    render(<CodeBlock>{'hello'}</CodeBlock>);
    fireEvent.click(screen.getByLabelText('Copy to clipboard'));
    expect(writeText).toHaveBeenCalledWith('hello');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<CodeBlock>{'code'}</CodeBlock>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
