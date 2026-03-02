import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Input } from './input.js';

describe('Input', () => {
  it('renders without crashing', () => {
    render(<Input aria-label="Test input" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<Input aria-label="Test" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('data-slot', 'input');
  });

  it('merges custom className', () => {
    render(<Input aria-label="Test" className="custom-class" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });

  it('renders with different type attributes', () => {
    const { rerender } = render(<Input type="password" aria-label="Password" />);
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');

    rerender(<Input type="email" aria-label="Email" />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');

    rerender(<Input type="number" aria-label="Number" />);
    expect(screen.getByLabelText('Number')).toHaveAttribute('type', 'number');
  });

  it('supports disabled state', () => {
    render(<Input disabled aria-label="Disabled" />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('supports aria-invalid for error state', () => {
    render(<Input aria-invalid="true" aria-label="Error" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders placeholder text', () => {
    render(<Input placeholder="Enter text..." aria-label="With placeholder" />);
    expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument();
  });

  it('supports controlled usage', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input value="hello" onChange={onChange} aria-label="Controlled" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('hello');

    await user.type(input, 'a');
    expect(onChange).toHaveBeenCalled();
  });

  it('supports uncontrolled usage', async () => {
    const user = userEvent.setup();
    render(<Input defaultValue="initial" aria-label="Uncontrolled" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('initial');

    await user.clear(input);
    await user.type(input, 'updated');
    expect(input).toHaveValue('updated');
  });

  it('renders as child element when asChild is true', () => {
    render(
      <Input asChild>
        <textarea aria-label="Custom element" />
      </Input>,
    );
    const el = screen.getByLabelText('Custom element');
    expect(el.tagName).toBe('TEXTAREA');
    expect(el).toHaveAttribute('data-slot', 'input');
  });

  it('forwards ref to the input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} aria-label="Ref test" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Input aria-label="Accessible input" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations in error state', async () => {
    const { container } = render(<Input aria-invalid="true" aria-label="Error input" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
