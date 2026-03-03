import { cva } from 'class-variance-authority';

export const avatarVariants = cva('relative flex shrink-0 overflow-hidden rounded-full', {
  variants: {
    size: {
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-12 w-12 text-base',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const avatarImageStyles = 'aspect-square h-full w-full';

export const avatarFallbackStyles =
  'flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground';
