import { cva } from 'class-variance-authority';

export const radioGroupVariants = cva('grid gap-2');

export const radioGroupItemVariants = cva(
  'aspect-square h-4 w-4 rounded-full border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:text-primary',
);
