import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs.js';

function TestTabs({
  defaultValue,
  value,
  onValueChange,
  classNames,
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  classNames?: {
    list?: string;
    trigger?: string;
    content?: string;
  };
}): React.JSX.Element {
  return (
    <Tabs defaultValue={defaultValue ?? 'tab1'} value={value} onValueChange={onValueChange}>
      <TabsList className={classNames?.list}>
        <TabsTrigger value="tab1" className={classNames?.trigger}>
          Tab 1
        </TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3" disabled>
          Tab 3
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" className={classNames?.content}>
        Content 1
      </TabsContent>
      <TabsContent value="tab2">Content 2</TabsContent>
      <TabsContent value="tab3">Content 3</TabsContent>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('renders with default tab selected', () => {
    render(<TestTabs />);

    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('data-state', 'active');
  });

  it('switches tabs via click', async () => {
    const user = userEvent.setup();
    render(<TestTabs />);

    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));

    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
  });

  it('keyboard arrow right moves focus to next trigger', async () => {
    const user = userEvent.setup();
    render(<TestTabs />);

    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    await user.click(tab1);
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveFocus();
  });

  it('keyboard arrow left wraps from first to last', async () => {
    const user = userEvent.setup();
    render(<TestTabs />);

    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    await user.click(tab1);
    await user.keyboard('{ArrowLeft}');

    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveFocus();
  });

  it('Enter activates a focused trigger', async () => {
    const user = userEvent.setup();
    render(<TestTabs activationMode="manual" />);

    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    await user.click(tab1);
    await user.keyboard('{ArrowRight}');
    await user.keyboard('{Enter}');

    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('controlled mode with value/onValueChange', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TestTabs value="tab1" onValueChange={onValueChange} />);

    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));

    expect(onValueChange).toHaveBeenCalledWith('tab2');
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('uncontrolled mode with defaultValue', async () => {
    const user = userEvent.setup();
    render(<TestTabs defaultValue="tab2" />);

    expect(screen.getByText('Content 2')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Tab 1' }));

    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('only active TabsContent is visible', () => {
    render(<TestTabs />);

    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
  });

  it('disabled trigger cannot be activated', async () => {
    const user = userEvent.setup();
    render(<TestTabs />);

    await user.click(screen.getByRole('tab', { name: 'Tab 3' }));

    expect(screen.queryByText('Content 3')).not.toBeInTheDocument();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('data-slot on tabs-list', () => {
    render(<TestTabs />);

    expect(document.querySelector('[data-slot="tabs-list"]')).toBeInTheDocument();
  });

  it('data-slot on tabs-trigger', () => {
    render(<TestTabs />);

    expect(document.querySelector('[data-slot="tabs-trigger"]')).toBeInTheDocument();
  });

  it('data-slot on tabs-content', () => {
    render(<TestTabs />);

    expect(document.querySelector('[data-slot="tabs-content"]')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(
      <TestTabs
        classNames={{
          list: 'custom-list-class',
          trigger: 'custom-trigger-class',
          content: 'custom-content-class',
        }}
      />,
    );

    expect(document.querySelector('[data-slot="tabs-list"]')).toHaveClass('custom-list-class');
    expect(document.querySelector('[data-slot="tabs-trigger"]')).toHaveClass(
      'custom-trigger-class',
    );
    expect(document.querySelector('[data-slot="tabs-content"]')).toHaveClass(
      'custom-content-class',
    );
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<TestTabs />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
