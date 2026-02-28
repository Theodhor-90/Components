import type { Meta, StoryObj } from '@storybook/react-vite';

import { Separator } from './separator.js';

const meta: Meta<typeof Separator> = {
  title: 'Components/Separator',
  component: Separator,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    decorative: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  args: {},
  render: (args) => (
    <div className="w-full max-w-sm">
      <p className="text-sm">Content above</p>
      <Separator {...args} className="my-4" />
      <p className="text-sm">Content below</p>
    </div>
  ),
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <div className="flex h-20 items-stretch gap-4">
      <p className="text-sm">Left</p>
      <Separator {...args} />
      <p className="text-sm">Right</p>
    </div>
  ),
};

export const InCard: Story = {
  render: () => (
    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <h3 className="text-lg font-semibold">Section Title</h3>
      <p className="text-sm text-muted-foreground">Section description goes here.</p>
      <Separator className="my-4" />
      <p className="text-sm">Additional content below the separator.</p>
    </div>
  ),
};
