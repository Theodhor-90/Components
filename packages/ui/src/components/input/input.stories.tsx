import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from '../label/label.js';
import { Input } from './input.js';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'file', 'search', 'tel', 'url'],
    },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { 'aria-label': 'Default input' },
};

export const WithPlaceholder: Story = {
  args: { placeholder: 'Enter your name...', 'aria-label': 'Name' },
};

export const WithValue: Story = {
  args: { defaultValue: 'John Doe', 'aria-label': 'Name' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Cannot edit', 'aria-label': 'Disabled input' },
};

export const WithError: Story = {
  args: { 'aria-invalid': true, defaultValue: 'Invalid value', 'aria-label': 'Error input' },
};

export const Password: Story = {
  args: { type: 'password', placeholder: 'Enter password...', 'aria-label': 'Password' },
};

export const Email: Story = {
  args: { type: 'email', placeholder: 'you@example.com', 'aria-label': 'Email' },
};

export const NumberInput: Story = {
  args: { type: 'number', placeholder: '0', 'aria-label': 'Number' },
};

export const File: Story = {
  args: { type: 'file', 'aria-label': 'File upload' },
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email-input">Email</Label>
      <Input type="email" id="email-input" placeholder="you@example.com" />
    </div>
  ),
};
