import { Slot } from '@radix-ui/react-slot';

import { cn } from '../../lib/utils.js';
import { buttonVariants } from '../button/button.styles.js';
import {
  paginationContentStyles,
  paginationItemStyles,
  paginationStyles,
} from './pagination.styles.js';
import type {
  PaginationContentProps,
  PaginationEllipsisProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationNextProps,
  PaginationPreviousProps,
  PaginationProps,
} from './pagination.types.js';

export type {
  PaginationContentProps,
  PaginationEllipsisProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationNextProps,
  PaginationPreviousProps,
  PaginationProps,
} from './pagination.types.js';

export function Pagination({ className, ref, ...props }: PaginationProps): React.JSX.Element {
  return (
    <nav
      data-slot="pagination"
      aria-label="pagination"
      className={cn(paginationStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function PaginationContent({
  className,
  ref,
  ...props
}: PaginationContentProps): React.JSX.Element {
  return (
    <ul
      data-slot="pagination-content"
      className={cn(paginationContentStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function PaginationItem({
  className,
  ref,
  ...props
}: PaginationItemProps): React.JSX.Element {
  return (
    <li
      data-slot="pagination-item"
      className={cn(paginationItemStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function PaginationLink({
  className,
  isActive,
  asChild = false,
  size = 'icon',
  ref,
  ...props
}: PaginationLinkProps): React.JSX.Element {
  const Comp = asChild ? Slot : 'a';
  return (
    <Comp
      data-slot="pagination-link"
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? 'default' : 'outline',
          size,
        }),
        className,
      )}
      ref={ref}
      {...props}
    />
  );
}

export function PaginationPrevious({
  className,
  ref,
  ...props
}: PaginationPreviousProps): React.JSX.Element {
  return (
    <PaginationLink
      data-slot="pagination-previous"
      aria-label="Go to previous page"
      size="default"
      className={cn(
        'gap-1 pl-2.5 aria-disabled:pointer-events-none aria-disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
      <span>Previous</span>
    </PaginationLink>
  );
}

export function PaginationNext({
  className,
  ref,
  ...props
}: PaginationNextProps): React.JSX.Element {
  return (
    <PaginationLink
      data-slot="pagination-next"
      aria-label="Go to next page"
      size="default"
      className={cn(
        'gap-1 pr-2.5 aria-disabled:pointer-events-none aria-disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    >
      <span>Next</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </PaginationLink>
  );
}

export function PaginationEllipsis({
  className,
  ref,
  ...props
}: PaginationEllipsisProps): React.JSX.Element {
  return (
    <span
      data-slot="pagination-ellipsis"
      aria-hidden="true"
      className={cn('flex h-9 w-9 items-center justify-center', className)}
      ref={ref}
      {...props}
    >
      …<span className="sr-only">More pages</span>
    </span>
  );
}
