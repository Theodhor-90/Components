import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { TimePicker } from './time-picker.js';

const meta: Meta<typeof TimePicker> = {
  title: 'Components/TimePicker',
  component: TimePicker,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

export const Default: Story = {
  args: {},
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>('14:30');
    return <TimePicker value={value} onChange={setValue} />;
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: '09:00',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Select time...',
  },
};
