import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb.js';

describe('Breadcrumb', () => {
  it('renders a fully composed breadcrumb', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Shoes</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Shoes')).toBeInTheDocument();
  });

  it('Breadcrumb renders a nav element with aria-label', () => {
    render(<Breadcrumb>Content</Breadcrumb>);
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'breadcrumb');
  });

  it('BreadcrumbList renders an ol element', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>Item</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('BreadcrumbLink renders as an anchor by default', () => {
    render(<BreadcrumbLink href="/test">Link</BreadcrumbLink>);
    const link = screen.getByRole('link', { name: 'Link' });
    expect(link).toHaveAttribute('href', '/test');
    expect(link.tagName).toBe('A');
  });

  it('BreadcrumbLink renders as child element when asChild', () => {
    render(
      <BreadcrumbLink asChild>
        <span data-testid="custom">Custom</span>
      </BreadcrumbLink>,
    );
    const el = screen.getByTestId('custom');
    expect(el).toHaveAttribute('data-slot', 'breadcrumb-link');
    expect(el.tagName).toBe('SPAN');
  });

  it('BreadcrumbPage has aria-current="page"', () => {
    render(<BreadcrumbPage>Current</BreadcrumbPage>);
    const page = screen.getByText('Current');
    expect(page).toHaveAttribute('aria-current', 'page');
    expect(page).toHaveAttribute('aria-disabled', 'true');
  });

  it('BreadcrumbSeparator renders chevron by default', () => {
    render(<BreadcrumbSeparator data-testid="sep" />);
    const sep = screen.getByTestId('sep');
    expect(sep.querySelector('svg')).toBeInTheDocument();
    expect(sep).toHaveAttribute('aria-hidden', 'true');
  });

  it('BreadcrumbSeparator renders custom children', () => {
    render(<BreadcrumbSeparator data-testid="sep">/</BreadcrumbSeparator>);
    const sep = screen.getByTestId('sep');
    expect(sep).toHaveTextContent('/');
    expect(sep.querySelector('svg')).not.toBeInTheDocument();
  });

  it('BreadcrumbEllipsis renders three-dot icon and sr-only text', () => {
    render(<BreadcrumbEllipsis data-testid="ellipsis" />);
    const el = screen.getByTestId('ellipsis');
    expect(el.querySelector('svg')).toBeInTheDocument();
    expect(screen.getByText('More')).toBeInTheDocument();
  });

  it('data-slot attributes are correct on all sub-components', () => {
    render(
      <Breadcrumb data-testid="breadcrumb">
        <BreadcrumbList data-testid="list">
          <BreadcrumbItem data-testid="item">
            <BreadcrumbLink data-testid="link" href="/">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator data-testid="separator" />
          <BreadcrumbItem>
            <BreadcrumbPage data-testid="page">Current</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbEllipsis data-testid="ellipsis" />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    expect(screen.getByTestId('breadcrumb')).toHaveAttribute('data-slot', 'breadcrumb');
    expect(screen.getByTestId('list')).toHaveAttribute('data-slot', 'breadcrumb-list');
    expect(screen.getByTestId('item')).toHaveAttribute('data-slot', 'breadcrumb-item');
    expect(screen.getByTestId('link')).toHaveAttribute('data-slot', 'breadcrumb-link');
    expect(screen.getByTestId('page')).toHaveAttribute('data-slot', 'breadcrumb-page');
    expect(screen.getByTestId('separator')).toHaveAttribute('data-slot', 'breadcrumb-separator');
    expect(screen.getByTestId('ellipsis')).toHaveAttribute('data-slot', 'breadcrumb-ellipsis');
  });

  it('each sub-component merges custom className', () => {
    render(
      <Breadcrumb data-testid="breadcrumb" className="custom-nav">
        <BreadcrumbList data-testid="list" className="custom-list">
          <BreadcrumbItem data-testid="item" className="custom-item">
            <BreadcrumbLink data-testid="link" className="custom-link" href="/">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator data-testid="separator" className="custom-separator" />
          <BreadcrumbItem>
            <BreadcrumbPage data-testid="page" className="custom-page">
              Current
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbEllipsis data-testid="ellipsis" className="custom-ellipsis" />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    expect(screen.getByTestId('breadcrumb')).toHaveClass('custom-nav');
    expect(screen.getByTestId('list')).toHaveClass('custom-list', 'flex');
    expect(screen.getByTestId('item')).toHaveClass('custom-item', 'inline-flex');
    expect(screen.getByTestId('link')).toHaveClass('custom-link', 'transition-colors');
    expect(screen.getByTestId('page')).toHaveClass('custom-page', 'text-foreground');
    expect(screen.getByTestId('separator')).toHaveClass('custom-separator');
    expect(screen.getByTestId('ellipsis')).toHaveClass('custom-ellipsis', 'flex');
  });

  it('fully composed breadcrumb has no accessibility violations', async () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Shoes</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
