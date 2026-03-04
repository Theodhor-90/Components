import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Timeline, TimelineItem } from './timeline.js';

describe('Timeline', () => {
  it('renders without crashing (smoke)', () => {
    render(
      <Timeline>
        <TimelineItem title="Event 1" />
      </Timeline>,
    );
    expect(screen.getByText('Event 1')).toBeInTheDocument();
  });

  it('renders multiple items in order', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="Event 1" />
        <TimelineItem title="Event 2" />
        <TimelineItem title="Event 3" />
      </Timeline>,
    );
    const items = container.querySelectorAll('[data-slot="timeline-item"]');
    expect(items).toHaveLength(3);
    expect(items[0].textContent).toContain('Event 1');
    expect(items[1].textContent).toContain('Event 2');
    expect(items[2].textContent).toContain('Event 3');
  });

  it('renders title for each item', () => {
    render(
      <Timeline>
        <TimelineItem title="First Event" />
        <TimelineItem title="Second Event" />
      </Timeline>,
    );
    expect(screen.getByText('First Event')).toBeInTheDocument();
    expect(screen.getByText('Second Event')).toBeInTheDocument();
  });

  it('renders timestamp when provided', () => {
    render(
      <Timeline>
        <TimelineItem title="Event" timestamp="2024-01-15" />
      </Timeline>,
    );
    expect(screen.getByText('2024-01-15')).toBeInTheDocument();
  });

  it('does not render timestamp when not provided', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="With Timestamp" timestamp="2024-01-15" />
        <TimelineItem title="Without Timestamp" />
      </Timeline>,
    );
    const timestampElements = container.querySelectorAll('[data-slot="timeline-item"] p.text-xs');
    expect(timestampElements).toHaveLength(1);
  });

  it('renders content body via children', () => {
    render(
      <Timeline>
        <TimelineItem title="Event">
          <p>Details here</p>
        </TimelineItem>
      </Timeline>,
    );
    expect(screen.getByText('Details here')).toBeInTheDocument();
  });

  it('renders default status dot', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="Event" />
      </Timeline>,
    );
    expect(container.querySelector('.bg-primary')).not.toBeNull();
  });

  it('renders error status dot', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="Event" status="error" />
      </Timeline>,
    );
    expect(container.querySelector('.bg-destructive')).not.toBeNull();
  });

  it('renders warning status dot', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="Event" status="warning" />
      </Timeline>,
    );
    expect(container.querySelector('.bg-accent')).not.toBeNull();
  });

  it('renders connecting line between items but not after last', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="Event 1" />
        <TimelineItem title="Event 2" />
        <TimelineItem title="Event 3" />
      </Timeline>,
    );
    const connectors = container.querySelectorAll('.bg-border');
    expect(connectors).toHaveLength(2);
  });

  it('merges custom className on Timeline', () => {
    render(
      <Timeline className="custom-timeline">
        <TimelineItem title="Event" />
      </Timeline>,
    );
    const root = screen.getByText('Event').closest('[data-slot="timeline"]');
    expect(root).toHaveClass('custom-timeline');
    expect(root).toHaveClass('flex-col');
  });

  it('merges custom className on TimelineItem', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="Event" className="custom-item" />
      </Timeline>,
    );
    const item = container.querySelector('[data-slot="timeline-item"]');
    expect(item).toHaveClass('custom-item');
  });

  it('has data-slot attributes', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="Event 1" />
        <TimelineItem title="Event 2" />
      </Timeline>,
    );
    expect(container.querySelector('[data-slot="timeline"]')).toBeInTheDocument();
    const items = container.querySelectorAll('[data-slot="timeline-item"]');
    expect(items).toHaveLength(2);
  });

  it('forwards ref to Timeline root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Timeline ref={ref}>
        <TimelineItem title="Event" />
      </Timeline>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('forwards ref to TimelineItem element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Timeline>
        <TimelineItem title="Event" ref={ref} />
      </Timeline>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="Deployed" status="default" timestamp="10:00 AM" />
        <TimelineItem title="Build failed" status="error" timestamp="10:05 AM" />
        <TimelineItem title="Rollback" status="warning" timestamp="10:10 AM" />
      </Timeline>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
