import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../button/button.js';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './command.js';

const meta: Meta<typeof Command> = {
  title: 'Components/Command',
  component: Command,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const commandContainerStyles = 'rounded-lg border shadow-md md:min-w-[450px]';

export const Default: Story = {
  render: () => (
    <Command className={commandContainerStyles}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search</CommandItem>
          <CommandItem>Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Command className={commandContainerStyles}>
      <CommandInput placeholder="Find a command..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search</CommandItem>
          <CommandItem>Launch</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>Profile</CommandItem>
          <CommandItem>Billing</CommandItem>
          <CommandItem>Notifications</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const WithShortcuts: Story = {
  render: () => (
    <Command className={commandContainerStyles}>
      <CommandInput placeholder="Find a command..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem>
            Open Search
            <CommandShortcut>⌘K</CommandShortcut>
          </CommandItem>
          <CommandItem>
            Save Draft
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
          <CommandItem>
            Open Command Palette
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const Empty: Story = {
  render: () => (
    <Command className={commandContainerStyles}>
      <CommandInput value="no-match" onValueChange={() => {}} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

function InDialogDemo(): React.JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open Command Dialog
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search</CommandItem>
            <CommandItem>Settings</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

export const InDialog: Story = {
  render: () => <InDialogDemo />,
};

export const WithIcons: Story = {
  render: () => (
    <Command className={commandContainerStyles}>
      <CommandInput placeholder="Find a command..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem>
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path
                d="M7.5 1L1.5 6H3V14H6.5V9.5H8.5V14H12V6H13.5L7.5 1Z"
                fill="currentColor"
              />
            </svg>
            Home
            <CommandShortcut>⌘H</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path
                d="M7.5 2C4.46243 2 2 4.46243 2 7.5C2 10.5376 4.46243 13 7.5 13C10.5376 13 13 10.5376 13 7.5C13 4.46243 10.5376 2 7.5 2ZM7 5H8V8H7V5ZM7 9H8V10H7V9Z"
                fill="currentColor"
              />
            </svg>
            Alerts
            <CommandShortcut>⌘A</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path
                d="M4 3.5C4 2.67157 4.67157 2 5.5 2H11.5C12.3284 2 13 2.67157 13 3.5V9.5C13 10.3284 12.3284 11 11.5 11H5.5C4.67157 11 4 10.3284 4 9.5V3.5ZM2 5.5C2 5.22386 2.22386 5 2.5 5H3V10H2.5C2.22386 10 2 9.77614 2 9.5V5.5Z"
                fill="currentColor"
              />
            </svg>
            Devices
            <CommandShortcut>⌘D</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};
