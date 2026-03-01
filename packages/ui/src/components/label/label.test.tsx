import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Label } from './label.js';

describe('Label', () => {
  it('renders with default props', () => {
    render(<Label>Name</Label>);
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('renders as a label element', () => {
    render(<Label>Name</Label>);
    expect(screen.getByText('Name').tagName).toBe('LABEL');
  });

  it('binds htmlFor attribute', () => {
    render(<Label htmlFor="email">Email</Label>);
    expect(screen.getByText('Email')).toHaveAttribute('for', 'email');
  });

  it('has data-slot attribute', () => {
    render(<Label>Name</Label>);
    expect(screen.getByText('Name')).toHaveAttribute('data-slot', 'label');
  });

  it('applies base CVA classes', () => {
    render(<Label>Name</Label>);
    expect(screen.getByText('Name')).toHaveClass('text-sm');
    expect(screen.getByText('Name')).toHaveClass('font-medium');
  });

  it('renders as child element with asChild', () => {
    render(
      <Label asChild>
        <span data-testid="custom">Custom</span>
      </Label>,
    );

    const customLabel = screen.getByTestId('custom');
    expect(customLabel).toBeInTheDocument();
    expect(customLabel.tagName).toBe('SPAN');
    expect(customLabel).toHaveAttribute('data-slot', 'label');
    expect(customLabel).toHaveClass('text-sm');
    expect(customLabel).toHaveClass('font-medium');
  });

  it('merges custom className', () => {
    render(<Label className="custom-class">Name</Label>);
    expect(screen.getByText('Name')).toHaveClass('custom-class');
    expect(screen.getByText('Name')).toHaveClass('text-sm');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <div>
        <Label htmlFor="input">Name</Label>
        <input id="input" />
      </div>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
