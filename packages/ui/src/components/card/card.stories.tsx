import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../button/button.js';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card.js';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Start by choosing a framework and connecting your repository.
        </p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: (args) => (
    <Card {...args} className="w-[350px]">
      <CardHeader>
        <CardTitle>Team access</CardTitle>
        <CardDescription>Manage roles and permissions for this workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Invite collaborators and assign access levels for each resource.
        </p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button>Save changes</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithForm: Story = {
  render: (args) => (
    <Card {...args} className="w-[350px]">
      <CardHeader>
        <CardTitle>Account details</CardTitle>
        <CardDescription>Update your account information below.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            type="text"
            defaultValue="Taylor Doe"
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            defaultValue="taylor@example.com"
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
          />
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button>Update account</Button>
      </CardFooter>
    </Card>
  ),
};
