import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../button/button.js';
import { EmptyState } from './empty-state.js';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'No items found',
  },
};

export const WithIcon: Story = {
  args: {
    title: 'No messages yet',
  },
  render: (args) => (
    <EmptyState
      {...args}
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 8l9 6 9-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 8v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" strokeWidth="2" />
        </svg>
      }
    />
  ),
};

export const WithDescription: Story = {
  args: {
    title: 'No projects found',
    description: 'Try adjusting your filters or create a new project.',
  },
};

export const WithAction: Story = {
  args: {
    title: 'No items found',
    description: 'Create your first item to get started.',
  },
  render: (args) => <EmptyState {...args} action={<Button>Create item</Button>} />,
};

export const Complete: Story = {
  args: {
    title: 'Your inbox is empty',
    description: 'New conversations will appear here.',
  },
  render: (args) => (
    <EmptyState
      {...args}
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 8l9 6 9-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 8v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" strokeWidth="2" />
        </svg>
      }
      action={<Button>Compose message</Button>}
    />
  ),
};
