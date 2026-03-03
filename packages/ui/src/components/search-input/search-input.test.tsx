import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { SearchInput } from './search-input.js';

describe('SearchInput', () => {
  it('renders without crashing', () => {
    render(<SearchInput />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('has data-slot on root', () => {
    const { container } = render(<SearchInput />);
    expect(container.querySelector('[data-slot="search-input"]')).toBeInTheDocument();
  });

  it('renders search icon', () => {
    const { container } = render(<SearchInput />);
    expect(container.querySelector('svg[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('hides clear button when input is empty', () => {
    render(<SearchInput />);
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
  });

  it('shows clear button when input has value', () => {
    render(<SearchInput defaultValue="hello" />);
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
  });

  it('calls onSearch with current value on Enter', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<SearchInput onSearch={onSearch} placeholder="Search..." />);

    const input = screen.getByRole('searchbox');
    await user.type(input, 'test query');
    await user.keyboard('{Enter}');

    expect(onSearch).toHaveBeenCalledWith('test query');
  });

  it('calls onClear when clear button is clicked', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();

    render(<SearchInput defaultValue="hello" onClear={onClear} />);

    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('clears input value on clear button click', async () => {
    const user = userEvent.setup();

    render(<SearchInput defaultValue="hello" />);

    const input = screen.getByRole('searchbox');
    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(input).toHaveValue('');
  });

  it('refocuses input after clear button click', async () => {
    const user = userEvent.setup();

    render(<SearchInput defaultValue="hello" />);

    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(screen.getByRole('searchbox')).toHaveFocus();
  });

  it('supports controlled mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<SearchInput value="controlled" onChange={onChange} aria-label="Controlled search" />);

    const input = screen.getByRole('searchbox');
    expect(input).toHaveValue('controlled');

    await user.type(input, 'a');

    expect(onChange).toHaveBeenCalled();
    expect(input).toHaveValue('controlled');
  });

  it('supports uncontrolled mode', async () => {
    const user = userEvent.setup();

    render(<SearchInput aria-label="Uncontrolled search" />);

    const input = screen.getByRole('searchbox');
    await user.type(input, 'hello');

    expect(input).toHaveValue('hello');
  });

  it('forwards ref to the input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<SearchInput ref={ref} aria-label="Ref test" />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toHaveAttribute('type', 'search');
  });

  it('merges custom className onto container', () => {
    const { container } = render(<SearchInput className="custom-class" aria-label="Styled search" />);
    expect(container.querySelector('[data-slot="search-input"]')).toHaveClass('custom-class');
  });

  it('passes placeholder through to input', () => {
    render(<SearchInput placeholder="Search..." />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<SearchInput aria-label="Search" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
