import { cva } from 'class-variance-authority';

export const headerVariants = cva(
  'flex items-center h-14 w-full shrink-0 gap-4 border-b border-border bg-background px-4',
);
