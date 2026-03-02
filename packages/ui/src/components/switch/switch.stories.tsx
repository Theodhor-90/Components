import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from '../label/label.js';
import { Switch } from './switch.js';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    'aria-label': 'Default switch',
  },
};

export const Checked: Story = {
  args: {
    defaultChecked: true,
    'aria-label': 'Checked switch',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    'aria-label': 'Disabled switch',
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
    'aria-label': 'Disabled checked switch',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="switch-with-label" />
      <Label htmlFor="switch-with-label">Airplane mode</Label>
    </div>
  ),
};

function ControlledDemo(): React.JSX.Element {
  const [checked, setChecked] = useState<boolean>(false);

  return <Switch checked={checked} onCheckedChange={setChecked} aria-label="Controlled switch" />;
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
