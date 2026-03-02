import { Slot } from '@radix-ui/react-slot';

import { cn } from '../../lib/utils.js';
import {
  breadcrumbEllipsisStyles,
  breadcrumbItemStyles,
  breadcrumbLinkStyles,
  breadcrumbListStyles,
  breadcrumbPageStyles,
  breadcrumbSeparatorStyles,
} from './breadcrumb.styles.js';
import type {
  BreadcrumbEllipsisProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbListProps,
  BreadcrumbPageProps,
  BreadcrumbProps,
  BreadcrumbSeparatorProps,
} from './breadcrumb.types.js';

export type {
  BreadcrumbEllipsisProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbListProps,
  BreadcrumbPageProps,
  BreadcrumbProps,
  BreadcrumbSeparatorProps,
} from './breadcrumb.types.js';

export function Breadcrumb({ ref, ...props }: BreadcrumbProps): React.JSX.Element {
  return <nav data-slot="breadcrumb" aria-label="breadcrumb" ref={ref} {...props} />;
}

export function BreadcrumbList({
  className,
  ref,
  ...props
}: BreadcrumbListProps): React.JSX.Element {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(breadcrumbListStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function BreadcrumbItem({
  className,
  ref,
  ...props
}: BreadcrumbItemProps): React.JSX.Element {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn(breadcrumbItemStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function BreadcrumbLink({
  className,
  asChild = false,
  ref,
  ...props
}: BreadcrumbLinkProps): React.JSX.Element {
  const Comp = asChild ? Slot : 'a';
  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn(breadcrumbLinkStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function BreadcrumbPage({
  className,
  ref,
  ...props
}: BreadcrumbPageProps): React.JSX.Element {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(breadcrumbPageStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function BreadcrumbSeparator({
  className,
  children,
  ref,
  ...props
}: BreadcrumbSeparatorProps): React.JSX.Element {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn(breadcrumbSeparatorStyles, className)}
      ref={ref}
      {...props}
    >
      {children ?? (
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
      )}
    </li>
  );
}

export function BreadcrumbEllipsis({
  className,
  ref,
  ...props
}: BreadcrumbEllipsisProps): React.JSX.Element {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn(breadcrumbEllipsisStyles, className)}
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
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>
      <span className="sr-only">More</span>
    </span>
  );
}
