import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Textarea } from './textarea.js';

describe('Textarea', () => {
  it('renders without crashing', () => {
    render(<Textarea aria-label="Test textarea" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<Textarea aria-label="Test" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('data-slot', 'textarea');
  });

  it('merges custom className', () => {
    render(<Textarea aria-label="Test" className="custom-class" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });

  it('supports disabled state', () => {
    render(<Textarea disabled aria-label="Disabled" />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('supports aria-invalid for error state', () => {
    render(<Textarea aria-invalid="true" aria-label="Error" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders placeholder text', () => {
    render(<Textarea placeholder="Enter text..." aria-label="With placeholder" />);
    expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument();
  });

  it('supports controlled usage', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea value="hello" onChange={onChange} aria-label="Controlled" />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('hello');

    await user.type(textarea, 'a');
    expect(onChange).toHaveBeenCalled();
  });

  it('supports uncontrolled usage', async () => {
    const user = userEvent.setup();
    render(<Textarea defaultValue="initial" aria-label="Uncontrolled" />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('initial');

    await user.clear(textarea);
    await user.type(textarea, 'updated');
    expect(textarea).toHaveValue('updated');
  });

  it('applies field-sizing style when autoResize is true', () => {
    render(<Textarea autoResize aria-label="Auto resize" />);
    expect(screen.getByRole('textbox').style.fieldSizing).toBe('content');
  });

  it('does not apply field-sizing style by default', () => {
    render(<Textarea aria-label="Default resize" />);
    expect(screen.getByRole('textbox').style.fieldSizing).toBeFalsy();
  });

  it('merges user style with autoResize style', () => {
    render(<Textarea autoResize aria-label="Styled" style={{ color: 'red' }} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea.style.fieldSizing).toBe('content');
    expect(textarea.style.color).toBe('red');
  });

  it('renders as child element when asChild is true', () => {
    render(
      <Textarea asChild>
        <div aria-label="Custom element" />
      </Textarea>,
    );
    const el = screen.getByLabelText('Custom element');
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveAttribute('data-slot', 'textarea');
  });

  it('forwards ref to the textarea element', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} aria-label="Ref test" />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Textarea aria-label="Accessible textarea" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations in error state', async () => {
    const { container } = render(<Textarea aria-invalid="true" aria-label="Error textarea" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
