import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../button/button.js';
import { toast, Toaster } from './sonner.js';

const meta: Meta<typeof Toaster> = {
  title: 'Components/Sonner',
  component: Toaster,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Toaster />
      <Button onClick={() => toast('Event has been created')}>Show Toast</Button>
    </div>
  ),
};

export const Success: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Toaster />
      <Button onClick={() => toast.success('Profile updated successfully')}>Show Success</Button>
    </div>
  ),
};

export const Error: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Toaster />
      <Button onClick={() => toast.error('Something went wrong')}>Show Error</Button>
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Toaster />
      <Button
        onClick={() => toast('Event created', { description: 'Monday, January 3rd at 6:00pm' })}
      >
        Show Description
      </Button>
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Toaster />
      <Button
        onClick={() =>
          toast('File deleted', {
            action: {
              label: 'Undo',
              onClick: () => {},
            },
          })
        }
      >
        Show Action
      </Button>
    </div>
  ),
};

export const Promise: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Toaster />
      <Button
        onClick={() =>
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: 'Loading...',
            success: 'Done!',
            error: 'Failed',
          })
        }
      >
        Show Promise
      </Button>
    </div>
  ),
};
