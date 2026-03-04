import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { ColorPicker } from './color-picker.js';

function ControlledColorPicker(): React.JSX.Element {
  const [value, setValue] = useState<string | undefined>('#3b82f6');
  return <ColorPicker value={value} onValueChange={setValue} />;
}

const meta: Meta<typeof ColorPicker> = {
  title: 'Components/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const Default: Story = {
  args: {},
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: '#ef4444',
  },
};

export const Controlled: Story = {
  render: () => <ControlledColorPicker />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
