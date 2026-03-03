import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { DatePicker } from './date-picker.js';

const january2025 = new Date(2025, 0, 10);

function dayLabelRegex(day: number): RegExp {
  return new RegExp(`January\\D*${day}\\D*2025`, 'i');
}

describe('DatePicker', () => {
  it('renders without crashing', () => {
    render(<DatePicker />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders placeholder when no date', () => {
    render(<DatePicker />);
    expect(screen.getByText('Pick a date')).toBeInTheDocument();
    expect(screen.getByText('Pick a date')).toHaveClass('text-muted-foreground');
  });

  it('renders formatted date when date is provided', () => {
    render(<DatePicker date={new Date(2025, 0, 15)} />);
    expect(screen.getByText('January 15, 2025')).toBeInTheDocument();
  });

  it('opens popover on trigger click', async () => {
    const user = userEvent.setup();
    render(<DatePicker />);

    await user.click(screen.getByRole('button', { name: /pick a date/i }));

    expect(document.querySelector('[data-slot="calendar"]')).toBeInTheDocument();
  });

  it('selecting a date closes popover and updates trigger text', async () => {
    const user = userEvent.setup();
    render(<DatePicker defaultDate={january2025} />);

    await user.click(screen.getByRole('button', { name: dayLabelRegex(10) }));
    await user.click(screen.getByRole('button', { name: dayLabelRegex(15) }));

    await waitFor(() => {
      expect(document.querySelector('[data-slot="calendar"]')).not.toBeInTheDocument();
    });
    expect(screen.getByText('January 15, 2025')).toBeInTheDocument();
  });

  it('supports controlled mode', async () => {
    const user = userEvent.setup();
    const onDateChange = vi.fn();
    render(<DatePicker date={new Date(2025, 0, 15)} onDateChange={onDateChange} />);

    expect(screen.getByText('January 15, 2025')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: dayLabelRegex(15) }));
    await user.click(screen.getByRole('button', { name: dayLabelRegex(20) }));

    expect(onDateChange).toHaveBeenCalled();
    const selectedDate = onDateChange.mock.calls.at(-1)?.[0];
    expect(selectedDate).toBeInstanceOf(Date);
    if (selectedDate instanceof Date) {
      expect(selectedDate.getFullYear()).toBe(2025);
      expect(selectedDate.getMonth()).toBe(0);
      expect(selectedDate.getDate()).toBe(20);
    }
    expect(screen.getByText('January 15, 2025')).toBeInTheDocument();
  });

  it('supports uncontrolled mode', () => {
    render(<DatePicker defaultDate={new Date(2025, 5, 1)} />);
    expect(screen.getByText('June 1, 2025')).toBeInTheDocument();
  });

  it('supports custom formatDate function', () => {
    const formatDate = (date: Date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    render(<DatePicker date={new Date(2025, 0, 15)} formatDate={formatDate} />);

    expect(screen.getByText('2025-01-15')).toBeInTheDocument();
  });

  it('disabled state prevents opening', async () => {
    const user = userEvent.setup();
    render(<DatePicker disabled />);

    const trigger = screen.getByRole('button');
    expect(trigger).toBeDisabled();

    await user.click(trigger);
    expect(document.querySelector('[data-slot="calendar"]')).not.toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<DatePicker />);
    expect(document.querySelector('[data-slot="date-picker"]')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<DatePicker />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
