import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from './context-menu.js';

const meta: Meta<typeof ContextMenu> = {
  title: 'Components/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const triggerAreaStyles =
  'flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm';

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className={triggerAreaStyles}>Right-click here</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Edit</ContextMenuItem>
        <ContextMenuItem>Copy</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Archive</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

function WithCheckboxItemsDemo(): React.JSX.Element {
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [showActivityBar, setShowActivityBar] = useState(false);
  const [showPanel, setShowPanel] = useState(true);

  return (
    <ContextMenu>
      <ContextMenuTrigger className={triggerAreaStyles}>Right-click here</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Appearance</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem
          checked={showStatusBar}
          onCheckedChange={(checked) => setShowStatusBar(checked === true)}
        >
          Status Bar
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem
          checked={showActivityBar}
          onCheckedChange={(checked) => setShowActivityBar(checked === true)}
        >
          Activity Bar
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem
          checked={showPanel}
          onCheckedChange={(checked) => setShowPanel(checked === true)}
        >
          Panel
        </ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export const WithCheckboxItems: Story = {
  render: () => <WithCheckboxItemsDemo />,
};

function WithRadioGroupDemo(): React.JSX.Element {
  const [position, setPosition] = useState('bottom');

  return (
    <ContextMenu>
      <ContextMenuTrigger className={triggerAreaStyles}>Right-click here</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Position</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup value={position} onValueChange={setPosition}>
          <ContextMenuRadioItem value="top">Top</ContextMenuRadioItem>
          <ContextMenuRadioItem value="bottom">Bottom</ContextMenuRadioItem>
          <ContextMenuRadioItem value="right">Right</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export const WithRadioGroup: Story = {
  render: () => <WithRadioGroupDemo />,
};

export const WithSubMenu: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className={triggerAreaStyles}>Right-click here</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>New Tab</ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Share</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Email</ContextMenuItem>
            <ContextMenuItem>Messages</ContextMenuItem>
            <ContextMenuItem>Copy Link</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const WithShortcuts: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className={triggerAreaStyles}>Right-click here</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          Cut
          <ContextMenuShortcut>⌘X</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Copy
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Paste
          <ContextMenuShortcut>⌘V</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const WithInsetItems: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className={triggerAreaStyles}>Right-click here</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel inset>My Account</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem inset>Profile</ContextMenuItem>
        <ContextMenuItem inset>Billing</ContextMenuItem>
        <ContextMenuItem inset>Settings</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};
