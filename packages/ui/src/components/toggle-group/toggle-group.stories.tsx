import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { ToggleGroup, ToggleGroupItem } from './toggle-group.js';

function BoldIcon(): React.JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M3 2.5h4.5a2.5 2.5 0 010 5H3v-5Zm0 5h5a2.75 2.75 0 010 5.5H3V7.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ItalicIcon(): React.JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M6 2.5a.5.5 0 000 1h1.69L5.06 11.5H3.5a.5.5 0 000 1h5a.5.5 0 000-1H6.81l2.63-8H11a.5.5 0 000-1H6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function UnderlineIcon(): React.JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M4 2.5a.5.5 0 00-1 0V6a4.5 4.5 0 009 0V2.5a.5.5 0 00-1 0V6a3.5 3.5 0 11-7 0V2.5ZM2.5 12a.5.5 0 000 1h10a.5.5 0 000-1h-10Z"
        fill="currentColor"
      />
    </svg>
  );
}

const meta: Meta<typeof ToggleGroup> = {
  title: 'Components/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
    },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof ToggleGroup>;

export const SingleSelection: Story = {
  render: () => (
    <ToggleGroup type="single" aria-label="Text formatting">
      <ToggleGroupItem value="bold" aria-label="Bold">
        <BoldIcon />
        Bold
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <ItalicIcon />
        Italic
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <UnderlineIcon />
        Underline
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const MultipleSelection: Story = {
  render: () => (
    <ToggleGroup type="multiple" aria-label="Text formatting">
      <ToggleGroupItem value="bold" aria-label="Bold">
        <BoldIcon />
        Bold
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <ItalicIcon />
        Italic
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <UnderlineIcon />
        Underline
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const OutlineVariant: Story = {
  render: () => (
    <ToggleGroup type="single" variant="outline" aria-label="Text formatting">
      <ToggleGroupItem value="bold" aria-label="Bold">
        <BoldIcon />
        Bold
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <ItalicIcon />
        Italic
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <UnderlineIcon />
        Underline
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const SmallSize: Story = {
  render: () => (
    <ToggleGroup type="single" size="sm" aria-label="Text formatting">
      <ToggleGroupItem value="bold" aria-label="Bold">
        <BoldIcon />
        Bold
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <ItalicIcon />
        Italic
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <UnderlineIcon />
        Underline
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const LargeSize: Story = {
  render: () => (
    <ToggleGroup type="single" size="lg" aria-label="Text formatting">
      <ToggleGroupItem value="bold" aria-label="Bold">
        <BoldIcon />
        Bold
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <ItalicIcon />
        Italic
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <UnderlineIcon />
        Underline
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <ToggleGroup type="single" disabled aria-label="Text formatting">
      <ToggleGroupItem value="bold" aria-label="Bold">
        <BoldIcon />
        Bold
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <ItalicIcon />
        Italic
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <UnderlineIcon />
        Underline
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <ToggleGroup type="multiple" aria-label="Text formatting">
      <ToggleGroupItem value="bold" aria-label="Bold">
        <BoldIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <ItalicIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <UnderlineIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const DefaultValue: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="bold" aria-label="Text formatting">
      <ToggleGroupItem value="bold" aria-label="Bold">
        <BoldIcon />
        Bold
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <ItalicIcon />
        Italic
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <UnderlineIcon />
        Underline
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

function ControlledDemo(): React.JSX.Element {
  const [value, setValue] = useState('bold');

  return (
    <ToggleGroup type="single" value={value} onValueChange={setValue} aria-label="Text formatting">
      <ToggleGroupItem value="bold" aria-label="Bold">
        <BoldIcon />
        Bold
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <ItalicIcon />
        Italic
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <UnderlineIcon />
        Underline
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
