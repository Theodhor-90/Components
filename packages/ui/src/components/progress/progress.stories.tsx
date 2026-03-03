import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../button/button.js';
import { Progress } from './progress.js';

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 60,
  },
};

export const Empty: Story = {
  args: {
    value: 0,
  },
};

export const Complete: Story = {
  args: {
    value: 100,
  },
};

function AnimatedDemo(): React.JSX.Element {
  const [value, setValue] = useState(0);

  return (
    <div className="space-y-4">
      <Progress value={value} />
      <Button variant="outline" onClick={() => setValue((prev) => Math.min(prev + 10, 100))}>
        Increment (+10)
      </Button>
    </div>
  );
}

export const Animated: Story = {
  render: () => <AnimatedDemo />,
};

export const CustomColor: Story = {
  render: () => (
    <Progress value={60} className="[&>[data-slot=progress-indicator]]:bg-destructive" />
  ),
};
