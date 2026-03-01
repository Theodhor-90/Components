import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../button/button.js';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible.js';

const meta: Meta<typeof Collapsible> = {
  title: 'Components/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Collapsible className="w-full max-w-md space-y-2">
      <CollapsibleTrigger asChild>
        <Button variant="outline">Toggle</Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="rounded-md border px-4 py-3 text-sm">
        This content can be collapsed.
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const DefaultOpen: Story = {
  render: () => (
    <Collapsible defaultOpen className="w-full max-w-md space-y-2">
      <CollapsibleTrigger asChild>
        <Button variant="outline">Toggle</Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="rounded-md border px-4 py-3 text-sm">
        This content starts expanded.
      </CollapsibleContent>
    </Collapsible>
  ),
};

function ControlledDemo(): React.JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full max-w-md space-y-2">
      <Button variant="secondary" onClick={() => setOpen((value) => !value)}>
        Toggle externally
      </Button>
      <Collapsible open={open} onOpenChange={setOpen} className="space-y-2">
        <CollapsibleTrigger asChild>
          <Button variant="outline">{open ? 'Collapse' : 'Expand'}</Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="rounded-md border px-4 py-3 text-sm">
          This collapsible is controlled with React state.
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};

export const WithMultipleItems: Story = {
  render: () => (
    <Collapsible className="w-full max-w-md space-y-2">
      <CollapsibleTrigger asChild>
        <Button variant="outline">Show more</Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="rounded-md border px-4 py-3">
        <ul className="list-disc space-y-1 pl-4 text-sm">
          <li>Additional item one</li>
          <li>Additional item two</li>
          <li>Additional item three</li>
        </ul>
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const Animated: Story = {
  render: () => (
    <Collapsible className="w-full max-w-md space-y-2">
      <CollapsibleTrigger asChild>
        <Button variant="outline">Toggle animated content</Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="rounded-md border px-4 py-3 text-sm">
        Open and close to see the default animated transition.
      </CollapsibleContent>
    </Collapsible>
  ),
};
