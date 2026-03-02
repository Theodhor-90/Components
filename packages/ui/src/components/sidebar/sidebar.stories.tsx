import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../button/button.js';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../collapsible/collapsible.js';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from './sidebar.js';

const meta: Meta<typeof SidebarProvider> = {
  title: 'Components/Sidebar',
  component: SidebarProvider,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>Projects</SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>Tasks</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>Profile</SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>Preferences</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <main className="flex-1 p-4">
        <SidebarTrigger />
        <p className="mt-4">Main content area</p>
      </main>
    </SidebarProvider>
  ),
};

export const Collapsed: Story = {
  render: () => (
    <SidebarProvider defaultOpen={false}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>Projects</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <main className="flex-1 p-4">
        <SidebarTrigger />
        <p className="mt-4">Sidebar starts collapsed. Click the trigger to expand.</p>
      </main>
    </SidebarProvider>
  ),
};

export const WithNestedMenus: Story = {
  render: () => (
    <SidebarProvider>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>Home</SidebarMenuButton>
            </SidebarMenuItem>
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>Projects</SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton size="sm">Project Alpha</SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton size="sm">Project Beta</SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
            <Collapsible className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>Settings</SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton size="sm">General</SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton size="sm">Security</SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <main className="flex-1 p-4">
        <SidebarTrigger />
        <p className="mt-4">Sidebar with collapsible nested menus</p>
      </main>
    </SidebarProvider>
  ),
};

function ControlledDemo() {
  const [open, setOpen] = useState(true);

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={() => setOpen((v) => !v)}>
        External Toggle ({open ? 'Open' : 'Closed'})
      </Button>
      <SidebarProvider open={open} onOpenChange={setOpen}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Controlled</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>Analytics</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <main className="flex-1 p-4">
          <SidebarTrigger />
          <p className="mt-4">Controlled sidebar — state owned by parent component</p>
        </main>
      </SidebarProvider>
    </div>
  );
}

export const ControlledState: Story = {
  render: () => <ControlledDemo />,
};
