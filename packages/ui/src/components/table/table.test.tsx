import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table.js';

describe('Table', () => {
  it('Table renders without crashing', () => {
    render(
      <Table>
        <tbody>
          <tr>
            <td>Content</td>
          </tr>
        </tbody>
      </Table>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('TableHeader renders without crashing', () => {
    render(
      <table>
        <TableHeader>
          <tr>
            <th>Header</th>
          </tr>
        </TableHeader>
      </table>,
    );
    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  it('TableBody renders without crashing', () => {
    render(
      <table>
        <TableBody>
          <tr>
            <td>Body</td>
          </tr>
        </TableBody>
      </table>,
    );
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  it('TableRow renders without crashing', () => {
    render(
      <table>
        <tbody>
          <TableRow>
            <td>Row</td>
          </TableRow>
        </tbody>
      </table>,
    );
    expect(screen.getByText('Row')).toBeInTheDocument();
  });

  it('TableHead renders without crashing', () => {
    render(
      <table>
        <thead>
          <tr>
            <TableHead>Head</TableHead>
          </tr>
        </thead>
      </table>,
    );
    expect(screen.getByText('Head')).toBeInTheDocument();
  });

  it('TableCell renders without crashing', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell>Cell</TableCell>
          </tr>
        </tbody>
      </table>,
    );
    expect(screen.getByText('Cell')).toBeInTheDocument();
  });

  it('TableCaption renders without crashing', () => {
    render(
      <table>
        <TableCaption>Caption</TableCaption>
      </table>,
    );
    expect(screen.getByText('Caption')).toBeInTheDocument();
  });

  it('TableFooter renders without crashing', () => {
    render(
      <table>
        <TableFooter>
          <tr>
            <td>Footer</td>
          </tr>
        </TableFooter>
      </table>,
    );
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('renders a fully composed table', () => {
    render(
      <Table data-testid="table">
        <TableCaption data-testid="table-caption">A list of your recent invoices.</TableCaption>
        <TableHeader data-testid="table-header">
          <TableRow data-testid="table-header-row">
            <TableHead data-testid="table-head">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody data-testid="table-body">
          <TableRow data-testid="table-row">
            <TableCell data-testid="table-cell">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>$250.00</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter data-testid="table-footer">
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell>$250.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    expect(screen.getByTestId('table')).toBeInTheDocument();
    expect(screen.getByTestId('table-caption')).toBeInTheDocument();
    expect(screen.getByTestId('table-header')).toBeInTheDocument();
    expect(screen.getByTestId('table-head')).toBeInTheDocument();
    expect(screen.getByTestId('table-body')).toBeInTheDocument();
    expect(screen.getByTestId('table-row')).toBeInTheDocument();
    expect(screen.getByTestId('table-cell')).toBeInTheDocument();
    expect(screen.getByTestId('table-footer')).toBeInTheDocument();
  });

  it('Table has correct data-slot', () => {
    render(
      <Table data-testid="table">
        <tbody>
          <tr>
            <td>Content</td>
          </tr>
        </tbody>
      </Table>,
    );
    expect(screen.getByTestId('table')).toHaveAttribute('data-slot', 'table');
  });

  it('TableHeader has correct data-slot', () => {
    render(
      <table>
        <TableHeader data-testid="table-header">
          <tr>
            <th>Header</th>
          </tr>
        </TableHeader>
      </table>,
    );
    expect(screen.getByTestId('table-header')).toHaveAttribute('data-slot', 'table-header');
  });

  it('TableBody has correct data-slot', () => {
    render(
      <table>
        <TableBody data-testid="table-body">
          <tr>
            <td>Body</td>
          </tr>
        </TableBody>
      </table>,
    );
    expect(screen.getByTestId('table-body')).toHaveAttribute('data-slot', 'table-body');
  });

  it('TableRow has correct data-slot', () => {
    render(
      <table>
        <tbody>
          <TableRow data-testid="table-row">
            <td>Row</td>
          </TableRow>
        </tbody>
      </table>,
    );
    expect(screen.getByTestId('table-row')).toHaveAttribute('data-slot', 'table-row');
  });

  it('TableHead has correct data-slot', () => {
    render(
      <table>
        <thead>
          <tr>
            <TableHead data-testid="table-head">Head</TableHead>
          </tr>
        </thead>
      </table>,
    );
    expect(screen.getByTestId('table-head')).toHaveAttribute('data-slot', 'table-head');
  });

  it('TableCell has correct data-slot', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell data-testid="table-cell">Cell</TableCell>
          </tr>
        </tbody>
      </table>,
    );
    expect(screen.getByTestId('table-cell')).toHaveAttribute('data-slot', 'table-cell');
  });

  it('TableCaption has correct data-slot', () => {
    render(
      <table>
        <TableCaption data-testid="table-caption">Caption</TableCaption>
      </table>,
    );
    expect(screen.getByTestId('table-caption')).toHaveAttribute('data-slot', 'table-caption');
  });

  it('TableFooter has correct data-slot', () => {
    render(
      <table>
        <TableFooter data-testid="table-footer">
          <tr>
            <td>Footer</td>
          </tr>
        </TableFooter>
      </table>,
    );
    expect(screen.getByTestId('table-footer')).toHaveAttribute('data-slot', 'table-footer');
  });

  it('Table applies base styling', () => {
    render(
      <Table data-testid="table">
        <tbody>
          <tr>
            <td>Content</td>
          </tr>
        </tbody>
      </Table>,
    );
    expect(screen.getByTestId('table')).toHaveClass('w-full', 'caption-bottom', 'text-sm');
  });

  it('TableHeader applies base styling', () => {
    render(
      <table>
        <TableHeader data-testid="table-header">
          <tr>
            <th>Header</th>
          </tr>
        </TableHeader>
      </table>,
    );
    expect(screen.getByTestId('table-header')).toHaveClass('[&_tr]:border-b');
  });

  it('TableBody applies base styling', () => {
    render(
      <table>
        <TableBody data-testid="table-body">
          <tr>
            <td>Body</td>
          </tr>
        </TableBody>
      </table>,
    );
    expect(screen.getByTestId('table-body')).toHaveClass('[&_tr:last-child]:border-0');
  });

  it('TableRow applies base styling', () => {
    render(
      <table>
        <tbody>
          <TableRow data-testid="table-row">
            <td>Row</td>
          </TableRow>
        </tbody>
      </table>,
    );
    expect(screen.getByTestId('table-row')).toHaveClass('border-b', 'transition-colors');
  });

  it('TableHead applies base styling', () => {
    render(
      <table>
        <thead>
          <tr>
            <TableHead data-testid="table-head">Head</TableHead>
          </tr>
        </thead>
      </table>,
    );
    expect(screen.getByTestId('table-head')).toHaveClass(
      'h-12',
      'px-4',
      'text-left',
      'align-middle',
      'font-medium',
      'text-muted-foreground',
    );
  });

  it('TableCell applies base styling', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell data-testid="table-cell">Cell</TableCell>
          </tr>
        </tbody>
      </table>,
    );
    expect(screen.getByTestId('table-cell')).toHaveClass('p-4', 'align-middle');
  });

  it('TableCaption applies base styling', () => {
    render(
      <table>
        <TableCaption data-testid="table-caption">Caption</TableCaption>
      </table>,
    );
    expect(screen.getByTestId('table-caption')).toHaveClass(
      'mt-4',
      'text-sm',
      'text-muted-foreground',
    );
  });

  it('TableFooter applies base styling', () => {
    render(
      <table>
        <TableFooter data-testid="table-footer">
          <tr>
            <td>Footer</td>
          </tr>
        </TableFooter>
      </table>,
    );
    expect(screen.getByTestId('table-footer')).toHaveClass('border-t', 'font-medium');
  });

  it('each sub-component merges custom className', () => {
    render(
      <Table data-testid="table" className="custom-class">
        <TableCaption data-testid="table-caption" className="custom-class">
          Caption
        </TableCaption>
        <TableHeader data-testid="table-header" className="custom-class">
          <TableRow data-testid="table-header-row" className="custom-class">
            <TableHead data-testid="table-head" className="custom-class">
              Invoice
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody data-testid="table-body" className="custom-class">
          <TableRow data-testid="table-row" className="custom-class">
            <TableCell data-testid="table-cell" className="custom-class">
              INV001
            </TableCell>
          </TableRow>
        </TableBody>
        <TableFooter data-testid="table-footer" className="custom-class">
          <TableRow>
            <TableCell>Footer</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    expect(screen.getByTestId('table')).toHaveClass('custom-class', 'w-full');
    expect(screen.getByTestId('table-caption')).toHaveClass('custom-class', 'mt-4');
    expect(screen.getByTestId('table-header')).toHaveClass('custom-class', '[&_tr]:border-b');
    expect(screen.getByTestId('table-body')).toHaveClass(
      'custom-class',
      '[&_tr:last-child]:border-0',
    );
    expect(screen.getByTestId('table-row')).toHaveClass('custom-class', 'border-b');
    expect(screen.getByTestId('table-head')).toHaveClass('custom-class', 'h-12');
    expect(screen.getByTestId('table-cell')).toHaveClass('custom-class', 'p-4');
    expect(screen.getByTestId('table-footer')).toHaveClass('custom-class', 'border-t');
  });

  it('Table forwards ref', () => {
    const ref = createRef<HTMLTableElement>();
    render(
      <Table ref={ref}>
        <tbody>
          <tr>
            <td>Content</td>
          </tr>
        </tbody>
      </Table>,
    );

    expect(ref.current).toBeInstanceOf(HTMLTableElement);
    expect(ref.current).toHaveAttribute('data-slot', 'table');
  });

  it('TableRow supports asChild', () => {
    render(
      <table>
        <tbody>
          <TableRow asChild>
            <div data-testid="custom-row">Custom</div>
          </TableRow>
        </tbody>
      </table>,
    );
    const row = screen.getByTestId('custom-row');
    expect(row).toHaveAttribute('data-slot', 'table-row');
    expect(row).toHaveClass('border-b', 'transition-colors');
  });

  it('Table supports asChild', () => {
    render(
      <Table asChild>
        <table data-testid="custom-table">
          <tbody>
            <tr>
              <td>Content</td>
            </tr>
          </tbody>
        </table>
      </Table>,
    );
    const table = screen.getByTestId('custom-table');
    expect(table).toHaveAttribute('data-slot', 'table');
    expect(table).toHaveClass('w-full', 'caption-bottom', 'text-sm');
    expect(table.parentElement).toHaveClass('relative', 'w-full', 'overflow-auto');
  });

  it('TableCell supports asChild', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell asChild>
              <div data-testid="custom-cell">Content</div>
            </TableCell>
          </tr>
        </tbody>
      </table>,
    );
    const cell = screen.getByTestId('custom-cell');
    expect(cell).toHaveAttribute('data-slot', 'table-cell');
    expect(cell).toHaveClass('p-4', 'align-middle');
  });

  it('Table wraps table in overflow container', () => {
    render(
      <Table data-testid="table">
        <tbody>
          <tr>
            <td>Content</td>
          </tr>
        </tbody>
      </Table>,
    );
    const table = screen.getByTestId('table');
    expect(table.parentElement).toHaveClass('overflow-auto');
  });

  it('renders semantic HTML structure', () => {
    const { container } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>INV001</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(container.querySelector('table > thead > tr > th')).toBeInTheDocument();
    expect(container.querySelector('table > tbody > tr > td')).toBeInTheDocument();
  });

  it('fully composed table has no accessibility violations', async () => {
    const { container } = render(
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>$250.00</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell>$250.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
