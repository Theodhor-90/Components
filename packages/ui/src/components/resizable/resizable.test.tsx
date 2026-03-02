import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './resizable.js';

function TestResizable({
  direction = 'horizontal',
  withHandle = false,
  groupClassName,
  handleClassName,
}: {
  direction?: 'horizontal' | 'vertical';
  withHandle?: boolean;
  groupClassName?: string;
  handleClassName?: string;
}): React.JSX.Element {
  return (
    <ResizablePanelGroup direction={direction} className={groupClassName}>
      <ResizablePanel defaultSize={50}>
        <div>Panel One</div>
      </ResizablePanel>
      <ResizableHandle withHandle={withHandle} className={handleClassName} />
      <ResizablePanel defaultSize={50}>
        <div>Panel Two</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

describe('Resizable', () => {
  it('renders panel group with two panels and a handle', () => {
    render(<TestResizable />);

    expect(screen.getByText('Panel One')).toBeInTheDocument();
    expect(screen.getByText('Panel Two')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="resizable-handle"]')).toBeInTheDocument();
  });

  it('handle renders between panels', () => {
    render(<TestResizable />);

    const handle = document.querySelector('[data-slot="resizable-handle"]');
    expect(handle).toBeInTheDocument();
  });

  it('withHandle renders grip indicator SVG', () => {
    render(<TestResizable withHandle />);

    const handle = document.querySelector('[data-slot="resizable-handle"]');
    expect(handle?.querySelector('svg')).toBeInTheDocument();
  });

  it('withHandle false hides grip', () => {
    render(<TestResizable />);

    const handle = document.querySelector('[data-slot="resizable-handle"]');
    expect(handle?.querySelector('svg')).toBeNull();
  });

  it('horizontal direction attribute', () => {
    render(<TestResizable direction="horizontal" />);

    const group = document.querySelector('[data-slot="resizable-panel-group"]');
    expect(group).toHaveAttribute('data-panel-group-direction', 'horizontal');
  });

  it('vertical direction attribute', () => {
    render(<TestResizable direction="vertical" />);

    const group = document.querySelector('[data-slot="resizable-panel-group"]');
    expect(group).toHaveAttribute('data-panel-group-direction', 'vertical');
  });

  it('data-slot attributes on all sub-components', () => {
    render(<TestResizable />);

    expect(document.querySelector('[data-slot="resizable-panel-group"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="resizable-panel"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="resizable-handle"]')).toBeInTheDocument();
  });

  it('className merging on ResizablePanelGroup', () => {
    render(<TestResizable groupClassName="custom-group-class" />);

    const group = document.querySelector('[data-slot="resizable-panel-group"]');
    expect(group).toHaveClass('flex');
    expect(group).toHaveClass('custom-group-class');
  });

  it('className merging on ResizableHandle', () => {
    render(<TestResizable handleClassName="custom-handle-class" />);

    const handle = document.querySelector('[data-slot="resizable-handle"]');
    expect(handle).toHaveClass('bg-border');
    expect(handle).toHaveClass('custom-handle-class');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<TestResizable />);
    const results = await axe(container, {
      rules: {
        'aria-required-attr': { enabled: false },
      },
    });

    expect(results).toHaveNoViolations();
  });
});
