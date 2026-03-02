import type { Meta, StoryObj } from '@storybook/react-vite';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './resizable.js';

const meta: Meta<typeof ResizablePanelGroup> = {
  title: 'Components/Resizable',
  component: ResizablePanelGroup,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[200px] max-w-md rounded-lg border"
    >
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center bg-muted p-6">
          <span className="font-semibold">Panel One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Panel Two</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const Vertical: Story = {
  render: () => (
    <ResizablePanelGroup direction="vertical" className="min-h-[200px] max-w-md rounded-lg border">
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center bg-muted p-6">
          <span className="font-semibold">Top Panel</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Bottom Panel</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const WithHandle: Story = {
  render: () => (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[200px] max-w-md rounded-lg border"
    >
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center bg-muted p-6">
          <span className="font-semibold">Panel One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Panel Two</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const ThreePanels: Story = {
  render: () => (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[200px] max-w-lg rounded-lg border"
    >
      <ResizablePanel defaultSize={33}>
        <div className="flex h-full items-center justify-center bg-muted p-6">
          <span className="font-semibold">Left</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={34}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Center</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={33}>
        <div className="flex h-full items-center justify-center bg-muted p-6">
          <span className="font-semibold">Right</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const NestedGroups: Story = {
  render: () => (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[300px] max-w-lg rounded-lg border"
    >
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center bg-muted p-6">
          <span className="font-semibold">Left Panel</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Top Right</span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center bg-muted p-6">
              <span className="font-semibold">Bottom Right</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};
