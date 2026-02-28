import type { Meta, StoryObj } from '@storybook/react-vite';

import { Alert, AlertDescription, AlertTitle } from './alert.js';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>You can add components to your app using this alert.</AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: (args) => (
    <Alert {...args} variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Your session has expired. Please sign in again.</AlertDescription>
    </Alert>
  ),
};

export const WithIcon: Story = {
  render: (args) => (
    <Alert {...args}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
        <circle cx="12" cy="12" r="10" />
      </svg>
      <div>
        <AlertTitle>System notice</AlertTitle>
        <AlertDescription>Maintenance starts at 2:00 AM UTC.</AlertDescription>
      </div>
    </Alert>
  ),
};

export const WithTitle: Story = {
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>New update available</AlertTitle>
    </Alert>
  ),
};

export const WithTitleAndDescription: Story = {
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Deployment complete</AlertTitle>
      <AlertDescription>Your latest changes are now live in production.</AlertDescription>
    </Alert>
  ),
};
