import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from '../label/label.js';
import { Checkbox } from './checkbox.js';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'select',
      options: [true, false, 'indeterminate'],
    },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    'aria-label': 'Default checkbox',
  },
};

export const Checked: Story = {
  args: {
    defaultChecked: true,
    'aria-label': 'Checked checkbox',
  },
};

export const Indeterminate: Story = {
  args: {
    checked: 'indeterminate',
    'aria-label': 'Indeterminate checkbox',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    'aria-label': 'Disabled checkbox',
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
    'aria-label': 'Disabled checked checkbox',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="checkbox-with-label" />
      <Label htmlFor="checkbox-with-label">Accept terms and conditions</Label>
    </div>
  ),
};

function ControlledDemo(): React.JSX.Element {
  const [checked, setChecked] = useState<boolean | 'indeterminate'>(false);

  return (
    <Checkbox checked={checked} onCheckedChange={setChecked} aria-label="Controlled checkbox" />
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
