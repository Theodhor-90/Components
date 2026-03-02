import type { Meta, StoryObj } from '@storybook/react-vite';

import { ScrollArea, ScrollBar } from './scroll-area.js';

const meta: Meta<typeof ScrollArea> = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const tags = Array.from({ length: 50 }, (_, i) => `v1.${i}.0`);

export const Vertical: Story = {
  render: () => (
    <div className="h-72 w-48">
      <ScrollArea className="h-full w-full rounded-md border">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
          {tags.map((tag) => (
            <div key={tag} className="text-sm">
              {tag}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <div className="w-96">
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex w-max space-x-4 p-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="flex h-20 w-32 shrink-0 items-center justify-center rounded-md border"
            >
              Item {i + 1}
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  ),
};

export const BothDirections: Story = {
  render: () => (
    <div className="h-72 w-72">
      <ScrollArea className="h-full w-full rounded-md border">
        <div className="w-[600px] p-4">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="whitespace-nowrap text-sm">
              Row {i + 1} — This is a long line of text that extends beyond the container width to
              demonstrate horizontal scrolling
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  ),
};

export const WithTags: Story = {
  render: () => (
    <div className="w-80">
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex w-max space-x-2 p-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
            >
              {tag}
            </span>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  ),
};

export const CustomHeight: Story = {
  render: () => (
    <ScrollArea className="h-[200px] w-48 rounded-md border">
      <div className="p-4">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="text-sm">
            Entry {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
