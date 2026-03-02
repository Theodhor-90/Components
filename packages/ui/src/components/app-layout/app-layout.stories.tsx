import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../button/button.js';
import { Header } from '../header/header.js';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../sidebar/sidebar.js';
import { AppLayout } from './app-layout.js';

const meta: Meta<typeof AppLayout> = {
  title: 'Components/AppLayout',
  component: AppLayout,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AppLayout>;

const sidebarContent = (
  <SidebarGroup>
    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton>Projects</SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton>Settings</SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
);

export const Default: Story = {
  render: () => (
    <AppLayout sidebar={sidebarContent}>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Welcome to your dashboard.</p>
      </div>
    </AppLayout>
  ),
};

export const CollapsedSidebar: Story = {
  render: () => (
    <AppLayout defaultOpen={false} sidebar={sidebarContent}>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Sidebar is collapsed by default.</p>
      </div>
    </AppLayout>
  ),
};

export const WithHeaderAndSidebar: Story = {
  render: () => (
    <AppLayout sidebar={sidebarContent} header={<Header>My Application</Header>}>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">With header and sidebar.</p>
      </div>
    </AppLayout>
  ),
};

export const FullShell: Story = {
  render: () => (
    <AppLayout
      sidebar={sidebarContent}
      header={
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
      }
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Full application shell with sidebar, header, actions, and user info.
        </p>
      </div>
    </AppLayout>
  ),
};

export const MobileView: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  render: () => (
    <AppLayout sidebar={sidebarContent} header={<Header>My Application</Header>}>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Mobile View</h1>
        <p className="mt-2 text-muted-foreground">
          On mobile, the sidebar renders as a Sheet overlay.
        </p>
      </div>
    </AppLayout>
  ),
};
