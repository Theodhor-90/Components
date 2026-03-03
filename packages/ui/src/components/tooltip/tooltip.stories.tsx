import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../button/button.js';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip.js';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Default tooltip content.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const CustomDelay: Story = {
  render: () => (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover with delay</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This tooltip appears after 500ms.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const Positions: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex items-center justify-center gap-4 p-20">
        {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger asChild>
              <Button variant="outline">{side}</Button>
            </TooltipTrigger>
            <TooltipContent side={side}>
              <p>Tooltip on {side}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  ),
};

export const RichContent: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover for details</Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-medium">Build Status</p>
            <p className="text-xs text-muted-foreground">Last build passed 2 minutes ago.</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const OnFocus: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Focus me</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Tooltip also opens when focused via keyboard.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
