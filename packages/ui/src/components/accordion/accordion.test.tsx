import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion.js';

function TestAccordion({
  type = 'single',
  collapsible,
  defaultValue,
  classNames,
}: {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: string | string[];
  classNames?: { item?: string; trigger?: string; content?: string };
}): React.JSX.Element {
  const items = (
    <>
      <AccordionItem value="item-1" className={classNames?.item}>
        <AccordionTrigger className={classNames?.trigger}>Section 1</AccordionTrigger>
        <AccordionContent className={classNames?.content}>Content 1</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Section 2</AccordionTrigger>
        <AccordionContent>Content 2</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Section 3</AccordionTrigger>
        <AccordionContent>Content 3</AccordionContent>
      </AccordionItem>
    </>
  );

  if (type === 'multiple') {
    return (
      <Accordion type="multiple" defaultValue={defaultValue as string[]}>
        {items}
      </Accordion>
    );
  }

  return (
    <Accordion type="single" collapsible={collapsible} defaultValue={defaultValue as string}>
      {items}
    </Accordion>
  );
}

describe('Accordion', () => {
  it('renders without crashing', () => {
    render(<TestAccordion collapsible />);

    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('single mode: opening one item closes others', async () => {
    const user = userEvent.setup();
    render(<TestAccordion collapsible />);

    await user.click(screen.getByRole('button', { name: /Section 1/ }));
    expect(screen.getByText('Content 1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Section 2/ }));
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
  });

  it('multiple mode: multiple items open simultaneously', async () => {
    const user = userEvent.setup();
    render(<TestAccordion type="multiple" />);

    await user.click(screen.getByRole('button', { name: /Section 1/ }));
    await user.click(screen.getByRole('button', { name: /Section 2/ }));

    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('collapsible single: re-click closes item', async () => {
    const user = userEvent.setup();
    render(<TestAccordion collapsible />);

    await user.click(screen.getByRole('button', { name: /Section 1/ }));
    expect(screen.getByText('Content 1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Section 1/ }));
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
  });

  it('non-collapsible single: re-click keeps item open', async () => {
    const user = userEvent.setup();
    render(<TestAccordion />);

    await user.click(screen.getByRole('button', { name: /Section 1/ }));
    expect(screen.getByText('Content 1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Section 1/ }));
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('content has animation classes', async () => {
    const user = userEvent.setup();
    render(<TestAccordion collapsible />);

    await user.click(screen.getByRole('button', { name: /Section 1/ }));

    const content = document.querySelector('[data-slot="accordion-content"]');
    expect(content?.className).toMatch(/animate-accordion/);
  });

  it('keyboard Enter toggles an item', async () => {
    const user = userEvent.setup();
    render(<TestAccordion collapsible />);

    const trigger = screen.getByRole('button', { name: /Section 1/ });
    trigger.focus();
    await user.keyboard('{Enter}');

    expect(screen.getByText('Content 1')).toBeInTheDocument();

    await user.keyboard('{Enter}');
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
  });

  it('keyboard Space toggles an item', async () => {
    const user = userEvent.setup();
    render(<TestAccordion collapsible />);

    const trigger = screen.getByRole('button', { name: /Section 1/ });
    trigger.focus();
    await user.keyboard(' ');

    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('keyboard ArrowDown moves focus to next trigger', async () => {
    const user = userEvent.setup();
    render(<TestAccordion collapsible />);

    const trigger1 = screen.getByRole('button', { name: /Section 1/ });
    trigger1.focus();
    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('button', { name: /Section 2/ })).toHaveFocus();
  });

  it('keyboard ArrowUp moves focus to previous trigger', async () => {
    const user = userEvent.setup();
    render(<TestAccordion collapsible />);

    const trigger2 = screen.getByRole('button', { name: /Section 2/ });
    trigger2.focus();
    await user.keyboard('{ArrowUp}');

    expect(screen.getByRole('button', { name: /Section 1/ })).toHaveFocus();
  });

  it('defaultValue opens item initially', () => {
    render(<TestAccordion collapsible defaultValue="item-2" />);

    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('data-slot attributes', () => {
    render(<TestAccordion collapsible defaultValue="item-1" />);

    expect(document.querySelector('[data-slot="accordion-item"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="accordion-trigger"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="accordion-content"]')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(
      <TestAccordion
        collapsible
        defaultValue="item-1"
        classNames={{
          item: 'custom-item-class',
          trigger: 'custom-trigger-class',
          content: 'custom-content-class',
        }}
      />,
    );

    expect(document.querySelector('[data-slot="accordion-item"]')).toHaveClass('custom-item-class');
    expect(document.querySelector('[data-slot="accordion-trigger"]')).toHaveClass(
      'custom-trigger-class',
    );
    expect(document.querySelector('[data-slot="accordion-content"]')).toHaveClass(
      'custom-content-class',
    );
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<TestAccordion collapsible />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
