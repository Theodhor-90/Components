import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { DatePicker } from './date-picker.js';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  args: {},
};

export const Controlled: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date(2025, 0, 15));
    return <DatePicker date={date} onDateChange={setDate} />;
  },
};

export const WithDefaultDate: Story = {
  args: {
    defaultDate: new Date(2025, 0, 15),
  },
};

export const WithCustomFormat: Story = {
  args: {
    date: new Date(2025, 0, 15),
    formatDate: (date: Date) => date.toISOString().split('T')[0],
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Select date...',
  },
};
