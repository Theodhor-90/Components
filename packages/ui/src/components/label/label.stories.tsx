import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from './label.js';

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: 'Label text',
  },
};

export const WithInput: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="email">Email</Label>
      <input
        type="email"
        id="email"
        placeholder="email@example.com"
        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
      />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-1.5">
      <input
        type="text"
        id="disabled-input"
        disabled
        className="peer order-2 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm disabled:opacity-50"
      />
      <Label htmlFor="disabled-input" className="order-1">
        Disabled field
      </Label>
    </div>
  ),
};

export const AsChild: Story = {
  render: () => (
    <Label asChild>
      <span>Label as span</span>
    </Label>
  ),
};
