import type { Meta, StoryObj } from '@storybook/react-vite';

import { VisuallyHidden } from './visually-hidden.js';

const meta: Meta<typeof VisuallyHidden> = {
  title: 'Components/VisuallyHidden',
  component: VisuallyHidden,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VisuallyHidden>;

export const Default: Story = {
  render: () => (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        This paragraph is visible. The next text is only announced by screen readers.
      </p>
      <VisuallyHidden>This text is only visible to screen readers</VisuallyHidden>
    </div>
  ),
};

export const WithIconButton: Story = {
  render: () => (
    <button
      type="button"
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background"
    >
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M2.5 4h11" />
        <path d="M6.5 4V3a1.5 1.5 0 0 1 3 0v1" />
        <path d="M4 4l.6 9.2A1 1 0 0 0 5.6 14h4.8a1 1 0 0 0 1-.8L12 4" />
      </svg>
      <VisuallyHidden>Delete item</VisuallyHidden>
    </button>
  ),
};

export const AsChild: Story = {
  render: () => (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        The span below receives visually-hidden behavior via asChild.
      </p>
      <VisuallyHidden asChild>
        <span>Merged onto span</span>
      </VisuallyHidden>
    </div>
  ),
};
