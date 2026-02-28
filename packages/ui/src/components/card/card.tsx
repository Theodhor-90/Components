import { cn } from '../../lib/utils.js';
import {
  cardContentStyles,
  cardDescriptionStyles,
  cardFooterStyles,
  cardHeaderStyles,
  cardStyles,
  cardTitleStyles,
} from './card.styles.js';
import type {
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardTitleProps,
} from './card.types.js';

export type {
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardTitleProps,
} from './card.types.js';

export function Card({ className, ref, ...props }: CardProps): React.JSX.Element {
  return <div data-slot="card" className={cn(cardStyles, className)} ref={ref} {...props} />;
}

export function CardHeader({ className, ref, ...props }: CardHeaderProps): React.JSX.Element {
  return (
    <div data-slot="card-header" className={cn(cardHeaderStyles, className)} ref={ref} {...props} />
  );
}

export function CardTitle({ className, ref, ...props }: CardTitleProps): React.JSX.Element {
  return (
    <div data-slot="card-title" className={cn(cardTitleStyles, className)} ref={ref} {...props} />
  );
}

export function CardDescription({
  className,
  ref,
  ...props
}: CardDescriptionProps): React.JSX.Element {
  return (
    <div
      data-slot="card-description"
      className={cn(cardDescriptionStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function CardContent({ className, ref, ...props }: CardContentProps): React.JSX.Element {
  return (
    <div
      data-slot="card-content"
      className={cn(cardContentStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function CardFooter({ className, ref, ...props }: CardFooterProps): React.JSX.Element {
  return (
    <div data-slot="card-footer" className={cn(cardFooterStyles, className)} ref={ref} {...props} />
  );
}
