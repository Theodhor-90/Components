import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../button/button.js';
import { Spinner } from './spinner.js';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Large: Story = {
  args: { size: 'lg' },
};

export const CustomColor: Story = {
  args: { className: 'text-primary' },
};

export const InButton: Story = {
  render: () => (
    <Button disabled>
      <Spinner size="sm" className="text-primary-foreground" />
      Saving...
    </Button>
  ),
};
