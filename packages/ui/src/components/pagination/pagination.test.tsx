import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination.js';

describe('Pagination', () => {
  it('renders a fully composed pagination', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="/page/1" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="/page/1" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="/page/2">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="/page/3" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );

    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('Pagination renders a nav element with aria-label', () => {
    render(<Pagination>Content</Pagination>);
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'pagination');
  });

  it('PaginationContent renders a ul element', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>Item</PaginationItem>
        </PaginationContent>
      </Pagination>,
    );
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('PaginationItem renders an li element', () => {
    render(
      <PaginationContent>
        <PaginationItem data-testid="item">Item</PaginationItem>
      </PaginationContent>,
    );
    const item = screen.getByTestId('item');
    expect(item.tagName).toBe('LI');
  });

  it('PaginationLink renders as an anchor by default', () => {
    render(<PaginationLink href="/page/2">2</PaginationLink>);
    const link = screen.getByRole('link', { name: '2' });
    expect(link).toHaveAttribute('href', '/page/2');
    expect(link.tagName).toBe('A');
  });

  it('PaginationLink isActive applies active styling and aria-current', () => {
    render(
      <PaginationLink href="/page/1" isActive>
        1
      </PaginationLink>,
    );
    const link = screen.getByRole('link', { name: '1' });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveClass('bg-primary');
  });

  it('PaginationLink renders as child element when asChild', () => {
    render(
      <PaginationLink asChild>
        <span data-testid="custom-link">Custom</span>
      </PaginationLink>,
    );
    const link = screen.getByTestId('custom-link');
    expect(link).toHaveAttribute('data-slot', 'pagination-link');
    expect(link).toHaveClass('inline-flex');
  });

  it('PaginationPrevious has correct aria-label', () => {
    render(<PaginationPrevious href="/page/1" />);
    const previous = screen.getByRole('link', { name: 'Go to previous page' });
    expect(previous).toHaveAttribute('aria-label', 'Go to previous page');
  });

  it('PaginationNext has correct aria-label', () => {
    render(<PaginationNext href="/page/3" />);
    const next = screen.getByRole('link', { name: 'Go to next page' });
    expect(next).toHaveAttribute('aria-label', 'Go to next page');
  });

  it('PaginationPrevious and PaginationNext render chevron icons', () => {
    render(
      <>
        <PaginationPrevious data-testid="previous" href="/page/1" />
        <PaginationNext data-testid="next" href="/page/3" />
      </>,
    );

    expect(screen.getByTestId('previous').querySelector('svg')).toBeInTheDocument();
    expect(screen.getByTestId('next').querySelector('svg')).toBeInTheDocument();
  });

  it('PaginationEllipsis renders with aria-hidden and sr-only text', () => {
    render(<PaginationEllipsis data-testid="ellipsis" />);
    const ellipsis = screen.getByTestId('ellipsis');

    expect(ellipsis).toHaveAttribute('aria-hidden', 'true');
    expect(ellipsis).toHaveTextContent('…');
    expect(screen.getByText('More pages')).toBeInTheDocument();
  });

  it('data-slot attributes are correct on all sub-components', () => {
    render(
      <Pagination data-testid="pagination">
        <PaginationContent data-testid="content">
          <PaginationItem data-testid="item">
            <PaginationLink data-testid="link" href="/page/1">
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious data-testid="previous" href="/page/1" />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext data-testid="next" href="/page/2" />
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis data-testid="ellipsis" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );

    expect(screen.getByTestId('pagination')).toHaveAttribute('data-slot', 'pagination');
    expect(screen.getByTestId('content')).toHaveAttribute('data-slot', 'pagination-content');
    expect(screen.getByTestId('item')).toHaveAttribute('data-slot', 'pagination-item');
    expect(screen.getByTestId('link')).toHaveAttribute('data-slot', 'pagination-link');
    expect(screen.getByTestId('previous')).toHaveAttribute('data-slot', 'pagination-previous');
    expect(screen.getByTestId('next')).toHaveAttribute('data-slot', 'pagination-next');
    expect(screen.getByTestId('ellipsis')).toHaveAttribute('data-slot', 'pagination-ellipsis');
  });

  it('each sub-component merges custom className', () => {
    render(
      <Pagination data-testid="pagination" className="custom-pagination">
        <PaginationContent data-testid="content" className="custom-content">
          <PaginationItem data-testid="item" className="custom-item">
            <PaginationLink data-testid="link" className="custom-link" href="/page/1">
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious data-testid="previous" className="custom-previous" href="/page/1" />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext data-testid="next" className="custom-next" href="/page/2" />
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis data-testid="ellipsis" className="custom-ellipsis" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );

    expect(screen.getByTestId('pagination')).toHaveClass('custom-pagination', 'mx-auto');
    expect(screen.getByTestId('content')).toHaveClass('custom-content', 'flex');
    expect(screen.getByTestId('item')).toHaveClass('custom-item');
    expect(screen.getByTestId('link')).toHaveClass('custom-link', 'inline-flex');
    expect(screen.getByTestId('previous')).toHaveClass('custom-previous', 'gap-1');
    expect(screen.getByTestId('next')).toHaveClass('custom-next', 'gap-1');
    expect(screen.getByTestId('ellipsis')).toHaveClass('custom-ellipsis', 'flex');
  });

  it('fully composed pagination has no accessibility violations', async () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="/page/1" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="/page/1" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="/page/2">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="/page/3" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
