import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Stepper, StepperItem } from './stepper.js';

describe('Stepper', () => {
  it('renders with default horizontal orientation', () => {
    render(
      <Stepper>
        <StepperItem status="completed" title="Step 1" />
        <StepperItem status="active" title="Step 2" />
        <StepperItem status="pending" title="Step 3" />
      </Stepper>,
    );
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
    const root = screen.getByText('Step 1').closest('[data-slot="stepper"]');
    expect(root).toHaveClass('flex-row');
  });

  it('renders with vertical orientation', () => {
    render(
      <Stepper orientation="vertical">
        <StepperItem status="completed" title="Step 1" />
        <StepperItem status="pending" title="Step 2" />
      </Stepper>,
    );
    const root = screen.getByText('Step 1').closest('[data-slot="stepper"]');
    expect(root).toHaveClass('flex-col');
  });

  it('renders pending status icon', () => {
    const { container } = render(
      <Stepper>
        <StepperItem status="pending" title="Pending" />
      </Stepper>,
    );
    const item = container.querySelector('[data-slot="stepper-item"]')!;
    const svg = item.querySelector('svg')!;
    const circle = svg.querySelector('circle');
    expect(circle).not.toBeNull();
    expect(circle).toHaveAttribute('stroke');
  });

  it('renders active status icon', () => {
    const { container } = render(
      <Stepper>
        <StepperItem status="active" title="Active" />
      </Stepper>,
    );
    const item = container.querySelector('[data-slot="stepper-item"]')!;
    const svg = item.querySelector('svg')!;
    const circle = svg.querySelector('circle');
    expect(circle).not.toBeNull();
    expect(circle).toHaveAttribute('fill', 'currentColor');
  });

  it('renders completed status icon', () => {
    const { container } = render(
      <Stepper>
        <StepperItem status="completed" title="Completed" />
      </Stepper>,
    );
    const item = container.querySelector('[data-slot="stepper-item"]')!;
    const svg = item.querySelector('svg')!;
    const polyline = svg.querySelector('polyline');
    expect(polyline).not.toBeNull();
  });

  it('renders error status icon', () => {
    const { container } = render(
      <Stepper>
        <StepperItem status="error" title="Error" />
      </Stepper>,
    );
    const item = container.querySelector('[data-slot="stepper-item"]')!;
    const svg = item.querySelector('svg')!;
    const lines = svg.querySelectorAll('line');
    expect(lines).toHaveLength(2);
  });

  it('renders connecting lines between items but not after the last', () => {
    const { container } = render(
      <Stepper>
        <StepperItem status="completed" title="Step 1" />
        <StepperItem status="active" title="Step 2" />
        <StepperItem status="pending" title="Step 3" />
      </Stepper>,
    );
    const items = container.querySelectorAll('[data-slot="stepper-item"]');
    expect(items).toHaveLength(3);
    // Each non-last item has a connector div with h-0.5 (horizontal)
    const connectors = container.querySelectorAll('.h-0\\.5');
    expect(connectors).toHaveLength(2);
  });

  it('completed step connector has distinct style from pending', () => {
    const { container } = render(
      <Stepper>
        <StepperItem status="completed" title="Done" />
        <StepperItem status="pending" title="Todo" />
      </Stepper>,
    );
    const connectors = container.querySelectorAll('.h-0\\.5');
    expect(connectors).toHaveLength(1);
    expect(connectors[0]).toHaveClass('bg-primary');
  });

  it('renders title and description', () => {
    render(
      <Stepper>
        <StepperItem status="active" title="Account" description="Create your account" />
      </Stepper>,
    );
    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByText('Create your account')).toBeInTheDocument();
  });

  it('merges custom className on Stepper', () => {
    render(
      <Stepper className="custom-stepper">
        <StepperItem status="active" title="Step" />
      </Stepper>,
    );
    const root = screen.getByText('Step').closest('[data-slot="stepper"]');
    expect(root).toHaveClass('custom-stepper');
    expect(root).toHaveClass('flex');
  });

  it('merges custom className on StepperItem', () => {
    const { container } = render(
      <Stepper>
        <StepperItem status="active" title="Step" className="custom-item" />
      </Stepper>,
    );
    const item = container.querySelector('[data-slot="stepper-item"]');
    expect(item).toHaveClass('custom-item');
  });

  it('has data-slot attributes', () => {
    const { container } = render(
      <Stepper>
        <StepperItem status="active" title="Step 1" />
        <StepperItem status="pending" title="Step 2" />
      </Stepper>,
    );
    expect(container.querySelector('[data-slot="stepper"]')).toBeInTheDocument();
    const items = container.querySelectorAll('[data-slot="stepper-item"]');
    expect(items).toHaveLength(2);
  });

  it('forwards ref to Stepper root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Stepper ref={ref}>
        <StepperItem status="active" title="Step" />
      </Stepper>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('sets aria-current="step" on active item only', () => {
    const { container } = render(
      <Stepper>
        <StepperItem status="completed" title="Step 1" />
        <StepperItem status="active" title="Step 2" />
        <StepperItem status="pending" title="Step 3" />
      </Stepper>,
    );
    const items = container.querySelectorAll('[data-slot="stepper-item"]');
    expect(items[0]).not.toHaveAttribute('aria-current');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[2]).not.toHaveAttribute('aria-current');
  });

  it('has no accessibility violations (horizontal)', async () => {
    const { container } = render(
      <Stepper>
        <StepperItem status="completed" title="Step 1" />
        <StepperItem status="active" title="Step 2" />
        <StepperItem status="pending" title="Step 3" />
      </Stepper>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations (vertical)', async () => {
    const { container } = render(
      <Stepper orientation="vertical">
        <StepperItem status="completed" title="Step 1" />
        <StepperItem status="active" title="Step 2" />
        <StepperItem status="pending" title="Step 3" />
      </Stepper>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
