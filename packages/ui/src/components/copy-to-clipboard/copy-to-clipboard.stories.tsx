import type { Meta, StoryObj } from '@storybook/react-vite';

import { CopyToClipboard } from './copy-to-clipboard.js';

const meta: Meta<typeof CopyToClipboard> = {
  title: 'Components/CopyToClipboard',
  component: CopyToClipboard,
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof CopyToClipboard>;

export const Default: Story = {
  args: { text: 'Hello, World!' },
};

export const AsChild: Story = {
  args: { text: 'https://example.com', asChild: true },
  render: (args) => (
    <CopyToClipboard {...args}>
      <a href="https://example.com">Copy link</a>
    </CopyToClipboard>
  ),
};

export const WithLongText: Story = {
  args: {
    text: `function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
  },
};
