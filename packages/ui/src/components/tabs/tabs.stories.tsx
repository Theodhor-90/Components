import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs.js';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="text-sm text-muted-foreground">
          Make changes to your account here. Click save when you are done.
        </p>
      </TabsContent>
      <TabsContent value="password">
        <p className="text-sm text-muted-foreground">
          Change your password here. After saving, you will be logged out.
        </p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="text-sm text-muted-foreground">
          Adjust your preferences and notification settings.
        </p>
      </TabsContent>
    </Tabs>
  ),
};

export const Controlled: Story = {
  render: function ControlledTabs() {
    const [activeTab, setActiveTab] = useState('account');
    return (
      <div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="account">Account content</TabsContent>
          <TabsContent value="password">Password content</TabsContent>
          <TabsContent value="settings">Settings content</TabsContent>
        </Tabs>
        <p className="mt-4 text-sm text-muted-foreground">
          Active tab: <strong>{activeTab}</strong>
        </p>
      </div>
    );
  },
};

export const ManyTabs: Story = {
  render: () => (
    <Tabs defaultValue="tab-1">
      <TabsList>
        {Array.from({ length: 8 }).map((_, i) => (
          <TabsTrigger key={i} value={`tab-${i + 1}`}>
            Tab {i + 1}
          </TabsTrigger>
        ))}
      </TabsList>
      {Array.from({ length: 8 }).map((_, i) => (
        <TabsContent key={i} value={`tab-${i + 1}`}>
          Content for Tab {i + 1}
        </TabsContent>
      ))}
    </Tabs>
  ),
};

export const WithDisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="first">
      <TabsList>
        <TabsTrigger value="first">First</TabsTrigger>
        <TabsTrigger value="second" disabled>
          Second (Disabled)
        </TabsTrigger>
        <TabsTrigger value="third">Third</TabsTrigger>
      </TabsList>
      <TabsContent value="first">First tab content</TabsContent>
      <TabsContent value="second">Second tab content</TabsContent>
      <TabsContent value="third">Third tab content</TabsContent>
    </Tabs>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Tabs defaultValue="circle">
      <TabsList>
        <TabsTrigger value="circle" className="gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
          </svg>
          Circle
        </TabsTrigger>
        <TabsTrigger value="square" className="gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
          </svg>
          Square
        </TabsTrigger>
        <TabsTrigger value="triangle" className="gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 2 10 18H2z" />
          </svg>
          Triangle
        </TabsTrigger>
      </TabsList>
      <TabsContent value="circle">A circle is a round shape with no corners.</TabsContent>
      <TabsContent value="square">A square has four equal sides and four right angles.</TabsContent>
      <TabsContent value="triangle">A triangle has three sides and three angles.</TabsContent>
    </Tabs>
  ),
};
