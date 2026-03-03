import type { Meta, StoryObj } from '@storybook/react-vite';

import { Calendar } from './calendar.js';

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  args: {
    mode: 'single',
  },
};

export const DateRange: Story = {
  args: {
    mode: 'range',
  },
};

export const MultipleDates: Story = {
  args: {
    mode: 'multiple',
  },
};

export const WithDisabledDates: Story = {
  render: () => (
    <Calendar
      mode="single"
      defaultMonth={new Date(2025, 0, 1)}
      disabled={[new Date(2025, 0, 10), new Date(2025, 0, 15), new Date(2025, 0, 20)]}
    />
  ),
};

export const WithDefaultMonth: Story = {
  args: {
    mode: 'single',
    defaultMonth: new Date(2025, 0, 1),
  },
};
