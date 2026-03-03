import type { Meta, StoryObj } from '@storybook/react-vite';

import { Avatar, AvatarFallback, AvatarImage } from '../avatar/avatar.js';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card.js';

const meta: Meta<typeof HoverCard> = {
  title: 'Components/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <a href="https://github.com/shadcn-ui" className="text-sm font-medium underline">
          @shadcn
        </a>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">@shadcn</h4>
          <p className="text-sm">Building open source UI components and patterns.</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const WithAvatar: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <a href="https://github.com/shadcn-ui" className="text-sm font-medium underline">
          Hover profile
        </a>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="Shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">Shadcn</h4>
            <p className="text-sm text-muted-foreground">@shadcn</p>
            <p className="text-sm text-muted-foreground">
              Maintainer of UI patterns for modern React apps.
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const LinkTrigger: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <a href="https://ui.shadcn.com" className="text-sm underline">
          ui.shadcn.com
        </a>
      </HoverCardTrigger>
      <HoverCardContent>
        <p className="text-sm">Hover cards support custom link triggers via asChild.</p>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const CustomAlign: Story = {
  render: () => (
    <div className="flex justify-center p-16">
      <HoverCard>
        <HoverCardTrigger asChild>
          <a href="https://github.com/shadcn-ui" className="text-sm font-medium underline">
            Align start
          </a>
        </HoverCardTrigger>
        <HoverCardContent align="start">
          <p className="text-sm">This hover card uses align=&quot;start&quot;.</p>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};
