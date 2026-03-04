import type { Meta, StoryObj } from '@storybook/react-vite';

import { Timeline, TimelineItem } from './timeline.js';

const meta: Meta<typeof Timeline> = {
  title: 'Components/Timeline',
  component: Timeline,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Timeline {...args}>
      <TimelineItem title="Account created" />
      <TimelineItem title="Profile updated" />
      <TimelineItem title="Settings configured" />
      <TimelineItem title="Onboarding complete" />
    </Timeline>
  ),
};

export const WithTimestamps: Story = {
  render: (args) => (
    <Timeline {...args}>
      <TimelineItem title="Order placed" timestamp="2024-01-15 09:00" />
      <TimelineItem title="Payment confirmed" timestamp="2024-01-15 09:05" />
      <TimelineItem title="Shipped" timestamp="2024-01-16 14:30" />
    </Timeline>
  ),
};

export const WithContent: Story = {
  render: (args) => (
    <Timeline {...args}>
      <TimelineItem title="Pull request opened" timestamp="2024-01-15">
        <p>Added new authentication flow with OAuth2 support.</p>
      </TimelineItem>
      <TimelineItem title="Code review completed" timestamp="2024-01-16">
        <p>All reviewers approved. 3 comments resolved.</p>
      </TimelineItem>
      <TimelineItem title="Merged to main" timestamp="2024-01-17">
        <p>Successfully merged after CI passed all checks.</p>
      </TimelineItem>
    </Timeline>
  ),
};

export const StatusVariants: Story = {
  render: (args) => (
    <Timeline {...args}>
      <TimelineItem title="Default status" status="default" />
      <TimelineItem title="Error status" status="error" />
      <TimelineItem title="Warning status" status="warning" />
    </Timeline>
  ),
};

export const SingleItem: Story = {
  render: (args) => (
    <Timeline {...args}>
      <TimelineItem title="Only event" timestamp="Just now" />
    </Timeline>
  ),
};

export const ManyItems: Story = {
  render: (args) => (
    <Timeline {...args}>
      <TimelineItem title="Step 1" timestamp="08:00" />
      <TimelineItem title="Step 2" timestamp="08:15" />
      <TimelineItem title="Step 3" timestamp="08:30" />
      <TimelineItem title="Step 4" timestamp="08:45" />
      <TimelineItem title="Step 5" timestamp="09:00" />
      <TimelineItem title="Step 6" timestamp="09:15" />
      <TimelineItem title="Step 7" timestamp="09:30" />
      <TimelineItem title="Step 8" timestamp="09:45" />
    </Timeline>
  ),
};

export const MixedStatuses: Story = {
  render: (args) => (
    <Timeline {...args}>
      <TimelineItem title="Deployment started" status="default" timestamp="10:00 AM">
        <p>Initiated deployment to production cluster.</p>
      </TimelineItem>
      <TimelineItem title="Tests passed" status="default" timestamp="10:02 AM" />
      <TimelineItem title="Build failed" status="error" timestamp="10:05 AM">
        <p>Docker image build failed due to missing dependency.</p>
      </TimelineItem>
      <TimelineItem title="Rollback initiated" status="warning" timestamp="10:06 AM">
        <p>Automatic rollback triggered to previous stable version.</p>
      </TimelineItem>
      <TimelineItem title="Service restored" status="default" timestamp="10:08 AM" />
      <TimelineItem title="Post-mortem scheduled" status="warning" timestamp="10:15 AM">
        <p>Review meeting scheduled for tomorrow at 2 PM.</p>
      </TimelineItem>
    </Timeline>
  ),
};
