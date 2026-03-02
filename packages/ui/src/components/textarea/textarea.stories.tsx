import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from '../label/label.js';
import { Textarea } from './textarea.js';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    autoResize: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: { 'aria-label': 'Default textarea' },
};

export const WithPlaceholder: Story = {
  args: { placeholder: 'Type your message here...', 'aria-label': 'Message' },
};

export const WithValue: Story = {
  args: {
    defaultValue: 'First line of text.\nSecond line of text.',
    'aria-label': 'Textarea with value',
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Cannot edit', 'aria-label': 'Disabled textarea' },
};

export const WithError: Story = {
  args: {
    'aria-invalid': true,
    defaultValue: 'Invalid value',
    'aria-label': 'Error textarea',
  },
};

export const AutoResize: Story = {
  args: {
    autoResize: true,
    placeholder: 'This will grow with content...',
    'aria-label': 'Auto resize textarea',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="bio">Bio</Label>
      <Textarea id="bio" placeholder="Tell us about yourself..." />
    </div>
  ),
};
