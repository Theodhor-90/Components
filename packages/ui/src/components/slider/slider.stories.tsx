import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from '../label/label.js';
import { Slider } from './slider.js';

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {
    'aria-label': 'Default slider',
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: [50],
    'aria-label': 'Slider with default value',
  },
};

export const Range: Story = {
  args: {
    defaultValue: [25, 75],
    'aria-label': 'Range slider',
  },
};

export const CustomMinMaxStep: Story = {
  args: {
    min: 0,
    max: 10,
    step: 2,
    defaultValue: [4],
    'aria-label': 'Custom min/max/step slider',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: [50],
    'aria-label': 'Disabled slider',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="volume">Volume</Label>
      <Slider id="volume" defaultValue={[50]} aria-label="Volume" />
    </div>
  ),
};

function ControlledDemo(): React.JSX.Element {
  const [value, setValue] = useState<number[]>([50]);

  return (
    <div className="space-y-2">
      <Slider value={value} onValueChange={setValue} aria-label="Controlled slider" />
      <p className="text-sm text-muted-foreground">Value: {value[0]}</p>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
