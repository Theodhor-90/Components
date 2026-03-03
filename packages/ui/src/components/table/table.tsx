import { Slot } from '@radix-ui/react-slot';

import { cn } from '../../lib/utils.js';
import {
  tableBodyStyles,
  tableCaptionStyles,
  tableCellStyles,
  tableFooterStyles,
  tableHeaderStyles,
  tableHeadStyles,
  tableRowStyles,
  tableStyles,
} from './table.styles.js';
import type {
  TableBodyProps,
  TableCaptionProps,
  TableCellProps,
  TableFooterProps,
  TableHeaderProps,
  TableHeadProps,
  TableProps,
  TableRowProps,
} from './table.types.js';

export type {
  TableBodyProps,
  TableCaptionProps,
  TableCellProps,
  TableFooterProps,
  TableHeadProps,
  TableHeaderProps,
  TableProps,
  TableRowProps,
} from './table.types.js';

export function Table({
  className,
  asChild = false,
  ref,
  ...props
}: TableProps): React.JSX.Element {
  const Comp = asChild ? Slot : 'table';

  return (
    <div className="relative w-full overflow-auto">
      <Comp data-slot="table" className={cn(tableStyles, className)} ref={ref} {...props} />
    </div>
  );
}

export function TableHeader({
  className,
  asChild = false,
  ref,
  ...props
}: TableHeaderProps): React.JSX.Element {
  const Comp = asChild ? Slot : 'thead';
  return (
    <Comp
      data-slot="table-header"
      className={cn(tableHeaderStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function TableBody({
  className,
  asChild = false,
  ref,
  ...props
}: TableBodyProps): React.JSX.Element {
  const Comp = asChild ? Slot : 'tbody';
  return (
    <Comp data-slot="table-body" className={cn(tableBodyStyles, className)} ref={ref} {...props} />
  );
}

export function TableRow({
  className,
  asChild = false,
  ref,
  ...props
}: TableRowProps): React.JSX.Element {
  const Comp = asChild ? Slot : 'tr';
  return (
    <Comp data-slot="table-row" className={cn(tableRowStyles, className)} ref={ref} {...props} />
  );
}

export function TableHead({
  className,
  asChild = false,
  ref,
  ...props
}: TableHeadProps): React.JSX.Element {
  const Comp = asChild ? Slot : 'th';
  return (
    <Comp data-slot="table-head" className={cn(tableHeadStyles, className)} ref={ref} {...props} />
  );
}

export function TableCell({
  className,
  asChild = false,
  ref,
  ...props
}: TableCellProps): React.JSX.Element {
  const Comp = asChild ? Slot : 'td';
  return (
    <Comp data-slot="table-cell" className={cn(tableCellStyles, className)} ref={ref} {...props} />
  );
}

export function TableCaption({
  className,
  asChild = false,
  ref,
  ...props
}: TableCaptionProps): React.JSX.Element {
  const Comp = asChild ? Slot : 'caption';
  return (
    <Comp
      data-slot="table-caption"
      className={cn(tableCaptionStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function TableFooter({
  className,
  asChild = false,
  ref,
  ...props
}: TableFooterProps): React.JSX.Element {
  const Comp = asChild ? Slot : 'tfoot';
  return (
    <Comp
      data-slot="table-footer"
      className={cn(tableFooterStyles, className)}
      ref={ref}
      {...props}
    />
  );
}
