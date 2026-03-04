import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Calendar } from './calendar.js';

const january2025 = new Date(2025, 0, 1);

function dayLabelRegex(day: number): RegExp {
  return new RegExp(`January\\D*${day}\\D*2025`, 'i');
}

function ControlledMultipleCalendar({
  onSelect,
}: {
  onSelect: (selected: Date[] | undefined) => void;
}): React.JSX.Element {
  const [selected, setSelected] = useState<Date[] | undefined>([]);

  return (
    <Calendar
      mode="multiple"
      defaultMonth={january2025}
      selected={selected}
      onSelect={(nextSelection) => {
        const normalized = nextSelection as Date[] | undefined;
        setSelected(normalized);
        onSelect(normalized);
      }}
    />
  );
}

describe('Calendar', () => {
  it('renders without crashing', () => {
    render(<Calendar />);
    expect(document.querySelector('[data-slot="calendar"]')).toBeInTheDocument();
  });

  it('renders current month by default', () => {
    render(<Calendar />);
    const currentMonth = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(new Date());
    expect(screen.getByText(currentMonth)).toBeInTheDocument();
  });

  it('has data-slot attribute on root element', () => {
    render(<Calendar />);
    expect(document.querySelector('[data-slot="calendar"]')).toBeInTheDocument();
  });

  it('navigates to next month when next button is clicked', async () => {
    const user = userEvent.setup();
    render(<Calendar defaultMonth={january2025} />);

    expect(screen.getByText('January 2025')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText('February 2025')).toBeInTheDocument();
  });

  it('navigates to previous month when previous button is clicked', async () => {
    const user = userEvent.setup();
    render(<Calendar defaultMonth={new Date(2025, 1, 1)} />);

    expect(screen.getByText('February 2025')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /previous/i }));
    expect(screen.getByText('January 2025')).toBeInTheDocument();
  });

  it('supports single date selection', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Calendar mode="single" defaultMonth={january2025} onSelect={onSelect} />);

    await user.click(screen.getByRole('button', { name: dayLabelRegex(15) }));

    expect(onSelect).toHaveBeenCalled();
    expect(onSelect.mock.calls.at(-1)?.[0]).toBeInstanceOf(Date);
  });

  it('supports range date selection', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Calendar mode="range" defaultMonth={january2025} onSelect={onSelect} />);

    await user.click(screen.getByRole('button', { name: dayLabelRegex(10) }));
    await user.click(screen.getByRole('button', { name: dayLabelRegex(15) }));

    expect(onSelect).toHaveBeenCalled();
    expect(onSelect.mock.calls.at(-1)?.[0]).toEqual(
      expect.objectContaining({
        from: expect.any(Date),
        to: expect.any(Date),
      }),
    );
  });

  it('supports multiple date selection', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<ControlledMultipleCalendar onSelect={onSelect} />);

    await user.click(screen.getByRole('button', { name: dayLabelRegex(10) }));
    await user.click(screen.getByRole('button', { name: dayLabelRegex(15) }));

    expect(onSelect).toHaveBeenCalled();
    const selection = onSelect.mock.calls.at(-1)?.[0];
    expect(Array.isArray(selection)).toBe(true);
    if (Array.isArray(selection)) {
      expect(selection).toHaveLength(2);
    }
  });

  it('does not select disabled dates', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Calendar
        mode="single"
        defaultMonth={january2025}
        disabled={[new Date(2025, 0, 15)]}
        onSelect={onSelect}
      />,
    );

    const disabledDay = screen.getByRole('button', { name: dayLabelRegex(15) });
    expect(disabledDay).toBeDisabled();

    await user.click(disabledDay);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('renders outside-month dates with muted styling', () => {
    const { container } = render(<Calendar showOutsideDays defaultMonth={january2025} />);
    expect(container.querySelector('.text-muted-foreground.opacity-50')).toBeInTheDocument();
  });

  it("renders today's date with distinct styling", () => {
    const { container } = render(<Calendar />);
    expect(container.querySelector('.bg-accent.text-accent-foreground')).toBeInTheDocument();
  });

  it('merges custom className on root element', () => {
    render(<Calendar className="custom-class" />);
    expect(document.querySelector('[data-slot="calendar"]')).toHaveClass('custom-class');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Calendar />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
