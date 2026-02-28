import type { Meta, StoryObj } from '@storybook/react-vite';

import { Skeleton } from './skeleton.js';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  render: (args) => <Skeleton {...args} className="h-4 w-full" />,
};

export const TextLine: Story = {
  render: (args) => <Skeleton {...args} className="h-4 w-[250px]" />,
};

export const Circle: Story = {
  render: (args) => <Skeleton {...args} className="h-12 w-12 rounded-full" />,
};

export const CardSkeleton: Story = {
  render: (args) => (
    <div className="flex flex-col space-y-3">
      <Skeleton {...args} className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ),
};
