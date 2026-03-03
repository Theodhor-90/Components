import type { Meta, StoryObj } from '@storybook/react-vite';

import { Avatar, AvatarFallback, AvatarImage } from '../avatar/avatar.js';
import { AvatarGroup } from './avatar-group.js';

const meta: Meta<typeof AvatarGroup> = {
  title: 'Components/AvatarGroup',
  component: AvatarGroup,
  tags: ['autodocs'],
  argTypes: {
    max: {
      control: 'number',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <AvatarGroup {...args}>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/40?img=1" alt="A1" />
        <AvatarFallback>A1</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/40?img=2" alt="A2" />
        <AvatarFallback>A2</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>A3</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  ),
};

export const MaxOverflow: Story = {
  render: (args) => (
    <AvatarGroup max={3} {...args}>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/40?img=3" alt="A1" />
        <AvatarFallback>A1</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/40?img=4" alt="A2" />
        <AvatarFallback>A2</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/40?img=5" alt="A3" />
        <AvatarFallback>A3</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>A4</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>A5</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>A6</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  ),
};

export const AllVisible: Story = {
  render: (args) => (
    <AvatarGroup {...args}>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/40?img=6" alt="A1" />
        <AvatarFallback>A1</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>A2</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/40?img=7" alt="A3" />
        <AvatarFallback>A3</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>A4</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  ),
};

export const SingleAvatar: Story = {
  render: (args) => (
    <AvatarGroup {...args}>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/40?img=8" alt="A1" />
        <AvatarFallback>A1</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  ),
};

export const ManyAvatars: Story = {
  render: (args) => (
    <AvatarGroup max={5} {...args}>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/40?img=9" alt="A1" />
        <AvatarFallback>A1</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/40?img=10" alt="A2" />
        <AvatarFallback>A2</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>A3</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/40?img=11" alt="A4" />
        <AvatarFallback>A4</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>A5</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>A6</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>A7</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>A8</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>A9</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>A10</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  ),
};
