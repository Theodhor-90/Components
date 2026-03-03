import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { TimePicker } from './time-picker.js';

beforeAll(() => {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }

  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {};
  }

  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = () => {};
  }

  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
});

describe('TimePicker', () => {
  it('renders without crashing', () => {
    render(<TimePicker />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders placeholder when no time', () => {
    render(<TimePicker />);
    expect(screen.getByText('Pick a time')).toBeInTheDocument();
    expect(screen.getByText('Pick a time')).toHaveClass('text-muted-foreground');
  });

  it('renders custom placeholder', () => {
    render(<TimePicker placeholder="Select time..." />);
    expect(screen.getByText('Select time...')).toBeInTheDocument();
  });

  it('renders formatted time when value is provided', () => {
    render(<TimePicker value="14:30" />);
    expect(screen.getByText('14:30')).toBeInTheDocument();
  });

  it('opens popover on trigger click', async () => {
    const user = userEvent.setup();
    render(<TimePicker />);

    await user.click(screen.getByRole('button', { name: /pick a time/i }));

    expect(document.querySelectorAll('[data-slot="select-trigger"]')).toHaveLength(2);
  });

  it('selecting hour and minute updates trigger text', async () => {
    const user = userEvent.setup();
    render(<TimePicker />);

    await user.click(screen.getByRole('button', { name: /pick a time/i }));

    const [hourSelect, minuteSelect] = screen.getAllByRole('combobox');

    await user.click(hourSelect);
    await user.click(await screen.findByRole('option', { name: '10' }));

    await user.click(minuteSelect);
    await user.click(await screen.findByRole('option', { name: '30' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '10:30' })).toBeInTheDocument();
    });
  });

  it('supports controlled mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TimePicker value="09:15" onChange={onChange} />);

    expect(screen.getByText('09:15')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '09:15' }));
    const [hourSelect] = screen.getAllByRole('combobox');
    await user.click(hourSelect);
    await user.click(screen.getByRole('option', { name: '10' }));

    expect(onChange).toHaveBeenCalledWith('10:15');
    expect(screen.getByText('09:15')).toBeInTheDocument();
  });

  it('supports uncontrolled mode with defaultValue', () => {
    render(<TimePicker defaultValue="08:00" />);
    expect(screen.getByText('08:00')).toBeInTheDocument();
  });

  it('disabled state prevents opening', async () => {
    const user = userEvent.setup();
    render(<TimePicker disabled />);

    const trigger = screen.getByRole('button');
    expect(trigger).toBeDisabled();

    await user.click(trigger);
    expect(document.querySelector('[data-slot="select-trigger"]')).not.toBeInTheDocument();
  });

  it('hour select has 24 options', async () => {
    const user = userEvent.setup();
    render(<TimePicker />);

    await user.click(screen.getByRole('button', { name: /pick a time/i }));
    const [hourSelect] = screen.getAllByRole('combobox');
    await user.click(hourSelect);

    const options = await screen.findAllByRole('option');
    expect(options).toHaveLength(24);
    expect(options[0]).toHaveTextContent('00');
    expect(options[23]).toHaveTextContent('23');
  });

  it('minute select has 60 options', async () => {
    const user = userEvent.setup();
    render(<TimePicker />);

    await user.click(screen.getByRole('button', { name: /pick a time/i }));
    const [, minuteSelect] = screen.getAllByRole('combobox');
    await user.click(minuteSelect);

    const options = await screen.findAllByRole('option');
    expect(options).toHaveLength(60);
    expect(options[0]).toHaveTextContent('00');
    expect(options[59]).toHaveTextContent('59');
  });

  it('has data-slot attribute', () => {
    render(<TimePicker />);
    expect(document.querySelector('[data-slot="time-picker"]')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<TimePicker />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
