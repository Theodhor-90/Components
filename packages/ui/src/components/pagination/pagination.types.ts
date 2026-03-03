import type { VariantProps } from 'class-variance-authority';

import type { buttonVariants } from '../button/button.styles.js';

export type PaginationProps = React.ComponentProps<'nav'>;

export type PaginationContentProps = React.ComponentProps<'ul'>;

export type PaginationItemProps = React.ComponentProps<'li'>;

export type PaginationLinkProps = React.ComponentProps<'a'> &
  Pick<VariantProps<typeof buttonVariants>, 'size'> & {
    isActive?: boolean;
    asChild?: boolean;
  };

export type PaginationPreviousProps = Omit<PaginationLinkProps, 'children'>;

export type PaginationNextProps = Omit<PaginationLinkProps, 'children'>;

export type PaginationEllipsisProps = React.ComponentProps<'span'>;
