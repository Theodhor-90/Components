import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../button/button.js';
import { Header } from './header.js';

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  tags: ['autodocs'],
  argTypes: {
    asChild: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: { children: 'My Application' },
};

export const WithActions: Story = {
  render: () => (
    <Header
      actions={
        <>
          <Button variant="ghost" size="sm">
            Settings
          </Button>
          <Button size="sm">New Item</Button>
        </>
      }
    >
      My Application
    </Header>
  ),
};

export const WithUserInfo: Story = {
  render: () => (
    <Header userInfo={<span className="text-sm text-muted-foreground">John Doe</span>}>
      My Application
    </Header>
  ),
};

export const FullHeader: Story = {
  render: () => (
    <Header
      actions={
        <>
          <Button variant="ghost" size="sm">
            Settings
          </Button>
          <Button size="sm">New Item</Button>
        </>
      }
      userInfo={<span className="text-sm text-muted-foreground">John Doe</span>}
    >
      My Application
    </Header>
  ),
};

export const AsChild: Story = {
  render: () => (
    <Header asChild>
      <div>Custom div acting as header</div>
    </Header>
  ),
};
