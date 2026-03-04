import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConnectionStatus } from './connection-status.js';

const meta: Meta<typeof ConnectionStatus> = {
  title: 'Components/ConnectionStatus',
  component: ConnectionStatus,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['connected', 'connecting', 'disconnected'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ConnectionStatus>;

export const Connected: Story = {
  args: { status: 'connected' },
};

export const Connecting: Story = {
  args: { status: 'connecting' },
};

export const Disconnected: Story = {
  args: { status: 'disconnected' },
};

export const CustomLabel: Story = {
  args: { status: 'connected', children: 'Online' },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ConnectionStatus status="connected" />
      <ConnectionStatus status="connecting" />
      <ConnectionStatus status="disconnected" />
    </div>
  ),
};
